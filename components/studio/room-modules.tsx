"use client";

import { VideoWall, ImageWall, PulseMotif } from "./video-wall";

// Modules laid out as huge billboards along the corridor.
// Camera passes through, each module fills viewport at its z position.
// Local Z spacing of 12 units between modules.

export function ModulesRoom({
  position = [0, 1.6, -25],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* 01 — JARVIS (CEO) — Iron Man HUD video on the right */}
      <VideoWall
        src="/assets/modules/jarvis.mp4"
        position={[5.2, 0, 0]}
        rotation={[0, -0.45, 0]}
        size={[12, 7.5]}
      />

      {/* 02 — FABRIC (CTO) — Arc reactor foundry image on the left */}
      <ImageWall
        src="/assets/modules/fabric.png"
        position={[-5.2, 0, -10]}
        rotation={[0, 0.45, 0]}
        size={[12, 7.5]}
      />

      {/* 03 — VORTEX (CMO) — Cosmic engine video on the right */}
      <VideoWall
        src="/assets/modules/vortex.mp4"
        position={[5.2, 0, -20]}
        rotation={[0, -0.45, 0]}
        size={[12, 7.5]}
      />

      {/* 04 — PULSE (COO) — Pulse motif on the left */}
      <PulseMotif
        position={[-5.2, 0, -30]}
        rotation={[0, 0.45, 0]}
        size={[12, 7.5]}
      />

      {/* Floor accent rings under each module */}
      {[
        { x: 5.2, z: 0, color: "#00d4ff" },
        { x: -5.2, z: -10, color: "#3fb48f" },
        { x: 5.2, z: -20, color: "#0ea5e9" },
        { x: -5.2, z: -30, color: "#7fe5c8" },
      ].map((p, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[p.x, -2.05, p.z]}
        >
          <ringGeometry args={[2.5, 2.55, 96]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}
