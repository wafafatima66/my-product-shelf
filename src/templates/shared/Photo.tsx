import { ImageIcon } from "./Icons";

/** A product photo, or a quiet placeholder when the product has none. */
export function Photo({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={`grid place-items-center bg-[var(--t-line)] text-[var(--t-muted)] ${className}`} aria-hidden>
        <ImageIcon className="h-8 w-8 opacity-50" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" decoding="async" className={`bg-[var(--t-line)] ${className}`} />;
}

export const initialOf = (name: string) =>
  (name.trim().split(/\s+/).slice(0, 2).map((w) => Array.from(w)[0] ?? "").join("") || "★").toUpperCase();
