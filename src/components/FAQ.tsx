'use client'

import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FAQS_EN = [
    {
        question: "What industries does AINAR specialize in?",
        answer: "We specialize in high-impact sectors including Renewable Energy, Sustainable Smart Cities, AI-Driven Manufacturing, and Green E-Commerce. Our approach is tailored to the unique regulatory and cultural landscape of the UAE and global markets."
    },
    {
        question: "How does the AI-powered sustainability app work?",
        answer: "Our app uses advanced machine learning to analyze user behaviors and environmental impact in real-time. It provides actionable insights, rewards green choices, and fosters a community of impact through innovative gamification and verified sustainability metrics."
    },
    {
        question: "Do you offer custom software development for startups?",
        answer: "Yes, we partner with startups and established enterprises to design and build scalable, future-proof software ecosystems. From MVP development to enterprise-level AI integration, we ensure your tech is as sustainable as your vision."
    },
    {
        question: "How can we start a partnership with AINAR?",
        answer: "You can reach out through our contact form or book a discovery call. We typically start with an innovation audit to identify how AI and sustainable practices can drive growth for your specific business model."
    }
]

const FAQS_AR = [
    {
        question: "ما القطاعات التي تتخصص فيها اينار؟",
        answer: "نتخصص في القطاعات ذات التأثير العالي بما في ذلك الطاقة المتجددة والمدن الذكية المستدامة والتصنيع المدعوم بالذكاء الاصطناعي والتجارة الإلكترونية الخضراء. يتم تصميم نهجنا وفقاً للمشهد التنظيمي والثقافي الفريد لدولة الإمارات العربية المتحدة والأسواق العالمية."
    },
    {
        question: "كيف يعمل تطبيق الاستدامة المدعوم بالذكاء الاصطناعي؟",
        answer: "يستخدم تطبيقنا التعلم الآلي المتقدم لتحليل سلوكيات المستخدم والأثر البيئي في الوقت الفعلي. يوفر رؤى قابلة للتنفيذ ويكافئ الخيارات الخضراء ويعزز مجتمع التأثير من خلال أساليب التلعيب المبتكرة ومقاييس الاستدامة المعتمدة."
    },
    {
        question: "هل تقدمون خدمات تطوير البرمجيات المخصصة للشركات الناشئة؟",
        answer: "نعم، نتشارك مع الشركات الناشئة والمؤسسات الراسخة لتصميم وبناء أنظمة برمجية قابلة للتوسع ومقاومة للتقادم. من تطوير المنتج الأولي إلى تكامل الذكاء الاصطناعي على مستوى المؤسسات."
    },
    {
        question: "كيف يمكننا بدء شراكة مع اينار؟",
        answer: "يمكنكم التواصل من خلال نموذج الاتصال الخاص بنا أو حجز مكالمة استكشافية. نبدأ عادةً بتدقيق الابتكار لتحديد كيف يمكن للذكاء الاصطناعي والممارسات المستدامة تعزيز نمو نموذج أعمالكم."
    }
]


