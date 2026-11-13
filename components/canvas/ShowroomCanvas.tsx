'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { DroneCamera } from './DroneCamera';
import { ApplianceModels } from './ApplianceModels';

function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = new Float32Array(300 * 3);

  for (let i = 0; i < 300; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#d97706"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function FloorGrid() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
      <planeGeometry args={[60, 60, 30, 30]} />
      <meshStandardMaterial
        color="#09090b"
        wireframe
        transparent
        opacity={0.15}
        emissive="#475569"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

export function ShowroomCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 14], fov: 60, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        shadows
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.15} color="#1a1a2e" />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.8}
          color="#e2e8f0"
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-8, 4, -4]} intensity={1.5} color="#d97706" />
        <pointLight position={[8, 4, -4]} intensity={0.8} color="#3b82f6" />
        <spotLight
          position={[0, 8, 0]}
          angle={0.5}
          penumbra={0.8}
          intensity={2}
          color="#e2e8f0"
          castShadow
          target-position={[0, 0, 0]}
        />

        {/* Background */}
        <Stars radius={80} depth={40} count={3000} factor={3} fade speed={0.5} />
        <AmbientParticles />
        <FloorGrid />

        {/* Scene Objects */}
        <Suspense fallback={null}>
          <ApplianceModels />
          <Environment preset="night" />
        </Suspense>

        {/* Animated Camera */}
        <DroneCamera />
      </Canvas>
    </div>
  );
}

