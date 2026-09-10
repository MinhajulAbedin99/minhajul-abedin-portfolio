"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SocialLink = {
  id?: number;
  label: string;
  url: string;
  display_text: string;
  icon_url: string;
  is_featured: boolean;
  display_order: number;
};

const empty: SocialLink = {
  label: "",
  url: "",
  display_text: "",
  icon_url: "",
  is_featured: false,
  display_order: 0,
};

export default function SocialLinksManager({
  initialLinks,
}: {
  initialLinks: SocialLink[];
}) {
  const [links, setLinks] = useState(initialLinks);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<SocialLink>(empty);

  function startAdd() {
    setForm({ ...empty, display_order: links.length });
    setEditingId("new");
  }

  function startEdit(link: SocialLink) {
    setForm(link);
    setEditingId(link.id ?? "new");
  }

  function cancel() {
    setEditingId(null);
    setForm(empty);
  }

  async function save() {
    const supabase = createClient();
    const { id, ...updateData } = form;

    if (editingId === "new") {
      const { data, error } = await supabase
        .from("social_links")
        .insert(updateData)
        .select()
        .single();
      if (error) {
        alert("Save failed: " + error.message);
        return;
      }
      if (data) setLinks([...links, data as SocialLink]);
    } else {
      const { error } = await supabase
        .from("social_links")
        .update(updateData)
        .eq("id", editingId);
      if (error) {
        alert("Save failed: " + error.message);
        return;
      }
      setLinks(links.map((l) => (l.id === editingId ? form : l)));
    }
    cancel();
  }

  async function remove(id: number | undefined) {
    if (!id) return;
    if (!confirm("Remove this link?")) return;
    const supabase = createClient();
    await supabase.from("social_links").delete().eq("id", id);
    setLinks(links.filter((l) => l.id !== id));
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-2xl">Social links</h2>
        {editingId === null ? (
          <button
            onClick={startAdd}
            className="text-sm text-moss hover:text-moss-dark"
          >
            + Add link
          </button>
        ) : null}
      </div>

      <ul className="divide-y divide-ink/10 border-t border-b border-ink/10 mb-4">
        {links.map((link) => (
          <li key={link.id} className="py-4">
            {editingId === link.id ? (
              <EntryForm
                form={form}
                setForm={setForm}
                onSave={save}
                onCancel={cancel}
              />
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex items-center gap-3">
                  {link.icon_url ? (
                    <img
                      src={link.icon_url}
                      alt=""
                      className="h-8 w-8 object-cover rounded"
                    />
                  ) : null}
                  <div>
                    <p className="font-serif text-base">
                      {link.label}
                      {link.is_featured ? " \u00B7 Featured" : ""}
                    </p>
                    <p className="text-sm text-muted truncate">
                      {link.url ? link.url : "Text only (no link)"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <button
                    onClick={() => startEdit(link)}
                    className="text-sm text-moss hover:text-moss-dark"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(link.id)}
                    className="text-sm text-red-700 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {editingId === "new" ? (
        <EntryForm
          form={form}
          setForm={setForm}
          onSave={save}
          onCancel={cancel}
        />
      ) : null}
    </div>
  );
}

function EntryForm({
  form,
  setForm,
  onSave,
  onCancel,
}: {
  form: SocialLink;
  setForm: (f: SocialLink) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleIconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = "social/" + Date.now() + "." + ext;

    const { error } = await supabase.storage.from("media").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setForm({ ...form, icon_url: data.publicUrl });
    } else {
      alert("Icon upload failed.");
    }
    setUploading(false);
  }

  return (
    <div className="border border-ink/15 p-5 space-y-4">
      <div>
        <label className="block text-sm text-muted mb-1">Logo / icon</label>
        {form.icon_url ? (
          <img
            src={form.icon_url}
            alt=""
            className="mb-2 h-12 w-12 object-cover rounded"
          />
        ) : null}
        <input type="file" accept="image/*" onChange={handleIconUpload} />
        {uploading ? (
          <p className="mt-1 text-sm text-muted">Uploading...</p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm text-muted mb-1">
          Label (internal name, e.g. "WhatsApp")
        </label>
        <input
          type="text"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          placeholder="GitHub, LinkedIn, WhatsApp..."
          className="w-full border border-ink/20 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-1">
          Display text (what visitors actually see — leave blank to just use the
          label above)
        </label>
        <input
          type="text"
          value={form.display_text}
          onChange={(e) => setForm({ ...form, display_text: e.target.value })}
          placeholder="+880 1788-727388"
          className="w-full border border-ink/20 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-1">
          URL (leave blank to show as plain text, not clickable)
        </label>
        <input
          type="text"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="https://wa.me/8801788727388"
          className="w-full border border-ink/20 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_featured"
          checked={form.is_featured}
          onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
        />
        <label htmlFor="is_featured" className="text-sm">
          Show in top 4 (featured)
        </label>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onSave}
          className="bg-ink px-5 py-2 text-sm font-medium text-paper hover:bg-moss-dark transition-colors"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="text-sm text-muted hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
