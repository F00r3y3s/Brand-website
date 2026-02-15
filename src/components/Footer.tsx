'use client'

import { useEffect, useRef, type MouseEvent } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Linkedin, Mail, FileDown } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

declare global {
  interface Window {
    __onLuminaNavClick?: (idx: number) => void
  }
}

export default function Footer() {
  const { language } = useLanguage()
  const triggerRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isArabic = language === 'ar'

  const handleNavClick = (selector: string, serviceIndex?: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const target = document.querySelector(selector)
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (typeof serviceIndex === 'number') {
      window.setTimeout(() => {
        if (typeof window.__onLuminaNavClick === 'function') {
          window.__onLuminaNavClick(serviceIndex)
        }
      }, 340)
    }
  }

  useEffect(() => {
    if (!triggerRef.current || !circleRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: 1,
        }
      })

      tl.to(circleRef.current, {
        scale: 34,
        ease: 'power3.inOut',
      })
        .to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5
        }, '-=0.3')
    }, triggerRef)

    return () => ctx.revert()
  }, [])

  const brandProfileHref = '/downloads/ainar-fze-brand-profile.pdf'
  const navItems = [
    { href: '#home', en: 'Hero', ar: 'الرئيسية' },
    { href: '#projects', en: 'Projects', ar: 'المشاريع' },
    { href: '#services', en: 'Services', ar: 'الخدمات' },
    { href: '#who-we-are', en: 'About', ar: 'نبذة عنا' },
    { href: '#team', en: 'Team', ar: 'الفريق' },
    { href: '#faq', en: 'FAQ', ar: 'الأسئلة الشائعة' },
  ]
  const serviceItems = [
    { titleEn: 'Sustainability Advisor', titleAr: 'مستشار الاستدامة', slide: 0 },
    { titleEn: 'Software Development', titleAr: 'تطوير البرمجيات', slide: 1 },
    { titleEn: 'Content Creation', titleAr: 'صناعة المحتوى', slide: 2 },
    { titleEn: 'E-Commerce', titleAr: 'التجارة الإلكترونية', slide: 3 },
  ]

  return (
    <div id="footer" ref={triggerRef} className="relative min-h-[86vh] md:min-h-[90vh] overflow-hidden flex flex-col justify-end bg-transparent">
      {/* The Morph Circle - Positioned to emerge from under the FAQ CTA */}
      <div
        ref={circleRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-dark z-0 will-change-transform"
      />

      <footer ref={contentRef} className="relative z-10 w-full pt-14 md:pt-20 pb-6 md:pb-8 opacity-0 translate-y-20">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-7 md:gap-8 mb-6 md:mb-7">
            <div className="lg:col-span-7">
              <div className={`mb-4 md:mb-5 ${isArabic ? 'text-right' : ''}`}>
                {language === 'en' ? (
                  <div className="inline-flex items-center gap-4 lg:gap-5">
                    <div className="hidden md:flex h-[11.6rem] lg:h-[14.6rem] w-10 lg:w-12 items-center justify-center">
                      <span className="-rotate-90 origin-center whitespace-nowrap text-[1.95rem] lg:text-[2.2rem] font-black uppercase tracking-[0.13em] leading-none">
                        <span className="text-light">SUSTAI</span>
                        <span className="text-secondary">NABLE</span>
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-[5.2rem] lg:text-[6.4rem] font-display text-light leading-[0.86]">
                      Let&apos;s Build the <br />
                      <span className="text-[3.2rem] md:text-[6.4rem] lg:text-[7.6rem] text-secondary font-sans font-extrabold not-italic tracking-tight leading-none">
                        Future.
                      </span>
                    </h2>
                  </div>
                ) : (
                  <h2 className="text-3xl md:text-[5.2rem] lg:text-[6.4rem] font-display text-light leading-[0.86] text-right">
                    لنبني <br />
                    <span className="text-[3.2rem] md:text-[6.4rem] lg:text-[7.6rem] text-secondary font-sans font-extrabold not-italic tracking-tight leading-none">
                      المستقبل.
                    </span>
                  </h2>
                )}
              </div>
              <p className={`text-light/62 text-[1.02rem] md:text-[1.16rem] max-w-[58rem] font-sans mb-7 leading-[1.5] ${isArabic ? 'text-right' : 'md:pl-[3.5rem] lg:pl-[4.25rem]'}`}>
                {language === 'en'
                  ? (
                    <>
                      <span className="block">We empower individuals, businesses, and communities</span>
                      <span className="block">by providing innovative, sustainable digital solutions.</span>
                    </>
                  )
                  : 'نمكن الأفراد والشركات والمجتمعات من خلال تقديم حلول رقمية مبتكرة ومستدامة.'}
              </p>

              <div className={`flex flex-wrap gap-4 ${isArabic ? '' : 'md:pl-[3.5rem] lg:pl-[4.25rem]'}`}>
                <a
                  href="mailto:meryem.ham@gmail.com"
                  className="flex items-center gap-2 px-7 py-3.5 bg-light text-dark rounded-full font-medium hover:bg-secondary transition-colors duration-300"
                >
                  <Mail size={20} />
                  {language === 'en' ? 'Get in Touch' : 'تواصل معنا'}
                </a>
                <a
                  href="https://www.linkedin.com/in/meryemhamidi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full border border-light/20 flex items-center justify-center text-light hover:bg-primary transition-all duration-300 shadow-xl"
                >
                  <Linkedin size={24} />
                </a>
                <a
                  href={brandProfileHref}
                  download="AINAR-FZE-Brand-Profile.pdf"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-light/20 text-light hover:bg-primary transition-all duration-300 shadow-xl"
                >
                  <FileDown size={18} />
                  <span className="text-sm font-medium">
                    {language === 'en' ? 'Download Brand Profile' : 'تحميل ملف العلامة'}
                  </span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8 flex flex-col md:flex-row justify-end gap-8 lg:gap-12 text-left">
              <div className="flex flex-col items-start">
                <h4 className="text-light font-medium mb-8 tracking-widest uppercase text-sm">
                  {language === 'en' ? 'Navigation' : 'التنقل'}
                </h4>
                <ul className="flex flex-col gap-3.5 text-light/60 text-base md:text-lg items-start">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={handleNavClick(item.href)}
                        className="hover:text-secondary cursor-pointer transition-colors"
                      >
                        {language === 'en' ? item.en : item.ar}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-start">
                <h4 className="text-light font-medium mb-8 tracking-widest uppercase text-sm">
                  {language === 'en' ? 'Services' : 'الخدمات'}
                </h4>
                <ul className="flex flex-col gap-3.5 text-light/60 text-base md:text-lg items-start">
                  {serviceItems.map((item) => (
                    <li key={item.titleEn}>
                      <a
                        href="#services"
                        onClick={handleNavClick('#services', item.slide)}
                        className="hover:text-secondary cursor-pointer transition-colors"
                      >
                        {language === 'en' ? item.titleEn : item.titleAr}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-6 md:pt-7 pb-6 md:pb-7 border-t border-light/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
              <div>
                <h3 className="text-3xl md:text-[2.05rem] font-display text-light mb-2.5">
                  {language === 'en' ? 'Join the Movement' : 'انضم إلى الحركة'}
                </h3>
                <p className="text-light/50 font-sans max-w-[42rem] text-base md:text-[1.05rem]">
                  {language === 'en'
                    ? 'Subscribe to our newsletter for the latest updates on AI, sustainability, and green tech.'
                    : 'اشترك في نشرتنا الإخبارية لأحدث التحديثات حول الذكاء الاصطناعي والاستدامة والتكنولوجيا الخضراء.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder={language === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                  aria-label={language === 'en' ? 'Email for newsletter' : 'البريد الإلكتروني للنشرة الإخبارية'}
                  className="flex-1 bg-light/5 border border-light/10 rounded-full px-6 py-3.5 text-light placeholder:text-light/30 focus:outline-none focus:border-secondary transition-colors"
                />
                <button className="bg-light text-dark px-8 py-3.5 rounded-full font-medium hover:bg-secondary transition-colors duration-300">
                  {language === 'en' ? 'Subscribe' : 'اشترك'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-5 md:pt-6 border-t border-light/10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
            <div className="text-light/92 text-sm md:text-[0.95rem] font-semibold font-sans">
              {language === 'en' ? '© 2026 AINAR (FZE). All Rights Reserved.' : '© 2026 اينار. جميع الحقوق محفوظة.'}
            </div>

            <div className="flex items-center justify-center">
              <img
                src="/ainar-logo-transparent.png"
                alt="AINAR logo"
                className="h-10 md:h-11 w-auto object-contain brightness-0 invert opacity-95"
              />
            </div>

            <div className="flex gap-8 text-light/90 text-sm md:text-[0.95rem] font-semibold">
              <span className="hover:text-light cursor-pointer transition-colors">
                {language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
              </span>
              <span className="hover:text-light cursor-pointer transition-colors">
                {language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}
              </span>
            </div>
          </div>
        </div>
      </footer >
    </div >
  )
}
