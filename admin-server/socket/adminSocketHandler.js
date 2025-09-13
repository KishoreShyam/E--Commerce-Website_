const jwt = require('jsonwebtoken');
const axios = require('axios');

// Store active admin connections
const activeAdminConnections = new Map();

const adminSocketHandler = (io) => {
  // Authentication middleware for admin socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      // Verify token with customer server
      const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const user = response.data.user;
      
      if (!user || user.role !== 'admin') {
        return next(new Error('Admin access required'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Admin ${socket.user.email} connected: ${socket.id}`);
    
    // Store admin connection
    activeAdminConnections.set(socket.userId, {
      socketId: socket.id,
      user: socket.user,
      connectedAt: new Date()
    });

    // Join admin rooms
    socket.join('admin:dashboard');
    socket.join('admin:analytics');
    socket.join(`admin:${socket.userId}`);

    // Send welcome message with dashboard stats
    socket.emit('admin:connected', {
      message: 'Connected to LuxeCommerce Admin Dashboard',
      user: {
        id: socket.user._id,
        name: `${socket.user.firstName} ${socket.user.lastName}`,
        email: socket.user.email,
        role: socket.user.role
      },
      timestamp: new Date()
    });

    // Handle real-time analytics requests
    socket.on('analytics:subscribe', (metrics) => {
      console.log(`Admin ${socket.user.email} subscribed to analytics:`, metrics);
      socket.join('analytics:live');
      
      // Send initial analytics data
      socket.emit('analytics:initial', {
        message: 'Analytics subscription active',
        metrics: metrics || ['orders', 'revenue', 'users', 'products']
      });
    });

    socket.on('analytics:unsubscribe', () => {
      socket.leave('analytics:live');
      console.log(`Admin ${socket.user.email} unsubscribed from analytics`);
    });

    // Handle order management
    socket.on('order:update_status', (data) => {
      const { orderId, status, note } = data;
      
      // Broadcast order status update to customer
      io.to(`order:${orderId}`).emit('order:status_updated', {
        orderId,
        status,
        note,
        updatedBy: socket.user.email,
        timestamp: new Date()
      });

      // Broadcast to other admins
      socket.to('admin:dashboard').emit('order:status_changed', {
        orderId,
        status,
        updatedBy: socket.user.email,
        timestamp: new Date()
      });
    });

    // Handle inventory updates
    socket.on('inventory:update', (data) => {
      const { productId, stock, action } = data;
      
      // Broadcast inventory update to all admins
      io.to('admin:dashboard').emit('inventory:updated', {
        productId,
        stock,
        action,
        updatedBy: socket.user.email,
        timestamp: new Date()
      });
    });

    // Handle customer support chat
    socket.on('support:join_chat', (chatId) => {
      socket.join(`chat:${chatId}`);
      
      // Notify customer that admin joined
      socket.to(`chat:${chatId}`).emit('chat:admin_joined', {
        admin: {
          name: `${socket.user.firstName} ${socket.user.lastName}`,
          role: 'Support Agent'
        },
        timestamp: new Date()
      });
    });

    socket.on('support:send_message', (data) => {
      const { chatId, message, customerId } = data;
      
      // Send message to customer
      io.to(`chat:${chatId}`).emit('chat:new_message', {
        id: generateMessageId(),
        chatId,
        message,
        user: {
          id: socket.user._id,
          name: `${socket.user.firstName} ${socket.user.lastName}`,
          role: 'admin',
          avatar: socket.user.avatar
        },
        timestamp: new Date(),
        type: 'admin'
      });

      // Notify other admins
      socket.to('admin:dashboard').emit('support:message_sent', {
        chatId,
        customerId,
        message,
        agent: socket.user.email,
        timestamp: new Date()
      });
    });

    // Handle bulk operations
    socket.on('bulk:operation_start', (data) => {
      const { operation, items, operationId } = data;
      
      socket.emit('bulk:operation_progress', {
        operationId,
        status: 'started',
        progress: 0,
        total: items.length,
        message: `Starting ${operation} operation...`
      });
    });

    // Handle system notifications
    socket.on('system:broadcast_notification', (notification) => {
      // Broadcast to all customers
      io.emit('notification:system', {
        ...notification,
        sentBy: socket.user.email,
        timestamp: new Date()
      });

      // Log to other admins
      socket.to('admin:dashboard').emit('system:notification_sent', {
        notification,
        sentBy: socket.user.email,
        timestamp: new Date()
      });
    });

    // Handle product management
    socket.on('product:status_change', (data) => {
      const { productId, status, reason } = data;
      
      // Broadcast to all admins
      io.to('admin:dashboard').emit('product:status_updated', {
        productId,
        status,
        reason,
        updatedBy: socket.user.email,
        timestamp: new Date()
      });
    });

    // Handle user management
    socket.on('user:status_change', (data) => {
      const { userId, action, reason } = data;
      
      // Notify affected user if online
      io.to(`user:${userId}`).emit('account:status_changed', {
        action,
        reason,
        timestamp: new Date()
      });

      // Log to other admins
      socket.to('admin:dashboard').emit('user:action_taken', {
        userId,
        action,
        reason,
        adminId: socket.user._id,
        adminEmail: socket.user.email,
        timestamp: new Date()
      });
    });

    // Handle reports generation
    socket.on('report:generate', (data) => {
      const { reportType, filters, reportId } = data;
      
      socket.emit('report:generation_started', {
        reportId,
        reportType,
        status: 'processing',
        message: 'Report generation started...'
      });

      // Simulate report generation progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
          
          socket.emit('report:generation_complete', {
            reportId,
            status: 'completed',
            downloadUrl: `/api/reports/download/${reportId}`,
            message: 'Report generated successfully'
          });
        } else {
          socket.emit('report:generation_progress', {
            reportId,
            progress: Math.round(progress),
            message: `Processing... ${Math.round(progress)}%`
          });
        }
      }, 1000);
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`Admin ${socket.user.email} disconnected: ${reason}`);
      
      // Remove from active connections
      activeAdminConnections.delete(socket.userId);
      
      // Notify other admins
      socket.to('admin:dashboard').emit('admin:disconnected', {
        admin: {
          id: socket.user._id,
          email: socket.user.email
        },
        reason,
        timestamp: new Date()
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Admin socket error for ${socket.user.email}:`, error);
    });
  });

  // Helper functions for admin operations
  const broadcastToAdmins = (event, data) => {
    io.to('admin:dashboard').emit(event, data);
  };

  const notifyAdmin = (adminId, event, data) => {
    io.to(`admin:${adminId}`).emit(event, data);
  };

  const broadcastAnalytics = (data) => {
    io.to('analytics:live').emit('analytics:update', data);
  };

  const notifyOrderUpdate = (orderId, data) => {
    io.to(`order:${orderId}`).emit('order:updated', data);
  };

  const broadcastSystemAlert = (alert) => {
    io.to('admin:dashboard').emit('system:alert', {
      ...alert,
      timestamp: new Date()
    });
  };

  // Expose helper functions
  io.broadcastToAdmins = broadcastToAdmins;
  io.notifyAdmin = notifyAdmin;
  io.broadcastAnalytics = broadcastAnalytics;
  io.notifyOrderUpdate = notifyOrderUpdate;
  io.broadcastSystemAlert = broadcastSystemAlert;
  io.getActiveAdminConnections = () => activeAdminConnections;
};

// Generate unique message ID
const generateMessageId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

module.exports = adminSocketHandler;
