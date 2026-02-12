'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, X, Globe, Sparkles, FileDown } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import NavMenu from '@/components/ui/menu-hover-effects';

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Enhanced scroll behavior - hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Animate menu items when opened
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const ctx = gsap.context(() => {
        const menuItems = menuRef.current!.querySelectorAll('.menu-item');
        const contactItems = menuRef.current!.querySelectorAll('.contact-item');

        gsap.fromTo(
          menuItems,
          { opacity: 0, y: 60, rotationX: -20 },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
          }
        );

        gsap.fromTo(
          contactItems,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.4,
            stagger: 0.1,
            ease: 'power2.out',
          }
        );
      }, menuRef);

      return () => ctx.revert();
    }
  }, [isOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const brandProfileHref = '/downloads/ainar-fze-brand-profile.pdf';

  const desktopNavItems = [
    { name: language === 'en' ? 'Home' : 'الرئيسية', href: '#top' },
    { name: language === 'en' ? 'About' : 'نبذة عنا', href: '#manifesto' },
    { name: language === 'en' ? 'Projects' : 'المشاريع', href: '#projects' },
    { name: language === 'en' ? 'Services' : 'الخدمات', href: '#services' },
    { name: language === 'en' ? 'Team' : 'الفريق', href: '#team' },
    { name: language === 'en' ? 'Contact' : 'تواصل معنا', href: '#footer' },
    { name: language === 'en' ? 'Download' : 'تحميل', href: brandProfileHref, isDownload: true },
  ];

  const mobileNavItems = [
    { href: '#home', label: { en: 'Home', ar: 'الرئيسية' } },
    { href: '#manifesto', label: { en: 'About', ar: 'نبذة عنا' } },
    { href: '#projects', label: { en: 'Projects', ar: 'المشاريع' } },
    { href: '#services', label: { en: 'Services', ar: 'الخدمات' } },
    { href: '#team', label: { en: 'Team', ar: 'الفريق' } },
    { href: '#footer', label: { en: 'Contact', ar: 'تواصل معنا' } },
  ];

  const brandMark = (
    <img
      src="/ainar-logo-transparent.png"
      alt="AINAR Logo"
      className="w-[60px] sm:w-[64px] lg:w-[72px] h-auto"
    />
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'
          } ${isScrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg supports-[backdrop-filter]:bg-white/60'
            : 'bg-white/5 backdrop-blur-sm border-b border-white/5'
          }`}
      >
        <div className="w-full pl-4 pr-6 sm:pl-8 sm:pr-12 md:pl-10 md:pr-16 lg:pl-12 lg:pr-24">
          <div className="flex items-center justify-between h-24">
            {/* Left: Status Indicator & Brand */}
            <div className="flex items-center gap-3 lg:-ml-2">
              {/* Status Indicator */}
              <div className="hidden lg:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-neutral-900">
                  {language === 'en' ? 'Open for Projects' : 'متاح للمشاريع'}
                </span>
              </div>

              {/* Brand Logo — Always LTR */}
              <Link
                href="/"
                className="group flex items-center gap-2"
                dir="ltr"
              >
                {brandMark}
              </Link>
            </div>

            {/* Right: Navigation & Controls */}
            <div className="flex items-center gap-6 justify-end">

              {/* Desktop Navigation */}
              <div className="hidden lg:block">
                <NavMenu items={desktopNavItems} />
              </div>

              <div className="flex items-center gap-3">

                {/* Language Toggle */}
                <button
                  onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                  className="group flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 bg-white/50 backdrop-blur-md border border-white/20 hover:bg-white/80 hover:scale-105 shadow-sm"
                  aria-label="Toggle language"
                >
                  <Globe size={16} className="text-neutral-900 group-hover:text-gold transition-colors" />
                  <span className="text-sm font-bold text-neutral-900 group-hover:text-gold transition-colors">
                    {language.toUpperCase()}
                  </span>
                </button>

                {/* Hamburger Menu Button */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="lg:hidden p-3 rounded-full transition-all duration-300 bg-white/50 backdrop-blur-md border border-white/20 hover:bg-white/80 hover:scale-105 shadow-sm group relative overflow-hidden"
                  aria-label={isOpen ? 'Close menu' : 'Open menu'}
                >
                  <div className="relative z-10">
                    {isOpen ? (
                      <X size={24} className="text-neutral-900 transition-transform duration-300 rotate-90" />
                    ) : (
                      <Menu size={24} className="text-neutral-900 group-hover:text-teal transition-colors" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Premium Full-Screen Mobile Navigation Overlay */}
      {isOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-40 bg-neutral-950/98 backdrop-blur-2xl overflow-y-auto"
        >
          {/* Animated Background Gradient */}
          <div
            className="absolute top-1/3 left-1/3 w-[800px] h-[800px] liquid-morph opacity-10 blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, var(--gold-500) 0%, var(--brand-plum) 50%, transparent 70%)'
            }}
          />

          {/* Film Grain */}
          <div className="grain-overlay opacity-[0.02]" />

          <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-8 lg:px-16 py-32">
            {/* Navigation Links */}
            <nav className="mb-20">
              <div className="space-y-4">
                {mobileNavItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="menu-item group block relative"
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    <div className="relative overflow-hidden py-3">
                      <span
                        className="font-display font-black text-neutral-100 transition-all duration-500 group-hover:text-transparent group-hover:bg-clip-text inline-block"
                        style={{
                          fontSize: 'clamp(48px, 8vw, 96px)',
                          letterSpacing: 'var(--letter-spacing-tight)',
                          lineHeight: 'var(--line-height-tight)',
                          backgroundImage: 'linear-gradient(90deg, var(--gold-300), var(--sand-400))',
                          transform: 'translateX(0)',
                          transition: 'transform 0.5s var(--ease-out-cubic)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateX(30px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        {language === 'en' ? item.label.en : item.label.ar}
                      </span>

                      <div
                        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-gold to-sand transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                        style={{ width: '200px' }}
                      />
                    </div>
                  </a>
                ))}
              </div>
            </nav>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-neutral-800 pt-12">
              <div className="contact-item">
                <h4
                  className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                  style={{ color: 'var(--gold-400)' }}
                >
                  <Sparkles size={14} />
                  {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                </h4>
                <a
                  href="mailto:hello@ainar.ae"
                  className="text-lg font-medium text-neutral-300 hover:text-gold transition-colors"
                >
                  hello@ainar.ae
                </a>
              </div>

              <div className="contact-item">
                <h4
                  className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                  style={{ color: 'var(--gold-400)' }}
                >
                  <Sparkles size={14} />
                  {language === 'en' ? 'Phone' : 'الهاتف'}
                </h4>
                <a
                  href="tel:+97144000000"
                  className="text-lg font-medium text-neutral-300 hover:text-gold transition-colors"
                >
                  +971 4 XXX XXXX
                </a>
              </div>

              <div className="contact-item">
                <h4
                  className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                  style={{ color: 'var(--gold-400)' }}
                >
                  <Sparkles size={14} />
                  {language === 'en' ? 'Location' : 'الموقع'}
                </h4>
                <p className="text-lg font-medium text-neutral-300">
                  {language === 'en' ? 'Dubai, UAE 🇦🇪' : 'دبي، الإمارات 🇦🇪'}
                </p>
              </div>
            </div>

            <div className="mt-8 contact-item">
              <a
                href={brandProfileHref}
                download="AINAR-FZE-Brand-Profile.pdf"
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-3 text-sm font-bold text-gold hover:bg-gold/20 transition-colors"
              >
                <FileDown size={16} />
                {language === 'en' ? 'Download Brand Profile' : 'تحميل ملف العلامة'}
              </a>
            </div>

            {/* Status Indicator (Mobile) */}
            <div className="lg:hidden mt-12 flex items-center gap-3 contact-item">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-neutral-400">
                {language === 'en' ? 'Open for Projects' : 'متاح للمشاريع'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
