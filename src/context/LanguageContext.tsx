import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languagesData: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [languagesData, setLanguagesData] = useState<any>(null);

  useEffect(() => {
    // Detect system language or saved preference
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang === 'en' || savedLang === 'pt') {
      setLanguageState(savedLang);
    } else {
      const systemLang = navigator.language.slice(0, 2);
      if (systemLang === 'pt') {
        setLanguageState('pt');
      } else {
        setLanguageState('en');
      }
    }

    // Fetch languages.json
    fetch('/languages.json')
      .then((res) => res.json())
      .then((data) => {
        setLanguagesData(data);
      })
      .catch((err) => console.error('Failed to load translations:', err));
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lang', lang);
  };

  const t = (key: string): string => {
    if (!languagesData || !languagesData[language]) {
      return '';
    }
    const val = languagesData[language][key];
    return val !== undefined ? val : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languagesData }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
