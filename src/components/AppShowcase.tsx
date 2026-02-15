'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextRevealer from './common/TextRevealer';
import { Star, TrendingUp, Users, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Simulated App Screen Content
const AppScreenSimulator = () => {
  return (
    <div className="w-full h-full bg-neutral-900 relative overflow-hidden flex flex-col">
      {/* Status Bar */}
      <div className="h-6 w-full flex justify-between items-center px-4 pt-2">
        <span className="text-[10px] text-white font-medium">9:41</span>
        <div className="flex gap-1">
          <div className="w-4 h-2 bg-white rounded-sm" />
          <div className="w-3 h-2 bg-white rounded-sm" />
        </div>
      </div>

      {/* Scrolling Content (Simulated Feed) */}
      <div className="app-content-reel flex-1 w-full relative">
        <div className="absolute inset-0 flex flex-col gap-4 p-4 animate-app-scroll">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-white font-bold text-lg">Hello, Sarah</div>
              <div className="text-neutral-500 text-xs">Welcome back</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gold/20" />
          </div>

          {/* Chart Card */}
          <div className="w-full h-40 bg-neutral-800 rounded-2xl p-4 border border-white/5 relative overflow-hidden">
            <div className="text-neutral-400 text-xs mb-2">Total Impact</div>
            <div className="text-2xl font-bold text-white mb-4">+124%</div>
            {/* Mock Chart Line */}
            <svg className="absolute bottom-0 left-0 w-full h-16" preserveAspectRatio="none">
              <path d="M0 64 L20 50 L40 55 L60 30 L80 40 L100 20 L120 25 L140 5 L160 30 L180 10 L200 64 Z" fill="url(#gradient)" opacity="0.5" />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 overflow-x-hidden">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-20 h-20 bg-neutral-800 rounded-2xl flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gold">
                  {i === 0 ? <TrendingUp size={14} /> : i === 1 ? <Users size={14} /> : <ShieldCheck size={14} />}
                </div>
                <div className="w-8 h-1 bg-white/10 rounded-full" />
              </div>
            ))}
          </div>

          {/* List Items */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full h-16 bg-neutral-800 rounded-xl flex items-center px-4 gap-3 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-neutral-700" />
              <div className="flex-1">
                <div className="w-24 h-3 bg-white/10 rounded-full mb-2" />
                <div className="w-16 h-2 bg-white/5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="h-16 w-full border-t border-white/5 bg-neutral-900 flex justify-around items-center px-6">
        <div className="w-6 h-6 rounded-full bg-gold" />
        <div className="w-6 h-6 rounded-full bg-neutral-800" />
        <div className="w-6 h-6 rounded-full bg-neutral-800" />
      </div>
    </div>
  );
};

export default function AppShowcase({ isModal = false }: { isModal?: boolean }) {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !phoneRef.current) return;

    const ctx = gsap.context(() => {
      if (isModal) {
        // Modal Mode: Auto-play animations without ScrollTrigger
        gsap.to(phoneRef.current, {
          rotateY: -15,
          rotateX: 10,
          scale: 1.1,
          borderWidth: '2px',
          borderColor: '#D4AF37',
          duration: 1.5,
          ease: 'power2.out',
          delay: 0.2
        });

        gsap.to('.stat-card', {
          y: -100,
          opacity: 1,
          stagger: 0.2,
          duration: 1,
          ease: 'power2.out',
          delay: 0.8
        });
      } else {
        // Scroll Mode: ScrollTrigger animations
        const isMobile = window.innerWidth < 768;

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: !isMobile,
          scrub: 1,
        });

        gsap.to(phoneRef.current, {
          rotateY: -15,
          rotateX: 10,
          scale: 1.1,
          borderWidth: '2px',
          borderColor: '#D4AF37', // Gold border glow on scroll
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=150%',
            scrub: 1,
          }
        });

        gsap.to('.stat-card', {
          y: -100,
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=100%',
            scrub: 1,
          }
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, [isModal]);

  return (
    <div className="bg-neutral-950 overflow-hidden">
      <section
        ref={containerRef}
        className={`relative w-full flex items-center justify-center overflow-hidden perspective-2000 ${isModal ? 'h-full py-8 sm:py-10 md:py-12' : 'min-h-screen py-16 md:h-screen md:py-0'}`}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[100px] rounded-full" />
        </div>

        {/* Text Content - Absolute Left/Right or Behind */}
        <div className="absolute z-0 w-full flex justify-between px-6 md:px-24 pointer-events-none">
          <div className="hidden md:block text-left opacity-20">
            <h2 className="text-9xl font-black font-display text-white tracking-tighter loading-none">
              APP
            </h2>
          </div>
          <div className="hidden md:block text-right opacity-20">
            <h2 className="text-9xl font-black font-display text-white tracking-tighter loading-none">
              2.0
            </h2>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className={`text-center ${isModal ? 'mb-6 sm:mb-8 md:mb-10' : 'mb-12'}`}>
            <TextRevealer
              text={language === 'en' ? 'Seamless Experience' : 'تجربة سلسة'}
              className="text-gold text-xs font-black uppercase tracking-[0.4em] mb-4"
            />
            <h2 className={`font-black font-display text-white ${isModal ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-4xl md:text-5xl'}`}>
              {language === 'en' ? 'The Future in Your Hand' : 'المستقبل بين يديك'}
            </h2>
          </div>

          {/* 3D Phone Container */}
          <div
            ref={phoneRef}
            className={`relative rounded-[48px] border-[8px] border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden transform-style-3d will-change-transform ${isModal ? 'w-[220px] h-[440px] sm:w-[240px] sm:h-[480px] md:w-[280px] md:h-[560px] lg:w-[300px] lg:h-[600px]' : 'w-[300px] h-[600px]'}`}
            style={{ transform: 'rotateY(0deg) rotateX(0deg)' }}
          >
            {/* Frame Shine */}
            <div className="absolute inset-0 rounded-[40px] pointer-events-none border border-white/10 z-20" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30" /> {/* Notch */}

            {/* Simulated Screen */}
            <AppScreenSimulator />
          </div>

          {/* Floating Stats Cards */}
          <div className="absolute top-1/2 right-[15%] translate-x-1/2 -translate-y-1/2 space-y-6 pointer-events-none hidden lg:block">
            {/* Stat 1 */}
            <div className="stat-card backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-4 w-64 translate-y-[100px] opacity-0">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">+84%</div>
                <div className="text-xs text-neutral-400">Growth Rate</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="stat-card backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-4 w-64 translate-y-[100px] opacity-0 ml-12">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <Star size={20} fill="#D4AF37" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">4.9/5</div>
                <div className="text-xs text-neutral-400">User Rating</div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* CSS for infinite scroll inside the phone */}
      <style jsx global>{`
         @keyframes app-scroll {
            0% { transform: translateY(0); }
            50% { transform: translateY(-20%); }
            100% { transform: translateY(0); }
         }
         .animate-app-scroll {
            animation: app-scroll 8s ease-in-out infinite;
         }
      `}</style>
    </div>
  );
}
