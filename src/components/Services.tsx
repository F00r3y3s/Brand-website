'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { LuminaInteractiveList, LuminaInteractiveListHandle } from './ui/lumina-interactive-list';
import ServiceInquiryModal from './ui/ServiceInquiryModal';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const newServicesData = [
  {
    title: "Sustainability & AI Consultancy",
    description: "We help organizations turn sustainability goals into measurable outcomes. By combining environmental strategy with applied AI, we identify where technology can reduce waste, optimize resources, and unlock long-term efficiency.",
    media: ["/services/custom/cons1.jpeg", "/services/custom/const2.jpeg"]
  },
  {
    title: "IT Services & Solutions",
    description: "We design, build, and maintain reliable digital infrastructure that scales with your business. From cloud environments to secure systems architecture, our approach prioritizes stability, performance, and clarity.",
    media: ["/services/custom/ITa.jpeg", "/services/custom/ITb.jpeg"]
  },
  {
    title: "Social Media & Generative Content Creation",
    description: "We create content systems, not just posts. By combining human creative direction with generative tools, we help brands produce consistent, high-quality visuals and messaging at scale.",
    media: ["/services/custom/socialmedia%201.jpeg", "/services/custom/social%20media%202.jpeg"]
  },
  {
    title: "E-commerce",
    description: "We build e-commerce experiences that feel effortless for the customer and efficient for the business. From platform selection to conversion-focused design, every decision is made to support growth.",
    media: ["/services/custom/ecommerce%201.jpeg", "/services/custom/ecommerce%202.jpeg"]
  },
  {
    title: "Website & App Development",
    description: "We design and build digital products with longevity in mind. Our websites and applications are fast, accessible, and thoughtfully structured — balancing visual clarity with robust engineering.",
    media: ["/services/custom/app%20development.jpeg", "/services/custom/App%20development%201.jpeg"]
  }
];

