import React, { createContext, useContext, useState, useEffect } from "react";
import translationsData from "../lib/languages.json";

export type Language = "en" | "pt";

interface LanguageContextType {
  language: Language;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Client-only detection to prevent SSR hydration mismatch
    const systemLang = navigator.language.slice(0, 2);
    if (systemLang === "pt") {
      setLanguage("pt");
    } else {
      setLanguage("en");
    }
  }, []);

  const t = (key: string, replacements?: Record<string, string>): string => {
    const dict = (translationsData as any)[language];
    if (!dict) return key;

    let translation = dict[key];
    if (translation === undefined) {
      // Fallback to English dictionary if key not found in active language
      const enDict = (translationsData as any)["en"];
      translation = enDict?.[key];
    }

    if (translation === undefined) return key;

    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        translation = translation.replace(new RegExp(`{${placeholder}}`, "g"), value);
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
