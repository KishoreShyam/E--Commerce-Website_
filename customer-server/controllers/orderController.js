const fileDB = require('../utils/fileDB');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      pricing
    } = req.body;

    const order = fileDB.createOrder({
      customer: req.user.id,
      customerInfo: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email
      },
      items,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      pricing: pricing || {
        subtotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        tax: 0,
        shipping: 0,
        total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }
    });

    // Emit real-time update to admin server
    if (req.app.get('io')) {
      req.app.get('io').emit('order:created', {
        order,
        timestamp: new Date()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    const orders = fileDB.getUserOrders(req.user.id);
    const total = orders.length;

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/all
// @access  Private (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = fileDB.getOrders();
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res, next) => {
  try {
    const order = fileDB.getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if user owns the order or is admin
    if (order.customer !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Admin only)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    
    const order = fileDB.updateOrder(req.params.id, {
      status,
      note,
      updatedBy: req.user.id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Emit real-time update to customer
    if (req.app.get('io')) {
      req.app.get('io').emit('order:updated', {
        orderId: order._id,
        status: order.status,
        note,
        timestamp: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const order = fileDB.getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check ownership
    if (order.customer !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    const updatedOrder = fileDB.updateOrder(req.params.id, {
      status: 'cancelled',
      cancelledBy: req.user.id,
      cancelledAt: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
};
