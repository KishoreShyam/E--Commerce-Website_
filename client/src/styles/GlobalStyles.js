import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Primary Colors */
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --primary-dark: #4c51bf;
    --primary-light: #a78bfa;
    
    /* Secondary Colors */
    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    --accent-gold: #fbbf24;
    --accent-emerald: #10b981;
    
    /* Neutral Colors */
    --white: #ffffff;
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #111827;
    
    /* Semantic Colors */
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
    --info: #3b82f6;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    
    /* Border Radius */
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-2xl: 1.5rem;
    --radius-full: 9999px;
    
    /* Spacing */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;
    --space-3xl: 4rem;
    
    /* Typography */
    --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-family-display: 'Playfair Display', serif;
    
    /* Transitions */
    --transition-fast: 0.15s ease-out;
    --transition-normal: 0.3s ease-out;
    --transition-slow: 0.5s ease-out;
    
    /* Z-index */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal-backdrop: 1040;
    --z-modal: 1050;
    --z-popover: 1060;
    --z-tooltip: 1070;
    --z-toast: 1080;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  body {
    font-family: var(--font-family-primary);
    font-weight: 400;
    line-height: 1.6;
    color: var(--gray-800);
    background: var(--gray-50);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--gray-100);
    border-radius: var(--radius-full);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--gray-300);
    border-radius: var(--radius-full);
    transition: background var(--transition-fast);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--gray-400);
  }

  /* Selection */
  ::selection {
    background: var(--primary-light);
    color: var(--white);
  }

  ::-moz-selection {
    background: var(--primary-light);
    color: var(--white);
  }

  /* Focus styles */
  :focus {
    outline: 2px solid var(--primary-light);
    outline-offset: 2px;
  }

  :focus:not(:focus-visible) {
    outline: none;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-family-display);
    font-weight: 600;
    line-height: 1.2;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
  }

  h2 {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
  }

  h3 {
    font-size: clamp(1.25rem, 3vw, 2rem);
  }

  h4 {
    font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  }

  h5 {
    font-size: clamp(1rem, 2vw, 1.25rem);
  }

  h6 {
    font-size: clamp(0.875rem, 1.5vw, 1rem);
  }

  p {
    margin-bottom: var(--space-md);
    color: var(--gray-600);
  }

  a {
    color: var(--primary-dark);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  a:hover {
    color: var(--primary-light);
  }

  /* Form elements */
  input, textarea, select, button {
    font-family: inherit;
    font-size: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    transition: all var(--transition-fast);
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Lists */
  ul, ol {
    padding-left: var(--space-lg);
  }

  li {
    margin-bottom: var(--space-xs);
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-md);
  }

  .text-center {
    text-align: center;
  }

  .text-gradient {
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Advanced Animation utilities */
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .animate-slide-up {
    animation: slideUp 0.6s ease-out;
  }

  .animate-scale-in {
    animation: scaleIn 0.4s ease-out;
  }

  .animate-bounce-in {
    animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .animate-glow {
    animation: glow 2s ease-in-out infinite alternate;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-pulse-glow {
    animation: pulseGlow 2s ease-in-out infinite;
  }

  .animate-gradient-shift {
    animation: gradientShift 3s ease infinite;
  }

  .animate-shimmer {
    animation: shimmer 2s linear infinite;
  }

  .glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }

  .neon-glow {
    box-shadow: 
      0 0 5px var(--primary-light),
      0 0 10px var(--primary-light),
      0 0 15px var(--primary-light),
      0 0 20px var(--primary-light);
  }

  .hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .magnetic-hover {
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .magnetic-hover:hover {
    transform: scale(1.05);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3) translateY(-50px);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes glow {
    from {
      text-shadow: 0 0 10px var(--primary-light), 0 0 20px var(--primary-light);
    }
    to {
      text-shadow: 0 0 20px var(--primary-light), 0 0 30px var(--primary-light), 0 0 40px var(--primary-light);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes pulseGlow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }
    50% {
      box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.4);
    }
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  /* Particle background animation */
  @keyframes particle-float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    33% {
      transform: translateY(-30px) rotate(120deg);
    }
    66% {
      transform: translateY(30px) rotate(240deg);
    }
  }

  .particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    animation: particle-float 6s ease-in-out infinite;
  }

  .particle:nth-child(1) { animation-delay: 0s; }
  .particle:nth-child(2) { animation-delay: 1s; }
  .particle:nth-child(3) { animation-delay: 2s; }
  .particle:nth-child(4) { animation-delay: 3s; }
  .particle:nth-child(5) { animation-delay: 4s; }

  /* Responsive breakpoints */
  @media (max-width: 640px) {
    .container {
      padding: 0 var(--space-sm);
    }
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

export default GlobalStyles;
