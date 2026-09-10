"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type BlogPost = {
  id?: number;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category: string | null;
  tags: string[] | null;
  status: string | null;
} | null;

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BlogForm({ post }: { post: BlogPost }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    cover_image_url: post?.cover_image_url ?? "",
    category: post?.category ?? "",
    status: post?.status ?? "draft",
  });
  const [tags, setTags] = useState((post?.tags ?? []).join(", "));
  const [slugTouched, setSlugTouched] = useState(!!post?.slug);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleTitleChange(value: string) {
    update("title", value);
    if (!slugTouched) {
      update("slug", slugify(value));
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = "blog/" + Date.now() + "." + ext;

    const { error } = await supabase.storage.from("media").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      update("cover_image_url", data.publicUrl);
    } else {
      alert("Image upload failed.");
    }
    setUploadingImage(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");

    const supabase = createClient();
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = {
      ...form,
      tags: tagList,
      published_at:
        form.status === "published" ? new Date().toISOString() : null,
    };

    const { error } = post?.id
      ? await supabase.from("blog_posts").update(payload).eq("id", post.id)
      : await supabase.from("blog_posts").insert(payload);

    if (error) {
      setStatus("error");
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm text-muted mb-2">Title</label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Slug (URL)</label>
        <input
          type="text"
          required
          value={form.slug}
          onChange={(e) => {
            setSlugTouched(true);
            update("slug", e.target.value);
          }}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
        <p className="mt-1 text-xs text-muted">
          yoursite.com/blog/{form.slug || "..."}
        </p>
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Excerpt</label>
        <textarea
          rows={2}
          value={form.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Content</label>
        <textarea
          rows={12}
          value={form.content}
          onChange={(e) => update("content", e.target.value)}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
        <p className="mt-1 text-xs text-muted">
          Plain text. Leave a blank line between paragraphs.
        </p>
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Cover image</label>
        {form.cover_image_url ? (
          <img
            src={form.cover_image_url}
            alt=""
            className="mb-3 h-32 w-full max-w-sm object-cover"
          />
        ) : null}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {uploadingImage ? (
          <p className="mt-2 text-sm text-muted">Uploading...</p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Category</label>
        <input
          type="text"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">
          Tags (comma separated)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Status</label>
        <select
          value={form.status}
          onChange={(e) => update("status", e.target.value)}
          className="w-full border border-ink/20 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-moss"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={status === "saving"}
        className="bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-moss-dark disabled:opacity-50"
      >
        {status === "saving"
          ? "Saving..."
          : post?.id
            ? "Save changes"
            : "Create post"}
      </button>

      {status === "error" ? (
        <p className="text-sm text-red-700">
          Something went wrong. The slug may already be in use.
        </p>
      ) : null}
    </form>
  );
}
