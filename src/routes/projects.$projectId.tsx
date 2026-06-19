import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { projects } from "@/lib/projects";
import ProjectShowcase from "@/components/portfolio/ProjectShowcase";
import { useLanguage } from "../context/language-context";
import { useMemo } from "react";

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectRoute,
});

function ProjectRoute() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const rawProject = projects.find((p) => p.id === projectId);

  const project = useMemo(() => {
    if (!rawProject) return null;
    return {
      ...rawProject,
      name: t(`${rawProject.id}_title`) || rawProject.name,
      description: t(`works${projects.indexOf(rawProject) + 1}_desc`) || rawProject.description,
      scenes: rawProject.scenes.map((scene, sceneIdx) => {
        const prefix = sceneIdx === 0 ? "showcase_problem" : sceneIdx === 1 ? "showcase_stack" : sceneIdx === 2 ? "showcase_experience" : "showcase_result";
        let body = t(`${prefix}_body`);
        if (sceneIdx === 0) {
          body = body.replace("{name}", t(`${rawProject.id}_title`) || rawProject.name);
        } else if (sceneIdx === 1) {
          body = body.replace("{tags}", rawProject.tags.join(', '));
        }
        return {
          eyebrow: t(`${prefix}_eyebrow`),
          title: t(`${prefix}_title`),
          body: body,
          accent: scene.accent
        };
      })
    };
  }, [rawProject, t]);

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
      <ProjectShowcase project={project} onClose={() => navigate({ to: "/" })} />
    </main>
  );
}
