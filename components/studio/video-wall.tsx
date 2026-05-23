"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const videoCache = new Map<string, HTMLVideoElement>();

function getVideo(src: string): HTMLVideoElement {
  const cached = videoCache.get(src);
  if (cached) return cached;
  const v = document.createElement("video");
  v.src = src;
  v.crossOrigin = "anonymous";
  v.loop = true;
  v.muted = true;
  v.playsInline = true;
  v.autoplay = true;
  v.preload = "auto";
  // Kick playback ASAP
  const tryPlay = () => v.play().catch(() => {});
  v.addEventListener("loadedmetadata", tryPlay, { once: true });
  v.addEventListener("canplay", tryPlay, { once: true });
  videoCache.set(src, v);
  return v;
}

export function VideoWall({
  src,
  position,
  rotation = [0, 0, 0],
  size = [12, 7.5],
  brassFrame = true,
}: {
  src: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
  brassFrame?: boolean;
}) {
  const videoEl = useMemo(() => getVideo(src), [src]);

  const texture = useMemo(() => {
    const t = new THREE.VideoTexture(videoEl);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 16;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  }, [videoEl]);

  // Force play whenever component (re)mounts
  useEffect(() => {
    const tryPlay = () => videoEl.play().catch(() => {});
    tryPlay();
    const t = setTimeout(tryPlay, 250);
    return () => clearTimeout(t);
  }, [videoEl]);

  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={position} rotation={rotation}>
      {/* Brass frame behind */}
      {brassFrame && (
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[size[0] + 0.3, size[1] + 0.3]} />
          <meshStandardMaterial
            color="#9b7f4e"
            roughness={0.4}
            metalness={0.85}
          />
        </mesh>
      )}
      {/* Video plane */}
      <mesh ref={meshRef}>
        <planeGeometry args={size} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function ImageWall({
  src,
  position,
  rotation = [0, 0, 0],
  size = [12, 7.5],
  brassFrame = true,
}: {
  src: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
  brassFrame?: boolean;
}) {
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const t = loader.load(src, (loaded) => {
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.anisotropy = 16;
      loaded.needsUpdate = true;
    });
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 16;
    return t;
  }, [src]);

  return (
    <group position={position} rotation={rotation}>
      {brassFrame && (
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[size[0] + 0.3, size[1] + 0.3]} />
          <meshStandardMaterial
            color="#9b7f4e"
            roughness={0.4}
            metalness={0.85}
          />
        </mesh>
      )}
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function PulseMotif({
  position,
  rotation = [0, 0, 0],
  size = [12, 7.5],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
}) {
  // Procedural "nervous system" motif — pulsing rings/lines on dark bg
  // since Pulse has no rendered asset yet.
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((c, i) => {
      const m = c as THREE.Mesh;
      const baseS = 0.5 + i * 0.25;
      const pulse = (Math.sin(t * 1.2 - i * 0.5) + 1) * 0.5;
      m.scale.setScalar(baseS + pulse * 0.4);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.6 - i * 0.07 + pulse * 0.2;
    });
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[size[0] + 0.3, size[1] + 0.3]} />
        <meshStandardMaterial
          color="#9b7f4e"
          roughness={0.4}
          metalness={0.85}
        />
      </mesh>
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial color="#0a1f1a" />
      </mesh>
      {/* Concentric pulsing rings */}
      <group ref={groupRef} position={[0, 0, 0.01]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i}>
            <ringGeometry args={[1.6, 1.68, 96]} />
            <meshBasicMaterial
              color="#3fb48f"
              transparent
              opacity={0.6 - i * 0.07}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
      {/* Center heartbeat dot */}
      <mesh position={[0, 0, 0.05]}>
        <circleGeometry args={[0.25, 48]} />
        <meshBasicMaterial color="#7fe5c8" />
      </mesh>
    </group>
  );
}
