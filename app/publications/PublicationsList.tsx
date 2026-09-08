"use client";

import { useState } from "react";

type Publication = {
  id: number;
  title: string;
  type: string;
  authors: string | null;
  venue: string | null;
  status: string | null;
  description: string | null;
  url: string | null;
  is_first_author: boolean | null;
};

const dot = "\u00B7";

const filters = [
  { key: "all", label: "All" },
  { key: "paper", label: "Papers" },
  { key: "dataset", label: "Datasets" },
];

export default function PublicationsList({
  publications,
}: {
  publications: Publication[];
}) {
  const [activeFilter, setActiveFilter] = useState("all");

  const visible =
    activeFilter === "all"
      ? publications
      : publications.filter((pub) => pub.type === activeFilter);

  return (
    <section className="border-t border-ink/10">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex gap-6 mb-10 text-sm">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={
                activeFilter === f.key
                  ? "text-ink font-medium border-b-2 border-moss pb-1"
                  : "text-muted hover:text-ink pb-1 transition-colors"
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="text-muted">No entries in this category yet.</p>
        ) : (
          <ul className="divide-y divide-ink/10">
            {visible.map((pub) => (
              <li key={pub.id} className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-xl leading-snug">
                      {pub.title}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {pub.authors}
                      {pub.venue ? " " + dot + " " + pub.venue : ""}
                      {pub.status
                        ? " " + dot + " " + pub.status.replace("_", " ")
                        : ""}
                    </p>
                    {pub.description ? (
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
                        {pub.description}
                      </p>
                    ) : null}
                  </div>
                  <span className="shrink-0 rounded-full border border-ink/10 px-3 py-1 text-xs text-muted">
                    {pub.type === "dataset" ? "Dataset" : "Paper"}
                  </span>
                </div>
                {pub.url ? (
                  <a
                    href={pub.url}
                    className="mt-3 inline-block text-sm text-moss hover:text-moss-dark"
                  >
                    View link
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
