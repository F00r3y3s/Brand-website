'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Linkedin, Mail, FileDown } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const { language } = useLanguage()
  const triggerRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!triggerRef.current || !circleRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top 80%',
          end: 'bottom bottom',
          scrub: 1,
        }
      })

      tl.to(circleRef.current, {
        scale: 30,
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const brandProfileHref = '/downloads/ainar-fze-brand-profile.pdf'

  return (
    <div id="footer" ref={triggerRef} className="relative min-h-screen overflow-hidden flex flex-col justify-end bg-[#F3F2EF] -mt-32">
      {/* The Morph Circle - Positioned to emerge from under the FAQ CTA */}
      <div
        ref={circleRef}
        className="absolute top-48 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-dark z-0"
      />

      <footer ref={contentRef} className="relative z-10 w-full pt-32 pb-12 opacity-0 translate-y-20">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
            <div className="lg:col-span-6">
              <h2 className="text-5xl md:text-8xl font-display text-light mb-8 leading-[0.82]">
                {language === 'en' ? (
                  <>
                    Let&apos;s Build the <br />
                    <span className="text-7xl md:text-[10rem] text-secondary font-sans font-extrabold not-italic tracking-tight leading-none">
                      Future.
                    </span>
                  </>
                ) : (
                  <>
                    لنبني <br />
                    <span className="text-7xl md:text-[10rem] text-secondary font-sans font-extrabold not-italic tracking-tight leading-none">
                      المستقبل.
                    </span>
                  </>
                )}
              </h2>
              <p className="text-light/50 text-xl max-w-sm font-sans mb-12">
                {language === 'en'
                  ? 'We empower individuals, businesses, and communities by providing innovative, sustainable digital solutions.'
                  : 'نمكن الأفراد والشركات والمجتمعات من خلال تقديم حلول رقمية مبتكرة ومستدامة.'}
              </p>

              <div className="flex gap-4">
                <a
                  href="mailto:meryem.ham@gmail.com"
                  className="flex items-center gap-2 px-8 py-4 bg-light text-dark rounded-full font-medium hover:bg-secondary transition-colors duration-300"
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
                  className="flex items-center gap-2 px-6 py-4 rounded-full border border-light/20 text-light hover:bg-primary transition-all duration-300 shadow-xl"
                >
                  <FileDown size={18} />
                  <span className="text-sm font-medium">
                    {language === 'en' ? 'Download Brand Profile' : 'تحميل ملف العلامة'}
                  </span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-3 lg:col-start-8">
              <h4 className="text-light font-medium mb-8 tracking-widest uppercase text-sm">
                {language === 'en' ? 'Navigation' : 'التنقل'}
              </h4>
              <ul className="flex flex-col gap-4 text-light/60 text-lg">
                <li><a href="#hero" className="hover:text-secondary cursor-pointer transition-colors">{language === 'en' ? 'Hero' : 'الرئيسية'}</a></li>
                <li><a href="#projects" className="hover:text-secondary cursor-pointer transition-colors">{language === 'en' ? 'Projects' : 'المشاريع'}</a></li>
                <li><a href="#services" className="hover:text-secondary cursor-pointer transition-colors">{language === 'en' ? 'Services' : 'الخدمات'}</a></li>
                <li><a href="#who-we-are" className="hover:text-secondary cursor-pointer transition-colors">{language === 'en' ? 'About' : 'نبذة عنا'}</a></li>
                <li><a href="#faq" className="hover:text-secondary cursor-pointer transition-colors">{language === 'en' ? 'FAQ' : 'الأسئلة الشائعة'}</a></li>
              </ul>
            </div>

            <div className="lg:col-span-2 lg:col-start-11">
              <h4 className="text-light font-medium mb-8 tracking-widest uppercase text-sm">
                {language === 'en' ? 'Services' : 'الخدمات'}
              </h4>
              <ul className="flex flex-col gap-4 text-light/60 text-lg">
                <li className="hover:text-secondary cursor-pointer transition-colors">{language === 'en' ? 'AI & R&D' : 'الذكاء الاصطناعي والبحث'}</li>
                <li className="hover:text-secondary cursor-pointer transition-colors">{language === 'en' ? 'Software Design' : 'تصميم البرمجيات'}</li>
                <li className="hover:text-secondary cursor-pointer transition-colors">{language === 'en' ? 'Digital Content' : 'المحتوى الرقمي'}</li>
                <li className="hover:text-secondary cursor-pointer transition-colors">{language === 'en' ? 'E-Commerce' : 'التجارة الإلكترونية'}</li>
              </ul>
            </div>
          </div>

          <div className="pt-24 pb-12 border-t border-light/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-display text-light mb-4">
                  {language === 'en' ? 'Join the Movement' : 'انضم إلى الحركة'}
                </h3>
                <p className="text-light/50 font-sans max-w-md">
                  {language === 'en'
                    ? 'Subscribe to our newsletter for the latest updates on AI, sustainability, and green tech.'
                    : 'اشترك في نشرتنا الإخبارية لأحدث التحديثات حول الذكاء الاصطناعي والاستدامة والتكنولوجيا الخضراء.'}
                </p>
              </div>
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder={language === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                  className="flex-1 bg-light/5 border border-light/10 rounded-full px-6 py-4 text-light placeholder:text-light/30 focus:outline-none focus:border-secondary transition-colors"
                />
                <button className="bg-light text-dark px-8 py-4 rounded-full font-medium hover:bg-secondary transition-colors duration-300">
                  {language === 'en' ? 'Subscribe' : 'اشترك'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-light/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-light/30 text-sm font-sans">
              {language === 'en' ? '© 2025 AINAR (FZE). All Rights Reserved.' : '© 2025 اينار. جميع الحقوق محفوظة.'}
            </div>

            <div className="font-display text-3xl text-light italic flex items-center gap-3">
              AINAR <span className="text-xl not-italic opacity-50">اينار</span>
            </div>

            <div className="flex gap-8 text-light/30 text-sm">
              <span className="hover:text-light cursor-pointer transition-colors">
                {language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
              </span>
              <span className="hover:text-light cursor-pointer transition-colors">
                {language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
