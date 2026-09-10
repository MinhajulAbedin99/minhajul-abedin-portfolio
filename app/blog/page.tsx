import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export const revalidate = 60;

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
          Blog
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/80">
          Notes on research, tools, and what I&apos;m learning along the way.
        </p>
      </section>

      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-5xl px-6 py-14">
          {!posts || posts.length === 0 ? (
            <p className="text-muted">No posts published yet.</p>
          ) : (
            <ul className="divide-y divide-ink/10">
              {posts.map((post) => (
                <li key={post.id} className="py-6">
                  <Link
                    href={"/blog/" + post.slug}
                    className="group flex gap-6 items-start"
                  >
                    {post.cover_image_url ? (
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-32 aspect-video object-cover shrink-0"
                      />
                    ) : null}
                    <div>
                      <p className="font-serif text-xl group-hover:text-moss transition-colors">
                        {post.title}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {post.category}
                        {post.published_at
                          ? " \u00B7 " +
                            new Date(post.published_at).toLocaleDateString()
                          : ""}
                      </p>
                      {post.excerpt ? (
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
                          {post.excerpt}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
