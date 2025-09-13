const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price images inventory status');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id });
    }

    // Filter out inactive products and update prices
    cart.items = cart.items.filter(item => {
      if (!item.product || item.product.status !== 'active') {
        return false;
      }
      // Update price to current product price
      item.price = item.product.discountedPrice || item.product.price;
      return true;
    });

    await cart.save();

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, variant } = req.body;

    // Check if product exists and is available
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Product is not available'
      });
    }

    if (!product.isAvailable(quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id });
    }

    // Add item to cart
    const price = product.discountedPrice || product.price;
    await cart.addItem(productId, quantity, price, variant);

    // Populate cart items
    await cart.populate('items.product', 'name price images inventory status');

    // Emit real-time cart update
    if (req.app.get('io')) {
      req.app.get('io').emitToUser(req.user.id, 'cart:updated', {
        action: 'add',
        item: {
          product: product,
          quantity,
          variant
        },
        cart: {
          totalItems: cart.totalItems,
          subtotal: cart.subtotal
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/item/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity, variant } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    if (quantity > 0) {
      // Check product availability
      const product = await Product.findById(productId);
      if (!product || !product.isAvailable(quantity)) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock'
        });
      }
    }

    await cart.updateItemQuantity(productId, quantity, variant);
    await cart.populate('items.product', 'name price images inventory status');

    // Emit real-time cart update
    if (req.app.get('io')) {
      req.app.get('io').emitToUser(req.user.id, 'cart:updated', {
        action: 'update',
        productId,
        quantity,
        cart: {
          totalItems: cart.totalItems,
          subtotal: cart.subtotal
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/item/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { variant } = req.query;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.removeItem(productId, variant ? JSON.parse(variant) : undefined);
    await cart.populate('items.product', 'name price images inventory status');

    // Emit real-time cart update
    if (req.app.get('io')) {
      req.app.get('io').emitToUser(req.user.id, 'cart:updated', {
        action: 'remove',
        productId,
        cart: {
          totalItems: cart.totalItems,
          subtotal: cart.subtotal
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.clear();

    // Emit real-time cart update
    if (req.app.get('io')) {
      req.app.get('io').emitToUser(req.user.id, 'cart:updated', {
        action: 'clear',
        cart: {
          totalItems: 0,
          subtotal: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // In a real application, you would validate the coupon against a Coupon model
    // For now, we'll simulate some basic coupons
    const coupons = {
      'WELCOME10': { type: 'percentage', discount: 10, minAmount: 50 },
      'SAVE20': { type: 'percentage', discount: 20, minAmount: 100 },
      'FLAT15': { type: 'fixed', discount: 15, minAmount: 75 }
    };

    const coupon = coupons[code.toUpperCase()];
    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    if (cart.subtotal < coupon.minAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of $${coupon.minAmount} required for this coupon`
      });
    }

    // Check if coupon already applied
    const existingCoupon = cart.appliedCoupons.find(c => c.code === code.toUpperCase());
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Coupon already applied'
      });
    }

    // Apply coupon
    cart.appliedCoupons.push({
      code: code.toUpperCase(),
      discount: coupon.discount,
      type: coupon.type
    });

    await cart.save();
    await cart.populate('items.product', 'name price images inventory status');

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon/:code
// @access  Private
const removeCoupon = async (req, res, next) => {
  try {
    const { code } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.appliedCoupons = cart.appliedCoupons.filter(c => c.code !== code.toUpperCase());
    await cart.save();
    await cart.populate('items.product', 'name price images inventory status');

    res.status(200).json({
      success: true,
      message: 'Coupon removed',
      cart
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon
};
