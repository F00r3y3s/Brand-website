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

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
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
        end: '+=150%',
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
      });

      ScrollTrigger.create({
        id: 'whoParallaxPin',
        trigger: whoParallaxRef.current,
        start: 'top top',
        end: '+=150%',
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
        endTrigger: footerParallaxRef.current,
        end: 'bottom bottom',
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

      <div className="h-[50vh] bg-cream" aria-hidden />

      <div ref={whoParallaxRef} className="relative z-10 bg-[#F3F2EF]">
        <WhoWeAre />
      </div>

      <div className="h-[26vh] bg-[#F3F2EF]" aria-hidden />

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
