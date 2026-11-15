"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { formatPrice } from "@/lib/format";
import { dmSans, dmSerif } from "../fonts";
import type { TemplateProps } from "../types";
import { ProductSheet, ShareDialog } from "../shared/Dialogs";
import { ShareIcon } from "../shared/Icons";
import { Photo } from "../shared/Photo";
import { SearchBox } from "../shared/SearchBox";
import { SocialRow } from "../shared/Social";
import { useGallery } from "../shared/useGallery";

/** A Pinterest-style masonry wall: photos keep their own shape. */
const theme = {
  "--t-bg": "#f2ece2",
  "--t-card": "#fbf8f2",
  "--t-ink": "#22302b",
  "--t-muted": "#7c8580",
  "--t-line": "#e2dacb",
  "--t-accent": "#2f5d50",
  "--t-accent-ink": "#ffffff",
  "--t-accent-text": "#2f5d50",
  "--t-radius": "14px",
  "--t-radius-lg": "18px",
  "--t-radius-btn": "12px",
  "--t-bw": "0px",
  "--t-border": "transparent",
  "--t-card-shadow": "0 24px 60px rgba(34,48,43,.3)",
  "--t-btn-shadow": "none",
  "--t-head": "var(--font-dmserif), var(--font-bn), Georgia, serif",
} as CSSProperties;

export default function Mosaic({ data, t, links, initialProductId }: TemplateProps) {
  const { shop, products } = data;
  const g = useGallery(products, links, initialProductId);

  return (
    <div
      style={{ ...theme, fontFamily: "var(--font-dmsans), var(--font-bn), system-ui, sans-serif" }}
      className={`${dmSerif.variable} ${dmSans.variable} min-h-screen bg-[var(--t-bg)] text-[var(--t-ink)]`}
    >
      <header className="mx-auto max-w-6xl px-5 pb-6 pt-10 md:pt-14">
        <div className="flex flex-col gap-5 border-b border-[#22302b]/15 pb-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            {shop.name && (
              <h1 className="font-[family-name:var(--t-head)] text-[clamp(38px,8vw,64px)] leading-[1.02] tracking-tight">{shop.name}</h1>
            )}
            {shop.description && <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-[#4f5a55]">{shop.description}</p>}
          </div>
          <SocialRow
            shop={shop}
            className="flex gap-2.5"
            itemClass="grid h-10 w-10 place-items-center rounded-full bg-[var(--t-ink)] text-[#f2ece2] transition hover:bg-[var(--t-accent)]"
          />
        </div>
      </header>

      {g.cats.length > 0 && (
        <div className="sticky top-0 z-10 bg-[color-mix(in_srgb,var(--t-bg)_94%,transparent)] backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-5 py-3 text-[15px] [scrollbar-width:none]">
            {[null, ...g.cats].map((c) => (
              <button
                key={c ?? "all"}
                type="button"
                onClick={() => g.setCat(c)}
                className={`flex-none border-b-2 pb-1 transition ${
                  g.cat === c ? "border-[var(--t-accent)] font-semibold text-[var(--t-ink)]" : "border-transparent text-[var(--t-muted)]"
                }`}
              >
                {c ?? t.all}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-4">
        {g.showSearch && <SearchBox value={g.query} onChange={g.setQuery} t={t} className="mb-6" />}
        {products.length === 0 || g.visible.length === 0 ? (
          <p className="py-16 text-center text-[var(--t-muted)]">{products.length === 0 ? t.noProducts : t.noResults}</p>
        ) : (
          <div className="columns-2 gap-3.5 md:columns-3 md:gap-5 lg:columns-4">
            {g.visible.map((p) => (
              <article key={p.id} className="group relative mb-4 break-inside-avoid md:mb-5">
                <button type="button" onClick={() => g.open(p.id)} className="block w-full text-left">
                  <div
                    className="overflow-hidden rounded-[14px] bg-[var(--t-line)]"
                    style={{ aspectRatio: p.width && p.height ? `${p.width} / ${p.height}` : "4 / 5" }}
                  >
                    <Photo src={p.thumb} alt={p.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                  </div>
                  {(p.name || p.price != null || p.code) && (
                    <div className="px-0.5 pt-2">
                      {p.name && <div className="text-[14px] font-medium leading-snug">{p.name}</div>}
                      <div className="mt-0.5 flex items-baseline justify-between gap-2 text-[13px]">
                        <span className="font-semibold text-[var(--t-accent)]">{formatPrice(p.price, shop.currency)}</span>
                        <span className="text-xs text-[var(--t-muted)]">{p.code}</span>
                      </div>
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => g.share(p.id)}
                  aria-label={`${t.share}: ${p.name || p.code}`}
                  className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-[#fbf8f2]/95 shadow transition hover:scale-105"
                >
                  <ShareIcon className="h-[17px] w-[17px]" />
                </button>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-[#22302b]/15 px-5 py-8 text-center text-xs text-[var(--t-muted)]">
        <Link href="/" target="_top" className="hover:text-[var(--t-ink)]">{t.madeWith}</Link>
      </footer>

      <ProductSheet product={g.active} shop={shop} t={t} onClose={g.close} onShare={g.share} />
      <ShareDialog product={g.sharing} shop={shop} t={t} links={links} onClose={g.closeShare} />
    </div>
  );
}
