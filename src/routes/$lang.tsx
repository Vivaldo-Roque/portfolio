import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import i18n, { SUPPORTED_LANGUAGES } from "@/lib/i18n";

const SUPPORTED = SUPPORTED_LANGUAGES as readonly string[];

export const Route = createFileRoute("/$lang")({
  beforeLoad: ({ params }) => {
    if (!SUPPORTED.includes(params.lang)) {
      // Unknown lang segment — redirect to detected/saved language at root
      const saved = localStorage.getItem("portfolio_lang")?.slice(0, 2) ?? "en";
      const lang = SUPPORTED.includes(saved) ? saved : "en";
      throw redirect({ to: "/$lang", params: { lang }, replace: true });
    }
  },
  component: LangLayout,
});

function LangLayout() {
  const { lang } = Route.useParams();

  useEffect(() => {
    if (i18n.language?.slice(0, 2) !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return <Outlet />;
}
