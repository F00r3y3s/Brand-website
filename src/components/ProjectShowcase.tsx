'use client';

/**
 * ProjectShowcase - Scroll-pinned stacking cards
 * 
 * Animation: Cards stack on top of each other as user scrolls
 * - Section pins when it enters viewport
 * - Each card slides up from below and stacks on previous
 * - After all cards shown, section unpins and page continues
 */

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
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const projects = [
    {
      title: language === 'en' ? 'EcoMetric Analytics' : 'إحصائيات إيكومتريك',
      client: language === 'en' ? 'Global Energy Corp' : 'مؤسسة الطاقة العالمية',
      services:
        language === 'en'
          ? ['AI Advisory', 'Sustainability', 'UX Design']
          : ['استشارات الذكاء الاصطناعي', 'الاستدامة', 'تصميم تجربة المستخدم'],
      imageUrl: '/projects/sustainability.png',
      color: 'var(--brand-teal)'
    },
    {
      title: language === 'en' ? 'AURUM Luxury App' : 'تطبيق أوروم الفاخر',
      client: language === 'en' ? 'High-End Fashion House' : 'دار أزياء فاخرة',
      services:
        language === 'en'
          ? ['Mobile App', 'Branding', 'Digital Strategy']
          : ['تطبيق الجوال', 'العلامة التجارية', 'الاستراتيجية الرقمية'],
      imageUrl: '/projects/fashion.png',
      color: 'var(--brand-plum)'
    },
    {
      title: language === 'en' ? 'AI Core Visualizer' : 'مصور جوهر الذكاء الاصطناعي',
      client: language === 'en' ? 'Tech Innovators Group' : 'مجموعة المبتكرين التقنيين',
      services:
        language === 'en'
          ? ['Generative AI', 'Web Development', 'Future Labs']
          : ['الذكاء الاصطناعي التوليدي', 'تطوير الويب', 'مختبرات المستقبل'],
      imageUrl: '/projects/ai.png',
      color: 'var(--brand-green)'
    },
    {
      title: language === 'en' ? 'Aetheled Brand' : 'علامة أيثليد التجارية',
      client: language === 'en' ? 'Ultra-Luxury Hotel' : 'فندق فائق الفخامة',
      services:
        language === 'en'
          ? ['Brand Identity', '3D Visuals', 'Hospitality']
          : ['هوية العلامة التجارية', 'رسومات ثلاثية الأبعاد', 'الضيافة'],
      imageUrl: '/projects/hospitality.png',
      color: 'var(--brand-gold)'
    },
  ];

  // All items including CTA
  const totalCards = projects.length + 1; // 4 projects + 1 CTA = 5

  useEffect(() => {
    if (!sectionRef.current || !cardsContainerRef.current) return;

    const cards = gsap.utils.toArray<HTMLElement>('.project-card');

    // Kill any existing ScrollTriggers to prevent conflicts
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.id?.startsWith('project')) {
        trigger.kill();
      }
    });

    const ctx = gsap.context(() => {
      // Create a timeline that we'll scrub through
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          // End after scrolling through all cards (1 viewport per card)
          end: `+=${window.innerHeight * totalCards}`,
          pin: true,
          scrub: 1,
          id: 'project-showcase',
        }
      });

      // Animate each card (except first which is already visible)
      cards.forEach((card, index) => {
        if (index === 0) {
          // First card is already in position
          gsap.set(card, { y: 0 });
          return;
        }

        // Set initial position: below the viewport
        gsap.set(card, { y: '100%' });

        // Add to timeline: slide up into view
        // Each card takes 1 unit of timeline, spaced evenly
        tl.to(card, {
          y: 0,
          duration: 1,
          ease: 'power2.out',
        }, index - 1); // Start at timeline position (index-1)

        // Optionally dim previous card when new one arrives
        if (index > 0) {
          tl.to(cards[index - 1], {
            scale: 0.95,
            filter: 'brightness(0.7)',
            duration: 1,
            ease: 'power2.out',
          }, index - 1); // Same time as card slides in
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [totalCards]);

  return (
    <div className="bg-neutral-50 relative">

      {/* Header - Scrolls with page */}
      <div className="py-24 px-6 md:px-24 flex flex-col items-center justify-center text-center pb-0">
        <TextRevealer
          text={language === 'en' ? 'SELECTED WORKS' : 'أعمال مختارة'}
          className="text-teal text-[10px] font-black uppercase tracking-[0.5em]"
        />
        <h2 className="text-4xl md:text-5xl font-black font-display text-neutral-900 tracking-tighter leading-none mb-12">
          {language === 'en' ? 'CASE STUDIES' : 'دراسات الحالة'}
        </h2>
      </div>

      {/* Pinned Section */}
      <section
        ref={sectionRef}
        className="relative h-screen w-full flex flex-col items-center justify-start overflow-hidden pt-12"
      >
        {/* Counter indicator */}
        <div className="hidden md:flex flex-col items-end gap-2 text-right absolute top-12 right-12 z-20">
          <span className="text-plum text-sm font-bold tracking-widest leading-none">01 — 0{totalCards}</span>
          <span className="text-neutral-500 text-[10px] uppercase tracking-[0.3em]">Scroll to Explore</span>
        </div>

        {/* Cards Container */}
        <div
          ref={cardsContainerRef}
          className="relative w-full max-w-[1000px] h-[60vh] md:h-[70vh]"
        >
          {/* Project Cards */}
          {projects.map((project, index) => (
            <div
              key={index}
              className="project-card absolute inset-0 w-full h-full p-4 md:p-0"
              style={{ zIndex: index + 10 }}
            >
              <div
                className="w-full h-full relative rounded-[2rem] overflow-hidden shadow-2xl border border-black/5 group"
                style={{ backgroundColor: project.color }}
              >
                <ProjectCard {...project} />

                {/* Overlay Index */}
                <div className="absolute top-8 left-8 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <span className="text-[120px] font-black text-white/10 leading-none font-display pointer-events-none">
                    0{index + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* CTA Card - Last in stack */}
          <div
            className="project-card absolute inset-0 w-full h-full flex items-center justify-center p-4 md:p-0"
            style={{ zIndex: projects.length + 20 }}
          >
            <div className="w-full h-full bg-plum rounded-[2rem] flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center gap-10">
                <h3 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none font-display">
                  {language === 'en' ? 'YOUR VISION' : 'رؤيتك'}
                  <br />
                  <span className="text-teal">
                    {language === 'en' ? 'STARTS HERE' : 'تبدأ هنا'}
                  </span>
                </h3>
                <button className="px-12 py-6 bg-gold text-black rounded-full font-bold uppercase tracking-[0.2em] hover:scale-110 active:scale-95 transition-all duration-500 shadow-xl flex items-center gap-4 group/btn">
                  {language === 'en' ? 'Start Project' : 'ابدأ المشروع'}
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
              {/* Background glow */}
              <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full scale-150 animate-pulse pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-teal/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      </section>
    </div>
  );
}
