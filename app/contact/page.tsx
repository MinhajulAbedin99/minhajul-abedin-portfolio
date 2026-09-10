import { supabase } from "@/lib/supabaseClient";
import ContactForm from "./ContactForm";
import MoreWaysToConnect from "./MoreWaysToConnect";
import { Link as LinkIcon } from "lucide-react";

export const revalidate = 60;

export default async function ContactPage() {
  const { data: allLinks } = await supabase
    .from("social_links")
    .select("*")
    .order("display_order", { ascending: true });

  const featured = (allLinks ?? []).filter((l) => l.is_featured).slice(0, 4);
  const rest = (allLinks ?? []).filter((l) => !l.is_featured);

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
            {featured.length > 0 ? (
              <div className="flex flex-col gap-3">
                {featured.map((link) =>
                  link.url ? (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 border border-ink/15 px-5 py-3 hover:border-moss transition-colors"
                    >
                      {link.icon_url ? (
                        <img
                          src={link.icon_url}
                          alt=""
                          className="h-6 w-6 object-cover rounded"
                        />
                      ) : (
                        <LinkIcon size={16} />
                      )}
                      <span className="font-serif text-base">
                        {link.display_text || link.label}
                      </span>
                    </a>
                  ) : (
                    <span
                      key={link.id}
                      className="flex items-center gap-3 border border-ink/15 px-5 py-3"
                    >
                      {link.icon_url ? (
                        <img
                          src={link.icon_url}
                          alt=""
                          className="h-6 w-6 object-cover rounded"
                        />
                      ) : (
                        <LinkIcon size={16} />
                      )}
                      <span className="font-serif text-base">
                        {link.display_text || link.label}
                      </span>
                    </span>
                  ),
                )}
              </div>
            ) : null}

            <MoreWaysToConnect links={rest} />
          </div>

          <div className="md:pt-3">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
