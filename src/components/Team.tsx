'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TeamMember {
  name: string
  nameAr?: string
  role: string
  roleAr?: string
  image?: string
  roleDescription: string
  roleDescriptionAr?: string
  profession: string
  professionAr?: string
  bio: string
  bioAr?: string
  linkedin?: string
}

const teamMembers: TeamMember[] = [
  {
    name: "Dr. Meryem Hamidi",
    nameAr: "د. مريم حميدي",
    role: "Founder & CEO",
    roleAr: "المؤسس والرئيس التنفيذي",
    image: "/avatar-female.svg",
    roleDescription: "Dr. Hamidi leads AINAR with a vision to merge sustainability with advanced intelligence.",
    roleDescriptionAr: "تقود د. مريم شركة AINAR برؤية تدمج الاستدامة مع الذكاء الاصطناعي المتقدم.",
    profession: "Founder & CEO at AINAR | ESG & Sustainability Strategist | PhD in Electrical & Energy Engineering",
    professionAr: "المؤسس والرئيس التنفيذي لـ AINAR | خبيرة استراتيجيات الاستدامة وESG | دكتوراه في هندسة الطاقة والكهرباء",
    bio: "Over 12 years bridging technical engineering with strategic vision to drive sustainable innovation, AI-optimized energy, and net-zero transitions.",
    bioAr: "أكثر من 12 عاماً من الجمع بين الخبرة الهندسية والرؤية الاستراتيجية لدفع الابتكار المستدام وتحسين كفاءة الطاقة بالذكاء الاصطناعي.",
    linkedin: "https://www.linkedin.com/in/meryemhamidi/",
  },
  {
    name: "Fatima Moussa Sy",
    nameAr: "فاطمة موسى سي",
    role: "Assistant & Business Coordinator",
    roleAr: "مساعد ومنسق أعمال",
    image: "/avatar-female.svg",
    roleDescription: "Coordinates daily operations, communications, and executive follow-through across business initiatives.",
    roleDescriptionAr: "تنسيق العمليات اليومية والاتصالات ومتابعة المبادرات التجارية التنفيذية عبر الشركة.",
    profession: "Assistant & Business Coordinator | Operations & Executive Support",
    professionAr: "مساعد ومنسق أعمال | إدارة العمليات والدعم التنفيذي",
    bio: "Coordinates daily operations, communications, and executive follow-through across business initiatives.",
    bioAr: "تنسيق العمليات اليومية والاتصالات ومتابعة المبادرات التجارية التنفيذية.",
    linkedin: "https://www.linkedin.com/in/fatimasyshj/?isSelfProfile=false",
  },
  {
    name: "Abdul Jabbar",
    nameAr: "عبد الجبار",
    role: "Lead IT / Technical Advisor",
    roleAr: "المستشار التقني وقائد تكنولوجيا المعلومات",
    image: "/avatar-male.svg",
    roleDescription: "Leads IT and technical direction, advising on architecture, implementation quality, and delivery standards.",
    roleDescriptionAr: "يقود التوجيه التقني وتكنولوجيا المعلومات، ويقدم الاستشارات حول الهيكلية البرمجية ومعايير التسليم.",
    profession: "Lead IT / Technical Advisor | Systems & Full-Stack Solutions",
    professionAr: "المستشار التقني وقائد تكنولوجيا المعلومات | حلول الأنظمة والتطوير المتكامل",
    bio: "Guiding technical architecture, digital infrastructure, and scalable system delivery with high performance and security standards.",
    bioAr: "قيادة الهيكلية التقنية والبنية التحتية الرقمية وتقديم حلول برمجية قابلة للتوسع بأعلى معايير الأداء والأمان.",
    linkedin: "https://www.linkedin.com/in/abdul-jabbar-a7a371291/?isSelfProfile=true",
  }
]

