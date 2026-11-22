import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const SUPPORTED_LANGUAGES = ["pt", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// 1. Automatically load all modular YAML files inside src/locales/{en,pt}/*.yaml
const enYamlModules = import.meta.glob<Record<string, string>>("../locales/en/*.{yaml,yml}", {
  eager: true,
  import: "default",
});
const ptYamlModules = import.meta.glob<Record<string, string>>("../locales/pt/*.{yaml,yml}", {
  eager: true,
  import: "default",
});

// 2. Automatically load all Markdown (.md) files inside src/locales/{en,pt}/*.md as raw strings
//    The filename (without .md) becomes a translation key automatically (e.g. bio.md -> t("bio"))
const enMdModules = import.meta.glob<string>("../locales/en/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});
const ptMdModules = import.meta.glob<string>("../locales/pt/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const buildDictionary = (
  yamlMods: Record<string, Record<string, string>>,
  mdMods: Record<string, string>,
): Record<string, string> => {
  const dict: Record<string, string> = {};

  for (const mod of Object.values(yamlMods)) {
    if (mod && typeof mod === "object") {
      Object.assign(dict, mod);
    }
  }

  for (const [filePath, rawContent] of Object.entries(mdMods)) {
    const fileName = filePath.split("/").pop() || "";
    const key = fileName.replace(/\.md$/i, "");
    if (key && typeof rawContent === "string") {
      dict[key] = rawContent.trim();
    }
  }

  return dict;
};

const enTranslations = buildDictionary(enYamlModules, enMdModules);
const ptTranslations = buildDictionary(ptYamlModules, ptMdModules);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      pt: { translation: ptTranslations },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "pt"],
    nonExplicitSupportedLngs: true, // matches "pt-PT", "pt-AO", "pt-BR" -> "pt" and "en-US" -> "en"
    load: "languageOnly",
    detection: {
      // 1. Check URL path (/pt/... or /en/...) or query (?lang=pt) first
      // 2. Check user's manual choice in localStorage
      // 3. Otherwise detect browser/OS language automatically
      order: ["path", "querystring", "localStorage", "navigator", "htmlTag"],
      lookupFromPathIndex: 0,
      lookupQuerystring: "lang",
      lookupLocalStorage: "portfolio_lang",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false, // React already protects from XSS
      prefix: "{",
      suffix: "}",
    },
  });

export default i18n;
