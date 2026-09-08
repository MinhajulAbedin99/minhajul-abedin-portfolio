import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export default async function AdminPublicationsListPage() {
  const supabase = await createClient();
  const { data: publications } = await supabase
    .from("publications")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl">Publications</h1>
        <Link
          href="/admin/publications/new"
          className="bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-moss-dark transition-colors"
        >
          Add publication
        </Link>
      </div>

      {!publications || publications.length === 0 ? (
        <p className="text-muted">No publications yet.</p>
      ) : (
        <ul className="divide-y divide-ink/10 border-t border-b border-ink/10">
          {publications.map((item) => (
            <li
              key={item.id}
              className="py-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-serif text-lg break-words">{item.title}</p>
                <p className="text-sm text-muted">
                  {item.type} {"\u00B7"} {item.venue} {"\u00B7"} {item.status}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <Link
                  href={"/admin/publications/" + item.id}
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
