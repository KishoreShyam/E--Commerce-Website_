import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiAlertTriangle, FiInfo, FiAlertCircle } from 'react-icons/fi';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  width: 100%;
  
  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
`;

const NotificationCard = styled(motion.div)`
  background: ${props => {
    switch (props.type) {
      case 'success': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'error': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'warning': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'info': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  }};
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(255, 255, 255, 0.3);
  }
`;

const IconContainer = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h4`
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
`;

const Message = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
  opacity: 0.9;
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ProgressBar = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 0 0 12px 12px;
`;

const getIcon = (type) => {
  switch (type) {
    case 'success': return <FiCheck />;
    case 'error': return <FiAlertCircle />;
    case 'warning': return <FiAlertTriangle />;
    case 'info': return <FiInfo />;
    default: return <FiInfo />;
  }
};

const NotificationItem = ({ notification, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (notification.autoClose !== false) {
      const duration = notification.duration || 5000;
      const interval = 50;
      const decrement = (interval / duration) * 100;

      const timer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - decrement;
          if (newProgress <= 0) {
            clearInterval(timer);
            onClose(notification.id);
            return 0;
          }
          return newProgress;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [notification, onClose]);

  return (
    <NotificationCard
      type={notification.type}
      initial={{ x: 400, opacity: 0, scale: 0.8 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 400, opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileHover={{ scale: 1.02 }}
    >
      <IconContainer>
        {getIcon(notification.type)}
      </IconContainer>
      
      <Content>
        {notification.title && <Title>{notification.title}</Title>}
        <Message>{notification.message}</Message>
      </Content>
      
      <CloseButton onClick={() => onClose(notification.id)}>
        <FiX />
      </CloseButton>
      
      {notification.autoClose !== false && (
        <ProgressBar
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.05, ease: 'linear' }}
        />
      )}
    </NotificationCard>
  );
};

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      autoClose: true,
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Expose methods globally
  useEffect(() => {
    window.notify = {
      success: (message, options = {}) => addNotification({ 
        type: 'success', 
        message, 
        title: options.title || 'Success',
        ...options 
      }),
      error: (message, options = {}) => addNotification({ 
        type: 'error', 
        message, 
        title: options.title || 'Error',
        autoClose: false,
        ...options 
      }),
      warning: (message, options = {}) => addNotification({ 
        type: 'warning', 
        message, 
        title: options.title || 'Warning',
        ...options 
      }),
      info: (message, options = {}) => addNotification({ 
        type: 'info', 
        message, 
        title: options.title || 'Info',
        ...options 
      }),
      custom: (notification) => addNotification(notification),
      remove: removeNotification,
      clear: clearAll
    };

    return () => {
      delete window.notify;
    };
  }, []);

  return (
    <NotificationContainer>
      <AnimatePresence mode="popLayout">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </AnimatePresence>
    </NotificationContainer>
  );
};

export default NotificationSystem;
