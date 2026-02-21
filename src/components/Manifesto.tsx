'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextRevealer from './common/TextRevealer';
import { Globe, Infinity as InfinityIcon, Lightbulb } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 82;
const IMAGES_BASE_PATH = '/menifesto-video/Smoothing_animation_no_1080p_202602081719_';

export default function Manifesto() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionLabelRef = useRef<HTMLHeadingElement>(null);
  const titleBadgeRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLDivElement>(null);
  const mobileValuesRef = useRef<HTMLDivElement>(null);
  const desktopValuesRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Preload images when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedLoading) {
          setHasStartedLoading(true);
        }
      },
      { rootMargin: '400px' } // Start loading when 400px away
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasStartedLoading]);

  useEffect(() => {
    if (!hasStartedLoading) return;

    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      const promises = [];

      for (let i = 0; i < FRAME_COUNT; i++) {
        const paddedIndex = i.toString().padStart(3, '0');
        const src = `${IMAGES_BASE_PATH}${paddedIndex}.webp`;
        const img = new Image();

        const promise = new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });

        img.src = src;
        loadedImages.push(img);
        promises.push(promise);
      }

      await Promise.all(promises);
      setImages(loadedImages);
      setLoaded(true);
    };

    loadImages();
  }, [hasStartedLoading]);

  // Draw frame based on progress
  useEffect(() => {
    if (!loaded || !canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate frame index
    // We can add some buffer at the start and end if desired, but 1:1 sync is requested.
    // Ensure we clamp between 0 and FRAME_COUNT - 1
    const frameIndex = Math.min(
      Math.floor(progress * (FRAME_COUNT - 1)),
      FRAME_COUNT - 1
    );

    const img = images[frameIndex];
    if (img) {
      // Draw image to cover canvas
      const canvasAspect = canvas.width / canvas.height;
      const imgAspect = img.width / img.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasAspect > imgAspect) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgAspect;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgAspect;
        offsetY = 0;
        offsetX = (canvas.width - drawWidth) / 2;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  }, [progress, loaded, images]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.offsetWidth;
        canvasRef.current.height = canvasRef.current.offsetHeight;
      }
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    if (!containerRef.current || !sectionLabelRef.current || !paragraphRef.current || !titleBadgeRef.current) return;

    const ctx = gsap.context(() => {
      // Keep this section around ~1.5 screens so transitions stay smooth but not overly long.
      const pinDistance = window.innerWidth < 1024 ? window.innerHeight * 1.35 : window.innerHeight * 1.5;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${pinDistance}`,
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          setProgress(self.progress);
        }
      });

      gsap.fromTo(
        sectionLabelRef.current,
        {
          opacity: 0,
          y: 28,
          filter: 'blur(8px)',
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: `+=${Math.round(pinDistance * 0.18)}`,
            scrub: 0.5,
          },
        }
      );

      gsap.fromTo(
        titleBadgeRef.current,
        {
          opacity: 0,
          y: 24,
          filter: 'blur(6px)',
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: `+=${Math.round(pinDistance * 0.24)}`,
            scrub: 0.5,
          },
        }
      );

      // Large-type reveal synced with scroll (paragraph-level for cleaner spacing)
      gsap.fromTo(
        paragraphRef.current,
        {
          opacity: 0.35,
          y: 54,
          filter: 'blur(6px)',
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: `+=${Math.round(pinDistance * 0.58)}`,
            scrub: 0.5,
          },
        }
      );

      const valueCards = [
        ...(mobileValuesRef.current
          ? Array.from(mobileValuesRef.current.querySelectorAll<HTMLElement>('.manifesto-value-card'))
          : []),
        ...(desktopValuesRef.current
          ? Array.from(desktopValuesRef.current.querySelectorAll<HTMLElement>('.manifesto-value-card'))
          : []),
      ];

      if (valueCards.length > 0) {
        gsap.fromTo(
          valueCards,
          {
            opacity: 0,
            y: 36,
            scale: 0.98,
            filter: 'blur(6px)',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: `+=${Math.round(pinDistance * 0.6)}`,
              scrub: 0.5,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [language]);

  const paragraphs = language === 'en'
    ? [
      'Inspired by a vision of the future. In a world facing complex challenges, AINAR represents the smart platform designed to help humanity and communities transform problems into solutions.',
      'Born from the belief that innovation can turn darkness into light, AINAR empowers progress, drives sustainable impact, and brings measurable change to the world.',
    ]
    : [
      'مُلهمون برؤية للمستقبل. في عالم يواجه تحديات معقدة، تمثل AINAR منصة ذكية صُممت لمساعدة البشر والمجتمعات على تحويل المشكلات إلى حلول.',
      'وانطلاقًا من إيماننا بأن الابتكار قادر على تحويل الظلام إلى نور، تمكّن AINAR مسارات التقدم، وتدفع الأثر المستدام، وتُحدث تغييرًا ملموسًا في العالم.',
    ];

  const values = language === 'en'
    ? [
      {
        title: 'Communities Trusted Growth',
        description: 'Enabling progress through integrity, trust, and collaboration.',
        Icon: Globe,
      },
      {
        title: 'Sustainability',
        description: 'Committing to eco-friendly and socially responsible impact.',
        Icon: InfinityIcon,
      },
      {
        title: 'Innovation',
        description: 'Pioneering tech solutions that push boundaries.',
        Icon: Lightbulb,
      },
    ]
    : [
      {
        title: 'نمو مجتمعي موثوق',
        description: 'تمكين التقدم عبر النزاهة والثقة والتعاون.',
        Icon: Globe,
      },
      {
        title: 'الاستدامة',
        description: 'التزامنا بأثر صديق للبيئة ومسؤول اجتماعيًا.',
        Icon: InfinityIcon,
      },
      {
        title: 'الابتكار',
        description: 'حلول تقنية رائدة تدفع الحدود إلى الأمام.',
        Icon: Lightbulb,
      },
    ];

  return (
    <section
      id="manifesto"
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center bg-neutral-950 overflow-hidden"
    >
      <div className="w-full flex flex-col lg:flex-row relative">

        {/* Left Column: Text Content */}
        <div className="w-full lg:w-[48%] min-h-[60vh] lg:min-h-screen flex flex-col justify-start px-4 lg:px-10 xl:px-14 lg:-ml-4 z-20 relative pt-12 lg:pt-20 pb-12 lg:pb-40 order-2 lg:order-1">
          <div className="flex flex-col items-start gap-4 max-w-[44rem] flex-grow">
            <h2
              ref={sectionLabelRef}
              className="text-[clamp(1.6rem,4vw,3rem)] font-display font-black uppercase tracking-[0.08em] text-white/95 leading-tight drop-shadow-[0_1px_0_rgba(0,0,0,0.45)]"
            >
              {language === 'en' ? 'WHAT WE DO' : 'ماذا نفعل'}
            </h2>

            {/* Title Badge */}
            <div ref={titleBadgeRef} className="inline-flex mt-1 lg:mt-2">
              <TextRevealer
                text={language === 'en' ? 'OUR VALUE | SUSTAINABLE GROWTH' : 'قيمتنا | النمو المستدام'}
                className="text-xs sm:text-sm md:text-base font-bold uppercase text-neutral-900 bg-white/90 px-4 py-1.5 md:px-5 md:py-2 tracking-[0.08em] rounded-sm"
                type="words"
              />
            </div>

            {/* Paragraph */}
            <div
              ref={paragraphRef}
              className="mt-4 lg:mt-6 space-y-5 max-w-[44rem]"
            >
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[clamp(1.25rem,2.2vw,2rem)] font-semibold leading-relaxed tracking-normal text-white text-justify [text-justify:inter-word] [text-align-last:left] hyphens-auto text-pretty"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Mobile Value Cards */}
            <div ref={mobileValuesRef} className="grid grid-cols-1 gap-3 w-full lg:hidden mt-8">
              {values.map((item) => (
                <div
                  key={item.title}
                  className="manifesto-value-card bg-white/95 text-neutral-950 rounded-sm px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
                >
                  <div className="flex items-start gap-3">
                    <item.Icon className="w-6 h-6 shrink-0 mt-0.5" strokeWidth={2} />
                    <div>
                      <h3 className="text-base font-bold leading-tight">{item.title}</h3>
                      <p className="mt-1 text-sm leading-snug text-neutral-700">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Video Sequence */}
        <div className="w-full lg:w-[52%] h-[40vh] lg:h-screen sticky top-0 relative overflow-hidden order-1 lg:order-2">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          {/* Gradient overlay for better text contrast */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-950 to-transparent pointer-events-none hidden lg:block" />
        </div>

        {/* Desktop Value Cards - Refactored for Flex Flow and zoom safety */}
        <div
          ref={desktopValuesRef}
          className="hidden lg:flex pointer-events-none absolute bottom-12 left-0 right-0 z-30 px-5 lg:px-10 xl:px-14"
        >
          <div className="flex justify-between gap-6 w-full max-w-[92rem] mx-auto items-stretch">
            {values.map((item) => (
              <div
                key={item.title}
                className="manifesto-value-card h-full flex-1 min-w-0 bg-white/95 text-neutral-950 rounded-2xl p-5 shadow-[0_12px_32px_rgba(0,0,0,0.3)] backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-neutral-100 rounded-lg">
                    <item.Icon className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[clamp(1.1rem,1.5vw,1.4rem)] font-bold leading-tight line-clamp-1">{item.title}</h3>
                </div>
                <p className="text-[clamp(0.85rem,1vw,0.95rem)] leading-snug text-neutral-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>

  );
}
