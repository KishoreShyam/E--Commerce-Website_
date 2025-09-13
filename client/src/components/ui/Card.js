import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

const StyledCard = styled(motion.div)`
  position: relative;
  background: ${props => props.glass ? 'rgba(255, 255, 255, 0.1)' : 'white'};
  border-radius: ${props => props.rounded ? '1.5rem' : '1rem'};
  padding: ${props => {
    switch (props.padding) {
      case 'sm': return '1rem';
      case 'lg': return '2rem';
      case 'xl': return '3rem';
      default: return '1.5rem';
    }
  }};
  box-shadow: ${props => {
    switch (props.shadow) {
      case 'sm': return '0 1px 3px rgba(0, 0, 0, 0.1)';
      case 'lg': return '0 10px 25px rgba(0, 0, 0, 0.1)';
      case 'xl': return '0 20px 40px rgba(0, 0, 0, 0.1)';
      case 'neon': return '0 0 20px rgba(102, 126, 234, 0.3)';
      default: return '0 4px 15px rgba(0, 0, 0, 0.1)';
    }
  }};
  border: ${props => props.border ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'};
  backdrop-filter: ${props => props.glass ? 'blur(10px)' : 'none'};
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${props => props.glass && css`
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `}

  ${props => props.gradient && css`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  `}

  ${props => props.hover && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
  `}

  ${props => props.glow && css`
    &:hover {
      box-shadow: 
        0 0 20px rgba(102, 126, 234, 0.4),
        0 0 40px rgba(102, 126, 234, 0.2);
    }
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.accent ? 'linear-gradient(90deg, #667eea, #764ba2)' : 'transparent'};
  }
`;

const CardHeader = styled.div`
  margin-bottom: 1rem;
  
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: ${props => props.gradient ? 'white' : '#1f2937'};
  }
  
  p {
    margin: 0;
    color: ${props => props.gradient ? 'rgba(255, 255, 255, 0.8)' : '#6b7280'};
    font-size: 0.875rem;
  }
`;

const CardContent = styled.div`
  color: ${props => props.gradient ? 'white' : '#374151'};
`;

const CardFooter = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.gradient ? 'rgba(255, 255, 255, 0.2)' : '#e5e7eb'};
`;

const Card = ({
  children,
  title,
  subtitle,
  footer,
  glass = false,
  gradient = false,
  hover = false,
  glow = false,
  rounded = false,
  border = false,
  accent = false,
  padding = 'md',
  shadow = 'md',
  className,
  onClick,
  ...props
}) => {
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: hover ? { y: -8, scale: 1.02 } : {},
  };

  return (
    <StyledCard
      glass={glass}
      gradient={gradient}
      hover={hover}
      glow={glow}
      rounded={rounded}
      border={border}
      accent={accent}
      padding={padding}
      shadow={shadow}
      className={className}
      onClick={onClick}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ duration: 0.3, ease: "easeOut" }}
      {...props}
    >
      {(title || subtitle) && (
        <CardHeader gradient={gradient}>
          {title && <h3>{title}</h3>}
          {subtitle && <p>{subtitle}</p>}
        </CardHeader>
      )}
      
      <CardContent gradient={gradient}>
        {children}
      </CardContent>
      
      {footer && (
        <CardFooter gradient={gradient}>
          {footer}
        </CardFooter>
      )}
    </StyledCard>
  );
};

export default Card;
