'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProjectShowcase from '@/components/ProjectShowcase';
import Services from '@/components/Services';
import AppShowcase from '@/components/AppShowcase';
import Team from '@/components/Team';
import Footer from '@/components/Footer';
import CookiesConsent from '@/components/CookiesConsent';
import FloatingCTA from '@/components/FloatingCTA';

export default function Home() {
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

  return (
    <main className="bg-neutral-950 min-h-screen">
      <Header />
      <Hero />
      <ProjectShowcase />
      <Services />
      <Team />
      <AppShowcase />
      <Footer />
      <FloatingCTA />
      <CookiesConsent />
    </main>
  );
}
