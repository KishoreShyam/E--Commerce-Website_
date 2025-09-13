const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Admin login endpoint - forwards to customer server
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Forward login request to customer server
    const response = await axios.post(`${process.env.CUSTOMER_SERVER_URL || 'http://localhost:5000'}/api/auth/login`, {
      email,
      password
    });

    const { user, token } = response.data;

    // Check if user is admin (for now, accept any user as admin for testing)
    // In production, you'd check user.role === 'admin'

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: 'admin', // Force admin role for testing
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
    res.status(500).json({
      success: false,
      message: 'Admin login failed'
    });
  }
});

// Admin logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin logout successful'
  });
});

// Get admin profile endpoint
app.get('/api/auth/profile', (req, res) => {
  // For testing, return a mock admin profile
  res.status(200).json({
    success: true,
    user: {
      id: 1,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@luxecommerce.com',
      role: 'admin'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Admin server is running'
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'LuxeCommerce Admin API',
    endpoints: {
      login: 'POST /api/auth/login',
      logout: 'POST /api/auth/logout',
      profile: 'GET /api/auth/profile',
      health: 'GET /health'
    }
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Admin Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
