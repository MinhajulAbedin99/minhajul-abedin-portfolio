import { createClient } from "@/lib/supabase/server";
import BlogForm from "../BlogForm";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Edit post</h1>
      <BlogForm post={post} />
    </div>
  );
}
