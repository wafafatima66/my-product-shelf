"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { archivoBlack, inter } from "../fonts";
import type { TemplateProps } from "../types";
import { ProductSheet, ShareDialog } from "../shared/Dialogs";
import { ShareIcon } from "../shared/Icons";
import { Photo } from "../shared/Photo";
import { SearchBox } from "../shared/SearchBox";
import { SocialRow } from "../shared/Social";
import { useGallery } from "../shared/useGallery";

/** Bento: grid paper, chunky black type and flat colour tiles. */
const theme = {
  "--t-bg": "#f6ebe1",
  "--t-card": "#ffffff",
  "--t-ink": "#0b0b0b",
  "--t-muted": "#6b625a",
  "--t-line": "#e9dccd",
  "--t-accent": "#0b0b0b",
  "--t-accent-ink": "#ffffff",
  "--t-accent-text": "#0b6df2",
  "--t-radius": "22px",
  "--t-radius-lg": "32px",
  "--t-radius-btn": "999px",
  "--t-bw": "0px",
  "--t-border": "transparent",
  "--t-card-shadow": "0 24px 70px rgba(0,0,0,.3)",
  "--t-btn-shadow": "none",
  "--t-head": "var(--font-archivoblack), var(--font-bn), Impact, sans-serif",
} as CSSProperties;

/** Tile colour and the text colour that reads well on it. */
const TILES = [
  { bg: "#a855f7", fg: "#ffffff" }, // purple
  { bg: "#ffb400", fg: "#0b0b0b" }, // amber
  { bg: "#0b6df2", fg: "#ffffff" }, // blue
  { bg: "#ff5c00", fg: "#0b0b0b" }, // orange
  { bg: "#0aa14b", fg: "#ffffff" }, // green
  { bg: "#e53935", fg: "#ffffff" }, // red
];

const gridPaper: CSSProperties = {
  backgroundImage:
    "linear-gradient(#0b0b0b33 1px, transparent 1px), linear-gradient(90deg, #0b0b0b33 1px, transparent 1px)",
  backgroundSize: "44px 44px",
};

export default function Bento({ data, t, links, initialProductId }: TemplateProps) {
  const { shop, products } = data;
  const g = useGallery(products, links, initialProductId);

  return (
    <div
      style={{ ...theme, fontFamily: "var(--font-inter), var(--font-bn), system-ui, sans-serif" }}
      className={`${archivoBlack.variable} ${inter.variable} min-h-screen bg-[var(--t-bg)] text-[var(--t-ink)]`}
    >
      <header className="mx-auto max-w-6xl px-5 pb-6 pt-8 md:pt-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          {shop.name && (
            <h1 className="break-words font-[family-name:var(--t-head)] text-[clamp(44px,11vw,120px)] leading-[.9] tracking-tight">
              {shop.name}
              <span className="text-[#0b6df2]">.</span>
            </h1>
          )}
          <SocialRow
            shop={shop}
            className="flex gap-2 rounded-full bg-[#0b0b0b] p-2"
            itemClass="grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white hover:text-[#0b0b0b]"
          />
        </div>
        {shop.description && <p className="mt-5 max-w-xl whitespace-pre-line text-[16px] font-medium leading-snug">{shop.description}</p>}
      </header>

      {g.cats.length > 0 && (
        <div className="sticky top-0 z-10 bg-[color-mix(in_srgb,var(--t-bg)_92%,transparent)] py-3 backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-2.5 overflow-x-auto px-5 [scrollbar-width:none]">
            {[null, ...g.cats].map((c, i) => {
              const tile = TILES[i % TILES.length];
              const on = g.cat === c;
              return (
                <button
                  key={c ?? "all"}
                  type="button"
                  onClick={() => g.setCat(c)}
                  style={{ background: on ? tile.bg : "#fff", color: on ? tile.fg : "#0b0b0b" }}
                  className="flex-none rounded-full px-6 py-3 font-[family-name:var(--t-head)] text-[15px] transition active:scale-95"
                >
                  {c ?? t.all}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-5 pb-10 pt-4" style={gridPaper}>
        {g.showSearch && <SearchBox value={g.query} onChange={g.setQuery} t={t} className="mb-6" />}
        {products.length === 0 || g.visible.length === 0 ? (
          <p className="py-16 text-center text-[var(--t-muted)]">{products.length === 0 ? t.noProducts : t.noResults}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {g.visible.map((p, i) => {
              const tile = TILES[i % TILES.length];
              return (
                <article key={p.id} className="relative rounded-[28px] p-2.5" style={{ background: tile.bg, color: tile.fg }}>
                  <button type="button" onClick={() => g.open(p.id)} className="block w-full text-left">
                    <div className="aspect-square overflow-hidden rounded-[20px] bg-white/30">
                      <Photo src={p.thumb} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="px-1.5 pb-1 pt-3">
                      {p.name && <div className="font-[family-name:var(--t-head)] text-[17px] leading-tight">{p.name}</div>}
                      <div className="mt-2 flex items-center justify-between gap-2">
                        {p.price != null && (
                          <span className="rounded-full bg-[#0b0b0b] px-3 py-1 text-[13px] font-bold text-white">{formatPrice(p.price, shop.currency)}</span>
                        )}
                        <span className="text-xs font-bold opacity-75">{p.code}</span>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => g.share(p.id)}
                    aria-label={`${t.share}: ${p.name || p.code}`}
                    className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-[#0b0b0b] text-white transition hover:scale-105"
                  >
                    <ShareIcon className="h-[18px] w-[18px]" />
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <footer className="overflow-hidden px-5 pb-6 pt-8">
        {shop.name && (
          <div className="mx-auto max-w-6xl break-words font-[family-name:var(--t-head)] text-[clamp(56px,16vw,180px)] leading-[.85] tracking-tight">
            {shop.name}
            <span className="text-[#e53935]">.</span>
          </div>
        )}
        <div className="mx-auto mt-6 flex max-w-6xl items-center justify-between text-xs font-bold text-[var(--t-muted)]">
          <Link href="/" target="_top" className="hover:text-[var(--t-ink)]">{t.madeWith}</Link>
        </div>
      </footer>

      <ProductSheet product={g.active} shop={shop} t={t} onClose={g.close} onShare={g.share} />
      <ShareDialog product={g.sharing} shop={shop} t={t} links={links} onClose={g.closeShare} />
    </div>
  );
}
