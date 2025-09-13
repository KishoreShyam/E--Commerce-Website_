import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// Enhanced Page Transition with more visible effects
export const EnhancedPageTransition = ({ children, variant = 'fade' }) => {
  const variants = {
    fade: {
      initial: { opacity: 0, y: 50, scale: 0.95 },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
          staggerChildren: 0.1
        }
      },
      exit: { 
        opacity: 0, 
        y: -50, 
        scale: 1.05,
        transition: { duration: 0.5 }
      }
    },
    slide: {
      initial: { x: 100, opacity: 0, rotateY: 15 },
      animate: { 
        x: 0, 
        opacity: 1, 
        rotateY: 0,
        transition: {
          duration: 0.9,
          ease: [0.25, 0.46, 0.45, 0.94],
          staggerChildren: 0.15
        }
      },
      exit: { 
        x: -100, 
        opacity: 0, 
        rotateY: -15,
        transition: { duration: 0.6 }
      }
    },
    scale: {
      initial: { scale: 0.8, opacity: 0, rotateX: 20 },
      animate: { 
        scale: 1, 
        opacity: 1, 
        rotateX: 0,
        transition: {
          duration: 1,
          ease: [0.25, 0.46, 0.45, 0.94],
          staggerChildren: 0.2
        }
      },
      exit: { 
        scale: 1.1, 
        opacity: 0, 
        rotateX: -20,
        transition: { duration: 0.5 }
      }
    },
    bounce: {
      initial: { y: 100, opacity: 0, scale: 0.3 },
      animate: { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 20,
          duration: 1.2,
          staggerChildren: 0.1
        }
      },
      exit: { 
        y: -100, 
        opacity: 0, 
        scale: 0.3,
        transition: { duration: 0.4 }
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants[variant]}
      style={{ width: '100%', minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
};

// Floating Animation Component
export const FloatingElement = styled(motion.div)`
  animation: float 6s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-20px) rotate(1deg); }
    50% { transform: translateY(-10px) rotate(-1deg); }
    75% { transform: translateY(-15px) rotate(0.5deg); }
  }
`;

// Pulse Animation Component
export const PulseElement = styled(motion.div)`
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  
  @keyframes pulse {
    0%, 100% { 
      opacity: 1;
      transform: scale(1);
    }
    50% { 
      opacity: 0.8;
      transform: scale(1.05);
    }
  }
`;

// Shimmer Loading Animation
export const ShimmerElement = styled(motion.div)`
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

// Magnetic Button Effect
export const MagneticButton = ({ children, ...props }) => {
  return (
    <motion.button
      {...props}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        y: -5
      }}
      whileTap={{ 
        scale: 0.95,
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '12px',
        color: 'white',
        cursor: 'pointer',
        ...props.style
      }}
    >
      {children}
    </motion.button>
  );
};

// Card Hover Animation
export const AnimatedCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px) rotateX(5deg);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  }
`;

// Stagger Animation Container
export const StaggerContainer = ({ children, delay = 0.1 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
};

// Individual Stagger Item
export const StaggerItem = ({ children, ...props }) => {
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Morphing Background
export const MorphingBackground = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    #667eea,
    #764ba2,
    #f093fb,
    #f5576c,
    #4facfe,
    #00f2fe
  );
  background-size: 400% 400%;
  animation: morphing 15s ease infinite;
  z-index: -1;
  
  @keyframes morphing {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// Particle Effect Component
export const ParticleEffect = () => {
  const particles = Array.from({ length: 20 }, (_, i) => i);
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}>
      {particles.map((particle) => (
        <motion.div
          key={particle}
          style={{
            position: 'absolute',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: `hsl(${Math.random() * 360}, 70%, 70%)`,
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

// Text Animation Component
export const AnimatedText = ({ text, delay = 0.05 }) => {
  const letters = text.split('');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay
      }
    }
  };
  
  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -90
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };
  
  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'inline-block' }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          style={{ display: 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};
