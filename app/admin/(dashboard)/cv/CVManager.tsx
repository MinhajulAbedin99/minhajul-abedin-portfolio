"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Education = {
  id?: number;
  degree: string;
  university: string;
  location: string;
  start_year: number | null;
  end_year: number | null;
  cgpa: string;
  description: string;
  display_order: number;
};

type Experience = {
  id?: number;
  role: string;
  organization: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  display_order: number;
};

type Certification = {
  id?: number;
  title: string;
  issuer: string;
  date: string;
  certificate_url: string;
  display_order: number;
};

const emptyEducation: Education = {
  degree: "",
  university: "",
  location: "",
  start_year: null,
  end_year: null,
  cgpa: "",
  description: "",
  display_order: 0,
};
const emptyExperience: Experience = {
  role: "",
  organization: "",
  location: "",
  start_date: "",
  end_date: "",
  description: "",
  display_order: 0,
};
const emptyCertification: Certification = {
  title: "",
  issuer: "",
  date: "",
  certificate_url: "",
  display_order: 0,
};

export default function CVManager({
  initialEducation,
  initialExperience,
  initialCertifications,
}: {
  initialEducation: Education[];
  initialExperience: Experience[];
  initialCertifications: Certification[];
}) {
  const [education, setEducation] = useState(initialEducation);
  const [experience, setExperience] = useState(initialExperience);
  const [certifications, setCertifications] = useState(initialCertifications);

  return (
    <div className="space-y-16 max-w-2xl">
      <Section
        title="Education"
        table="education"
        items={education}
        setItems={setEducation}
        empty={emptyEducation}
        fields={[
          { key: "degree", label: "Degree" },
          { key: "university", label: "University" },
          { key: "location", label: "Location" },
          { key: "cgpa", label: "CGPA" },
          { key: "description", label: "Description", textarea: true },
        ]}
        renderTitle={(item: Education) => item.degree}
        renderSubtitle={(item: Education) => item.university}
      />

      <Section
        title="Experience"
        table="experience"
        items={experience}
        setItems={setExperience}
        empty={emptyExperience}
        fields={[
          { key: "role", label: "Role" },
          { key: "organization", label: "Organization" },
          { key: "location", label: "Location" },
          { key: "start_date", label: "Start date" },
          { key: "end_date", label: "End date" },
          { key: "description", label: "Description", textarea: true },
        ]}
        renderTitle={(item: Experience) => item.role}
        renderSubtitle={(item: Experience) => item.organization}
      />

      <Section
        title="Certifications"
        table="certifications"
        items={certifications}
        setItems={setCertifications}
        empty={emptyCertification}
        fields={[
          { key: "title", label: "Title" },
          { key: "issuer", label: "Issuer" },
          { key: "date", label: "Date" },
          { key: "certificate_url", label: "Certificate URL" },
        ]}
        renderTitle={(item: Certification) => item.title}
        renderSubtitle={(item: Certification) => item.issuer}
      />
    </div>
  );
}

function Section<T extends { id?: number; display_order: number }>({
  title,
  table,
  items,
  setItems,
  empty,
  fields,
  renderTitle,
  renderSubtitle,
}: {
  title: string;
  table: string;
  items: T[];
  setItems: (items: T[]) => void;
  empty: T;
  fields: { key: keyof T; label: string; textarea?: boolean }[];
  renderTitle: (item: T) => string;
  renderSubtitle: (item: T) => string;
}) {
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<T>(empty);

  function startAdd() {
    setForm({ ...empty, display_order: items.length });
    setEditingId("new");
  }

  function startEdit(item: T) {
    setForm(item);
    setEditingId(item.id ?? "new");
  }

  function cancel() {
    setEditingId(null);
    setForm(empty);
  }

  async function save() {
    const supabase = createClient();

    if (editingId === "new") {
      const { data, error } = await supabase
        .from(table)
        .insert(form)
        .select()
        .single();
      if (!error && data) setItems([...items, data as T]);
    } else {
      const { error } = await supabase
        .from(table)
        .update(form)
        .eq("id", editingId);
      if (!error) {
        setItems(items.map((i) => (i.id === editingId ? form : i)));
      }
    }
    cancel();
  }

  async function remove(id: number | undefined) {
    if (!id) return;
    if (!confirm("Delete this entry?")) return;
    const supabase = createClient();
    await supabase.from(table).delete().eq("id", id);
    setItems(items.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-2xl">{title}</h2>
        {editingId === null ? (
          <button
            onClick={startAdd}
            className="text-sm text-moss hover:text-moss-dark"
          >
            + Add {title.toLowerCase()}
          </button>
        ) : null}
      </div>

      <ul className="divide-y divide-ink/10 border-t border-b border-ink/10 mb-4">
        {items.map((item) => (
          <li key={item.id} className="py-4">
            {editingId === item.id ? (
              <EntryForm
                fields={fields}
                form={form}
                setForm={setForm}
                onSave={save}
                onCancel={cancel}
              />
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-serif text-base">{renderTitle(item)}</p>
                  <p className="text-sm text-muted">{renderSubtitle(item)}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <button
                    onClick={() => startEdit(item)}
                    className="text-sm text-moss hover:text-moss-dark"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(item.id)}
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
          fields={fields}
          form={form}
          setForm={setForm}
          onSave={save}
          onCancel={cancel}
        />
      ) : null}
    </div>
  );
}

function EntryForm<T>({
  fields,
  form,
  setForm,
  onSave,
  onCancel,
}: {
  fields: { key: keyof T; label: string; textarea?: boolean }[];
  form: T;
  setForm: (form: T) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="border border-ink/15 p-5 space-y-4">
      {fields.map((field) => (
        <div key={String(field.key)}>
          <label className="block text-sm text-muted mb-1">{field.label}</label>
          {field.textarea ? (
            <textarea
              rows={3}
              value={String(form[field.key] ?? "")}
              onChange={(e) =>
                setForm({ ...form, [field.key]: e.target.value })
              }
              className="w-full border border-ink/20 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-moss"
            />
          ) : (
            <input
              type="text"
              value={String(form[field.key] ?? "")}
              onChange={(e) =>
                setForm({ ...form, [field.key]: e.target.value })
              }
              className="w-full border border-ink/20 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-moss"
            />
          )}
        </div>
      ))}
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
