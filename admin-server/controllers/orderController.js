const axios = require('axios');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin)
const getOrders = async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL || 'http://localhost:5000'}/api/orders/all`, {
      headers: {
        Authorization: req.headers.authorization
      },
      params: req.query
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Get orders error:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders from customer server'
      });
    }
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private (Admin)
const getOrder = async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL || 'http://localhost:5000'}/api/orders/${req.params.id}`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Get order error:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order from customer server'
      });
    }
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    console.log('📝 Admin updating order status:', req.params.id, 'to', req.body.status);
    
    const response = await axios.put(`${process.env.CUSTOMER_SERVER_URL || 'http://localhost:5000'}/api/orders/${req.params.id}`, req.body, {
      headers: {
        Authorization: req.headers.authorization,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Order status updated successfully');

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Update order status error:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to update order status on customer server'
      });
    }
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private (Admin)
const getOrderStats = async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL || 'http://localhost:5000'}/api/orders/all`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });

    const orders = response.data.orders || [];
    
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => ['delivered', 'shipped'].includes(o.status))
        .reduce((sum, o) => sum + (o.pricing?.total || 0), 0),
      todayOrders: orders.filter(o => {
        const today = new Date().toDateString();
        return new Date(o.createdAt).toDateString() === today;
      }).length
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get order stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics'
    });
  }
};

module.exports = {
  getOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats
};