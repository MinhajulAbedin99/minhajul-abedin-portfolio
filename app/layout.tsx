import type { Metadata } from "next";
import { Source_Serif_4, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={serif.variable + " " + sans.variable}>
        <header className="border-b border-ink/10">
          <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
            <Link href="/" className="font-serif text-lg font-semibold">
              Minhajul Abedin
            </Link>
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
          </div>
        </header>

        {children}

        <footer className="border-t border-ink/10">
          <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-muted">
            {new Date().getFullYear()} Minhajul Abedin
          </div>
        </footer>
      </body>
    </html>
  );
}
