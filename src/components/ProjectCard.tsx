'use client';

import React, { useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

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
  link,
}: ProjectCardProps) {
  const { language } = useLanguage();
  const cardRef = useRef<HTMLElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Direct mapping (no spring) to make hover response immediate.
  const rotateX = useTransform(y, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(x, [-0.5, 0.5], ['-5deg', '5deg']);

  // Parallax translation for the image
  const imgX = useTransform(x, [-0.5, 0.5], ['-15px', '15px']);
  const imgY = useTransform(y, [-0.5, 0.5], ['-15px', '15px']);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
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

  const inner = (
    <>
      {/* Project Image Container */}
      <div className="relative w-full h-full overflow-hidden">
        <motion.img
          src={imageUrl}
          alt={title}
          style={{
            x: imgX,
            y: imgY,
            scale: 1.1,
          }}
          className="w-full h-full object-cover transition-all duration-75 brightness-75 group-hover:brightness-95 group-hover:saturate-110 group-hover:scale-105"
        />

        {/* Cinematic Overlays - Softer for organic feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

        {/* Hover CTA */}
        <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-75">
          <div className="flex items-center gap-2 px-8 py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest shadow-2xl rounded-full">
            <span>
              {link
                ? language === 'en'
                  ? 'Open Case'
                  : 'فتح الحالة'
                : language === 'en'
                  ? 'Open Preview'
                  : 'فتح المعاينة'}
            </span>
            <ArrowUpRight size={14} />
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="absolute bottom-12 left-12 right-12 z-20">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-white/60 font-bold tracking-[0.4em] text-[11px] uppercase">
                {client}
              </span>
            </div>

            <h3 className="text-4xl md:text-6xl font-black font-display text-white leading-[0.9] tracking-tighter group-hover:tracking-tight group-hover:-translate-y-1 transition-all duration-75">
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
      <div className="absolute inset-0 border-[0.5px] border-white/10 rounded-3xl group-hover:border-gold/45 transition-colors duration-75" />
    </>
  );

  if (link) {
    return (
      <motion.a
        href={link}
        ref={(node) => {
          cardRef.current = node;
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="group relative block w-full h-full rounded-[2rem] overflow-hidden transition-all duration-500"
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.div
      ref={(node) => {
        cardRef.current = node;
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative block w-full h-full rounded-[2rem] overflow-hidden transition-all duration-500"
    >
      {inner}
    </motion.div>
  );
}
