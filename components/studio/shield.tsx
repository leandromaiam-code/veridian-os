"use client";

import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";

export function Shield({
  position = [0, 1.6, 0],
}: {
  position?: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const tex = useLoader(TextureLoader, "/assets/logos/veridian-symbol.png");

  // Configure once
  tex.anisotropy = 16;
  tex.colorSpace = THREE.SRGBColorSpace;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.35;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.08;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Halos */}
      <mesh position={[0, 0, -0.5]}>
        <circleGeometry args={[3.4, 64]} />
        <meshBasicMaterial
          color="#c9a56b"
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0, -0.4]}>
        <circleGeometry args={[2.4, 64]} />
        <meshBasicMaterial
          color="#a8c4b8"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>
      {/* Shield with map */}
      <mesh>
        <planeGeometry args={[3.4, 3.4]} />
        <meshBasicMaterial
          map={tex}
          transparent
          alphaTest={0.05}
          toneMapped={false}
        />
      </mesh>
      {/* Reflection on floor */}
      <mesh
        position={[0, -3, 0.2]}
        rotation={[0, 0, Math.PI]}
        scale={[1, 0.5, 1]}
      >
        <planeGeometry args={[3.4, 3.4]} />
        <meshBasicMaterial
          map={tex}
          transparent
          alphaTest={0.05}
          opacity={0.18}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        color="#e8c88a"
        intensity={0.6}
        distance={5}
        position={[0, 0, 1.5]}
      />
      <pointLight
        color="#a8c4b8"
        intensity={0.5}
        distance={4}
        position={[0, 0, -1]}
      />
    </group>
  );
}
