const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class SocketManager {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
    this.adminSockets = new Set();
  }

  initialize(server) {
    this.io = socketIo(server, {
      cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupMiddleware();
    this.setupEventHandlers();
    
    console.log('🔌 Socket.IO server initialized');
  }

  setupMiddleware() {
    // Authentication middleware for socket connections
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
          return next(new Error('Authentication error: User not found'));
        }

        socket.userId = user._id.toString();
        socket.userRole = user.role;
        socket.user = user;
        
        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`👤 User connected: ${socket.user.email} (${socket.id})`);
      
      // Store user connection
      this.connectedUsers.set(socket.userId, {
        socketId: socket.id,
        user: socket.user,
        connectedAt: new Date()
      });

      // Add to admin sockets if user is admin
      if (socket.userRole === 'admin') {
        this.adminSockets.add(socket.id);
      }

      // Join user to their personal room
      socket.join(`user_${socket.userId}`);
      
      // Join admin users to admin room
      if (socket.userRole === 'admin') {
        socket.join('admin_room');
      }

      // Handle cart updates
      socket.on('cart:update', (data) => {
        this.handleCartUpdate(socket, data);
      });

      // Handle order status updates
      socket.on('order:subscribe', (orderId) => {
        socket.join(`order_${orderId}`);
      });

      socket.on('order:unsubscribe', (orderId) => {
        socket.leave(`order_${orderId}`);
      });

      // Handle product view tracking
      socket.on('product:view', (productId) => {
        this.handleProductView(socket, productId);
      });

      // Handle wishlist updates
      socket.on('wishlist:update', (data) => {
        this.handleWishlistUpdate(socket, data);
      });

      // Handle live chat (customer support)
      socket.on('chat:join', (chatId) => {
        socket.join(`chat_${chatId}`);
      });

      socket.on('chat:message', (data) => {
        this.handleChatMessage(socket, data);
      });

      // Handle admin notifications
      socket.on('admin:subscribe', () => {
        if (socket.userRole === 'admin') {
          socket.join('admin_notifications');
        }
      });

      // Handle inventory alerts
      socket.on('inventory:subscribe', (productId) => {
        if (socket.userRole === 'admin') {
          socket.join(`inventory_${productId}`);
        }
      });

      // Handle real-time analytics
      socket.on('analytics:subscribe', () => {
        if (socket.userRole === 'admin') {
          socket.join('analytics_updates');
        }
      });

      // Handle disconnect
      socket.on('disconnect', (reason) => {
        console.log(`👋 User disconnected: ${socket.user.email} (${reason})`);
        
        this.connectedUsers.delete(socket.userId);
        this.adminSockets.delete(socket.id);
        
        // Notify other users if needed
        this.broadcastUserStatus(socket.userId, 'offline');
      });

      // Send initial connection success
      socket.emit('connected', {
        message: 'Connected successfully',
        userId: socket.userId,
        timestamp: new Date()
      });

      // Broadcast user online status
      this.broadcastUserStatus(socket.userId, 'online');
    });
  }

  // Cart update handler
  handleCartUpdate(socket, data) {
    const { action, productId, quantity, variantId } = data;
    
    // Emit to user's other sessions
    socket.to(`user_${socket.userId}`).emit('cart:updated', {
      action,
      productId,
      quantity,
      variantId,
      timestamp: new Date()
    });

    // Notify admins of cart activity for analytics
    this.io.to('admin_room').emit('analytics:cart_activity', {
      userId: socket.userId,
      action,
      productId,
      timestamp: new Date()
    });
  }

  // Product view handler
  handleProductView(socket, productId) {
    // Track product views for analytics
    this.io.to('analytics_updates').emit('analytics:product_view', {
      userId: socket.userId,
      productId,
      timestamp: new Date()
    });
  }

  // Wishlist update handler
  handleWishlistUpdate(socket, data) {
    const { action, productId } = data;
    
    // Emit to user's other sessions
    socket.to(`user_${socket.userId}`).emit('wishlist:updated', {
      action,
      productId,
      timestamp: new Date()
    });
  }

  // Chat message handler
  handleChatMessage(socket, data) {
    const { chatId, message, type = 'text' } = data;
    
    const messageData = {
      id: Date.now().toString(),
      chatId,
      senderId: socket.userId,
      senderName: socket.user.fullName,
      senderRole: socket.userRole,
      message,
      type,
      timestamp: new Date()
    };

    // Emit to all participants in the chat
    this.io.to(`chat_${chatId}`).emit('chat:message', messageData);
    
    // Notify admins of new customer messages
    if (socket.userRole === 'customer') {
      this.io.to('admin_notifications').emit('chat:new_message', {
        chatId,
        customerName: socket.user.fullName,
        preview: message.substring(0, 50),
        timestamp: new Date()
      });
    }
  }

  // Broadcast user status
  broadcastUserStatus(userId, status) {
    this.io.emit('user:status', {
      userId,
      status,
      timestamp: new Date()
    });
  }

  // Public methods for external use

  // Notify user about order updates
  notifyOrderUpdate(userId, orderData) {
    this.io.to(`user_${userId}`).emit('order:updated', {
      orderId: orderData._id,
      status: orderData.status,
      message: `Your order #${orderData.orderNumber} has been ${orderData.status}`,
      timestamp: new Date()
    });

    // Also emit to order-specific room
    this.io.to(`order_${orderData._id}`).emit('order:status_changed', orderData);
  }

  // Notify about inventory changes
  notifyInventoryUpdate(productId, stockLevel) {
    this.io.to(`inventory_${productId}`).emit('inventory:updated', {
      productId,
      stockLevel,
      timestamp: new Date()
    });

    // Alert if low stock
    if (stockLevel <= 10) {
      this.io.to('admin_notifications').emit('inventory:low_stock', {
        productId,
        stockLevel,
        timestamp: new Date()
      });
    }
  }

  // Send promotional notifications
  sendPromotion(userId, promotionData) {
    if (userId) {
      // Send to specific user
      this.io.to(`user_${userId}`).emit('promotion:new', promotionData);
    } else {
      // Broadcast to all connected users
      this.io.emit('promotion:new', promotionData);
    }
  }

  // Send system maintenance notifications
  sendMaintenanceNotification(message, scheduledTime) {
    this.io.emit('system:maintenance', {
      message,
      scheduledTime,
      timestamp: new Date()
    });
  }

  // Real-time analytics updates
  broadcastAnalytics(data) {
    this.io.to('analytics_updates').emit('analytics:update', {
      ...data,
      timestamp: new Date()
    });
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Get connected admins count
  getConnectedAdminsCount() {
    return this.adminSockets.size;
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }

  // Get all connected users (admin only)
  getConnectedUsers() {
    return Array.from(this.connectedUsers.values()).map(conn => ({
      userId: conn.user._id,
      email: conn.user.email,
      role: conn.user.role,
      connectedAt: conn.connectedAt
    }));
  }

  // Force disconnect user (admin action)
  disconnectUser(userId, reason = 'Admin action') {
    const userConnection = this.connectedUsers.get(userId);
    if (userConnection) {
      const socket = this.io.sockets.sockets.get(userConnection.socketId);
      if (socket) {
        socket.emit('force_disconnect', { reason });
        socket.disconnect(true);
      }
    }
  }

  // Broadcast admin message to all users
  broadcastAdminMessage(message, type = 'info') {
    this.io.emit('admin:broadcast', {
      message,
      type,
      timestamp: new Date()
    });
  }
}

// Create singleton instance
const socketManager = new SocketManager();

module.exports = socketManager;
