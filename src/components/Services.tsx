'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { servicesList, Service } from './services/ServiceData';
import ScanningGrid from './services/ScanningGrid';
import LiquidCode from './services/LiquidCode';
import TextRevealer from './common/TextRevealer';
import { MoveRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const VisualFactory = ({ service }: { service: Service }) => {
  switch (service.visualType) {
    case 'scanning':
      return <ScanningGrid />;
    case 'liquid':
      return <LiquidCode />;
    case 'mesh':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-neutral-900 to-neutral-950">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/10 blur-[150px] rounded-full animate-pulse" />
        </div>
      );
    case 'image':
      return (
        <div className="absolute inset-0 overflow-hidden">
          {/* Fallback pattern if no image */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
        </div>
      );
    default:
      return <div className="absolute inset-0 bg-neutral-900" />;
  }
};

export default function Services() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !horizontalWrapperRef.current || !introRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Vertical -> Horizontal Transition
      // The "Scale into Focus" Effect (Nivora Style)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=400%', // Long scroll distance
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      // Step A: Intro content scales UP and fades OUT
      tl.to(introRef.current, {
        scale: 1.5,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 1,
        ease: 'power2.inOut'
      });

      // Step B: Horizontal container scales DOWN into view then scrolls
      tl.fromTo(horizontalWrapperRef.current,
        {
          scale: 0.8,
          opacity: 0,
          y: 100
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out'
        },
        '-=0.5' // Overlap
      );

      // Step C: Horizontal Scroll
      if (horizontalWrapperRef.current) {
        const scrollDist = horizontalWrapperRef.current.scrollWidth - window.innerWidth;

        tl.to(horizontalWrapperRef.current, {
          x: -scrollDist,
          duration: 5, // Relative duration compared to transition
          ease: 'none'
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-neutral-950 overflow-hidden">
      <section
        id="services"
        ref={containerRef}
        className="relative h-screen w-full flex flex-col justify-center overflow-hidden"
      >

        {/* PHASE 1: Scale-Into-Focus Intro */}
        <div
          ref={introRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4"
        >
          <div className="space-y-6">
            <span className="inline-block text-gold text-xs font-black uppercase tracking-[0.5em] border border-gold/30 px-4 py-2 rounded-full">
              {language === 'en' ? 'OUR CAPABILITIES' : 'قدراتنا'}
            </span>
            <h2 className="text-5xl md:text-8xl font-black font-display text-white tracking-tighter leading-none">
              {language === 'en' ? 'BEYOND' : 'ما وراء'} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-gold animate-gradient-shift">
                {language === 'en' ? 'BOUNDARIES' : 'الحدود'}
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-neutral-400 text-sm md:text-base font-medium leading-relaxed">
              {language === 'en'
                ? 'Comprehensive design and technology solutions tailored for the ambitious.'
                : 'حلول تصميم وتكنولوجيا شاملة مصممة للطموحين.'}
            </p>
          </div>
        </div>

        {/* PHASE 2: Horizontal Scroll Container */}
        <div
          ref={horizontalWrapperRef}
          className="flex items-center gap-8 md:gap-12 px-6 md:px-24 h-[70vh] w-max opacity-0 will-change-transform"
        >
          {servicesList.map((service, index) => (
            <div
              key={service.id}
              className="relative w-[300px] md:w-[450px] h-full flex-shrink-0 group perspective-1000"
            >
              <div className="w-full h-full relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 transition-transform duration-500 group-hover:scale-[1.02] group-hover:border-gold/30 select-none">

                {/* Background Visual */}
                <VisualFactory service={service} />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-4xl font-black text-white/10 group-hover:text-gold/20 transition-colors">0{index + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all duration-300">
                      <MoveRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>

                  <div className="space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl md:text-3xl font-black font-display text-white uppercase leading-none">
                      {language === 'en' ? service.title.en : service.title.ar}
                    </h3>
                    <p className="text-sm text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">
                      {language === 'en' ? service.description.en : service.description.ar}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* End Card */}
          <div className="w-[300px] h-full flex flex-col justify-center items-start pl-12">
            <h3 className="text-4xl font-black font-display text-white leading-tight uppercase">
              {language === 'en' ? 'READY TO' : 'مستعد'} <br />
              <span className="text-gold">{language === 'en' ? 'SCALE?' : 'للتوسع؟'}</span>
            </h3>
          </div>
        </div>
      </section>
    </div>
  );
}

