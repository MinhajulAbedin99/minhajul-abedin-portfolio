"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: number;
  name: string | null;
  tagline_code: string | null;
  role_line: string | null;
  short_bio: string | null;
  location_badge: string | null;
  photo_url: string | null;
  cv_url: string | null;
  email: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  scholar_url: string | null;
  orcid_url: string | null;
  research_interests: string[] | null;
} | null;

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({
    name: profile?.name ?? "",
    tagline_code: profile?.tagline_code ?? "",
    role_line: profile?.role_line ?? "",
    short_bio: profile?.short_bio ?? "",
    location_badge: profile?.location_badge ?? "",
    photo_url: profile?.photo_url ?? "",
    cv_url: profile?.cv_url ?? "",
    email: profile?.email ?? "",
    github_url: profile?.github_url ?? "",
    linkedin_url: profile?.linkedin_url ?? "",
    scholar_url: profile?.scholar_url ?? "",
    orcid_url: profile?.orcid_url ?? "",
    research_interests: (profile?.research_interests ?? []).join(", "),
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function uploadFile(file: File, folder: string) {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = folder + "/" + Date.now() + "." + ext;

    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) throw error;

    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadFile(file, "profile-photo");
      update("photo_url", url);
    } catch {
      alert("Photo upload failed. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCv(true);
    try {
      const url = await uploadFile(file, "cv");
      update("cv_url", url);
    } catch {
      alert("CV upload failed. Please try again.");
    } finally {
      setUploadingCv(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");

    const supabase = createClient();
    const interests = form.research_interests
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const { error } = await supabase
      .from("profile")
      .update({ ...form, research_interests: interests })
      .eq("id", profile?.id ?? 1);

    setStatus(error ? "error" : "saved");
  }

  const textFields: {
    key: keyof typeof form;
    label: string;
    textarea?: boolean;
  }[] = [
    { key: "name", label: "Name" },
    { key: "tagline_code", label: "Tagline (code style)" },
    { key: "role_line", label: "Role line" },
    { key: "short_bio", label: "Short bio", textarea: true },
    { key: "location_badge", label: "Location badge" },
    { key: "email", label: "Email" },
    { key: "github_url", label: "GitHub URL" },
    { key: "linkedin_url", label: "LinkedIn URL" },
    { key: "scholar_url", label: "Google Scholar URL" },
    { key: "orcid_url", label: "ORCID URL" },
    {
      key: "research_interests",
      label: "Research interests (comma separated)",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm text-muted mb-2">Photo</label>
        {form.photo_url ? (
          <img
            src={form.photo_url}
            alt="Profile"
            className="mb-3 h-32 w-32 object-cover rounded"
          />
        ) : null}
        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
        {uploadingPhoto ? (
          <p className="mt-2 text-sm text-muted">Uploading...</p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">CV (PDF)</label>
        {form.cv_url ? (
          <a href={form.cv_url} className="text-sm text-moss underline">
            Current CV file
          </a>
        ) : null}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleCvUpload}
          className="block mt-2"
        />
        {uploadingCv ? (
          <p className="mt-2 text-sm text-muted">Uploading...</p>
        ) : null}
      </div>

      {textFields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm text-muted mb-2">{field.label}</label>
          {field.textarea ? (
            <textarea
              rows={3}
              value={form[field.key]}
              onChange={(e) => update(field.key, e.target.value)}
              className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
            />
          ) : (
            <input
              type="text"
              value={form[field.key]}
              onChange={(e) => update(field.key, e.target.value)}
              className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={status === "saving"}
        className="bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-moss-dark disabled:opacity-50"
      >
        {status === "saving" ? "Saving..." : "Save changes"}
      </button>

      {status === "saved" ? <p className="text-sm text-moss">Saved.</p> : null}
      {status === "error" ? (
        <p className="text-sm text-red-700">Something went wrong.</p>
      ) : null}
    </form>
  );
}
