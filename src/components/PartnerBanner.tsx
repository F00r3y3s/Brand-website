'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowUpRight, Calendar, MapPin, Sparkles, Layers, Image as ImageIcon, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface BannerFormat {
  id: string
  labelEn: string
  labelAr: string
  dims: string
  src: string
  aspectRatio: string
}

const BANNER_FORMATS: BannerFormat[] = [
  {
    id: 'key-visual',
    labelEn: 'Official Key Visual',
    labelAr: 'الهوية البصرية الرسمية',
    dims: '1500 × 600',
    src: '/partners/wuc-banner-1500x600.jpg',
    aspectRatio: '1500 / 600',
  },
  {
    id: 'leaderboard',
    labelEn: 'Digital Leaderboard',
    labelAr: 'بانر رقمي عريض',
    dims: '970 × 250',
    src: '/partners/wuc-banner-970x250.jpg',
    aspectRatio: '970 / 250',
  },
  {
    id: 'summit-showcase',
    labelEn: 'Summit Showcase',
    labelAr: 'بانر المؤتمر',
    dims: '1024 × 500',
    src: '/partners/wuc-banner-1024x500.jpg',
    aspectRatio: '1024 / 500',
  },
  {
    id: 'compact-card',
    labelEn: 'Official Card',
    labelAr: 'بطاقة الشراكة',
    dims: '600 × 200',
    src: '/partners/wuc-banner-600x200.jpg',
    aspectRatio: '600 / 200',
  },
]

