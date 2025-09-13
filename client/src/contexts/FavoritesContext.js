import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const FavoritesContext = createContext();

const initialState = {
  favorites: JSON.parse(localStorage.getItem('favorites')) || [],
  loading: false,
};

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_FAVORITES':
      localStorage.setItem('favorites', JSON.stringify(action.payload));
      return {
        ...state,
        favorites: action.payload,
        loading: false,
      };
    case 'ADD_FAVORITE':
      const newFavorites = [...state.favorites, action.payload];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return {
        ...state,
        favorites: newFavorites,
      };
    case 'REMOVE_FAVORITE':
      const filteredFavorites = state.favorites.filter(
        item => item._id !== action.payload
      );
      localStorage.setItem('favorites', JSON.stringify(filteredFavorites));
      return {
        ...state,
        favorites: filteredFavorites,
      };
    case 'CLEAR_FAVORITES':
      localStorage.removeItem('favorites');
      return {
        ...state,
        favorites: [],
      };
    default:
      return state;
  }
};

export const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Sync favorites with server when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      syncFavoritesWithServer();
    }
  }, [isAuthenticated, user]);

  const syncFavoritesWithServer = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get('/api/favorites');
      dispatch({ type: 'SET_FAVORITES', payload: response.data.favorites || [] });
    } catch (error) {
      console.error('Failed to sync favorites:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addFavorite = async (product) => {
    const exists = state.favorites.find(item => item._id === product._id);
    if (exists) return;

    // Optimistically update UI
    dispatch({ type: 'ADD_FAVORITE', payload: product });

    // Sync with server if authenticated
    if (isAuthenticated) {
      try {
        await api.post('/api/favorites', { 
          productId: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.image,
          description: product.description,
          rating: product.rating,
          reviewCount: product.reviewCount
        });
      } catch (error) {
        // Revert on error
        dispatch({ type: 'REMOVE_FAVORITE', payload: product._id });
        toast.error('Failed to add to favorites');
        console.error('Failed to add favorite:', error);
      }
    }
  };

  const removeFavorite = async (productId) => {
    const product = state.favorites.find(item => item._id === productId);
    
    // Optimistically update UI
    dispatch({ type: 'REMOVE_FAVORITE', payload: productId });

    // Sync with server if authenticated
    if (isAuthenticated) {
      try {
        await api.delete(`/api/favorites/${productId}`);
      } catch (error) {
        // Revert on error
        if (product) {
          dispatch({ type: 'ADD_FAVORITE', payload: product });
        }
        toast.error('Failed to remove from favorites');
        console.error('Failed to remove favorite:', error);
      }
    }
  };

  const toggleFavorite = (product) => {
    const exists = state.favorites.find(item => item._id === product._id);
    if (exists) {
      removeFavorite(product._id);
    } else {
      addFavorite(product);
    }
  };

  const isFavorite = (productId) => {
    return state.favorites.some(item => item._id === productId);
  };

  const clearFavorites = async () => {
    dispatch({ type: 'CLEAR_FAVORITES' });
    
    if (isAuthenticated) {
      try {
        await api.delete('/api/favorites');
      } catch (error) {
        console.error('Failed to clear favorites:', error);
      }
    }
  };

  const value = {
    favorites: state.favorites,
    loading: state.loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
