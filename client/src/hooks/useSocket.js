import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const useSocket = (serverUrl = 'http://localhost:5000') => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('No authentication token found');
      return;
    }

    const socketInstance = io(serverUrl, {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: maxReconnectAttempts
    });

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('🔌 Connected to server');
      setConnected(true);
      setError(null);
      reconnectAttempts.current = 0;
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from server:', reason);
      setConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        socketInstance.connect();
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error.message);
      setError(error.message);
      reconnectAttempts.current++;
      
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        setError('Failed to connect after multiple attempts');
      }
    });

    // Real-time event handlers
    socketInstance.on('cart:updated', (data) => {
      // Dispatch custom event for cart updates
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: data }));
    });

    socketInstance.on('order:updated', (data) => {
      // Show notification for order updates
      if (window.notify) {
        window.notify.info(data.message, {
          title: 'Order Update',
          duration: 8000
        });
      }
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('orderUpdated', { detail: data }));
    });

    socketInstance.on('wishlist:updated', (data) => {
      // Dispatch custom event for wishlist updates
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: data }));
    });

    socketInstance.on('inventory:updated', (data) => {
      // Dispatch custom event for inventory updates
      window.dispatchEvent(new CustomEvent('inventoryUpdated', { detail: data }));
    });

    socketInstance.on('promotion:new', (data) => {
      // Show notification for new promotions
      if (window.notify) {
        window.notify.success(data.message, {
          title: 'New Promotion!',
          duration: 10000
        });
      }
    });

    socketInstance.on('system:maintenance', (data) => {
      // Show maintenance notification
      if (window.notify) {
        window.notify.warning(data.message, {
          title: 'System Maintenance',
          autoClose: false
        });
      }
    });

    socketInstance.on('admin:broadcast', (data) => {
      // Show admin broadcast messages
      if (window.notify) {
        window.notify.info(data.message, {
          title: 'Announcement',
          duration: 12000
        });
      }
    });

    socketInstance.on('force_disconnect', (data) => {
      // Handle forced disconnection
      if (window.notify) {
        window.notify.error(`Connection terminated: ${data.reason}`, {
          title: 'Disconnected',
          autoClose: false
        });
      }
      
      // Redirect to login if needed
      if (data.reason.includes('session') || data.reason.includes('auth')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [serverUrl]);

  // Helper methods
  const emit = (event, data) => {
    if (socket && connected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  };

  const on = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
      
      // Return cleanup function
      return () => socket.off(event, callback);
    }
  };

  const off = (event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  };

  // Cart operations
  const updateCart = (action, productId, quantity, variantId) => {
    emit('cart:update', { action, productId, quantity, variantId });
  };

  // Product operations
  const trackProductView = (productId) => {
    emit('product:view', productId);
  };

  // Wishlist operations
  const updateWishlist = (action, productId) => {
    emit('wishlist:update', { action, productId });
  };

  // Order operations
  const subscribeToOrder = (orderId) => {
    emit('order:subscribe', orderId);
  };

  const unsubscribeFromOrder = (orderId) => {
    emit('order:unsubscribe', orderId);
  };

  // Chat operations
  const joinChat = (chatId) => {
    emit('chat:join', chatId);
  };

  const sendChatMessage = (chatId, message, type = 'text') => {
    emit('chat:message', { chatId, message, type });
  };

  return {
    socket,
    connected,
    error,
    emit,
    on,
    off,
    // Convenience methods
    updateCart,
    trackProductView,
    updateWishlist,
    subscribeToOrder,
    unsubscribeFromOrder,
    joinChat,
    sendChatMessage
  };
};

export default useSocket;
