import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export default async function AdminBlogListPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-moss-dark transition-colors"
        >
          Write post
        </Link>
      </div>

      {!posts || posts.length === 0 ? (
        <p className="text-muted">No posts yet.</p>
      ) : (
        <ul className="divide-y divide-ink/10 border-t border-b border-ink/10">
          {posts.map((post) => (
            <li
              key={post.id}
              className="py-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-serif text-lg break-words">{post.title}</p>
                <p className="text-sm text-muted">
                  {post.status}
                  {post.category ? " \u00B7 " + post.category : ""}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <Link
                  href={"/admin/blog/" + post.id}
                  className="text-sm text-moss hover:text-moss-dark"
                >
                  Edit
                </Link>
                <DeleteButton id={post.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
