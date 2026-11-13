'use client';

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Float, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

// ─── Neon Edge Light Strip ─────────────────────────────────────

function NeonStrip({
  position,
  color,
  rotation,
  length = 2,
}: {
  position: [number, number, number];
  color: string;
  rotation?: [number, number, number];
  length?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.8 + Math.sin(clock.getElapsedTime() * 2) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <boxGeometry args={[0.04, 0.04, length]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
    </mesh>
  );
}

// ─── Refrigerator Silhouette ───────────────────────────────────

function Refrigerator({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.1}>
      <group position={position}>
        <RoundedBox args={[1.2, 3.5, 0.9]} radius={0.08}>
          <meshStandardMaterial
            color="#121215"
            metalness={0.9}
            roughness={0.1}
            emissive="#1a1a2e"
            emissiveIntensity={0.3}
          />
        </RoundedBox>
        {/* Handles */}
        <mesh position={[0.5, 0.6, 0.48]}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshStandardMaterial color="#d97706" metalness={1} roughness={0.1} emissive="#d97706" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.5, -0.6, 0.48]}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshStandardMaterial color="#d97706" metalness={1} roughness={0.1} emissive="#d97706" emissiveIntensity={0.5} />
        </mesh>
        {/* Neon accents */}
        <NeonStrip position={[-0.62, 0, 0]} color="#d97706" rotation={[0, 0, 0]} length={3.2} />
        <NeonStrip position={[0.62, 0, 0]} color="#3b82f6" rotation={[0, 0, 0]} length={3.2} />
      </group>
    </Float>
  );
}

// ─── Built-in Oven Silhouette ──────────────────────────────────

function Oven({ position }: { position: [number, number, number] }) {
  const heatLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (heatLightRef.current) {
      heatLightRef.current.intensity = 0.8 + Math.sin(clock.getElapsedTime() * 3) * 0.3;
    }
  });

  return (
    <Float speed={0.3} rotationIntensity={0.03} floatIntensity={0.06}>
      <group position={position}>
        {/* Main Body */}
        <RoundedBox args={[1.3, 1.3, 1.1]} radius={0.06}>
          <meshStandardMaterial color="#0e0e12" metalness={0.92} roughness={0.1} />
        </RoundedBox>

        {/* Glass Door Window */}
        <mesh position={[0, -0.1, 0.56]}>
          <planeGeometry args={[0.95, 0.75]} />
          <meshStandardMaterial
            color="#1a1105"
            metalness={0.3}
            roughness={0.1}
            emissive="#d97706"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Interior Oven Heat Glow */}
        <pointLight
          ref={heatLightRef}
          position={[0, -0.1, 0.3]}
          color="#f59e0b"
          intensity={0.8}
          distance={2.5}
        />

        {/* Control Panel Bar & Dials */}
        <mesh position={[0, 0.45, 0.56]}>
          <planeGeometry args={[1.15, 0.25]} />
          <meshStandardMaterial color="#1f1f24" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[-0.35, 0.45, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          <meshStandardMaterial color="#d97706" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[0.35, 0.45, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          <meshStandardMaterial color="#d97706" metalness={1} roughness={0.1} />
        </mesh>

        {/* Door Handle */}
        <mesh position={[0, 0.25, 0.62]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.9, 12]} />
          <meshStandardMaterial color="#e2e8f0" metalness={1} roughness={0.05} />
        </mesh>

        {/* Neon Outline */}
        <NeonStrip position={[0, 0.66, 0]} color="#d97706" rotation={[0, Math.PI / 2, 0]} length={1.1} />
        <NeonStrip position={[0, -0.66, 0]} color="#d97706" rotation={[0, Math.PI / 2, 0]} length={1.1} />
      </group>
    </Float>
  );
}

// ─── Washing Machine Silhouette ────────────────────────────────

