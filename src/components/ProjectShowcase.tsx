'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard from './ProjectCard';
import TextRevealer from './common/TextRevealer';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectShowcase() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const projects = [
    {
      title: language === 'en' ? 'EcoMetric Analytics' : 'إحصائيات إيكومتريك',
      client: language === 'en' ? 'Global Energy Corp' : 'مؤسسة الطاقة العالمية',
      services:
        language === 'en'
          ? ['AI Advisory', 'Sustainability', 'UX Design']
          : ['استشارات الذكاء الاصطناعي', 'الاستدامة', 'تصميم تجربة المستخدم'],
      imageUrl: '/projects/sustainability.png',
      color: '#0A2A12' // Custom dark accent
    },
    {
      title: language === 'en' ? 'AURUM Luxury App' : 'تطبيق أوروم الفاخر',
      client: language === 'en' ? 'High-End Fashion House' : 'دار أزياء فاخرة',
      services:
        language === 'en'
          ? ['Mobile App', 'Branding', 'Digital Strategy']
          : ['تطبيق الجوال', 'العلامة التجارية', 'الاستراتيجية الرقمية'],
      imageUrl: '/projects/fashion.png',
      color: '#1A0505'
    },
    {
      title: language === 'en' ? 'AI Core Visualizer' : 'مصور جوهر الذكاء الاصطناعي',
      client: language === 'en' ? 'Tech Innovators Group' : 'مجموعة المبتكرين التقنيين',
      services:
        language === 'en'
          ? ['Generative AI', 'Web Development', 'Future Labs']
          : ['الذكاء الاصطناعي التوليدي', 'تطوير الويب', 'مختبرات المستقبل'],
      imageUrl: '/projects/ai.png',
      color: '#050A1A'
    },
    {
      title: language === 'en' ? 'Aetheled Brand' : 'علامة أيثليد التجارية',
      client: language === 'en' ? 'Ultra-Luxury Hotel' : 'فندق فائق الفخامة',
      services:
        language === 'en'
          ? ['Brand Identity', '3D Visuals', 'Hospitality']
          : ['هوية العلامة التجارية', 'رسومات ثلاثية الأبعاد', 'الضيافة'],
      imageUrl: '/projects/hospitality.png',
      color: '#1A1505'
    },
  ];

  useEffect(() => {
    if (!containerRef.current || !cardsRef.current) return;

    const cards = Array.from(cardsRef.current.children) as HTMLDivElement[];
    const totalScrollHeight = window.innerHeight * 3; // Scroll distance

    const ctx = gsap.context(() => {

      // Pin the entire section
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${totalScrollHeight}`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          // Optional: track progress for other effects
        }
      });

      // Stacking Animation
      // Card 1 starts visible.
      // Card 2 slides up over Card 1.
      // Card 3 slides up over Card 2.
      // Each previous card scales down slightly and darkens.

      cards.forEach((card, i) => {
        if (i === 0) return; // First card stays put initially

        // Initial state for subsequent cards: pushed down
        gsap.set(card, {
          y: window.innerHeight,
          scale: 1,
          filter: 'brightness(1)'
        });

        // The timeline for THIS card's entry
        gsap.to(card, {
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top top+=${(i - 1) * (totalScrollHeight / (cards.length - 1))}`,
            end: `top top+=${i * (totalScrollHeight / (cards.length - 1))}`,
            scrub: true,
          }
        });

        // The timeline for the PREVIOUS card's exit (scale down + darken)
        if (i > 0) {
          const prevCard = cards[i - 1];
          gsap.to(prevCard, {
            scale: 0.9 + (0.05 * (cards.length - i)), // varying scale for stack effect
            filter: 'brightness(0.6)',
            y: -50, // Slight push up
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: `top top+=${(i - 1) * (totalScrollHeight / (cards.length - 1))}`,
              end: `top top+=${i * (totalScrollHeight / (cards.length - 1))}`,
              scrub: true,
            }
          });
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [projects.length]);

  return (
    <div className="bg-neutral-950">
      <section
        ref={containerRef}
        className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Header Content - Absolute at top */}
        <div className="absolute top-12 left-6 right-6 md:top-20 md:left-24 md:right-24 z-10 flex justify-between items-start pointer-events-none">
          <div className="space-y-4">
            <TextRevealer
              text={language === 'en' ? 'SELECTED WORKS' : 'أعمال مختارة'}
              className="text-gold text-[10px] font-black uppercase tracking-[0.5em]"
            />
            <h2 className="text-4xl md:text-5xl font-black font-display text-white tracking-tighter leading-none">
              {language === 'en' ? 'CASE STUDIES' : 'دراسات الحالة'}
            </h2>
          </div>

          <div className="hidden md:flex flex-col items-end gap-2 text-right">
            <span className="text-gold text-sm font-bold">01 — 04</span>
            <span className="text-neutral-500 text-[10px] uppercase tracking-widest">Scroll to Explore</span>
          </div>
        </div>

        {/* Cards Container */}
        <div
          ref={cardsRef}
          className="relative w-full max-w-[1000px] h-[60vh] md:h-[70vh] flex items-center justify-center perspective-1000"
        >
          {projects.map((project, index) => (
            <div
              key={index}
              className="absolute inset-0 w-full h-full p-4 md:p-0 flex items-center justify-center origin-bottom"
              style={{ zIndex: index + 1 }}
            >
              {/* Wrapper for the card to allow independent internal layout if needed */}
              <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-900 group">
                <ProjectCard {...project} />

                {/* Overlay Index */}
                <div className="absolute top-8 left-8 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-[120px] font-black text-white/5 leading-none font-display">
                    0{index + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* "Next Project" CTA Card - The final card in the stack */}
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center origin-bottom bg-gold p-12 rounded-3xl text-center"
            style={{ zIndex: projects.length + 1, transform: 'translateY(100vh)' }} // Start off-screen
          >
            <div className="flex flex-col items-center gap-8">
              <h3 className="text-4xl md:text-7xl font-black text-black tracking-tighter uppercase leading-none">
                {language === 'en' ? 'YOUR VISION' : 'رؤيتك'}
                <br />
                {language === 'en' ? 'STARTS HERE' : 'تبدأ هنا'}
              </h3>
              <button className="px-10 py-5 bg-black text-white rounded-full font-bold uppercase tracking-widest hover:scale-110 transition-transform duration-300 flex items-center gap-4">
                {language === 'en' ? 'Start Project' : 'ابدأ المشروع'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      </section>
    </div>
  );
}

