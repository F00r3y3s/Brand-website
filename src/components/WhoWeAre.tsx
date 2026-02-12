'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '@/context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const MANIFESTO_EN = [
    "AINAR was founded to empower individuals",
    "and businesses by providing innovative,",
    "sustainable digital solutions.",
    "From AI-driven systems to research consultancy,",
    "we strive to inspire behavior change and foster growth."
]

const MANIFESTO_AR = [
    "تأسست اينار لتمكين الأفراد",
    "والشركات من خلال تقديم حلول رقمية",
    "مبتكرة ومستدامة.",
    "من الأنظمة المدعومة بالذكاء الاصطناعي إلى الاستشارات البحثية،",
    "نسعى لإلهام التغيير السلوكي وتعزيز النمو."
]

export default function WhoWeAre() {
    const { language } = useLanguage()
    const containerRef = useRef<HTMLDivElement>(null)

    const MANIFESTO = language === 'en' ? MANIFESTO_EN : MANIFESTO_AR

    useEffect(() => {
        if (!containerRef.current) return

        const ctx = gsap.context(() => {
            // Cards Reveal
            gsap.from('.mission-card', {
                y: 40,
                opacity: 0,
                duration: 0.9,
                ease: 'power3.out',
                stagger: 0.16,
                scrollTrigger: {
                    trigger: '.mission-grid',
                    start: 'top 78%',
                },
            })
        }, containerRef)

        return () => ctx.revert()
    }, [language])

    return (
        <section id="who-we-are" ref={containerRef} className="py-20 lg:py-24 bg-[#F3F2EF] relative overflow-hidden">
            <div className="max-w-[92vw] xl:max-w-[86rem] mx-auto">
                <div className="mb-8">
                    <span className="text-sm font-mono uppercase tracking-widest text-dark/40 mb-8 block">
                        {language === 'en' ? 'Who We Are' : 'من نحن'}
                    </span>
                </div>

                <div className="mission-grid flex flex-col gap-6 lg:gap-7">
                    <div className="mission-card w-full p-10 md:p-12 lg:p-14 rounded-[2.5rem] bg-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-xs md:text-sm uppercase tracking-[0.24em] text-dark/45 mb-4">
                                {language === 'en' ? 'Who We Are' : 'من نحن'}
                            </p>
                            <h3 className="text-4xl md:text-5xl font-display mb-6 text-dark">
                                {language === 'en' ? 'AINAR' : 'اينار'}
                            </h3>
                            <p className="text-2xl md:text-[2.1rem] text-dark/85 leading-[1.2] max-w-4xl">
                                {MANIFESTO.join(' ')}
                            </p>
                            <div className="mt-10 flex items-center gap-4">
                                <div className="h-[1px] w-20 bg-dark/20" />
                                <span className="text-lg italic text-dark/60 font-serif">
                                    {language === 'en' ? 'Founded by Dr. Meryem Hamidi' : 'تأسست بواسطة د. مريم حميدي'}
                                </span>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-7">
                        <div className="mission-card p-10 md:p-12 rounded-[2.5rem] bg-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-xs md:text-sm uppercase tracking-[0.24em] text-dark/45 mb-4">
                                    {language === 'en' ? 'Our Vision' : 'رؤيتنا'}
                                </p>
                                <h3 className="text-4xl font-display mb-6 text-dark">
                                    {language === 'en' ? 'Our Vision' : 'رؤيتنا'}
                                </h3>
                                <p className="text-xl text-dark/65 leading-relaxed max-w-2xl">
                                    {language === 'en'
                                        ? 'To become a global leader in empowering communities to transform the challenges of today into solutions for tomorrow by harnessing AI and sustainable innovation.'
                                        : 'أن نصبح رائدين عالميين في تمكين المجتمعات لتحويل تحديات اليوم إلى حلول الغد من خلال تسخير الذكاء الاصطناعي والابتكار المستدام.'}
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
                        </div>

                        <div className="mission-card p-10 md:p-12 rounded-[2.5rem] bg-dark text-light shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-xs md:text-sm uppercase tracking-[0.24em] text-light/50 mb-4">
                                    {language === 'en' ? 'Our Mission' : 'مهمتنا'}
                                </p>
                                <h3 className="text-4xl font-display mb-6 italic text-secondary">
                                    {language === 'en' ? 'Our Mission' : 'مهمتنا'}
                                </h3>
                                <p className="text-xl text-white/75 leading-relaxed">
                                    {language === 'en'
                                        ? 'Providing innovative, sustainable, and empowering solutions through AI and human-centered design.'
                                        : 'تقديم حلول مبتكرة ومستدامة وممكّنة من خلال الذكاء الاصطناعي والتصميم المتمحور حول الإنسان.'}
                                </p>
                            </div>
                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-secondary/20 blur-[50px] rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
