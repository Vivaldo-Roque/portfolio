import { createFileRoute, redirect } from "@tanstack/react-router";
import i18n, { SUPPORTED_LANGUAGES } from "@/lib/i18n";

const SUPPORTED = SUPPORTED_LANGUAGES as readonly string[];

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // Detect language from i18n (localStorage → browser) and redirect to /$lang
    const raw = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2).toLowerCase();
    const lang = SUPPORTED.includes(raw) ? raw : "en";
    throw redirect({ to: "/$lang", params: { lang }, replace: true });
  },
});
