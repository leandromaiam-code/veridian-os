"use client";

import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";

export function SanctumRoom({
  position = [0, 1.6, -68],
}: {
  position?: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null);
  const tex = useLoader(TextureLoader, "/assets/logos/veridian-symbol.png");
  tex.anisotropy = 16;
  tex.colorSpace = THREE.SRGBColorSpace;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.2) * 0.45;
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.1;
  });

  return (
    <group position={position}>
      <mesh position={[0, 0, -0.6]}>
        <circleGeometry args={[4.5, 64]} />
        <meshBasicMaterial
          color="#e8c88a"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0, -0.5]}>
        <circleGeometry args={[3, 64]} />
        <meshBasicMaterial
          color="#a8c4b8"
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </mesh>
      <group ref={ref}>
        <mesh>
          <planeGeometry args={[3.6, 3.6]} />
          <meshBasicMaterial
            map={tex}
            transparent
            alphaTest={0.05}
            toneMapped={false}
          />
        </mesh>
        <pointLight color="#e8c88a" intensity={1.4} distance={6} />
      </group>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 3.2;
        const z = Math.sin(angle) * 3.2;
        return (
          <mesh key={i} position={[x, 0, z]}>
            <cylinderGeometry args={[0.04, 0.04, 4, 12]} />
            <meshStandardMaterial
              color="#c9a56b"
              metalness={0.85}
              roughness={0.3}
              emissive="#9b7f4e"
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}
