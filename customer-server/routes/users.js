const express = require('express');
const { body } = require('express-validator');
const {
  getProfile,
  updateProfile,
  deleteAccount,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getOrderHistory
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', [
  body('firstName').optional().trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').optional().trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number')
], validate, updateProfile);
router.delete('/account', deleteAccount);

// Wishlist routes
router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

// Order history
router.get('/orders', getOrderHistory);

module.exports = router;
