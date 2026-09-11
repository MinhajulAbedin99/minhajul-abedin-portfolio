"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

type NavLink = { href: string; label: string };

export default function MobileNav({ navLinks }: { navLinks: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 md:hidden">
        <ThemeToggle />
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink/70 hover:border-moss hover:text-moss transition-colors"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink/70 hover:text-moss transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>

      {open ? (
        <div className="md:hidden border-t border-ink/10 bg-paper">
          <nav className="mx-auto max-w-5xl px-6 py-5 flex flex-col gap-4 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-ink/80 hover:text-moss transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
