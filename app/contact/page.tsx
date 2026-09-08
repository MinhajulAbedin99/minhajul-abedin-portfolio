import { supabase } from "@/lib/supabaseClient";
import ContactForm from "./ContactForm";
import { Mail, Link as LinkIcon, MapPin } from "lucide-react";

export const revalidate = 60;

export default async function ContactPage() {
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .limit(1)
    .single();

  const infoRows = [
    {
      label: "Email",
      value: profile?.email,
      href: profile?.email ? "mailto:" + profile.email : null,
      icon: Mail,
    },
    {
      label: "GitHub",
      value: profile?.github_url,
      href: profile?.github_url,
      icon: LinkIcon,
    },
    {
      label: "LinkedIn",
      value: profile?.linkedin_url,
      href: profile?.linkedin_url,
      icon: LinkIcon,
    },
    {
      label: "Location",
      value: profile?.location_badge,
      href: null,
      icon: MapPin,
    },
  ].filter((r) => r.value);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-14">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
          Get in touch
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/80">
          Open to Master&apos;s opportunities, research collaborations, and
          conversations about AI in healthcare, agriculture, and biotechnology.
        </p>
      </section>

      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-5xl px-6 py-14 grid gap-14 md:grid-cols-2">
          <div className="space-y-8">
            {infoRows.length === 0 ? (
              <p className="text-muted">Contact details coming soon.</p>
            ) : (
              infoRows.map((row) => {
                const Icon = row.icon;
                const content = (
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/70">
                      <Icon size={16} />
                    </span>
                    <div>
                      <p className="text-sm text-muted">{row.label}</p>
                      <p className="font-serif text-lg">{row.value}</p>
                    </div>
                  </div>
                );
                return row.href ? (
                  <a
                    key={row.label}
                    href={row.href}
                    className="block hover:text-moss transition-colors"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={row.label}>{content}</div>
                );
              })
            )}
          </div>

          <ContactForm />
        </div>
      </section>
    </main>
  );
}
