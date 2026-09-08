import { supabase } from "@/lib/supabaseClient";

export const revalidate = 60;

const dot = "\u00B7";

export default async function ResearchPage() {
  const { data: research } = await supabase
    .from("research")
    .select("*")
    .order("display_order", { ascending: true });

  const featured = research?.find((r) => r.is_featured);
  const rest = research?.filter((r) => !r.is_featured) ?? [];

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
          Research
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/80">
          Thesis work and ongoing research in computer vision and
          bioinformatics.
        </p>
      </section>

      {!research || research.length === 0 ? (
        <section className="border-t border-ink/10">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <p className="text-muted">No research entries yet.</p>
          </div>
        </section>
      ) : (
        <>
          {featured ? (
            <section className="border-t border-ink/10 bg-ink text-paper">
              <div className="mx-auto max-w-5xl px-6 py-14">
                <span className="inline-block rounded-full border border-paper/20 px-3 py-1 text-xs text-paper/70 mb-5">
                  Featured {dot} Thesis
                </span>
                <h2 className="font-serif text-2xl md:text-3xl leading-snug max-w-3xl">
                  {featured.title}
                </h2>
                {featured.short_description ? (
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-paper/80">
                    {featured.short_description}
                  </p>
                ) : null}
                {featured.tools ? (
                  <p className="mt-4 text-sm text-paper/60">{featured.tools}</p>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  {featured.dataset_url ? (
                    <a
                      href={featured.dataset_url}
                      className="text-gold hover:text-paper transition-colors"
                    >
                      Dataset
                    </a>
                  ) : null}
                  {featured.github_url ? (
                    <a
                      href={featured.github_url}
                      className="text-gold hover:text-paper transition-colors"
                    >
                      GitHub
                    </a>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}

          {rest.length > 0 ? (
            <section className="border-t border-ink/10">
              <div className="mx-auto max-w-5xl px-6 py-14">
                <h2 className="font-serif text-2xl mb-8">Other research</h2>
                <ul className="divide-y divide-ink/10">
                  {rest.map((item) => (
                    <li key={item.id} className="py-6">
                      <p className="font-serif text-lg leading-snug">
                        {item.title}
                      </p>
                      {item.short_description ? (
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
                          {item.short_description}
                        </p>
                      ) : null}
                      {item.tools ? (
                        <p className="mt-2 text-sm text-muted">{item.tools}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}
