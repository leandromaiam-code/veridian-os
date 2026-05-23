"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

const cache = new Map<string, THREE.Texture>();

/** Returns Texture when image is fully decoded; null until then. */
export function useImageTexture(url: string): THREE.Texture | null {
  const [tex, setTex] = useState<THREE.Texture | null>(() =>
    url ? cache.get(url) ?? null : null,
  );

  useEffect(() => {
    if (!url) return;
    const cached = cache.get(url);
    if (cached) {
      setTex(cached);
      return;
    }
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img
      .decode()
      .then(() => {
        if (cancelled) return;
        const texture = new THREE.Texture(img);
        texture.anisotropy = 16;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        cache.set(url, texture);
        setTex(texture);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url]);

  return tex;
}
