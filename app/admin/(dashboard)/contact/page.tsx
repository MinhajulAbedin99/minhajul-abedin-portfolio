import { createClient } from "@/lib/supabase/server";
import SocialLinksManager from "./SocialLinksManager";

export default async function AdminContactPage() {
  const supabase = await createClient();
  const { data: links } = await supabase
    .from("social_links")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Contact</h1>
      <p className="text-sm text-muted mb-10">
        Manage the social and contact links shown on your public Contact page.
        Your email and location live on the Profile page.
      </p>
      <SocialLinksManager initialLinks={links ?? []} />
    </div>
  );
}