export default function FAQ() {
    const { language } = useLanguage()
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const ctaMediaRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const videoLoopCountRef = useRef(0)
    const sectionRef = useRef<HTMLElement>(null)

    const handleVideoEnded = () => {
        if (videoLoopCountRef.current < 2) {
            videoLoopCountRef.current += 1
            if (videoRef.current) {
                videoRef.current.currentTime = 0
                videoRef.current.play()
            }
        }
    }

    // Use IntersectionObserver to play video when sticky section is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Play if it's not already playing or finished
                    if (videoRef.current) {
                        videoRef.current.play().catch(() => { })
                    }
                } else {
                    // Reset loop count and pause when out of view so it plays again on re-entry
                    if (videoRef.current) {
                        videoRef.current.pause()
                        videoRef.current.currentTime = 0
                    }
                    videoLoopCountRef.current = 0
                }
            },
            { threshold: 0.1 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const FAQS = language === 'en' ? FAQS_EN : FAQS_AR
    const isArabic = language === 'ar'


    return (
        <section ref={sectionRef} id="faq" className="relative min-h-[300vh] bg-[#F3F2EF]">
            <div className="sticky top-0 h-screen flex items-start pt-[9vh] md:pt-[11vh] overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
                    <div className="mb-8 md:mb-10 text-center">
                        <span className="inline-flex items-center justify-center px-4 md:px-5 py-1.5 rounded-full border border-primary/45 bg-primary/10 text-primary text-[0.76rem] md:text-[0.93rem] font-mono font-black uppercase tracking-[0.28em] shadow-[0_8px_22px_rgba(18,131,145,0.18)] mb-4 md:mb-5">
                            {language === 'en' ? 'F.A.Q' : 'الأسئلة الشائعة'}
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display mb-4 text-dark leading-none">
                            {language === 'en' ? (
                                <>Common <span className="text-primary italic [font-size:inherit] [line-height:inherit]">Inquiries</span></>
                            ) : (
                                <>الاستفسارات <span className="text-primary italic [font-size:inherit] [line-height:inherit]">الشائعة</span></>
                            )}
                        </h2>
                    </div>

                    <div className="flex flex-col max-h-[41vh] md:max-h-[43vh] overflow-y-auto pr-1">
                        {FAQS.map((faq, index) => (
                            <div key={index} className="border-b border-dark/10 last:border-none">
                                <button
                                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                    className="w-full py-3 md:py-4 flex items-center justify-between group text-left"
                                >
                                    <span className={`text-base md:text-xl lg:text-2xl font-display transition-colors duration-300 ${activeIndex === index ? 'text-primary' : 'text-dark group-hover:text-primary/70'}`}>
                                        {faq.question}
                                    </span>
                                    <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-4 ${activeIndex === index ? 'bg-primary border-primary text-white' : 'border-dark/20 text-dark group-hover:border-primary group-hover:text-primary'}`}>
                                        {activeIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {activeIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-4 md:pb-5 text-sm md:text-base text-dark/60 leading-relaxed font-light max-w-3xl">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    <div className="relative mt-8 md:mt-10 -mx-8 md:-mx-14 lg:-mx-20 px-8 md:px-12 py-5 md:py-7 bg-dark rounded-[1.6rem] z-20 border border-white/12 shadow-[0_22px_48px_rgba(1,7,18,0.45)] overflow-hidden">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_88%_24%,rgba(25,181,196,0.14),transparent_70%),linear-gradient(140deg,rgba(2,8,24,0.12),rgba(2,8,24,0.36))]" />

                        <div className={`relative z-10 flex flex-col lg:flex-row items-stretch justify-between gap-6 md:gap-8 min-h-[170px] md:min-h-[190px] ${isArabic ? 'lg:flex-row-reverse' : ''}`}>
                            <div className={`flex-1 ${isArabic ? 'text-right items-end lg:pr-1' : 'text-left items-start lg:pl-1'} flex flex-col justify-center`}>
                                <h3 className="text-[1.5rem] md:text-[1.9rem] text-white font-display mb-2 leading-tight">
                                    {language === 'en' ? 'Still have questions?' : 'لا تزال لديكم أسئلة؟'}
                                </h3>
                                <p className="text-white/78 mb-4 text-sm md:text-base max-w-[48ch]">
                                    {language === 'en'
                                        ? "We're here to help you navigate your sustainability journey."
                                        : 'نحن هنا لمساعدتكم في مسيرة الاستدامة الخاصة بكم.'}
                                </p>
                                <button className={`group inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-full bg-white text-dark font-semibold border border-white shadow-[0_10px_28px_rgba(0,0,0,0.28)] hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 ${isArabic ? 'self-end' : 'self-start'}`}>
                                    {language === 'en' ? 'Contact Support' : 'تواصل مع فريق الدعم'}
                                    <motion.span
                                        animate={{ x: [0, 8, 0], scale: [1, 1.1, 1] }}
                                        transition={{ duration: 0.95, repeat: Infinity, ease: 'easeInOut' }}
                                        className="inline-flex"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.span>
                                </button>
                            </div>

                            <div ref={ctaMediaRef} className="w-full lg:w-[360px] shrink-0 lg:self-stretch">
                                <div className="h-full min-h-[160px] md:min-h-[180px] rounded-2xl border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.97),rgba(242,247,255,0.92))] shadow-[0_12px_28px_rgba(2,10,24,0.35)] overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        src="/FAQ Avatar.webm"
                                        className="w-full h-full object-cover scale-[1.12]"
                                        muted
                                        playsInline
                                        onEnded={handleVideoEnded}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