export default function Team() {
  const containerRef = useRef<HTMLElement>(null)
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const { language, isRTL } = useLanguage()
  const isArabic = language === 'ar'

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.team-header', 
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.75, scrollTrigger: { trigger: '.team-header', start: 'top 85%' } }
      );
      gsap.fromTo('.team-member-row',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, scrollTrigger: { trigger: '.team-members-container', start: 'top 85%' } }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [language]);

  // Handle ESC key and scroll locking when popup is open
  useEffect(() => {
    const dispatchLock = (locked: boolean) =>
      window.dispatchEvent(new CustomEvent('app:scroll-lock', { detail: { locked } }))

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMember(null)
    }
    if (selectedMember) {
      dispatchLock(true)
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      dispatchLock(false)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [selectedMember])

  return (
    <section
      id="team"
      ref={containerRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-light relative overflow-hidden cursor-default pt-[8vh]"
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-dark" />
        </svg>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="mb-4 md:mb-5 text-center">
          <div className="team-header opacity-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display mb-2 text-dark leading-none tracking-tight">
              {isArabic ? (
                <><span className="text-primary [font-size:inherit] [line-height:inherit]">الفريق</span>{" "}الأساسي</>
              ) : (
                <>Core{" "}<span className="text-primary [font-size:inherit] [line-height:inherit]">Team</span></>
              )}
            </h2>
            <p className="text-[1.02rem] md:text-[1.32rem] font-medium text-dark/82 max-w-3xl mx-auto">
              {isArabic ? 'أعضاء موهوبون ومنضبطون ومتفانون.' : 'Much talented, disciplined and dedicated members.'}
            </p>
          </div>
        </div>

        <div className="team-members-container flex flex-col mt-16 md:mt-20">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="team-member-row opacity-0 group relative border-t border-dark/10 py-[1.2rem] md:py-[1.45rem] hover:px-3 transition-all duration-300 cursor-pointer overflow-visible"
              onMouseEnter={() => setHoveredMember(index)}
              onMouseLeave={() => setHoveredMember(null)}
              onClick={() => setSelectedMember(member)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setSelectedMember(member)
                }
              }}
            >
              <div className="flex items-center gap-4 md:gap-6">
                <div className="relative z-10 text-dark group-hover:text-primary transition-colors duration-300 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[clamp(1.5rem,4vw,2.45rem)] font-display font-bold uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-500 ease-out leading-[0.95]">
                      {isArabic && member.nameAr ? member.nameAr : member.name}
                    </h3>
                    {member.linkedin && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-primary/80 bg-primary/10 px-2.5 py-0.5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        {isArabic ? 'عرض الملف' : 'View Profile'}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 md:mt-3 flex flex-col gap-1.5">
                    <div className="inline-flex items-center gap-2.5 w-fit">
                      <span className="text-[13px] md:text-[1rem] font-mono uppercase tracking-[0.18em] opacity-85 group-hover:opacity-100">
                        {isArabic && member.roleAr ? member.roleAr : member.role}
                      </span>
                      <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1.5 group-hover:-translate-y-1.5 block" />
                    </div>
                    <span className={`text-[12px] md:text-[13px] font-light opacity-78 group-hover:opacity-96 transition-opacity duration-300 max-w-[42rem] ${isArabic ? 'text-right' : 'text-left'} block leading-snug`}>
                      {isArabic && member.roleDescriptionAr ? member.roleDescriptionAr : member.roleDescription}
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Hover Floating Preview - commented out for now
              <AnimatePresence>
                {hoveredMember === index && (
                  <motion.div
                    className="hidden lg:flex flex-col items-center justify-center absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 w-[190px] xl:w-[210px] h-[230px] xl:h-[260px] pointer-events-none z-20 overflow-hidden shadow-2xl bg-white border border-dark/10 rounded-2xl p-6"
                    initial={{
                      opacity: 0,
                      scale: 0.92,
                      y: "-45%",
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: "-50%",
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.92,
                      y: "-45%",
                      transition: { duration: 0.2, ease: "easeInOut" }
                    }}
                  >
                    <div className="w-28 h-28 xl:w-32 xl:h-32 rounded-full border border-dark/10 bg-[#f8f7f4] p-2 shadow-inner flex items-center justify-center">
                      <motion.img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-contain"
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1, transition: { duration: 0.35, ease: "easeOut" } }}
                      />
                    </div>
                    <span className="mt-4 text-xs font-mono uppercase tracking-wider text-dark/70 font-semibold">
                      {isArabic ? 'انقر لعرض الملف' : 'Click to view'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              */}
            </div>
          ))}
          <div className="border-t border-dark/10" />
        </div>
      </div>

      {/* Member Details Popup Modal - portalled to document.body */}
      <TeamMemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        isRTL={isRTL}
        isArabic={isArabic}
      />
    </section>
  )
}

function TeamMemberModal({
  member,
  onClose,
  isRTL,
  isArabic,
}: {
  member: TeamMember | null
  onClose: () => void
  isRTL: boolean
  isArabic: boolean
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted || !member) return null

  return createPortal(
    <AnimatePresence>
      {member && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-md"
          style={{ zIndex: 99999 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? 'rtl' : 'ltr'}
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-dark/10 overflow-hidden"
          >
            {/* Subtle accent backdrop */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label={isArabic ? 'إغلاق' : 'Close modal'}
              className="absolute top-5 right-5 p-2 rounded-full text-dark/50 hover:text-dark hover:bg-dark/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Identity */}
            <div className="flex flex-col items-center text-center mt-2">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-dark uppercase tracking-tight">
                {isArabic && member.nameAr ? member.nameAr : member.name}
              </h3>

              <span className="mt-1.5 inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-primary/10 text-primary font-semibold">
                {isArabic && member.roleAr ? member.roleAr : member.role}
              </span>

              {/* Profession / Headline from LinkedIn */}
              <div className="w-full mt-5 pt-5 border-t border-dark/10">
                <h4 className="text-xs font-mono uppercase tracking-wider text-dark/50 mb-1.5">
                  {isArabic ? 'المسمى المهني' : 'Profession & Role'}
                </h4>
                <p className="text-sm md:text-base font-semibold text-dark/90 leading-snug">
                  {isArabic && member.professionAr ? member.professionAr : member.profession}
                </p>
              </div>

              {/* 1-Line Description */}
              <div className="w-full mt-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-dark/50 mb-1.5">
                  {isArabic ? 'نبذة' : 'About'}
                </h4>
                <p className="text-sm text-dark/70 leading-relaxed">
                  {isArabic && member.bioAr ? member.bioAr : member.bio}
                </p>
              </div>

              {/* CTA: Visit LinkedIn */}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.67 1.67 0 1 0 0-3.34 1.67 1.67 0 0 0 0 3.34M7.86 18.5V10.13H5.07V18.5h2.79z" />
                  </svg>
                  <span>{isArabic ? 'زيارة لينكد إن' : 'Visit LinkedIn'}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
