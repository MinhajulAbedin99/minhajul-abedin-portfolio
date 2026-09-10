import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

export const revalidate = 60;

const dot = "\u00B7";

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: pub } = await supabase
    .from("publications")
    .select("*")
    .eq("id", id)
    .single();

  if (!pub) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-16">
        <a
          href="/publications"
          className="text-sm text-moss hover:text-moss-dark"
        >
          {"\u2190"} Back to publications
        </a>

        <span className="mt-6 inline-block rounded-full border border-ink/15 px-3 py-1 text-xs text-muted">
          {pub.type === "dataset" ? "Dataset" : "Paper"}
        </span>

        <h1 className="mt-4 font-serif text-3xl md:text-4xl font-semibold leading-snug">
          {pub.title}
        </h1>

        <p className="mt-4 text-sm text-muted">
          {pub.authors}
          {pub.venue ? " " + dot + " " + pub.venue : ""}
          {pub.status ? " " + dot + " " + pub.status.replace("_", " ") : ""}
        </p>

        {pub.cover_image_url ? (
          <img
            src={pub.cover_image_url}
            alt={pub.title}
            className="mt-8 w-full aspect-video object-cover"
          />
        ) : null}

        {pub.description ? (
          <p className="mt-8 text-base leading-relaxed text-ink/80">
            {pub.description}
          </p>
        ) : null}

        {pub.url ? (
          <a
            href={pub.url}
            className="mt-8 inline-block text-sm text-moss hover:text-moss-dark"
          >
            View link {"\u2192"}
          </a>
        ) : null}
      </section>
    </main>
  );
}
