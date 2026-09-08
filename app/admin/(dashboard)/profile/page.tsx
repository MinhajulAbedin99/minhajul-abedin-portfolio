import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";

export default async function AdminProfilePage() {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .limit(1)
    .single();

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
