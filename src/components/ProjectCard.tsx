'use client';

import React, { useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  client: string;
  services: string[];
  imageUrl: string;
  link?: string;
}

export default function ProjectCard({
  title,
  client,
  services,
  imageUrl,
  link = '#',
}: ProjectCardProps) {
  const { language } = useLanguage();
  const cardRef = useRef<HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

  // Parallax translation for the image
  const imgX = useTransform(mouseXSpring, [-0.5, 0.5], ['-15px', '15px']);
  const imgY = useTransform(mouseYSpring, [-0.5, 0.5], ['-15px', '15px']);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={link}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative block rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/30 transition-all duration-500 shadow-2xl"
    >
      {/* Project Image Container */}
      <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] overflow-hidden">
        <motion.img
          src={imageUrl}
          alt={title}
          style={{
            x: imgX,
            y: imgY,
            scale: 1.1,
          }}
          className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 brightness-[0.7] group-hover:brightness-90"
        />

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

        {/* View Case Study pill */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest shadow-2xl rounded-sm">
            <span>{language === 'en' ? 'Open Case' : 'فتح الحالة'}</span>
            <ArrowUpRight size={14} />
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="absolute bottom-10 left-10 right-10 z-20">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-gold font-bold tracking-[0.4em] text-[10px] uppercase">
                {client}
              </span>
            </div>

            <h3 className="text-3xl md:text-5xl font-black font-display text-white leading-none group-hover:tracking-wider transition-all duration-700 ease-premium">
              {title}
            </h3>

            <div className="flex flex-wrap gap-3 mt-6">
              {services.slice(0, 2).map((service, index) => (
                <span
                  key={index}
                  className="text-neutral-500 text-[9px] font-black uppercase tracking-[0.2em] border-r border-white/10 pr-3 last:border-0"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Border Glow */}
      <div className="absolute inset-0 border-[0.5px] border-white/10 rounded-3xl group-hover:border-gold/40 transition-colors duration-500" />
    </motion.a>
  );
}
