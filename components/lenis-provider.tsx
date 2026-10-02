"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { scrollStore, ZONES } from "@/lib/scroll-store";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      // Longer duration → each wheel tick produces visible, sustained motion
      duration: 2.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;

    lenis.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
      const p = limit > 0 ? scroll / limit : 0;
      scrollStore.set(Math.max(0, Math.min(1, p)));
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // -- Section snap ------------------------------------------------------
    // One scroll input = advance to the END of the next zone, then stop.
    // Backwards scroll = previous zone. Animations are blocking — extra
    // inputs during animation are ignored. This turns the page into a
    // controlled cinematic slideshow.
    const SNAP_DURATION = 2.8; // seconds per zone advance — snappier
    const REST_FRACTION = 0.65; // 0..1 — fraction into zone where text is at its peak
    const INPUT_DEDUPE_MS = 250; // ignore inputs that come too close
    let isAnimating = false;
    let lastInputAt = 0;
    let lastTouchY = 0;

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const currentZoneIndex = () => {
      if (lenis.limit <= 0) return 0;
      const p = lenis.scroll / lenis.limit;
      // Index of the zone we are currently *inside*. If exactly on a
      // boundary, treat as inside the upcoming zone.
      let idx = 0;
      for (let i = 0; i < ZONES.length; i++) {
        if (p < ZONES[i].end - 0.0005) {
          idx = i;
          break;
        }
        idx = i;
      }
      return idx;
    };

    const snapTo = (zoneIdx: number) => {
      if (zoneIdx < 0 || zoneIdx >= ZONES.length) return;
      const zone = ZONES[zoneIdx];
      // Land at REST_FRACTION into the zone — the "peak" position where all
      // text is fully revealed but the zone fadeOut hasn't started yet.
      const targetP = zone.start + (zone.end - zone.start) * REST_FRACTION;
      const targetScroll = targetP * lenis.limit;
      isAnimating = true;
      lenis.scrollTo(targetScroll, {
        duration: SNAP_DURATION,
        easing: easeInOutCubic,
        lock: true,
        force: true,
        onComplete: () => {
          isAnimating = false;
        },
      });
    };

    const advance = (direction: 1 | -1) => {
      if (isAnimating) return;
      const now = performance.now();
      if (now - lastInputAt < INPUT_DEDUPE_MS) return;
      lastInputAt = now;
      const cur = currentZoneIndex();
      snapTo(cur + direction);
    };

    const onWheel = (e: WheelEvent) => {
      // Block native scroll — Lenis still handles smoothWheel, but for snap
      // we want full control: a single tick triggers exactly one advance.
      if (Math.abs(e.deltaY) < 5) return;
      e.preventDefault();
      if (isAnimating) return;
      advance(e.deltaY > 0 ? 1 : -1);
    };

    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0]?.clientY ?? lastTouchY;
      const dy = lastTouchY - endY;
      if (Math.abs(dy) < 30) return;
      advance(dy > 0 ? 1 : -1);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Don't hijack keys when the user is typing in a form field
      // (chat input, login, etc.). Otherwise spacebar would block typing.
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }
      }
      if (
        e.code === "PageDown" ||
        e.code === "ArrowDown" ||
        e.code === "Space"
      ) {
        e.preventDefault();
        advance(1);
      } else if (e.code === "PageUp" || e.code === "ArrowUp") {
        e.preventDefault();
        advance(-1);
      } else if (e.code === "Home") {
        e.preventDefault();
        snapTo(0);
      } else if (e.code === "End") {
        e.preventDefault();
        snapTo(ZONES.length - 1);
      }
    };

    // Override Lenis's wheel/touch handling for true snap behavior
    lenis.stop();
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    lenis.start();

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      delete window.__lenis;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
