const axios = require('axios');
const moment = require('moment');

// Get dashboard statistics
const getDashboardStats = async (req, res, next) => {
  try {
    // Fetch data from customer server
    const [ordersRes, usersRes, productsRes] = await Promise.all([
      axios.get(`${process.env.CUSTOMER_SERVER_URL}/api/orders/stats`, {
        headers: { Authorization: req.headers.authorization }
      }),
      axios.get(`${process.env.CUSTOMER_SERVER_URL}/api/users/stats`, {
        headers: { Authorization: req.headers.authorization }
      }),
      axios.get(`${process.env.CUSTOMER_SERVER_URL}/api/products/stats`, {
        headers: { Authorization: req.headers.authorization }
      })
    ]);

    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'day').startOf('day');
    const thisMonth = moment().startOf('month');
    const lastMonth = moment().subtract(1, 'month').startOf('month');

    const stats = {
      overview: {
        totalOrders: ordersRes.data.total || 0,
        totalRevenue: ordersRes.data.totalRevenue || 0,
        totalCustomers: usersRes.data.total || 0,
        totalProducts: productsRes.data.total || 0
      },
      today: {
        orders: ordersRes.data.today || 0,
        revenue: ordersRes.data.todayRevenue || 0,
        newCustomers: usersRes.data.today || 0
      },
      growth: {
        orders: calculateGrowth(ordersRes.data.thisMonth, ordersRes.data.lastMonth),
        revenue: calculateGrowth(ordersRes.data.thisMonthRevenue, ordersRes.data.lastMonthRevenue),
        customers: calculateGrowth(usersRes.data.thisMonth, usersRes.data.lastMonth)
      },
      orderStatus: ordersRes.data.statusBreakdown || {},
      recentActivity: {
        lastOrderTime: ordersRes.data.lastOrderTime,
        lastUserRegistration: usersRes.data.lastRegistration,
        lastProductAdded: productsRes.data.lastAdded
      }
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

// Get recent orders
const getRecentOrders = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL}/api/orders`, {
      headers: { Authorization: req.headers.authorization },
      params: {
        limit,
        sort: '-createdAt',
        populate: 'customer'
      }
    });

    res.status(200).json({
      success: true,
      orders: response.data.orders || []
    });
  } catch (error) {
    console.error('Recent orders error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent orders'
    });
  }
};

// Get recent users
const getRecentUsers = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL}/api/users`, {
      headers: { Authorization: req.headers.authorization },
      params: {
        limit,
        sort: '-createdAt'
      }
    });

    res.status(200).json({
      success: true,
      users: response.data.users || []
    });
  } catch (error) {
    console.error('Recent users error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent users'
    });
  }
};

// Get low stock products
const getLowStockProducts = async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL}/api/products/low-stock`, {
      headers: { Authorization: req.headers.authorization }
    });

    res.status(200).json({
      success: true,
      products: response.data.products || []
    });
  } catch (error) {
    console.error('Low stock products error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch low stock products'
    });
  }
};

// Get revenue chart data
const getRevenueChart = async (req, res, next) => {
  try {
    const { period = '30d' } = req.query;
    
    const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL}/api/analytics/revenue-chart`, {
      headers: { Authorization: req.headers.authorization },
      params: { period }
    });

    res.status(200).json({
      success: true,
      chartData: response.data.chartData || []
    });
  } catch (error) {
    console.error('Revenue chart error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue chart data'
    });
  }
};

// Get top products
const getTopProducts = async (req, res, next) => {
  try {
    const { limit = 5, period = '30d' } = req.query;
    
    const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL}/api/products/top-selling`, {
      headers: { Authorization: req.headers.authorization },
      params: { limit, period }
    });

    res.status(200).json({
      success: true,
      products: response.data.products || []
    });
  } catch (error) {
    console.error('Top products error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top products'
    });
  }
};

// Get system health
const getSystemHealth = async (req, res, next) => {
  try {
    const [customerServerHealth, databaseHealth] = await Promise.all([
      checkCustomerServerHealth(),
      checkDatabaseHealth()
    ]);

    const systemHealth = {
      overall: 'healthy',
      services: {
        adminServer: {
          status: 'healthy',
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          cpu: process.cpuUsage()
        },
        customerServer: customerServerHealth,
        database: databaseHealth
      },
      timestamp: new Date()
    };

    // Determine overall health
    const services = Object.values(systemHealth.services);
    if (services.some(service => service.status === 'unhealthy')) {
      systemHealth.overall = 'unhealthy';
    } else if (services.some(service => service.status === 'degraded')) {
      systemHealth.overall = 'degraded';
    }

    res.status(200).json({
      success: true,
      health: systemHealth
    });
  } catch (error) {
    console.error('System health error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to check system health'
    });
  }
};

// Helper functions
const calculateGrowth = (current, previous) => {
  if (!previous || previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

const checkCustomerServerHealth = async () => {
  try {
    const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL}/health`, {
      timeout: 5000
    });
    
    return {
      status: 'healthy',
      uptime: response.data.uptime,
      timestamp: response.data.timestamp
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date()
    };
  }
};

const checkDatabaseHealth = async () => {
  try {
    const mongoose = require('mongoose');
    const dbState = mongoose.connection.readyState;
    
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    return {
      status: dbState === 1 ? 'healthy' : 'unhealthy',
      state: states[dbState],
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      timestamp: new Date()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date()
    };
  }
};

module.exports = {
  getDashboardStats,
  getRecentOrders,
  getRecentUsers,
  getLowStockProducts,
  getRevenueChart,
  getTopProducts,
  getSystemHealth
};
