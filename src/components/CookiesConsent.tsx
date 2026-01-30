'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { X } from 'lucide-react';

export default function CookiesConsent() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookies-consent');
    if (!cookiesAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookies-consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookies-consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="bg-dark-secondary/95 dark:bg-dark-primary/95 backdrop-blur-md border border-gold/20 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-white mb-2">
                {language === 'en' ? 'Cookies' : 'الكوكيز'}
              </h3>
              <p className="text-light-tertiary/80 text-sm leading-relaxed">
                {language === 'en'
                  ? "We use cookies to enhance your experience, analyze site traffic, and enable personalized features. By clicking 'Accept All', you consent to our use of cookies."
                  : "نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل حركة الموقع وتفعيل الميزات الشخصية. بالنقر على 'قبول الكل'، فإنك توافق على استخدامنا للكوكيز."}
              </p>
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="text-light-tertiary/60 hover:text-light-tertiary transition-colors"
              aria-label="Close cookies banner"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleAccept}
              className="flex-1 px-6 py-3 bg-gold hover:bg-sand text-dark-primary font-semibold rounded-lg transition-colors duration-300"
            >
              {language === 'en' ? 'Accept All' : 'قبول الكل'}
            </button>
            <button
              onClick={handleReject}
              className="flex-1 px-6 py-3 border border-gold/50 text-gold hover:bg-gold/10 font-semibold rounded-lg transition-colors duration-300"
            >
              {language === 'en' ? 'Reject' : 'رفض'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