export default function Services() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const luminaRef = useRef<LuminaInteractiveListHandle>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeService, setActiveService] = useState('');

  const isInSliderPhase = useRef(false);
  const lastScrollProgress = useRef(0);
  const lastSlideIndex = useRef(0);
  const hasEnteredSliderPhase = useRef(false);

  // Handle CTA Click from Lumina List
  useEffect(() => {
    (window as any).__onServiceCtaClick = () => {
      if (luminaRef.current) {
        const idx = luminaRef.current.getCurrentIndex();
        const service = newServicesData[idx];
        if (service) {
          setActiveService(service.title);
          setIsModalOpen(true);
        }
      }
    };

    // Handle Nav Click for Scroll Sync
    (window as any).__onLuminaNavClick = (idx: number) => {
      if (!containerRef.current) return;

      const st = ScrollTrigger.getById('servicesTrigger');
      if (!st) return;

      const numSlides = newServicesData.length;
      const totalHeight = 100 + (150 * numSlides);
      const introEndVh = 100;
      const introProg = introEndVh / totalHeight;

      // Snap near the center of the selected slide so nav clicks switch directly and reliably.
      const targetSliderProg = Math.min((idx + 0.5) / numSlides, 0.995);
      const targetGlobalProg = introProg + (targetSliderProg * (1 - introProg));

      gsap.to(window, {
        scrollTo: { y: st.start + (st.end - st.start) * targetGlobalProg },
        duration: 1.2,
        ease: "expo.inOut",
        overwrite: "auto"
      });
    };

    return () => {
      delete (window as any).__onServiceCtaClick;
      delete (window as any).__onLuminaNavClick;
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !introRef.current || !listRef.current) return;

    const numSlides = newServicesData.length;
    // Buffer per slide for reading/scrolling
    const totalScrollHeight = 100 + (150 * numSlides);

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

          const vh = totalScrollHeight; // e.g., 850 (100 intro + 5*150 slides)
          const introProg = 100 / vh;   // e.g., 0.1176

          if (progress < introProg) {
            // Intro Phase
            const p = progress / introProg;

            gsap.set(introRef.current, { scale: 1 + (p * 0.5), opacity: 1 - p, filter: `blur(${p * 20}px)`, pointerEvents: 'auto' });
            gsap.set(listRef.current, { opacity: 0, scale: 0.95, filter: 'blur(10px)', pointerEvents: 'none' });

            if (isInSliderPhase.current) {
              isInSliderPhase.current = false;
              hasEnteredSliderPhase.current = false;
            }
          } else {
            // Slider Phase
            gsap.set(introRef.current, { scale: 1.5, opacity: 0, filter: 'blur(20px)', pointerEvents: 'none' });
            gsap.set(listRef.current, { opacity: 1, scale: 1, filter: 'blur(0px)', pointerEvents: 'auto' });

            if (!hasEnteredSliderPhase.current) {
              hasEnteredSliderPhase.current = true;
              isInSliderPhase.current = true;
              if (luminaRef.current && direction > 0) {
                luminaRef.current.navigateTo(0);
                lastSlideIndex.current = 0;
              }
            }

            // Map the remaining progress (introProg to 1.0) to slide indices (0 to 4.999)
            const sliderProgress = (progress - introProg) / (1 - introProg);
            const rawIndex = sliderProgress * numSlides;
            let targetSlide = Math.floor(rawIndex);
            targetSlide = Math.max(0, Math.min(targetSlide, numSlides - 1));

            // Current slide internal progress (0 to 100%)
            const slideProgressRaw = rawIndex % 1;
            const currentSlideScrollProgress = targetSlide === numSlides - 1 && sliderProgress > 0.98
              ? 100
              : Math.min(100, Math.max(0, slideProgressRaw * 100));

            if (luminaRef.current) {
              if (targetSlide !== lastSlideIndex.current) {
                luminaRef.current.navigateTo(targetSlide);
                lastSlideIndex.current = targetSlide;
              }

              // Update navigation timing bars
              for (let i = 0; i < numSlides; i++) {
                if (i < targetSlide) luminaRef.current.updateProgress(i, 100);
                else if (i === targetSlide) luminaRef.current.updateProgress(i, currentSlideScrollProgress);
                else luminaRef.current.updateProgress(i, 0);
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
  }, []);

  return (
    <>
      <div className="bg-neutral-950 relative">
        <section
          id="services"
          ref={containerRef}
          className="relative h-screen w-full flex flex-col justify-center overflow-hidden bg-neutral-950"
        >
          <div
            ref={introRef}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-4 bg-cream"
          >
            <div className="space-y-6">
              <span className="inline-block text-teal text-xs font-black uppercase tracking-[0.5em] border border-teal/20 px-6 py-2 rounded-full">
                {language === 'en' ? 'OUR CAPABILITIES' : 'قدراتنا'}
              </span>

              {/* Typography Fix: Reduced size, removed letter spacing cramp, improved line height */}
              <h2 className="text-5xl md:text-7xl font-black font-display text-neutral-900 leading-tight tracking-normal">
                {language === 'en' ? 'BEYOND' : 'ما وراء'} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal via-plum to-teal animate-gradient-shift">
                  {language === 'en' ? 'BOUNDARIES' : 'الحدود'}
                </span>
              </h2>

              <p className="max-w-xl mx-auto text-neutral-600 text-sm md:text-base font-medium leading-relaxed">
                {language === 'en'
                  ? 'We create systems that transcend limitations — blending human creativity with artificial intelligence to deliver world-class sustainability, strategy, and digital innovation.'
                  : 'نُنشئ أنظمة تتجاوز الحدود — نمزج الإبداع البشري مع الذكاء الاصطناعي لتقديم استدامة عالمية واستراتيجية وابتكار رقمي.'}
              </p>
            </div>
          </div>

          <div
            ref={listRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 scale-95 blur-[10px] transition-all duration-1000"
          >
            <LuminaInteractiveList items={newServicesData} ref={luminaRef} />
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
