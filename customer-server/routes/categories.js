const express = require('express');
const router = express.Router();

// Mock categories data
const categories = [
  { _id: '1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets' },
  { _id: '2', name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel' },
  { _id: '3', name: 'Home & Garden', slug: 'home-garden', description: 'Home improvement and garden supplies' },
  { _id: '4', name: 'Sports', slug: 'sports', description: 'Sports equipment and accessories' },
  { _id: '5', name: 'Books', slug: 'books', description: 'Books and educational materials' }
];

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', (req, res) => {
  const category = categories.find(cat => cat._id === req.params.id || cat.slug === req.params.id);
  
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

module.exports = router;
