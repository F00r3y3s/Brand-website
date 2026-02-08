'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextRevealer from './common/TextRevealer';

gsap.registerPlugin(ScrollTrigger);

export default function Manifesto() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!containerRef.current || !paragraphRef.current) return;

    const words = paragraphRef.current.querySelectorAll('.word');

    const ctx = gsap.context(() => {
      // Word highlighting timeline
      gsap.fromTo(
        words,
        {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        {
          color: 'rgba(255, 255, 255, 1)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: true,
          },
        }
      );

      // Gold highlight for specific brand name if it exists in the future
      // For now, let's just make the whole paragraph feel alive
    }, containerRef);

    return () => ctx.revert();
  }, [language]);

  const text = language === 'en'
    ? 'We are a design and technology studio focused on clarity, craft, and real-world execution. Our work spans brand systems, digital experiences, and AI-powered products — all shaped through thoughtful design decisions and precise execution.'
    : 'نحن استوديو تصميم وتكنولوجيا يركز على الوضوح والحرفية والتنفيذ الواقعي. يمتد عملنا عبر أنظمة العلامات التجارية والتجارب الرقمية والمنتجات المدعومة بالذكاء الاصطناعي - كلها مصممة من خلال قرارات تصميم مدروسة وتنفيذ دقيق.';

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-64 px-6 sm:px-8 lg:px-12 bg-black overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col gap-12">
          <TextRevealer
            text={language === 'en' ? 'OUR PHILOSOPHY' : 'فلسفتنا'}
            className="text-xs font-bold text-gold uppercase tracking-[0.5em]"
            type="words"
          />

          <div className="space-y-12">
            <TextRevealer
              text={language === 'en' ? 'NO BORING BRANDS' : 'بدون علامات مملة'}
              className="text-6xl md:text-8xl lg:text-9xl font-black font-display text-white italic tracking-tighter leading-[0.9]"
              type="chars"
            />

            <p
              ref={paragraphRef}
              className="text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.2] tracking-tight"
            >
              {text.split(' ').map((word, i) => (
                <span key={i} className="word inline-block mr-[0.2em]">
                  {word}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Decorative background visual */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gold/10 blur-[120px] rounded-full animate-blob" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 blur-[150px] rounded-full animate-blob animation-delay-2000" />
        </div>
      </div>
    </section>
  );
}
