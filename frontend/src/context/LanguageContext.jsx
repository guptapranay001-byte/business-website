import React, { useState, useEffect } from 'react';
import { LanguageContext } from './LanguageContextDef';
import { TRANSLATIONS } from '../data/translations';

const LANGUAGE_STORAGE_KEY = 'vinay_agri_lang_v1';

export default function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      return stored === 'hi' ? 'hi' : 'en';
    } catch (e) {
      console.warn('Could not read language from localStorage:', e);
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      document.documentElement.lang = language;
    } catch (e) {
      console.warn('Could not persist language to localStorage:', e);
    }
  }, [language]);

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'hi') {
      setLanguageState(lang);
    }
  };

  const t = (key, fallback = '', params = {}) => {
    let str = TRANSLATIONS[language]?.[key] ?? fallback ?? key;
    if (params && typeof str === 'string') {
      Object.keys(params).forEach((paramKey) => {
        str = str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
      });
    }
    return str;
  };

  const languages = [
    { code: 'en', label: language === 'hi' ? 'अंग्रेज़ी' : 'English' },
    { code: 'hi', label: 'हिन्दी' }
  ];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}
