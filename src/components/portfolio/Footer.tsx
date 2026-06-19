import { Github, Linkedin, Twitter } from "@/components/portfolio/BrandIcons";
import { useLanguage } from "../../context/language-context";

const socials = [
  { Icon: Github, label: "GitHub", href: "https://github.com/Vivaldo-Roque/" },
  { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/vivaldoroque/" },
  { Icon: Twitter, label: "Twitter", href: "https://twitter.com/vivaldo_roque" },
];

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-moss/10 bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 sm:flex-row">
        <p className="text-center text-sm text-muted-foreground sm:text-left">
          © 2025 Vivaldo Roque · {t("footer_crafted")}
        </p>
        <div className="flex gap-2">
          {socials.map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-moss/20 text-muted-foreground transition hover:border-moss hover:text-lime"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
