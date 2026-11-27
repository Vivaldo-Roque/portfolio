import { useLanguage } from "@/context/language-context";
import { useNavigate, useParams } from "@tanstack/react-router";

/**
 * Reusable PT | EN Language Switcher Pill used across FloatingNav,
 * ChapterDetail, and ProjectShowcase.
 * When inside a /$lang route, also updates the URL to reflect the new language.
 */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  // useParams returns {} if we're not inside a $lang route — safe to call unconditionally
  const params = useParams({ strict: false }) as { lang?: string };

  const handleSwitch = (lang: "pt" | "en") => {
    setLanguage(lang);
    // If the current URL has a $lang segment, replace it
    if (params.lang && params.lang !== lang) {
      navigate({
        // Replace only the lang param; keep the rest of the path intact
        params: (prev) => ({ ...prev, lang }),
        replace: true,
      });
    }
  };

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className={`font-mono-code inline-flex items-center rounded-full border border-input bg-black/75 p-0.5 text-[10px] uppercase tracking-widest backdrop-blur-md sm:text-[11px] ${className}`}
    >
      {(["pt", "en"] as const).map((lang) => {
        const isActive = language === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => handleSwitch(lang)}
            aria-pressed={isActive}
            className={`rounded-full px-2.5 py-1 transition ${
              isActive
                ? "bg-moss font-bold text-black shadow-[0_0_10px_rgba(47,191,113,0.4)]"
                : "text-white/65 hover:text-white"
            }`}
          >
            {lang.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
