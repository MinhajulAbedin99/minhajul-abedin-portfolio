import { supabase } from "@/lib/supabaseClient";
import PublicationsList from "./PublicationsList";

export const revalidate = 60;

export default async function PublicationsPage() {
  const { data: publications } = await supabase
    .from("publications")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
          Publications
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/80">
          Peer-reviewed papers and open datasets, most recent first.
        </p>
      </section>

      <PublicationsList publications={publications ?? []} />
    </main>
  );
}
