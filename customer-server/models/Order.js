const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a customer']
  },
  items: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    sku: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    variant: {
      name: String,
      option: String
    },
    image: {
      url: String,
      alt: String
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      amount: {
        type: Number,
        default: 0,
        min: 0
      },
      rate: {
        type: Number,
        default: 0,
        min: 0,
        max: 1
      }
    },
    shipping: {
      amount: {
        type: Number,
        default: 0,
        min: 0
      },
      method: String
    },
    discount: {
      amount: {
        type: Number,
        default: 0,
        min: 0
      },
      code: String,
      description: String
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
      'returned'
    ],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: [
      'pending',
      'processing',
      'paid',
      'failed',
      'cancelled',
      'refunded',
      'partially_refunded'
    ],
    default: 'pending'
  },
  paymentMethod: {
    type: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer', 'cash_on_delivery'],
      required: true
    },
    details: {
      last4: String,
      brand: String,
      expiryMonth: Number,
      expiryYear: Number,
      holderName: String
    },
    transactionId: String,
    gatewayResponse: mongoose.Schema.Types.Mixed
  },
  shippingAddress: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    company: String,
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: String,
    instructions: String
  },
  billingAddress: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    company: String,
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: String
  },
  shipping: {
    method: {
      type: String,
      required: true
    },
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: String
    }
  },
  notes: {
    customer: String,
    internal: String
  },
  timeline: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  refunds: [{
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    reason: {
      type: String,
      required: true
    },
    refundId: String,
    processedAt: {
      type: Date,
      default: Date.now
    },
    processedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  returns: [{
    items: [{
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      },
      quantity: Number,
      reason: String,
      condition: {
        type: String,
        enum: ['new', 'used', 'damaged']
      }
    }],
    reason: String,
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'received', 'processed'],
      default: 'requested'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    processedAt: Date,
    processedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  loyaltyPointsEarned: {
    type: Number,
    default: 0
  },
  loyaltyPointsUsed: {
    type: Number,
    default: 0
  },
  source: {
    type: String,
    enum: ['web', 'mobile', 'admin', 'api'],
    default: 'web'
  },
  ipAddress: String,
  userAgent: String,
  referrer: String,
  utm: {
    source: String,
    medium: String,
    campaign: String,
    term: String,
    content: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full customer name
orderSchema.virtual('customerName').get(function() {
  return `${this.shippingAddress.firstName} ${this.shippingAddress.lastName}`;
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order age in days
orderSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for can cancel
orderSchema.virtual('canCancel').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

// Virtual for can return
orderSchema.virtual('canReturn').get(function() {
  return ['delivered'].includes(this.status) && this.ageInDays <= 30;
});

// Indexes for better performance
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ 'shipping.trackingNumber': 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last order of the day
    const lastOrder = await this.constructor.findOne({
      orderNumber: new RegExp(`^LUX${year}${month}${day}`)
    }).sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `LUX${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Pre-save middleware to calculate totals
orderSchema.pre('save', function(next) {
  // Calculate subtotal
  this.pricing.subtotal = this.items.reduce((total, item) => {
    item.subtotal = item.price * item.quantity;
    return total + item.subtotal;
  }, 0);
  
  // Calculate total
  this.pricing.total = this.pricing.subtotal + 
                      this.pricing.tax.amount + 
                      this.pricing.shipping.amount - 
                      this.pricing.discount.amount;
  
  next();
});

// Pre-save middleware to update timeline
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date(),
      note: `Order status changed to ${this.status}`
    });
  }
  next();
});

// Method to add timeline entry
orderSchema.methods.addTimelineEntry = function(status, note, updatedBy) {
  this.timeline.push({
    status,
    note,
    updatedBy,
    timestamp: new Date()
  });
  return this.save();
};

// Method to update status
orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  const validTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered', 'returned'],
    delivered: ['returned'],
    cancelled: [],
    refunded: [],
    returned: ['refunded']
  };
  
  if (!validTransitions[this.status].includes(newStatus)) {
    throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
  }
  
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    note: note || `Order status changed to ${newStatus}`,
    updatedBy,
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to process refund
orderSchema.methods.processRefund = function(amount, reason, refundId, processedBy) {
  this.refunds.push({
    amount,
    reason,
    refundId,
    processedBy,
    processedAt: new Date()
  });
  
  const totalRefunded = this.refunds.reduce((total, refund) => total + refund.amount, 0);
  
  if (totalRefunded >= this.pricing.total) {
    this.paymentStatus = 'refunded';
    this.status = 'refunded';
  } else {
    this.paymentStatus = 'partially_refunded';
  }
  
  return this.save();
};

// Method to calculate refundable amount
orderSchema.methods.getRefundableAmount = function() {
  const totalRefunded = this.refunds.reduce((total, refund) => total + refund.amount, 0);
  return Math.max(0, this.pricing.total - totalRefunded);
};

// Method to check if order can be modified
orderSchema.methods.canModify = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

// Static method to get order statistics
orderSchema.statics.getStatistics = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        averageOrderValue: { $avg: '$pricing.total' },
        totalItems: { $sum: { $sum: '$items.quantity' } }
      }
    }
  ]);
};

module.exports = mongoose.model('Order', orderSchema);
