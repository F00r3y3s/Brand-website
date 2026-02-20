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
import Testimonials from '@/components/Testimonials';
import Team from '@/components/Team';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import CookiesConsent from '@/components/CookiesConsent';
import FloatingCTA from '@/components/FloatingCTA';

gsap.registerPlugin(ScrollTrigger);

const FAQ_STICKY_TEST_VH = 400

export default function Home() {
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
    if (!heroParallaxRef.current || !whoParallaxRef.current || !projectsParallaxRef.current || !faqParallaxRef.current || !footerParallaxRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: 'heroParallaxPin',
        trigger: heroParallaxRef.current,
        start: 'top top',
        end: '+=180%', // Increased for more scroll room
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
      });

      ScrollTrigger.create({
        id: 'whoParallaxPin',
        trigger: whoParallaxRef.current,
        start: 'top top',
        end: '+=180%', // Increased for more scroll room
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
      });

      ScrollTrigger.create({
        id: 'projectsParallaxPin',
        trigger: projectsParallaxRef.current,
        start: 'top top',
        end: '+=70%',
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
      });

      ScrollTrigger.create({
        id: 'faqParallaxPin',
        trigger: faqParallaxRef.current,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * (FAQ_STICKY_TEST_VH / 100))}`,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
      });
    });

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

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
      <Testimonials />
      <div ref={faqParallaxRef} className="relative z-40 bg-[#F3F2EF]">
        <FAQ />
      </div>
      <div ref={footerParallaxRef} className="relative z-50">
        <Footer />
      </div>
      <FloatingCTA />
      <CookiesConsent />
    </main>
  );
}
