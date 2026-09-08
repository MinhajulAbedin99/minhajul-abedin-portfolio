import { createClient } from "@/lib/supabase/server";
import ResearchForm from "../ResearchForm";

export default async function EditResearchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: research } = await supabase
    .from("research")
    .select("*")
    .eq("id", id)
    .single();

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Edit research</h1>
      <ResearchForm research={research} />
    </div>
  );
}
