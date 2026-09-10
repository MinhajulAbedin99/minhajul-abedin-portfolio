import { createClient } from "@/lib/supabase/server";
import ProjectForm from "../ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  const { data: categoryOptions } = await supabase
    .from("project_categories")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Edit project</h1>
      <ProjectForm project={project} categoryOptions={categoryOptions ?? []} />
    </div>
  );
}
