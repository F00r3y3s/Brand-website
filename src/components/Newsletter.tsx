'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Mail, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Newsletter() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 0.5,
        },
        opacity: 0,
        y: 50,
      });
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Basic email validation
    if (!email) {
      setError(language === 'en' ? 'Please enter your email' : 'يرجى إدخال بريدك الإلكتروني');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(language === 'en' ? 'Please enter a valid email' : 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'newsletter',
          data: { email }
        }),
      });

      if (!response.ok) throw new Error('Failed to subscribe');

      // Success
      setIsSubmitted(true);
      setEmail('');

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('Newsletter error:', err);
      setError(language === 'en' ? 'Something went wrong. Try again.' : 'حدث خطأ ما. حاول مرة أخرى.');
    }
  };

  return (
    <section
      id="newsletter"
      className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-light-secondary dark:bg-dark-secondary"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-accent-blue/5 to-accent-rose/10 dark:from-gold/20 dark:via-accent-blue/10 dark:to-accent-rose/20 pointer-events-none" />

      <div ref={containerRef} className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Content */}
        <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
          {language === 'en'
            ? 'Stay Updated'
            : 'ابقَ على اطلاع'}
        </h2>

        <p className="text-lg text-text-secondary dark:text-text-tertiary mb-8">
          {language === 'en'
            ? 'Subscribe to our newsletter for insights on AI, sustainability, and digital transformation.'
            : 'اشترك في نشرتنا الإخبارية للحصول على رؤى حول الذكاء الاصطناعي والاستدامة والتحول الرقمي.'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold pointer-events-none" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder={language === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-light-primary dark:bg-dark-tertiary border-2 border-gold/20 focus:border-gold/50 text-text-primary dark:text-light-primary placeholder:text-text-tertiary dark:placeholder:text-text-secondary transition-all duration-300 outline-none"
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 text-left">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitted}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${isSubmitted
                  ? 'bg-accent-emerald text-white'
                  : 'bg-gold hover:bg-sand text-dark-primary'
                }`}
            >
              {isSubmitted ? (
                <>
                  <CheckCircle size={20} />
                  {language === 'en' ? 'Subscribed!' : 'تم الاشتراك!'}
                </>
              ) : (
                language === 'en' ? 'Subscribe' : 'اشترك'
              )}
            </button>
          </div>

          {/* Privacy notice */}
          <p className="text-xs text-text-tertiary dark:text-text-secondary mt-4">
            {language === 'en'
              ? "We respect your privacy. Unsubscribe at any time."
              : "نحترم خصوصيتك. إلغاء الاشتراك في أي وقت."}
          </p>
        </form>
      </div>
    </section>
  );
}
