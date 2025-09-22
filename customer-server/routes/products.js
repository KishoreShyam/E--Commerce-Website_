const express = require('express');
const { body, query } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getRelatedProducts,
  addProductView,
  getProductReviews
} = require('../controllers/productController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Product creation validation
const productValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required')
];

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

// Admin routes
router.post('/', protect, authorize('admin'), productValidation, validate, createProduct);
router.put('/:id', protect, authorize('admin'), productValidation, validate, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

// Protected routes
router.post('/:id/view', protect, addProductView);

module.exports = router;
