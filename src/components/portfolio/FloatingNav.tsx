import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useLanguage } from "../../context/language-context";

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
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
    // Theme initialization
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    if (initialTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }

    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      // Scroll Spy
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      let currentActive = "#home";
      for (const link of links) {
        const section = document.querySelector(link.href) as HTMLElement;
        if (section && section.offsetTop <= scrollPosition) {
          currentActive = link.href;
        }
      }
      setActiveSection(currentActive);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-6 transition-all duration-300 ${
          scrolled ? "glass py-2.5" : "bg-transparent py-3"
        }`}
        style={{ width: "min(92%, 64rem)" }}
      >
        <a href="#home" className="font-display text-lg font-bold tracking-tight">
          <span className="text-lime">{"<"}</span>
          VR
          <span className="text-lime">{"/>"}</span>
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`font-mono-code text-xs tracking-widest transition hover:text-lime ${
                  activeSection === l.href ? "text-lime font-bold" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-moss/20 bg-background/50 text-foreground transition hover:border-moss hover:bg-moss/10"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <a
            href="#contact"
            className="rounded-full border border-moss/40 px-4 py-1.5 font-mono-code text-xs uppercase tracking-widest text-foreground transition hover:border-moss hover:bg-moss/10"
          >
            {t("btn_let_talk")}
          </a>
        </div>
      </div>
    </nav>
  );
}
