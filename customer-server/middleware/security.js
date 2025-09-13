const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Rate limiting configurations
const createRateLimiter = (windowMs, max, message, skipSuccessfulRequests = false) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Different rate limits for different endpoints
const rateLimiters = {
  // General API rate limit
  general: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    100, // limit each IP to 100 requests per windowMs
    'Too many requests from this IP, please try again later.'
  ),

  // Strict rate limit for authentication endpoints
  auth: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // limit each IP to 5 requests per windowMs
    'Too many authentication attempts, please try again later.',
    true // skip successful requests
  ),

  // Password reset rate limit
  passwordReset: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    3, // limit each IP to 3 password reset requests per hour
    'Too many password reset attempts, please try again later.'
  ),

  // Registration rate limit
  register: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    3, // limit each IP to 3 registration attempts per hour
    'Too many registration attempts, please try again later.'
  ),

  // Cart operations rate limit
  cart: createRateLimiter(
    1 * 60 * 1000, // 1 minute
    30, // limit each IP to 30 cart operations per minute
    'Too many cart operations, please slow down.'
  ),

  // Order creation rate limit
  order: createRateLimiter(
    5 * 60 * 1000, // 5 minutes
    3, // limit each IP to 3 order attempts per 5 minutes
    'Too many order attempts, please try again later.'
  )
};

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Data sanitization middleware
const sanitizeData = [
  mongoSanitize(), // Prevent NoSQL injection attacks
  xss(), // Clean user input from malicious HTML
  hpp({ // Prevent HTTP Parameter Pollution
    whitelist: ['sort', 'fields', 'page', 'limit', 'category', 'brand', 'price']
  })
];

// JWT Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Get token from cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.id).select('+password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Token is invalid. User not found.'
        });
      }

      // Check if user account is locked
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          error: 'Account is temporarily locked due to too many failed login attempts.'
        });
      }

      // Check if user is verified
      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          error: 'Please verify your email address to access this resource.'
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token has expired. Please login again.'
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: 'Invalid token. Please login again.'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed. Please try again.'
    });
  }
};

// Authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. Please login first.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Optional authentication (for public endpoints that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (user && !user.isLocked && user.isVerified) {
          req.user = user;
        }
      } catch (error) {
        // Silently fail for optional auth
      }
    }

    next();
  } catch (error) {
    next();
  }
};

// IP whitelist middleware for admin operations
const ipWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied from this IP address.'
      });
    }
    
    next();
  };
};

// Request logging middleware for security monitoring
const securityLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log security-relevant information
  const logData = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    referer: req.get('Referer'),
    userId: req.user ? req.user._id : null,
    sessionId: req.sessionID
  };

  // Log suspicious patterns
  const suspiciousPatterns = [
    /\b(union|select|insert|delete|drop|create|alter)\b/i, // SQL injection attempts
    /<script|javascript:|vbscript:|onload|onerror/i, // XSS attempts
    /\.\.\//g, // Path traversal attempts
    /proc\/self\/environ/i, // Environment variable access attempts
  ];

  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(req.originalUrl) || 
    pattern.test(JSON.stringify(req.body)) || 
    pattern.test(JSON.stringify(req.query))
  );

  if (isSuspicious) {
    console.warn('🚨 SUSPICIOUS REQUEST DETECTED:', logData);
  }

  // Continue with request
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    if (res.statusCode >= 400) {
      console.warn('⚠️ ERROR RESPONSE:', {
        ...logData,
        statusCode: res.statusCode,
        duration: `${duration}ms`
      });
    }
  });

  next();
};

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://your-production-domain.com',
      'https://admin.your-production-domain.com'
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Two-factor authentication middleware
const requireTwoFactor = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.'
    });
  }

  if (req.user.twoFactorEnabled && !req.session.twoFactorVerified) {
    return res.status(403).json({
      success: false,
      error: 'Two-factor authentication required.',
      requiresTwoFactor: true
    });
  }

  next();
};

module.exports = {
  rateLimiters,
  securityHeaders,
  sanitizeData,
  authenticate,
  authorize,
  optionalAuth,
  ipWhitelist,
  securityLogger,
  corsOptions,
  requireTwoFactor
};
