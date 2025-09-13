const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    variant: {
      name: String,
      option: String
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  subtotal: {
    type: Number,
    default: 0,
    min: 0
  },
  totalItems: {
    type: Number,
    default: 0,
    min: 0
  },
  appliedCoupons: [{
    code: String,
    discount: Number,
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  }],
  estimatedTax: {
    type: Number,
    default: 0,
    min: 0
  },
  estimatedShipping: {
    type: Number,
    default: 0,
    min: 0
  },
  estimatedTotal: {
    type: Number,
    default: 0,
    min: 0
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // 30 days
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
cartSchema.index({ user: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  this.subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  
  const couponDiscount = this.appliedCoupons.reduce((total, coupon) => {
    if (coupon.type === 'percentage') {
      return total + (this.subtotal * coupon.discount / 100);
    } else {
      return total + coupon.discount;
    }
  }, 0);
  
  this.estimatedTotal = this.subtotal + this.estimatedTax + this.estimatedShipping - couponDiscount;
  this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Reset expiry
  
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity, price, variant) {
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString() &&
    JSON.stringify(item.variant) === JSON.stringify(variant)
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      product: productId,
      quantity,
      price,
      variant,
      addedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity, variant) {
  const item = this.items.find(item => 
    item.product.toString() === productId.toString() &&
    JSON.stringify(item.variant) === JSON.stringify(variant)
  );
  
  if (item) {
    if (quantity <= 0) {
      this.items = this.items.filter(i => i !== item);
    } else {
      item.quantity = quantity;
    }
  }
  
  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId, variant) {
  this.items = this.items.filter(item => 
    !(item.product.toString() === productId.toString() &&
      JSON.stringify(item.variant) === JSON.stringify(variant))
  );
  
  return this.save();
};

// Method to clear cart
cartSchema.methods.clear = function() {
  this.items = [];
  this.appliedCoupons = [];
  return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);
