import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [research, projects, publications, blog, messages] = await Promise.all([
    supabase.from("research").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("publications").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Research", count: research.count ?? 0 },
    { label: "Projects", count: projects.count ?? 0 },
    { label: "Publications", count: publications.count ?? 0 },
    { label: "Blog posts", count: blog.count ?? 0 },
    { label: "Messages", count: messages.count ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-ink/10 p-5">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 font-serif text-3xl">{s.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
