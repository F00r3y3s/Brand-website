'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Twitter, Linkedin, Instagram, Facebook, ArrowUp } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextRevealer from './common/TextRevealer';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const { language } = useLanguage();
  const footerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!footerRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      // Background Color Reveal Effect
      // The footer itself starts with a different background color that reveals
      gsap.fromTo(footerRef.current, {
        backgroundColor: '#000000',
      }, {
        backgroundColor: '#0a0a09', // Subtle shift to warmer dark
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          end: 'bottom bottom',
          scrub: 1,
        }
      });

      // Content Staggered Entry
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('.footer-stagger');
        gsap.fromTo(elements, {
          y: 50,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 70%',
          }
        });
      }

    }, footerRef);

    return () => ctx.revert();
  }, []);

  const footerLinks = {
    product: [
      { id: 'product-features', label: { en: 'Features', ar: 'المميزات' }, href: '#services' },
      { id: 'product-pricing', label: { en: 'Pricing', ar: 'التسعير' }, href: null },
      { id: 'product-docs', label: { en: 'Documentation', ar: 'الوثائق' }, href: null },
      { id: 'product-faq', label: { en: 'FAQ', ar: 'الأسئلة الشائعة' }, href: null },
    ],
    company: [
      { id: 'company-about', label: { en: 'About', ar: 'عن' }, href: null },
      { id: 'company-blog', label: { en: 'Blog', ar: 'المدونة' }, href: null },
      { id: 'company-press', label: { en: 'Press', ar: 'الصحافة' }, href: null },
      { id: 'company-careers', label: { en: 'Careers', ar: 'الوظائف' }, href: null },
    ],
    legal: [
      { id: 'legal-privacy', label: { en: 'Privacy', ar: 'الخصوصية' }, href: null },
      { id: 'legal-terms', label: { en: 'Terms', ar: 'الشروط' }, href: null },
      { id: 'legal-cookies', label: { en: 'Cookies', ar: 'الكوكيز' }, href: null },
      { id: 'legal-contact', label: { en: 'Contact', ar: 'اتصل بنا' }, href: '#contact' },
    ],
  };

  const socialLinks = [
    { id: 'social-twitter', icon: Twitter, label: 'Twitter', href: '#' },
    { id: 'social-linkedin', icon: Linkedin, label: 'LinkedIn', href: '#' },
    { id: 'social-instagram', icon: Instagram, label: 'Instagram', href: '#' },
    { id: 'social-facebook', icon: Facebook, label: 'Facebook', href: '#' },
  ];

  const renderLink = (link: { id: string; label: { en: string; ar: string }; href: string | null }) => {
    if (!link.href) {
      return (
        <button
          key={link.id}
          className="text-neutral-500 hover:text-gold transition-colors duration-300 text-sm text-left cursor-not-allowed opacity-75"
          disabled
        >
          {language === 'en' ? link.label.en : link.label.ar}
        </button>
      );
    }

    if (link.href.startsWith('#')) {
      return (
        <a
          key={link.id}
          href={link.href}
          className="text-neutral-400 hover:text-gold transition-colors duration-300 text-sm"
        >
          {language === 'en' ? link.label.en : link.label.ar}
        </a>
      );
    }

    return (
      <Link
        key={link.id}
        href={link.href}
        className="text-neutral-400 hover:text-gold transition-colors duration-300 text-sm"
      >
        {language === 'en' ? link.label.en : link.label.ar}
      </Link>
    );
  };

  return (
    <footer ref={footerRef} className="relative bg-black pt-24 md:pt-40 overflow-hidden">
      {/* Massive CTA Section */}
      <div className="max-w-7xl mx-auto px-6 mb-32 relative z-10 text-center">
        <div className="mb-8 overflow-hidden">
          <h2 className="text-[12vw] leading-[0.8] font-black font-display text-white tracking-tighter uppercase mix-blend-difference">
            {language === 'en' ? 'LET\'S BUILD' : 'لنبدأ البناء'}
          </h2>
          <h2 className="text-[12vw] leading-[0.8] font-black font-display text-gold tracking-tighter uppercase italic opacity-90">
            {language === 'en' ? 'TOMORROW' : 'للمستقبل'}
          </h2>
        </div>

        <div className="flex justify-center">
          <button className="group relative px-12 py-6 bg-white text-black rounded-full font-bold text-lg uppercase tracking-widest hover:bg-gold transition-colors duration-500 overflow-hidden">
            <span className="relative z-10 flex items-center gap-4">
              {language === 'en' ? 'Start Project' : 'ابدأ مشروع'}
              <div className="w-2 h-2 rounded-full bg-black group-hover:bg-white transition-colors" />
            </span>
          </button>
        </div>
      </div>

      {/* Main Footer Content */}
      <div ref={contentRef} className="px-6 pb-12 border-t border-white/5 pt-20">
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand Section */}
            <div className="md:col-span-1 footer-stagger">
              <Link href="/" className="inline-block mb-6">
                <div className="text-3xl font-bold font-display tracking-tight text-white">
                  AI<span className="text-gold">nar</span>.
                </div>
              </Link>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                {language === 'en'
                  ? 'Crafting extraordinary digital brands for forward-thinking organizations.'
                  : 'نصنع علامات تجارية رقمية استثنائية للمنظمات الفكرية المتقدمة.'}
              </p>

              {/* Social Links */}
              <div className="flex gap-4 mt-8">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    aria-label={social.label}
                    className="p-3 rounded-full bg-white/5 hover:bg-gold hover:text-black transition-all duration-300 text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="footer-stagger">
              <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-8">
                {language === 'en' ? 'Product' : 'المنتج'}
              </h3>
              <ul className="space-y-4">
                {footerLinks.product.map((link) => (
                  <li key={link.id}>
                    {renderLink(link)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-stagger">
              <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-8">
                {language === 'en' ? 'Company' : 'الشركة'}
              </h3>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.id}>
                    {renderLink(link)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-stagger">
              <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-8">
                {language === 'en' ? 'Legal' : 'القانوني'}
              </h3>
              <ul className="space-y-4">
                {footerLinks.legal.map((link) => (
                  <li key={link.id}>
                    {renderLink(link)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 footer-stagger">
            <div className="text-center sm:text-left">
              <p className="text-neutral-600 text-xs uppercase tracking-wider">
                {language === 'en'
                  ? '© 2024 AInar. All rights reserved. Built in UAE.'
                  : '© 2024 أينار. جميع الحقوق محفوظة. صنع في الإمارات.'}
              </p>
            </div>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="p-4 rounded-full bg-white/5 hover:bg-gold text-white hover:text-black transition-all duration-500 hover:-translate-y-2 group"
              aria-label="Back to top"
            >
              <ArrowUp size={20} className="group-hover:animate-bounce" />
            </button>
          </div>
        </div>
      </div>

      {/* Background Graphic */}
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-gold/5 to-transparent pointer-events-none" />
    </footer>
  );
}

