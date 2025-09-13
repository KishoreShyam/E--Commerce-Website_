const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Upload endpoint ready'
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
