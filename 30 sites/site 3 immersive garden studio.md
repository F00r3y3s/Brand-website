# Site 3: Immersive Garden Studio

## Overview
- **URL**: [https://immersive-g.com/](https://immersive-g.com/)
- **Award**: Studio of the Year 2024 (Awwwards)
- **Agency**: Immersive Garden (Paris, France)
- **Core Concept**: An "Innovative digital experiences studio" that uses high-end storytelling and technical artistry to showcase a portfolio of luxury clients (Louis Vuitton, Cartier, Dior, etc.).

## Design & UI/UX
- **Visual Style**: Sophisticated, editorial, and deeply immersive. Uses a clean, off-white background with elegant serif typography.
- **Narrative Approach**: The site is designed as a "digital journey." It doesn't just list projects; it provides an "immersive universe" for each case study.
- **Bento-like Layout**: Projects are presented in a modular but fluid grid that adapts as the user scrolls.
- **Sound Design**: Sound is a core component. The site encourages users to "enable sound" to fully experience the "emotional impact" of the transitions.

## Animation & Interaction
- **Cinematic Transitions**: Seamless movement between the main index and project-specific "universes."
- **WebGL Backgrounds**: Uses a `canvas` element that covers the entire viewport, providing a constant layer of interactive, ambient visuals (likely particle or fluid simulations).
- **Scrollytelling**: The scroll drives complex 3D camera movements and text reveals.
- **Hover Effects**: Sophisticated image distortions and typographic shifts that react to the cursor's velocity and position.
- **Micro-animations**: Every element, including the "Scroll down" hint and project titles, has a deliberate, high-quality motion path.

## Technical Stack & Tools
- **Core Engine**: **Three.js** & **WebGL** for the persistent immersive layer and 3D transitions.
- **Animation**: **GSAP (GreenSock)** for all timeline-based animations and scroll triggers.
- **Smooth Scroll**: **Lenis** (integrated with GSAP) for consistent, high-performance scroll feel.
- **Framework**: **Vue.js** or **React** (often uses Vue/Nuxt for their high-end production work).
- **Audio**: Custom implementation using the **Web Audio API** for spatialized, reactive sound.

## Key Inspiration Points
1. **Emotional Impact**: Use sound and cinematic transitions to create a feeling of "wonder" rather than just providing information.
2. **Luxury Aesthetic**: Combine minimalist layout with high-end typography and subtle, expensive-feeling animations.
3. **Persistent Immersive Layer**: Use a background WebGL canvas to maintain a consistent "vibe" across different pages or sections.
4. **Storytelling as Navigation**: Guide the user through a curated sequence of "moments" rather than a standard menu.