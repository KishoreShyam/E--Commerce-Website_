const express = require('express');
const { body, query } = require('express-validator');
const {
  getProducts,
  getProduct,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getRelatedProducts,
  addProductView,
  getProductReviews
} = require('../controllers/productController');
const { protect, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const searchValidation = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  query('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  query('sort')
    .optional()
    .isIn(['price', '-price', 'rating', '-rating', 'name', '-name', 'createdAt', '-createdAt'])
    .withMessage('Invalid sort option'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];

// Public routes
router.get('/', searchValidation, validate, optionalAuth, getProducts);
router.get('/search', searchValidation, validate, optionalAuth, searchProducts);
router.get('/featured', optionalAuth, getFeaturedProducts);
router.get('/category/:categoryId', optionalAuth, getProductsByCategory);
router.get('/:id', optionalAuth, getProduct);
router.get('/:id/related', optionalAuth, getRelatedProducts);
router.get('/:id/reviews', getProductReviews);

// Protected routes
router.post('/:id/view', protect, addProductView);

module.exports = router;
