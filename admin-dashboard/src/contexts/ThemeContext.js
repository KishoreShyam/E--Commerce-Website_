import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ThemeContext = createContext();

const initialState = {
  isDarkMode: false,
  primaryColor: '#3b82f6',
  sidebarCollapsed: false,
  animationsEnabled: true,
  compactMode: false
};

const themeReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        isDarkMode: !state.isDarkMode
      };
    case 'SET_DARK_MODE':
      return {
        ...state,
        isDarkMode: action.payload
      };
    case 'SET_PRIMARY_COLOR':
      return {
        ...state,
        primaryColor: action.payload
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed
      };
    case 'SET_SIDEBAR_COLLAPSED':
      return {
        ...state,
        sidebarCollapsed: action.payload
      };
    case 'TOGGLE_ANIMATIONS':
      return {
        ...state,
        animationsEnabled: !state.animationsEnabled
      };
    case 'TOGGLE_COMPACT_MODE':
      return {
        ...state,
        compactMode: !state.compactMode
      };
    case 'RESET_THEME':
      return initialState;
    case 'LOAD_THEME':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        dispatch({ type: 'LOAD_THEME', payload: parsedTheme });
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('admin-theme', JSON.stringify(state));
  }, [state]);

  // Apply theme to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    
    if (state.isDarkMode) {
      root.style.setProperty('--bg-primary', '#1f2937');
      root.style.setProperty('--bg-secondary', '#111827');
      root.style.setProperty('--bg-tertiary', '#374151');
      root.style.setProperty('--text-primary', '#f9fafb');
      root.style.setProperty('--text-secondary', '#d1d5db');
      root.style.setProperty('--text-tertiary', '#9ca3af');
      root.style.setProperty('--border-light', '#374151');
      root.style.setProperty('--border-medium', '#4b5563');
      root.style.setProperty('--border-dark', '#6b7280');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f9fafb');
      root.style.setProperty('--bg-tertiary', '#f3f4f6');
      root.style.setProperty('--text-primary', '#111827');
      root.style.setProperty('--text-secondary', '#6b7280');
      root.style.setProperty('--text-tertiary', '#9ca3af');
      root.style.setProperty('--border-light', '#e5e7eb');
      root.style.setProperty('--border-medium', '#d1d5db');
      root.style.setProperty('--border-dark', '#9ca3af');
    }

    root.style.setProperty('--color-primary', state.primaryColor);
    
    // Update body class for dark mode
    if (state.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [state.isDarkMode, state.primaryColor]);

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const setDarkMode = (isDark) => {
    dispatch({ type: 'SET_DARK_MODE', payload: isDark });
  };

  const setPrimaryColor = (color) => {
    dispatch({ type: 'SET_PRIMARY_COLOR', payload: color });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setSidebarCollapsed = (collapsed) => {
    dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: collapsed });
  };

  const toggleAnimations = () => {
    dispatch({ type: 'TOGGLE_ANIMATIONS' });
  };

  const toggleCompactMode = () => {
    dispatch({ type: 'TOGGLE_COMPACT_MODE' });
  };

  const resetTheme = () => {
    dispatch({ type: 'RESET_THEME' });
  };

  const value = {
    ...state,
    toggleDarkMode,
    setDarkMode,
    setPrimaryColor,
    toggleSidebar,
    setSidebarCollapsed,
    toggleAnimations,
    toggleCompactMode,
    resetTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
