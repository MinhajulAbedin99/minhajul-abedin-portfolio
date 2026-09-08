import { supabase } from "@/lib/supabaseClient";

export const revalidate = 60;

export default async function ContactPage() {
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .limit(1)
    .single();

  const links = [
    {
      label: "Email",
      value: profile?.email,
      href: profile?.email ? "mailto:" + profile.email : null,
    },
    { label: "GitHub", value: profile?.github_url, href: profile?.github_url },
    {
      label: "LinkedIn",
      value: profile?.linkedin_url,
      href: profile?.linkedin_url,
    },
    {
      label: "Google Scholar",
      value: profile?.scholar_url,
      href: profile?.scholar_url,
    },
    { label: "ORCID", value: profile?.orcid_url, href: profile?.orcid_url },
  ].filter((l) => l.value);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
          Contact
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/80">
          Open to Master&apos;s opportunities, research collaborations, and
          conversations about AI in healthcare, agriculture, and biotechnology.
        </p>
      </section>

      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-5xl px-6 py-14">
          {links.length === 0 ? (
            <p className="text-muted">Contact details coming soon.</p>
          ) : (
            <ul className="space-y-6">
              {links.map((link) => (
                <li key={link.label} className="flex items-baseline gap-6">
                  <span className="w-36 shrink-0 text-sm text-muted">
                    {link.label}
                  </span>
                  <a
                    href={link.href ?? "#"}
                    className="font-serif text-xl text-ink hover:text-moss transition-colors"
                  >
                    {link.value}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {profile?.location_badge ? (
            <p className="mt-14 text-sm text-muted">{profile.location_badge}</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}

