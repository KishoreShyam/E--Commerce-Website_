const express = require('express');
const { body, query } = require('express-validator');
const {
  createOrder,
  getOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const createOrderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.id')
    .notEmpty()
    .withMessage('Product ID is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('shippingAddress.address')
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.zipCode')
    .notEmpty()
    .withMessage('ZIP code is required'),
  body('paymentMethod')
    .notEmpty()
    .withMessage('Invalid payment method')
];

// Protected routes
router.use(protect);

router.post('/', createOrderValidation, validate, createOrder);
router.get('/', getOrders);
router.get('/all', authorize('admin'), getAllOrders);
router.get('/:id', getOrder);
router.put('/:id', authorize('admin'), updateOrderStatus);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
