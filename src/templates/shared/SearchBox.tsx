"use client";

import type { Dict } from "@/lib/i18n/en";

/** Find a product by name or code, so nobody has to scroll to look for it. Styled by the template's CSS variables. */
export function SearchBox({
  value,
  onChange,
  t,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  t: Dict["gallery"];
  className?: string;
}) {
  return (
    <div className={`relative mx-auto w-full max-w-md ${className}`}>
      <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--t-muted)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.search}
        aria-label={t.search}
        className="w-full rounded-[var(--t-radius-btn)] border-2 border-[var(--t-line)] bg-[var(--t-card)] py-2.5 pl-11 pr-4 text-[15px] text-[var(--t-ink)] outline-none placeholder:text-[var(--t-muted)] focus:border-[var(--t-accent)]"
      />
    </div>
  );
}
