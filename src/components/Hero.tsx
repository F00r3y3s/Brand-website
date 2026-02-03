'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ArrowRight, Play } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import KineticText from './KineticText';
import UAESymbolsBackground from './UAESymbolsBackground';
import ExpoTorus from './ExpoTorus';
import Dunes from './Dunes';

// Dynamically import 3D particles if we want to layer them in future
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
      className="relative min-h-screen flex items-center pt-28 overflow-hidden bg-cream"
    >
      {/* 1. UAE Symbolism: Dunes & Random Symbols */}
      <Dunes />
      <UAESymbolsBackground />

      {/* 2. Animated Gradient Background - Adjusted for light theme */}
      <div className="hero-gradient absolute inset-0 bg-gradient-to-br from-cream via-sand/20 to-cream opacity-50" />

      {/* 3. Brand Hero Image - Positioned on right, low opacity to not conflict with text */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 opacity-40 lg:opacity-30">
          <img
            src="/hero-bg.png"
            alt=""
            className="w-full h-full object-cover object-right"
          />
        </div>
      </div>

      {/* 4. 3D Expo Ring Visual - Relocated to fit BG image circular opening */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-100 hidden lg:block">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} />
          {/* Relocated and scaled down significantly to fit the background image's circular hole perfectly */}
          <group position={[2.2, 0.1, 0]} rotation={[0, -0.3, 0]} scale={0.22}>
            <ExpoTorus />
          </group>
        </Canvas>
      </div>

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto w-full px-6 flex flex-col items-center lg:items-start text-center lg:text-left">

        {/* Brand Badge (Replaces EST 2024 per user request) */}
        <div className="flex items-center gap-3 justify-center lg:justify-start mb-10 animate-fade-in opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <div className="w-12 h-px bg-gold/50" />
          <span className="text-xs font-black text-neutral-900 uppercase tracking-[0.8em] font-display">
            {language === 'en' ? 'ALNAR' : 'ألنار'}
          </span>
          <div className="w-12 h-px bg-gold/50 lg:hidden" />
        </div>

        {/* Headlines - Fixed Typography for Readability */}
        <div className="flex flex-col gap-2 mb-10 max-w-5xl">
          <KineticText
            text={language === 'en' ? 'WE CRAFT TIMELESS' : 'نحن نصنع علامات'}
            className="font-display font-black text-neutral-900 text-[8vw] lg:text-[5vw] leading-normal tracking-normal justify-center lg:justify-start"
            stagger={0.03}
            duration={1.0}
          />
          <KineticText
            text={language === 'en' ? 'DIGITAL EXPERIENCES' : 'تجارية استثنائية'}
            className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-teal via-plum to-teal text-[8vw] lg:text-[5vw] leading-normal tracking-normal justify-center lg:justify-start pb-2"
            stagger={0.03}
            duration={1.0}
            delay={0.5}
          />
        </div>

        {/* Discovery Subtitle */}
        <p
          ref={subtitleRef}
          className="max-w-xl text-neutral-600 font-medium leading-relaxed text-lg lg:text-xl mb-12"
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
            className="group px-10 py-5 rounded-full border border-neutral-200 text-neutral-600 font-bold uppercase tracking-[0.2em] text-xs hover:border-teal hover:text-teal transition-all duration-300 flex items-center gap-3 backdrop-blur-sm"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{language === 'en' ? 'Showreel' : 'عرض الفيديو'}</span>
          </button>
        </div>

      </div>
    </section>
  );
}
