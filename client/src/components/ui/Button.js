import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

const StyledButton = styled(motion.button)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: ${props => {
    switch (props.size) {
      case 'sm': return '0.5rem 1rem';
      case 'lg': return '1rem 2rem';
      case 'xl': return '1.25rem 2.5rem';
      default: return '0.75rem 1.5rem';
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '0.875rem';
      case 'lg': return '1.125rem';
      case 'xl': return '1.25rem';
      default: return '1rem';
    }
  }};
  font-weight: 600;
  border-radius: ${props => props.rounded ? '9999px' : '0.75rem'};
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  text-decoration: none;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover:before {
    left: 100%;
  }

  ${props => props.variant === 'primary' && css`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}

  ${props => props.variant === 'secondary' && css`
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(240, 147, 251, 0.6);
    }
  `}

  ${props => props.variant === 'outline' && css`
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
    
    &:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
  `}

  ${props => props.variant === 'ghost' && css`
    background: rgba(255, 255, 255, 0.1);
    color: #374151;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  `}

  ${props => props.variant === 'neon' && css`
    background: transparent;
    color: #00f2fe;
    border: 2px solid #00f2fe;
    box-shadow: 
      0 0 10px rgba(0, 242, 254, 0.3),
      inset 0 0 10px rgba(0, 242, 254, 0.1);
    
    &:hover {
      background: rgba(0, 242, 254, 0.1);
      box-shadow: 
        0 0 20px rgba(0, 242, 254, 0.6),
        0 0 40px rgba(0, 242, 254, 0.4),
        inset 0 0 20px rgba(0, 242, 254, 0.2);
      transform: translateY(-2px);
    }
  `}

  ${props => props.loading && css`
    pointer-events: none;
    opacity: 0.7;
  `}

  ${props => props.disabled && css`
    pointer-events: none;
    opacity: 0.5;
    transform: none !important;
  `}
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className,
  ...props
}) => {
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      rounded={rounded}
      loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
};

export default Button;
