'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextRevealer from './common/TextRevealer';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 82;
const IMAGES_BASE_PATH = '/menifesto-video/Smoothing_animation_no_1080p_202602081719_';

export default function Manifesto() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
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
    if (!containerRef.current || !paragraphRef.current) return;

    const ctx = gsap.context(() => {
      // Pin length - user requested "more height below and above" so it feels pinned.
      // We'll give it a large scroll distance.
      const pinDistance = window.innerHeight * 5; 

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
    }, containerRef);

    return () => ctx.revert();
  }, [language]);

  const text = language === 'en'
    ? 'We are a design and technology studio focused on clarity, craft, and real-world execution. Our work spans brand systems, digital experiences, and AI-powered products — all shaped through thoughtful design decisions and precise execution.'
    : 'نحن استوديو تصميم وتكنولوجيا يركز على الوضوح والحرفية والتنفيذ الواقعي. يمتد عملنا عبر أنظمة العلامات التجارية والتجارب الرقمية والمنتجات المدعومة بالذكاء الاصطناعي - كلها مصممة من خلال قرارات تصميم مدروسة وتنفيذ دقيق.';

  return (
    <section
      id="manifesto"
      ref={containerRef}
      className="relative w-full h-screen flex items-center bg-neutral-950 overflow-hidden pb-0"
    >
      <div className="w-full h-full flex flex-col lg:flex-row">
        
        {/* Left Column: Text Content */}
        <div className="w-full lg:w-[48%] h-full flex flex-col justify-center px-4 sm:px-8 lg:px-10 xl:px-14 lg:-ml-4 z-20 relative">
          <div className="flex flex-col items-start gap-3 max-w-[40rem]">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex">
                <TextRevealer
                  text={language === 'en' ? 'OUR PHILOSOPHY' : 'فلسفتنا'}
                  className="text-sm sm:text-base font-bold text-neutral-900 bg-white/90 px-5 py-2 uppercase tracking-[0.14em] rounded-sm"
                  type="words"
                />
              </div>
              
              <div className="inline-flex">
                 <div className="text-sm sm:text-base font-bold text-neutral-900 bg-white/90 px-5 py-2 uppercase tracking-[0.14em] rounded-sm">
                    {language === 'en' ? 'NO BORING BRANDS' : 'بدون علامات مملة'}
                 </div>
              </div>
            </div>

            {/* Paragraph */}
            <p
              ref={paragraphRef}
              className="text-2xl md:text-[2.1rem] lg:text-[2.35rem] font-semibold leading-[1.2] tracking-tight text-white text-left max-w-[40rem]"
            >
              {text}
            </p>
          </div>
        </div>

        {/* Right Column: Video Sequence */}
        <div className="w-full lg:w-[52%] h-full relative">
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
    </section>
  );
}
