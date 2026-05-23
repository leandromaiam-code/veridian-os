"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const STEPS = [
  { num: "01", label: "Idea" },
  { num: "02", label: "Research" },
  { num: "03", label: "Build" },
  { num: "04", label: "Launch" },
  { num: "05", label: "Scale" },
];

export function MethodRoom({
  position = [0, 1.6, -42],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Brass arc line connecting steps */}
      {STEPS.map((s, i) => {
        const next = STEPS[i + 1];
        if (!next) return null;
        const x = (i - 2) * 2;
        return (
          <mesh key={`line-${s.num}`} position={[x + 1, 0, 0]}>
            <boxGeometry args={[2, 0.015, 0.015]} />
            <meshStandardMaterial
              color="#c9a56b"
              emissive="#9b7f4e"
              emissiveIntensity={0.4}
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        );
      })}
      {STEPS.map((s, i) => (
        <Pedestal key={s.num} step={s} x={(i - 2) * 2} index={i} />
      ))}
    </group>
  );
}

function Pedestal({
  step,
  x,
  index,
}: {
  step: (typeof STEPS)[number];
  x: number;
  index: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.5 + index) * 0.04;
    ref.current.rotation.y = t * 0.2 + index;
  });

  return (
    <group position={[x, 0, 0]}>
      {/* Floating crystal */}
      <group ref={ref} position={[0, 0.4, 0]}>
        <mesh>
          <octahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial
            color="#a8c4b8"
            roughness={0.2}
            metalness={0.5}
            emissive="#2d5d4e"
            emissiveIntensity={0.3}
          />
        </mesh>
        <pointLight color="#a8c4b8" intensity={0.6} distance={2} />
      </group>
      {/* Pedestal base */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.5, 0.55, 0.1, 32]} />
        <meshStandardMaterial color="#ddd8c9" roughness={0.6} />
      </mesh>
      {/* Numbered tick */}
      <mesh position={[0, -0.65, 0.3]}>
        <ringGeometry args={[0.12, 0.14, 32]} />
        <meshBasicMaterial color="#9b7f4e" />
      </mesh>
    </group>
  );
}
