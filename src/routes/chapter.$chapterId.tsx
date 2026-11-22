import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import About from "@/components/portfolio/About";
import OriginStory from "@/components/portfolio/OriginStory";
import Projects from "@/components/portfolio/Projects";
import Skills from "@/components/portfolio/Skills";
import { useLanguage } from "../context/language-context";

export const Route = createFileRoute("/chapter/$chapterId")({
  component: ChapterDetail,
});

const VIEWS = { about: About, origin: OriginStory, work: Projects, skills: Skills } as const;

function ChapterDetail() {
  const { chapterId } = Route.useParams();
  const { t, language, setLanguage } = useLanguage();
  const View = VIEWS[chapterId as keyof typeof VIEWS];
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-x-4 top-4 z-50 flex items-center justify-between pointer-events-none">
        <Link
          to="/"
          hash={chapterId}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-input bg-background/80 px-4 py-2 font-mono-code text-xs uppercase tracking-widest backdrop-blur transition hover:border-moss hover:text-moss"
        >
          <ArrowLeft className="h-4 w-4" /> {t("btn_back")}
        </Link>

        <div
          role="group"
          aria-label="Language switcher"
          className="pointer-events-auto font-mono-code inline-flex items-center rounded-full border border-input bg-background/80 p-0.5 text-[11px] uppercase tracking-widest backdrop-blur"
        >
          <button
            type="button"
            onClick={() => setLanguage("pt")}
            aria-pressed={language === "pt"}
            className={`rounded-full px-3 py-1.5 transition ${
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
            className={`rounded-full px-3 py-1.5 transition ${
              language === "en"
                ? "bg-moss font-bold text-black shadow-[0_0_10px_rgba(47,191,113,0.4)]"
                : "text-white/65 hover:text-white"
            }`}
          >
            EN
          </button>
        </div>
      </div>
      {View ? <View /> : <p className="p-20">404</p>}
    </main>
  );
}
