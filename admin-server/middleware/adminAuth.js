const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

// Admin-only rate limiting
const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs for admin operations
  message: {
    success: false,
    error: 'Too many admin requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict admin authentication
const authenticateAdmin = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Get token from cookies
    else if (req.cookies.adminToken) {
      token = req.cookies.adminToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. Admin authentication required.'
      });
    }

    try {
      // Verify admin token
      const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET);
      
      // Verify with customer server that this is a valid admin
      const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL}/api/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Admin-Server': 'true',
          'X-Server-Secret': process.env.INTER_SERVER_SECRET
        },
        timeout: 5000
      });

      if (!response.data.success || response.data.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied. Admin privileges required.'
        });
      }

      req.admin = response.data.user;
      req.adminToken = token;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Admin session expired. Please login again.'
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: 'Invalid admin token. Please login again.'
        });
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        return res.status(503).json({
          success: false,
          error: 'Customer server unavailable. Please try again later.'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Admin authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed. Please try again.'
    });
  }
};

// Super admin authorization (for critical operations)
const requireSuperAdmin = async (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      error: 'Admin authentication required.'
    });
  }

  // Check if user has super admin privileges
  if (req.admin.role !== 'admin' || !req.admin.permissions?.includes('super_admin')) {
    return res.status(403).json({
      success: false,
      error: 'Super admin privileges required for this operation.'
    });
  }

  next();
};

// IP whitelist for admin access
const adminIPWhitelist = (req, res, next) => {
  const allowedIPs = process.env.ADMIN_ALLOWED_IPS?.split(',') || [];
  
  if (allowedIPs.length > 0) {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    if (!allowedIPs.includes(clientIP)) {
      console.warn(`🚨 Unauthorized admin access attempt from IP: ${clientIP}`);
      return res.status(403).json({
        success: false,
        error: 'Admin access not allowed from this IP address.'
      });
    }
  }
  
  next();
};

// Secure customer server communication
const authenticateInterServer = (req, res, next) => {
  const serverSecret = req.headers['x-server-secret'];
  const serverIdentity = req.headers['x-server-identity'];
  
  if (!serverSecret || serverSecret !== process.env.INTER_SERVER_SECRET) {
    return res.status(401).json({
      success: false,
      error: 'Invalid server authentication.'
    });
  }
  
  if (!serverIdentity || !['customer-server', 'admin-server'].includes(serverIdentity)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid server identity.'
    });
  }
  
  req.serverIdentity = serverIdentity;
  next();
};

// Customer server API proxy with authentication
const createCustomerServerProxy = (endpoint) => {
  return async (req, res, next) => {
    try {
      const config = {
        method: req.method,
        url: `${process.env.CUSTOMER_SERVER_URL}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${req.adminToken}`,
          'X-Admin-Server': 'true',
          'X-Server-Secret': process.env.INTER_SERVER_SECRET,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      };

      if (req.body && Object.keys(req.body).length > 0) {
        config.data = req.body;
      }

      if (req.query && Object.keys(req.query).length > 0) {
        config.params = req.query;
      }

      const response = await axios(config);
      
      // Forward the response
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Customer server proxy error:', error.message);
      
      if (error.response) {
        // Forward error response from customer server
        res.status(error.response.status).json(error.response.data);
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        res.status(503).json({
          success: false,
          error: 'Customer server unavailable. Please try again later.'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error occurred while processing request.'
        });
      }
    }
  };
};

// Admin activity logging
const logAdminActivity = (action) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log admin activity
      const logData = {
        timestamp: new Date().toISOString(),
        adminId: req.admin?._id,
        adminEmail: req.admin?.email,
        action,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        statusCode: res.statusCode,
        success: res.statusCode < 400
      };

      // Log to console (in production, this should go to a proper logging service)
      if (res.statusCode >= 400) {
        console.error('🚨 ADMIN ERROR:', logData);
      } else {
        console.log('📝 ADMIN ACTION:', logData);
      }

      // Call original send
      originalSend.call(this, data);
    };

    next();
  };
};

// Session validation middleware
const validateAdminSession = async (req, res, next) => {
  if (!req.admin) {
    return next();
  }

  try {
    // Check if admin session is still valid on customer server
    const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL}/api/admin/session/validate`, {
      headers: {
        'Authorization': `Bearer ${req.adminToken}`,
        'X-Server-Secret': process.env.INTER_SERVER_SECRET
      },
      timeout: 5000
    });

    if (!response.data.success) {
      return res.status(401).json({
        success: false,
        error: 'Admin session is no longer valid. Please login again.'
      });
    }

    // Update admin data if needed
    req.admin = { ...req.admin, ...response.data.updates };
    next();
  } catch (error) {
    console.error('Session validation error:', error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        error: 'Admin session expired. Please login again.'
      });
    }
    
    // Continue if customer server is unavailable (graceful degradation)
    next();
  }
};

// Two-factor authentication for critical admin operations
const requireAdminTwoFactor = async (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      error: 'Admin authentication required.'
    });
  }

  // Check if 2FA is enabled and verified for this session
  if (req.admin.twoFactorEnabled && !req.session?.adminTwoFactorVerified) {
    return res.status(403).json({
      success: false,
      error: 'Two-factor authentication required for this operation.',
      requiresTwoFactor: true
    });
  }

  next();
};

module.exports = {
  adminRateLimit,
  authenticateAdmin,
  requireSuperAdmin,
  adminIPWhitelist,
  authenticateInterServer,
  createCustomerServerProxy,
  logAdminActivity,
  validateAdminSession,
  requireAdminTwoFactor
};
