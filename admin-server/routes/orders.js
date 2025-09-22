const express = require('express');
const router = express.Router();

const {
  getOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Order status validation
const orderStatusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters')
];

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// GET /api/orders - Get all orders
router.get('/', async (req, res) => {
  getOrders(req, res);
});

// GET /api/orders/stats - Get order statistics
router.get('/stats', getOrderStats);

// GET /api/orders/:id - Get single order
router.get('/:id', getOrder);

// PUT /api/orders/:id - Update order status
router.put('/:id', orderStatusValidation, validate, updateOrderStatus);
module.exports = router;
