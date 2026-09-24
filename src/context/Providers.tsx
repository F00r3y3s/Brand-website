'use client';

import React, { ReactNode } from 'react';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider } from './ThemeContext';

export function Providers({ children, initialLang }: { children: ReactNode, initialLang?: 'en' | 'ar' }) {
  return (
    <ThemeProvider>
      <LanguageProvider initialLang={initialLang}>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}
