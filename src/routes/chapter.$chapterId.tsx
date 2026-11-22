import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import About from "@/components/portfolio/About";
import OriginStory from "@/components/portfolio/OriginStory";
import Projects from "@/components/portfolio/Projects";
import Skills from "@/components/portfolio/Skills";
import { LanguageSwitcher } from "@/components/portfolio/LanguageSwitcher";
import { useLanguage } from "@/context/language-context";

export const Route = createFileRoute("/chapter/$chapterId")({
  component: ChapterDetail,
});

const VIEWS = {
  about: About,
  origin: OriginStory,
  work: Projects,
  skills: Skills,
} as const;

function ChapterDetail() {
  const { chapterId } = Route.useParams();
  const { t } = useLanguage();
  const View = VIEWS[chapterId as keyof typeof VIEWS];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex items-center justify-between">
        <Link
          to="/"
          hash={chapterId}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-input bg-background/80 px-4 py-2 font-mono-code text-xs uppercase tracking-widest backdrop-blur transition hover:border-moss hover:text-moss"
        >
          <ArrowLeft className="h-4 w-4" /> {t("btn_back")}
        </Link>

        <LanguageSwitcher className="pointer-events-auto" />
      </div>
      {View ? <View /> : <p className="p-20">404</p>}
    </main>
  );
}
