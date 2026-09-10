import { createClient } from "@/lib/supabase/server";
import ProjectForm from "../ProjectForm";

export default async function NewProjectPage() {
  const supabase = await createClient();
  const { data: categoryOptions } = await supabase
    .from("project_categories")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Add project</h1>
      <ProjectForm project={null} categoryOptions={categoryOptions ?? []} />
    </div>
  );
}
