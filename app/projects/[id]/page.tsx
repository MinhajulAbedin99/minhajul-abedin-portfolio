import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-16">
        <a href="/projects" className="text-sm text-moss hover:text-moss-dark">
          {"\u2190"} Back to projects
        </a>

        <h1 className="mt-6 font-serif text-4xl md:text-5xl font-semibold tracking-tight">
          {project.title}
        </h1>

        {project.tags && project.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full border border-ink/15 px-3 py-1 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {project.image_urls && project.image_urls.length > 0 ? (
          <div className="mt-8 space-y-4">
            {project.image_urls.map((url: string) => (
              <img key={url} src={url} alt={project.title} className="w-full" />
            ))}
          </div>
        ) : null}

        {project.description ? (
          <p className="mt-8 text-base leading-relaxed text-ink/80 whitespace-pre-wrap">
            {project.description}
          </p>
        ) : null}

        {project.technologies ? (
          <p className="mt-6 text-sm text-muted">
            Built with {project.technologies}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-6 text-sm">
          {project.github_url ? (
            <a
              href={project.github_url}
              className="text-moss hover:text-moss-dark"
            >
              GitHub {"\u2192"}
            </a>
          ) : null}
          {project.live_url ? (
            <a
              href={project.live_url}
              className="text-moss hover:text-moss-dark"
            >
              Live demo {"\u2192"}
            </a>
          ) : null}
        </div>
      </section>
    </main>
  );
}
