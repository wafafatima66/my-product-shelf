"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { inter, instrumentSerif } from "../fonts";
import type { TemplateProps } from "../types";
import { ProductSheet, ShareDialog } from "../shared/Dialogs";
import { ShareIcon } from "../shared/Icons";
import { Photo } from "../shared/Photo";
import { SearchBox } from "../shared/SearchBox";
import { SocialRow } from "../shared/Social";
import { useGallery } from "../shared/useGallery";

/** Bistro: deep wine red, a tall editorial serif with an italic accent, tilted cards and a moving ticker. */
const theme = {
  "--t-bg": "#f3f1ee",
  "--t-card": "#f3f1ee",
  "--t-ink": "#5b1c24",
  "--t-muted": "#8c5a60",
  "--t-line": "#e5d9d6",
  "--t-accent": "#ff3b47",
  "--t-accent-ink": "#ffffff",
  "--t-accent-text": "#e11d2e",
  "--t-radius": "18px",
  "--t-radius-lg": "26px",
  "--t-radius-btn": "999px",
  "--t-bw": "0px",
  "--t-border": "transparent",
  "--t-card-shadow": "0 24px 70px rgba(0,0,0,.45)",
  "--t-btn-shadow": "none",
  "--t-head": "var(--font-instrument), var(--font-bn), Georgia, serif",
} as CSSProperties;

const WINE = "#69232b";

export default function Bistro({ data, t, links, initialProductId }: TemplateProps) {
  const { shop, products } = data;
  const g = useGallery(products, links, initialProductId);

  // "Noor Atelier" -> "Noor" in white, "Atelier" in red italic.
  const words = shop.name.trim().split(/\s+/).filter(Boolean);
  const last = words.length > 1 ? words[words.length - 1] : "";
  const first = words.length > 1 ? words.slice(0, -1).join(" ") : shop.name;
  const ticker = `${shop.name || "•"}  ·  ${t.share}  ·  `;

  return (
    <div
      style={{ ...theme, fontFamily: "var(--font-inter), var(--font-bn), system-ui, sans-serif" }}
      className={`${instrumentSerif.variable} ${inter.variable} min-h-screen bg-[var(--t-bg)] text-[var(--t-ink)]`}
    >
      {/* ticker */}
      <div className="overflow-hidden bg-[#ff3b47] py-2 text-[13px] font-bold uppercase tracking-wide text-[#69232b]" aria-hidden>
        <div className="marquee">
          {[0, 1].map((n) => (
            <span key={n} className="flex whitespace-pre">
              {Array.from({ length: 8 }, (_, i) => <span key={i}>{ticker}</span>)}
            </span>
          ))}
        </div>
      </div>

      <header className="relative px-5 pb-16 pt-10 text-center text-white md:pb-24 md:pt-14" style={{ background: WINE }}>
        <SocialRow
          shop={shop}
          className="mb-8 flex justify-center gap-5 text-[#ff3b47]"
          itemClass="grid h-10 w-10 place-items-center rounded-full border border-[#ff3b47]/60 transition hover:bg-[#ff3b47] hover:text-[#69232b]"
        />
        {shop.name && (
          <h1 className="mx-auto max-w-4xl font-[family-name:var(--t-head)] text-[clamp(48px,11vw,128px)] leading-[.92] tracking-tight">
            {first}
            {last && (
              <>
                <br />
                <em className="text-[#ff3b47]">{last}</em>
              </>
            )}
          </h1>
        )}
        {shop.description && (
          <p className="mx-auto mt-6 max-w-lg whitespace-pre-line text-[13.5px] font-semibold uppercase leading-relaxed tracking-wide text-white/90">
            {shop.description}
          </p>
        )}
      </header>

      {g.cats.length > 0 && (
        <div className="sticky top-0 z-10 bg-[#f3f1ee]/95 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-5xl justify-start gap-2 overflow-x-auto px-5 md:justify-center [scrollbar-width:none]">
            {[null, ...g.cats].map((c) => (
              <button
                key={c ?? "all"}
                type="button"
                onClick={() => g.setCat(c)}
                className={`flex-none rounded-full border px-5 py-2 text-[13px] font-bold uppercase tracking-wide transition ${
                  g.cat === c ? "border-[#ff3b47] bg-[#ff3b47] text-white" : "border-[#69232b]/30 text-[#69232b]"
                }`}
              >
                {c ?? t.all}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10">
        {g.showSearch && <SearchBox value={g.query} onChange={g.setQuery} t={t} className="mb-10" />}
        {products.length === 0 || g.visible.length === 0 ? (
          <p className="py-16 text-center text-[var(--t-muted)]">{products.length === 0 ? t.noProducts : t.noResults}</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
            {g.visible.map((p, i) => (
              <article
                key={p.id}
                className="group relative transition duration-300 hover:rotate-0"
                style={{ transform: `rotate(${[-2.5, 1.5, -1, 2.5][i % 4]}deg)` }}
              >
                <button type="button" onClick={() => g.open(p.id)} className="block w-full text-left">
                  <div className="aspect-[3/4] overflow-hidden rounded-[22px] rounded-tr-[64px] bg-[#e5d9d6] shadow-[0_14px_30px_rgba(105,35,43,.22)]">
                    <Photo src={p.thumb} alt={p.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="px-1 pt-3">
                    {p.name && <div className="font-[family-name:var(--t-head)] text-[24px] leading-[1.05]">{p.name}</div>}
                    <div className="mt-1 flex items-baseline justify-between gap-2">
                      {p.price != null && (
                        <em className="font-[family-name:var(--t-head)] text-[22px] text-[#ff3b47]">{formatPrice(p.price, shop.currency)}</em>
                      )}
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--t-muted)]">{p.code}</span>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => g.share(p.id)}
                  aria-label={`${t.share}: ${p.name || p.code}`}
                  className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-[#ff3b47] text-white shadow-lg transition hover:scale-105"
                >
                  <ShareIcon className="h-[18px] w-[18px]" />
                </button>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="px-5 py-8 text-center text-xs font-bold uppercase tracking-wider text-white" style={{ background: WINE }}>
        <Link href="/" target="_top" className="text-[#ff3b47]">{t.madeWith}</Link>
      </footer>

      <ProductSheet product={g.active} shop={shop} t={t} onClose={g.close} onShare={g.share} />
      <ShareDialog product={g.sharing} shop={shop} t={t} links={links} onClose={g.closeShare} />
    </div>
  );
}
