"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { formatPrice } from "@/lib/format";
import { cormorant, inter } from "../fonts";
import type { TemplateProps } from "../types";
import { ProductSheet, ShareDialog } from "../shared/Dialogs";
import { ShareIcon } from "../shared/Icons";
import { Photo, initialOf } from "../shared/Photo";
import { SearchBox } from "../shared/SearchBox";
import { SocialRow } from "../shared/Social";
import { useGallery } from "../shared/useGallery";

/** Quiet luxury: off-white, thin serif type, a single gold accent. */
const theme = {
  "--t-bg": "#f7f5f1",
  "--t-card": "#ffffff",
  "--t-ink": "#1c1b19",
  "--t-muted": "#85807a",
  "--t-line": "#e9e5de",
  "--t-accent": "#1c1b19",
  "--t-accent-ink": "#ffffff",
  "--t-accent-text": "#8a6d3b",
  "--t-radius": "12px",
  "--t-radius-lg": "20px",
  "--t-radius-btn": "999px",
  "--t-bw": "0px",
  "--t-border": "transparent",
  "--t-card-shadow": "0 20px 60px rgba(0,0,0,.25)",
  "--t-btn-shadow": "none",
  "--t-head": "var(--font-cormorant), var(--font-bn), Georgia, serif",
} as CSSProperties;

export default function Elegant({ data, t, links, initialProductId }: TemplateProps) {
  const { shop, products } = data;
  const g = useGallery(products, links, initialProductId);

  return (
    <div
      style={{ ...theme, fontFamily: "var(--font-inter), var(--font-bn), system-ui, sans-serif" }}
      className={`${cormorant.variable} ${inter.variable} min-h-screen bg-[var(--t-bg)] text-[var(--t-ink)] antialiased`}
    >
      <header className="mx-auto max-w-xl px-5 pb-6 pt-12 text-center">
        <div className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-full border-[3px] border-white bg-[#d9d3c8] font-[family-name:var(--t-head)] text-4xl text-[#3a342c] shadow-[0_2px_14px_rgba(0,0,0,.12)]">
          {initialOf(shop.name)}
        </div>
        {shop.name && <h1 className="font-[family-name:var(--t-head)] text-4xl font-medium tracking-wide">{shop.name}</h1>}
        {shop.instagram && <div className="mt-1 text-[13px] text-[var(--t-muted)]">@{shop.instagram}</div>}
        {shop.description && (
          <p className="mx-auto mt-3 max-w-sm whitespace-pre-line text-[14.5px] leading-relaxed text-[#4b4741]">{shop.description}</p>
        )}
        <SocialRow
          shop={shop}
          className="mt-5 flex justify-center gap-2.5"
          itemClass="grid h-10 w-10 place-items-center rounded-full border border-[var(--t-line)] bg-white transition hover:border-[var(--t-ink)] hover:bg-[var(--t-ink)] hover:text-white"
        />
      </header>

      {g.cats.length > 0 && (
        <div className="sticky top-0 z-10 border-b border-[var(--t-line)] bg-[color-mix(in_srgb,var(--t-bg)_92%,transparent)] backdrop-blur">
          <div className="mx-auto flex max-w-5xl justify-start gap-2 overflow-x-auto px-5 py-3 md:justify-center [scrollbar-width:none]">
            {[null, ...g.cats].map((c) => (
              <button
                key={c ?? "all"}
                type="button"
                onClick={() => g.setCat(c)}
                className={`flex-none rounded-full border px-[18px] py-[7px] text-[13px] tracking-wide transition ${
                  g.cat === c ? "border-[var(--t-ink)] bg-[var(--t-ink)] text-white" : "border-[var(--t-line)]"
                }`}
              >
                {c ?? t.all}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-5 pb-16 pt-6">
        {g.showSearch && <SearchBox value={g.query} onChange={g.setQuery} t={t} className="mb-6" />}
        {products.length === 0 || g.visible.length === 0 ? (
          <p className="py-16 text-center text-[var(--t-muted)]">{products.length === 0 ? t.noProducts : t.noResults}</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-6 md:grid-cols-3 md:gap-x-5 md:gap-y-9 lg:grid-cols-4">
            {g.visible.map((p) => (
              <article key={p.id} className="group relative">
                <button type="button" onClick={() => g.open(p.id)} className="block w-full text-left">
                  <div className="aspect-[4/5] overflow-hidden rounded-xl">
                    <Photo src={p.thumb} alt={p.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="pt-2.5">
                    {p.name && <div className="text-[13.5px] leading-snug">{p.name}</div>}
                    {(p.price != null || p.code) && (
                      <div className="mt-0.5 flex justify-between gap-2 text-[13px]">
                        <span className="font-medium text-[var(--t-accent-text)]">{formatPrice(p.price, shop.currency)}</span>
                        <span className="text-xs tracking-wide text-[var(--t-muted)]">{p.code}</span>
                      </div>
                    )}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => g.share(p.id)}
                  aria-label={`${t.share}: ${p.name || p.code}`}
                  className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow transition hover:bg-white"
                >
                  <ShareIcon className="h-[17px] w-[17px]" />
                </button>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-[var(--t-line)] px-5 py-8 text-center text-xs text-[var(--t-muted)]">
        <Link href="/" target="_top" className="hover:text-[var(--t-ink)]">{t.madeWith}</Link>
      </footer>

      <ProductSheet product={g.active} shop={shop} t={t} onClose={g.close} onShare={g.share} />
      <ShareDialog product={g.sharing} shop={shop} t={t} links={links} onClose={g.closeShare} />
    </div>
  );
}
