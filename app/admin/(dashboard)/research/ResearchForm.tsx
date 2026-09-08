"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Research = {
  id?: number;
  title: string | null;
  status: string | null;
  short_description: string | null;
  full_description: string | null;
  tools: string | null;
  github_url: string | null;
  dataset_url: string | null;
  image_urls: string[] | null;
  is_featured: boolean | null;
  display_order: number | null;
} | null;

export default function ResearchForm({ research }: { research: Research }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: research?.title ?? "",
    status: research?.status ?? "completed",
    short_description: research?.short_description ?? "",
    full_description: research?.full_description ?? "",
    tools: research?.tools ?? "",
    github_url: research?.github_url ?? "",
    dataset_url: research?.dataset_url ?? "",
    is_featured: research?.is_featured ?? false,
    display_order: research?.display_order ?? 0,
  });
  const [imageUrls, setImageUrls] = useState<string[]>(
    research?.image_urls ?? [],
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  function update(field: string, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = "research/" + Date.now() + "." + ext;

    const { error } = await supabase.storage.from("media").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setImageUrls((prev) => [...prev, data.publicUrl]);
    } else {
      alert("Image upload failed.");
    }
    setUploadingImage(false);
  }

  function removeImage(url: string) {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");

    const supabase = createClient();
    const payload = { ...form, image_urls: imageUrls };

    const { error } = research?.id
      ? await supabase.from("research").update(payload).eq("id", research.id)
      : await supabase.from("research").insert(payload);

    if (error) {
      setStatus("error");
      return;
    }

    router.push("/admin/research");
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
        <label className="block text-sm text-muted mb-2">Status</label>
        <select
          value={form.status}
          onChange={(e) => update("status", e.target.value)}
          className="w-full border border-ink/20 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-moss"
        >
          <option value="thesis">Thesis</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">
          Short description
        </label>
        <textarea
          rows={3}
          value={form.short_description}
          onChange={(e) => update("short_description", e.target.value)}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">
          Full description
        </label>
        <textarea
          rows={6}
          value={form.full_description}
          onChange={(e) => update("full_description", e.target.value)}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Tools</label>
        <input
          type="text"
          value={form.tools}
          onChange={(e) => update("tools", e.target.value)}
          placeholder="Python, TensorFlow, Roboflow"
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">GitHub URL</label>
        <input
          type="text"
          value={form.github_url}
          onChange={(e) => update("github_url", e.target.value)}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Dataset URL</label>
        <input
          type="text"
          value={form.dataset_url}
          onChange={(e) => update("dataset_url", e.target.value)}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Images</label>
        {imageUrls.length > 0 ? (
          <div className="flex flex-wrap gap-3 mb-3">
            {imageUrls.map((url) => (
              <div key={url} className="relative">
                <img src={url} alt="" className="h-24 w-24 object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -top-2 -right-2 bg-ink text-paper text-xs h-6 w-6 rounded-full"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        ) : null}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {uploadingImage ? (
          <p className="mt-2 text-sm text-muted">Uploading...</p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_featured"
          checked={form.is_featured}
          onChange={(e) => update("is_featured", e.target.checked)}
        />
        <label htmlFor="is_featured" className="text-sm">
          Featured (shown as the highlighted entry, e.g. thesis)
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
          : research?.id
            ? "Save changes"
            : "Add research"}
      </button>

      {status === "error" ? (
        <p className="text-sm text-red-700">Something went wrong.</p>
      ) : null}
    </form>
  );
}
