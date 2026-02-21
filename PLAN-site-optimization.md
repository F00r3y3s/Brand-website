# Plan: Site Optimization & Mobile Fixes

## Overview
This plan outlines the specific fixes and enhancements to address poor mobile responsiveness (horizontal scrolling, off-screen elements, misaligned stacks) and low performance scores (online tests < 30). The goal is to maximize efficiency, implement professional best practices, compress assets, and restrict heavy JavaScript animations on mobile without sacrificing the desktop's "Wow" factor.

## Project Type
WEB

## Success Criteria
- [ ] No horizontal scrolling on mobile devices (width < 768px).
- [ ] Sections stack correctly with appropriate padding.
- [ ] Hover animations disabled on touch devices.
- [ ] Lighthouse / online website test scores significantly improved.
- [ ] Initial bundle size and LCP reduced via asset compression and code-splitting.

## Tech Stack
- Frontend: Next.js (React), Tailwind CSS
- Animation: GSAP, Framer Motion, Lenis Scroll
- Optimization: `next/image`, `next/dynamic`

## File Structure
Modifications will primarily occur in:
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/*` (Targeted components like Hero, Manifesto, WhoWeAre)
- `next.config.mjs` (If image domains/caching needed)

## 🧠 Brainstorm: Optimization Strategy
### Option A: Mobile-First Surgical Optimization
Disable performance-heavy libraries strictly on mobile. Compress assets globally. Fast implementation. Risk-free for desktop. Medium performance gains compared to fully ripping out animations.

### Option B: Deep Bundle Refactoring
Aggressively remove overlapping animation libraries. Use CSS/WebGL alternatives. Massive performance boost. High risk to desktop design timing.

**Recommendation:** Option A. It preserves your exact current design while patching all mobile bugs and drastically shrinking the initial download. Do you agree with proceeding on Option A?

## Task Breakdown

### Phase 1: Global CSS & Constraints 
- **Agent**: `frontend-specialist`, **Skill**: `tailwind-patterns`
- **INPUT**: Current `globals.css` and `layout.tsx`
- **OUTPUT**: Updated CSS enforcing `overflow-x: hidden` and touch modifiers.
- **VERIFY**: Open mobile view, drag horizontally -> no scroll allowed.

### Phase 2: Targeted Mobile Refactoring
- **Agent**: `frontend-specialist`, **Skill**: `mobile-design`
- **INPUT**: `Hero.tsx`, `Manifesto.tsx`, `WhoWeAre.tsx`
- **OUTPUT**: Fixed padding, text-wrapping, fixed stacked cards.
- **VERIFY**: Layout tests clean on 320px-768px viewports.

### Phase 3: Performance & Lazy Loading
- **Agent**: `performance-optimizer`, **Skill**: `performance-profiling` 
- **INPUT**: All components using heavy `framer-motion`, `three.js`, or background images.
- **OUTPUT**: Implementation of `next/dynamic` and `next/image` compression.
- **VERIFY**: Next.js build stats show smaller initial JS chunks.

## Phase X: Verification
- [ ] Lint: `npm run lint && npx tsc --noEmit`
- [ ] Security Scan: `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`
- [ ] UX/Mobile Audit: `python .agent/skills/frontend-design/scripts/ux_audit.py .`
- [ ] Lighthouse Profile: `python .agent/skills/performance-profiling/scripts/lighthouse_audit.py http://localhost:3000`
- [ ] Build: `npm run build`
