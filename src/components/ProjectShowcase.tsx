'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import ProjectCard from './ProjectCard';
import TextRevealer from './common/TextRevealer';
import { X } from 'lucide-react';
import AppShowcase from './AppShowcase';

export default function ProjectShowcase() {
  const { language } = useLanguage();
  const [cardWidth, setCardWidth] = useState(900);
  const [cardHeight, setCardHeight] = useState(530);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<1 | 2>(1);

  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      if (vw < 640) {
        setCardWidth(Math.max(300, vw - 44));
        setCardHeight(360);
      } else if (vw < 1024) {
        setCardWidth(Math.min(760, vw - 80));
        setCardHeight(440);
      } else {
        setCardWidth(900);
        setCardHeight(530);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const ongoingProject = {
    title: language === 'en' ? 'The Seamless Experience' : 'التجربة السلسة',
    client: language === 'en' ? 'Ongoing Project' : 'مشروع جاري',
    services: [
      language === 'en' ? 'Mobile App' : 'تطبيق جوال',
      language === 'en' ? 'In Progress' : 'قيد التنفيذ',
    ],
    imageUrl: '/projects/phone-mockup.png',
  };

  const sideOffset = Math.max(78, Math.round(cardWidth * 0.22));
  const inactiveScale = 0.94;
  const inactiveY = 12;
  const card1Offset = activeCard === 1 ? 0 : -sideOffset;
  const card2Offset = activeCard === 2 ? 0 : sideOffset;

  return (
    <div className="bg-neutral-50 relative">
      <div className="py-24 text-center">
        <TextRevealer
          text={language === 'en' ? 'OUR PROJECTS' : 'مشاريعنا'}
          className="text-teal text-xs font-black tracking-widest mb-4"
        />
        <h2 className="text-5xl font-black font-display text-neutral-900 tracking-tighter">
          {language === 'en' ? 'CASE STUDIES' : 'دراسات الحالة'}
        </h2>
      </div>

      <section
        id="projects"
        className="relative w-full flex flex-col items-center justify-center py-16 min-h-[80vh]"
      >
        <div className="w-full max-w-6xl px-4">
          <div className="relative mx-auto" style={{ width: cardWidth, height: cardHeight + 24 }}>
            {/* Card 1: Ongoing */}
            <div
              onClick={() => {
                if (activeCard === 1) setIsModalOpen(true);
                else setActiveCard(1);
              }}
              className="absolute top-0 left-1/2 cursor-pointer"
              style={{
                width: cardWidth,
                height: cardHeight,
                zIndex: activeCard === 1 ? 30 : 20,
                transform: `translateX(-50%) translateX(${card1Offset}px) translateY(${activeCard === 1 ? 0 : inactiveY}px) scale(${activeCard === 1 ? 1 : inactiveScale})`,
                transition: 'transform 220ms ease, z-index 220ms ease',
              }}
            >
              <div className="w-full h-full relative rounded-[2rem] overflow-hidden border border-white/10 shadow-xl">
                <div className="absolute top-6 left-6 z-30 pointer-events-none">
                  <div className="rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] px-3 py-2">
                    <Image
                      src="/ainar-logo-transparent.png"
                      alt="AINAR Logo"
                      width={180}
                      height={90}
                      className="w-[72px] md:w-[96px] h-auto opacity-100 contrast-125 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
                    />
                  </div>
                </div>
                <ProjectCard
                  title={ongoingProject.title}
                  client={ongoingProject.client}
                  services={ongoingProject.services}
                  imageUrl={ongoingProject.imageUrl}
                />
              </div>
            </div>

            {/* Card 2: Coming Soon */}
            <div
              onClick={() => setActiveCard(2)}
              className="absolute top-0 left-1/2 cursor-pointer"
              style={{
                width: cardWidth,
                height: cardHeight,
                zIndex: activeCard === 2 ? 30 : 20,
                transform: `translateX(-50%) translateX(${card2Offset}px) translateY(${activeCard === 2 ? 0 : inactiveY}px) scale(${activeCard === 2 ? 1 : inactiveScale})`,
                transition: 'transform 220ms ease, z-index 220ms ease',
              }}
            >
              <div className="group w-full h-full rounded-[2rem] bg-neutral-950 relative overflow-hidden border border-white/10 flex flex-col items-center justify-center text-center px-8 transition-all duration-200 hover:scale-[1.01] hover:border-gold/45 shadow-xl">
                <div className="rounded-3xl border border-white/75 bg-white/90 backdrop-blur-xl shadow-[0_18px_44px_rgba(0,0,0,0.45)] px-6 py-4 mb-6 transition-transform duration-200 group-hover:scale-105 group-hover:shadow-[0_24px_56px_rgba(0,0,0,0.55)]">
                  <Image
                    src="/ainar-logo-transparent.png"
                    alt="AINAR Logo"
                    width={320}
                    height={160}
                    className="w-[190px] md:w-[240px] h-auto opacity-100 contrast-125 drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
                  />
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-white font-display uppercase tracking-tight leading-none transition-colors duration-200 group-hover:text-gold">
                  {language === 'en' ? 'Coming Soon' : 'قريباً'}
                </h3>
                <p className="mt-5 text-xs md:text-sm text-white/65 tracking-[0.18em] uppercase">
                  {language === 'en' ? 'New Project Coming Soon' : 'مشروع جديد قريباً'}
                </p>
                <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-gold/20 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-white/8 to-transparent rounded-tr-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-6xl h-[90vh] mx-4 md:mx-6 bg-neutral-950 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="w-full h-full overflow-hidden">
              <AppShowcase isModal />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
