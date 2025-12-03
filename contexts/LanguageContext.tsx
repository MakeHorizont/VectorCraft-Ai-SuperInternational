
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, LanguageCode, TranslationDictionary } from '../languages/index';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'vectorcraft_lang_v1';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Detect browser language or default to 'en', but prefer localStorage
  const getInitialLanguage = (): LanguageCode => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in translations) {
      return saved as LanguageCode;
    }

    const browserLang = navigator.language.split('-')[0];
    if (browserLang in translations) {
      return browserLang as LanguageCode;
    }
    return 'en';
  };

  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(getInitialLanguage);

  // Persistence effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentLanguage);
  }, [currentLanguage]);

  const value = {
    currentLanguage,
    setLanguage: setCurrentLanguage,
    t: translations[currentLanguage],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
