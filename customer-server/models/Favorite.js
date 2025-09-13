const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productData: {
    _id: String,
    name: String,
    description: String,
    price: Number,
    originalPrice: Number,
    category: String,
    rating: Number,
    reviewCount: Number,
    image: String,
    badge: String,
    inStock: Boolean
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate favorites
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
