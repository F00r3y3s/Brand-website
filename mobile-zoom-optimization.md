# Task: Mobile & Zoom Optimization

## Overview
Optimize the website for mobile devices and high browser zoom levels. Address overlapping elements in the `Manifesto` section and ensure responsive integrity across all components.

## Success Criteria
- [ ] `Manifesto` cards do not overlap at 200% zoom.
- [ ] Text remains readable and containers scale fluidly.
- [ ] No layout breakage on narrow viewports (320px - 375px).
- [ ] Header remains functional and clean at high zoom.

## Tech Stack
- Next.js 16 (React 19)
- Tailwind CSS v4
- GSAP (ScrollTrigger)

## Implementation Steps

### Phase 1: Foundation
- [x] Step 1.1: Audit current zoom breakage points. (Manual)
- [x] Step 1.2: Research fluid typography scale for Tailwind v4.

### Phase 2: Manifesto Section (High Priority)
- [x] Step 2.1: Refactor `Manifesto.tsx` layout to use flex/grid instead of fixed absolute positioning for cards.
- [x] Step 2.2: Implement dynamic height check for pinned content to prevent overflow cut-offs.
- [x] Step 2.3: Adjust canvas scaling logic for high aspect ratio (zoomed) screens.

### Phase 3: Site-wide Polishing
- [x] Step 3.1: Audit `WhoWeAre.tsx` for card stacking.
- [x] Step 3.2: Audit `Services.tsx` for grid responsiveness.
- [x] Step 3.3: Global spacing check (margins/paddings) for mobile.

## Verification Checklist (Phase X)
- [x] Linting and Type Check: `npm run lint`
- [ ] Build Test: `npm run build`
- [ ] Responsive Audit: `python .agent/scripts/ux_audit.py .`
- [x] Manual Zoom Test: 100%, 150%, 200% on Chrome.

## Revert Procedure
- All changes are tracked in Git.
- To revert all changes: `git checkout .`
- To revert a specific file: `git checkout src/components/[ComponentName].tsx`
