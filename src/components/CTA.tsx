'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import TextRevealer from './common/TextRevealer';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Scale down background on scroll
      gsap.to('.cta-bg', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        scale: 1.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative min-h-screen py-32 flex flex-col justify-center items-center px-6 overflow-hidden bg-black"
    >
      {/* Dynamic Background */}
      <div className="cta-bg absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto text-center space-y-16">
        <div className="space-y-6">
          <TextRevealer
            text={language === 'en' ? 'READY TO TRANSFORM?' : 'هل أنت مستعد للتحول؟'}
            className="text-gold text-xs font-bold uppercase tracking-[0.6em]"
            type="words"
          />

          <TextRevealer
            text={language === 'en' ? "LET'S CREATE THE FUTURE" : 'دعنا ننشئ المستقبل'}
            className="text-6xl md:text-8xl lg:text-9xl font-black font-display text-white tracking-tighter leading-[0.85]"
            type="chars"
          />
        </div>

        <p className="text-neutral-400 text-xl md:text-3xl max-w-3xl mx-auto leading-relaxed font-medium">
          {language === 'en'
            ? "Your brand belongs in the spotlight. Partner with our studio to bridge the gap between imagination and execution."
            : "علامتك التجارية تنتمي إلى الأضواء. شارك مع استوديو الخاص بنا لسد الفجوة بين الخيال والتنفيذ."}
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-8">
          <button className="group relative px-12 py-8 rounded-full bg-gold text-black font-black uppercase tracking-widest text-sm hover:scale-105 transition-all duration-500 overflow-hidden">
            <span className="relative z-10 flex items-center gap-3">
              {language === 'en' ? 'Start Your Project' : 'ابدأ مشروعك'}
              <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform duration-500" />
            </span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-20" />
          </button>

          <button className="px-10 py-6 text-white font-bold uppercase tracking-widest text-xs hover:text-gold transition-colors duration-300">
            {language === 'en' ? 'Download Capabilities' : 'تحميل الإمكانيات'}
          </button>
        </div>

        {/* Stats Grid - Minimalist */}
        <div className="pt-32 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 border-t border-white/5">
          {[
            { label: language === 'en' ? 'PROJECTS' : 'مشاريع', val: '120+' },
            { label: language === 'en' ? 'AWARDS' : 'جوائز', val: '14' },
            { label: language === 'en' ? 'COUNTRIES' : 'دول', val: '22' },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="text-4xl md:text-6xl font-black text-white">{stat.val}</div>
              <div className="text-xs font-bold text-neutral-500 tracking-[0.3em] uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
