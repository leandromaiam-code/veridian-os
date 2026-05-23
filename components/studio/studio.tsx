"use client";

import { EnvironmentBackgrounds } from "./backgrounds";
import { Overlay } from "./overlay";
import { SCROLL_HEIGHT_VH } from "@/lib/scroll-store";

export function Studio() {
  return (
    <>
      <EnvironmentBackgrounds />
      <div className="relative z-10" style={{ height: `${SCROLL_HEIGHT_VH}vh` }}>
        <Overlay />
      </div>
    </>
  );
}
