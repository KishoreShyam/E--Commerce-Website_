const express = require('express');
const {
  getDashboardStats,
  getRecentOrders,
  getRecentUsers,
  getLowStockProducts,
  getRevenueChart,
  getTopProducts,
  getSystemHealth
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All dashboard routes require admin authentication
router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/recent-orders', getRecentOrders);
router.get('/recent-users', getRecentUsers);
router.get('/low-stock', getLowStockProducts);
router.get('/revenue-chart', getRevenueChart);
router.get('/top-products', getTopProducts);
router.get('/system-health', authorize('system:read'), getSystemHealth);

module.exports = router;
