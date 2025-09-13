import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function Stars(props) {
  const ref = useRef();
  const [sphere] = useMemo(() => [random.inSphere(new Float32Array(5000), { radius: 1.5 })], []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ffa0e0"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function FloatingOrbs() {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = Math.sin(time) * 0.1;
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[2, 0, 0]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshBasicMaterial color="#667eea" transparent opacity={0.6} />
    </mesh>
  );
}

function AnimatedBackground() {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: -1,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Stars />
        <FloatingOrbs />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
      </Canvas>
    </div>
  );
}

export default AnimatedBackground;
