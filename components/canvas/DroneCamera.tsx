'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';

interface DroneCameraProps {
  onComplete?: () => void;
}

export function DroneCamera({ onComplete }: DroneCameraProps) {
  const { camera } = useThree();
  const hasAnimated = useRef(false);
  const isAnimationDone = useRef(false);
  const targetPos = useRef(new THREE.Vector3(0, 2, 14));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // Start position — high and back
    camera.position.set(0, 8, 24);
    camera.lookAt(0, 0, 0);

    const tl = gsap.timeline({ delay: 0.5 });

    // Phase 1: Swoop forward through the showroom
    tl.to(targetPos.current, {
      x: 0,
      y: 3,
      z: 10,
      duration: 2.5,
      ease: 'power2.inOut',
    })
    // Phase 2: Bank left past appliances
    .to(targetPos.current, {
      x: -3,
      y: 2,
      z: 6,
      duration: 1.8,
      ease: 'sine.inOut',
    })
    // Phase 3: Bank right
    .to(targetPos.current, {
      x: 3,
      y: 1.5,
      z: 4,
      duration: 1.5,
      ease: 'sine.inOut',
    })
    // Phase 4: Center and decelerate in front of TV
    .to(targetPos.current, {
      x: 0,
      y: 1.2,
      z: 3.5,
      duration: 2,
      ease: 'expo.out',
      onComplete: () => {
        isAnimationDone.current = true;
        onComplete?.();
      },
    });

    // Look-at animation
    gsap.to(targetLookAt.current, {
      x: 0,
      y: 0.5,
      z: -6,
      duration: 7,
      ease: 'power1.inOut',
    });
  }, [camera, onComplete]);

  useFrame(({ pointer }) => {
    if (isAnimationDone.current) {
      // Gentle interactive mouse parallax
      const parallaxX = pointer.x * 0.5;
      const parallaxY = pointer.y * 0.25;

      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        targetPos.current.x + parallaxX,
        0.05
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        targetPos.current.y + parallaxY,
        0.05
      );
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        targetPos.current.z,
        0.05
      );
    } else {
      camera.position.lerp(targetPos.current, 0.05);
    }

    // Smooth look-at
    currentLookAt.current.lerp(targetLookAt.current, 0.03);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
