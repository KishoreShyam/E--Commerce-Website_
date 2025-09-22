const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Product validation
const productValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),
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

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  getProducts(req, res);
});

// GET /api/products/stats - Get product statistics
router.get('/stats', getProductStats);

// GET /api/products/:id - Get single product
router.get('/:id', getProduct);

// POST /api/products - Create new product
router.post('/', productValidation, validate, createProduct);

// PUT /api/products/:id - Update product
router.put('/:id', productValidation, validate, updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', deleteProduct);

module.exports = router;
