# Site 1: Igloo Inc.

## Overview
- **URL**: [https://www.igloo.inc/](https://www.igloo.inc/)
- **Award**: Site of the Day (Jul 23, 2024), Site of the Year 2024 Nominee
- **Developer/Agency**: [Abeto](https://abeto.co/) & [Bureaux](https://bureaux.studio/)
- **Core Concept**: Immersive 3D landing page for the parent company of Pudgy Penguins, focusing on a "consumer crypto revolution" through a cinematic, real-time 3D journey.

## Design & UI/UX
- **Visual Style**: Minimalist, high-contrast, atmospheric. Uses a limited color palette (#b6bac5, #383e4e) to create a premium, "frozen" aesthetic.
- **Hero Section**: A real-time rendered 3D igloo in a vast, snowy landscape. The scene feels alive with subtle environmental effects.
- **Flow**: A seamless transition from a cinematic intro into a scrollytelling experience. The navigation is secondary to the immersive content.
- **Bento Grid**: Used for organizing information in a modular, clean way while maintaining the premium feel.

## Animation & Interaction
- **Scrollytelling**: Uses scroll position to drive the 3D camera and reveal content. The transition between scenes is fluid and narrative-driven.
- **Scene Transitions**: Employs chromatic aberration, technical displacement, and frost effects for a unique, high-end feel.
- **Particle Simulation**: An interactive particle system in the "Links" section that forms different 3D shapes (volumes) based on user selection. Particles change color based on speed and glow during transitions.
- **Real-time Rendering**: All 3D sequences are rendered in-engine (browser) rather than using pre-rendered video, allowing for high resolution and immediate interactivity.
- **Sound Design**: Music and SFX are tightly synchronized with 3D movements and particle interactions.

## Technical Stack & Tools
- **Core Engine**: **Three.js** (WebGL) for all 3D rendering.
- **Animation**: **GSAP (GreenSock)** for timeline management and complex 2D/3D transitions.
- **Framework**: Likely **React** with **React Three Fiber (R3F)** given the complexity of component-based 3D state.
- **Custom Tools**: 
    - **Procedural Growth Algorithm**: Used to model ice blocks in real-time.
    - **VDB Data Exporter**: A custom tool developed by Abeto to convert 3D volume data into a compressed, browser-friendly format for the particle simulation.
    - **Live Shader Editor**: Custom internal tools for real-time iteration of shaders and textures directly in the browser.
- **Optimization**: Heavy focus on measuring performance during development to ensure compatibility with low-end devices.

## Key Inspiration Points
1. **Procedural 3D**: Instead of static models, use algorithms to generate geometry (like the ice blocks) to keep file sizes low and visual variety high.
2. **Custom Data Formats**: When standard formats (like large images for volume data) are too heavy, develop custom compression/export solutions.
3. **Atmospheric Post-Processing**: Chromatic aberration and displacement filters can elevate a simple 3D scene into a cinematic experience.
4. **Narrative Scroll**: Treat the scrollbar as a film director's timeline.