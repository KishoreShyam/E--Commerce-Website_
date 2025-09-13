import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const spinGlow = keyframes`
  0% {
    transform: rotate(0deg);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.6), 0 0 60px rgba(118, 75, 162, 0.4);
  }
  100% {
    transform: rotate(360deg);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
`;

const LoadingContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
`;

const Spinner = styled.div`
  width: 80px;
  height: 80px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: ${spinGlow} 1s linear infinite;
`;

const InnerSpinner = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 60px;
  height: 60px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-bottom: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: ${spinGlow} 0.8s linear infinite reverse;
`;

const LoadingText = styled(motion.h2)`
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  text-align: center;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 1rem;
`;

const Dot = styled(motion.div)`
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
`;

const LoadingSpinner = ({ text = "Loading LuxeCommerce..." }) => {
  return (
    <LoadingContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SpinnerWrapper>
        <Spinner />
        <InnerSpinner />
      </SpinnerWrapper>
      
      <LoadingText
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {text}
      </LoadingText>
      
      <DotsContainer>
        {[0, 1, 2].map((i) => (
          <Dot
            key={i}
            animate={{
              y: [0, -10, 0],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </DotsContainer>
    </LoadingContainer>
  );
};

export default LoadingSpinner;