function WashingMachine({ position }: { position: [number, number, number] }) {
  const drumRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (drumRef.current) drumRef.current.rotation.z += delta * 0.3;
  });

  return (
    <Float speed={0.4} rotationIntensity={0.04} floatIntensity={0.08}>
      <group position={position}>
        <RoundedBox args={[1.3, 1.3, 1.1]} radius={0.07}>
          <meshStandardMaterial color="#121215" metalness={0.8} roughness={0.15} />
        </RoundedBox>
        {/* Drum window */}
        <mesh ref={drumRef} position={[0, 0, 0.56]}>
          <torusGeometry args={[0.38, 0.06, 16, 32]} />
          <meshStandardMaterial color="#d97706" emissive="#d97706" emissiveIntensity={0.8} metalness={1} roughness={0} />
        </mesh>
        <mesh position={[0, 0, 0.56]}>
          <circleGeometry args={[0.32, 32]} />
          <meshStandardMaterial color="#0d0d10" transparent opacity={0.7} />
        </mesh>
        <NeonStrip position={[0, -0.68, 0]} color="#3b82f6" rotation={[0, Math.PI / 2, 0]} length={1.2} />
      </group>
    </Float>
  );
}

// ─── OLED TV with Logo Texture & Sub-Headline ──────────────────

function OledTV() {
  const screenRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  // Load the logo texture from exact path
  const texture = useLoader(THREE.TextureLoader, '/resim/pasaoglulogo.jpeg');

  useFrame(({ clock }) => {
    if (glowRef.current) {
      glowRef.current.intensity = 1.6 + Math.sin(clock.getElapsedTime() * 1.5) * 0.4;
    }
  });

  return (
    <group position={[0, 0.8, -6]}>
      {/* TV Stand */}
      <mesh position={[0, -1.9, 0]}>
        <boxGeometry args={[0.3, 0.6, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[0, -2.25, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* TV Ultra-thin Bezels */}
      <RoundedBox args={[6.6, 3.9, 0.08]} radius={0.06} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.05} />
      </RoundedBox>

      {/* Screen with Logo Texture */}
      <mesh ref={screenRef} position={[0, 0.25, 0.05]}>
        <planeGeometry args={[5.2, 2.7]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.4}
          toneMapped={false}
        />
      </mesh>

      {/* Subtle Sub-Headline on TV Screen Texture */}
      <Text
        position={[0, -1.4, 0.06]}
        fontSize={0.16}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        Eviniz İçin Geleceğin Teknolojisi
      </Text>

      {/* Screen Glowing Aura */}
      <pointLight ref={glowRef} position={[0, 0, 1]} color="#d97706" intensity={1.8} distance={9} />

      {/* Neon Edge Strips */}
      <NeonStrip position={[0, 2.0, 0.09]} color="#d97706" rotation={[0, Math.PI / 2, 0]} length={6.4} />
      <NeonStrip position={[0, -2.0, 0.09]} color="#d97706" rotation={[0, Math.PI / 2, 0]} length={6.4} />
      <NeonStrip position={[-3.3, 0, 0.09]} color="#3b82f6" rotation={[Math.PI / 2, 0, 0]} length={3.8} />
      <NeonStrip position={[3.3, 0, 0.09]} color="#3b82f6" rotation={[Math.PI / 2, 0, 0]} length={3.8} />
    </group>
  );
}

// ─── Main Appliance Models ─────────────────────────────────────

export function ApplianceModels() {
  return (
    <group>
      {/* Refrigerators (Outer flank) */}
      <Refrigerator position={[-5.5, -0.2, -3]} />
      <Refrigerator position={[5.5, -0.2, -3]} />

      {/* Ovens (Middle flank) */}
      <Oven position={[-3.6, -0.8, -2.5]} />
      <Oven position={[3.6, -0.8, -2.5]} />

      {/* Washing Machines (Foreground flank) */}
      <WashingMachine position={[-2.4, -1.75, -1.2]} />
      <WashingMachine position={[2.4, -1.75, -1.2]} />

      {/* 4K Smart OLED TV — focal point */}
      <OledTV />
    </group>
  );
}
