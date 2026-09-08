import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export default async function AdminResearchListPage() {
  const supabase = await createClient();
  const { data: research } = await supabase
    .from("research")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl">Research</h1>
        <Link
          href="/admin/research/new"
          className="bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-moss-dark transition-colors"
        >
          Add research
        </Link>
      </div>

      {!research || research.length === 0 ? (
        <p className="text-muted">No research entries yet.</p>
      ) : (
        <ul className="divide-y divide-ink/10 border-t border-b border-ink/10">
          {research.map((item) => (
            <li
              key={item.id}
              className="py-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-serif text-lg">{item.title}</p>
                <p className="text-sm text-muted">
                  {item.status}
                  {item.is_featured ? " \u00B7 Featured" : ""}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <Link
                  href={"/admin/research/" + item.id}
                  className="text-sm text-moss hover:text-moss-dark"
                >
                  Edit
                </Link>
                <DeleteButton id={item.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
