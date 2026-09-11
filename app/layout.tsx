import type { Metadata } from "next";
import { Source_Serif_4, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { supabase } from "@/lib/supabaseClient";
import "./globals.css";

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Minhajul Abedin — AI/ML Researcher",
  description:
    "AI/ML researcher focused on computer vision, plant pathology, and bioinformatics-driven drug discovery.",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
  { href: "/blog", label: "Blog" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

const footerLinks = [
  { href: "/research", label: "Research" },
  { href: "/publications", label: "Publications" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

const themeScript =
  "try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data: profile } = await supabase
    .from("profile")
    .select("name, role_line")
    .limit(1)
    .single();

  const { data: featuredLinks } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(3);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={serif.variable + " " + sans.variable}>
        <header className="border-b border-ink/10">
          <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
            <Link href="/" className="font-serif text-lg font-semibold">
              Minhajul Abedin
            </Link>
            <div className="flex items-center gap-6">
              <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-ink/70 hover:text-moss transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {children}

        <footer className="border-t border-ink/10">
          <div className="mx-auto max-w-5xl px-6 py-12 grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <p className="font-serif text-lg font-semibold">
                {profile?.name ?? "Minhajul Abedin"}
              </p>
              {profile?.role_line ? (
                <p className="mt-2 text-sm text-muted max-w-xs">
                  {profile.role_line}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-6 md:items-end">
              <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm md:justify-end">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-ink/70 hover:text-moss transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {featuredLinks && featuredLinks.length > 0 ? (
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm md:justify-end">
                  {featuredLinks.map((link) =>
                    link.url ? (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink/70 hover:text-moss transition-colors"
                      >
                        {link.display_text || link.label}
                      </a>
                    ) : null,
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="border-t border-ink/10">
            <div className="mx-auto max-w-5xl px-6 py-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
              <p>
                {new Date().getFullYear()} {profile?.name ?? "Minhajul Abedin"}
              </p>
              <p>Built with Next.js &amp; Supabase</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
