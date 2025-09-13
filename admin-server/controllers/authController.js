const axios = require('axios');

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Admin login attempt for:', email);

    // Forward login request to customer server
    const response = await axios.post(`${process.env.CUSTOMER_SERVER_URL || 'http://localhost:5000'}/api/auth/login`, {
      email,
      password
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { user, token } = response.data;

    console.log('👤 User authenticated:', user.email, 'Role:', user.role);

    // Check if user is admin (for now, accept any user as admin for testing)
    // In production, you'd strictly check user.role === 'admin'
    if (user.role !== 'admin') {
      console.log('⚠️ Non-admin user attempting admin login, allowing for development');
      // For development, we'll allow any user to access admin
      user.role = 'admin';
    }

    // Set cookie
    const cookieOptions = {
      expires: new Date(
        Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.cookie('token', token, cookieOptions);

    console.log('✅ Admin login successful for:', user.email);

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: 'admin', // Force admin role for development
        avatar: user.avatar,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('❌ Admin login error:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data.message || 'Login failed'
      });
    } else if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'Customer server is not running. Please start the customer server first.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Admin login failed. Please ensure the customer server is running.'
    });
  }
};

// @desc    Admin logout
// @route   POST /api/auth/logout
// @access  Public
const adminLogout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Admin logout successful'
  });
};

// @desc    Get admin profile
// @route   GET /api/auth/profile
// @access  Private
const getAdminProfile = async (req, res, next) => {
  try {
    // For development, return a mock admin profile
    res.status(200).json({
      success: true,
      user: {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@luxecommerce.com',
        role: 'admin',
        avatar: 'https://res.cloudinary.com/luxecommerce/image/upload/v1/avatars/default-avatar.png',
        lastLogin: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin profile
// @route   PUT /api/auth/profile
// @access  Private
const updateAdminProfile = async (req, res, next) => {
  try {
    const { firstName, lastName } = req.body;

    // Forward update request to customer server
    try {
      const response = await axios.put(`${process.env.CUSTOMER_SERVER_URL || 'http://localhost:5000'}/api/auth/update-profile`, {
        firstName,
        lastName
      }, {
        headers: {
          Authorization: req.headers.authorization
        },
        timeout: 10000
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: response.data.user
      });
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json({
          success: false,
          message: error.response.data.message || 'Profile update failed'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Admin profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Profile update failed. Please try again.'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Forward password change request to customer server
    try {
      const response = await axios.put(`${process.env.CUSTOMER_SERVER_URL || 'http://localhost:5000'}/api/auth/update-password`, {
        currentPassword,
        newPassword
      }, {
        headers: {
          Authorization: req.headers.authorization
        },
        timeout: 10000
      });

      // Update cookie with new token
      const cookieOptions = {
        expires: new Date(
          Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      };

      res.cookie('token', response.data.token, cookieOptions);

      res.status(200).json({
        success: true,
        message: 'Password updated successfully',
        token: response.data.token
      });
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json({
          success: false,
          message: error.response.data.message || 'Password change failed'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Admin password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Password change failed. Please try again.'
    });
  }
};

// @desc    Create new admin
// @route   POST /api/auth/create-admin
// @access  Private (Super Admin only)
const createAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Forward admin creation request to customer server
    try {
      const response = await axios.post(`${process.env.CUSTOMER_SERVER_URL || 'http://localhost:5000'}/api/auth/register`, {
        firstName,
        lastName,
        email,
        password,
        role: 'admin'
      }, {
        headers: {
          Authorization: req.headers.authorization
        },
        timeout: 10000
      });

      res.status(201).json({
        success: true,
        message: 'Admin created successfully',
        user: response.data.user
      });
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json({
          success: false,
          message: error.response.data.message || 'Admin creation failed'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin creation failed. Please try again.'
    });
  }
};

// @desc    Get all admin users
// @route   GET /api/auth/admins
// @access  Private (Super Admin only)
const getAdminUsers = async (req, res, next) => {
  try {
    // For development, return mock admin users
    res.status(200).json({
      success: true,
      admins: [
        {
          id: '1',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@luxecommerce.com',
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ]
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin users'
    });
  }
};

// @desc    Update admin status
// @route   PUT /api/auth/admin/:id/status
// @access  Private (Super Admin only)
const updateAdminStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    // For development, just return success
    res.status(200).json({
      success: true,
      message: 'Admin status updated successfully'
    });
  } catch (error) {
    console.error('Update admin status error:', error);
    res.status(500).json({
      success: false,
      message: 'Status update failed'
    });
  }
};

module.exports = {
  adminLogin,
  adminLogout,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
  createAdmin,
  getAdminUsers,
  updateAdminStatus
};