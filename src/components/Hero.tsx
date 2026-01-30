'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ArrowRight, Play, Star } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import KineticText from './KineticText';
import CulturalPattern from './CulturalPattern';
import { WireframeSphere } from './WireframeSphere';

// Dynamically import 3D particles if we want to layer them, but WireframeSphere is the focus now.
// const GoldParticles = dynamic(() => import('./GoldParticles'), { ssr: false });

export default function Hero() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Button ripple effect
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

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Subtitle reveal
      tl.fromTo(subtitleRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 1.5 // Wait for KineticText
        }
      );

      // CTA Reveal
      tl.fromTo(ctaRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
        },
        '-=0.8'
      );

      // Background gradient pulse (Subtle)
      gsap.to('.hero-gradient', {
        opacity: 0.6,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-black"
    >
      {/* 1. Cultural Pattern Background (Low opacity) */}
      <CulturalPattern className="opacity-10" />

      {/* 2. Animated Gradient Background */}
      <div className="hero-gradient absolute inset-0 bg-gradient-to-br from-neutral-950 via-[#1a1500] to-neutral-950 opacity-40" />

      {/* 3. 3D Globe Layer - Positioned to the right/center for balance */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} />
          <group position={[3, 0, 0]} rotation={[0, -0.5, 0]}>
            {/* Offset to the right on desktop, center on mobile via CSS possibly or media query logic in JS */}
            <WireframeSphere />
          </group>
        </Canvas>
      </div>

      {/* Mobile-specific canvas adjustment if needed (can be handled by re-rendering or responsive props) */}
      {/* For now, the group position logic above puts it to the right. */}

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto w-full px-6 flex flex-col items-center lg:items-start text-center lg:text-left">

        {/* Establishment Badge */}
        <div className="flex items-center gap-3 justify-center lg:justify-start mb-8 animate-fade-in opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <div className="w-12 h-px bg-gold/50" />
          <span className="text-xs font-bold text-gold uppercase tracking-[0.6em]">
            {language === 'en' ? 'EST. 2024' : 'تأسس ٢٠٢٤'}
          </span>
          <div className="w-12 h-px bg-gold/50 lg:hidden" />
        </div>

        {/* Headlines - Using new KineticText with word wrapping */}
        <div className="flex flex-col gap-2 mb-10 max-w-4xl">
          <KineticText
            text={language === 'en' ? 'WE CRAFT TIMELESS' : 'نحن نصنع علامات'}
            className="font-display font-black text-white text-[12vw] lg:text-[7vw] leading-[0.9] tracking-tighter justify-center lg:justify-start"
            stagger={0.03}
            duration={1.0}
          />
          <KineticText
            text={language === 'en' ? 'DIGITAL EXPERIENCES' : 'تجارية استثنائية'}
            className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-gold text-[12vw] lg:text-[7vw] leading-[0.9] tracking-tighter justify-center lg:justify-start"
            stagger={0.03}
            duration={1.0}
            delay={0.5}
          />
        </div>

        {/* Discovery Subtitle */}
        <p
          ref={subtitleRef}
          className="max-w-xl text-neutral-400 font-medium leading-relaxed text-lg lg:text-xl mb-12"
        >
          {language === 'en'
            ? 'AInar is a boutique design studio bridging the gap between human intuition and artificial intelligence to build the iconic brands of tomorrow.'
            : 'AInar هو استوديو تصميم بوتيك يسد الفجوة بين الحدس البشري والذكاء الاصطناعي لبناء العلامات التجارية الأيقونية للغد.'}
        </p>

        {/* Action Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
          <button
            onClick={createRipple}
            className="group relative px-10 py-5 rounded-full bg-gold text-black font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              {language === 'en' ? 'Start a Project' : 'ابدأ مشروعك'}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>

          <button
            onClick={createRipple}
            className="group px-10 py-5 rounded-full border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-xs hover:border-gold hover:text-gold transition-all duration-300 flex items-center gap-3 backdrop-blur-sm"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{language === 'en' ? 'Showreel' : 'عرض الفيديو'}</span>
          </button>
        </div>



      </div>
    </section>
  );
}


