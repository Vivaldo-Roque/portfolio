import React, { createContext, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../lib/i18n";

export type Language = "en" | "pt";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t: i18nT, i18n } = useTranslation();

  // Normalize language code (e.g. "pt-AO" or "pt-PT" -> "pt")
  const rawLang = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2).toLowerCase();
  const language: Language = rawLang === "pt" ? "pt" : "en";

  // Synchronize the active language code with the URL (/pt/... or /en/...)
  useEffect(() => {
    document.documentElement.lang = language;
    if (typeof window === "undefined") return;

    const { pathname, search, hash } = window.location;
    const segments = pathname.split("/").filter(Boolean);
    const first = segments[0]?.toLowerCase();

    if (first === "pt" || first === "en") {
      if (first !== language) {
        segments[0] = language;
        const nextPath = `/${segments.join("/")}`;
        window.history.replaceState(window.history.state, "", `${nextPath}${search}${hash}`);
      }
    } else {
      const rest = segments.length > 0 ? `/${segments.join("/")}` : "";
      const nextPath = `/${language}${rest}`;
      window.history.replaceState(window.history.state, "", `${nextPath}${search}${hash}`);
    }
  }, [language]);

  // Listen to browser Back/Forward buttons if the URL language prefix changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onPopState = () => {
      const first = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
      if ((first === "pt" || first === "en") && first !== language) {
        i18n.changeLanguage(first);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [language, i18n]);

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === "pt" ? "en" : "pt");
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    return i18nT(key, replacements as Record<string, unknown>) as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
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
