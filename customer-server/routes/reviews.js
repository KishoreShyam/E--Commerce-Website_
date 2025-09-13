const express = require('express');
const { body, query } = require('express-validator');
const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  getReviewStats
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
];

// Public routes
router.get('/product/:productId', getReviews);
router.get('/product/:productId/stats', getReviewStats);

// Protected routes
router.use(protect);
router.post('/product/:productId', reviewValidation, validate, createReview);
router.put('/:id', reviewValidation, validate, updateReview);
router.delete('/:id', deleteReview);

module.exports = router;
