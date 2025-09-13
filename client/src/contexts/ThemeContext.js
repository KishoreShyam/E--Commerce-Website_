import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('primaryColor') || '#667eea';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    const saved = localStorage.getItem('animationsEnabled');
    return saved ? JSON.parse(saved) : true;
  });

  const [compactMode, setCompactMode] = useState(() => {
    const saved = localStorage.getItem('compactMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Update CSS variables and body class when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.style.setProperty('--bg-primary', '#1a1a1a');
      root.style.setProperty('--bg-secondary', '#2d2d2d');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#b3b3b3');
      root.style.setProperty('--border-color', '#404040');
      root.style.setProperty('--card-bg', '#2d2d2d');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.5)');
      document.body.classList.add('dark-mode');
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#ffffff';
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8f9fa');
      root.style.setProperty('--text-primary', '#333333');
      root.style.setProperty('--text-secondary', '#666666');
      root.style.setProperty('--border-color', '#e1e5e9');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
      document.body.classList.remove('dark-mode');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#333333';
    }

    root.style.setProperty('--primary-color', primaryColor);
    
    // Save to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    localStorage.setItem('primaryColor', primaryColor);
  }, [isDarkMode, primaryColor]);

  // Save other settings to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('animationsEnabled', JSON.stringify(animationsEnabled));
    
    // Add/remove animation class to body
    if (animationsEnabled) {
      document.body.classList.add('animations-enabled');
    } else {
      document.body.classList.remove('animations-enabled');
    }
  }, [animationsEnabled]);

  useEffect(() => {
    localStorage.setItem('compactMode', JSON.stringify(compactMode));
  }, [compactMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const toggleAnimations = () => {
    setAnimationsEnabled(prev => !prev);
  };

  const toggleCompactMode = () => {
    setCompactMode(prev => !prev);
  };

  const resetTheme = () => {
    setIsDarkMode(false);
    setPrimaryColor('#667eea');
    setSidebarCollapsed(false);
    setAnimationsEnabled(true);
    setCompactMode(false);
  };

  const value = {
    isDarkMode,
    primaryColor,
    sidebarCollapsed,
    animationsEnabled,
    compactMode,
    toggleDarkMode,
    setPrimaryColor,
    toggleSidebar,
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
