'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import ExpoTorus from '@/components/ExpoTorus';

export default function Hero() {
  const { language } = useLanguage();
  const heroRefs = useRef<Array<HTMLDivElement | HTMLButtonElement | null>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Stagger animate all hero elements with Blur effect
      tl.fromTo(heroRefs.current,
        {
          y: 50,
          opacity: 0,
          filter: 'blur(10px)'
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          stagger: 0.15,
          delay: 0.2
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-screen flex flex-col items-center justify-center overflow-x-clip overflow-y-visible bg-cream"
    >
      {/* Background Image - Covers the entire area */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/hero-bg-clean.png"
          alt="Hero Background"
          className="w-full h-full object-cover opacity-35"
        />
        {/* Subtle Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>

      {/* Main Grid Container */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto pl-4 pr-6 sm:pl-8 sm:pr-12 lg:pl-12 lg:pr-24 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10 items-center pt-24 pb-32">

        {/* Left Column: Text Content */}
        <div className="flex flex-col items-start justify-center text-left order-2 lg:order-1 relative z-20 max-w-[44rem] pt-4 lg:-ml-2">

          {/* Brand Logo */}
          <div
            ref={(el) => { if (el) heroRefs.current[0] = el }}
            className="mb-5 mt-2 opacity-0 translate-y-8"
          >
            <img
              src="/ainar-logo-transparent.png"
              alt="AINAR Logo"
              className="w-[260px] sm:w-[320px] lg:w-[360px] h-auto"
            />
          </div>

          {/* Headline */}
          <div ref={(el) => { if (el) heroRefs.current[1] = el }} className="opacity-0 translate-y-8">
            <h1 className="font-display font-black text-neutral-900 leading-[1.06] tracking-tight mb-7 drop-shadow-sm w-full max-w-[44rem]">
              <span className="block sm:whitespace-nowrap text-[clamp(1.15rem,3.1vw,2.2rem)]">
                {language === 'en' ? 'Sustainability in Our Roots.' : 'الاستدامة في جذورنا.'}
              </span>
              <span className="block mt-1 sm:whitespace-nowrap text-[clamp(1.15rem,3.1vw,2.2rem)] text-neutral-800">
                {language === 'en' ? 'Intelligence for Our Future.' : 'الذكاء لمستقبلنا.'}
              </span>
            </h1>
          </div>

          {/* Sub-headline */}
          <div ref={(el) => { if (el) heroRefs.current[2] = el }} className="opacity-0 translate-y-8">
            <p className="text-lg md:text-xl text-neutral-700 max-w-xl mb-8 leading-relaxed font-medium">
              {language === 'en'
                ? 'AI-powered sustainability solutions and app that reward green behavior and drive real impact.'
                : 'حلول استدامة مدعومة بالذكاء الاصطناعي وتطبيق يكافئ السلوك الأخضر ويدفع نحو تأثير حقيقي.'}
            </p>
          </div>
        </div>

        {/* Right Column: Brand Name + 3D Ring */}
        <div className="relative w-full h-[40vh] sm:h-[46vh] lg:h-[680px] flex items-center justify-center order-1 lg:order-2 lg:justify-center overflow-visible">
          <div
            ref={(el) => { if (el) heroRefs.current[3] = el }}
            className="w-full max-w-[760px] h-full opacity-0 translate-y-8 flex flex-col items-center justify-center lg:justify-start lg:pt-0 overflow-visible"
          >
            {/* Brand Name - positioned top right */}
            <div className="inline-flex flex-col items-center leading-none lg:translate-y-4 lg:translate-x-36">
              <span
                className="font-display font-black text-gradient-animate bg-clip-text text-transparent tracking-tight"
                style={{
                  fontSize: 'clamp(2.3rem, 5vw, 4.9rem)',
                  backgroundImage: 'linear-gradient(90deg, var(--brand-teal), var(--brand-gold), var(--brand-plum))',
                  backgroundSize: '200% auto'
                }}
              >
                {language === 'en' ? 'AINAR' : 'اينار'}
              </span>
            </div>

            {/* Circular 3D Animation (desktop) */}
            <div className="hidden lg:block relative mt-0 w-full max-w-[760px] h-[620px] pointer-events-none overflow-visible lg:translate-x-24 lg:-translate-y-6">
              <Canvas camera={{ position: [0, 0, 12], fov: 50 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <group position={[0.6, -0.3, 0]} rotation={[0, -0.3, 0]} scale={0.72}>
                  <ExpoTorus />
                </group>
              </Canvas>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Center: CTA & Scroll Indicator */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex flex-col items-center gap-3 pointer-events-none">

        {/* CTA Button */}
        <div ref={(el) => { if (el) heroRefs.current[4] = el }} className="opacity-0 translate-y-8 pointer-events-auto">
          <button
            onClick={createRipple}
            className="group relative px-7 py-2.5 rounded-full bg-neutral-900 text-white font-bold uppercase tracking-widest text-[9px] md:text-[10px] transition-all duration-300 hover:scale-105 hover:bg-neutral-800 hover:shadow-xl shadow-lg border border-white/10"
          >
            <span className="relative z-10 flex items-center gap-3">
              {language === 'en' ? 'Start Your Journey' : 'ابدأ رحلتك'}
              <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <button
          ref={(el) => { if (el) heroRefs.current[5] = el }}
          className="opacity-0 translate-y-8 flex flex-col items-center gap-2 group cursor-pointer border-none bg-transparent pointer-events-auto"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          aria-label="Scroll down"
        >
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-neutral-900 group-hover:text-black transition-colors bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
              {language === 'en' ? 'Scroll' : 'تمرير'}
            </span>
            <div className="w-[2px] h-6 bg-neutral-900/50 group-hover:h-9 group-hover:bg-neutral-900 transition-all duration-500 origin-top" />
          </div>
        </button>
      </div>
    </section>
  );
}
