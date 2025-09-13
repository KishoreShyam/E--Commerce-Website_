const memoryDB = require('../utils/memoryDB');
const { validationResult } = require('express-validator');

// Get user's favorites
const getFavorites = async (req, res) => {
  try {
    const favorites = memoryDB.getUserFavorites(req.user.id);

    res.json({
      success: true,
      favorites: favorites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching favorites'
    });
  }
};

// Add product to favorites
const addFavorite = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { productId } = req.body;
    
    // Get product data from request or create basic structure
    const productData = {
      _id: productId,
      name: req.body.name || 'Unknown Product',
      price: req.body.price || 0,
      category: req.body.category || 'General',
      image: req.body.image || '',
      description: req.body.description || '',
      rating: req.body.rating || 0,
      reviewCount: req.body.reviewCount || 0
    };

    const favorites = memoryDB.addFavorite(req.user.id, productData);

    res.status(201).json({
      success: true,
      message: 'Product added to favorites',
      favorite: productData
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to favorites'
    });
  }
};

// Remove product from favorites
const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    const favorites = memoryDB.removeFavorite(req.user.id, productId);

    res.json({
      success: true,
      message: 'Product removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from favorites'
    });
  }
};

// Clear all favorites
const clearFavorites = async (req, res) => {
  try {
    memoryDB.clearFavorites(req.user.id);

    res.json({
      success: true,
      message: 'All favorites cleared'
    });
  } catch (error) {
    console.error('Clear favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing favorites'
    });
  }
};

// Check if product is in favorites
const checkFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const favorites = memoryDB.getUserFavorites(req.user.id);
    const isFavorite = favorites.some(fav => fav._id === productId);

    res.json({
      success: true,
      isFavorite: isFavorite
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking favorite status'
    });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  clearFavorites,
  checkFavorite
};
