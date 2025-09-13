import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiShield, FiTruck, FiHeadphones } from 'react-icons/fi';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HomeContainer = styled.div`
  margin-top: 70px;
  overflow-x: hidden;
`;

const rippleEffect = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

const particleFloat = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
`;

const HeroSection = styled.section`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  cursor: default;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle 300px at var(--mouse-x, 50%) var(--mouse-y, 50%), 
      rgba(255, 255, 255, 0.25) 0%, 
      rgba(255, 255, 255, 0.1) 30%,
      transparent 70%);
    pointer-events: none;
    transition: all 0.2s ease;
    opacity: 0.8;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle 150px at var(--mouse-x, 50%) var(--mouse-y, 50%), 
      rgba(255, 255, 255, 0.15) 0%, 
      transparent 100%);
    pointer-events: none;
    transition: all 0.1s ease;
  }
`;

const MouseFollower = styled.div`
  display: none;
`;

const InteractiveParticle = styled(motion.div)`
  position: absolute;
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 100%);
  border-radius: 50%;
  pointer-events: none;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 40px rgba(255, 255, 255, 0.3);
  animation: ${particleFloat} 4s ease-in-out infinite;
`;

const RippleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`;

const Ripple = styled.div`
  position: absolute;
  border: 4px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: ${rippleEffect} 0.8s ease-out;
  pointer-events: none;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.2);
`;

const floatingAnimation = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -10px) rotate(1deg); }
  50% { transform: translate(-5px, -20px) rotate(-1deg); }
  75% { transform: translate(-10px, -5px) rotate(0.5deg); }
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="rgba(255,255,255,0.3)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient></defs><circle cx="200" cy="200" r="100" fill="url(%23a)"/><circle cx="800" cy="300" r="150" fill="url(%23a)"/><circle cx="400" cy="700" r="120" fill="url(%23a)"/></svg>') no-repeat center;
  background-size: cover;
  opacity: 0.6;
  animation: ${floatingAnimation} 20s ease-in-out infinite;
  z-index: 1;
`;

const ParticleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5), 0 0 25px rgba(255, 255, 255, 0.2);
`;

const GeometricShape = styled(motion.div)`
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  
  &.triangle {
    width: 0;
    height: 0;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 43px solid rgba(255, 255, 255, 0.2);
    border-radius: 0;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.1));
  }
  
  &.square {
    width: 40px;
    height: 40px;
    border-radius: 8px;
  }
  
  &.circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  z-index: 1;
  min-height: 80vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
    padding: 0 1rem;
  }
`;

const HeroText = styled(motion.div)`
  color: white;

  h1 {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    color: white;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    color: rgba(255, 255, 255, 0.95);
    max-width: 500px;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const PrimaryButton = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.6);
    color: white;
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.2);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(8px) rotate(15deg);
  }
`;

const SecondaryButton = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
`;

const pulseGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1), 0 0 40px rgba(255, 255, 255, 0.05);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 40px rgba(255, 255, 255, 0.2), 0 0 80px rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
`;

const HeroImage = styled(motion.div)`
  position: relative;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%);
    border-radius: 50%;
    animation: float 6s ease-in-out infinite, ${pulseGlow} 4s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    animation: float 8s ease-in-out infinite reverse;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-30px) rotate(5deg); }
  }
`;

const FloatingCard = styled(motion.div)`
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 1.5rem;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 0 20px rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 500;
  
  span {
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  p {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    opacity: 0.9;
  }

  &:hover {
    transform: translateY(-10px) scale(1.05);
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25), 0 0 40px rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:nth-child(1) {
    top: 10%;
    left: 10%;
    width: 200px;
    animation: float 6s ease-in-out infinite;
  }

  &:nth-child(2) {
    top: 60%;
    right: 10%;
    width: 180px;
    animation: float 8s ease-in-out infinite 2s;
  }

  &:nth-child(3) {
    bottom: 10%;
    left: 20%;
    width: 160px;
    animation: float 7s ease-in-out infinite 4s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
`;

const FeaturesSection = styled.section`
  padding: var(--space-3xl) 0;
  background: var(--gray-50);
`;

const FeaturesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-2xl);
`;

const FeatureCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
    transition: left 0.6s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-15px) rotateY(5deg);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 0 30px rgba(102, 126, 234, 0.2);
  }

  .icon {
    width: 70px;
    height: 70px;
    margin: 0 auto 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 28px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  &:hover .icon {
    transform: scale(1.1) rotate(360deg);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #1a1a1a;
    transition: color 0.3s ease;
  }

  &:hover h3 {
    color: #667eea;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
`;

