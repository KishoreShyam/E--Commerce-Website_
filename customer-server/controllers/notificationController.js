// Mock notification model since we don't have it yet
const mockNotifications = [
  {
    id: 'notif_1',
    user: null,
    title: 'Order Confirmed',
    message: 'Your order #LUX123456 has been confirmed',
    type: 'order',
    read: false,
    createdAt: new Date()
  }
];

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const unreadOnly = req.query.unreadOnly === 'true';

    // Mock implementation
    let notifications = mockNotifications.filter(n => n.user === req.user.id || !n.user);
    
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }

    const total = notifications.length;
    const skip = (page - 1) * limit;
    notifications = notifications.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      count: notifications.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const notification = mockNotifications.find(n => n.id === req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.read = true;

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    mockNotifications.forEach(n => {
      if (n.user === req.user.id || !n.user) {
        n.read = true;
      }
    });

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res, next) => {
  try {
    const index = mockNotifications.findIndex(n => n.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    mockNotifications.splice(index, 1);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
