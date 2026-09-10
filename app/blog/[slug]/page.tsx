import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) {
    notFound();
  }

  const paragraphs = (post.content ?? "").split(/\n\s*\n/).filter(Boolean);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <article className="mx-auto max-w-3xl px-6 pt-16 pb-16">
        <a href="/blog" className="text-sm text-moss hover:text-moss-dark">
          {"\u2190"} Back to blog
        </a>

        <h1 className="mt-6 font-serif text-4xl md:text-5xl font-semibold tracking-tight">
          {post.title}
        </h1>

        <p className="mt-4 text-sm text-muted">
          {post.category}
          {post.published_at
            ? " \u00B7 " + new Date(post.published_at).toLocaleDateString()
            : ""}
        </p>

        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="mt-8 w-full aspect-video object-cover"
          />
        ) : null}

        <div className="mt-8 space-y-5">
          {paragraphs.map((para: string, i: number) => (
            <p key={i} className="text-base leading-relaxed text-ink/80">
              {para}
            </p>
          ))}
        </div>

        {post.tags && post.tags.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full border border-ink/15 px-3 py-1 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </article>
    </main>
  );
}
