"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const VENTURES = [
  { name: "CONCIERA", tag: "hospitality intelligence", color: "#e8c88a" },
  { name: "KNEXO", tag: "connection layer", color: "#a8c4b8" },
  { name: "TEG+", tag: "corporate operations OS", color: "#c9a56b" },
  { name: "LOVEDOPA", tag: "relationship intelligence", color: "#d4a3b8" },
  { name: "ZETTAPAY", tag: "payments infrastructure", color: "#a8c4b8" },
];

export function VenturesRoom({
  position = [0, 1.6, -52],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      {VENTURES.map((v, i) => {
        const angle = (i / VENTURES.length) * Math.PI * 2 + Math.PI;
        const radius = 5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius - 5;
        return (
          <VentureSculpture
            key={v.name}
            venture={v}
            position={[x, 0, z]}
            index={i}
          />
        );
      })}
    </group>
  );
}

function VentureSculpture({
  venture,
  position,
  index,
}: {
  venture: (typeof VENTURES)[number];
  position: [number, number, number];
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.25 + index;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.4 + index) * 0.08;
  });

  return (
    <group position={position}>
      {/* Pedestal */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.15, 32]} />
        <meshStandardMaterial color="#ddd8c9" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.05, 32]} />
        <meshStandardMaterial color="#9b7f4e" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Sculpture — torus knot per venture */}
      <group ref={groupRef} position={[0, 0.2, 0]}>
        <mesh>
          <torusKnotGeometry args={[0.35, 0.1, 100, 16]} />
          <meshStandardMaterial
            color={venture.color}
            metalness={0.7}
            roughness={0.25}
            emissive={venture.color}
            emissiveIntensity={0.2}
          />
        </mesh>
        <pointLight color={venture.color} intensity={0.5} distance={2.5} />
      </group>

      {/* Brass plaque on pedestal front */}
      <mesh position={[0, -0.55, 0.55]}>
        <planeGeometry args={[0.8, 0.12]} />
        <meshStandardMaterial
          color={venture.color}
          metalness={0.7}
          roughness={0.3}
          emissive={venture.color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}
