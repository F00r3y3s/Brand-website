'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Menu, X, ArrowUpRight, FileDown, Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface SectionItem {
  id: string
  href: string
  labelEn: string
  labelAr: string
  number: string
}

const SECTIONS: SectionItem[] = [
  { id: 'home', href: '#home', labelEn: 'Home', labelAr: 'الرئيسية', number: '01' },
  { id: 'who-we-are', href: '#who-we-are', labelEn: 'Who We Are', labelAr: 'من نحن', number: '02' },
  { id: 'manifesto', href: '#manifesto', labelEn: 'About', labelAr: 'نبذة عنا', number: '03' },
  { id: 'projects', href: '#projects', labelEn: 'Projects', labelAr: 'المشاريع', number: '04' },
  { id: 'services', href: '#services', labelEn: 'Services', labelAr: 'الخدمات', number: '05' },
  { id: 'team', href: '#team', labelEn: 'Team', labelAr: 'الفريق', number: '06' },
  { id: 'faq', href: '#faq', labelEn: 'FAQ', labelAr: 'الأسئلة الشائعة', number: '07' },
  { id: 'partners', href: '#partners', labelEn: 'Partners', labelAr: 'شركاؤنا', number: '08' },
  { id: 'footer', href: '#footer', labelEn: 'Contact', labelAr: 'تواصل معنا', number: '09' },
]

export default function FloatingNav() {
  const { language, isRTL } = useLanguage()
  const [isPastHero, setIsPastHero] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('who-we-are')
  const isArabic = language === 'ar'
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Track scroll position: activate only when scrolled past Hero section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroThreshold = Math.max(window.innerHeight * 0.7, 500)
      setIsPastHero(scrollY > heroThreshold)

      // Active section calculation
      const sectionElements = SECTIONS.map(s => ({
        id: s.id,
        el: document.getElementById(s.id)
      })).filter((item): item is { id: string; el: HTMLElement } => item.el !== null)

      let current = activeSection
      const viewportMiddle = window.innerHeight * 0.45

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const rect = sectionElements[i].el.getBoundingClientRect()
        if (rect.top <= viewportMiddle && rect.bottom >= 0) {
          current = sectionElements[i].id
          break
        }
      }

      if (current && current !== activeSection) {
        setActiveSection(current)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeSection])

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    // Generous grace window for ultra-smooth exit without sudden snapping
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false)
    }, 420)
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsHovered(false)

    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const brandProfileHref = '/downloads/ainar-fze-brand-profile.pdf'

  const menuContainerVariants: Variants = {
    hidden: {
      opacity: 0,
      x: 20,
      scale: 0.95,
      filter: 'blur(6px)',
      transition: {
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as const,
        staggerChildren: 0.03,
        delayChildren: 0.05,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: 10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
    },
  }

  return (
    <AnimatePresence>
      {isPastHero && (
        <motion.aside
          initial={{ opacity: 0, x: 40, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="fixed right-4 md:right-7 top-1/2 -translate-y-1/2 z-50 flex items-center justify-end select-none"
          aria-label="Floating Side Navigation"
        >
          {/* ── EXPANDED MENU PANEL (Smoothly eases in/out to the left) */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                variants={menuContainerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="mr-3 w-64 sm:w-72 bg-neutral-950/92 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 shadow-[0_24px_70px_rgba(0,0,0,0.55)] text-white overflow-hidden origin-right"
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                {/* Header inside popup (Language toggle hidden as requested) */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 px-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-white/60">
                      {isArabic ? 'التنقل السريع' : 'Navigation'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
                    <Sparkles className="w-3 h-3 text-primary/70" />
                    <span>AINAR</span>
                  </div>
                </div>

                {/* Section List with Smooth Staggered Entrance */}
                <nav className="space-y-1 py-1">
                  {SECTIONS.map((sec) => {
                    const isActive = activeSection === sec.id
                    return (
                      <motion.a
                        key={sec.id}
                        variants={itemVariants}
                        href={sec.href}
                        onClick={(e) => handleNavClick(e, sec.href)}
                        className={`group flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-primary/20 text-white font-medium shadow-sm border border-primary/30'
                            : 'text-white/60 hover:text-white hover:bg-white/8'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`text-[10px] font-mono transition-colors ${isActive ? 'text-primary font-bold' : 'text-white/30 group-hover:text-white/50'}`}>
                            {sec.number}
                          </span>
                          <span className="text-sm font-display tracking-wide">
                            {isArabic ? sec.labelAr : sec.labelEn}
                          </span>
                        </div>

                        {isActive && (
                          <motion.span
                            layoutId="activeDot"
                            className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(18,131,145,0.8)]"
                          />
                        )}
                      </motion.a>
                    )
                  })}
                </nav>

                {/* Footer action inside nav panel */}
                <div className="mt-3 pt-3 border-t border-white/10 px-2 flex items-center justify-between">
                  <a
                    href={brandProfileHref}
                    download="AINAR-FZE-Brand-Profile.pdf"
                    className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-primary transition-colors"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'الملف التعريفي' : 'Brand Profile'}</span>
                  </a>

                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>{isArabic ? 'متاح' : 'Active'}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── COLLAPSED BURGER TRIGGER PILL */}
          <button
            onClick={() => setIsHovered(prev => !prev)}
            aria-label="Toggle Navigation Menu"
            className={`group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl border ${
              isHovered
                ? 'bg-neutral-900 border-primary text-primary shadow-[0_0_24px_rgba(18,131,145,0.4)] scale-105'
                : 'bg-neutral-950/85 hover:bg-neutral-900 border-white/20 text-white hover:border-primary/60 hover:scale-105'
            }`}
          >
            {/* Ambient subtle glow ring */}
            <span className="absolute -inset-1 rounded-full bg-primary/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Burger / Close Icon with smooth rotation */}
            <div className="relative z-10 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isHovered ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-primary" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="burger"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center justify-center gap-1.5 w-5"
                  >
                    <span className="w-5 h-[2px] bg-white rounded-full group-hover:bg-primary transition-colors" />
                    <span className="w-3.5 h-[2px] bg-white/70 rounded-full group-hover:w-5 group-hover:bg-primary transition-all duration-200" />
                    <span className="w-5 h-[2px] bg-white rounded-full group-hover:bg-primary transition-colors" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Active section indicator pill on the side */}
            {!isHovered && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary border-2 border-neutral-950" />
              </span>
            )}
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
