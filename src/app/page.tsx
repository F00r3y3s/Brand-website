'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Manifesto from '@/components/Manifesto';
import WhoWeAre from '@/components/WhoWeAre';
import ProjectShowcase from '@/components/ProjectShowcase';
import Services from '@/components/Services';
// import Testimonials from '@/components/Testimonials';
import Team from '@/components/Team';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const FAQ_STICKY_TEST_VH = 400

export default function Home() {
  const { language } = useLanguage();
  const heroParallaxRef = useRef<HTMLDivElement>(null);
  const whoParallaxRef = useRef<HTMLDivElement>(null);
  const projectsParallaxRef = useRef<HTMLDivElement>(null);
  const faqParallaxRef = useRef<HTMLDivElement>(null);
  const footerParallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });
    let rafId = 0;
    let scrollLockCount = 0;

    const handleScrollLock = (event: Event) => {
      const customEvent = event as CustomEvent<{ locked?: boolean }>;
      const shouldLock = customEvent.detail?.locked === true;

      if (shouldLock) {
        scrollLockCount += 1;
      } else {
        scrollLockCount = Math.max(0, scrollLockCount - 1);
      }

      if (scrollLockCount > 0) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    window.addEventListener('app:scroll-lock', handleScrollLock as EventListener);

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('app:scroll-lock', handleScrollLock as EventListener);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!heroParallaxRef.current || !whoParallaxRef.current || !projectsParallaxRef.current || !footerParallaxRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: 'heroParallaxPin',
        trigger: heroParallaxRef.current,
        start: 'top top',
        end: () => `+=${(heroParallaxRef.current?.offsetHeight || window.innerHeight) + window.innerHeight * 0.65}`,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
      });

      ScrollTrigger.create({
        id: 'whoParallaxPin',
        trigger: whoParallaxRef.current,
        start: 'top top',
        end: () => `+=${(whoParallaxRef.current?.offsetHeight || window.innerHeight) + window.innerHeight * 0.35}`,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
      });

      ScrollTrigger.create({
        id: 'projectsParallaxPin',
        trigger: projectsParallaxRef.current,
        start: 'top top',
        end: () => `+=${projectsParallaxRef.current?.offsetHeight || window.innerHeight}`,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
      });
    });

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [language]);

  useEffect(() => {
    // When language changes (especially to RTL), text wrapping and heights change
    // significantly. A single refresh is insufficient because:
    // 1. Component useEffects with [language] deps kill & recreate their own triggers
    // 2. Font/text reflow can take multiple frames to settle
    // 3. Pinned elements need cascading recalculation
    // We do a multi-pass refresh to catch all layout changes.
    const timers: ReturnType<typeof setTimeout>[] = [];
    // First pass: after React commit + initial reflow
    timers.push(setTimeout(() => ScrollTrigger.refresh(), 100));
    // Second pass: after fonts and images settle
    timers.push(setTimeout(() => ScrollTrigger.refresh(), 400));
    // Third pass: final safety net for complex pinned sections
    timers.push(setTimeout(() => ScrollTrigger.refresh(), 800));
    return () => timers.forEach(clearTimeout);
  }, [language]);

  return (
    <main id="main-content" className="bg-cream min-h-screen">
      <Header />
      <div ref={heroParallaxRef} className="relative z-0 bg-cream">
        <Hero />
      </div>

      <div className="h-[65vh] bg-cream" aria-hidden />

      <div ref={whoParallaxRef} className="relative z-10 bg-[#F3F2EF]">
        <WhoWeAre />
      </div>

      <div className="h-[35vh] bg-[#F3F2EF]" aria-hidden />

      <div className="relative z-[15]">
        <Manifesto />
      </div>

      <div className="h-[4vh] bg-neutral-50" aria-hidden />

      <div ref={projectsParallaxRef} className="relative z-20 bg-neutral-50">
        <ProjectShowcase />
      </div>

      <div className="relative z-30">
        <Services />
      </div>
      <Team />
      {/* <Testimonials /> */}
      <div ref={faqParallaxRef} className="relative z-40 bg-[#F3F2EF]">
        <FAQ />
      </div>
      <div ref={footerParallaxRef} className="relative z-50">
        <Footer />
      </div>
      <FloatingCTA />
    </main>
  );
}
