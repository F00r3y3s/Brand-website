'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Download, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PartnerAnnouncementModal() {
  const { language, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const isArabic = language === 'ar';

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('ainar_wuc_partner_dismissed_v2');
    if (hasSeen) return;
    // Show 2 seconds after load
    const timer = setTimeout(() => setIsOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('ainar_wuc_partner_dismissed_v2', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Centered Modal Card matching the official WUC popup design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative z-10 w-full max-w-[440px] sm:max-w-[480px] bg-white rounded-3xl p-3 sm:p-4 shadow-[0_25px_80px_rgba(0,0,0,0.6)] overflow-visible"
            role="dialog"
            aria-modal="true"
            aria-label={isArabic ? 'إعلان شراكة استراتيجية' : 'Strategic Partnership Announcement'}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Top-Right Circular Teal Close Button (Matching Partner Site) */}
            <button
              onClick={handleClose}
              className={`absolute -top-3.5 ${isArabic ? '-left-3.5' : '-right-3.5'} z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#00A88F] hover:bg-[#008f7a] text-white flex items-center justify-center shadow-lg border-2 border-white transition-all duration-200 hover:scale-110 active:scale-95`}
              aria-label={isArabic ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Official Partnership Ribbon */}
            <div className="flex items-center justify-between px-2 pt-1 pb-2.5 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-800 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#00A88F] animate-pulse" />
                <span className="font-display">AINAR</span>
                <span className="text-neutral-400">×</span>
                <span className="text-neutral-900 font-display">World Utilities Congress</span>
              </div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#006BB6] bg-[#006BB6]/10 px-2 py-0.5 rounded-full">
                {isArabic ? 'شريك رسمي' : 'Official Partner'}
              </span>
            </div>

            {/* Partner Brochure Artwork (Official WUC Popup Asset) */}
            <a
              href="https://worldutilitiescongress.com/forms/download-event-brochure/"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative rounded-2xl overflow-hidden group shadow-inner border border-neutral-100"
            >
              <img
                src="/partners/eb-popup-2027.png"
                alt="World Utilities Congress 2027 Brochure - 25-27 May 2027 Abu Dhabi"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
            </a>

            {/* Partnership Description */}
            <div className="mt-3 px-1.5 text-center">
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                {isArabic
                  ? 'تفخر اينار بكونها شريكاً استراتيجياً رسمياً للمؤتمر العالمي للمرافق في أبوظبي.'
                  : 'AINAR is proud to be an Official Strategic Partner of the World Utilities Congress 2027 in Abu Dhabi.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center gap-2">
              <a
                href="https://worldutilitiescongress.com/forms/download-event-brochure/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#006BB6] to-[#0091DA] hover:from-[#005a99] hover:to-[#007fbf] text-white text-xs sm:text-sm font-semibold shadow-[0_4px_16px_rgba(0,107,182,0.35)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              >
                <Download className="w-4 h-4" />
                <span>{isArabic ? 'تحميل كتيب المؤتمر' : 'Download Event Brochure'}</span>
              </a>

              <button
                onClick={handleClose}
                className="py-3 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs sm:text-sm font-medium transition-colors"
              >
                {isArabic ? 'متابعة التصفح' : 'Continue to Site'}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
