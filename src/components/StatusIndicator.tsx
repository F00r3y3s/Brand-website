'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

interface StatusIndicatorProps {
  className?: string;
}

export default function StatusIndicator({ className = '' }: StatusIndicatorProps) {
  const { language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`inline-flex items-center gap-3 px-4 py-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 ${className}`}
    >
      {/* Pulsing dot indicator */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-3 h-3 bg-accent-emerald rounded-full"
        />
        <div className="w-2 h-2 bg-accent-emerald rounded-full" />
      </div>

      {/* Status text */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <span className="text-sm font-bold text-foreground">
          {language === 'en' ? 'Open for Projects' : 'متاح للمشاريع'}
        </span>
        <span className="hidden sm:inline text-sm text-text-secondary">•</span>
        <span className="text-sm text-text-secondary">
          {language === 'en' ? 'Dubai, UAE' : 'دبي، الإمارات'}
        </span>
      </div>
    </motion.div>
  );
}
