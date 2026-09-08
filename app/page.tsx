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
    .limit(3);

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
                View CV
              </a>
            ) : null}
            <a
              href="/contact"
              className="inline-flex items-center border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-moss hover:text-moss"
            >
              Get in touch
            </a>
          </div>

          {profile?.location_badge ? (
            <p className="mt-10 text-xs text-muted">{profile.location_badge}</p>
          ) : null}
        </div>

        {profile?.photo_url ? (
          <div className="justify-self-center md:justify-self-end md:mt-64">
            <img
              src={profile.photo_url}
              alt={profile.name ?? "Profile photo"}
              className="w-full max-w-sm aspect-[4/5] object-cover"
            />
          </div>
        ) : null}
      </section>

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
    </main>
  );
}
