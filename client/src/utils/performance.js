// Performance optimization utilities
import { lazy } from 'react';

// Lazy loading components for better performance
export const LazyComponents = {
  ProductCard: lazy(() => import('../components/ui/ProductCard')),
  ProductForm: lazy(() => import('../components/ProductManagement/ProductForm')),
  AnimatedBackground: lazy(() => import('../components/ui/AnimatedBackground')),
  NotificationSystem: lazy(() => import('../components/ui/NotificationSystem')),
};

// Image optimization
export const optimizeImage = (url, width = 800, quality = 80) => {
  if (!url) return '';
  
  // If using Cloudinary or similar service
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
  }
  
  return url;
};

// Debounce function for search and input optimization
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Virtual scrolling for large lists
export const calculateVisibleItems = (containerHeight, itemHeight, scrollTop, totalItems) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, totalItems);
  
  return {
    startIndex: Math.max(0, startIndex),
    endIndex,
    visibleCount
  };
};

// Memory management
export const cleanupResources = () => {
  // Clean up any global event listeners
  const events = ['resize', 'scroll', 'mousemove'];
  events.forEach(event => {
    window.removeEventListener(event, () => {});
  });
  
  // Clean up any intervals or timeouts
  const highestTimeoutId = setTimeout(() => {}, 0);
  for (let i = 0; i < highestTimeoutId; i++) {
    clearTimeout(i);
  }
  
  const highestIntervalId = setInterval(() => {}, 0);
  for (let i = 0; i < highestIntervalId; i++) {
    clearInterval(i);
  }
};

// Bundle size optimization
export const preloadCriticalResources = () => {
  // Preload critical fonts
  const fonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap'
  ];
  
  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = font;
    document.head.appendChild(link);
  });
  
  // Preload critical images
  const criticalImages = [
    '/images/hero-bg.jpg',
    '/images/logo.png'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    console.log(`${name} took ${end - start} milliseconds`);
    
    // Send to analytics if needed
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(end - start)
      });
    }
    
    return result;
  };
};

// Cache management
export const createCache = (maxSize = 100) => {
  const cache = new Map();
  
  return {
    get: (key) => cache.get(key),
    set: (key, value) => {
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      cache.set(key, value);
    },
    has: (key) => cache.has(key),
    delete: (key) => cache.delete(key),
    clear: () => cache.clear(),
    size: () => cache.size
  };
};

// Service Worker registration
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

export default {
  LazyComponents,
  optimizeImage,
  debounce,
  throttle,
  createIntersectionObserver,
  calculateVisibleItems,
  cleanupResources,
  preloadCriticalResources,
  measurePerformance,
  createCache,
  registerServiceWorker
};
