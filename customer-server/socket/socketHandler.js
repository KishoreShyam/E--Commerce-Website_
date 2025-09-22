const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Store active connections
const activeConnections = new Map();

const socketHandler = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
      const user = fileDB.findUserById(decoded.id);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.email} connected: ${socket.id}`);
    
    // Store connection
    activeConnections.set(socket.userId, {
      socketId: socket.id,
      user: socket.user,
      connectedAt: new Date()
    });

    // Join user to their personal room
    socket.join(`user:${socket.userId}`);
    
    // Join admin users to admin room for real-time updates
    if (socket.user.role === 'admin') {
      socket.join('admin:dashboard');
      console.log(`🎛️ Admin ${socket.user.email} joined admin dashboard`);
    }

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to LuxeCommerce real-time service',
      user: {
        id: socket.user._id,
        name: `${socket.user.firstName} ${socket.user.lastName}`,
        email: socket.user.email
      }
    });

    // Handle product management events (Admin only)
    socket.on('product:create', (data) => {
      if (socket.user.role === 'admin') {
        // Broadcast to all connected clients
        io.emit('product:created', {
          product: data.product,
          createdBy: socket.user.email,
          timestamp: new Date()
        });
      }
    });

    socket.on('product:update', (data) => {
      if (socket.user.role === 'admin') {
        // Broadcast to all connected clients
        io.emit('product:updated', {
          product: data.product,
          updatedBy: socket.user.email,
          timestamp: new Date()
        });
      }
    });

    socket.on('product:delete', (data) => {
      if (socket.user.role === 'admin') {
        // Broadcast to all connected clients
        io.emit('product:deleted', {
          productId: data.productId,
          deletedBy: socket.user.email,
          timestamp: new Date()
        });
      }
    });

    // Handle order management events
    socket.on('order:status_update', (data) => {
      if (socket.user.role === 'admin') {
        const { orderId, status, note } = data;
        
        // Broadcast to customer who placed the order
        io.emit('order:status_changed', {
          orderId,
          status,
          note,
          updatedBy: socket.user.email,
          timestamp: new Date()
        });
        
        // Broadcast to other admins
        socket.to('admin:dashboard').emit('order:updated', {
          orderId,
          status,
          note,
          updatedBy: socket.user.email,
          timestamp: new Date()
        });
      }
    });

    // Handle cart updates
    socket.on('cart:update', (data) => {
      // Broadcast cart update to user's other sessions
      socket.to(`user:${socket.userId}`).emit('cart:updated', data);
    });
      socket.to(`user:${socket.userId}`).emit('cart:updated', {
    // Handle order status updates
    socket.on('order:subscribe', (orderId) => {
      socket.join(`order:${orderId}`);
      console.log(`User ${socket.user.email} subscribed to order ${orderId}`);
    });

    socket.on('order:unsubscribe', (orderId) => {
      socket.leave(`order:${orderId}`);
      console.log(`User ${socket.user.email} unsubscribed from order ${orderId}`);
    });

    // Handle live chat
    socket.on('chat:join', (data) => {
      const chatRoom = `chat:${data.chatId}`;
      socket.join(chatRoom);
      
      // Notify others in the chat
      socket.to(chatRoom).emit('chat:user_joined', {
        user: {
          id: socket.user._id,
          name: socket.user.fullName,
          avatar: socket.user.avatar
        },
        timestamp: new Date()
      });
    });
      // Notify admins for analytics
      io.to('admin:dashboard').emit('analytics:cart_activity', {
      const chatRoom = `chat:${data.chatId}`;
      
      // Broadcast message to chat room
      io.to(chatRoom).emit('chat:new_message', {
        id: generateMessageId(),
        chatId: data.chatId,
        message: data.message,
        user: {
          id: socket.user._id,
          name: socket.user.fullName,
          avatar: socket.user.avatar
        },
        timestamp: new Date(),
        type: 'user'
      });
    });

    socket.on('chat:typing', (data) => {
      const chatRoom = `chat:${data.chatId}`;
      socket.to(chatRoom).emit('chat:user_typing', {
        user: {
          id: socket.user._id,
          name: socket.user.fullName
        },
        isTyping: data.isTyping
      });
    });

    // Handle product views for real-time analytics
    socket.on('product:view', (data) => {
      // Broadcast to admin dashboard for real-time analytics
      io.to('admin:analytics').emit('product:viewed', {
        productId: data.productId,
        userId: socket.userId,
        timestamp: new Date(),
      socket.leave(`order:${orderId}`);
          name: socket.user.fullName,
          email: socket.user.email
    // Handle new order notifications (Customer to Admin)
    socket.on('order:placed', (orderData) => {
      // Notify all admins of new order
      io.to('admin:dashboard').emit('order:new', {
        order: orderData,
        customer: {
          name: `${socket.user.firstName} ${socket.user.lastName}`,
          email: socket.user.email
        },
        timestamp: new Date()
      });
    });

        }
      });
      // Track for analytics
      io.to('admin:dashboard').emit('analytics:product_view', {
        userId: socket.userId,
        productId,
        timestamp: new Date()
      socket.to(`user:${socket.userId}`).emit('wishlist:updated', {

      socket.join(`order:${orderId}`);
      console.log(`📦 User ${socket.user.email} subscribed to order ${orderId}`);
    socket.on('wishlist:update', (data) => {
      socket.to(`user:${socket.userId}`).emit('wishlist:updated', data);
    });

    // Handle notifications
      socket.join(`chat:${chatId}`);
      
      // Notify admins when customer joins chat
      if (socket.user.role === 'customer') {
        io.to('admin:dashboard').emit('chat:customer_joined', {
          chatId,
          customer: {
            name: `${socket.user.firstName} ${socket.user.lastName}`,
            email: socket.user.email
          },
          timestamp: new Date()
        });
      }
      socket.to(`user:${socket.userId}`).emit('notification:read', {
        notificationId,
        readAt: new Date()
      const { chatId, message, type = 'text' } = data;
      
      const messageData = {
        id: Date.now().toString(),
        chatId,
        senderId: socket.userId,
        senderName: `${socket.user.firstName} ${socket.user.lastName}`,
        senderRole: socket.user.role,
        message,
        type,
        timestamp: new Date()
      };

      // Emit to all participants in the chat
      io.to(`chat:${chatId}`).emit('chat:message', messageData);
      
      // Notify admins of new customer messages
      if (socket.user.role === 'customer') {
        io.to('admin:dashboard').emit('chat:new_message', {
          chatId,
          customerName: `${socket.user.firstName} ${socket.user.lastName}`,
          preview: message.substring(0, 50),
          timestamp: new Date()
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`User ${socket.user.email} disconnected: ${reason}`);
      
      // Remove from active connections
      activeConnections.delete(socket.userId);
      // Notify admins if customer disconnects
      if (socket.user.role === 'customer') {
        io.to('admin:dashboard').emit('customer:disconnected', {
          userId: socket.userId,
          email: socket.user.email,
          timestamp: new Date()
        });
      }
      const rooms = Array.from(socket.rooms);
      rooms.forEach(room => {
        if (room.startsWith('chat:')) {
          socket.to(room).emit('chat:user_left', {
            user: {
              id: socket.user._id,
              name: socket.user.fullName
            },
            timestamp: new Date()
          });
        }
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.user.email}:`, error);
    });
  });

  // Expose helper functions for external use
  io.broadcastToAdmins = (event, data) => {
    io.to('admin:dashboard').emit(event, data);
  };
  
  io.notifyOrderUpdate = (orderId, data) => {
    io.to(`order:${orderId}`).emit('order:updated', data);
  };
  
  io.broadcastProductUpdate = (event, data) => {
    io.emit(event, data);
  };
  
  io.emitToAdmin = emitToAdmin;
  io.broadcastNotification = broadcastNotification;
  io.getActiveConnections = () => activeConnections;
};

// Generate unique message ID
const generateMessageId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

module.exports = socketHandler;
