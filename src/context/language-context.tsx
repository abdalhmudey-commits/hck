'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { translations } from '@/lib/i18n';
import { SUPPORTED_LANGUAGES, type Language } from '@/lib/constants';

interface LanguageContextType {
  language: Language;
  setLanguage: (langCode: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedLangCode, setStoredLangCode] = useLocalStorage<string>('language', 'en');
  const [language, setLanguageState] = useState<Language>(
    SUPPORTED_LANGUAGES.find(l => l.code === storedLangCode) || SUPPORTED_LANGUAGES[0]
  );

  useEffect(() => {
    const selectedLang = SUPPORTED_LANGUAGES.find(l => l.code === storedLangCode) || SUPPORTED_LANGUAGES[0];
    setLanguageState(selectedLang);
    document.documentElement.lang = selectedLang.code;
    document.documentElement.dir = selectedLang.dir;
  }, [storedLangCode]);

  const setLanguage = (langCode: string) => {
    setStoredLangCode(langCode);
  };

  const t = useCallback((key: string): string => {
    return translations[language.code]?.[key] || translations['en']?.[key] || key;
  }, [language.code]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
