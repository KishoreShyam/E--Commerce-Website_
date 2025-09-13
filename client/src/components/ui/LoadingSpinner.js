import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const SpinnerContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: var(--space-xl);
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-dark);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: var(--space-md);
`;

const LoadingText = styled.div`
  color: var(--gray-600);
  font-size: 16px;
  font-weight: 500;
  animation: ${pulse} 2s ease-in-out infinite;
  letter-spacing: 1px;
`;

const Dots = styled.span`
  &::after {
    content: '';
    animation: ${pulse} 1.5s ease-in-out infinite;
  }
`;

const LoadingSpinner = ({ text = 'Loading', size = 'medium' }) => {
  const sizeMap = {
    small: '40px',
    medium: '60px',
    large: '80px'
  };

  return (
    <SpinnerContainer
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <Spinner style={{ width: sizeMap[size], height: sizeMap[size] }} />
      <LoadingText>
        {text}
        <Dots>...</Dots>
      </LoadingText>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
