import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import i18n from "./lib/i18n";

const getActiveLang = (): "pt" | "en" => {
  const raw = (i18n.resolvedLanguage || i18n.language || "en")
    .slice(0, 2)
    .toLowerCase();
  return raw === "pt" ? "pt" : "en";
};

export const getRouter = () => {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    rewrite: {
      // Strip leading /pt or /en before TanStack Router matches routes (e.g. /pt/chapter/work -> /chapter/work)
      input: ({ url }) => {
        const match = url.pathname.match(/^\/(pt|en)(\/.*|$)/i);
        if (match) {
          const detected = match[1].toLowerCase();
          if (i18n.language?.slice(0, 2).toLowerCase() !== detected) {
            i18n.changeLanguage(detected);
          }
          url.pathname = match[2] || "/";
        }
        return url;
      },
      // Prepend active language (/pt or /en) to every generated link & navigation URL
      output: ({ url }) => {
        const lang = getActiveLang();
        if (!/^\/(pt|en)(\/|$)/i.test(url.pathname)) {
          url.pathname =
            url.pathname === "/" ? `/${lang}` : `/${lang}${url.pathname}`;
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
