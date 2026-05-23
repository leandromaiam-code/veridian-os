"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  scrollStore,
  smoothstep,
  zoneById,
  zoneProgress,
} from "@/lib/scroll-store";

type Zone = {
  id: string;
  start: number;
  end: number;
  src: string;
  /** Dolly direction in this zone: how the camera "walks" through */
  dolly: "forward" | "sideways-left" | "sideways-right" | "still";
  tint?: string;
};

function build(): Zone[] {
  const map = (id: string) => {
    const z = zoneById(id)!;
    return { start: z.start, end: z.end };
  };
  // Walking script through the cathedral:
  //  Entry        → approach the shrine     (forward)
  //  Manifesto    → step back, behold nave  (sideways-left, slow pan)
  //  Jarvis       → enter throne room       (forward)
  //  Fabric       → cross to forge          (sideways-right)
  //  Vortex       → continue to engine      (sideways-left)
  //  Pulse        → step into observatory   (forward)
  //  Method       → exit through corridor   (forward, deeper)
  //  Ventures     → close-up gallery        (still — paintings)
  //  Sanctum      → return to shrine        (forward)
  return [
    { id: "entry",      ...map("entry"),       src: "/assets/hero/veridian-cathedral.jpg", dolly: "still" },
    { id: "hero",       ...map("hero"),        src: "/assets/hero/veridian-cathedral.jpg", dolly: "forward" },
    { id: "manifesto",  ...map("manifesto"),   src: "/assets/hero/env-wide.jpg",           dolly: "sideways-left" },
    { id: "resources",  ...map("resources"), src: "/assets/hero/env-mid.jpg",            dolly: "forward" },
    { id: "jarvis",     ...map("jarvis"),    src: "/assets/hero/jarvis-cathedral.jpg",   dolly: "forward" },
    { id: "fabric",     ...map("fabric"),    src: "/assets/hero/fabric-cathedral.jpg",   dolly: "sideways-right" },
    { id: "vortex",     ...map("vortex"),    src: "/assets/hero/vortex-cathedral.jpg",   dolly: "sideways-left" },
    { id: "pulse",      ...map("pulse"),     src: "/assets/hero/pulse-cathedral.jpg",    dolly: "forward" },
    { id: "method",     ...map("method"),    src: "/assets/hero/env-mid.jpg",            dolly: "forward" },
    { id: "ventures",   ...map("ventures"),  src: "/assets/hero/env-mid.jpg",            dolly: "sideways-left" },
    { id: "sanctum",    ...map("sanctum"),   src: "/assets/hero/veridian-cathedral.jpg", dolly: "forward" },
  ];
}

/** Wider cross-fade for continuous walking feel. */
function zoneOpacity(p: number, start: number, end: number, fade = 0.05): number {
  const fadeIn = smoothstep(start - fade, start + fade, p);
  const fadeOut = 1 - smoothstep(end - fade, end + fade, p);
  return Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut)));
}

export function EnvironmentBackgrounds() {
  const [p, setP] = useState(0);

  useEffect(() => {
    setP(scrollStore.get());
    return scrollStore.subscribe(setP);
  }, []);

  const zones = build();

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#0a1620]">
      {zones.map((z) => (
        <BackgroundLayer
          key={z.id}
          zone={z}
          progress={p}
          opacity={zoneOpacity(p, z.start, z.end)}
        />
      ))}

      {/* Permanent vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(10,22,16,0.40) 100%)",
        }}
      />

      <AmbientDust />

      {/* Floor fog band */}
      <div
        className="pointer-events-none absolute left-0 right-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(20,35,29,0.12) 40%, rgba(20,35,29,0.30) 100%)",
        }}
      />
    </div>
  );
}

function BackgroundLayer({
  zone,
  progress,
  opacity,
}: {
  zone: Zone;
  progress: number;
  opacity: number;
}) {
  if (opacity < 0.005) return null;

  const zp = zoneProgress(progress, zone.start, zone.end);

  // Dolly motion — feels like camera walking through space
  let scale = 1.0;
  let tx = 0;
  let ty = 0;

  switch (zone.dolly) {
    case "forward":
      // Walking INTO the scene: scale up while subtle drop
      scale = 1.08 + zp * 0.18; // 1.08 → 1.26
      ty = -zp * 2.5;
      break;
    case "sideways-left":
      // Camera pans right→left (so scene drifts right within frame)
      scale = 1.12;
      tx = -3 + zp * 6; // -3% → +3%
      break;
    case "sideways-right":
      scale = 1.12;
      tx = 3 - zp * 6; // +3% → -3%
      break;
    case "still":
      // Slight breathing scale for life
      scale = 1.03 + Math.sin(zp * Math.PI) * 0.02;
      break;
  }

  return (
    <div
      className="absolute inset-0"
      style={{ opacity, transition: "opacity 0.7s var(--ease-organic)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
          transformOrigin: "50% 50%",
          willChange: "transform",
          transition: "transform 0.18s linear",
        }}
      >
        <Image
          src={zone.src}
          alt=""
          fill
          priority={zone.id === "entry"}
          className="object-cover"
          sizes="100vw"
        />
      </div>
      {zone.tint && (
        <div className="absolute inset-0" style={{ background: zone.tint }} />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,35,29,0.05) 0%, rgba(20,35,29,0.35) 100%)",
        }}
      />
    </div>
  );
}

function AmbientDust() {
  const motes = Array.from({ length: 28 }).map((_, i) => {
    const left = (i * 79) % 100;
    const top = (i * 53) % 100;
    const size = 1.5 + ((i * 7) % 4);
    const dur = 18 + ((i * 11) % 14);
    const delay = (i * 3.1) % dur;
    const opacity = 0.18 + ((i * 0.07) % 0.35);
    return { left, top, size, dur, delay, opacity, key: i };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((m) => (
        <span
          key={m.key}
          className="absolute rounded-full"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            background: "#e8c88a",
            boxShadow: "0 0 6px #c9a56b",
            opacity: m.opacity,
            animation: `ambient-dust-drift ${m.dur}s ${m.delay}s linear infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ambient-dust-drift {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          15%, 85% { opacity: 1; }
          100% { transform: translate(40px, -120vh) scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
