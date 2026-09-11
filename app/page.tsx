import { supabase } from "@/lib/supabaseClient";

export const revalidate = 60;

const dot = "\u00B7";

export default async function Home() {
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .limit(1)
    .single();

  const { data: publications } = await supabase
    .from("publications")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(2);

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(2);

  const { count: publicationsCount } = await supabase
    .from("publications")
    .select("*", { count: "exact", head: true });

  const { count: projectsCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: researchCount } = await supabase
    .from("research")
    .select("*", { count: "exact", head: true });

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 md:pt-28 md:pb-24 grid gap-12 md:grid-cols-[1.3fr_1fr] items-start">
        <div>
          <p className="font-mono text-sm text-moss mb-6">
            {profile?.tagline_code}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
            {profile?.name}
          </h1>
          <p className="mt-5 text-lg md:text-xl text-muted max-w-xl">
            {profile?.role_line}
          </p>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/80">
            {profile?.short_bio}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            {profile?.cv_url ? (
              <a
                href={profile.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-moss-dark"
              >
                View My Resume
              </a>
            ) : null}
            <a
              href="/contact"
              className="inline-flex items-center border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-moss hover:text-moss"
            >
              Get in touch
            </a>
          </div>
        </div>

        {profile?.photo_url ? (
          <div className="relative justify-self-center md:justify-self-end">
            <img
              src={profile.photo_url}
              alt={profile.name ?? "Profile photo"}
              className="w-full max-w-sm aspect-[4/5] object-cover rounded-2xl shadow-sm"
            />
            {profile?.location_badge ? (
              <span className="absolute bottom-4 left-4 rounded-full bg-paper/95 px-4 py-1.5 text-xs text-ink/80 shadow-sm">
                {profile.location_badge}
              </span>
            ) : null}
          </div>
        ) : null}
      </section>

      {profile?.full_bio ? (
        <section className="border-t border-ink/10">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="font-serif text-2xl md:text-3xl mb-6">About me</h2>
            <div className="max-w-3xl space-y-4 text-base md:text-lg leading-relaxed text-ink/80">
              {profile.full_bio
                .split(/\n+/)
                .map((paragraph: string) => paragraph.trim())
                .filter(Boolean)
                .map((paragraph: string, i: number) => (
                  <p key={i}>{paragraph}</p>
                ))}
            </div>

            {profile.research_interests &&
            profile.research_interests.length > 0 ? (
              <div className="mt-7 flex flex-wrap gap-2">
                {profile.research_interests.map((interest: string) => (
                  <span
                    key={interest}
                    className="rounded-full border border-ink/15 px-4 py-1.5 text-sm text-ink/70"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-10 grid grid-cols-3 max-w-md gap-6 border-t border-ink/10 pt-8">
              <div>
                <p className="font-serif text-3xl">{publicationsCount ?? 0}</p>
                <p className="mt-1 text-sm text-muted">Publications</p>
              </div>
              <div>
                <p className="font-serif text-3xl">{projectsCount ?? 0}</p>
                <p className="mt-1 text-sm text-muted">Projects</p>
              </div>
              <div>
                <p className="font-serif text-3xl">{researchCount ?? 0}</p>
                <p className="mt-1 text-sm text-muted">Research works</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {publications && publications.length > 0 ? (
        <section className="border-t border-ink/10">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-serif text-2xl md:text-3xl">
                Recent publications
              </h2>
              <a
                href="/publications"
                className="text-sm text-moss hover:text-moss-dark"
              >
                View all
              </a>
            </div>
            <ul className="divide-y divide-ink/10">
              {publications.map((pub) => (
                <li key={pub.id} className="py-5">
                  <p className="font-serif text-lg leading-snug">{pub.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {pub.venue}
                    {pub.status
                      ? " " + dot + " " + pub.status.replace("_", " ")
                      : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {projects && projects.length > 0 ? (
        <section className="border-t border-ink/10">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-serif text-2xl md:text-3xl">
                Recent projects
              </h2>
              <a
                href="/projects"
                className="text-sm text-moss hover:text-moss-dark"
              >
                View all
              </a>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {projects.map((project) => (
                <a
                  key={project.id}
                  href={"/projects/" + project.id}
                  className="block border border-ink/10 hover:border-moss transition-colors"
                >
                  {project.image_urls && project.image_urls[0] ? (
                    <img
                      src={project.image_urls[0]}
                      alt={project.title}
                      className="w-full aspect-video object-cover"
                    />
                  ) : null}
                  <div className="p-5">
                    <p className="font-serif text-xl">{project.title}</p>
                    {project.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-ink/70 line-clamp-2">
                        {project.description}
                      </p>
                    ) : null}
                    {project.tags && project.tags.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="rounded-full border border-ink/10 px-3 py-1 text-xs text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
