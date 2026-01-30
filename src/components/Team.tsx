'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import TextRevealer from './common/TextRevealer';
import { Plus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    id: 1,
    name: { en: 'Sarah Al-Mansoori', ar: 'سارة المنصوري' },
    role: { en: 'Founder & CEO', ar: 'المؤسس والرئيس التنفيذي' },
    bio: {
      en: 'Visionary leader bridging heritage and hi-tech.',
      ar: 'قائدة رؤيوية تجمع بين التراث والتكنولوجيا الفائقة.'
    },
    image: '/team/sarah.jpg',
  },
  {
    id: 2,
    name: { en: 'James Chen', ar: 'جيمس تشن' },
    role: { en: 'Head of AI', ar: 'رئيس قسم الذكاء الاصطناعي' },
    bio: {
      en: 'Architecting neural networks for creative applications.',
      ar: 'مهندس الشبكات العصبية للتطبيقات الإبداعية.'
    },
    image: '/team/james.jpg',
  },
  {
    id: 3,
    name: { en: 'Layla Rostami', ar: 'ليلى رستمي' },
    role: { en: 'Creative Director', ar: 'المدير الإبداعي' },
    bio: {
      en: 'Crafting award-winning visual identities.',
      ar: 'تصميم هويات بصرية حائزة على جوائز.'
    },
    image: '/team/layla.jpg',
  },
  {
    id: 4,
    name: { en: 'Marcus Thorne', ar: 'ماركوس ثورن' },
    role: { en: 'Lead Developer', ar: 'كبير المطورين' },
    bio: {
      en: 'Turning complex code into seamless experiences.',
      ar: 'تحويل الكود المعقد إلى تجارب سلسة.'
    },
    image: '/team/marcus.jpg',
  },
];

