const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  subcategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  },
  brand: {
    type: String,
    required: [true, 'Product brand is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'Product SKU is required'],
    unique: true,
    uppercase: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  variants: [{
    name: {
      type: String,
      required: true
    },
    options: [{
      name: {
        type: String,
        required: true
      },
      value: {
        type: String,
        required: true
      },
      priceAdjustment: {
        type: Number,
        default: 0
      },
      sku: String,
      stock: {
        type: Number,
        default: 0,
        min: 0
      },
      image: {
        public_id: String,
        url: String
      }
    }]
  }],
  specifications: [{
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    group: String
  }],
  inventory: {
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    trackQuantity: {
      type: Boolean,
      default: true
    },
    allowBackorder: {
      type: Boolean,
      default: false
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ['kg', 'lb', 'g', 'oz'],
        default: 'kg'
      }
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['cm', 'in', 'm', 'ft'],
        default: 'cm'
      }
    }
  },
  shipping: {
    free: {
      type: Boolean,
      default: false
    },
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    shippingClass: {
      type: String,
      enum: ['standard', 'heavy', 'fragile', 'digital'],
      default: 'standard'
    }
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  reviews: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Review'
  }],
  relatedProducts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  crossSells: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  upSells: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    purchases: {
      type: Number,
      default: 0
    },
    addedToCart: {
      type: Number,
      default: 0
    },
    addedToWishlist: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    }
  },
  discounts: [{
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 0
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  const activeDiscount = this.discounts.find(discount => 
    discount.isActive && 
    new Date() >= discount.startDate && 
    new Date() <= discount.endDate
  );
  
  if (activeDiscount) {
    if (activeDiscount.type === 'percentage') {
      return this.price - (this.price * activeDiscount.value / 100);
    } else {
      return Math.max(0, this.price - activeDiscount.value);
    }
  }
  
  return this.price;
});

// Virtual for savings amount
productSchema.virtual('savings').get(function() {
  return this.price - this.discountedPrice;
});

// Virtual for savings percentage
productSchema.virtual('savingsPercentage').get(function() {
  if (this.savings > 0) {
    return Math.round((this.savings / this.price) * 100);
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (!this.inventory.trackQuantity) return 'in-stock';
  if (this.inventory.stock === 0) return 'out-of-stock';
  if (this.inventory.stock <= this.inventory.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

// Virtual for main image
productSchema.virtual('mainImage').get(function() {
  const mainImg = this.images.find(img => img.isMain);
  return mainImg || this.images[0];
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ featured: 1, status: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ status: 1, featured: -1, 'rating.average': -1 });

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Pre-save middleware to ensure only one main image
productSchema.pre('save', function(next) {
  if (this.isModified('images')) {
    const mainImages = this.images.filter(img => img.isMain);
    if (mainImages.length > 1) {
      // Keep only the first one as main
      this.images.forEach((img, index) => {
        img.isMain = index === 0 && img.isMain;
      });
    } else if (mainImages.length === 0 && this.images.length > 0) {
      // Set first image as main if none is set
      this.images[0].isMain = true;
    }
  }
  next();
});

// Method to update rating
productSchema.methods.updateRating = function() {
  const totalRating = Object.keys(this.rating.distribution).reduce((sum, star) => {
    return sum + (parseInt(star) * this.rating.distribution[star]);
  }, 0);
  
  this.rating.count = Object.values(this.rating.distribution).reduce((sum, count) => sum + count, 0);
  this.rating.average = this.rating.count > 0 ? totalRating / this.rating.count : 0;
  
  return this.save();
};

// Method to increment view count
productSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  return this.save();
};

// Method to increment purchase count
productSchema.methods.incrementPurchases = function(quantity = 1) {
  this.analytics.purchases += quantity;
  this.analytics.conversionRate = this.analytics.views > 0 
    ? (this.analytics.purchases / this.analytics.views) * 100 
    : 0;
  return this.save();
};

// Method to check if product is available
productSchema.methods.isAvailable = function(quantity = 1) {
  if (this.status !== 'active') return false;
  if (!this.inventory.trackQuantity) return true;
  if (this.inventory.allowBackorder) return true;
  return this.inventory.stock >= quantity;
};

// Method to reserve stock
productSchema.methods.reserveStock = function(quantity) {
  if (!this.isAvailable(quantity)) {
    throw new Error('Insufficient stock');
  }
  
  if (this.inventory.trackQuantity) {
    this.inventory.stock -= quantity;
  }
  
  return this.save();
};

// Method to release stock
productSchema.methods.releaseStock = function(quantity) {
  if (this.inventory.trackQuantity) {
    this.inventory.stock += quantity;
  }
  
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);
