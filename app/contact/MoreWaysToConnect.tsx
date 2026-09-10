"use client";

import { useState } from "react";
import { Link as LinkIcon, ChevronDown, ChevronUp } from "lucide-react";

type SocialLink = {
  id: number;
  label: string;
  url: string;
  display_text: string | null;
  icon_url: string | null;
};

export default function MoreWaysToConnect({ links }: { links: SocialLink[] }) {
  const [open, setOpen] = useState(false);

  if (links.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-moss hover:text-moss-dark transition-colors"
      >
        More ways to connect
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open ? (
        <div className="mt-5 space-y-4">
          {links.map((link) =>
            link.url ? (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 hover:text-moss transition-colors"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/70">
                  {link.icon_url ? (
                    <img
                      src={link.icon_url}
                      alt=""
                      className="h-5 w-5 object-cover rounded"
                    />
                  ) : (
                    <LinkIcon size={16} />
                  )}
                </span>
                <p className="font-serif text-lg">
                  {link.display_text || link.label}
                </p>
              </a>
            ) : (
              <div key={link.id} className="flex items-center gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/70">
                  {link.icon_url ? (
                    <img
                      src={link.icon_url}
                      alt=""
                      className="h-5 w-5 object-cover rounded"
                    />
                  ) : (
                    <LinkIcon size={16} />
                  )}
                </span>
                <p className="font-serif text-lg">
                  {link.display_text || link.label}
                </p>
              </div>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