function TiltCard({ member, index }: { member: any, index: number }) {
  const { language } = useLanguage();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-[300px] md:w-[350px] h-[500px] flex-shrink-0 cursor-pointer group perspective-1000"
    >
      {/* Card Container */}
      <div
        className="absolute inset-0 bg-neutral-900 rounded-2xl border border-white/5 overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-gold/50 group-hover:shadow-gold/10"
        style={{ transform: "translateZ(0px)" }}
      >
        {/* Image Area */}
        <div className="absolute inset-x-0 top-0 h-[75%] bg-neutral-800 overflow-hidden">
          {/* Abstract Gradient Pattern (Placeholder for Image) */}
          <div className="w-full h-full bg-gradient-to-br from-neutral-800 via-neutral-900 to-black relative">
            <div className={`absolute inset-0 opacity-30 bg-[url('/noise.png')] mix-blend-overlay`} />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />

            {/* Big Letter Monogram */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[12rem] font-black font-display text-white/5 leading-none select-none group-hover:text-gold/10 transition-colors duration-500">
                {member.name.en.charAt(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="absolute inset-x-0 bottom-0 h-[25%] bg-neutral-950 p-6 flex flex-col justify-center border-t border-white/5 z-20">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-gold transition-colors duration-300">
            {language === 'en' ? member.name.en : member.name.ar}
          </h3>
          <p className="text-xs text-neutral-500 uppercase tracking-widest font-medium">
            {language === 'en' ? member.role.en : member.role.ar}
          </p>
        </div>
      </div>

      {/* Floating Elements (3D Effect) */}

      {/* Index Number */}
      <div
        className="absolute -top-12 -left-4 text-[80px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent font-display pointer-events-none select-none z-0"
        style={{ transform: "translateZ(-40px)" }}
      >
        0{index + 1}
      </div>

      {/* Hover Overlay */}
      <div
        className="absolute inset-0 bg-gold/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 mix-blend-overlay"
        style={{ transform: "translateZ(20px)" }}
      />

      {/* Bio Reveal (Tooltip style) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] p-6 bg-black/90 backdrop-blur-md border border-gold/30 rounded-xl text-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-40"
        style={{ transform: "translateZ(60px)" }}
      >
        <p className="text-white text-sm leading-relaxed">
          &quot;{language === 'en' ? member.bio.en : member.bio.ar}&quot;
        </p>
      </div>

    </motion.div>
  )
}

export default function Team() {
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current || !lineRef.current) return;

    const ctx = gsap.context(() => {
      // Calculate scroll distance
      if (trackRef.current) {
        const scrollDist = trackRef.current.scrollWidth - window.innerWidth;

        // Pin and Horizontal Scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${scrollDist + 500}`, // Add padding to feel substantial
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });

        tl.to(trackRef.current, {
          x: -scrollDist,
          ease: 'none',
        });

        // Animate the SVG connecting line to "draw" itself as we scroll
        if (lineRef.current) {
          const lineLength = lineRef.current.getTotalLength();

          // Set initial state: hidden (dashoffset = length)
          gsap.set(lineRef.current, {
            strokeDasharray: lineLength,
            strokeDashoffset: lineLength
          });

          // Animate to visible (dashoffset = 0)
          gsap.to(lineRef.current, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: `+=${scrollDist + 500}`,
              scrub: 1,
            }
          });
        }
      }

    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <div className="bg-neutral-950 overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="w-full h-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <section
        ref={sectionRef}
        id="team"
        className="relative h-screen w-full flex flex-col justify-center"
      >
        {/* Header - Fixed Position visually (inside pinned section) */}
        <div className="absolute top-12 md:top-24 left-6 md:left-24 z-10 max-w-lg pointer-events-none">
          <TextRevealer
            text={language === 'en' ? 'THE MINDS' : 'العقول'}
            className="text-gold text-[10px] font-black uppercase tracking-[0.5em] mb-4"
          />
          <h2 className="text-4xl md:text-6xl font-black font-display text-white leading-none tracking-tighter">
            {language === 'en' ? 'BEHIND THE' : 'خلف'} <br />
            {language === 'en' ? 'VISION' : 'الرؤية'}
          </h2>
        </div>

        {/* Horizontal Track */}
        <div
          ref={trackRef}
          className="flex items-center pl-6 md:pl-24 gap-24 w-max h-full relative"
        >
          {/* Connecting Line (Absolute behind cards) */}
          {/* Height must match card visual center roughly */}
          <svg className="absolute top-1/2 left-0 w-full h-40 -translate-y-1/2 pointer-events-none overflow-visible z-0">
            {/* Draw line across the entire estimated width */}
            <path
              ref={lineRef}
              d={`M0 80 L${(team.length + 2) * 450} 80`}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1"
              strokeOpacity="0.4"
            />

            {/* Decorative dots on line for each member position - Static for now, could be animated */}
          </svg>

          {/* Initial Spacer for Header */}
          <div className="w-[80vw] md:w-[40vw] flex-shrink-0" />

          {/* Team Cards */}
          {team.map((member, index) => (
            <div key={member.id} className="relative z-10">
              <TiltCard member={member} index={index} />

              {/* Connection Node */}
              <div className="absolute top-1/2 -left-12 w-12 h-px bg-gold/30" />
              <div className="absolute top-1/2 -left-12 w-2 h-2 rounded-full bg-gold" />
            </div>
          ))}

          {/* End CTA Card / Recruitment */}
          <div className="w-[300px] h-[500px] flex-shrink-0 flex items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-2xl hover:border-gold/50 transition-colors cursor-pointer group bg-white/[0.02]">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-white/5 mx-auto flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all duration-300">
                <Plus className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2">
                  {language === 'en' ? 'Join Us' : 'انضم إلينا'}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {language === 'en' ? 'We are always looking for exceptional talent to join our ranks.' : 'نبحث دائماً عن مواهب استثنائية للانضمام إلينا.'}
                </p>
              </div>
            </div>
          </div>

          <div className="w-[10vw] flex-shrink-0" /> {/* End Spacer */}
        </div>
      </section>
    </div>
  );
}
