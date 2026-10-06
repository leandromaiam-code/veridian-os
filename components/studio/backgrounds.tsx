"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { scrollStore, smoothstep, zoneById } from "@/lib/scroll-store";

/* -----------------------------------------------------------------------------
 * Scroll-driven backdrop.
 *
 * Entry: the Veridian shrine (the intro image). Scrolling "enters the studio":
 * the camera dollies into the shrine while it dissolves into the light studio.
 *
 * Studio: off-white space with soft green / gold light, a fine grid and a
 * perspective floor. Everything moves with scroll progress (the floor rolls
 * toward the viewer, the lights drift), so each section still feels like a
 * step forward through the same space.
 * --------------------------------------------------------------------------- */
export function EnvironmentBackgrounds() {
  const [p, setP] = useState(0);
  const [mouse, setMouse] = useState({ x: 60, y: 30 });

  useEffect(() => {
    setP(scrollStore.get());
    return scrollStore.subscribe(setP);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const entryEnd = zoneById("entry")?.end ?? 0.1;
  // Entry dissolves as the hero arrives; the camera keeps walking into it.
  const entryOpacity = 1 - smoothstep(entryEnd - 0.045, entryEnd + 0.03, p);
  const walk = smoothstep(0, entryEnd + 0.03, p);
  const entryScale = 1.03 + walk * 0.42;

  // Studio motion — tied to the whole page progress.
  const floorShift = p * 84 * 40; // px — the floor rolls toward the viewer
  const drift = p * 100;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-studio">
      {/* Light studio */}
      <div aria-hidden className="absolute inset-0">
        <div
          className="v-aura a1"
          style={{ transform: `translate(${-drift * 0.08}vw, ${drift * 0.06}vh) scale(${1 + p * 0.1})` }}
        />
        <div
          className="v-aura a2"
          style={{ transform: `translate(${drift * 0.06}vw, ${-drift * 0.12}vh)` }}
        />
        <div
          className="v-aura a3"
          style={{
            left: `${mouse.x}%`,
            top: `${mouse.y}%`,
            transform: "translate(-50%, -50%)",
            transition: "left 1.2s cubic-bezier(.2,.7,.1,1), top 1.2s cubic-bezier(.2,.7,.1,1)",
          }}
        />
        <div
          className="v-gridlines"
          style={{ backgroundPosition: `${-drift * 2}px ${-drift * 3}px` }}
        />
        <div className="v-floor">
          <div style={{ backgroundPosition: `0 ${floorShift}px` }} />
        </div>
        <div className="v-noise" />
        <AmbientMotes />
      </div>

      {/* Entry — the shrine */}
      {entryOpacity > 0.005 && (
        <div className="absolute inset-0" style={{ opacity: entryOpacity }}>
          <div
            className="absolute inset-0"
            style={{
              transform: `scale(${entryScale})`,
              transformOrigin: "50% 46%",
              willChange: "transform",
              transition: "transform 0.18s linear",
            }}
          >
            <Image
              src="/assets/hero/veridian-cathedral.jpg"
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          {/* Light coming in from the studio ahead */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 34% 40% at 50% 46%, rgba(242,243,240,${0.08 + walk * 0.7}) 0%, rgba(242,243,240,0) 100%)`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,22,16,0) 55%, rgba(10,22,16,0.35) 100%)",
            }}
          />
        </div>
      )}
    </div>
  );
}

/* Small green / gold motes drifting upward — the old brass dust, in light. */
function AmbientMotes() {
  const motes = Array.from({ length: 22 }).map((_, i) => {
    const left = (i * 79) % 100;
    const top = (i * 53) % 100;
    const size = 2 + ((i * 7) % 4);
    const dur = 20 + ((i * 11) % 14);
    const delay = (i * 3.1) % dur;
    const gold = i % 3 === 0;
    return { left, top, size, dur, delay, gold, key: i };
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
            background: m.gold ? "rgba(184,146,90,0.55)" : "rgba(15,107,79,0.35)",
            animation: `studio-mote-drift ${m.dur}s ${m.delay}s linear infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes studio-mote-drift {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          15%, 85% { opacity: 1; }
          100% { transform: translate(40px, -120vh) scale(1.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
