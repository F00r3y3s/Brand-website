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

                vec2 getContainUV(vec2 uv, vec2 textureSize) {
                    vec2 s = uResolution / textureSize;
                    float scale = min(s.x, s.y);
                    vec2 scaledSize = textureSize * scale;
                    vec2 offset = (uResolution - scaledSize) * 0.5;
                    return (uv * uResolution - offset) / scaledSize;
                }
                
                vec4 glassEffect(vec2 uv, float progress) {
                    float time = progress * 5.0 * uSpeedMultiplier;
                    vec2 uv1 = getContainUV(uv, uTexture1Size); 
                    vec2 uv2 = getContainUV(uv, uTexture2Size);
                    
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

            const updateContent = (idx: number) => {
                const titleEl = container.querySelector('#mainTitle');
                const subtitleEl = container.querySelector('#mainSubtitle');
                const descEl = container.querySelector('#mainDesc');
                const comingSoonLogo = container.querySelector('#comingSoonLogoGlass');
                const ctaLabelEl = container.querySelector('#mainCtaLabel');
                const ctaButtonEl = container.querySelector('#mainCtaButton');
                const isComingSoon =
                    Boolean(slides[idx]?.isComingSoon) ||
                    String(slides[idx]?.title || '').toLowerCase().includes('coming soon');
                if (titleEl && subtitleEl && descEl) {
                    titleEl.textContent = slides[idx].title;
                    (subtitleEl as HTMLElement).textContent = slides[idx].subtitle || '';
                    if (ctaLabelEl) ctaLabelEl.textContent = isComingSoon ? 'Available Soon' : `Inquire about ${slides[idx].title}`;
                    if (ctaButtonEl instanceof HTMLElement) {
                        ctaButtonEl.classList.toggle('is-disabled', isComingSoon);
                        ctaButtonEl.setAttribute('aria-disabled', isComingSoon ? 'true' : 'false');
                    }

                    if (comingSoonLogo) {
                        gsap.to(comingSoonLogo, {
                            autoAlpha: isComingSoon ? 1 : 0,
                            scale: isComingSoon ? 1 : 0.92,
                            duration: 0.45,
                            ease: "power2.out"
                        });
                    }
                    gsap.killTweensOf(descEl);
                    gsap.to(descEl, {
                        y: -8,
                        opacity: 0,
                        duration: 0.2,
                        ease: "power1.in",
                        onComplete: () => {
                            (descEl as HTMLElement).textContent = slides[idx].description;
                            gsap.fromTo(
                                descEl,
                                { y: 10, opacity: 0 },
                                { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
                            );
                        }
                    });
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
            const sEl = container.querySelector('#mainSubtitle');
            const dEl = container.querySelector('#mainDesc');
            const csLogoEl = container.querySelector('#comingSoonLogoGlass');
            const ctaLabelEl = container.querySelector('#mainCtaLabel');
            const ctaButtonEl = container.querySelector('#mainCtaButton');
            if (tEl && sEl && dEl) {
                tEl.textContent = slides[0].title;
                (sEl as HTMLElement).textContent = slides[0].subtitle || '';
                (dEl as HTMLElement).textContent = slides[0].description;
                const initialIsComingSoon =
                    Boolean(slides[0]?.isComingSoon) ||
                    String(slides[0]?.title || '').toLowerCase().includes('coming soon');
                if (ctaLabelEl) ctaLabelEl.textContent = initialIsComingSoon ? 'Available Soon' : `Inquire about ${slides[0].title}`;
                if (ctaButtonEl instanceof HTMLElement) {
                    ctaButtonEl.classList.toggle('is-disabled', initialIsComingSoon);
                    ctaButtonEl.setAttribute('aria-disabled', initialIsComingSoon ? 'true' : 'false');
                }
                if (csLogoEl) {
                    gsap.set(csLogoEl, { autoAlpha: 0, scale: 0.92 });
                }
                // Keep the title static and only animate paragraph copy.
                gsap.fromTo(dEl, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", delay: 0.5 });
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
        <div className="lumina-wrapper" ref={containerRef}>
            <canvas className="webgl-canvas"></canvas>
            <span className="slide-number" id="slideNumber">01</span>
            <span className="slide-total" id="slideTotal">{String(items.length).padStart(2, '0')}</span>
            <div className="readability-overlay" aria-hidden="true"></div>

            <div id="comingSoonLogoGlass" className="coming-soon-logo-glass" aria-hidden="true">
                <div className="coming-soon-logo-glass-inner">
                    <div className="coming-soon-logo-plate">
                        <img src="/ainar-logo-transparent.webp" alt="AINAR transparent brand logo" className="coming-soon-logo-image" />
                    </div>
                </div>
            </div>
            <div className="slide-content">
                <h2 className="slide-title" id="mainTitle">{items[0]?.title}</h2>
                <p className="slide-subtitle" id="mainSubtitle">{items[0]?.subtitle}</p>
                <p className="slide-description" id="mainDesc">{items[0]?.description}</p>
                <div className="mt-8">
                    <button
                        id="mainCtaButton"
                        className="cta-button group"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const currentIdx = (window as any).__luminaGetCurrentIndex ? (window as any).__luminaGetCurrentIndex() : 0;
                            const currentSlide = items[currentIdx];
                            const isComingSoon =
                                Boolean(currentSlide?.isComingSoon) ||
                                String(currentSlide?.title || '').toLowerCase().includes('coming soon');
                            if (isComingSoon) return;
                            if ((window as any).__onServiceCtaClick) {
                                (window as any).__onServiceCtaClick();
                            }
                        }}
                        style={{ position: 'relative', zIndex: 100 }}
                    >
                        <span id="mainCtaLabel" className="relative z-10">Get Started</span>
                        <div className="absolute inset-0 bg-white group-hover:bg-neutral-200 transition-colors z-0"></div>
                    </button>
                </div>
            </div>

            <nav className="slides-navigation" id="slidesNav"></nav>

            <style jsx global>{`
                .slider-wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 100vw;
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
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                    display: block;
                }
                @media (min-width: 1024px) {
                    .webgl-canvas {
                        width: 65%;
                    }
                }
                .slide-number {
                    position: absolute;
                    top: 2rem;
                    left: 2rem;
                    z-index: 10;
                    font-family: var(--font-mono, monospace);
                    font-size: 1.2rem;
                    font-weight: bold;
                    opacity: 0.7;
                }
                @media (min-width: 1024px) {
                    .slide-number {
                        font-size: 2rem;
                    }
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
                .coming-soon-logo-glass {
                    position: absolute;
                    top: 50%;
                    right: clamp(2.4rem, 11vw, 11rem);
                    transform: translateY(-50%);
                    z-index: 12;
                    width: clamp(190px, 23vw, 300px);
                    padding: clamp(0.65rem, 0.95vw, 0.8rem);
                    border-radius: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.26);
                    background: linear-gradient(145deg, rgba(22, 34, 52, 0.44), rgba(22, 34, 52, 0.28));
                    backdrop-filter: blur(14px) saturate(135%);
                    -webkit-backdrop-filter: blur(14px) saturate(135%);
                    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
                    opacity: 0;
                    visibility: hidden;
                    transform-origin: center center;
                }
                .coming-soon-logo-glass-inner {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    min-height: clamp(105px, 12.5vw, 156px);
                    border-radius: 0.75rem;
                    border: 1px solid rgba(255, 255, 255, 0.24);
                    background: linear-gradient(160deg, rgba(250, 252, 255, 0.22), rgba(255, 255, 255, 0.1));
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
                }
                .coming-soon-logo-plate {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 92%;
                    min-height: clamp(92px, 10.8vw, 136px);
                    border-radius: 0.7rem;
                    border: 1px solid rgba(255, 255, 255, 0.78);
                    background: linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(244, 248, 255, 0.9));
                    box-shadow: 0 10px 26px rgba(2, 10, 24, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.95);
                }
                .coming-soon-logo-image {
                    width: clamp(122px, 15vw, 208px);
                    height: auto;
                    object-fit: contain;
                    opacity: 1;
                    filter: contrast(1.16) brightness(0.5);
                }
                @media (max-width: 1023px) {
                    .coming-soon-logo-glass {
                        display: none;
                    }
                }
                .slide-content {
                    position: absolute;
                    bottom: clamp(6rem, 12vh, 9rem);
                    left: clamp(1rem, 3.8vw, 4rem);
                    z-index: 10;
                    width: min(860px, calc(100% - 2rem));
                    pointer-events: auto;
                    text-align: left;
                    transform: none;
                    padding: clamp(1.5rem, 2.6vw, 3.1rem);
                    background: linear-gradient(125deg, rgba(5, 9, 19, 0.76) 0%, rgba(5, 9, 19, 0.68) 52%, rgba(10, 26, 40, 0.56) 100%);
                    backdrop-filter: blur(24px) saturate(155%);
                    -webkit-backdrop-filter: blur(24px) saturate(155%);
                    border-radius: 1.8rem;
                    border: 1px solid rgba(255, 255, 255, 0.26);
                    box-shadow: 0 28px 58px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);
                }
                @media (min-width: 1024px) {
                    .slide-content {
                        top: 50%;
                        bottom: auto;
                        transform: translateY(-50%);
                        left: clamp(1rem, 3vw, 3.5rem);
                        width: min(980px, 72vw);
                    }
                }
                .slide-title {
                    font-size: clamp(1.45rem, 2.6vw, 2.45rem);
                    font-weight: 900;
                    margin-bottom: 1rem;
                    text-transform: uppercase;
                    line-height: 1.06;
                    letter-spacing: -0.015em;
                    color: #ffffff;
                    text-shadow: 0 8px 26px rgba(0, 0, 0, 0.66);
                    max-width: 100%;
                }
                .slide-description {
                    font-size: clamp(1.2rem, 1.9vw, 1.5rem);
                    font-weight: 520;
                    opacity: 1;
                    line-height: 1.68;
                    color: rgba(248, 251, 255, 0.97);
                    text-shadow: 0 3px 16px rgba(0, 0, 0, 0.5);
                    text-align: justify;
                    text-justify: inter-word;
                    text-align-last: left;
                    hyphens: auto;
                    text-wrap: pretty;
                    max-width: 100%;
                }
                .slide-subtitle {
                    font-size: clamp(0.98rem, 1.25vw, 1.12rem);
                    font-weight: 780;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: rgba(209, 249, 244, 0.96);
                    margin-bottom: 0.95rem;
                    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
                    max-width: 100%;
                }
                @media (min-width: 1024px) {
                    .slide-title {
                        white-space: nowrap;
                    }
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
                    white-space: nowrap;
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
                .cta-button.is-disabled {
                    cursor: default;
                    opacity: 0.8;
                    pointer-events: none;
                    transform: none;
                }
                .cta-button.is-disabled:hover {
                    transform: none;
                }

                .slides-navigation {
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 1.1rem;
                    z-index: 20;
                    display: flex;
                    flex-direction: row;
                    gap: 0.7rem;
                    align-items: center;
                    justify-content: flex-start;
                    width: 100%;
                    max-width: 100vw;
                    overflow-x: auto;
                    overflow-y: hidden;
                    scrollbar-width: none;
                    padding: 0 1rem;
                    background: transparent;
                    box-sizing: border-box;
                    -webkit-overflow-scrolling: touch;
                }
                .slides-navigation::-webkit-scrollbar { display: none; }
                .slide-nav-item {
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.45rem;
                    opacity: 0.76;
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                    padding: 1rem 1.25rem;
                    border-radius: 999px;
                    background: rgba(3, 11, 24, 0.74);
                    border: 1px solid rgba(255, 255, 255, 0.24);
                    min-width: 175px;
                    width: 175px;
                    white-space: nowrap;
                    flex-shrink: 0;
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
                }
                @media (min-width: 1024px) {
                    .slide-nav-item {
                        min-width: 0;
                        width: auto;
                        flex: 1 1 0;
                        max-width: none;
                    }
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
                    letter-spacing: 0.1em;
                    font-size: 0.68rem;
                    font-weight: 780;
                    white-space: nowrap;
                    color: rgba(255, 255, 255, 0.98);
                    transition: color 0.3s ease;
                    text-align: center;
                    width: 100%;
                }
                @media (min-width: 1024px) {
                    .slide-nav-title {
                        font-size: 0.9rem;
                    }
                }
                .slide-progress-line {
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.2);
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
                        bottom: clamp(5.6rem, 9.5vh, 7.8rem);
                        transform: translateX(-50%);
                        justify-content: space-between;
                        width: min(1490px, calc(100% - 1.75rem));
                        padding: 0;
                        gap: 1.1rem;
                        overflow: visible;
                    }
                }
            `}</style>
        </div>
    );
});

LuminaInteractiveList.displayName = 'LuminaInteractiveList';
