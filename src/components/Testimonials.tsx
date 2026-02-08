'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';
import TextRevealer from './common/TextRevealer';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  id: string;
  author: { en: string; ar: string };
  company: { en: string; ar: string };
  content: { en: string; ar: string };
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    author: { en: 'Ali Al-Suwaidi', ar: 'علي السويدي' },
    company: { en: 'TechVision Dubai', ar: 'رؤية التكنولوجيا دبي' },
    content: {
      en: 'AInar transformed our entire digital presence. The team delivered an award-winning website.',
      ar: 'غيرت AInar وجودنا الرقمي بالكامل. قدم الفريق موقعًا ويب حائزًا على جوائز.',
    },
  },
  {
    id: '2',
    author: { en: 'Hana Al-Dhaheri', ar: 'هنا الظاهري' },
    company: { en: 'Sustainable Futures', ar: 'المستقبل المستدام' },
    content: {
      en: 'Working with AInar on our app was a game-changer. Their expertise in AI is unmatched.',
      ar: 'إن العمل مع AInar على تطبيقنا غير قواعد اللعبة. خبرتهم في الذكاء الاصطناعي لا مثيل لها.',
    },
  },
  {
    id: '3',
    author: { en: 'Fatima Al-Hosani', ar: 'فاطمة الحوسني' },
    company: { en: 'Eco Ventures', ar: 'إيكو فينتشرز' },
    content: {
      en: 'Pure excellence in craft and execution. Best partner for high-end digital products.',
      ar: 'تميز نقي في الحرفية والتنفيذ. أفضل شريك للمنتجات الرقمية الراقية.',
    }
  }
];

export default function Testimonials() {
  const { language } = useLanguage();
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;

    const marquee = marqueeRef.current;
    const content = marquee.querySelector('.marquee-content');
    if (!content) return;

    // Duplicate content for seamless loop
    const clone = content.cloneNode(true) as HTMLElement;
    marquee.appendChild(clone);

    const speed = 50; // pixels per second
    const totalWidth = content.scrollWidth;
    const duration = totalWidth / speed;

    gsap.to([content, clone], {
      x: -totalWidth,
      duration: duration,
      ease: 'none',
      repeat: -1,
    });
  }, []);

  return (
    <section className="py-32 bg-black overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <TextRevealer
          text={language === 'en' ? 'VOICES OF TRUST' : 'أصوات الثقة'}
          className="text-gold text-xs font-bold uppercase tracking-[0.5em] mb-4"
        />
        <TextRevealer
          text={language === 'en' ? 'KIND WORDS FROM CLIENTS' : 'كلمات طيبة من العملاء'}
          className="text-4xl md:text-6xl font-black font-display text-white tracking-tighter"
          type="words"
        />
      </div>

      <div ref={marqueeRef} className="flex gap-8 cursor-grab active:cursor-grabbing">
        <div className="marquee-content flex gap-8">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={`${t.id}-${i}`}
              className="w-[400px] md:w-[600px] flex-shrink-0 p-12 rounded-[40px] bg-neutral-900/50 border border-white/5 space-y-8"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={14} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="text-2xl font-medium text-white leading-relaxed">
                "{language === 'en' ? t.content.en : t.content.ar}"
              </p>
              <div className="flex flex-col">
                <span className="text-white font-bold">{language === 'en' ? t.author.en : t.author.ar}</span>
                <span className="text-neutral-500 text-sm">{language === 'en' ? t.company.en : t.company.ar}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
