const express = require('express');
const router = express.Router();

// GET /api/orders - Get all orders
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Orders endpoint ready',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
