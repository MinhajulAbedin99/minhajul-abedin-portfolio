"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Publication = {
  id?: number;
  title: string | null;
  type: string | null;
  authors: string | null;
  venue: string | null;
  status: string | null;
  year: number | null;
  description: string | null;
  url: string | null;
  is_first_author: boolean | null;
  display_order: number | null;
  cover_image_url: string | null;
} | null;

export default function PublicationForm({
  publication,
}: {
  publication: Publication;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: publication?.title ?? "",
    type: publication?.type ?? "paper",
    authors: publication?.authors ?? "",
    venue: publication?.venue ?? "",
    status: publication?.status ?? "published",
    year: publication?.year ?? new Date().getFullYear(),
    description: publication?.description ?? "",
    url: publication?.url ?? "",
    is_first_author: publication?.is_first_author ?? true,
    display_order: publication?.display_order ?? 0,
  });
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [coverImageUrl, setCoverImageUrl] = useState(
    publication?.cover_image_url ?? "",
  );
  const [uploadingImage, setUploadingImage] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = "publications/" + Date.now() + "." + ext;

    const { error } = await supabase.storage.from("media").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setCoverImageUrl(data.publicUrl);
    } else {
      alert("Image upload failed.");
    }
    setUploadingImage(false);
  }

  function update(field: string, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");

    const supabase = createClient();
    const payload = { ...form, cover_image_url: coverImageUrl };

    const { error } = publication?.id
      ? await supabase
          .from("publications")
          .update(payload)
          .eq("id", publication.id)
      : await supabase.from("publications").insert(payload);

    if (error) {
      setStatus("error");
      return;
    }

    router.push("/admin/publications");
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
          onChange={(e) => update("title", e.target.value)}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Type</label>
        <select
          value={form.type}
          onChange={(e) => update("type", e.target.value)}
          className="w-full border border-ink/20 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-moss"
        >
          <option value="paper">Paper</option>
          <option value="dataset">Dataset</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Authors</label>
        <input
          type="text"
          value={form.authors}
          onChange={(e) => update("authors", e.target.value)}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Venue</label>
        <input
          type="text"
          value={form.venue}
          onChange={(e) => update("venue", e.target.value)}
          placeholder="Data in Brief, Elsevier"
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
          <option value="accepted">Accepted</option>
          <option value="under_review">Under review</option>
          <option value="published">Published</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Year</label>
        <input
          type="number"
          value={form.year}
          onChange={(e) => update("year", Number(e.target.value))}
          className="w-40 border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Description</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">
          Link (DOI / Mendeley / journal URL)
        </label>
        <input
          type="text"
          value={form.url}
          onChange={(e) => update("url", e.target.value)}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Cover image</label>
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt=""
            className="mb-3 h-32 w-full max-w-sm object-cover"
          />
        ) : null}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {uploadingImage ? (
          <p className="mt-2 text-sm text-muted">Uploading...</p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_first_author"
          checked={form.is_first_author}
          onChange={(e) => update("is_first_author", e.target.checked)}
        />
        <label htmlFor="is_first_author" className="text-sm">
          First author
        </label>
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Display order</label>
        <input
          type="number"
          value={form.display_order}
          onChange={(e) => update("display_order", Number(e.target.value))}
          className="w-40 border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <button
        type="submit"
        disabled={status === "saving"}
        className="bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-moss-dark disabled:opacity-50"
      >
        {status === "saving"
          ? "Saving..."
          : publication?.id
            ? "Save changes"
            : "Add publication"}
      </button>

      {status === "error" ? (
        <p className="text-sm text-red-700">Something went wrong.</p>
      ) : null}
    </form>
  );
}
