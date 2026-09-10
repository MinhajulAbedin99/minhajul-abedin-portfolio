"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Category = {
  id?: number;
  name: string;
  display_order: number;
};

const empty: Category = { name: "", display_order: 0 };

export default function CategoriesManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<Category>(empty);

  function startAdd() {
    setForm({ ...empty, display_order: categories.length });
    setEditingId("new");
  }

  function startEdit(category: Category) {
    setForm(category);
    setEditingId(category.id ?? "new");
  }

  function cancel() {
    setEditingId(null);
    setForm(empty);
  }

  async function save() {
    if (!form.name.trim()) {
      alert("Category name is required.");
      return;
    }

    const supabase = createClient();
    const { id, ...updateData } = form;

    if (editingId === "new") {
      const { data, error } = await supabase
        .from("project_categories")
        .insert(updateData)
        .select()
        .single();
      if (error) {
        alert("Save failed: " + error.message);
        return;
      }
      if (data) setCategories([...categories, data as Category]);
    } else {
      const { error } = await supabase
        .from("project_categories")
        .update(updateData)
        .eq("id", editingId);
      if (error) {
        alert("Save failed: " + error.message);
        return;
      }
      setCategories(categories.map((c) => (c.id === editingId ? form : c)));
    }
    cancel();
  }

  async function remove(id: number | undefined) {
    if (!id) return;
    if (
      !confirm(
        "Remove this category? Projects using it will keep the tag internally, but it will no longer appear as a filter option unless you re-add it.",
      )
    )
      return;
    const supabase = createClient();
    await supabase.from("project_categories").delete().eq("id", id);
    setCategories(categories.filter((c) => c.id !== id));
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-2xl">Project categories</h2>
        {editingId === null ? (
          <button
            onClick={startAdd}
            className="text-sm text-moss hover:text-moss-dark"
          >
            + Add category
          </button>
        ) : null}
      </div>

      <ul className="divide-y divide-ink/10 border-t border-b border-ink/10 mb-4">
        {categories.map((category) => (
          <li key={category.id} className="py-4">
            {editingId === category.id ? (
              <EntryForm
                form={form}
                setForm={setForm}
                onSave={save}
                onCancel={cancel}
              />
            ) : (
              <div className="flex items-center justify-between gap-4">
                <p className="font-serif text-base">{category.name}</p>
                <div className="flex items-center gap-4 shrink-0">
                  <button
                    onClick={() => startEdit(category)}
                    className="text-sm text-moss hover:text-moss-dark"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(category.id)}
                    className="text-sm text-red-700 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
        {categories.length === 0 ? (
          <li className="py-4 text-sm text-muted">No categories yet.</li>
        ) : null}
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
  form: Category;
  setForm: (c: Category) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="border border-ink/15 p-5 space-y-4">
      <div>
        <label className="block text-sm text-muted mb-1">Category name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Machine Learning"
          className="w-full border border-ink/20 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-1">Display order</label>
        <input
          type="number"
          value={form.display_order}
          onChange={(e) =>
            setForm({ ...form, display_order: Number(e.target.value) })
          }
          className="w-32 border border-ink/20 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-moss"
        />
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
