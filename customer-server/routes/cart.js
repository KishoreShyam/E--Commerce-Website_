const express = require('express');
const { body } = require('express-validator');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const addToCartValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),
  body('variant')
    .optional()
    .isObject()
    .withMessage('Variant must be an object')
];

const updateCartValidation = [
  body('quantity')
    .isInt({ min: 0, max: 100 })
    .withMessage('Quantity must be between 0 and 100')
];

const couponValidation = [
  body('code')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Coupon code must be between 3 and 20 characters')
];

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCartValidation, validate, addToCart);
router.put('/item/:productId', updateCartValidation, validate, updateCartItem);
router.delete('/item/:productId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/coupon', couponValidation, validate, applyCoupon);
router.delete('/coupon/:code', removeCoupon);

module.exports = router;
