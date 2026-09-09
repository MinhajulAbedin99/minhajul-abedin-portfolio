"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Project = {
  id?: number;
  title: string | null;
  description: string | null;
  technologies: string | null;
  github_url: string | null;
  live_url: string | null;
  image_urls: string[] | null;
  display_order: number | null;
} | null;

export default function ProjectForm({ project }: { project: Project }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: project?.title ?? "",
    description: project?.description ?? "",
    technologies: project?.technologies ?? "",
    github_url: project?.github_url ?? "",
    live_url: project?.live_url ?? "",
    display_order: project?.display_order ?? 0,
  });
  const [tags, setTags] = useState(
    ((project as unknown as { tags?: string[] })?.tags ?? []).join(", "),
  );
  const [imageUrls, setImageUrls] = useState<string[]>(
    project?.image_urls ?? [],
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  function update(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = "projects/" + Date.now() + "." + ext;

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
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = { ...form, image_urls: imageUrls, tags: tagList };

    const { error } = project?.id
      ? await supabase.from("projects").update(payload).eq("id", project.id)
      : await supabase.from("projects").insert(payload);

    if (error) {
      setStatus("error");
      return;
    }

    router.push("/admin/projects");
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
        <label className="block text-sm text-muted mb-2">Description</label>
        <textarea
          rows={5}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Technologies</label>
        <input
          type="text"
          value={form.technologies}
          onChange={(e) => update("technologies", e.target.value)}
          placeholder="Next.js, TypeScript, Supabase"
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
        <label className="block text-sm text-muted mb-2">Live URL</label>
        <input
          type="text"
          value={form.live_url}
          onChange={(e) => update("live_url", e.target.value)}
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
          placeholder="Machine Learning, Deep Learning, Python"
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
          : project?.id
            ? "Save changes"
            : "Add project"}
      </button>

      {status === "error" ? (
        <p className="text-sm text-red-700">Something went wrong.</p>
      ) : null}
    </form>
  );
}
