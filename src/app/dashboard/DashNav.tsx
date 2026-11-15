"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashNav({ items }: { items: { href: string; label: string; exact?: boolean }[] }) {
  const path = usePathname();
  return (
    <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-3 [scrollbar-width:none]" aria-label="Dashboard">
      {items.map((i) => {
        const on = i.exact ? path === i.href : path.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={on ? "page" : undefined}
            className={`flex-none border-b-2 px-3 py-2.5 text-sm font-semibold transition ${
              on ? "border-brand text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
