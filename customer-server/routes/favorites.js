const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  clearFavorites,
  checkFavorite
} = require('../controllers/favoritesController');

// @route   GET /api/favorites
// @desc    Get user's favorites
// @access  Private
router.get('/', auth, getFavorites);

// @route   POST /api/favorites
// @desc    Add product to favorites
// @access  Private
router.post('/', [
  auth,
  body('productId').notEmpty().withMessage('Product ID is required'),
], addFavorite);

// @route   DELETE /api/favorites/:productId
// @desc    Remove product from favorites
// @access  Private
router.delete('/:productId', auth, removeFavorite);

// @route   DELETE /api/favorites
// @desc    Clear all favorites
// @access  Private
router.delete('/', auth, clearFavorites);

// @route   GET /api/favorites/check/:productId
// @desc    Check if product is in favorites
// @access  Private
router.get('/check/:productId', auth, checkFavorite);

module.exports = router;
