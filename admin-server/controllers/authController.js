const axios = require('axios');

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Forward login request to customer server
    const response = await axios.post(`${process.env.CUSTOMER_SERVER_URL}/api/auth/login`, {
      email,
      password
    });

    const { user, token } = response.data;

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
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

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data.message || 'Login failed'
      });
    }
    next(error);
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
    res.status(200).json({
      success: true,
      user: req.user
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
    const response = await axios.put(`${process.env.CUSTOMER_SERVER_URL}/api/auth/update-profile`, {
      firstName,
      lastName
    }, {
      headers: {
        Authorization: req.headers.authorization
      }
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
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Forward password change request to customer server
    const response = await axios.put(`${process.env.CUSTOMER_SERVER_URL}/api/auth/update-password`, {
      currentPassword,
      newPassword
    }, {
      headers: {
        Authorization: req.headers.authorization
      }
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
    next(error);
  }
};

// @desc    Create new admin
// @route   POST /api/auth/create-admin
// @access  Private (Super Admin only)
const createAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, permissions } = req.body;

    // Forward admin creation request to customer server
    const response = await axios.post(`${process.env.CUSTOMER_SERVER_URL}/api/auth/register`, {
      firstName,
      lastName,
      email,
      password,
      role: 'admin'
    }, {
      headers: {
        Authorization: req.headers.authorization
      }
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
    next(error);
  }
};

// @desc    Get all admin users
// @route   GET /api/auth/admins
// @access  Private (Super Admin only)
const getAdminUsers = async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL}/api/users`, {
      headers: {
        Authorization: req.headers.authorization
      },
      params: {
        role: 'admin',
        ...req.query
      }
    });

    res.status(200).json({
      success: true,
      admins: response.data.users || []
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data.message || 'Failed to fetch admin users'
      });
    }
    next(error);
  }
};

// @desc    Update admin status
// @route   PUT /api/auth/admin/:id/status
// @access  Private (Super Admin only)
const updateAdminStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    // Forward status update request to customer server
    const response = await axios.put(`${process.env.CUSTOMER_SERVER_URL}/api/users/${id}/status`, {
      status,
      reason
    }, {
      headers: {
        Authorization: req.headers.authorization
      }
    });

    // Emit real-time notification to affected admin
    if (req.app.get('io')) {
      req.app.get('io').notifyAdmin(id, 'account:status_changed', {
        status,
        reason,
        updatedBy: req.user.email,
        timestamp: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin status updated successfully',
      user: response.data.user
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data.message || 'Status update failed'
      });
    }
    next(error);
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
