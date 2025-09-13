const jwt = require('jsonwebtoken');
const axios = require('axios');

// Admin authentication middleware
const protect = async (req, res, next) => {
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

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from customer server
      const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const user = response.data.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'No user found with this token'
        });
      }

      // Check if user is admin
      if (user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to access this route'
        });
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// Super admin authorization
const requireSuperAdmin = (req, res, next) => {
  if (req.user.email !== process.env.DEFAULT_ADMIN_EMAIL) {
    return res.status(403).json({
      success: false,
      message: 'Super admin privileges required'
    });
  }
  next();
};

// Permission-based authorization
const authorize = (...permissions) => {
  return (req, res, next) => {
    // In a real application, you would check user permissions from database
    // For now, all admins have all permissions
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    next();
  };
};

// Rate limiting for sensitive admin operations
const sensitiveOperationLimit = (maxAttempts = 10, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.ip + ':' + req.user.id;
    const now = Date.now();
    
    if (!attempts.has(key)) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const userAttempts = attempts.get(key);
    
    if (now > userAttempts.resetTime) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (userAttempts.count >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Too many attempts. Please try again later.',
        retryAfter: Math.ceil((userAttempts.resetTime - now) / 1000)
      });
    }

    userAttempts.count++;
    next();
  };
};

// Validate super admin key for critical operations
const validateSuperAdminKey = (req, res, next) => {
  const superAdminKey = req.headers['x-super-admin-key'];
  
  if (!superAdminKey || superAdminKey !== process.env.SUPER_ADMIN_KEY) {
    return res.status(403).json({
      success: false,
      message: 'Super admin key required for this operation'
    });
  }
  
  next();
};

module.exports = {
  protect,
  requireSuperAdmin,
  authorize,
  sensitiveOperationLimit,
  validateSuperAdminKey
};
