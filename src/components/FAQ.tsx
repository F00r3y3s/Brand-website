'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

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
    const FAQS = language === 'en' ? FAQS_EN : FAQS_AR

    return (
        <section id="faq" className="py-32 bg-[#F3F2EF]">
            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-24 text-center">
                    <span className="text-sm font-mono uppercase tracking-widest text-dark/40 mb-4 block">
                        {language === 'en' ? 'F.A.Q' : 'الأسئلة الشائعة'}
                    </span>
                    <h2 className="text-5xl md:text-7xl font-display mb-8 text-dark">
                        {language === 'en' ? (
                            <>Common <span className="text-primary italic">Inquiries</span></>
                        ) : (
                            <>الاستفسارات <span className="text-primary italic">الشائعة</span></>
                        )}
                    </h2>
                </div>

                <div className="flex flex-col">
                    {FAQS.map((faq, index) => (
                        <div key={index} className="border-b border-dark/10 last:border-none">
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full py-12 flex items-center justify-between group text-left"
                            >
                                <span className={`text-2xl md:text-3xl font-display transition-colors duration-300 ${activeIndex === index ? 'text-primary' : 'text-dark group-hover:text-primary/70'}`}>
                                    {faq.question}
                                </span>
                                <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-4 ${activeIndex === index ? 'bg-primary border-primary text-white' : 'border-dark/20 text-dark group-hover:border-primary group-hover:text-primary'}`}>
                                    {activeIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
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
                                        <div className="pb-12 text-xl text-dark/60 leading-relaxed font-light max-w-3xl">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className="mt-24 p-12 bg-dark rounded-[2rem] text-center relative z-20">
                    <h3 className="text-2xl text-white font-display mb-4">
                        {language === 'en' ? 'Still have questions?' : 'لا تزال لديكم أسئلة؟'}
                    </h3>
                    <p className="text-white/60 mb-8">
                        {language === 'en'
                            ? "We're here to help you navigate your sustainability journey."
                            : 'نحن هنا لمساعدتكم في مسيرة الاستدامة الخاصة بكم.'}
                    </p>
                    <button className="inline-flex items-center gap-2 text-primary hover:gap-4 transition-all duration-300">
                        {language === 'en' ? 'Contact Support' : 'تواصل مع فريق الدعم'} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    )
}
