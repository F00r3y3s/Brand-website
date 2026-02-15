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
            gsap.fromTo('.who-title', {
                y: 24,
                opacity: 0,
                filter: 'blur(6px)',
            }, {
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
                duration: 0.85,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 82%',
                },
            })

            // Cards Reveal
            gsap.fromTo('.mission-card', {
                y: 44,
                opacity: 0,
                scale: 0.98,
                filter: 'blur(6px)',
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.95,
                ease: 'power3.out',
                stagger: 0.14,
                scrollTrigger: {
                    trigger: '.mission-grid',
                    start: 'top 78%',
                },
            })

            gsap.fromTo('.who-main-logo', {
                y: 20,
                opacity: 0,
                scale: 0.96,
                filter: 'blur(4px)',
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.who-main-card',
                    start: 'top 76%',
                },
            })

            gsap.fromTo('.who-main-copy', {
                y: 24,
                opacity: 0,
                filter: 'blur(4px)',
            }, {
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
                duration: 0.85,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.who-main-card',
                    start: 'top 74%',
                },
            })

            gsap.fromTo('.who-founder-row', {
                y: 16,
                opacity: 0,
            }, {
                y: 0,
                opacity: 1,
                duration: 0.75,
                delay: 0.05,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.who-main-card',
                    start: 'top 72%',
                },
            })

            gsap.utils.toArray<HTMLElement>('.who-subcard').forEach((card) => {
                const title = card.querySelector('.who-subcard-title');
                const copy = card.querySelector('.who-subcard-copy');
                if (!title || !copy) return;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 82%',
                    },
                });

                tl.fromTo(title, {
                    y: 20,
                    opacity: 0,
                    filter: 'blur(4px)',
                }, {
                    y: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 0.6,
                    ease: 'power3.out',
                }).fromTo(copy, {
                    y: 16,
                    opacity: 0,
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.65,
                    ease: 'power2.out',
                }, '-=0.25');
            });
        }, containerRef)

        return () => ctx.revert()
    }, [language])

    return (
        <section id="who-we-are" ref={containerRef} className="pt-14 pb-24 lg:pt-[4.5rem] lg:pb-[7rem] bg-[#F3F2EF] relative overflow-hidden">
            <div className="max-w-[92vw] xl:max-w-[86rem] mx-auto">
                <div className="mb-5 lg:mb-6">
                    <h2 className="who-title text-[clamp(1.8rem,4vw,3rem)] font-display font-black uppercase tracking-[0.08em] text-dark/90 leading-none drop-shadow-[0_1px_0_rgba(255,255,255,0.7)]">
                        {language === 'en' ? 'WHO WE ARE' : 'من نحن'}
                    </h2>
                </div>

                <div className="mission-grid flex flex-col gap-6 lg:gap-7 max-w-full lg:-translate-y-2 pb-4 lg:pb-8">
                    <div className="mission-card who-main-card w-full p-6 md:p-8 lg:p-10 rounded-[2.5rem] bg-white shadow-xl relative overflow-hidden max-w-full">
                        <div className="relative z-10">
                            <img
                                src="/ainar-logo-transparent.png"
                                alt="AINAR Logo"
                                className="who-main-logo w-[115px] md:w-[155px] lg:w-[185px] h-auto mb-5 md:mb-6"
                            />
                            <p className="who-main-copy text-lg md:text-2xl lg:text-[1.8rem] text-dark/85 leading-[1.25] max-w-4xl">
                                {MANIFESTO.join(' ')}
                            </p>
                            <div className="who-founder-row mt-6 md:mt-10 flex flex-wrap items-center gap-4">
                                <div className="h-[1px] w-16 bg-dark/35" />
                                <a
                                    href="https://www.linkedin.com/in/meryemhamidi/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full border border-dark/15 bg-gradient-to-b from-white to-[#eae7e1] px-4 py-2 text-base md:text-lg font-semibold italic text-dark/90 font-serif shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_14px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-[1px] hover:bg-gradient-to-b hover:from-white hover:to-[#e4e0d8] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_18px_rgba(0,0,0,0.18)]"
                                >
                                    {language === 'en' ? 'Founded by Dr. Meryem Hamidi' : 'تأسست بواسطة د. مريم حميدي'}
                                </a>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-7 max-w-full">
                        <div className="mission-card who-subcard p-6 md:p-10 lg:p-12 rounded-[2.5rem] bg-white shadow-xl relative overflow-hidden max-w-full">
                            <div className="relative z-10">
                                <h3 className="who-subcard-title text-4xl font-display mb-6 text-dark">
                                    {language === 'en' ? "AINAR's Vision" : 'رؤية اينار'}
                                </h3>
                                <p className="who-subcard-copy text-xl text-dark/65 leading-relaxed max-w-2xl">
                                    {language === 'en'
                                        ? 'To become a global leader in empowering communities to transform the challenges of today into solutions for tomorrow by harnessing AI and sustainable innovation.'
                                        : 'أن نصبح رائدين عالميين في تمكين المجتمعات لتحويل تحديات اليوم إلى حلول الغد من خلال تسخير الذكاء الاصطناعي والابتكار المستدام.'}
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
                        </div>

                        <div className="mission-card who-subcard p-6 md:p-10 lg:p-12 rounded-[2.5rem] bg-dark text-light shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="who-subcard-title text-4xl font-display mb-6 italic text-secondary">
                                    {language === 'en' ? "AINAR's Mission" : 'مهمة اينار'}
                                </h3>
                                <p className="who-subcard-copy text-xl text-white/75 leading-relaxed">
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
