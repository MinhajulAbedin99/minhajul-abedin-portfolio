import { createClient } from "@/lib/supabase/server";
import CVManager from "./CVManager";

export default async function AdminCVPage() {
  const supabase = await createClient();

  const { data: education } = await supabase
    .from("education")
    .select("*")
    .order("display_order", { ascending: true });

  const { data: experience } = await supabase
    .from("experience")
    .select("*")
    .order("display_order", { ascending: true });

  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">CV</h1>
      <p className="text-sm text-muted mb-10">
        Your CV file upload lives on the Profile page. This page manages the
        structured Education, Experience, and Certifications sections shown on
        your public CV page.
      </p>
      <CVManager
        initialEducation={education ?? []}
        initialExperience={experience ?? []}
        initialCertifications={certifications ?? []}
      />
    </div>
  );
}
