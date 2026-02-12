'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

declare const gsap: any;
declare const THREE: any;

// Expose methods for parent control
export interface LuminaInteractiveListHandle {
    navigateTo: (index: number) => void;
    getCurrentIndex: () => number;
    getItemCount: () => number;
    startAutoSlide: () => void;
    stopAutoSlide: () => void;
    updateProgress: (index: number, progress: number) => void;
}

export const LuminaInteractiveList = forwardRef<LuminaInteractiveListHandle, { items: any[] }>(({ items }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // --- DYNAMIC SCRIPT LOADING ---
        const loadScripts = async () => {
            const loadScript = (src: string, globalName: string) => new Promise<void>((res, rej) => {
                if ((window as any)[globalName]) { res(); return; }
                if (document.querySelector(`script[src="${src}"]`)) {
                    const check = setInterval(() => {
                        if ((window as any)[globalName]) { clearInterval(check); res(); }
                    }, 50);
                    setTimeout(() => { clearInterval(check); rej(new Error(`Timeout waiting for ${globalName}`)); }, 10000);
                    return;
                }
                const s = document.createElement('script');
                s.src = src;
                s.onload = () => { setTimeout(() => res(), 100); };
                s.onerror = () => rej(new Error(`Failed to load ${src}`));
                document.head.appendChild(s);
            });

            try {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', 'gsap');
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js', 'ScrollToPlugin');
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'THREE');
            } catch (e) {
                console.error('Failed to load base scripts:', e);
            }

            if ((window as any).gsap && (window as any).ScrollToPlugin) {
                (window as any).gsap.registerPlugin((window as any).ScrollToPlugin);
            }
            initApplication();
        };

        const initApplication = async () => {
            const container = containerRef.current;
            if (!container) return;

            // --- MAIN LOGIC ---
            const SLIDER_CONFIG: any = {
                settings: {
                    transitionDuration: 0.8, autoSlideSpeed: 3000, currentEffect: "glass", currentEffectPreset: "Default",
                    globalIntensity: 1.0, speedMultiplier: 1.0, distortionStrength: 1.0, colorEnhancement: 1.0,
                    glassRefractionStrength: 1.0, glassChromaticAberration: 1.0, glassBubbleClarity: 1.0, glassEdgeGlow: 1.0, glassLiquidFlow: 1.0,
                },
                effectPresets: {
                    glass: {
                        Subtle: { glassRefractionStrength: 0.6, glassChromaticAberration: 0.5, glassBubbleClarity: 1.3, glassEdgeGlow: 0.7, glassLiquidFlow: 0.8 },
                        Default: { glassRefractionStrength: 1.0, glassChromaticAberration: 1.0, glassBubbleClarity: 1.0, glassEdgeGlow: 1.0, glassLiquidFlow: 1.0 },
                        Crystal: { glassRefractionStrength: 1.5, glassChromaticAberration: 1.8, glassBubbleClarity: 0.7, glassEdgeGlow: 1.4, glassLiquidFlow: 0.5 },
                        Liquid: { glassRefractionStrength: 0.8, glassChromaticAberration: 0.4, glassBubbleClarity: 1.2, glassEdgeGlow: 0.8, glassLiquidFlow: 1.8 }
                    },
                }
            };

            // --- GLOBAL STATE ---
            let currentSlideIndex = 0;
            let isTransitioning = false;
            let shaderMaterial: any, renderer: any, scene: any, camera: any;
            let slideTextures: any[][] = [];
            let slideVariantIndices: number[] = [];
            let activeTexture: any = null;
            let backgroundCycleTimer: number | undefined;
            let texturesLoaded = false;
            let sliderEnabled = false;

            const TRANSITION_DURATION = () => SLIDER_CONFIG.settings.transitionDuration;

            const slides = items;

            // --- UTILITIES ---
            const updateSlideProgress = (idx: number, prog: number) => {
                const el = container.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill") as HTMLElement;
                if (el) { el.style.width = `${prog}%`; el.style.opacity = '1'; }
            };

            const updateNavigationState = (idx: number) => container.querySelectorAll(".slide-nav-item").forEach((el, i) => el.classList.toggle("active", i === idx));

            const quickResetProgress = (idx: number) => {
                const el = container.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill") as HTMLElement;
                if (el) { el.style.transition = "width 0.2s ease-out"; el.style.width = "0%"; setTimeout(() => el.style.transition = "width 0.1s ease, opacity 0.3s ease", 200); }
            };

            const updateCounter = (idx: number) => {
                const sn = container.querySelector("#slideNumber");
                if (sn) sn.textContent = String(idx + 1).padStart(2, "0");
                const st = container.querySelector("#slideTotal");
                if (st) st.textContent = String(slides.length).padStart(2, "0");
            };

            const getActiveTextureForSlide = (idx: number) => {
                const variants = slideTextures[idx];
                if (!variants || variants.length === 0) return null;
                const variantIndex = Math.min(slideVariantIndices[idx] ?? 0, variants.length - 1);
                return variants[variantIndex];
            };

            const stopBackgroundCycle = () => {
                if (backgroundCycleTimer !== undefined) {
                    window.clearInterval(backgroundCycleTimer);
                    backgroundCycleTimer = undefined;
                }
            };

            // --- SHADERS ---
            const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

            // Glass bubble reveal effect
            const fragmentShader = `
                uniform sampler2D uTexture1, uTexture2;
                uniform float uProgress;
                uniform vec2 uResolution, uTexture1Size, uTexture2Size;
                uniform float uGlobalIntensity, uSpeedMultiplier, uDistortionStrength;
                uniform float uGlassRefractionStrength, uGlassChromaticAberration, uGlassBubbleClarity, uGlassEdgeGlow, uGlassLiquidFlow;
                varying vec2 vUv;

                vec2 getCoverUV(vec2 uv, vec2 textureSize) {
                    vec2 s = uResolution / textureSize;
                    float scale = max(s.x, s.y);
                    vec2 scaledSize = textureSize * scale;
                    // Bias composition toward the right because the generated artwork often
                    // places the subject on the right edge.
                    vec2 offset = (uResolution - scaledSize) * vec2(0.82, 0.5);
                    return (uv * uResolution - offset) / scaledSize;
                }
                
                vec4 glassEffect(vec2 uv, float progress) {
                    float time = progress * 5.0 * uSpeedMultiplier;
                    vec2 uv1 = getCoverUV(uv, uTexture1Size); 
                    vec2 uv2 = getCoverUV(uv, uTexture2Size);
                    
                    // Circular reveal from center
                    float maxR = length(uResolution) * 0.85; 
                    float br = progress * maxR;
                    vec2 p = uv * uResolution; 
                    vec2 c = uResolution * 0.5;
                    float d = length(p - c); 
                    float nd = d / max(br, 0.001);
                    
                    // Inside the expanding circle
                    float param = smoothstep(br + 3.0, br - 3.0, d);
                    
                    vec4 img;
                    if (param > 0.0) {
                         // Refraction offset based on distance from center
                         float ro = 0.08 * uGlassRefractionStrength * uDistortionStrength * uGlobalIntensity * pow(smoothstep(0.3 * uGlassBubbleClarity, 1.0, nd), 1.5);
                         vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
                         vec2 distUV = uv2 - dir * ro;
                         
                         // Liquid flow animation
                         distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * uGlassLiquidFlow * uSpeedMultiplier * nd * param;
                         
                         // Chromatic aberration
                         float ca = 0.02 * uGlassChromaticAberration * uGlobalIntensity * pow(smoothstep(0.3, 1.0, nd), 1.2);
                         img = vec4(
                             texture2D(uTexture2, distUV + dir * ca * 1.2).r, 
                             texture2D(uTexture2, distUV + dir * ca * 0.2).g, 
                             texture2D(uTexture2, distUV - dir * ca * 0.8).b, 
                             1.0
                         );
                         
                         // Edge glow
                         if (uGlassEdgeGlow > 0.0) {
                            float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
                            img.rgb += rim * 0.08 * uGlassEdgeGlow * uGlobalIntensity;
                         }
                    } else { 
                        img = texture2D(uTexture2, uv2); 
                    }
                    
                    vec4 oldImg = texture2D(uTexture1, uv1);
                    
                    // Smooth final transition
                    if (progress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (progress - 0.95) / 0.05);
                    
                    return mix(oldImg, img, param);
                }

                void main() {
                    gl_FragColor = glassEffect(vUv, uProgress);
                }
            `;

            // --- CORE FUNCTIONS ---
            const updateShaderUniforms = () => {
                if (!shaderMaterial) return;
                const s = SLIDER_CONFIG.settings, u = shaderMaterial.uniforms;
                for (const key in s) {
                    const uName = 'u' + key.charAt(0).toUpperCase() + key.slice(1);
                    if (u[uName]) u[uName].value = s[key];
                }
            };

            const splitText = (text: string) => {
                return text.split('').map(char => `<span style="display: inline-block; opacity: 0;">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
            };

            const updateContent = (idx: number) => {
                const titleEl = container.querySelector('#mainTitle');
                const descEl = container.querySelector('#mainDesc');
                if (titleEl && descEl) {
                    // Animate out
                    gsap.to(titleEl.children, { y: -20, opacity: 0, duration: 0.5, stagger: 0.02, ease: "power2.in" });
                    gsap.to(descEl, { y: -10, opacity: 0, duration: 0.4, ease: "power2.in" });

                    setTimeout(() => {
                        // Set new content
                        titleEl.innerHTML = splitText(slides[idx].title);
                        (descEl as HTMLElement).textContent = slides[idx].description;

                        // Reset state
                        gsap.set(titleEl.children, { opacity: 0 });
                        gsap.set(descEl, { y: 20, opacity: 0 });

                        // Different animations based on slide index
                        const children = titleEl.children;
                        const animIndex = idx % 5;

                        switch (animIndex) {
                            case 0: // Stagger Up
                                gsap.set(children, { y: 20 });
                                gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" });
                                break;
                            case 1: // Stagger Down
                                gsap.set(children, { y: -20 });
                                gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "back.out(1.7)" });
                                break;
                            case 2: // Blur Reveal
                                gsap.set(children, { filter: "blur(10px)", scale: 1.5, y: 0 });
                                gsap.to(children, { filter: "blur(0px)", scale: 1, opacity: 1, duration: 1, stagger: { amount: 0.5, from: "random" }, ease: "power2.out" });
                                break;
                            case 3: // Scale In
                                gsap.set(children, { scale: 0, y: 0 });
                                gsap.to(children, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.05, ease: "back.out(1.5)" });
                                break;
                            case 4: // Rotate X (Flip)
                                gsap.set(children, { rotationX: 90, y: 0, transformOrigin: "50% 50%" });
                                gsap.to(children, { rotationX: 0, opacity: 1, duration: 0.8, stagger: 0.04, ease: "power2.out" });
                                break;
                            default:
                                gsap.set(children, { y: 20 });
                                gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" });
                        }

                        gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
                    }, 500);
                }
            };

            const transitionTexture = (currentTexture: any, targetTexture: any, onComplete?: () => void) => {
                if (!currentTexture || !targetTexture || !shaderMaterial) return;

                if (gsap.getTweensOf(shaderMaterial.uniforms.uProgress).length > 0) {
                    gsap.killTweensOf(shaderMaterial.uniforms.uProgress);
                }

                isTransitioning = true;
                shaderMaterial.uniforms.uProgress.value = 0;
                shaderMaterial.uniforms.uTexture1.value = currentTexture;
                shaderMaterial.uniforms.uTexture2.value = targetTexture;
                shaderMaterial.uniforms.uTexture1Size.value = currentTexture.userData.size;
                shaderMaterial.uniforms.uTexture2Size.value = targetTexture.userData.size;

                gsap.to(shaderMaterial.uniforms.uProgress, {
                    value: 1,
                    duration: TRANSITION_DURATION(),
                    ease: "power2.inOut",
                    onComplete: () => {
                        shaderMaterial.uniforms.uProgress.value = 0;
                        shaderMaterial.uniforms.uTexture1.value = targetTexture;
                        shaderMaterial.uniforms.uTexture1Size.value = targetTexture.userData.size;
                        activeTexture = targetTexture;
                        isTransitioning = false;
                        if (onComplete) onComplete();
                    }
                });
            };

            const startBackgroundCycle = () => {
                stopBackgroundCycle();

                const variants = slideTextures[currentSlideIndex];
                if (!variants || variants.length < 2) return;

                backgroundCycleTimer = window.setInterval(() => {
                    if (!texturesLoaded || !sliderEnabled || isTransitioning) return;

                    const currentVariants = slideTextures[currentSlideIndex];
                    if (!currentVariants || currentVariants.length < 2) return;

                    const currentVariant = slideVariantIndices[currentSlideIndex] ?? 0;
                    const nextVariant = (currentVariant + 1) % currentVariants.length;
                    const currentTexture = activeTexture || currentVariants[currentVariant];
                    const targetTexture = currentVariants[nextVariant];
                    if (!currentTexture || !targetTexture) return;

                    slideVariantIndices[currentSlideIndex] = nextVariant;
                    transitionTexture(currentTexture, targetTexture);
                }, 4500);
            };

            (window as any).__luminaStopBackgroundCycle = stopBackgroundCycle;

            const navigateToSlide = (targetIndex: number) => {
                if (targetIndex === currentSlideIndex) return;

                quickResetProgress(currentSlideIndex);
                stopBackgroundCycle();

                const currentTexture = activeTexture || getActiveTextureForSlide(currentSlideIndex);
                const targetTexture = getActiveTextureForSlide(targetIndex);
                if (!currentTexture || !targetTexture) return;

                updateContent(targetIndex);
                currentSlideIndex = targetIndex;
                updateCounter(currentSlideIndex);
                updateNavigationState(currentSlideIndex);
                updateSlideProgress(currentSlideIndex, 100);

                transitionTexture(currentTexture, targetTexture, () => {
                    startBackgroundCycle();
                });
            };

            // Expose navigate function to ref
            (window as any).__luminaNavigate = navigateToSlide;
            (window as any).__luminaGetCurrentIndex = () => currentSlideIndex;
            (window as any).__luminaGetItemCount = () => slides.length;
            (window as any).__luminaUpdateProgress = updateSlideProgress;
            // Removed auto-slide start/stop exposures as they are no longer needed

            const createSlidesNavigation = () => {
                const nav = container.querySelector("#slidesNav");
                if (!nav) return;
                nav.innerHTML = "";
                slides.forEach((slide: any, i: number) => {
                    const item = document.createElement("div");
                    item.className = `slide-nav-item${i === 0 ? " active" : ""}`;
                    item.dataset.slideIndex = String(i);
                    item.innerHTML = `<div class="slide-progress-line"><div class="slide-progress-fill"></div></div><div class="slide-nav-title">${slide.title}</div>`;
                    item.addEventListener("click", (e) => {
                        e.stopPropagation();
                        if (i !== currentSlideIndex) {
                            quickResetProgress(currentSlideIndex);
                            navigateToSlide(i);
                            if ((window as any).__onLuminaNavClick) {
                                (window as any).__onLuminaNavClick(i);
                            }
                        }
                    });
                    nav.appendChild(item);
                });
            };

            // --- CORE FUNCTIONS ---

            const loadImageTexture = (src: string) => new Promise<any>((resolve, reject) => {
                const l = new THREE.TextureLoader();
                l.load(src, (t: any) => {
                    t.minFilter = t.magFilter = THREE.LinearFilter;
                    t.userData = { size: new THREE.Vector2(t.image.width, t.image.height) };
                    resolve(t);
                }, undefined, (err: any) => {
                    console.warn("Failed to load texture:", src, err);
                    // Create fallback texture
                    const canvas = document.createElement('canvas');
                    canvas.width = 1920; canvas.height = 1080;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        const gradient = ctx.createLinearGradient(0, 0, 1920, 1080);
                        gradient.addColorStop(0, '#1a1a2e');
                        gradient.addColorStop(1, '#16213e');
                        ctx.fillStyle = gradient;
                        ctx.fillRect(0, 0, 1920, 1080);
                    }
                    const t = new THREE.CanvasTexture(canvas);
                    t.userData = { size: new THREE.Vector2(1920, 1080) };
                    resolve(t);
                });
            });

            const initRenderer = async () => {
                const canvas = container.querySelector(".webgl-canvas") as HTMLCanvasElement;
                if (!canvas) return;

                scene = new THREE.Scene();
                camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
                renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

                shaderMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        uTexture1: { value: null }, uTexture2: { value: null }, uProgress: { value: 0 },
                        uResolution: { value: new THREE.Vector2(1, 1) },
                        uTexture1Size: { value: new THREE.Vector2(1, 1) }, uTexture2Size: { value: new THREE.Vector2(1, 1) },
                        uGlobalIntensity: { value: 1.0 }, uSpeedMultiplier: { value: 1.0 }, uDistortionStrength: { value: 1.0 },
                        uGlassRefractionStrength: { value: 1.0 }, uGlassChromaticAberration: { value: 1.0 },
                        uGlassBubbleClarity: { value: 1.0 }, uGlassEdgeGlow: { value: 1.0 }, uGlassLiquidFlow: { value: 1.0 },
                    },
                    vertexShader, fragmentShader
                });
                scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

                const syncRendererSize = () => {
                    const width = Math.max(1, Math.round(canvas.clientWidth));
                    const height = Math.max(1, Math.round(canvas.clientHeight));
                    renderer.setSize(width, height, false);
                    shaderMaterial.uniforms.uResolution.value.set(width, height);
                };

                syncRendererSize();

                // Load textures (supports one or multiple background images per service)
                for (const s of slides) {
                    const mediaSources = Array.isArray(s.media) ? s.media : [s.media];
                    const variants: any[] = [];
                    for (const source of mediaSources) {
                        try {
                            variants.push(await loadImageTexture(source));
                        } catch {
                            console.warn("Failed texture");
                        }
                    }
                    slideTextures.push(variants);
                    slideVariantIndices.push(0);
                }

                const firstTexture = getActiveTextureForSlide(0);
                if (firstTexture) {
                    activeTexture = firstTexture;
                    shaderMaterial.uniforms.uTexture1.value = firstTexture;
                    shaderMaterial.uniforms.uTexture1Size.value = firstTexture.userData.size;

                    const secondSlideTexture = getActiveTextureForSlide(1) || firstTexture;
                    shaderMaterial.uniforms.uTexture2.value = secondSlideTexture;
                    shaderMaterial.uniforms.uTexture2Size.value = secondSlideTexture.userData.size;

                    texturesLoaded = true;
                    sliderEnabled = true;
                    updateShaderUniforms();
                    container.classList.add("loaded");

                    // Force update slide 0 to be active visually
                    updateNavigationState(0);
                    updateSlideProgress(0, 100);
                    startBackgroundCycle();
                }

                const render = () => { requestAnimationFrame(render); renderer.render(scene, camera); };
                render();

                // Resize handler
                window.addEventListener("resize", () => {
                    if (renderer) {
                        syncRendererSize();
                    }
                });
            };

            createSlidesNavigation();
            updateCounter(0);

            // Init text content - FORCE index 0
            const tEl = container.querySelector('#mainTitle');
            const dEl = container.querySelector('#mainDesc');
            if (tEl && dEl) {
                tEl.innerHTML = splitText(slides[0].title);
                (dEl as HTMLElement).textContent = slides[0].description;
                // Animate initial in
                gsap.fromTo(tEl.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.03, ease: "power3.out", delay: 0.5 });
                gsap.fromTo(dEl, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 });
            }

            initRenderer();

            // Visibility change handler removed (no auto timer)
        };

        loadScripts();

        return () => {
            if ((window as any).__luminaStopBackgroundCycle) {
                (window as any).__luminaStopBackgroundCycle();
            }
            // Cleanup global functions
            delete (window as any).__luminaNavigate;
            delete (window as any).__luminaGetCurrentIndex;
            delete (window as any).__luminaGetItemCount;
            delete (window as any).__luminaUpdateProgress;
            delete (window as any).__luminaStopBackgroundCycle;
        };
    }, [items]);

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        navigateTo: (index: number) => {
            if ((window as any).__luminaNavigate) {
                (window as any).__luminaNavigate(index);
            }
        },
        getCurrentIndex: () => {
            return (window as any).__luminaGetCurrentIndex ? (window as any).__luminaGetCurrentIndex() : 0;
        },
        getItemCount: () => {
            return (window as any).__luminaGetItemCount ? (window as any).__luminaGetItemCount() : items.length;
        },
        startAutoSlide: () => { }, // No-op
        stopAutoSlide: () => { }, // No-op
        updateProgress: (index: number, progress: number) => {
            if ((window as any).__luminaUpdateProgress) {
                (window as any).__luminaUpdateProgress(index, progress);
            }
        }
    }));

    return (
        <main className="slider-wrapper" ref={containerRef}>
            <canvas className="webgl-canvas"></canvas>
            <span className="slide-number" id="slideNumber">01</span>
            <span className="slide-total" id="slideTotal">{String(items.length).padStart(2, '0')}</span>
            <div className="readability-overlay" aria-hidden="true"></div>

            <div className="slide-content">
                <h1 className="slide-title" id="mainTitle"></h1>
                <p className="slide-description" id="mainDesc"></p>
                <div className="mt-8">
                    <button
                        className="cta-button group"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if ((window as any).__onServiceCtaClick) {
                                (window as any).__onServiceCtaClick();
                            }
                        }}
                        style={{ pointerEvents: 'auto', position: 'relative', zIndex: 100 }}
                    >
                        <span className="relative z-10">Start Project</span>
                        <div className="absolute inset-0 bg-white group-hover:bg-neutral-200 transition-colors z-0"></div>
                    </button>
                </div>
            </div>

            <nav className="slides-navigation" id="slidesNav"></nav>

            <style jsx global>{`
                .slider-wrapper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    background: #0a0a0a;
                    color: #ffffff;
                    opacity: 0;
                    transition: opacity 1s ease;
                }
                .slider-wrapper.loaded {
                    opacity: 1;
                }
                .webgl-canvas {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: auto;
                    width: 65%;
                    height: 100%;
                    z-index: 0;
                    display: block;
                }
                .slide-number {
                    position: absolute;
                    top: 2rem;
                    left: 2rem;
                    z-index: 10;
                    font-family: var(--font-mono, monospace);
                    font-size: 2rem;
                    font-weight: bold;
                    opacity: 0.7;
                }
                .slide-total {
                    position: absolute;
                    top: 2.5rem;
                    left: 5rem;
                    z-index: 10;
                    font-family: var(--font-mono, monospace);
                    font-size: 0.75rem;
                    opacity: 0.5;
                }
                .slide-total::before {
                    content: '/';
                    margin-right: 0.5rem;
                }
                .readability-overlay {
                    position: absolute;
                    inset: 0;
                    z-index: 5;
                    pointer-events: none;
                    background:
                        radial-gradient(110% 95% at 16% 78%, rgba(2, 6, 16, 0.62) 0%, rgba(2, 6, 16, 0.4) 40%, rgba(2, 6, 16, 0.08) 72%, rgba(2, 6, 16, 0) 100%),
                        linear-gradient(180deg, rgba(2, 6, 16, 0.2) 0%, rgba(2, 6, 16, 0.35) 100%);
                }
                .slide-content {
                    position: absolute;
                    bottom: clamp(6rem, 12vh, 9rem);
                    left: clamp(1rem, 3.8vw, 4rem);
                    z-index: 10;
                    width: min(760px, calc(100% - 2rem));
                    pointer-events: auto;
                    text-align: left;
                    transform: none;
                    padding: clamp(1.4rem, 2.4vw, 3rem);
                    background: linear-gradient(145deg, rgba(8, 12, 20, 0.78), rgba(8, 12, 20, 0.58));
                    backdrop-filter: blur(26px) saturate(145%);
                    -webkit-backdrop-filter: blur(26px) saturate(145%);
                    border-radius: 1.6rem;
                    border: 1px solid rgba(255, 255, 255, 0.24);
                    box-shadow: 0 28px 58px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.18);
                }
                @media (min-width: 1024px) {
                    .slide-content {
                        top: 50%;
                        bottom: auto;
                        transform: translateY(-50%);
                        left: clamp(1rem, 3vw, 3.5rem);
                        width: min(560px, calc(35% - 2.5rem));
                    }
                }
                .slide-title {
                    font-size: clamp(2.25rem, 6.1vw, 5.6rem);
                    font-weight: 900;
                    margin-bottom: 1.2rem;
                    text-transform: uppercase;
                    line-height: 0.95;
                    letter-spacing: -0.015em;
                    color: #ffffff;
                    text-shadow: 0 5px 22px rgba(0, 0, 0, 0.62);
                }
                .slide-description {
                    font-size: clamp(1.05rem, 2.1vw, 1.48rem);
                    font-weight: 500;
                    opacity: 1;
                    line-height: 1.62;
                    color: rgba(248, 251, 255, 0.97);
                    text-shadow: 0 3px 16px rgba(0, 0, 0, 0.5);
                }
                .cta-button {
                    position: relative;
                    overflow: hidden;
                    padding: 1rem 2.5rem;
                    border-radius: 100px;
                    font-weight: 700;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #000;
                    cursor: pointer;
                    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    border: none;
                }
                .cta-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                }
                .cta-button:active {
                    transform: translateY(0);
                }

                .slides-navigation {
                    position: absolute;
                    left: 1rem;
                    right: 1rem;
                    bottom: 1.1rem;
                    z-index: 20;
                    display: flex;
                    flex-direction: row;
                    gap: 0.7rem;
                    align-items: center;
                    justify-content: flex-start;
                    width: auto;
                    overflow-x: auto;
                    overflow-y: hidden;
                    scrollbar-width: none;
                    padding: 0.1rem;
                    background: transparent;
                }
                .slides-navigation::-webkit-scrollbar { display: none; }
                .slide-nav-item {
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.45rem;
                    opacity: 0.42;
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                    padding: 0.78rem 0.95rem;
                    border-radius: 999px;
                    background: rgba(2, 8, 18, 0.45);
                    border: 1px solid rgba(255, 255, 255, 0.14);
                    min-width: 165px;
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
                }
                .slide-nav-item:hover, .slide-nav-item.active {
                    opacity: 1;
                }
                .slide-nav-item.active {
                    background: rgba(14, 41, 52, 0.68);
                    border-color: rgba(45, 212, 191, 0.65);
                    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12);
                }
                .slide-nav-title {
                    font-family: var(--font-display, "Outfit", sans-serif);
                    text-transform: uppercase;
                    letter-spacing: 0.13em;
                    font-size: 0.58rem;
                    font-weight: 600;
                    white-space: nowrap;
                    color: rgba(255, 255, 255, 0.9);
                    transition: color 0.3s ease;
                }
                .slide-progress-line {
                    width: 100%;
                    height: 3px;
                    background: rgba(255, 255, 255, 0.16);
                    position: relative;
                    border-radius: 4px;
                    overflow: hidden;
                    order: 0;
                }
                .slide-progress-fill {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 0%;
                    background: #ffffff;
                    border-radius: 4px;
                    transition: width 0.1s linear, opacity 0.3s ease;
                }
                .slide-nav-item.active .slide-progress-fill {
                    background: #2dd4bf;
                    box-shadow: 0 0 10px rgba(45, 212, 191, 0.5);
                }
                .slide-nav-item.active .slide-nav-title {
                    color: #2dd4bf;
                }
                @media (min-width: 1024px) {
                    .slides-navigation {
                        left: 50%;
                        right: auto;
                        bottom: 1.4rem;
                        transform: translateX(-50%);
                        justify-content: center;
                        overflow: visible;
                    }
                }
            `}</style>
        </main>
    );
});

LuminaInteractiveList.displayName = 'LuminaInteractiveList';
