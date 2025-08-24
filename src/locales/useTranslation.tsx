import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_LANGUAGE, LOCAL_STORAGE_LANGUAGE_KEY, SUPPORTED_LANGUAGES } from '../constants/constants';

type LocaleData = Record<string, string>;

interface TranslationContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextProps>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (key) => key,
});

const loadLocale = async (lang: string): Promise<LocaleData> => {
  switch (lang) {
    case 'en':
      return (await import('./en/common.json')).default;
    case 'vi':
      return (await import('./vi/common.json')).default;
    default:
      return (await import('./vi/common.json')).default;
  }
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [locale, setLocale] = useState<LocaleData>({});

  useEffect(() => {
    const storedLang = localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY);
    const lang = SUPPORTED_LANGUAGES.includes(storedLang as string) ? storedLang as string : DEFAULT_LANGUAGE;
    setLanguageState(lang);
    loadLocale(lang).then(setLocale);
  }, []);

  const setLanguage = (lang: string) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) return;
    setLanguageState(lang);
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, lang);
    loadLocale(lang).then(setLocale);
  };

  const t = (key: string) => locale[key] || key;

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);