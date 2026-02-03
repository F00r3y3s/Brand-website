# Site 5: Opal Tadpole

## Overview
- **URL**: [https://opalcamera.com/opal-tadpole](https://opalcamera.com/opal-tadpole)
- **Award**: Site of the Day (Jan 11, 2024)
- **Design**: Claudio Guglieri
- **Developer**: [Ingamana](https://ingamana.com/)
- **Core Concept**: A high-end e-commerce landing page for "the smallest webcam ever built," using Apple-level product photography and sophisticated 3D/scroll interactions to justify a premium price point.

## Design & UI/UX
- **Visual Style**: Clean, tech-focused, and highly polished. Mimics the Apple aesthetic with large, high-resolution product shots and plenty of white space.
- **Hero Section**: Features a large-scale, interactive 3D model of the Tadpole camera that reacts to scroll and mouse movement.
- **Color Palette**: Minimalist. Primary use of White and Black with a signature Yellow (#FFDB01) for accents and calls to action.
- **Typography**: Clean sans-serif (Inter or similar custom face) with a focus on hierarchy and readability.
- **Layout**: Single-page scrollytelling. Information is chunked into clear, digestible sections using a modular grid.

## Animation & Interaction
- **The "Hand Flip"**: A signature scroll-triggered video/animation sequence where the product is shown in context (held in a hand) to emphasize its tiny scale.
- **Smooth Scroll**: Implements a high-quality smooth scroll that feels "weighty" and premium, ensuring animations trigger precisely.
- **3D Exploration**: Users can explore the product's internal components and materials through scroll-driven 3D exploded views.
- **Micro-interactions**: The "Tap To Mute" feature is demonstrated through a playful, interactive animation that mimics the physical touch experience.
- **Transitions**: Seamless transitions between technical specs and lifestyle photography.

## Technical Stack & Tools
- **Framework**: **Next.js** (confirmed by global variables).
- **Animation**: **GSAP (GreenSock)** for all timeline-based product reveals and scroll triggers.
- **3D Rendering**: **Three.js** with **React Three Fiber (R3F)** for the interactive product models.
- **Smooth Scroll**: **Lenis** (standard for high-end e-commerce).
- **Video**: High-quality, short-form video loops used as "elements" within the scroll timeline.

## Key Inspiration Points
1. **Scale Representation**: Use interactive elements (like the hand-flip) to visually communicate a product's unique selling point (its size).
2. **Interactive Specs**: Don't just list technical specifications; turn them into an interactive 3D exploration.
3. **Apple-Style Polish**: High-quality photography combined with subtle, perfectly timed animations creates an immediate sense of "premium."
4. **Contextual Video**: Integrate small video clips directly into the UI to demonstrate physical features (like the capacitive mute button).