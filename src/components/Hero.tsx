'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import ServiceInquiryModal from './ui/ServiceInquiryModal';
import { servicesData } from '@/lib/data';


export default function Hero() {
  const { language } = useLanguage();
  const heroRefs = useRef<Array<HTMLDivElement | HTMLButtonElement | null>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);


  // Button ripple effect
  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      const animatedItems = heroRefs.current.filter((item): item is HTMLDivElement | HTMLButtonElement => item !== null);

      // --- 1. Initial Entrances ---

      // Left Column Elements (Logo, Text)
      tl.fromTo(
        '.hero-logo-left',
        { x: -220, y: -8, opacity: 0, rotation: -7 },
        { x: 0, y: 0, opacity: 1, rotation: 0, duration: 1.18 }
      )
        .fromTo(
          '.hero-logo-right',
          { x: 220, y: 8, opacity: 0, rotation: 7 },
          { x: 0, y: 0, opacity: 1, rotation: 0, duration: 1.18 },
          '<'
        )
        .fromTo(
          '.hero-logo-split',
          { scale: 0.96, filter: 'blur(8px)' },
          { scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' },
          '<'
        )
        // Staggered text content
        .fromTo(animatedItems,
          { y: 50, opacity: 0, filter: 'blur(10px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.5, stagger: 0.15 },
          '-=0.8'
        );

      // --- 2. Enhanced Letter Animations (A & Alif) ---

      // Stage entrance (fade in & scale up)
      tl.fromTo(
        '.hero-letter-stage',
        { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' },
        '-=1.2'
      );

      // "A" Pop Entrance
      tl.fromTo(
        '.hero-letter-a',
        { y: 60, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: 'back.out(1.7)' },
        '-=1.0'
      );

      // "Alif" Pop Entrance (slightly delayed)
      tl.fromTo(
        '.hero-letter-alif',
        { y: 60, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: 'back.out(1.5)' },
        '-=1.2'
      );

      // --- 3. Continuous Floating Animation ---
      gsap.to('.hero-letter-a', {
        y: '-=12',
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.5
      });

      gsap.to('.hero-letter-alif', {
        y: '-=15',
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.2
      });

      // --- 4. Interactive Mouse Parallax ---
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 40; // Range -20 to 20
        const y = (e.clientY / window.innerHeight - 0.5) * 40;

        // "A" moves more (foreground feel)
        gsap.to('.hero-letter-a', {
          x: x * 1.2,
          y: y * 0.8, // subtle vertical parallax on top of float
          duration: 1,
          ease: 'power2.out',
          overwrite: 'auto' // Don't overwrite the float y-animation completely, just blend x
        });

        // "Alif" moves less (background feel)
        gsap.to('.hero-letter-alif', {
          x: x * -0.5, // Opposite direction for depth
          y: y * -0.3,
          duration: 1.2,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-screen flex flex-col items-center justify-center overflow-x-clip overflow-y-visible bg-cream"
    >
      {/* Background Image - Covers the entire area */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/hero-bg-clean.png"
          alt="Hero Background"
          className="w-full h-full object-cover opacity-35"
        />
        {/* Subtle Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>

      {/* Main Grid Container */}
      <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto px-4 sm:pl-6 sm:pr-10 lg:px-12 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10 items-center pt-20 pb-16 lg:pt-24 lg:pb-32">

        {/* Left Column: Text Content */}
        <div className="flex flex-col items-start justify-center text-left order-2 lg:order-1 relative z-20 max-w-[46rem] pt-0 lg:ml-0">

          {/* Brand Logo */}
          <div className="mb-0 lg:mb-[-3.5rem] mt-2 lg:-ml-10">
            <div className="hero-logo-split relative w-[336px] sm:w-[420px] lg:w-[530px] aspect-[2000/1100]">
              <img
                src="/hero-assets/logo-part-1-aligned.png"
                alt="AINAR mark left"
                className="hero-logo-left absolute inset-0 w-full h-full object-contain opacity-0"
              />
              <img
                src="/hero-assets/logo-part-2-aligned.png"
                alt="AINAR mark right"
                className="hero-logo-right absolute inset-0 w-full h-full object-contain opacity-0"
              />
            </div>
          </div>

          {/* Headline */}
          <div ref={(el) => { if (el) heroRefs.current[0] = el }} className="opacity-0 translate-y-8">
            <h1 className="font-display font-black text-neutral-900 leading-[1.06] tracking-tight mb-7 drop-shadow-sm w-full max-w-[44rem]">
              <span className="block sm:whitespace-nowrap text-[clamp(1.75rem,5vw,2.5rem)] lg:text-[clamp(1.15rem,3.1vw,2.2rem)] leading-tight">
                {language === 'en' ? 'Sustainability in Our Roots.' : 'الاستدامة في جذورنا.'}
              </span>
              <span className="block mt-1 sm:whitespace-nowrap text-[clamp(1.75rem,5vw,2.5rem)] lg:text-[clamp(1.15rem,3.1vw,2.2rem)] text-neutral-800 leading-tight">
                {language === 'en' ? 'Intelligence for Our Future.' : 'الذكاء لمستقبلنا.'}
              </span>
            </h1>
          </div>

          {/* Sub-headline */}
          <div ref={(el) => { if (el) heroRefs.current[1] = el }} className="opacity-0 translate-y-8">
            <p className="text-lg md:text-xl text-neutral-700 max-w-xl mb-8 leading-relaxed font-medium">
              {language === 'en'
                ? 'AI-powered sustainability solutions and app that reward green behavior and drive real impact.'
                : 'حلول استدامة مدعومة بالذكاء الاصطناعي وتطبيق يكافئ السلوك الأخضر ويدفع نحو تأثير حقيقي.'}
            </p>
          </div>
        </div>

        {/* Right Column: Center-locked A + Alif pair */}
        <div className="relative w-full h-[30vh] sm:h-[44vh] lg:h-[680px] flex items-center justify-center order-1 lg:order-2 lg:justify-center overflow-visible">
          <div
            className="w-full max-w-[760px] h-full flex flex-col items-center justify-center overflow-visible"
          >
            <div className="hero-letter-stage relative w-[148px] h-[168px] sm:w-[180px] sm:h-[206px] lg:w-[240px] lg:h-[274px] pointer-events-none overflow-visible lg:translate-x-[8rem] lg:-translate-y-8 opacity-0">
              <div
                className="hero-letter-pair relative w-full h-full"
                aria-hidden
              >
                <div
                  className="hero-letter-a absolute left-[2%] bottom-0 w-[74%] h-[88%] drop-shadow-[0_6px_16px_rgba(10,22,40,0.18)]"
                  style={{
                    backgroundImage: 'linear-gradient(112deg, #D6B03A 0%, #D6B03A 50%, #0D7377 50%, #0D7377 100%)',
                    WebkitMaskImage: 'url(/hero-assets/letter-a.png)',
                    maskImage: 'url(/hero-assets/letter-a.png)',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                  }}
                />
                <div
                  className="hero-letter-alif absolute left-[61.5%] top-[8%] w-[14.5%] h-[60%] drop-shadow-[0_5px_14px_rgba(10,22,40,0.18)]"
                  style={{
                    backgroundImage: 'linear-gradient(112deg, #0D7377 0%, #0D7377 50%, #D6B03A 50%, #D6B03A 100%)',
                    WebkitMaskImage: 'url(/hero-assets/letter-alif.png)',
                    maskImage: 'url(/hero-assets/letter-alif.png)',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Center: CTA & Scroll Indicator */}
      <div className="absolute bottom-12 md:bottom-14 left-0 right-0 z-20 flex flex-col items-center gap-4 pointer-events-none">

        {/* CTA Button */}
        <div ref={(el) => { if (el) heroRefs.current[2] = el }} className="opacity-0 translate-y-8 pointer-events-auto">
          <button
            onClick={(e) => {
              createRipple(e);
              setIsModalOpen(true);
            }}
            className="group relative px-9 md:px-10 py-3.5 md:py-4 rounded-full bg-neutral-900 text-white font-bold uppercase tracking-[0.17em] text-[10px] md:text-xs transition-all duration-300 hover:scale-105 hover:bg-neutral-800 hover:shadow-xl shadow-lg border border-white/10"
          >

            <span className="relative z-10 flex items-center gap-3">
              {language === 'en' ? 'Start Your Journey' : 'ابدأ رحلتك'}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <button
          ref={(el) => { if (el) heroRefs.current[3] = el }}
          className="opacity-0 translate-y-8 flex flex-col items-center gap-2.5 group cursor-pointer border-none bg-transparent pointer-events-auto"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          aria-label="Scroll down"
        >
          <div className="flex flex-col items-center gap-2.5 animate-bounce">
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-900 group-hover:text-black transition-colors bg-white/45 backdrop-blur-sm px-3.5 py-1.5 rounded-full">
              {language === 'en' ? 'Scroll' : 'تمرير'}
            </span>
            <div className="w-[2px] h-8 bg-neutral-900/55 group-hover:h-11 group-hover:bg-neutral-900 transition-all duration-500 origin-top" />
          </div>
        </button>
      </div>
      <ServiceInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceTitle=""
        mainTitle={language === 'en' ? 'Start Your Journey' : 'ابدأ رحلتك'}
        enableServiceSelection={true}
        availableServices={servicesData}
      />
    </section>

  );
}
