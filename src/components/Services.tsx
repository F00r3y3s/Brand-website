'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { LuminaInteractiveList, LuminaInteractiveListHandle } from './ui/lumina-interactive-list';
import ServiceInquiryModal from './ui/ServiceInquiryModal';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

import { servicesData } from '@/lib/data';

// ... (other imports)

declare global {
  interface Window {
    __onServiceCtaClick?: () => void;
    __onLuminaNavClick?: (idx: number) => void;
  }
}

export default function Services() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const luminaRef = useRef<LuminaInteractiveListHandle>(null);
  const introScrollHeight = 140;
  const perSlideScrollHeight = 150;
  const postSliderScrollHeight = 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeService, setActiveService] = useState('');

  const isInSliderPhase = useRef(false);
  const lastScrollProgress = useRef(0);
  const lastSlideIndex = useRef(0);
  const hasEnteredSliderPhase = useRef(false);

  // Handle CTA Click from Lumina List
  useEffect(() => {
    window.__onServiceCtaClick = () => {
      if (luminaRef.current) {
        const idx = luminaRef.current.getCurrentIndex();
        const service = servicesData[idx];
        if (service) {
          const isComingSoon = service.title.toLowerCase().includes('coming soon');
          if (isComingSoon) return;
          setActiveService(service.title);
          setIsModalOpen(true);
        }
      }
    };

    // Handle Nav Click for Scroll Sync
    window.__onLuminaNavClick = (idx: number) => {
      if (!containerRef.current) return;

      const st = ScrollTrigger.getById('servicesTrigger');
      if (!st) return;

      const numSlides = servicesData.length;
      const sliderScrollHeight = perSlideScrollHeight * numSlides;
      const totalHeight = introScrollHeight + sliderScrollHeight + postSliderScrollHeight;
      const sliderStartProg = introScrollHeight / totalHeight;
      const sliderProgRange = sliderScrollHeight / totalHeight;

      // Snap near the center of the selected slide so nav clicks switch directly and reliably.
      const targetSliderProg = Math.min((idx + 0.5) / numSlides, 0.995);
      const targetGlobalProg = sliderStartProg + (targetSliderProg * sliderProgRange);

      gsap.to(window, {
        scrollTo: { y: st.start + (st.end - st.start) * targetGlobalProg },
        duration: 1.2,
        ease: "expo.inOut",
        overwrite: "auto"
      });
    };

    return () => {
      delete window.__onServiceCtaClick;
      delete window.__onLuminaNavClick;
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !introRef.current || !listRef.current) return;

    const numSlides = servicesData.length;
    const sliderScrollHeight = perSlideScrollHeight * numSlides;
    const totalScrollHeight = introScrollHeight + sliderScrollHeight + postSliderScrollHeight;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        id: 'servicesTrigger',
        start: 'top top',
        end: `+=${totalScrollHeight}%`,
        pin: true,
        scrub: 0.5, // Smoother scrub
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const direction = self.direction;

          const vh = totalScrollHeight;
          const introProg = introScrollHeight / vh;
          const sliderProgRange = sliderScrollHeight / vh;
          const sliderStartProg = introProg;
          const sliderEndProg = sliderStartProg + sliderProgRange;

          if (progress < sliderStartProg) {
            // Intro blur/fade phase
            const p = progress / introProg;

            gsap.set(introRef.current, { scale: 1 + (p * 0.42), opacity: 1 - p, filter: `blur(${p * 18}px)`, pointerEvents: 'auto' });
            gsap.set(listRef.current, { opacity: 0, scale: 0.95, filter: 'blur(10px)', pointerEvents: 'none' });

            if (isInSliderPhase.current) {
              isInSliderPhase.current = false;
              hasEnteredSliderPhase.current = false;
            }
          } else {
            gsap.set(introRef.current, { scale: 1.5, opacity: 0, filter: 'blur(20px)', pointerEvents: 'none' });
            gsap.set(listRef.current, { opacity: 1, scale: 1, filter: 'blur(0px)', pointerEvents: 'auto' });

            if (progress < sliderEndProg) {
              // Slider phase
              if (!hasEnteredSliderPhase.current) {
                hasEnteredSliderPhase.current = true;
                isInSliderPhase.current = true;
                if (luminaRef.current && direction > 0) {
                  luminaRef.current.navigateTo(0);
                  lastSlideIndex.current = 0;
                }
              }

              const sliderProgress = (progress - sliderStartProg) / sliderProgRange;
              const rawIndex = sliderProgress * numSlides;
              let targetSlide = Math.floor(rawIndex);
              targetSlide = Math.max(0, Math.min(targetSlide, numSlides - 1));

              const slideProgressRaw = rawIndex % 1;
              const currentSlideScrollProgress = targetSlide === numSlides - 1 && sliderProgress > 0.98
                ? 100
                : Math.min(100, Math.max(0, slideProgressRaw * 100));

              if (luminaRef.current) {
                if (targetSlide !== lastSlideIndex.current) {
                  luminaRef.current.navigateTo(targetSlide);
                  lastSlideIndex.current = targetSlide;
                }

                for (let i = 0; i < numSlides; i++) {
                  if (i < targetSlide) luminaRef.current.updateProgress(i, 100);
                  else if (i === targetSlide) luminaRef.current.updateProgress(i, currentSlideScrollProgress);
                  else luminaRef.current.updateProgress(i, 0);
                }
              }
            } else {
              // Post-slider hold (headroom below)
              hasEnteredSliderPhase.current = true;
              isInSliderPhase.current = true;

              if (luminaRef.current) {
                if (lastSlideIndex.current !== numSlides - 1) {
                  luminaRef.current.navigateTo(numSlides - 1);
                  lastSlideIndex.current = numSlides - 1;
                }

                for (let i = 0; i < numSlides; i++) {
                  luminaRef.current.updateProgress(i, 100);
                }
              }
            }
            lastScrollProgress.current = progress;
          }
        },
        onEnter: () => {
          hasEnteredSliderPhase.current = false;
          lastSlideIndex.current = 0;
        },
        onEnterBack: () => {
          // Coming back from bottom
          hasEnteredSliderPhase.current = true;
          isInSliderPhase.current = true;

          if (luminaRef.current) {
            // Ensure we show the last slide when scrolling back up into view
            luminaRef.current.navigateTo(numSlides - 1);
            luminaRef.current.updateProgress(numSlides - 1, 100);
            lastSlideIndex.current = numSlides - 1;
            lastScrollProgress.current = 1;
          }
        },
        onLeave: () => {
          isInSliderPhase.current = false;
          hasEnteredSliderPhase.current = false;
        },
        onLeaveBack: () => {
          isInSliderPhase.current = false;
          hasEnteredSliderPhase.current = false;

          // Reset to 0
          setTimeout(() => {
            if (luminaRef.current) {
              luminaRef.current.navigateTo(0);
              lastSlideIndex.current = 0;
            }
          }, 500);
        }
      });

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [introScrollHeight, perSlideScrollHeight, postSliderScrollHeight]);

  return (
    <>
      <div className="bg-[#F3F2EF] relative">
        <section
          id="services"
          ref={containerRef}
          className="relative h-screen w-full flex flex-col justify-center overflow-hidden bg-[#F3F2EF]"
        >
          <div
            ref={introRef}
            className="absolute inset-0 flex flex-col items-center justify-start z-20 text-center px-4 bg-[#F3F2EF] pt-[7vh] md:pt-[8.5vh]"
          >
            <div className="relative z-10 space-y-8 w-full max-w-5xl">
              <span className="inline-flex items-center justify-center text-teal text-base md:text-lg font-black uppercase tracking-[0.34em] border-2 border-teal/35 bg-white/88 px-9 py-3 rounded-full shadow-[0_12px_28px_rgba(0,0,0,0.1)]">
                {language === 'en' ? 'OUR CAPABILITIES' : 'قدراتنا'}
              </span>

              <h2 className="text-[1.85rem] md:text-[3.2rem] lg:text-[3.4rem] font-black font-display text-neutral-900 leading-[1.04] tracking-tight lg:whitespace-nowrap">
                {language === 'en' ? 'FROM VISION TO TRANSFORMATION' : 'من الرؤية إلى التحول'}
              </h2>

              <p className="max-w-3xl mx-auto text-[#2f7f8a] text-[1.45rem] md:text-[2.15rem] font-extrabold leading-[1.18]">
                {language === 'en'
                  ? 'Real change does not begin with policies. It begins with people.'
                  : 'التغيير الحقيقي لا يبدأ بالسياسات. بل يبدأ بالناس.'}
              </p>

              <div className="max-w-4xl mx-auto space-y-6 pt-2">
                <p className="text-neutral-700 text-[1.25rem] md:text-[1.55rem] font-medium leading-[1.62] text-justify [text-justify:inter-word] [text-align-last:left] hyphens-auto text-pretty">
                  {language === 'en'
                    ? 'At AINAR, we believe you cannot transform a country without transforming behavior, and you cannot build sustainable growth without redesigning the systems that shape decisions.'
                    : 'في AINAR، نؤمن بأنك لا تستطيع تحويل دولة دون تحويل السلوك، ولا يمكنك بناء نمو مستدام دون إعادة تصميم الأنظمة التي تشكل القرارات.'}
                </p>
                <p className="text-neutral-700 text-[1.25rem] md:text-[1.55rem] font-medium leading-[1.62] text-justify [text-justify:inter-word] [text-align-last:left] hyphens-auto text-pretty">
                  {language === 'en'
                    ? 'AINAR turns ambition into measurable impact by combining human expertise, sustainability strategy, intelligent systems, and AI to create real, lasting transformation. We strengthen performance today while building long-term value for tomorrow.'
                    : 'تحوّل AINAR الطموح إلى أثر قابل للقياس من خلال الجمع بين الخبرة البشرية واستراتيجية الاستدامة والأنظمة الذكية والذكاء الاصطناعي لصناعة تحول حقيقي ودائم. نعزز الأداء اليوم مع بناء قيمة طويلة المدى للغد.'}
                </p>
              </div>
            </div>
          </div>

          <div
            ref={listRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 scale-95 blur-[10px] transition-all duration-1000"
          >
            <LuminaInteractiveList items={servicesData} ref={luminaRef} />
          </div>
        </section>
      </div>

      <ServiceInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceTitle={activeService}
      />
    </>
  );
}
