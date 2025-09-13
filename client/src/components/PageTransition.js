import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 100,
    scale: 0.8,
    rotateX: -15,
    filter: "blur(10px)"
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: "blur(0px)"
  },
  out: {
    opacity: 0,
    y: -100,
    scale: 1.1,
    rotateX: 15,
    filter: "blur(10px)"
  }
};

const pageTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 1.2
};

const slideVariants = {
  initial: {
    x: "120vw",
    opacity: 0,
    rotateY: -45,
    filter: "blur(8px)"
  },
  in: {
    x: 0,
    opacity: 1,
    rotateY: 0,
    filter: "blur(0px)"
  },
  out: {
    x: "-120vw",
    opacity: 0,
    rotateY: 45,
    filter: "blur(8px)"
  }
};

const scaleVariants = {
  initial: {
    scale: 0,
    opacity: 0,
    rotate: -360,
    filter: "blur(15px)"
  },
  in: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    filter: "blur(0px)"
  },
  out: {
    scale: 0,
    opacity: 0,
    rotate: 360,
    filter: "blur(15px)"
  }
};

const PageTransition = ({ children, variant = "fade" }) => {
  let variants = pageVariants;
  
  switch (variant) {
    case "slide":
      variants = slideVariants;
      break;
    case "scale":
      variants = scaleVariants;
      break;
    default:
      variants = pageVariants;
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={pageTransition}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
