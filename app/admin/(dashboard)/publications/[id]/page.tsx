import { createClient } from "@/lib/supabase/server";
import PublicationForm from "../PublicationForm";

export default async function EditPublicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: publication } = await supabase
    .from("publications")
    .select("*")
    .eq("id", id)
    .single();

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Edit publication</h1>
      <PublicationForm publication={publication} />
    </div>
  );
}
