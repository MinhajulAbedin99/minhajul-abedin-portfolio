import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";

const sections = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/research", label: "Research" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/publications", label: "Publications" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/cv", label: "CV" },
  { href: "/admin/messages", label: "Messages" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex">
      <aside className="w-56 shrink-0 border-r border-ink/10 px-5 py-8">
        <p className="font-serif text-lg mb-8">Admin</p>
        <nav className="space-y-1">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="block rounded px-3 py-2 text-sm text-ink/70 hover:bg-ink/5 hover:text-ink transition-colors"
            >
              {s.label}
            </Link>
          ))}
        </nav>
        <div className="mt-10">
          <SignOutButton />
        </div>
      </aside>
      <div className="flex-1 px-10 py-8">{children}</div>
    </div>
  );
}
