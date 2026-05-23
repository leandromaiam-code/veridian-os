# Veridian OS

> Premium cinematic site for **Veridian AI Studio & Venture Builder** — a single-canvas walkthrough of the cathedral where ventures are forged.

**Live:** _pending deploy_

## What it is

A scroll-driven, full-bleed cinematic site composed of 10 zones — each one a different room in the Veridian cathedral. No traditional sections; the entire viewport is the environment, with editorial copy layered on top.

```
Entry → Manifesto → Veridian OS → Jarvis → Fabric → Vortex → Pulse → Method → Ventures → Apply
```

Each module of **Veridian OS** is rendered as its own cathedral chamber (cinematic image generated via Gemini 3 Pro Image).

## Stack

- **Next.js 16** App Router (Turbopack)
- **Tailwind v4** with Veridian Light Parchment tokens
- **Lenis** smooth scroll → global progress store
- Pure CSS / next/image layered backgrounds (no Three.js)
- Fonts: **Cormorant Garamond** + **Inter** + **JetBrains Mono**

## Local dev

```bash
npm install
npm run dev -- -p 3300
```

## Deploy

```bash
npm run build
vercel deploy --prod
```
