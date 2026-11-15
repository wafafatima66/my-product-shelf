import Link from "next/link";
import type { ReactNode } from "react";

/** [ LABEL ] with an orange sub-line, like a magazine section marker. */
export function Label({ label, sub, light = false }: { label: string; sub: string; light?: boolean }) {
  return (
    <div className={`inline-block border-x-2 px-3.5 py-1 leading-tight ${light ? "border-white" : "border-ink"}`}>
      <div className="font-display text-xl font-black uppercase tracking-wide">{label}</div>
      <div className={`text-[13px] font-bold ${light ? "text-white/85" : "text-brand"}`}>{sub}</div>
    </div>
  );
}

const RAINBOW = ["#e17738", "#4e608f", "#61aea9", "#dabd7f", "#d8604a", "#4e608f", "#e17738", "#61aea9"];

/** A word in many colours (English). Bangla letters join up, so the whole word is one colour. */
export function Rainbow({ text, locale }: { text: string; locale: string }) {
  if (locale !== "en") return <span className="text-brand">{text}</span>;
  return (
    <span aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={i} aria-hidden style={{ color: RAINBOW[i % RAINBOW.length] }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/** A photo in a white frame with a soft shadow, a little crooked. */
export function Frame({ children, className = "", rotate = 0 }: { children: ReactNode; className?: string; rotate?: number }) {
  return (
    <div
      className={`rounded-2xl border border-black/5 bg-white p-1.5 shadow-[0_8px_26px_rgba(57,53,51,.18)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </div>
  );
}

export function Bubble({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-2xl border-2 border-ink bg-white px-4 py-2.5 text-[13.5px] font-bold leading-snug shadow-[0_4px_0_rgba(57,53,51,.2)] ${className}`}
    >
      {children}
      <span aria-hidden className="absolute -bottom-[9px] left-7 h-4 w-4 rotate-45 border-b-2 border-r-2 border-ink bg-white" />
    </div>
  );
}

/** A dark, scalloped stamp with a handwritten word. */
export function Stamp({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grid h-[104px] w-[104px] place-items-center ${className}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <path
          fill="#393533"
          d="M50 2l7 6 9-3 5 8 10 0 1 10 9 4-3 9 6 8-6 8 3 9-9 4-1 10-10 0-5 8-9-3-7 6-7-6-9 3-5-8-10 0-1-10-9-4 3-9-6-8 6-8-3-9 9-4 1-10 10 0 5-8 9 3z"
        />
      </svg>
      <span className="relative -rotate-6 px-2 text-center font-script text-[26px] font-bold leading-[.95] text-white">{children}</span>
    </div>
  );
}

/** The round "scroll down" badge from the reference style, slowly turning. */
export function ScrollBadge({ text }: { text: string }) {
  const ring = `${text} · ${text} · `;
  return (
    <a href="#problem" aria-label={text} className="relative grid h-[104px] w-[104px] place-items-center rounded-full bg-ink text-white shadow-lg">
      <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id="ring" d="M50 50 m-37 0 a37 37 0 1 1 74 0 a37 37 0 1 1 -74 0" />
        </defs>
        <text fill="#fff" fontSize="9.2" fontWeight="700" letterSpacing="1.6">
          <textPath href="#ring">{ring}</textPath>
        </text>
      </svg>
      <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 5v14m0 0l-5-5m5 5l5-5" />
      </svg>
    </a>
  );
}

/** Dark pill button with a white circle and arrow, like the reference site's buttons. */
export function PillLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 rounded-full py-2.5 pl-6 pr-2.5 text-[14.5px] font-bold transition ${
        light ? "bg-white text-ink hover:bg-paper" : "bg-ink text-white hover:bg-black"
      }`}
    >
      {children}
      <span className={`grid h-8 w-8 place-items-center rounded-full ${light ? "bg-ink text-white" : "bg-white text-ink"}`}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12h14m0 0l-5-5m5 5l-5 5" />
        </svg>
      </span>
    </Link>
  );
}

export function Script({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`font-script text-[28px] font-bold leading-none text-brand ${className}`}>{children}</span>;
}