const StatsSection = styled.section`
  padding: var(--space-3xl) 0;
  background: var(--gray-900);
  color: white;
`;

const StatsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-2xl);
  text-align: center;
`;

const StatItem = styled(motion.div)`
  .number {
    font-size: 3rem;
    font-weight: 800;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: var(--space-sm);
  }

  .label {
    font-size: 1.1rem;
    color: var(--gray-300);
    font-weight: 500;
  }
`;

const CTASection = styled.section`
  padding: var(--space-3xl) 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
  color: white;
`;

const CTAContent = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--space-md);

  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    margin-bottom: var(--space-lg);
    color: white;
  }

  p {
    font-size: 1.25rem;
    margin-bottom: var(--space-2xl);
    color: rgba(255, 255, 255, 0.9);
  }
`;

const Home = () => {
  const heroRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);
  const [interactiveParticles, setInteractiveParticles] = useState([]);
  const [cursorTrail, setCursorTrail] = useState([]);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // Particle system
  const [particles, setParticles] = useState([]);
  const [geometricShapes, setGeometricShapes] = useState([]);

  useEffect(() => {
    // Generate particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2
    }));
    setParticles(newParticles);

    // Generate geometric shapes
    const shapes = ['triangle', 'square', 'circle'];
    const newShapes = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      type: shapes[Math.floor(Math.random() * shapes.length)],
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: Math.random() * 3,
      duration: 8 + Math.random() * 4
    }));
    setGeometricShapes(newShapes);

    // Generate interactive particles
    const newInteractiveParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      baseX: Math.random() * window.innerWidth,
      baseY: Math.random() * window.innerHeight
    }));
    setInteractiveParticles(newInteractiveParticles);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      
      setMousePosition({ x, y });
      mouseX.set(x);
      mouseY.set(y);

      // Update CSS custom properties for background gradient
      const heroSection = heroRef.current;
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const mouseXPercent = ((x - rect.left) / rect.width) * 100;
        const mouseYPercent = ((y - rect.top) / rect.height) * 100;
        
        heroSection.style.setProperty('--mouse-x', `${mouseXPercent}%`);
        heroSection.style.setProperty('--mouse-y', `${mouseYPercent}%`);
      }

      // Update interactive particles
      setInteractiveParticles(prev => prev.map(particle => {
        const distance = Math.sqrt(
          Math.pow(x - particle.baseX, 2) + Math.pow(y - particle.baseY, 2)
        );
        const maxDistance = 200;
        const force = Math.max(0, (maxDistance - distance) / maxDistance);
        
        return {
          ...particle,
          x: particle.baseX + (x - particle.baseX) * force * 0.3,
          y: particle.baseY + (y - particle.baseY) * force * 0.3
        };
      }));

      // Add cursor trail
      setCursorTrail(prev => [
        { x, y, id: Date.now() },
        ...prev.slice(0, 10)
      ]);
    };

    const handleClick = (e) => {
      // Create ripple effect
      const newRipple = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now()
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 800);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.floating-card', 
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.floating-card',
            start: 'top 80%'
          }
        }
      );

      gsap.fromTo('.stat-number',
        { scale: 0 },
        {
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.stats-section',
            start: 'top 70%'
          }
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <HomeContainer ref={heroRef}>
      {/* Custom Cursor */}
      <MouseFollower
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      />
      
      <HeroSection>
        <HeroBackground style={{ y }} />
        
        {/* Ripple Effects */}
        <RippleContainer>
          {ripples.map((ripple) => (
            <Ripple
              key={ripple.id}
              style={{
                left: ripple.x - 75,
                top: ripple.y - 75,
                width: 150,
                height: 150,
              }}
            />
          ))}
        </RippleContainer>
        
        {/* Interactive Particles */}
        <ParticleContainer>
          {interactiveParticles.map((particle) => (
            <InteractiveParticle
              key={particle.id}
              style={{
                left: particle.x,
                top: particle.y,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: particle.id * 0.1,
              }}
            />
          ))}
          
          {/* Cursor Trail */}
          {cursorTrail.map((trail, index) => (
            <motion.div
              key={trail.id}
              style={{
                position: 'absolute',
                left: trail.x - 4,
                top: trail.y - 4,
                width: 8,
                height: 8,
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.3) 100%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.7)',
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ 
                opacity: 0, 
                scale: 0,
              }}
              transition={{ duration: 1.5 }}
            />
          ))}
          
          {particles.map((particle) => (
            <Particle
              key={particle.id}
              initial={{ 
                x: particle.x, 
                y: particle.y, 
                opacity: 0,
                scale: 0
              }}
              animate={{
                y: [particle.y, particle.y - 100, particle.y - 200],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
          
          {geometricShapes.map((shape) => (
            <GeometricShape
              key={shape.id}
              className={shape.type}
              initial={{ 
                x: shape.x, 
                y: shape.y, 
                opacity: 0,
                rotate: 0
              }}
              animate={{
                y: [shape.y, shape.y - 50, shape.y],
                opacity: [0, 0.3, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: shape.duration,
                delay: shape.delay,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          ))}
        </ParticleContainer>
        
        <HeroContent style={{ zIndex: 2, position: 'relative' }}>
          <HeroText
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              transform: `translate(${mouseXSpring.get() * 0.02}px, ${mouseYSpring.get() * 0.02}px)`
            }}
          >
            <h1>Luxury Shopping Redefined</h1>
            <p>
              Discover premium products, exceptional quality, and unmatched service. 
              Experience the future of e-commerce with LuxeCommerce.
            </p>
            <HeroButtons>
              <PrimaryButton
                to="/products"
                whileHover={{ 
                  scale: 1.05,
                  rotateX: 10,
                  rotateY: 10,
                  z: 50
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${mousePosition.y * 0.01}deg) rotateY(${mousePosition.x * 0.01}deg)`
                }}
              >
                Shop Now <FiArrowRight />
              </PrimaryButton>
              <SecondaryButton
                to="/about"
                whileHover={{ 
                  scale: 1.05,
                  rotateX: -10,
                  rotateY: -10,
                  z: 50
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${mousePosition.y * -0.01}deg) rotateY(${mousePosition.x * -0.01}deg)`
                }}
              >
                Learn More
              </SecondaryButton>
            </HeroButtons>
          </HeroText>

          <HeroImage
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            style={{
              transform: `translate(${mouseXSpring.get() * -0.03}px, ${mouseYSpring.get() * -0.03}px)`
            }}
          >
            <FloatingCard
              className="floating-card"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiStar style={{ color: '#fbbf24' }} />
                <span>4.9/5 Rating</span>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.8 }}>
                50,000+ Happy Customers
              </p>
            </FloatingCard>

            <FloatingCard
              className="floating-card"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiTruck style={{ color: '#10b981' }} />
                <span>Free Shipping</span>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.8 }}>
                On orders over ₹2000
              </p>
            </FloatingCard>

            <FloatingCard
              className="floating-card"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiShield style={{ color: '#3b82f6' }} />
                <span>Secure</span>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.8 }}>
                100% Protected
              </p>
            </FloatingCard>
          </HeroImage>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <FeaturesGrid>
          <FeatureCard
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="icon">
              <FiShield />
            </div>
            <h3>Secure Shopping</h3>
            <p>Your data and transactions are protected with enterprise-grade security measures.</p>
          </FeatureCard>

          <FeatureCard
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="icon">
              <FiTruck />
            </div>
            <h3>Fast Delivery</h3>
            <p>Get your orders delivered quickly with our premium shipping partners worldwide.</p>
          </FeatureCard>

          <FeatureCard
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="icon">
              <FiHeadphones />
            </div>
            <h3>24/7 Support</h3>
            <p>Our dedicated support team is always ready to help you with any questions.</p>
          </FeatureCard>

          <FeatureCard
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="icon">
              <FiStar />
            </div>
            <h3>Premium Quality</h3>
            <p>Every product is carefully curated to meet our high standards of quality and luxury.</p>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <StatsSection className="stats-section">
        <StatsGrid>
          <StatItem
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="number stat-number">50K+</div>
            <div className="label">Happy Customers</div>
          </StatItem>

          <StatItem
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="number stat-number">10K+</div>
            <div className="label">Premium Products</div>
          </StatItem>

          <StatItem
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="number stat-number">99%</div>
            <div className="label">Satisfaction Rate</div>
          </StatItem>

          <StatItem
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="number stat-number">24/7</div>
            <div className="label">Customer Support</div>
          </StatItem>
        </StatsGrid>
      </StatsSection>

      <CTASection>
        <CTAContent
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Experience Luxury?</h2>
          <p>Join thousands of satisfied customers and discover what makes LuxeCommerce special.</p>
          <PrimaryButton
            to="/products"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Shopping <FiArrowRight />
          </PrimaryButton>
        </CTAContent>
      </CTASection>
    </HomeContainer>
  );
};

export default Home;
