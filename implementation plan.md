Implementation Plan - AInar Brand Agency Website
Building a premium, Awwwards-winning brand agency website using Next.js, GSAP, and Tailwind CSS.

User Review Required
IMPORTANT

The project will be initialized in the root directory /Users/omair/Desktop/website as requested. This will create several files (package.json, tailwind.config.ts, etc.) in the root.

Proposed Changes
Core Infrastructure
[NEW] 
Project Scaffolding
Initialize Next.js project with TypeScript, Tailwind CSS, and App Router.

Install GSAP, Framer Motion, Lenis (for smooth scrolling).
Setup configuration for RTL/LTR support using next-intl or a custom context-based solution.
Design System
[NEW] 
tailwind.config.ts
Define the UAE-inspired color palette: Gold/Sand (#C5A059), Premium Dark (#0A0A0A), Desert White (#F5F5F7).
Setup custom spacing and typography (Inter/Outfit for English, appropriate premium Arabic font).
Components
[NEW] 
BrandAlef.tsx
The interactive "Alef" SVG component.

Use GSAP DrawSVG or Framer Motion pathLength for the drawing effect.
Sync with scroll progress using ScrollTrigger.
[NEW] 
AppReel.tsx
The Apple-style cinematic showcase for the Sustainability App.

Implement an image-sequence or video-scrubbing effect.
Layout & Navigation
[NEW] 
Header.tsx
Bilingual navigation with RTL support.

Morphing logo transition on scroll.
Language and Theme toggles.
Verification Plan
Automated Tests
npm run lint: Ensure code quality and TypeScript safety.
Lighthouse: Run audit via Chrome DevTools to verify 90+ performance score.
Manual Verification
RTL/LTR Toggle: Verify that the entire layout flips correctly and that animations re-orient (tested via browser subagent or user click).
Scroll Performance: Check for "jank" on 4K displays and mobile devices (aiming for 60fps).
Brand Animation: Confirm that the "Alef" draws itself smoothly on scroll.