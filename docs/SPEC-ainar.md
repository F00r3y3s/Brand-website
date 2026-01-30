# AInar Brand Agency Website Product Specification

## 1. Executive Summary
*   **Goal**: Create an Awwwards-level, premium brand agency website for AInar that showcases their expertise in Sustainability, AI, and Digital Solutions.
*   **Value Proposition**: A high-end, immersive digital experience that reflects the innovation and UAE-based cultural heritage of the brand, aimed at securing Fortune 500-level partnerships.
*   **Success Metrics (KPIs)**: 
    *   Lighthouse Performance Score: 90+
    *   Frame Rate: Consistent 60fps for all animations.
    *   Engagement: Successful interaction with the "Alef" brand mark and Sustainability App reel.

## 2. User Personas
| Persona | Description | Needs/Pain Points |
|---------|-------------|-------------------|
| Enterprise Lead | Fortune 500 decision-maker looking for AI/Sustainability partners. | Needs trust, professional aesthetic, and proof of innovation. |
| Tech Explorer | Awwwards judge or design enthusiast. | Looking for "wow" factor, smooth animations, and technical excellence. |
| Potential Partner | Local UAE business looking for digital transformation. | Needs cultural familiarity and local expertise. |

## 3. Functional Requirements

### 3.1. Core Brand Identity (Priority: MUST)
*   **User Story**: As a visitor, I want to see the AInar brand animate on scroll, so that I feel the creativity of the agency.
*   **Logic/Rules**: The "Alef" (ا) in AInar should be an interactive SVG that draws itself or morphs as the user scrolls.
*   **Acceptance Criteria**:
    *   [ ] Smooth SVG drawing/morphing synced with scroll progress.
    *   [ ] Re-orients correctly in Arabic (RTL) mode.

### 3.2. Multilingual Support & RTL (Priority: MUST)
*   **User Story**: As an Arabic speaker, I want to view the site in my native language with proper alignment.
*   **Logic/Rules**: Toggle between English (LTR) and Arabic (RTL). Layout and animations must re-orient.
*   **Acceptance Criteria**:
    *   [ ] Full site layout flips on RTL toggle.
    *   [ ] Animations (reveal from left/right) reflect the direction of the language.

### 3.3. Sustainability App Showcase (Priority: MUST)
*   **User Story**: As a visitor, I want to see a cinematic preview of the Sustainability App.
*   **Logic/Rules**: Apple-style cinematic scroll sequence with video/3D placeholders.
*   **Acceptance Criteria**:
    *   [ ] Butter-smooth scroll-triggered video playback or image sequence.
    *   [ ] Scalable structure to add more app features later.

### 3.4. Dynamic Design System (Priority: MUST)
*   **User Story**: As a visitor, I want a premium visual experience whether in dark or light mode.
*   **Logic/Rules**: Dark/Light mode toggle. Glassmorphism, gold/sand accents, and Mashrabiya patterns.
*   **Acceptance Criteria**:
    *   [ ] Seamless transition between themes.
    *   [ ] Consistent visual hierarchy across both modes.

## 4. Data Models & Glossary
*   **Project**: A portfolio item consisting of title, description, video/image reel, and tech stack.
*   **Service**: A business offering (e.g., AI Advisory) with icon, text, and interactive elements.
*   **Alef Mark**: The specific brand element (Arabic Alef) used as the "I" in AInar.

## 5. User Flows
1.  **Discovery**: Landing -> Hero Animation -> Brand Scroll -> Service Overview.
2.  **Immersive**: Services -> Sustainability App Reel -> Team Section (Trigger effects).
3.  **Conversion**: CTA -> Newsletter/Contact -> Footer.

## 6. Edge Cases & Error Handling
*   **Reduced Motion**: If the user has "prefers-reduced-motion" enabled, heavy animations should simplify or disable.
*   **Low Performance Devices**: Fallback for 3D/video elements if the user's hardware cannot maintain 60fps.
*   **RTL Animation Glitches**: Ensure GSAP/Framer Motion transforms account for directionality.

## 7. Non-Functional Requirements
*   **Performance**: 60fps animations, optimized assets.
*   **Security**: Safe handling of contact form data (future implementation).
*   **Accessibility**: WCAG 2.1 compliant (AA level).

## 8. Assumptions & Risks
*   **Assumption**: Modern browsers (Chrome, Safari, Firefox, Edge) are the primary target.
*   **Risk**: Heavy assets (4K reels) could impact initial load time; need aggressive lazy-loading/placeholders.
