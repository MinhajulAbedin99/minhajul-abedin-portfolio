import { createClient } from "@/lib/supabase/server";
import DeleteButton from "./DeleteButton";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Messages</h1>

      {!messages || messages.length === 0 ? (
        <p className="text-muted">No messages yet.</p>
      ) : (
        <ul className="divide-y divide-ink/10 border-t border-b border-ink/10">
          {messages.map((msg) => (
            <li key={msg.id} className="py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-serif text-lg">{msg.name}</p>
                  <a
                    href={"mailto:" + msg.email}
                    className="text-sm text-moss hover:text-moss-dark"
                  >
                    {msg.email}
                  </a>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/80 break-words">
                    {msg.message}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="shrink-0">
                  <DeleteButton id={msg.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
