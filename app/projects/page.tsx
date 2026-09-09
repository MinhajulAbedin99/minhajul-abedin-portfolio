import { supabase } from "@/lib/supabaseClient";
import ProjectsList from "./ProjectsList";

export const revalidate = 60;

export default async function ProjectsPage() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
          Projects
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/80">
          A selection of applied work in machine learning and software
          development.
        </p>
      </section>

      <ProjectsList projects={projects ?? []} />
    </main>
  );
}
