import { PROFILE, SOCIAL_LINKS } from "@/config/profile";
import { useLanguage } from "@/context/language-context";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 sm:flex-row">
        <p className="text-center text-sm text-muted-foreground sm:text-left">
          © {new Date().getFullYear()} {PROFILE.shortName} · {t("footer_crafted")}
        </p>
        <div className="flex gap-2">
          {SOCIAL_LINKS.map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-input text-muted-foreground transition hover:border-moss hover:text-moss"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
