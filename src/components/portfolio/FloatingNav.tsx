import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../../context/language-context";
import { SUSPEND_SNAP_EVENT } from "@/routes/index";

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  const links = [
    { href: "#home", label: t("navhome") },
    { href: "#about", label: t("navabout") },
    { href: "#origin", label: t("navorigin") },
    { href: "#work", label: t("navworks") },
    { href: "#skills", label: t("navskills") },
    { href: "#contact", label: t("navcontact") },
  ];

  useEffect(() => {
    localStorage.removeItem("theme");
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");

    const ids = ["#home", "#about", "#origin", "#work", "#skills", "#contact"];
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const vh = window.innerHeight || 1;
      const idx = Math.min(ids.length - 1, Math.max(0, Math.round(window.scrollY / vh)));
      setActiveSection(ids[idx]);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileOpen(false);
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    e.preventDefault();
    window.dispatchEvent(new CustomEvent(SUSPEND_SNAP_EVENT, { detail: { duration: 1000 } }));
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "py-2.5 sm:py-3" : "py-4 sm:py-6"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 backdrop-blur-md transition-all duration-300 sm:px-6 ${
          scrolled
            ? "border-white/15 bg-black/75 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)] sm:py-2.5"
            : "border-white/10 bg-black/50 py-2.5 sm:py-3"
        }`}
        style={{ width: "min(94%, 64rem)" }}
      >
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          className="font-display text-base font-bold tracking-tight sm:text-lg"
        >
          <span className="text-moss">{"<"}</span>
          VR
          <span className="text-moss">{"/>"}</span>
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                className={`font-mono-code text-xs tracking-widest transition hover:text-white ${
                  activeSection === l.href ? "font-bold text-white" : "text-white/75"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher Pill: PT | EN */}
          <div
            role="group"
            aria-label="Language switcher"
            className="font-mono-code inline-flex items-center rounded-full border border-white/15 bg-black/60 p-0.5 text-[10px] uppercase tracking-widest sm:text-[11px]"
          >
            <button
              type="button"
              onClick={() => setLanguage("pt")}
              aria-pressed={language === "pt"}
              className={`rounded-full px-2.5 py-1 transition ${
                language === "pt"
                  ? "bg-moss font-bold text-black shadow-[0_0_10px_rgba(47,191,113,0.4)]"
                  : "text-white/65 hover:text-white"
              }`}
            >
              PT
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={`rounded-full px-2.5 py-1 transition ${
                language === "en"
                  ? "bg-moss font-bold text-black shadow-[0_0_10px_rgba(47,191,113,0.4)]"
                  : "text-white/65 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="hidden rounded-full border border-input px-3.5 py-1.5 font-mono-code text-[11px] uppercase tracking-widest text-foreground transition hover:border-moss hover:text-moss sm:inline-flex sm:px-4 sm:text-xs"
          >
            {t("btn_let_talk")}
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-input bg-black/60 text-white transition hover:border-moss md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Drawer */}
      {mobileOpen && (
        <div className="mx-auto mt-2 overflow-hidden rounded-2xl border border-white/15 bg-black/95 p-3 shadow-2xl backdrop-blur-lg md:hidden" style={{ width: "min(94%, 64rem)" }}>
          <ul className="grid grid-cols-2 gap-1.5">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l.href)}
                  className={`font-mono-code flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs uppercase tracking-widest transition ${
                    activeSection === l.href
                      ? "bg-white font-semibold text-black"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      activeSection === l.href ? "bg-moss" : "bg-white/30"
                    }`}
                  />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
