# Site 7: Tracing Art (Getty Provenance Index)

## Overview
- **URL**: [https://www.getty.edu/tracingart/](https://www.getty.edu/tracingart/)
- **Award**: Site of the Day (Jul 22, 2025)
- **Agency**: [Resn](https://resn.co.nz/)
- **Core Concept**: An educational, data-driven experience that visualizes the provenance (history of ownership) of famous artworks. It turns complex database records into a compelling, interactive narrative.

## Design & UI/UX
- **Visual Style**: Minimalist, scholarly, and elegant. Uses a clean, off-white/pastel background (#FFFFFF to #DAE2E8) that allows the artwork and data visualizations to stand out.
- **Narrative Flow**: A vertical scrollytelling journey. It guides the user from a single painting's story to a macro view of the entire Getty Provenance Index.
- **Data Visualization**: Complex networks of "objects, people, events, places, and time" are represented through fluid, interactive node-link diagrams and timelines.
- **Editorial Feel**: Uses high-quality typography and large-scale imagery to create a digital "coffee table book" experience.

## Animation & Interaction
- **Smooth Scroll Transitions**: Uses a custom smooth scroll implementation to pace the storytelling perfectly.
- **Interactive Data Nodes**: Users can interact with the provenance network, revealing deeper layers of information about collectors and art dealers.
- **Dynamic Image Reveals**: Artworks and historical documents fade and slide into view based on the scroll position, often with subtle parallax effects.
- **Micro-animations**: Subtle typographic shifts and hover effects on data points that provide immediate, refined feedback.

## Technical Stack & Tools
- **Core Engine**: **WebGL** (custom implementation) for the large-scale data visualizations and fluid transitions.
- **Animation**: **GSAP (GreenSock)** for all timeline management and scroll-driven interactions.
- **Data Handling**: Likely uses **D3.js** or a custom physics-based engine for the network visualizations.
- **Framework**: Custom front-end architecture (Resn often uses their own internal boilerplate, sometimes based on **Vue.js** or **React**).
- **Asset Management**: Highly optimized image delivery for large-scale artwork reproductions.

## Key Inspiration Points
1. **Visualizing the Invisible**: Turn abstract data (ownership records) into a beautiful, interactive visual language.
2. **Scholarly Elegance**: Use white space and refined typography to create a sense of authority and prestige (ideal for "Fortune 500" or institutional clients).
3. **Macro to Micro**: Start with a human-scale story (one painting) and expand to a global scale (the whole index) to maintain engagement.
4. **Seamless Education**: Teach complex concepts through interaction rather than just text blocks.