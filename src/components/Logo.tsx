import Link from "next/link";

/** The My Product Shelf mark: three little shelves of colour. */
export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#e17738" />
      <rect x="6" y="7" width="8" height="6" rx="1.6" fill="#fff" />
      <rect x="16" y="7" width="10" height="6" rx="1.6" fill="#fff" opacity=".7" />
      <rect x="6" y="15" width="11" height="6" rx="1.6" fill="#fff" opacity=".7" />
      <rect x="19" y="15" width="7" height="6" rx="1.6" fill="#fff" />
      <rect x="6" y="23" width="20" height="2.2" rx="1.1" fill="#fff" />
    </svg>
  );
}

/** "Product" is highlighted: it is the thing the whole service is about. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-black tracking-tight ${className}`}>
      <span className="mr-1">My</span>
      <span className="bg-[linear-gradient(transparent_60%,#f8cfae_60%,#f8cfae_92%,transparent_92%)] px-0.5 text-brand">Product</span>
      <span> Shelf</span>
    </span>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 whitespace-nowrap text-[18px]">
      <LogoMark />
      <Wordmark />
    </Link>
  );
}
