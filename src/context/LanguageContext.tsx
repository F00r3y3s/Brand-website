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
  setLanguage: () => {},
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

  // Translation dictionary - expandable
  const translations: Record<string, Record<Language, string>> = {
    'nav.home': { en: 'Home', ar: 'الرئيسية' },
    'nav.services': { en: 'Services', ar: 'الخدمات' },
    'nav.portfolio': { en: 'Portfolio', ar: 'المشاريع' },
    'nav.team': { en: 'Team', ar: 'الفريق' },
    'nav.about': { en: 'About', ar: 'عن' },
    'nav.contact': { en: 'Contact', ar: 'اتصل بنا' },
    'footer.copyright': { 
      en: '© 2024 AInar. All rights reserved.', 
      ar: '© 2024 أينار. جميع الحقوق محفوظة.' 
    },
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
