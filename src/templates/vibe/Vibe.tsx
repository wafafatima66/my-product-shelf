"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { inter, unbounded } from "../fonts";
import type { TemplateProps } from "../types";
import { ProductSheet, ShareDialog } from "../shared/Dialogs";
import { ShareIcon } from "../shared/Icons";
import { Photo } from "../shared/Photo";
import { SearchBox } from "../shared/SearchBox";
import { SocialRow } from "../shared/Social";
import { useGallery } from "../shared/useGallery";

/** Vibe: loud and young. Wide bold type, angled photo cuts and big flat colour. */
const theme = {
  "--t-bg": "#f6f6f6",
  "--t-card": "#ffffff",
  "--t-ink": "#330a05",
  "--t-muted": "#8a6b66",
  "--t-line": "#ece6e4",
  "--t-accent": "#ff4421",
  "--t-accent-ink": "#ffffff",
  "--t-accent-text": "#e63a18",
  "--t-radius": "18px",
  "--t-radius-lg": "26px",
  "--t-radius-btn": "12px",
  "--t-bw": "0px",
  "--t-border": "transparent",
  "--t-card-shadow": "0 24px 70px rgba(51,10,5,.4)",
  "--t-btn-shadow": "none",
  "--t-head": "var(--font-unbounded), var(--font-bn), system-ui, sans-serif",
} as CSSProperties;

const COLORS = ["#ff4421", "#2f7d5b", "#330a05", "#0b7fc7"];

/** The photo fills the top right and is cut on a slant; the colour shows through underneath. */
const SLANT = "polygon(32% 0, 100% 0, 100% 56%, 0 72%, 0 32%)";

export default function Vibe({ data, t, links, initialProductId }: TemplateProps) {
  const { shop, products } = data;
  const g = useGallery(products, links, initialProductId);

  return (
    <div
      style={{ ...theme, fontFamily: "var(--font-inter), var(--font-bn), system-ui, sans-serif" }}
      className={`${unbounded.variable} ${inter.variable} min-h-screen bg-[var(--t-bg)] text-[var(--t-ink)]`}
    >
      <header className="relative overflow-hidden px-5 pb-10 pt-8 md:pb-14">
        {/* the shop name as a huge, faint backdrop */}
        {shop.name && (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-6 select-none break-words text-center font-[family-name:var(--t-head)] text-[clamp(56px,15vw,190px)] font-extrabold uppercase leading-[.95] text-[#330a05]/[.07]">
            {shop.name}
          </div>
        )}
        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-xl bg-[#ff4421] px-5 py-3 text-[13px] font-extrabold uppercase tracking-wide text-white">{shop.name || "·"}</span>
            <SocialRow
              shop={shop}
              className="flex gap-2"
              itemClass="grid h-11 w-11 place-items-center rounded-xl bg-[#330a05] text-white transition hover:bg-[#ff4421]"
            />
          </div>
          <div className="mt-14 max-w-3xl md:mt-24">
            {shop.name && (
              <h1 className="font-[family-name:var(--t-head)] text-[clamp(30px,6vw,64px)] font-extrabold uppercase leading-[1.05]">{shop.name}</h1>
            )}
            {shop.description && (
              <p className="mt-4 max-w-xl whitespace-pre-line text-[15px] font-semibold uppercase leading-snug tracking-wide text-[#ff4421]">{shop.description}</p>
            )}
          </div>
        </div>
      </header>

      {g.cats.length > 0 && (
        <div className="sticky top-0 z-10 bg-[#f6f6f6]/95 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 [scrollbar-width:none]">
            {[null, ...g.cats].map((c) => (
              <button
                key={c ?? "all"}
                type="button"
                onClick={() => g.setCat(c)}
                className={`flex-none rounded-xl px-5 py-2.5 text-[12.5px] font-extrabold uppercase tracking-wide transition ${
                  g.cat === c ? "bg-[#ff4421] text-white" : "bg-[#330a05] text-white/90"
                }`}
              >
                {c ?? t.all}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-6">
        {g.showSearch && <SearchBox value={g.query} onChange={g.setQuery} t={t} className="mb-6" />}
        {products.length === 0 || g.visible.length === 0 ? (
          <p className="py-16 text-center text-[var(--t-muted)]">{products.length === 0 ? t.noProducts : t.noResults}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.visible.map((p, i) => {
              const bg = COLORS[i % COLORS.length];
              return (
                <article key={p.id} className="relative aspect-[4/5] overflow-hidden rounded-[22px] text-white" style={{ background: bg }}>
                  <button type="button" onClick={() => g.open(p.id)} className="absolute inset-0 block h-full w-full text-left">
                    <div className="absolute inset-0 bg-black/10" style={{ clipPath: SLANT }}>
                      <Photo src={p.thumb} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      {p.name && <div className="font-[family-name:var(--t-head)] text-[clamp(17px,2.2vw,22px)] font-extrabold leading-tight">{p.name}</div>}
                      <div className="mt-2 flex items-center gap-3 text-[13px] font-bold">
                        {p.price != null && <span className="rounded-lg bg-white px-3 py-1 text-[#330a05]">{formatPrice(p.price, shop.currency)}</span>}
                        <span className="opacity-80">{p.code}</span>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => g.share(p.id)}
                    aria-label={`${t.share}: ${p.name || p.code}`}
                    className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-[#330a05] shadow-lg transition hover:scale-105"
                  >
                    <ShareIcon className="h-[18px] w-[18px]" />
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <footer className="overflow-hidden bg-black px-5 pb-6 pt-10 text-white">
        {shop.name && (
          <div className="mx-auto max-w-6xl break-words font-[family-name:var(--t-head)] text-[clamp(40px,12vw,150px)] font-extrabold uppercase leading-[.9] text-[#ff4421]">
            {shop.name}.
          </div>
        )}
        <div className="mx-auto mt-6 max-w-6xl text-xs font-bold uppercase tracking-wider text-white/60">
          <Link href="/" target="_top" className="hover:text-white">{t.madeWith}</Link>
        </div>
      </footer>

      <ProductSheet product={g.active} shop={shop} t={t} onClose={g.close} onShare={g.share} />
      <ShareDialog product={g.sharing} shop={shop} t={t} links={links} onClose={g.closeShare} />
    </div>
  );
}
