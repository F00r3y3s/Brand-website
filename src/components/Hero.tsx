'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import ServiceInquiryModal from './ui/ServiceInquiryModal';
import { servicesData } from '@/lib/data';

/**
 * Hero Component - Fibonacci Globe (Refined)
 * 
 * Key Features:
 * 1. Readable headlines on initial load
 * 2. Globe forms only when cursor is over the headline words
 * 3. Letters scale UP during globe formation for better spacing
 * 4. Continuous rotation with smooth fade in/out
 * 5. Letters return with spring wobble when mouse leaves
 */
export default function Hero() {
  const { language } = useLanguage();
  const heroRefs = useRef<Array<HTMLDivElement | HTMLButtonElement | null>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const headlineWordsRef = useRef<HTMLDivElement>(null);
  const logoBlockRef = useRef<HTMLDivElement>(null);
  const logoLeftRef = useRef<HTMLImageElement>(null);
  const logoRightRef = useRef<HTMLImageElement>(null);
  const alifFlagRef = useRef<HTMLDivElement>(null);
  const alifShapeRef = useRef<HTMLDivElement>(null);
  const alifFlagClothRef = useRef<SVGPathElement>(null);
  const alifFlagOutlineRef = useRef<SVGPathElement>(null);
  const alifFlagDepthRef = useRef<SVGPathElement>(null);
  const alifFlagShadowRef = useRef<SVGPathElement>(null);
  const supportingTextRef = useRef<HTMLDivElement>(null);
  const supportingTextBodyRef = useRef<HTMLParagraphElement>(null);
  const mousePos = useRef({
    x: -9999,
    y: -9999,
  });
  const rotation = useRef({ x: 15, y: 15 });
  const isSphereActive = useRef(false);
  const globeStrength = useRef(0);
  const flagClipPathId = React.useId().replace(/:/g, '');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const buildFlagClothPath = (phase: number, gust: number, shift: number) => {
        const topStart = 18;
        const bottomStart = 188;
        const tipX = 470;
        const leftX = 24;
        const crestA = 10 + gust * 8;
        const tailA = 17 + gust * 14;
        const tipInset = 7 + gust * 3.4;

        const topNear = topStart + Math.sin(phase * 0.96 + 0.12) * (crestA * 0.34) + shift * 3;
        const topInner = topStart + Math.sin(phase * 1.03 + 0.82) * (crestA * 0.58) + shift * 5;
        const topMid = topStart + Math.sin(phase * 1.1 + 1.42) * (crestA * 0.82) + shift * 7;
        const topOuter = topStart + Math.sin(phase * 1.18 + 2.02) * (tailA * 0.92) + shift * 9;
        const topTip = topStart + tipInset + Math.sin(phase * 1.3 + 3.22) * (tailA * 0.34) + shift * 6.2;
        const topTipCtrl = topTip - (5 + gust * 1.8) + Math.sin(phase * 1.24 + 2.66) * (tailA * 0.2);

        const bottomNear = bottomStart + Math.sin(phase * 0.92 + 0.48) * (crestA * 0.32) + shift * 2;
        const bottomInner = bottomStart + Math.sin(phase * 1.0 + 1.05) * (crestA * 0.56) + shift * 4;
        const bottomMid = bottomStart + Math.sin(phase * 1.08 + 1.66) * (crestA * 0.8) + shift * 5;
        const bottomOuter = bottomStart + Math.sin(phase * 1.15 + 2.26) * (tailA * 0.88) + shift * 7;
        const bottomTip = bottomStart - tipInset + Math.sin(phase * 1.27 + 3.38) * (tailA * 0.34) + shift * 6.2;
        const bottomTipCtrl = bottomTip + (5 + gust * 1.8) + Math.sin(phase * 1.21 + 2.84) * (tailA * 0.2);

        return `M${leftX},${topStart} C${leftX + 96},${topNear} ${leftX + 176},${topInner} ${leftX + 252},${topMid} C${leftX + 332},${topOuter} ${leftX + 398},${topTipCtrl} ${tipX},${topTip} L${tipX},${bottomTip} C${leftX + 398},${bottomTipCtrl} ${leftX + 332},${bottomOuter} ${leftX + 252},${bottomMid} C${leftX + 176},${bottomInner} ${leftX + 96},${bottomNear} ${leftX},${bottomStart} Z`;
      };

      const buildFlagDepthPath = (phase: number, gust: number, shift: number) => {
        const depthA = 8 + gust * 6;
        const y1 = 94 + Math.sin(phase * 0.95 + 0.54) * depthA + shift * 4;
        const y2 = 86 + Math.sin(phase * 1.02 + 1.21) * (depthA + 1.5) + shift * 5;
        const y3 = 98 + Math.sin(phase * 1.09 + 1.88) * (depthA + 2) + shift * 6;
        const y4 = 104 + Math.sin(phase * 1.16 + 2.58) * (depthA + 2.5) + shift * 7;
        return `M30,${y1} C168,${y2} 320,${y3} 468,${y4} L468,${y4 + 34} C320,${y3 + 28} 168,${y2 + 24} 30,${y1 + 22} Z`;
      };

      const buildFlagShadowPath = (phase: number, gust: number, shift: number) => {
        const shadowA = 7 + gust * 5;
        const y1 = 140 + Math.sin(phase * 0.9 + 0.4) * shadowA + shift * 2;
        const y2 = 146 + Math.sin(phase * 0.97 + 1.08) * (shadowA + 1) + shift * 3;
        const y3 = 154 + Math.sin(phase * 1.03 + 1.74) * (shadowA + 2) + shift * 4;
        const y4 = 162 + Math.sin(phase * 1.1 + 2.42) * (shadowA + 2.5) + shift * 5;
        return `M36,${y1} C176,${y2} 322,${y3} 468,${y4} L468,${y4 + 26} C322,${y3 + 24} 176,${y2 + 20} 36,${y1 + 18} Z`;
      };

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      const animatedItems = heroRefs.current.filter((item): item is HTMLDivElement | HTMLButtonElement => item !== null);
      const flagState = {
        phase: 0,
        gust: 0.38,
        gustTarget: 0.52,
        shift: 0.12,
        shiftTarget: 0.12,
        gustRetargetIn: 1.1,
      };
      let flagBootstrapCall: gsap.core.Tween | null = null;
      let flagIdleCall: gsap.core.Tween | null = null;
      let flagVisibilityTween: gsap.core.Tween | null = null;
      let flagScrollHandlerArmed = false;
      let isGlobeSuppressedByScroll = false;
      const isNextSectionEnteringViewport = () => {
        const whoWeAreSection = document.getElementById('who-we-are');
        if (!whoWeAreSection) return false;
        const whoTopInViewport = whoWeAreSection.getBoundingClientRect().top;
        const enterThreshold = window.innerHeight - Math.max(10, window.innerHeight * 0.02);
        return whoTopInViewport <= enterThreshold;
      };
      // --- 1. Entrance Animations ---
      tl.fromTo('.hero-logo-left', { x: -220, opacity: 0, rotation: -7 }, { x: 0, opacity: 1, rotation: 0, duration: 1.18 })
        .fromTo('.hero-logo-right', { x: 220, opacity: 0, rotation: 7 }, { x: 0, opacity: 1, rotation: 0, duration: 1.18 }, '<')
        .fromTo('.hero-logo-split', { scale: 0.96, filter: 'blur(8px)' }, { scale: 1, filter: 'blur(0px)', duration: 0.8 }, '<')
        .fromTo(animatedItems, { y: 50, opacity: 0, filter: 'blur(10px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.5, stagger: 0.15 }, '-=0.8');

      // --- 2. Branding Mark (LOCKED) ---
      tl.to('.hero-letter-stage', { opacity: 1, duration: 0.4 }, '<');
      tl.fromTo('.hero-letter-a', { x: -window.innerWidth * 0.8, opacity: 0, scale: 0.05, filter: 'blur(20px)' }, { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 4.5, ease: 'power4.out' }, '<0.3');
      tl.fromTo('.hero-letter-alif', { x: -window.innerWidth * 0.9, opacity: 0, scale: 0.02, filter: 'blur(25px)' }, { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 5.0, ease: 'power4.out' }, '<0.1');

      tl.fromTo('.letter-glow-effect', { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 4 }, '2');
      gsap.to('.letter-glow-effect', { opacity: 0.9, scale: 1.25, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 6 });

      document.querySelectorAll('.gold-dust-particle').forEach((el) => {
        gsap.set(el, { x: gsap.utils.random(-150, 150), y: gsap.utils.random(-150, 150), opacity: 0, scale: gsap.utils.random(0.8, 2.5) });
        gsap.to(el, { x: `+=${gsap.utils.random(-80, 80)}`, y: `+=${gsap.utils.random(-80, 80)}`, duration: gsap.utils.random(6, 12), repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to(el, { opacity: gsap.utils.random(0.3, 0.75), duration: 2.5, delay: 6 });
      });

      tl.add(() => {
        gsap.to('.hero-letter-a', { y: '-=12', duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to('.hero-letter-alif', { y: '-=15', duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      });

      const revealFlag = () => {
        const flag = alifFlagRef.current;
        if (flag) {
          flagVisibilityTween?.kill();
          flagVisibilityTween = gsap.to(flag, {
            autoAlpha: 0.94,
            duration: 3.15,
            ease: 'power2.inOut',
            overwrite: 'auto',
          });
        }

      };

      const hideFlag = (duration = 2.35) => {
        const flag = alifFlagRef.current;
        if (flag) {
          flagVisibilityTween?.kill();
          flagVisibilityTween = gsap.to(flag, {
            autoAlpha: 0,
            duration,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }

      };

      const scheduleFlagIdleReveal = () => {
        flagIdleCall?.kill();
        if (isNextSectionEnteringViewport()) return;
        flagIdleCall = gsap.delayedCall(gsap.utils.random(1.25, 2.2), revealFlag);
      };

      const handleScrollActivity = () => {
        hideFlag();
        if (isNextSectionEnteringViewport()) {
          flagIdleCall?.kill();
          return;
        }
        scheduleFlagIdleReveal();
      };

      const armScrollAwareFlag = () => {
        if (flagScrollHandlerArmed) return;
        flagScrollHandlerArmed = true;
        window.addEventListener('scroll', handleScrollActivity, { passive: true });
        if (isNextSectionEnteringViewport()) return;
        scheduleFlagIdleReveal();
      };

      gsap.set(alifFlagRef.current, { autoAlpha: 0 });
      flagBootstrapCall = gsap.delayedCall(5.6, armScrollAwareFlag);

      // --- 3. Fibonacci Globe Engine ---
      const letters = Array.from(document.querySelectorAll('.kinetic-letter'));
      const sphereRadius = 235;
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      const angleIncrement = 2 * Math.PI / goldenRatio;
      let settleTimeline: gsap.core.Timeline | null = null;
      const activeLetterColors = new Array<string>(letters.length).fill('');
      const activeLetterShadows = new Array<string>(letters.length).fill('');
      let delayedNeutralColorCall: gsap.core.Tween | null = null;

      const UAE_RED = '#FF0000';
      const UAE_GREEN = '#009A49';
      const UAE_WHITE = '#FFFFFF';
      const UAE_BLACK = '#000000';

      // Pre-calculate Fibonacci positions
      const letterPositions = letters.map((_, i) => {
        const t = i / letters.length;
        const inclination = Math.acos(1 - 2 * t);
        const azimuth = angleIncrement * i;

        let phi = inclination * (180 / Math.PI);
        const theta = (azimuth * (180 / Math.PI)) % 360;

        const poleBonus = Math.pow(Math.abs(phi - 90) / 90, 0.6) * 35;
        if (phi < 90) {
          phi = Math.max(5, phi - poleBonus);
        } else {
          phi = Math.min(175, phi + poleBonus);
        }

        phi = 15 + (phi / 180) * 150;

        return {
          theta: theta * (Math.PI / 180),
          phi: phi * (Math.PI / 180)
        };
      });

      // Ensure letters start at their natural positions
      gsap.set('.kinetic-letter', { x: 0, y: 0, z: 0, scale: 1, opacity: 1, rotateX: 0, rotateY: 0, rotateZ: 0 });

      const getUAEFlagColorAt = (xNorm: number, yNorm: number): string => {
        // Vertical red band on hoist side + horizontal tricolor:
        // top green, middle white, bottom black.
        if (xNorm < -0.56) return UAE_RED;
        // In screen space, negative Y is visually up and positive Y is down.
        // Keep a wider middle band so white does not look sparse.
        if (yNorm < -0.34) return UAE_GREEN;
        if (yNorm < 0.34) return UAE_WHITE;
        return UAE_BLACK;
      };

      const buildActiveLetterShadow = (color: string, depth: number, power: number): string => {
        const lift = 1.2 + (depth * 2.6);
        const nearBlur = 3 + (depth * 5.2);
        const farBlur = 12 + (depth * 18) + (power * 6);
        const glowBlur = 7 + (depth * 7) + (power * 9);
        const ambient = color === UAE_WHITE
          ? 'rgba(6, 15, 29, 0.52)'
          : 'rgba(6, 15, 29, 0.36)';
        const depthFog = color === UAE_WHITE
          ? 'rgba(6, 15, 29, 0.28)'
          : 'rgba(6, 15, 29, 0.2)';
        let tint = 'rgba(17, 106, 133, 0.16)';

        if (color === UAE_RED) tint = 'rgba(255, 0, 0, 0.2)';
        if (color === UAE_GREEN) tint = 'rgba(0, 154, 73, 0.2)';
        if (color === UAE_WHITE) tint = 'rgba(255, 255, 255, 0.24)';
        if (color === UAE_BLACK) tint = 'rgba(10, 92, 120, 0.16)';

        return `0 ${lift.toFixed(2)}px ${nearBlur.toFixed(2)}px ${ambient}, 0 ${(lift * 2.5).toFixed(2)}px ${farBlur.toFixed(2)}px ${depthFog}, 0 0 ${glowBlur.toFixed(2)}px ${tint}`;
      };

      const setLiveFlagColor = (
        letter: Element,
        index: number,
        xNorm: number,
        yNorm: number,
        normalizedZ: number,
        power: number
      ) => {
        const nextColor = getUAEFlagColorAt(xNorm, yNorm);
        const htmlLetter = letter as HTMLElement;

        if (activeLetterColors[index] !== nextColor) {
          activeLetterColors[index] = nextColor;
          htmlLetter.style.color = nextColor;
        }

        const depthStep = Math.round(normalizedZ * 12) / 12;
        const powerStep = Math.round(power * 10) / 10;
        const nextShadow = buildActiveLetterShadow(nextColor, depthStep, powerStep);
        if (activeLetterShadows[index] !== nextShadow) {
          activeLetterShadows[index] = nextShadow;
          htmlLetter.style.textShadow = nextShadow;
        }
      };

      const clearDelayedNeutralColor = () => {
        delayedNeutralColorCall?.kill();
        delayedNeutralColorCall = null;
      };

      const settleFlagColorsToNeutral = (delaySeconds = 0.22) => {
        clearDelayedNeutralColor();
        delayedNeutralColorCall = gsap.delayedCall(delaySeconds, () => {
          letters.forEach((letter, i) => {
            const htmlLetter = letter as HTMLElement;
            htmlLetter.style.color = UAE_BLACK;
            htmlLetter.style.textShadow = '0 0 0 rgba(0, 0, 0, 0)';
            activeLetterColors[i] = UAE_BLACK;
            activeLetterShadows[i] = '';
          });
          delayedNeutralColorCall = null;
        });
      };

      type Hitbox = {
        left: number;
        right: number;
        top: number;
        bottom: number;
        centerX: number;
        centerY: number;
      };

      const toHitbox = (rect: DOMRect): Hitbox => ({
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
      });

      const isPointerInside = (hitbox: Hitbox, padX = 0, padY = 0) =>
        mousePos.current.x >= hitbox.left - padX &&
        mousePos.current.x <= hitbox.right + padX &&
        mousePos.current.y >= hitbox.top - padY &&
        mousePos.current.y <= hitbox.bottom + padY;

      // Sticky leave-zone prevents rapid on/off flips when cursor is near the headline edge.
      const leavePadX = 46;
      const leavePadY = 58;
      const minActiveMs = 260;
      const releaseConfirmMs = 90;
      let activeHitbox: Hitbox | null = null;
      let activeSinceMs = 0;
      let outsideReleaseSinceMs = 0;

      const animateHeadlineSpacing = (isActive: boolean) => {
        const isDesktop = window.innerWidth >= 1024;
        const logoShift = isActive ? (isDesktop ? -44 : -26) : 0;
        const supportShift = isActive
          ? (isDesktop
            ? Math.min(window.innerHeight * 0.22, 200)
            : Math.min(window.innerHeight * 0.15, 130))
          : 0;
        const supportX = isActive ? (isDesktop ? -56 : 0) : 0;
        const supportMaxWidth = isDesktop ? (isActive ? 340 : 576) : null;
        const logoSplitDelay = isActive ? 0.12 : 0;
        const splitOffset = isActive
          ? (isDesktop ? window.innerWidth * 0.62 : window.innerWidth * 0.78)
          : 0;
        const managedTargets = [
          logoBlockRef.current,
          supportingTextRef.current,
          supportingTextBodyRef.current,
          logoLeftRef.current,
          logoRightRef.current,
        ].filter((target): target is HTMLDivElement | HTMLParagraphElement | HTMLImageElement => Boolean(target));

        gsap.killTweensOf(managedTargets);

        if (logoBlockRef.current) {
          gsap.to(logoBlockRef.current, {
            y: logoShift,
            duration: isActive ? 0.62 : 0.72,
            ease: isActive ? 'power2.out' : 'power3.inOut',
            overwrite: 'auto',
          });
        }

        if (supportingTextRef.current) {
          gsap.to(supportingTextRef.current, {
            x: supportX,
            y: supportShift,
            duration: isActive ? 0.62 : 0.72,
            ease: isActive ? 'power2.out' : 'power3.inOut',
            overwrite: 'auto',
          });
        }

        if (supportingTextBodyRef.current && supportMaxWidth !== null) {
          gsap.to(supportingTextBodyRef.current, {
            maxWidth: supportMaxWidth,
            duration: isActive ? 0.62 : 0.72,
            ease: isActive ? 'power2.out' : 'power3.inOut',
            overwrite: 'auto',
          });
        }

        if (logoLeftRef.current) {
          gsap.to(logoLeftRef.current, {
            x: -splitOffset,
            rotation: isActive ? -10 : 0,
            opacity: isActive ? 0 : 1,
            duration: isActive ? 0.74 : 0.86,
            ease: isActive ? 'power3.in' : 'expo.out',
            delay: logoSplitDelay,
            force3D: true,
            overwrite: 'auto',
          });
        }

        if (logoRightRef.current) {
          gsap.to(logoRightRef.current, {
            x: splitOffset,
            rotation: isActive ? 10 : 0,
            opacity: isActive ? 0 : 1,
            duration: isActive ? 0.74 : 0.86,
            ease: isActive ? 'power3.in' : 'expo.out',
            delay: logoSplitDelay,
            force3D: true,
            overwrite: 'auto',
          });
        }
      };

      const updatePhysics = (time: number, delta: number) => {
        const frameDelta = Math.max(0.008, delta / 1000);
        flagState.phase += frameDelta * (1.85 + flagState.gust * 1.35 + Math.abs(flagState.shift) * 0.45);
        flagState.gustRetargetIn -= frameDelta;
        if (flagState.gustRetargetIn <= 0) {
          flagState.gustTarget = gsap.utils.random(0.2, 1.08);
          flagState.shiftTarget = gsap.utils.random(-0.64, 0.64);
          flagState.gustRetargetIn = gsap.utils.random(1.15, 3.2);
        }
        flagState.gust += (flagState.gustTarget - flagState.gust) * Math.min(1, frameDelta * 1.25);
        flagState.shift += (flagState.shiftTarget - flagState.shift) * Math.min(1, frameDelta * 1.4);

        const clothPath = buildFlagClothPath(flagState.phase, flagState.gust, flagState.shift);
        const depthPath = buildFlagDepthPath(flagState.phase, flagState.gust, flagState.shift);
        const shadowPath = buildFlagShadowPath(flagState.phase, flagState.gust, flagState.shift);
        alifFlagClothRef.current?.setAttribute('d', clothPath);
        alifFlagOutlineRef.current?.setAttribute('d', clothPath);
        alifFlagDepthRef.current?.setAttribute('d', depthPath);
        alifFlagShadowRef.current?.setAttribute('d', shadowPath);
        if (alifFlagRef.current) {
          alifFlagRef.current.style.setProperty('--flag-heave', `${(flagState.shift * 1.8).toFixed(2)}px`);
          alifFlagRef.current.style.setProperty('--flag-roll', `${(flagState.shift * 0.68).toFixed(2)}deg`);
          alifFlagRef.current.style.setProperty('--flag-scale-y', `${(1 + flagState.gust * 0.018).toFixed(3)}`);

          const flagOpacity = Number(gsap.getProperty(alifFlagRef.current, 'opacity')) || 0;
          const basePull = flagOpacity * 2.8;
          const wavePull = ((flagState.gust - 0.52) * 2.7) + (flagState.shift * 0.9);
          const alifPullX = gsap.utils.clamp(1.6 * flagOpacity, 8.2, basePull + (wavePull * 1.35));
          const alifStretchX = 1 + (alifPullX * 0.022);
          const alifTilt = gsap.utils.clamp(0, 1.5, alifPullX * 0.24);

          if (alifShapeRef.current) {
            alifShapeRef.current.style.setProperty('--alif-flag-pull-x', `${alifPullX.toFixed(2)}px`);
            alifShapeRef.current.style.setProperty('--alif-flag-stretch-x', `${alifStretchX.toFixed(3)}`);
            alifShapeRef.current.style.setProperty('--alif-flag-tilt', `${alifTilt.toFixed(2)}deg`);
          }
        }
        if (isNextSectionEnteringViewport()) {
          if (!isGlobeSuppressedByScroll) {
            isGlobeSuppressedByScroll = true;
            isSphereActive.current = false;
            activeHitbox = null;
            activeSinceMs = 0;
            outsideReleaseSinceMs = 0;
            animateHeadlineSpacing(false);
            clearDelayedNeutralColor();
            settleFlagColorsToNeutral(0);
            gsap.to(globeStrength, { current: 0, duration: 0.16, ease: 'power2.out', overwrite: true });
            settleTimeline?.kill();
            settleTimeline = null;
            gsap.to(letters, {
              x: 0, y: 0, z: 0,
              rotateX: 0, rotateY: 0, rotateZ: 0,
              scale: 1,
              opacity: 1,
              duration: 0.42,
              ease: 'power2.out',
              stagger: { amount: 0.14, from: 'center' },
              overwrite: 'auto'
            });
          }
          return;
        }
        isGlobeSuppressedByScroll = false;

        const triggerElement = headlineWordsRef.current ?? headlineRef.current;
        if (!triggerElement) return;
        const nowMs = performance.now();

        const liveHitbox = toHitbox(triggerElement.getBoundingClientRect());
        const triggerHitbox = activeHitbox ?? liveHitbox;
        const isCursorOverHeadline = isPointerInside(triggerHitbox);
        const isCursorWithinReleaseZone = isPointerInside(triggerHitbox, leavePadX, leavePadY);

        if (!isSphereActive.current && isCursorOverHeadline) {
          gsap.killTweensOf(letters);
          clearDelayedNeutralColor();
          letters.forEach((letter, i) => {
            gsap.killTweensOf(letter, 'color,textShadow');
            activeLetterColors[i] = '';
            activeLetterShadows[i] = '';
          });
          settleTimeline?.kill();
          settleTimeline = null;
          gsap.set(letters, { rotateZ: 0 });
          activeHitbox = liveHitbox;
          activeSinceMs = nowMs;
          outsideReleaseSinceMs = 0;
          isSphereActive.current = true;
          animateHeadlineSpacing(true);
          gsap.to(globeStrength, {
            current: 1,
            duration: 0.45,
            ease: 'power2.out',
            overwrite: true
          });
        } else if (isSphereActive.current) {
          if (isCursorWithinReleaseZone) {
            outsideReleaseSinceMs = 0;
          } else if (outsideReleaseSinceMs === 0) {
            outsideReleaseSinceMs = nowMs;
          }

          const canDeactivate = nowMs - activeSinceMs >= minActiveMs;
          const outsideLongEnough = outsideReleaseSinceMs > 0 && nowMs - outsideReleaseSinceMs >= releaseConfirmMs;

          if (canDeactivate && outsideLongEnough) {
            isSphereActive.current = false;
            activeHitbox = null;
            activeSinceMs = 0;
            outsideReleaseSinceMs = 0;
            animateHeadlineSpacing(false);
            settleFlagColorsToNeutral();
            gsap.to(globeStrength, { current: 0, duration: 0.2, ease: 'power2.out', overwrite: true });

            settleTimeline = gsap.timeline({
              defaults: { overwrite: 'auto' },
            });

            settleTimeline.to(letters, {
              rotateZ: () => gsap.utils.random(-7, 7),
              duration: 0.16,
              stagger: { amount: 0.14, from: 'random' },
              ease: 'sine.out',
            });

            settleTimeline.to(
              letters,
              {
                x: 0, y: 0, z: 0,
                rotateX: 0, rotateY: 0, rotateZ: 0,
                scale: 1,
                opacity: 1,
                duration: 1.05,
                ease: 'elastic.out(1, 0.42)',
                stagger: { amount: 0.2, from: 'center' },
                overwrite: 'auto'
              },
              0.05
            );
          }
        }

        // Early exit if cursor is not over the headline words
        if (!isSphereActive.current) {
          return;
        }

        const centerX = triggerHitbox.centerX;
        const centerY = triggerHitbox.centerY;
        const { x: mX, y: mY } = mousePos.current;

        // Auto-rotate the sphere
        rotation.current.y += 0.12 * (delta / 16) * (Math.PI / 180);
        rotation.current.x += 0.035 * (delta / 16) * (Math.PI / 180);

        const power = globeStrength.current;

        letters.forEach((letter, i) => {
          const rect = letter.getBoundingClientRect();
          const curX = gsap.getProperty(letter, 'x') as number || 0;
          const curY = gsap.getProperty(letter, 'y') as number || 0;
          const homeX = (rect.left + rect.width / 2) - curX;
          const homeY = (rect.top + rect.height / 2) - curY;

          const pos = letterPositions[i];
          const rotX = rotation.current.x;
          const rotY = rotation.current.y;

          // Calculate 3D position
          let lx = sphereRadius * Math.sin(pos.phi) * Math.cos(pos.theta);
          let ly = sphereRadius * Math.cos(pos.phi);
          let lz = sphereRadius * Math.sin(pos.phi) * Math.sin(pos.theta);

          // Apply rotation matrices
          const x1 = lx * Math.cos(rotY) + lz * Math.sin(rotY);
          const z1 = -lx * Math.sin(rotY) + lz * Math.cos(rotY);
          lx = x1; lz = z1;

          const y2 = ly * Math.cos(rotX) - lz * Math.sin(rotX);
          const z2 = ly * Math.sin(rotX) + lz * Math.cos(rotX);
          ly = y2; lz = z2;

          const xNorm = lx / sphereRadius;
          const yNorm = ly / sphereRadius;

          // Keep the globe fixed over the headline center (not the cursor).
          const targetX = centerX + lx;
          const targetY = centerY + ly;

          // Z-depth normalization for scale and opacity
          const normalizedZ = (lz + sphereRadius) / (2 * sphereRadius); // 0 to 1
          setLiveFlagColor(letter, i, xNorm, yNorm, normalizedZ, power);

          // Scale UP during globe formation (1.0 → 1.62) while keeping the globe compact
          const globeScale = 1.0 + (0.62 * power);
          const depthScale = 0.6 + (normalizedZ * 0.4); // 0.6 to 1.0 based on depth
          const finalScale = globeScale * depthScale;

          // Continuous opacity (never fully disappear)
          const depthOpacity = 0.4 + (normalizedZ * 0.6); // 0.4 to 1.0

          gsap.to(letter, {
            x: (targetX - homeX) * power,
            y: (targetY - homeY) * power,
            z: lz * power,
            rotateY: lx * 0.1 * power,
            rotateX: -ly * 0.1 * power,
            scale: finalScale,
            opacity: 1 - ((1 - depthOpacity) * power),
            duration: 0.5,
            ease: 'power1.out',
            overwrite: 'auto'
          });
        });

        // Branding Parallax (LOCKED)
        if (mX > -5000) {
          const px = (mX / window.innerWidth - 0.5) * 40;
          const py = (mY / window.innerHeight - 0.5) * 40;
          gsap.to('.hero-letter-a', { x: px * 1.2, y: py * 0.8, duration: 1, ease: 'power2.out', overwrite: 'auto' });
          gsap.to('.hero-letter-alif', { x: px * -0.5, y: py * -0.3, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
        }
      };

      gsap.ticker.add(updatePhysics);

      const handleMouseMove = (e: MouseEvent) => {
        mousePos.current = { x: e.clientX, y: e.clientY };
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        flagBootstrapCall?.kill();
        flagIdleCall?.kill();
        flagVisibilityTween?.kill();
        gsap.ticker.remove(updatePhysics);
        window.removeEventListener('mousemove', handleMouseMove);
        if (flagScrollHandlerArmed) {
          window.removeEventListener('scroll', handleScrollActivity);
          flagScrollHandlerArmed = false;
        }
        isSphereActive.current = false;
        globeStrength.current = 0;
        activeHitbox = null;
        activeSinceMs = 0;
        outsideReleaseSinceMs = 0;
        animateHeadlineSpacing(false);
        clearDelayedNeutralColor();
        letters.forEach((letter, i) => {
          const htmlLetter = letter as HTMLElement;
          htmlLetter.style.color = UAE_BLACK;
          htmlLetter.style.textShadow = '0 0 0 rgba(0, 0, 0, 0)';
          activeLetterColors[i] = UAE_BLACK;
          activeLetterShadows[i] = '';
        });
        if (alifShapeRef.current) {
          alifShapeRef.current.style.setProperty('--alif-flag-pull-x', '0px');
          alifShapeRef.current.style.setProperty('--alif-flag-stretch-x', '1');
          alifShapeRef.current.style.setProperty('--alif-flag-tilt', '0deg');
        }
        settleTimeline?.kill();
      };
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={containerRef} className="relative h-screen flex flex-col items-center justify-center overflow-x-clip overflow-y-visible bg-cream">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="/hero-bg-clean.webp" alt="Hero Background" className="w-full h-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto px-4 sm:pl-6 sm:pr-10 lg:px-12 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10 items-center pt-20 pb-16 lg:pt-24 lg:pb-32">
        <div ref={headlineRef} className="flex flex-col items-start justify-center text-left order-2 lg:order-1 relative z-20 max-w-[46rem] pt-0 lg:ml-0 overflow-visible">
          <div ref={logoBlockRef} className="mb-0 lg:mb-[-3.5rem] mt-2 lg:-ml-10">
            <div className="hero-logo-split relative w-[336px] sm:w-[420px] lg:w-[530px] aspect-[2000/1100]">
              <img ref={logoLeftRef} src="/hero-assets/logo-part-1-aligned.webp" className="hero-logo-left absolute inset-0 w-full h-full object-contain opacity-0" />
              <img ref={logoRightRef} src="/hero-assets/logo-part-2-aligned.webp" className="hero-logo-right absolute inset-0 w-full h-full object-contain opacity-0" />
            </div>
          </div>

          <div
            ref={(el) => {
              heroRefs.current[0] = el;
              headlineWordsRef.current = el;
            }}
            className="opacity-0 translate-y-8 select-none"
          >
            <h1 className="font-display font-black text-neutral-900 leading-[1.06] tracking-tight mb-7 drop-shadow-sm w-full max-w-[44rem]">
              <span className="block text-[clamp(1.75rem,5vw,2.5rem)] lg:text-[clamp(1.15rem,3.1vw,2.2rem)] leading-tight overflow-visible">
                {(language === 'en' ? 'Sustainability in Our Roots.' : 'الاستدامة في جذورنا.').split('').map((char, i) => (
                  <span key={i} className="kinetic-letter inline-block whitespace-pre preserve-3d">{char}</span>
                ))}
              </span>
              <span className="block mt-1 text-[clamp(1.75rem,5vw,2.5rem)] lg:text-[clamp(1.15rem,3.1vw,2.2rem)] text-neutral-800 leading-tight overflow-visible">
                {(language === 'en' ? 'Intelligence for Our Future.' : 'الذكاء لمستقبلنا.').split('').map((char, i) => (
                  <span key={i} className="kinetic-letter inline-block whitespace-pre preserve-3d">{char}</span>
                ))}
              </span>
            </h1>
          </div>

          <div
            ref={(el) => {
              heroRefs.current[1] = el;
              supportingTextRef.current = el;
            }}
            className="opacity-0 translate-y-8"
          >
            <p ref={supportingTextBodyRef} className="text-lg md:text-xl text-neutral-700 max-w-xl mb-8 leading-relaxed font-medium text-pretty">
              {language === 'en' ? 'AI-powered sustainability solutions and app that reward green behavior and drive real impact.' : 'حلول استدامة مدعومة بالذكاء الاصطناعي وتطبيق يكافئ السلوك الأخضر ويدفع نحو تأثير حقيقي.'}
            </p>
          </div>
        </div>

        <div className="relative w-full h-[30vh] sm:h-[44vh] lg:h-[680px] flex items-center justify-center order-1 lg:order-2 lg:justify-center overflow-visible">
          <div className="w-full max-w-[760px] h-full flex flex-col items-center justify-center overflow-visible">
            <div className="hero-letter-stage relative w-[240px] h-[274px] pointer-events-none overflow-visible lg:translate-x-[8rem] lg:-translate-y-8 opacity-0">
              <div className="hero-letter-pair relative w-full h-full">
                <div className="letter-glow-effect absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[170%] h-[170%] opacity-0 pointer-events-none z-[-1]"
                  style={{ background: 'radial-gradient(circle, rgba(234, 179, 8, 0.6) 0%, rgba(234, 179, 8, 0.15) 50%, transparent 75%)', filter: 'blur(50px)' }} />
                <div className="gold-dust-container absolute inset-0 pointer-events-none z-0">
                  {[...Array(60)].map((_, i) => {
                    const leftSeed = (i * 67) % 100;
                    const topSeed = (i * 37 + 23) % 100;
                    return (
                      <div
                        key={i}
                        className="gold-dust-particle absolute w-1 h-1 bg-gold/80 rounded-full blur-[0.4px]"
                        style={{ left: `${leftSeed}%`, top: `${topSeed}%`, boxShadow: '0 0 8px rgba(234, 179, 8, 0.4)' }}
                      />
                    );
                  })}
                </div>
                <div className="hero-letter-a absolute left-[2%] bottom-0 z-[2] w-[74%] h-[88%] drop-shadow-[0_6px_16px_rgba(10,22,40,0.18)]"
                  style={{ backgroundColor: '#000000', WebkitMaskImage: 'url(/hero-assets/letter-a.webp)', maskImage: 'url(/hero-assets/letter-a.webp)', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', WebkitMaskSize: 'contain', maskSize: 'contain' }} />
                <div className="hero-letter-alif absolute left-[61.5%] top-[8%] w-[14.5%] h-[60%]">
                  <div
                    ref={alifShapeRef}
                    className="hero-letter-alif-shape absolute inset-0 z-[3] drop-shadow-[0_5px_14px_rgba(10,22,40,0.18)]"
                    style={{ backgroundColor: '#000000', WebkitMaskImage: 'url(/hero-assets/letter-alif.webp)', maskImage: 'url(/hero-assets/letter-alif.webp)', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', WebkitMaskSize: 'contain', maskSize: 'contain' }}
                  />
                  <div ref={alifFlagRef} className="hero-alif-flag absolute left-[26%] top-[-30%] z-[1] w-[520%] h-[124%] opacity-0">
                    <svg className="hero-alif-flag-svg" viewBox="0 0 490 220" aria-hidden="true" preserveAspectRatio="xMinYMid meet">
                      <defs>
                        <clipPath id={flagClipPathId}>
                          <path ref={alifFlagClothRef} d="M24,18 C124,22 208,30 286,24 C356,20 430,34 470,30 L470,176 C430,182 356,196 286,190 C208,184 124,186 24,188 Z" />
                        </clipPath>
                      </defs>
                      <path ref={alifFlagOutlineRef} className="hero-alif-flag-outline" d="M24,18 C124,22 208,30 286,24 C356,20 430,34 470,30 L470,176 C430,182 356,196 286,190 C208,184 124,186 24,188 Z" />
                      <g clipPath={`url(#${flagClipPathId})`}>
                        <rect x="24" y="0" width="84" height="220" fill="#FF0000" />
                        <rect x="108" y="0" width="382" height="75" fill="#009A49" />
                        <rect x="108" y="74" width="382" height="74" fill="#FFFFFF" />
                        <rect x="108" y="147" width="382" height="73" fill="#000000" />
                        <rect className="hero-alif-hoist-seam" x="36" y="8" width="8" height="206" rx="4" />
                        <path ref={alifFlagDepthRef} className="hero-alif-flag-depth" d="M30,96 C168,88 320,100 468,104 L468,138 C320,130 168,112 30,118 Z" />
                        <path ref={alifFlagShadowRef} className="hero-alif-flag-shadow" d="M36,140 C176,146 322,154 468,162 L468,188 C322,176 176,162 36,158 Z" />
                      </g>
                      <g className="hero-alif-hoist-rig">
                        <circle className="hero-alif-pole-knot" cx="-20" cy="30" r="5" />
                        <circle className="hero-alif-pole-knot" cx="-20" cy="108" r="5" />
                        <line className="hero-alif-pole-wrap" x1="-14" y1="30" x2="-2" y2="30" />
                        <line className="hero-alif-pole-wrap" x1="-14" y1="108" x2="-2" y2="108" />
                        <circle className="hero-alif-hoist-ring" cx="6" cy="30" r="5.3" />
                        <circle className="hero-alif-hoist-ring" cx="6" cy="108" r="5.3" />
                        <line className="hero-alif-flag-tie-line" x1="11.2" y1="30" x2="24" y2="30" />
                        <line className="hero-alif-flag-tie-line" x1="11.2" y1="108" x2="24" y2="108" />
                        <line className="hero-alif-halyard-line" x1="6" y1="30" x2="-28" y2="22" />
                        <line className="hero-alif-halyard-line" x1="6" y1="108" x2="-28" y2="120" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-0 right-0 z-20 flex flex-col items-center gap-4 pointer-events-none">
        <div ref={(el) => { if (el) heroRefs.current[2] = el }} className="opacity-0 translate-y-8 pointer-events-auto">
          <button onClick={(e) => { createRipple(e); setIsModalOpen(true); }} className="group px-10 py-4 rounded-full bg-neutral-900 text-white font-bold uppercase tracking-widest text-xs transition-all hover:scale-105 hover:bg-neutral-800 shadow-lg">
            <span className="relative z-10 flex items-center gap-3">{language === 'en' ? 'Start Your Journey' : 'ابدأ رحلتك'}<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></span>
          </button>
        </div>
        <button ref={(el) => { if (el) heroRefs.current[3] = el }} className="opacity-0 translate-y-8 flex flex-col items-center gap-2.5 group cursor-pointer border-none bg-transparent pointer-events-auto" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          <div className="flex flex-col items-center gap-2.5 animate-bounce">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 bg-white/45 backdrop-blur-sm px-4 py-2 rounded-full">{language === 'en' ? 'Scroll' : 'تمرير'}</span>
            <div className="w-[2px] h-8 bg-neutral-900/55 group-hover:h-11 transition-all" />
          </div>
        </button>
      </div>
      <ServiceInquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} serviceTitle="" mainTitle={language === 'en' ? 'Start Your Journey' : 'ابدأ رحلتك'} enableServiceSelection={true} availableServices={servicesData} />
    </section>
  );
}
