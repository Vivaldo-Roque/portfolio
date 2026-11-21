import { useEffect, useState } from "react";
import { useLanguage } from "../../context/language-context";
import { SUSPEND_SNAP_EVENT } from "@/routes/index";

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const { t } = useLanguage();

  const links = [
    { href: "#home", label: t("navhome") },
    { href: "#about", label: t("navabout") },
    { href: "#origin", label: t("navorigin") },
    { href: "#work", label: t("navworks") },
    { href: "#skills", label: t("navskills") },
    { href: "#contact", label: t("navcontact") },
  ];

  useEffect(() => {
    // Always enforce dark mode (Monako-style monochrome dark palette)
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
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border px-6 backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? "border-white/15 bg-black/70 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
            : "border-white/10 bg-black/45 py-3"
        }`}
        style={{ width: "min(92%, 64rem)" }}
      >
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          className="font-display text-lg font-bold tracking-tight"
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
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="rounded-full border border-input px-4 py-1.5 font-mono-code text-xs uppercase tracking-widest text-foreground transition hover:border-moss hover:text-moss"
          >
            {t("btn_let_talk")}
          </a>
        </div>
      </div>
    </nav>
  );
}
