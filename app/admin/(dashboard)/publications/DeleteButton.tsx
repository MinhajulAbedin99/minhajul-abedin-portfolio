"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this publication? This cannot be undone.")) return;

    const supabase = createClient();
    await supabase.from("publications").delete().eq("id", id);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-700 hover:text-red-900"
    >
      Delete
    </button>
  );
}
