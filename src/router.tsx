import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import i18n from "./lib/i18n";

const getActiveLang = (): "pt" | "en" => {
  const raw = (i18n.resolvedLanguage || i18n.language || "en")
    .slice(0, 2)
    .toLowerCase();
  return raw === "pt" ? "pt" : "en";
};

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export const getRouter = () => {
  return createRouter({
    routeTree,
    basepath: import.meta.env.BASE_URL,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    rewrite: {
      // Strip leading /pt or /en (after optional BASE) before TanStack Router matches routes
      input: ({ url }) => {
        const prefix = BASE && url.pathname.startsWith(BASE) ? BASE : "";
        const rest = url.pathname.slice(prefix.length) || "/";
        const match = rest.match(/^\/(pt|en)(\/.*|$)/i);
        if (match) {
          const detected = match[1].toLowerCase();
          if (i18n.language?.slice(0, 2).toLowerCase() !== detected) {
            i18n.changeLanguage(detected);
          }
          url.pathname = `${prefix}${match[2] || "/"}`;
        }
        return url;
      },
      // Prepend active language (/pt or /en) after BASE to every generated link & navigation URL
      output: ({ url }) => {
        const lang = getActiveLang();
        const prefix = BASE && url.pathname.startsWith(BASE) ? BASE : "";
        const rest = url.pathname.slice(prefix.length) || "/";
        if (!/^\/(pt|en)(\/|$)/i.test(rest)) {
          url.pathname =
            rest === "/" ? `${prefix}/${lang}` : `${prefix}/${lang}${rest}`;
        }
        return url;
      },
    },
  });
};

// Type registration for TanStack Router
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
