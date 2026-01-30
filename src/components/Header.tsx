'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Menu, X, Sun, Moon, Globe, Sparkles } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Enhanced scroll behavior - hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update scrolled state for styling
      setIsScrolled(currentScrollY > 50);

      // Hide/show header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Animate menu items when opened
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menuItems = menuRef.current.querySelectorAll('.menu-item');
      const contactItems = menuRef.current.querySelectorAll('.contact-item');

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
    }
  }, [isOpen]);

  const navItems = [
    { href: '#home', label: { en: 'Home', ar: 'الرئيسية' } },
    { href: '#services', label: { en: 'Services', ar: 'الخدمات' } },
    { href: '#app', label: { en: 'App', ar: 'التطبيق' } },
    { href: '#team', label: { en: 'Team', ar: 'الفريق' } },
    { href: '#contact', label: { en: 'Contact', ar: 'اتصل' } },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'
          } ${isScrolled
            ? 'bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50 shadow-2xl'
            : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Left: Status Indicator */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="relative flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span
                  className="text-sm font-medium text-neutral-400"
                  style={{ fontSize: 'var(--text-body-sm)' }}
                >
                  {language === 'en' ? 'Open for Projects' : 'متاح للمشاريع'}
                </span>
              </div>
            </div>

            {/* Center: Premium Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2 lg:absolute lg:left-1/2 lg:-translate-x-1/2"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="font-display font-black text-neutral-100 transition-all duration-300 group-hover:scale-110"
                  style={{ fontSize: '28px' }}
                >
                  A
                </span>
                <span
                  className="font-display font-black text-gradient-animate bg-clip-text text-transparent transition-all duration-300 group-hover:scale-110"
                  style={{
                    fontSize: '28px',
                    backgroundImage: 'linear-gradient(90deg, var(--gold-400), var(--sand-400), var(--gold-400))',
                    backgroundSize: '200% auto'
                  }}
                >
                  I
                </span>
                <span
                  className="font-display font-black text-neutral-100 transition-all duration-300 group-hover:scale-110"
                  style={{ fontSize: '28px' }}
                >
                  nar
                </span>
              </div>
            </Link>

            {/* Right: Premium Controls */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="group flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 hover:bg-gold-500/10 border border-transparent hover:border-gold-500/30"
                aria-label="Toggle language"
              >
                <Globe size={16} className="text-neutral-400 group-hover:text-gold-400 transition-colors" />
                <span className="text-sm font-semibold text-neutral-400 group-hover:text-gold-400 transition-colors">
                  {language.toUpperCase()}
                </span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-3 rounded-full transition-all duration-300 hover:bg-gold-500/10 border border-transparent hover:border-gold-500/30 group"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun size={18} className="text-neutral-400 group-hover:text-gold-400 transition-colors" />
                ) : (
                  <Moon size={18} className="text-neutral-400 group-hover:text-gold-400 transition-colors" />
                )}
              </button>

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 rounded-full transition-all duration-300 hover:bg-gold-500/10 border border-transparent hover:border-gold-500/30 group relative overflow-hidden"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                <div className="relative z-10">
                  {isOpen ? (
                    <X size={24} className="text-neutral-100 transition-transform duration-300 rotate-90" />
                  ) : (
                    <Menu size={24} className="text-neutral-400 group-hover:text-gold-400 transition-colors" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Premium Full-Screen Navigation Overlay */}
      {isOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-40 bg-neutral-950/98 backdrop-blur-2xl overflow-y-auto"
        >
          {/* Animated Background Gradient */}
          <div
            className="absolute top-1/3 left-1/3 w-[800px] h-[800px] liquid-morph opacity-10 blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, var(--gold-500) 0%, var(--rose-500) 50%, transparent 70%)'
            }}
          />

          {/* Film Grain */}
          <div className="grain-overlay opacity-[0.02]" />

          <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-8 lg:px-16 py-32">
            {/* Navigation Links */}
            <nav className="mb-20">
              <div className="space-y-4">
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="menu-item group block relative"
                    onClick={() => setIsOpen(false)}
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

                      {/* Hover underline */}
                      <div
                        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-gold-400 to-sand-400 transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                        style={{ width: '200px' }}
                      />
                    </div>
                  </Link>
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
                  {language === 'en' ? 'Email' : 'البريد'}
                </h4>
                <a
                  href="mailto:hello@ainar.ae"
                  className="text-lg font-medium text-neutral-300 hover:text-gold-400 transition-colors"
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
                  className="text-lg font-medium text-neutral-300 hover:text-gold-400 transition-colors"
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
                  Dubai, UAE 🇦🇪
                </p>
              </div>
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
