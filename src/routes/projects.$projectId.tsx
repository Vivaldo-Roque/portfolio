import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { projects, resolveProjectImage } from "@/lib/projects";
import ProjectShowcase from "@/components/portfolio/ProjectShowcase";
import { useLanguage } from "../context/language-context";
import { useMemo } from "react";

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectRoute,
});

function ProjectRoute() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const rawProject = projects.find((p) => p.id === projectId);

  const project = useMemo(() => {
    if (!rawProject) return null;
    const loc = rawProject.i18n?.[language] || rawProject.i18n?.pt;
    const translatedName = loc?.name || rawProject.name;
    const translatedDesc = loc?.description || rawProject.description;

    return {
      ...rawProject,
      name: translatedName,
      description: translatedDesc,
      scenes: rawProject.scenes.map((scene, sceneIdx) => {
        const customScene = loc?.scenes?.[sceneIdx];
        const prefix =
          sceneIdx === 0
            ? "showcase_problem"
            : sceneIdx === 1
              ? "showcase_stack"
              : sceneIdx === 2
                ? "showcase_experience"
                : "showcase_result";
        return {
          eyebrow: customScene?.eyebrow || t(`${prefix}_eyebrow`),
          title: customScene?.title || t(`${prefix}_title`),
          body:
            customScene?.body ||
            t(`${prefix}_body`, {
              name: translatedName,
              tags: rawProject.tags.join(", "),
            }),
          accent: scene.accent,
          image: customScene?.image
            ? resolveProjectImage(customScene.image, rawProject.folderPath)
            : scene.image,
          caption: customScene?.caption || scene.caption,
        };
      }),
    };
  }, [rawProject, language, t]);

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-4xl font-bold">{t("project_not_found") || "Projeto não encontrado"}</h1>
          <Link
            to="/"
            className="mt-4 inline-block rounded-full bg-moss px-6 py-3 font-semibold text-primary-foreground hover:bg-lime"
          >
            {t("back_to_projects") || "Voltar ao Início"}
          </Link>
        </div>
      </div>
    );
  }

  // Use the existing ProjectShowcase but wrap it in a full-screen div
  // and pass a navigation function to onClose
  return (
    <main className="h-screen w-screen bg-background text-foreground overflow-hidden">
      <ProjectShowcase
        project={project}
        onClose={() => navigate({ to: "/chapter/$chapterId", params: { chapterId: "work" } })}
      />
    </main>
  );
}
