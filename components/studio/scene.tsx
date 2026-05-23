"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "@/lib/scroll-store";
import { Shield } from "./shield";
import { ManifestoRoom } from "./room-manifesto";
import { ModulesRoom } from "./room-modules";
import { MethodRoom } from "./room-method";
import { VenturesRoom } from "./room-ventures";
import { SanctumRoom } from "./room-sanctum";

// Path waypoints — camera walks along this curve as user scrolls.
// Modules are at world z=-25 base, with internal z 0/-10/-20/-30 = world -25/-35/-45/-55
const WAYPOINTS: [number, number, number][] = [
  [0, 1.6, 5],      // 0  Entry — approach shield
  [0, 1.6, 2.0],    // 1  Entry close-up
  [0, 1.7, -3],     // 2  Manifesto corridor enter
  [0, 1.7, -12],    // 3  Manifesto mid → modules entry
  [-2.5, 1.7, -22], // 4  Pass left of Jarvis (which is right side at -25)
  [2.5, 1.7, -32],  // 5  Pass right of Fabric (which is left at -35)
  [-2.5, 1.7, -42], // 6  Pass left of Vortex (which is right at -45)
  [2.5, 1.7, -52],  // 7  Pass right of Pulse (which is left at -55)
  [0, 1.8, -62],    // 8  Method overpass
  [0, 1.7, -70],    // 9  Ventures gallery enter
  [1.5, 1.7, -75],  //10  Ventures circulating
  [-1.5, 1.7, -82], //11  Ventures circulating
  [0, 1.7, -88],    //12  Sanctum approach
  [0, 1.7, -94],    //13  Sanctum close
];

const LOOK_OFFSET: [number, number, number][] = WAYPOINTS.map(([x, y, z], i) => {
  const next = WAYPOINTS[Math.min(i + 1, WAYPOINTS.length - 1)];
  return [next[0], next[1], next[2] - 0.5];
});

export function Scene() {
  const camera = useThree((s) => s.camera);
  const curveRef = useRef<THREE.CatmullRomCurve3>(null!);
  const lookCurveRef = useRef<THREE.CatmullRomCurve3>(null!);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);

  useMemo(() => {
    curveRef.current = new THREE.CatmullRomCurve3(
      WAYPOINTS.map((w) => new THREE.Vector3(...w)),
      false,
      "catmullrom",
      0.4,
    );
    lookCurveRef.current = new THREE.CatmullRomCurve3(
      LOOK_OFFSET.map((w) => new THREE.Vector3(...w)),
      false,
      "catmullrom",
      0.4,
    );
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    const unsub = scrollStore.subscribe((p) => {
      targetProgressRef.current = p;
    });
    return () => {
      window.removeEventListener("mousemove", onMove);
      unsub();
    };
  }, []);

  useFrame((_, delta) => {
    // Smooth interpolate scroll progress (extra easing on top of Lenis)
    const t = Math.min(1, delta * 6);
    smoothProgressRef.current +=
      (targetProgressRef.current - smoothProgressRef.current) * t;
    const p = smoothProgressRef.current;

    const pos = curveRef.current.getPointAt(p);
    const look = lookCurveRef.current.getPointAt(Math.min(1, p + 0.02));

    // Mouse parallax adds a small offset
    pos.x += mouseRef.current.x * 0.25;
    pos.y += -mouseRef.current.y * 0.15;

    camera.position.lerp(pos, 0.18);
    const target = new THREE.Vector3().copy(look);
    camera.lookAt(target);
  });

  return (
    <>
      {/* Lighting — soft daylight, brass key */}
      <ambientLight intensity={0.7} color="#fff5e0" />
      <directionalLight
        position={[6, 10, 4]}
        intensity={1.1}
        color="#fff1d8"
      />
      <directionalLight
        position={[-4, 6, -10]}
        intensity={0.5}
        color="#e8c88a"
      />
      <hemisphereLight
        args={["#fff8e8", "#efece0", 0.6]}
      />
      {/* Cream fog gives depth and softens far rooms */}
      <fog attach="fog" args={["#efece0", 14, 75]} />

      {/* Ground reflection plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -30]} receiveShadow>
        <planeGeometry args={[60, 200]} />
        <meshStandardMaterial
          color="#efece0"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Rooms placed along the corridor */}
      <Shield position={[0, 1.6, 0]} />
      <ManifestoRoom position={[0, 1.6, -7]} />
      <ModulesRoom position={[0, 1.6, -25]} />
      <MethodRoom position={[0, 1.6, -62]} />
      <VenturesRoom position={[0, 1.6, -76]} />
      <SanctumRoom position={[0, 1.6, -94]} />

      {/* Brass dust particles drifting */}
      <DustParticles />
    </>
  );
}

function DustParticles() {
  const groupRef = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const count = 400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = Math.random() * 4 + 0.2;
      positions[i * 3 + 2] = -Math.random() * 70 + 4;
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const pos = groupRef.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < pos.length; i += 3) {
      pos[i + 1] += Math.sin(t * 0.3 + i) * 0.0008;
      pos[i] += Math.cos(t * 0.2 + i) * 0.0006;
    }
    groupRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={groupRef} geometry={geometry}>
      <pointsMaterial
        color="#c9a56b"
        size={0.04}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
