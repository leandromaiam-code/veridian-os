"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function ManifestoRoom({
  position = [0, 1.6, -7],
}: {
  position?: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Brass pillars lining a corridor
  const pillars = [];
  for (let i = 0; i < 10; i++) {
    const z = -i * 1.4;
    const side = i % 2 === 0 ? -1 : 1;
    pillars.push({ z, side });
  }

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, idx) => {
      child.position.y = Math.sin(t * 0.3 + idx * 0.7) * 0.03;
    });
  });

  return (
    <group position={position}>
      <group ref={groupRef}>
        {pillars.map((p, i) => (
          <group key={i} position={[p.side * 2.6, 0, p.z]}>
            {/* Tall brass pillar */}
            <mesh>
              <cylinderGeometry args={[0.06, 0.06, 4.5, 16]} />
              <meshStandardMaterial
                color="#c9a56b"
                roughness={0.35}
                metalness={0.85}
                emissive="#9b7f4e"
                emissiveIntensity={0.08}
              />
            </mesh>
            {/* Tiny floating sphere at top */}
            <mesh position={[0, 2.4, 0]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial
                color="#e8c88a"
                emissive="#e8c88a"
                emissiveIntensity={0.6}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* A soft brass ribbon arching above */}
      <mesh position={[0, 2.4, -6]}>
        <torusGeometry args={[3, 0.02, 8, 64, Math.PI]} />
        <meshStandardMaterial
          color="#c9a56b"
          roughness={0.3}
          metalness={0.9}
          emissive="#9b7f4e"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
}