export default function PartnerBanner() {
  const { language, isRTL } = useLanguage()
  const isArabic = language === 'ar'
  const [selectedFormat, setSelectedFormat] = useState<BannerFormat>(BANNER_FORMATS[0])
  const cardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(cardRef, { once: false, margin: '-40px' })

  return (
    <section
      id="partners"
      className="relative min-h-[180vh] bg-[#F3F2EF]"
      aria-label={isArabic ? 'شركاؤنا الاستراتيجيون' : 'Our Strategic Partners'}
    >
      {/* ── STICKY CONTAINER: Sticks in the viewport for scroll duration */}
      <div className="sticky top-0 min-h-screen w-full flex flex-col justify-center items-center py-10 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
          
          {/* ── SECTION HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`mb-6 md:mb-8 text-center`}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/45 bg-primary/10 text-primary text-[clamp(0.7rem,1vw,0.82rem)] font-mono font-black uppercase tracking-[0.28em] shadow-[0_4px_16px_rgba(18,131,145,0.14)] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isArabic ? 'الشريك الاستراتيجي' : 'Strategic Partnership'}</span>
            </div>

            <h2 className="text-[clamp(1.85rem,4vw,2.75rem)] font-display font-bold text-dark leading-tight mb-2">
              {isArabic ? (
                <>معاً نقود <span className="text-primary italic">مستقبل المرافق الذكية</span></>
              ) : (
                <>Empowering the <span className="text-primary italic">Future of Utilities</span></>
              )}
            </h2>

            <p className="text-dark/60 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
              {isArabic
                ? 'تفخر اينار بشراكتها الاستراتيجية مع المؤتمر العالمي للمرافق لتسريع التحول الرقمي والاستدامة في قطاع الطاقة والمياه.'
                : 'AINAR is proud to be an official strategic partner of the World Utilities Congress, driving AI innovation and sustainable transformation across global utilities.'}
            </p>
          </motion.div>

          {/* ── HIGH-CONTRAST MASTER PARTNER CARD */}
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-[#050D1A] rounded-3xl md:rounded-[2rem] border border-white/12 shadow-[0_24px_70px_rgba(1,7,18,0.32)] overflow-hidden text-white relative"
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Top glass ambient highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

            {/* ── TOP SECTION: BANNER DISPLAY FRAME */}
            <div className="relative w-full bg-[#020710] overflow-hidden border-b border-white/10 group">
              <div
                className="relative w-full transition-all duration-500 ease-out flex items-center justify-center bg-black/40"
                style={{ maxHeight: '260px', minHeight: '160px', aspectRatio: selectedFormat.aspectRatio }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedFormat.id}
                    src={selectedFormat.src}
                    alt={selectedFormat.labelEn}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.015] transition-transform duration-700"
                  />
                </AnimatePresence>

                {/* Gradient vignette edges */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A] via-transparent to-black/30 pointer-events-none" />

                {/* Top Badge: Official Strategic Partner */}
                <div className={`absolute top-3 ${isArabic ? 'right-4' : 'left-4'} flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950/80 backdrop-blur-md border border-white/20 shadow-md`}>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300">
                    {isArabic ? 'شريك استراتيجي رسمي' : 'Official Strategic Partner'}
                  </span>
                </div>

                {/* Active Dimension Pill */}
                <div className={`absolute top-3 ${isArabic ? 'left-4' : 'right-4'} hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950/70 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/70`}>
                  <ImageIcon className="w-3 h-3 text-cyan-400" />
                  <span>{selectedFormat.dims}</span>
                </div>
              </div>

              {/* ── MULTI-BANNER FORMAT SELECTOR BAR */}
              <div className="bg-[#020710]/90 backdrop-blur-md px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">{isArabic ? 'أبعاد البانر الرسمية:' : 'Official Campaign Assets:'}</span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 custom-scrollbar">
                  {BANNER_FORMATS.map((fmt) => {
                    const isSelected = selectedFormat.id === fmt.id
                    return (
                      <button
                        key={fmt.id}
                        onClick={() => setSelectedFormat(fmt)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 whitespace-nowrap ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                            : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                        <span>{isArabic ? fmt.labelAr : fmt.labelEn}</span>
                        <span className="text-[10px] text-white/40">({fmt.dims})</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* ── BODY SECTION: HIGH-CONTRAST LOGO & SUMMIT DETAILS */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
                
                {/* Left: Event info & description */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono uppercase tracking-wider font-semibold">
                      {isArabic ? 'قطاع الطاقة والمرافق' : 'Global Energy & Utilities'}
                    </span>
                    <span className="text-white/40 text-xs font-mono">
                      ADNEC Abu Dhabi
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 leading-tight">
                    {isArabic ? 'المؤتمر العالمي للمرافق ٢٠٢٧' : 'World Utilities Congress 2027'}
                  </h3>

                  <p className="text-white/70 text-sm md:text-[0.95rem] leading-relaxed max-w-2xl font-light">
                    {isArabic
                      ? 'المنصة العالمية الرائدة التي تستضيف قادة الطاقة وصانعي السياسات ورواد الاستدامة لمناقشة التحديات وصياغة ملامح قطاع المرافق المستدام والذكي.'
                      : 'Convening global energy ministers, utility leaders, and sustainability pioneers to build resilient, AI-accelerated power and water utility networks worldwide.'}
                  </p>
                </div>

                {/* Right: High-Contrast Dark Obsidian Logo Badge */}
                <div className="flex-shrink-0 self-center">
                  <div className="relative group/logo p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#021329] via-[#051C3D] to-[#010914] border border-cyan-500/30 shadow-[0_0_28px_rgba(0,107,182,0.35)] flex flex-col items-center justify-center transition-all duration-300 group-hover/logo:border-cyan-400/60">
                    <img
                      src="/partners/wuc-logo-white.png"
                      alt="World Utilities Congress Official Logo"
                      className="h-10 sm:h-12 w-auto object-contain brightness-110 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
                    />
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-cyan-300/80 mt-2 font-semibold">
                      Official Partner
                    </span>
                  </div>
                </div>
              </div>

              {/* ── FOOTER: Summit Dates, Location & Direct CTAs */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Details Pills */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-mono">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isArabic ? '٢٥ – ٢٧ مايو ٢٠٢٧' : '25 – 27 May 2027'}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-mono">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isArabic ? 'أبوظبي، الإمارات' : 'ADNEC, Abu Dhabi, UAE'}</span>
                  </div>
                </div>

                {/* Action button: Visit Official Summit */}
                <div className="flex items-center">
                  <a
                    href="https://worldutilitiescongress.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#006BB6] to-[#0091DA] hover:from-[#0077c8] hover:to-[#00a3f5] shadow-[0_4px_20px_rgba(0,107,182,0.45)] hover:shadow-[0_6px_28px_rgba(0,107,182,0.6)] hover:scale-[1.02] transition-all duration-200"
                  >
                    <span>{isArabic ? 'زيارة الموقع الرسمي' : 'Visit Official Summit'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  )
}
