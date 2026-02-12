'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

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

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with 'en' as default to prevent hydration mismatch
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Get language from localStorage or use browser default
    const savedLanguage = localStorage.getItem('language') as Language | null;
    const browserLanguage = navigator.language.startsWith('ar') ? 'ar' : 'en';
    const initialLanguage = savedLanguage || browserLanguage;

    // Update state with localStorage value
    if (initialLanguage !== language) {
      setLanguageState(initialLanguage);
    }

    // Update document attributes
    document.documentElement.dir = initialLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = initialLanguage;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
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
