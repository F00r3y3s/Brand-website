'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';
const LANGUAGE_TOGGLE_ENABLED = true;
const FORCED_LANGUAGE: Language = 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string, lang?: Language) => string;
}

// Default context value
const defaultLanguageContext: LanguageContextType = {
  language: 'en',
  setLanguage: () => { },
  isRTL: false,
  t: (key: string) => key,
};

const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext);

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAge = 31536000) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getInitialLanguage = (): Language => {
    if (!LANGUAGE_TOGGLE_ENABLED) return FORCED_LANGUAGE;
    if (typeof window === 'undefined') return FORCED_LANGUAGE;

    // Priority: cookie → localStorage → browser language
    const cookieLang = getCookie('language') as Language | null;
    if (cookieLang === 'en' || cookieLang === 'ar') return cookieLang;

    const savedLanguage = window.localStorage.getItem('language') as Language | null;
    if (savedLanguage === 'en' || savedLanguage === 'ar') return savedLanguage;

    const browserLanguage = window.navigator.language.startsWith('ar') ? 'ar' : 'en';
    return browserLanguage;
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    const activeLanguage = LANGUAGE_TOGGLE_ENABLED ? language : FORCED_LANGUAGE;
    localStorage.setItem('language', activeLanguage);
    setCookie('language', activeLanguage);
    document.documentElement.dir = activeLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = activeLanguage;
  }, [language]);

  const setLanguage = (lang: Language) => {
    if (!LANGUAGE_TOGGLE_ENABLED) {
      return;
    }

    setLanguageState(lang);
    localStorage.setItem('language', lang);
    setCookie('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const isRTL = language === 'ar';

  // Translation dictionary — UAE MSA Arabic standard
  // (matches register used on uae.gov.ae, tamm.abudhabi, etc.)
  const translations: Record<string, Record<Language, string>> = {
    // Navigation
    'nav.home': { en: 'Home', ar: 'الرئيسية' },
    'nav.about': { en: 'About', ar: 'نبذة عنا' },
    'nav.services': { en: 'Services', ar: 'الخدمات' },
    'nav.portfolio': { en: 'Portfolio', ar: 'المشاريع' },
    'nav.projects': { en: 'Projects', ar: 'المشاريع' },
    'nav.team': { en: 'Team', ar: 'الفريق' },
    'nav.contact': { en: 'Contact', ar: 'تواصل معنا' },
    'nav.faq': { en: 'FAQ', ar: 'الأسئلة الشائعة' },

    // Brand
    'brand.name': { en: 'AINAR', ar: 'اينار' },
    'brand.tagline': { en: 'Sustainability in Our Roots. Intelligence for Our Future.', ar: 'الاستدامة في جذورنا. الذكاء لمستقبلنا.' },

    // Hero
    'hero.line1': { en: 'Sustainability', ar: 'الاستدامة' },
    'hero.line2': { en: 'in Our Roots.', ar: 'في جذورنا.' },
    'hero.line3': { en: 'Intelligence', ar: 'الذكاء' },
    'hero.line4': { en: 'for Our Future.', ar: 'لمستقبلنا.' },
    'hero.subtitle': { en: 'AI-powered sustainability solutions and app that reward green behavior and drive real impact.', ar: 'حلول استدامة مدعومة بالذكاء الاصطناعي وتطبيق يكافئ السلوك الأخضر ويحقق تأثيراً حقيقياً.' },
    'hero.cta': { en: 'Start Your Journey', ar: 'ابدأ رحلتك' },
    'hero.scroll': { en: 'Scroll', ar: 'تمرير' },

    // Footer  
    'footer.copyright': {
      en: '© 2025 AINAR (FZE). All Rights Reserved.',
      ar: '© 2025 اينار. جميع الحقوق محفوظة.'
    },
    'footer.newsletter.title': { en: 'Join the Movement', ar: 'انضم إلى الحركة' },
    'footer.newsletter.subtitle': { en: 'Subscribe to our newsletter for the latest updates on AI, sustainability, and green tech.', ar: 'اشترك في نشرتنا الإخبارية لأحدث التحديثات حول الذكاء الاصطناعي والاستدامة والتكنولوجيا الخضراء.' },
    'footer.newsletter.placeholder': { en: 'Enter your email', ar: 'أدخل بريدك الإلكتروني' },
    'footer.newsletter.subscribe': { en: 'Subscribe', ar: 'اشترك' },
    'footer.privacy': { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
    'footer.terms': { en: 'Terms of Service', ar: 'شروط الخدمة' },

    // General
    'general.open_for_projects': { en: 'Open for Projects', ar: 'متاح للمشاريع' },
    'general.get_in_touch': { en: 'Get in Touch', ar: 'تواصل معنا' },
    'general.email': { en: 'Email', ar: 'البريد الإلكتروني' },
    'general.phone': { en: 'Phone', ar: 'الهاتف' },
    'general.location': { en: 'Location', ar: 'الموقع' },
    'general.dubai_uae': { en: 'Dubai, UAE 🇦🇪', ar: 'دبي، الإمارات العربية المتحدة 🇦🇪' },

    // Modal (ServiceInquiryModal)
    'modal.contact_form': { en: 'Contact Form', ar: 'نموذج التواصل' },
    'modal.subtitle': { en: 'Tell us what you are building and we will follow up with a custom roadmap.', ar: 'أخبرنا بما تبنيه وسنتابع معك بخارطة طريق مخصصة.' },
    'modal.selected_service': { en: 'Selected Service', ar: 'الخدمة المختارة' },
    'modal.select_placeholder': { en: 'Select a service...', ar: 'اختر خدمة...' },
    'modal.name': { en: 'Name', ar: 'الاسم' },
    'modal.name_placeholder': { en: 'Your full name', ar: 'اسمك الكامل' },
    'modal.organization': { en: 'Organization', ar: 'المؤسسة' },
    'modal.organization_placeholder': { en: 'Organization name', ar: 'اسم المؤسسة' },
    'modal.email': { en: 'Email', ar: 'البريد الإلكتروني' },
    'modal.email_placeholder': { en: 'name@company.com', ar: 'name@company.com' },
    'modal.contact_number': { en: 'Contact Number', ar: 'رقم التواصل' },
    'modal.contact_number_placeholder': { en: '+971 50 123 4567', ar: '+971 50 123 4567' },
    'modal.linkedin': { en: 'LinkedIn', ar: 'لينكد إن' },
    'modal.linkedin_placeholder': { en: 'https://linkedin.com/in/yourprofile', ar: 'https://linkedin.com/in/yourprofile' },
    'modal.message': { en: 'Message', ar: 'الرسالة' },
    'modal.message_placeholder': { en: 'Tell us about your project goals, timeline, and what success looks like.', ar: 'أخبرنا عن أهداف مشروعك والجدول الزمني وما يعنيه النجاح بالنسبة لك.' },
    'modal.send': { en: 'Send', ar: 'إرسال' },
    'modal.sending': { en: 'Sending...', ar: 'جارٍ الإرسال...' },
    'modal.success_title': { en: 'Message Sent', ar: 'تم الإرسال' },
    'modal.success_body': { en: 'Thanks for reaching out. Our team will get back to you within 1 business day.', ar: 'شكرًا على تواصلكم. سيتواصل معكم فريقنا خلال يوم عمل واحد.' },
    'modal.error': { en: 'Something went wrong. Please try again.', ar: 'حدث خطأ. يرجى المحاولة مرة أخرى.' },
    'modal.general_inquiry': { en: 'General Inquiry', ar: 'استفسار عام' },
    'modal.other': { en: 'Other', ar: 'أخرى' },

    // Newsletter
    'newsletter.error': { en: 'Something went wrong. Please try again.', ar: 'حدث خطأ. يرجى المحاولة مرة أخرى.' },
  };

  const t = (key: string, lang?: Language): string => {
    const targetLang = lang || language;
    return translations[key]?.[targetLang] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    isRTL,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // This should never happen now, but keep the check for safety
    return defaultLanguageContext;
  }
  return context;
};
