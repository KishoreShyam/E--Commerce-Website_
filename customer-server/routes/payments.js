const express = require('express');
const { body } = require('express-validator');
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Payment intent routes
router.post('/create-intent', [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('currency').optional().isIn(['usd', 'eur', 'gbp']).withMessage('Invalid currency')
], validate, createPaymentIntent);

router.post('/confirm', [
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required')
], validate, confirmPayment);

// Payment methods
router.get('/methods', getPaymentMethods);
router.post('/methods', [
  body('type').isIn(['card', 'paypal']).withMessage('Invalid payment method type'),
  body('details').isObject().withMessage('Payment method details are required')
], validate, addPaymentMethod);
router.delete('/methods/:id', deletePaymentMethod);

module.exports = router;
