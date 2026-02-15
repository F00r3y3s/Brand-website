"use client";

import React from 'react';
import { CircularTestimonials } from '@/components/ui/circular-testimonials';
import { useLanguage } from '@/context/LanguageContext';

const testimonials = [
  {
    quote:
      "I was impressed by the creativity and execution! They truly understood our brand vision and translated it into a digital experience that stands out. Highly recommended!",
    name: "Sarah Jenkins",
    designation: "Marketing Director",
    src: "/ainar-logo-transparent.png",
    imageMode: "contain" as const,
    cardBackground: "linear-gradient(135deg, #0D7377 0%, #0A1628 100%)",
  },
  {
    quote:
      "The team exceeded all expectations. The attention to detail in the animation and UI interactions is world-class. Our user engagement has doubled since the launch.",
    name: "Michael Chen",
    designation: "Product Lead",
    src: "/ainar-logo-transparent.png",
    imageMode: "contain" as const,
    cardBackground: "linear-gradient(135deg, #1F2937 0%, #111827 100%)",
  },
  {
    quote:
      "A seamless collaboration from start to finish. Their technical expertise combined with design intuition resulted in a product that is both beautiful and performant.",
    name: "Emily Rodriguez",
    designation: "CTO, TechFlow",
    src: "/ainar-logo-transparent.png",
    imageMode: "contain" as const,
    cardBackground: "linear-gradient(135deg, #C9A227 0%, #5A4A0F 100%)",
  },
];

const testimonialsAr = [
  {
    quote:
      "لقد أذهلني الإبداع والتنفيذ! لقد فهموا حقاً رؤية علامتنا التجارية وترجموها إلى تجربة رقمية متميزة. ينصح به بشدة!",
    name: "سارة وجدي",
    designation: "مديرة التسويق",
    src: "/ainar-logo-transparent.png",
    imageMode: "contain" as const,
    cardBackground: "linear-gradient(135deg, #0D7377 0%, #0A1628 100%)",
  },
  {
    quote:
      "فريق العمل تجاوز كل التوقعات. الاهتمام بالتفاصيل في الرسوم المتحركة وتفاعلات واجهة المستخدم عالمي المستوى. تضاعف تفاعل مستخدمينا منذ الإطلاق.",
    name: "مايكل تشن",
    designation: "قائد المنتج",
    src: "/ainar-logo-transparent.png",
    imageMode: "contain" as const,
    cardBackground: "linear-gradient(135deg, #1F2937 0%, #111827 100%)",
  },
  {
    quote:
      "تعاون سلس من البداية إلى النهاية. خبرتهم التقنية جنباً إلى جنب مع الحداقة في التصميم أسفرت عن منتج جميل وعالي الأداء.",
    name: "إيميلي رودريغيز",
    designation: "الرئيس التقني، تك فلو",
    src: "/ainar-logo-transparent.png",
    imageMode: "contain" as const,
    cardBackground: "linear-gradient(135deg, #C9A227 0%, #5A4A0F 100%)",
  },
];

export default function Testimonials() {
  const { language } = useLanguage();
  const data = language === 'en' ? testimonials : testimonialsAr;

  return (
    <section className="bg-neutral-950 py-16 md:py-24 min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-display font-bold tracking-tight text-white">
            {language === 'en' ? 'Trusted by Leaders' : 'ماذا يقول عملاؤنا عنا'}
          </h2>
          <p className="mt-4 text-base md:text-lg text-zinc-300">
            {language === 'en'
              ? 'Feedback from partners who chose AINAR to drive transformation, sustainability, and growth.'
              : 'آراء الشركاء الذين وثقوا بنا لتصميم وبناء نموهم الرقمي.'}
          </p>
        </div>
        <div className="flex justify-center">
          <CircularTestimonials
            testimonials={data}
            autoplay={true}
            colors={{
              name: "#f7f7ff",
              designation: "#a1a1aa", // neutral-400
              testimony: "#f1f1f7",
              arrowBackground: "#D4AF37", // Gold
              arrowForeground: "#141414",
              arrowHoverBackground: "#f7f7ff",
            }}
            fontSizes={{
              name: "clamp(1.25rem, 3vw, 28px)",
              designation: "clamp(0.875rem, 2vw, 16px)",
              quote: "clamp(1rem, 2.5vw, 20px)",
            }}
          />
        </div>
      </div>

      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-gold/5 to-transparent pointer-events-none" />
    </section>
  );
}
