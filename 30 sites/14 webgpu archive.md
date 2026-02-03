# Site 14: 3D WebGPU ArchiViz

## Overview
- **URL**: [https://webgpu-archiviz.andersonmancini.com/](https://webgpu-archiviz.andersonmancini.com/) (Mirror/Portfolio)
- **Award**: Honorable Mention (Jan 11, 2026)
- **Creator**: [Anderson Mancini](https://andersonmancini.com/)
- **Core Concept**: A technical showcase of high-end architectural visualization using the next-generation **WebGPU** API. It demonstrates that photorealistic, interactive 3D environments can be delivered over the web with unmatched performance and a tiny footprint (under 6MB).

## Design & UI/UX
- **Visual Style**: Photorealistic and clean. The design focuses entirely on the 3D environment, using a minimal UI overlay that doesn't distract from the architecture.
- **High-End Realism**: Uses advanced lighting, reflections, and post-processing (bloom, SSAO, color grading) to achieve a level of realism previously reserved for native desktop applications.
- **Interactive Search**: Includes a 3D unit search with filters, allowing users to find specific apartments or rooms within the architectural model.
- **Contextual Map**: A "Map view" that shows the building within its actual surroundings, providing geographical context through a stylized 3D map.

## Animation & Interaction
- **Time of Day Adjustment**: A signature feature where users can interactively change the sun's position, seeing real-time changes in lighting, shadows, and atmosphere.
- **Interior/Exterior Transitions**: Seamlessly move from a macro "bird's eye" view of the building to a micro "view from inside" an apartment.
- **Smooth Camera Paths**: Uses curated camera orbits and transitions to guide the user through the building's best features.
- **Responsive UI**: The minimal UI widgets (sliders for time, unit filters) are designed to be tactile and responsive, feeling like part of a high-end professional tool.

## Technical Stack & Tools
- **Core API**: **WebGPU** (the successor to WebGL) for significantly better performance and more advanced rendering features.
- **3D Framework**: **Three.js** and **React Three Fiber (R3F)** for the 3D scene management.
- **Post-Processing**: Extensive use of the **Selective Bloom** and **SSAO** passes to enhance realism.
- **Optimization**: Highly optimized geometry and textures, keeping the entire experience under 6MB for fast loading.
- **Physics/Interaction**: Custom raycasting for unit selection and camera management.

## Key Inspiration Points
1. **Performance as a Feature**: Prove that "cutting-edge" doesn't have to mean "slow-loading." Under 6MB for a full 3D world is a masterclass in optimization.
2. **Next-Gen Tech Adoption**: Be among the first to use **WebGPU** to stand out to Awwwards judges and tech-focused clients.
3. **Professional Utility**: Turn a "visual showcase" into a "functional tool" (like a unit search or lighting simulator) to add real-world value.
4. **Minimalist Overlay**: Let the high-quality 3D assets do the talking; keep the UI as invisible as possible.