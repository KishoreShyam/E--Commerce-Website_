import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    if (!isInWishlist(product._id || product.id)) {
      const wishlistItem = {
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      };
      
      setWishlist(prev => [...prev, wishlistItem]);
      toast.success(`${product.name} added to wishlist! ❤️`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  const removeFromWishlist = (productId) => {
    const item = wishlist.find(item => item.id === productId);
    setWishlist(prev => prev.filter(item => item.id !== productId));
    
    if (item) {
      toast.info(`${item.name} removed from wishlist`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  const toggleWishlist = (product) => {
    const productId = product._id || product.id;
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    toast.success('Wishlist cleared successfully');
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlist.length
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
