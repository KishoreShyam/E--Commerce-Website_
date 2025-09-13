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

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
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

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to LuxeCommerce real-time service',
      user: {
        id: socket.user._id,
        name: socket.user.fullName,
        email: socket.user.email
      }
    });

    // Handle cart updates
    socket.on('cart:update', (data) => {
      // Broadcast cart update to user's other sessions
      socket.to(`user:${socket.userId}`).emit('cart:updated', data);
    });

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

    socket.on('chat:message', (data) => {
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
        userInfo: {
          name: socket.user.fullName,
          email: socket.user.email
        }
      });
    });

    // Handle wishlist updates
    socket.on('wishlist:update', (data) => {
      socket.to(`user:${socket.userId}`).emit('wishlist:updated', data);
    });

    // Handle notifications
    socket.on('notification:mark_read', (notificationId) => {
      socket.to(`user:${socket.userId}`).emit('notification:read', {
        notificationId,
        readAt: new Date()
      });
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`User ${socket.user.email} disconnected: ${reason}`);
      
      // Remove from active connections
      activeConnections.delete(socket.userId);
      
      // Leave all chat rooms and notify
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

  // Helper functions for emitting events
  const emitToUser = (userId, event, data) => {
    io.to(`user:${userId}`).emit(event, data);
  };

  const emitToOrder = (orderId, event, data) => {
    io.to(`order:${orderId}`).emit(event, data);
  };

  const emitToChat = (chatId, event, data) => {
    io.to(`chat:${chatId}`).emit(event, data);
  };

  const emitToAdmin = (event, data) => {
    io.to('admin:dashboard').emit(event, data);
  };

  const broadcastNotification = (notification) => {
    if (notification.userId) {
      emitToUser(notification.userId, 'notification:new', notification);
    } else {
      // Broadcast to all connected users
      io.emit('notification:broadcast', notification);
    }
  };

  // Expose helper functions
  io.emitToUser = emitToUser;
  io.emitToOrder = emitToOrder;
  io.emitToChat = emitToChat;
  io.emitToAdmin = emitToAdmin;
  io.broadcastNotification = broadcastNotification;
  io.getActiveConnections = () => activeConnections;
};

// Generate unique message ID
const generateMessageId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

module.exports = socketHandler;
