"use client";

import { useState } from "react";
import Link from "next/link";

type Project = {
  id: number;
  title: string;
  description: string | null;
  technologies: string | null;
  tags: string[] | null;
  categories: string[] | null;
  image_urls: string[] | null;
};

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const allCategories = Array.from(
    new Set(projects.flatMap((p) => p.categories ?? [])),
  );
  const [activeTag, setActiveTag] = useState("All");

  const visible =
    activeTag === "All"
      ? projects
      : projects.filter((p) => (p.categories ?? []).includes(activeTag));

  return (
    <section className="border-t border-ink/10">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {allCategories.length > 0 ? (
          <div className="flex flex-wrap gap-3 mb-10">
            {["All", ...allCategories].map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={
                  activeTag === tag
                    ? "rounded-full bg-ink px-4 py-1.5 text-sm text-paper"
                    : "rounded-full border border-ink/15 px-4 py-1.5 text-sm text-ink/70 hover:border-moss hover:text-moss transition-colors"
                }
              >
                {tag}
              </button>
            ))}
          </div>
        ) : null}

        {visible.length === 0 ? (
          <p className="text-muted">No projects in this category yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {visible.map((project) => (
              <Link
                key={project.id}
                href={"/projects/" + project.id}
                className="block border border-ink/10 hover:border-moss transition-colors"
              >
                {project.image_urls && project.image_urls[0] ? (
                  <img
                    src={project.image_urls[0]}
                    alt={project.title}
                    className="w-full aspect-video object-cover"
                  />
                ) : null}
                <div className="p-5">
                  <p className="font-serif text-xl">{project.title}</p>
                  {project.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-ink/70 line-clamp-2">
                      {project.description}
                    </p>
                  ) : null}
                  {project.tags && project.tags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-ink/10 px-3 py-1 text-xs text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
