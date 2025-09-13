import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const GridContainer = styled(motion.div)`
  display: grid;
  gap: ${props => props.gap || '1.5rem'};
  width: 100%;
  
  /* Mobile First - 1 column by default */
  grid-template-columns: 1fr;
  
  /* Small tablets - 2 columns */
  @media (min-width: 640px) {
    grid-template-columns: ${props => 
      props.sm ? `repeat(${props.sm}, 1fr)` : 'repeat(2, 1fr)'
    };
  }
  
  /* Tablets - 3 columns */
  @media (min-width: 768px) {
    grid-template-columns: ${props => 
      props.md ? `repeat(${props.md}, 1fr)` : 'repeat(3, 1fr)'
    };
  }
  
  /* Small laptops - 4 columns */
  @media (min-width: 1024px) {
    grid-template-columns: ${props => 
      props.lg ? `repeat(${props.lg}, 1fr)` : 'repeat(4, 1fr)'
    };
  }
  
  /* Large screens - 5 columns */
  @media (min-width: 1280px) {
    grid-template-columns: ${props => 
      props.xl ? `repeat(${props.xl}, 1fr)` : 'repeat(5, 1fr)'
    };
  }
  
  /* Extra large screens - 6 columns */
  @media (min-width: 1536px) {
    grid-template-columns: ${props => 
      props['2xl'] ? `repeat(${props['2xl']}, 1fr)` : 'repeat(6, 1fr)'
    };
  }
`;

const GridItem = styled(motion.div)`
  width: 100%;
  min-width: 0; /* Prevents overflow */
  
  ${props => props.span && `
    grid-column: span ${props.span};
    
    @media (max-width: 639px) {
      grid-column: span 1; /* Always single column on mobile */
    }
  `}
`;

const ResponsiveGrid = ({ 
  children, 
  gap = '1.5rem',
  sm = 2,
  md = 3,
  lg = 4,
  xl = 5,
  xl2 = 6,
  className,
  ...props 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <GridContainer
      gap={gap}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      xl2={xl2}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <GridItem
          key={index}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          {child}
        </GridItem>
      ))}
    </GridContainer>
  );
};

export default ResponsiveGrid;
