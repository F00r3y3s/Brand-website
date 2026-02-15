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
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      const promises = [];

      for (let i = 0; i < FRAME_COUNT; i++) {
        const paddedIndex = i.toString().padStart(3, '0');
        const src = `${IMAGES_BASE_PATH}${paddedIndex}.png`;
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
  }, []);

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
        // Trigger generic redraw by forcing update if needed, but progress dependency handles it usually
      }
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
      className="relative w-full h-screen flex items-center bg-neutral-950 overflow-hidden pb-0"
    >
      <div className="w-full h-full flex flex-col lg:flex-row">

        {/* Left Column: Text Content */}
        <div className="w-full lg:w-[48%] h-[60vh] lg:h-full flex flex-col justify-start px-4 lg:px-10 xl:px-14 lg:-ml-4 z-20 relative pt-8 lg:pt-16 lg:pb-44">
          <div className="flex flex-col items-start gap-4 max-w-[44rem]">
            <h2
              ref={sectionLabelRef}
              className="text-[clamp(1.8rem,3.8vw,3rem)] font-display font-black uppercase tracking-[0.08em] text-white/95 leading-none drop-shadow-[0_1px_0_rgba(0,0,0,0.45)]"
            >
              {language === 'en' ? 'WHAT WE DO' : 'ماذا نفعل'}
            </h2>

            {/* Title Badge */}
            <div ref={titleBadgeRef} className="inline-flex">
              <TextRevealer
                text={language === 'en' ? 'OUR VALUE - SUSTAINABLE GROWTH' : 'قيمتنا - النمو المستدام'}
                className="text-sm sm:text-base font-bold uppercase text-neutral-900 bg-white/90 px-5 py-2 tracking-[0.08em] rounded-sm"
                type="words"
              />
            </div>

            {/* Paragraph */}
            <div
              ref={paragraphRef}
              className="space-y-5 max-w-[44rem]"
            >
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[1.8rem] md:text-[2rem] lg:text-[2.15rem] font-semibold leading-[1.25] tracking-normal text-white text-justify [text-justify:inter-word] [text-align-last:left] hyphens-auto text-pretty"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Mobile Value Cards */}
            <div ref={mobileValuesRef} className="grid grid-cols-1 gap-2 w-full lg:hidden mt-3">
              {values.map((item) => (
                <div
                  key={item.title}
                  className="manifesto-value-card bg-white/95 text-neutral-950 rounded-sm px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
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
        <div className="w-full lg:w-[52%] h-[40vh] lg:h-full relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          {/* Gradient overlay for better text contrast if needed or edge blending */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-950 to-transparent pointer-events-none" />
        </div>

      </div>

      {/* Desktop Value Cards */}
      <div ref={desktopValuesRef} className="hidden lg:block pointer-events-none absolute bottom-6 left-0 right-0 z-30 px-4 lg:px-10 xl:px-14">
        <div className="grid grid-cols-3 gap-4">
          {values.map((item) => (
            <div
              key={item.title}
              className="manifesto-value-card bg-white/95 text-neutral-950 rounded-sm px-5 py-4 shadow-[0_10px_28px_rgba(0,0,0,0.28)]"
            >
              <div className="flex items-start gap-3">
                <item.Icon className="w-8 h-8 shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <h3 className="text-[1.65rem] font-bold leading-[1.05]">{item.title}</h3>
                  <p className="mt-1 text-[1.22rem] leading-tight text-neutral-700">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
