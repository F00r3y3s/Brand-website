'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import ServiceInquiryModal from './ui/ServiceInquiryModal';
import { servicesData } from '@/lib/data';

/**
 * Hero Component - Fibonacci Globe (Refined)
 * 
 * Key Features:
 * 1. Readable headlines on initial load
 * 2. Globe forms when mouse enters trigger zone (600px)
 * 3. Letters scale UP during globe formation for better spacing
 * 4. Continuous rotation with smooth fade in/out
 * 5. Letters return to normal state when mouse leaves
 */
export default function Hero() {
  const { language } = useLanguage();
  const heroRefs = useRef<Array<HTMLDivElement | HTMLButtonElement | null>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  });
  const rotation = useRef({ x: 15, y: 15 });
  const [isModalOpen, setIsModalOpen] = React.useState(false);

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
    setTimeout(() => ripple.remove(), 600);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      const animatedItems = heroRefs.current.filter((item): item is HTMLDivElement | HTMLButtonElement => item !== null);

      // --- 1. Entrance Animations ---
      tl.fromTo('.hero-logo-left', { x: -220, opacity: 0, rotation: -7 }, { x: 0, opacity: 1, rotation: 0, duration: 1.18 })
        .fromTo('.hero-logo-right', { x: 220, opacity: 0, rotation: 7 }, { x: 0, opacity: 1, rotation: 0, duration: 1.18 }, '<')
        .fromTo('.hero-logo-split', { scale: 0.96, filter: 'blur(8px)' }, { scale: 1, filter: 'blur(0px)', duration: 0.8 }, '<')
        .fromTo(animatedItems, { y: 50, opacity: 0, filter: 'blur(10px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.5, stagger: 0.15 }, '-=0.8');

      // --- 2. Branding Mark (LOCKED) ---
      tl.to('.hero-letter-stage', { opacity: 1, duration: 0.4 }, '<');
      tl.fromTo('.hero-letter-a', { x: -window.innerWidth * 0.8, opacity: 0, scale: 0.05, filter: 'blur(20px)' }, { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 4.5, ease: 'power4.out' }, '<0.3');
      tl.fromTo('.hero-letter-alif', { x: -window.innerWidth * 0.9, opacity: 0, scale: 0.02, filter: 'blur(25px)' }, { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 5.0, ease: 'power4.out' }, '<0.1');

      tl.fromTo('.letter-glow-effect', { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 4 }, '2');
      gsap.to('.letter-glow-effect', { opacity: 0.9, scale: 1.25, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 6 });

      document.querySelectorAll('.gold-dust-particle').forEach((el) => {
        gsap.set(el, { x: gsap.utils.random(-150, 150), y: gsap.utils.random(-150, 150), opacity: 0, scale: gsap.utils.random(0.8, 2.5) });
        gsap.to(el, { x: `+=${gsap.utils.random(-80, 80)}`, y: `+=${gsap.utils.random(-80, 80)}`, duration: gsap.utils.random(6, 12), repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to(el, { opacity: gsap.utils.random(0.3, 0.75), duration: 2.5, delay: 6 });
      });

      tl.add(() => {
        gsap.to('.hero-letter-a', { y: '-=12', duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to('.hero-letter-alif', { y: '-=15', duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      });

      // --- 3. Fibonacci Globe Engine ---
      const letters = Array.from(document.querySelectorAll('.kinetic-letter'));
      const sphereRadius = 280;
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      const angleIncrement = 2 * Math.PI / goldenRatio;

      // Pre-calculate Fibonacci positions
      const letterPositions = letters.map((_, i) => {
        const t = i / letters.length;
        const inclination = Math.acos(1 - 2 * t);
        const azimuth = angleIncrement * i;

        let phi = inclination * (180 / Math.PI);
        let theta = (azimuth * (180 / Math.PI)) % 360;

        const poleBonus = Math.pow(Math.abs(phi - 90) / 90, 0.6) * 35;
        if (phi < 90) {
          phi = Math.max(5, phi - poleBonus);
        } else {
          phi = Math.min(175, phi + poleBonus);
        }

        phi = 15 + (phi / 180) * 150;

        return {
          theta: theta * (Math.PI / 180),
          phi: phi * (Math.PI / 180)
        };
      });

      // Ensure letters start at their natural positions
      gsap.set('.kinetic-letter', { x: 0, y: 0, z: 0, scale: 1, opacity: 1, rotateX: 0, rotateY: 0, rotateZ: 0 });

      const updatePhysics = (time: number, delta: number) => {
        const { x: mX, y: mY } = mousePos.current;
        const triggerRadius = 600;

        if (!headlineRef.current) return;

        const hRect = headlineRef.current.getBoundingClientRect();
        const centerX = hRect.left + hRect.width / 2;
        const centerY = hRect.top + hRect.height / 2;
        const distToCenter = Math.hypot(centerX - mX, centerY - mY);

        // Early exit if mouse is far away
        if (distToCenter > triggerRadius) {
          letters.forEach((letter) => {
            gsap.to(letter, {
              x: 0, y: 0, z: 0,
              rotateX: 0, rotateY: 0, rotateZ: 0,
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          });
          return;
        }

        // Auto-rotate the sphere
        rotation.current.y += 0.3 * (delta / 16) * (Math.PI / 180);
        rotation.current.x += 0.1 * (delta / 16) * (Math.PI / 180);

        letters.forEach((letter, i) => {
          const rect = letter.getBoundingClientRect();
          const curX = gsap.getProperty(letter, 'x') as number || 0;
          const curY = gsap.getProperty(letter, 'y') as number || 0;
          const homeX = (rect.left + rect.width / 2) - curX;
          const homeY = (rect.top + rect.height / 2) - curY;

          const distToLetter = Math.hypot(homeX - mX, homeY - mY);
          const power = Math.pow(Math.max(0, 1 - Math.min(distToLetter, distToCenter) / triggerRadius), 3);

          if (power > 0.01) {
            const pos = letterPositions[i];
            const rotX = rotation.current.x;
            const rotY = rotation.current.y;

            // Calculate 3D position
            let lx = sphereRadius * Math.sin(pos.phi) * Math.cos(pos.theta);
            let ly = sphereRadius * Math.cos(pos.phi);
            let lz = sphereRadius * Math.sin(pos.phi) * Math.sin(pos.theta);

            // Apply rotation matrices
            const x1 = lx * Math.cos(rotY) + lz * Math.sin(rotY);
            const z1 = -lx * Math.sin(rotY) + lz * Math.cos(rotY);
            lx = x1; lz = z1;

            const y2 = ly * Math.cos(rotX) - lz * Math.sin(rotX);
            const z2 = ly * Math.sin(rotX) + lz * Math.cos(rotX);
            ly = y2; lz = z2;

            const targetX = mX + lx;
            const targetY = mY + ly;

            // Z-depth normalization for scale and opacity
            const normalizedZ = (lz + sphereRadius) / (2 * sphereRadius); // 0 to 1

            // Scale UP during globe formation (1.0 → 1.8) for better spacing
            const globeScale = 1.0 + (0.8 * power);
            const depthScale = 0.6 + (normalizedZ * 0.4); // 0.6 to 1.0 based on depth
            const finalScale = globeScale * depthScale;

            // Continuous opacity (never fully disappear)
            const depthOpacity = 0.4 + (normalizedZ * 0.6); // 0.4 to 1.0

            gsap.to(letter, {
              x: (targetX - homeX) * power,
              y: (targetY - homeY) * power,
              z: lz * power,
              rotateY: lx * 0.1 * power,
              rotateX: -ly * 0.1 * power,
              scale: finalScale,
              opacity: depthOpacity,
              duration: 0.5,
              ease: 'power1.out',
              overwrite: 'auto'
            });
          }
        });

        // Branding Parallax (LOCKED)
        const px = (mX / window.innerWidth - 0.5) * 40;
        const py = (mY / window.innerHeight - 0.5) * 40;
        gsap.to('.hero-letter-a', { x: px * 1.2, y: py * 0.8, duration: 1, ease: 'power2.out', overwrite: 'auto' });
        gsap.to('.hero-letter-alif', { x: px * -0.5, y: py * -0.3, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
      };

      gsap.ticker.add(updatePhysics);

      const handleMouseMove = (e: MouseEvent) => {
        mousePos.current = { x: e.clientX, y: e.clientY };
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        gsap.ticker.remove(updatePhysics);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={containerRef} className="relative h-screen flex flex-col items-center justify-center overflow-x-clip overflow-y-visible bg-cream">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="/hero-bg-clean.png" alt="Hero Background" className="w-full h-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto px-4 sm:pl-6 sm:pr-10 lg:px-12 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10 items-center pt-20 pb-16 lg:pt-24 lg:pb-32">
        <div ref={headlineRef} className="flex flex-col items-start justify-center text-left order-2 lg:order-1 relative z-20 max-w-[46rem] pt-0 lg:ml-0 overflow-visible">
          <div className="mb-0 lg:mb-[-3.5rem] mt-2 lg:-ml-10">
            <div className="hero-logo-split relative w-[336px] sm:w-[420px] lg:w-[530px] aspect-[2000/1100]">
              <img src="/hero-assets/logo-part-1-aligned.png" className="hero-logo-left absolute inset-0 w-full h-full object-contain opacity-0" />
              <img src="/hero-assets/logo-part-2-aligned.png" className="hero-logo-right absolute inset-0 w-full h-full object-contain opacity-0" />
            </div>
          </div>

          <div ref={(el) => { if (el) heroRefs.current[0] = el }} className="opacity-0 translate-y-8 select-none">
            <h1 className="font-display font-black text-neutral-900 leading-[1.06] tracking-tight mb-7 drop-shadow-sm w-full max-w-[44rem]">
              <span className="block text-[clamp(1.75rem,5vw,2.5rem)] lg:text-[clamp(1.15rem,3.1vw,2.2rem)] leading-tight overflow-visible">
                {(language === 'en' ? 'Sustainability in Our Roots.' : 'الاستدامة في جذورنا.').split('').map((char, i) => (
                  <span key={i} className="kinetic-letter inline-block whitespace-pre preserve-3d">{char}</span>
                ))}
              </span>
              <span className="block mt-1 text-[clamp(1.75rem,5vw,2.5rem)] lg:text-[clamp(1.15rem,3.1vw,2.2rem)] text-neutral-800 leading-tight overflow-visible">
                {(language === 'en' ? 'Intelligence for Our Future.' : 'الذكاء لمستقبلنا.').split('').map((char, i) => (
                  <span key={i} className="kinetic-letter inline-block whitespace-pre preserve-3d">{char}</span>
                ))}
              </span>
            </h1>
          </div>

          <div ref={(el) => { if (el) heroRefs.current[1] = el }} className="opacity-0 translate-y-8">
            <p className="text-lg md:text-xl text-neutral-700 max-w-xl mb-8 leading-relaxed font-medium">
              {language === 'en' ? 'AI-powered sustainability solutions and app that reward green behavior and drive real impact.' : 'حلول استدامة مدعومة بالذكاء الاصطناعي وتطبيق يكافئ السلوك الأخضر ويدفع نحو تأثير حقيقي.'}
            </p>
          </div>
        </div>

        <div className="relative w-full h-[30vh] sm:h-[44vh] lg:h-[680px] flex items-center justify-center order-1 lg:order-2 lg:justify-center overflow-visible">
          <div className="w-full max-w-[760px] h-full flex flex-col items-center justify-center overflow-visible">
            <div className="hero-letter-stage relative w-[240px] h-[274px] pointer-events-none overflow-visible lg:translate-x-[8rem] lg:-translate-y-8 opacity-0">
              <div className="hero-letter-pair relative w-full h-full">
                <div className="letter-glow-effect absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[170%] h-[170%] opacity-0 pointer-events-none z-[-1]"
                  style={{ background: 'radial-gradient(circle, rgba(234, 179, 8, 0.6) 0%, rgba(234, 179, 8, 0.15) 50%, transparent 75%)', filter: 'blur(50px)' }} />
                <div className="gold-dust-container absolute inset-0 pointer-events-none z-0">
                  {[...Array(60)].map((_, i) => (
                    <div key={i} className="gold-dust-particle absolute w-1 h-1 bg-gold/80 rounded-full blur-[0.4px]"
                      style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, boxShadow: '0 0 8px rgba(234, 179, 8, 0.4)' }} />
                  ))}
                </div>
                <div className="hero-letter-a absolute left-[2%] bottom-0 w-[74%] h-[88%] drop-shadow-[0_6px_16px_rgba(10,22,40,0.18)]"
                  style={{ backgroundColor: '#000000', WebkitMaskImage: 'url(/hero-assets/letter-a.png)', maskImage: 'url(/hero-assets/letter-a.png)', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', WebkitMaskSize: 'contain', maskSize: 'contain' }} />
                <div className="hero-letter-alif absolute left-[61.5%] top-[8%] w-[14.5%] h-[60%] drop-shadow-[0_5px_14px_rgba(10,22,40,0.18)]"
                  style={{ backgroundColor: '#000000', WebkitMaskImage: 'url(/hero-assets/letter-alif.png)', maskImage: 'url(/hero-assets/letter-alif.png)', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', WebkitMaskSize: 'contain', maskSize: 'contain' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-0 right-0 z-20 flex flex-col items-center gap-4 pointer-events-none">
        <div ref={(el) => { if (el) heroRefs.current[2] = el }} className="opacity-0 translate-y-8 pointer-events-auto">
          <button onClick={(e) => { createRipple(e); setIsModalOpen(true); }} className="group px-10 py-4 rounded-full bg-neutral-900 text-white font-bold uppercase tracking-widest text-xs transition-all hover:scale-105 hover:bg-neutral-800 shadow-lg">
            <span className="relative z-10 flex items-center gap-3">{language === 'en' ? 'Start Your Journey' : 'ابدأ رحلتك'}<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></span>
          </button>
        </div>
        <button ref={(el) => { if (el) heroRefs.current[3] = el }} className="opacity-0 translate-y-8 flex flex-col items-center gap-2.5 group cursor-pointer border-none bg-transparent pointer-events-auto" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          <div className="flex flex-col items-center gap-2.5 animate-bounce">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 bg-white/45 backdrop-blur-sm px-4 py-2 rounded-full">{language === 'en' ? 'Scroll' : 'تمرير'}</span>
            <div className="w-[2px] h-8 bg-neutral-900/55 group-hover:h-11 transition-all" />
          </div>
        </button>
      </div>
      <ServiceInquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} serviceTitle="" mainTitle={language === 'en' ? 'Start Your Journey' : 'ابدأ رحلتك'} enableServiceSelection={true} availableServices={servicesData} />
    </section>
  );
}
