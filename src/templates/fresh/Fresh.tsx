"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { fraunces, inter } from "../fonts";
import type { TemplateProps } from "../types";
import { ProductSheet, ShareDialog } from "../shared/Dialogs";
import { ShareIcon } from "../shared/Icons";
import { Photo } from "../shared/Photo";
import { SearchBox } from "../shared/SearchBox";
import { SocialRow } from "../shared/Social";
import { useGallery } from "../shared/useGallery";

/** Fresh: a warm family-restaurant feel. Cream paper, forest green, and a ticket-stub orange price. */
const theme = {
  "--t-bg": "#f0ead9",
  "--t-card": "#fbf7ea",
  "--t-ink": "#2a3f27",
  "--t-muted": "#6f7a62",
  "--t-line": "#e0d8bd",
  "--t-accent": "#2a3f27",
  "--t-accent-ink": "#f0ead9",
  "--t-accent-text": "#c76a00",
  "--t-radius": "14px",
  "--t-radius-lg": "22px",
  "--t-radius-btn": "8px",
  "--t-bw": "2px",
  "--t-border": "#2a3f27",
  "--t-card-shadow": "0 18px 50px rgba(42,63,39,.35)",
  "--t-btn-shadow": "none",
  "--t-head": "var(--font-fraunces), var(--font-bn), Georgia, serif",
} as CSSProperties;

const GREEN = "#2a3f27";
const CREAM = "#f0ead9";
const ORANGE = "#fcab10";

export default function Fresh({ data, t, links, initialProductId }: TemplateProps) {
  const { shop, products } = data;
  const g = useGallery(products, links, initialProductId);

  return (
    <div
      style={{ ...theme, fontFamily: "var(--font-inter), var(--font-bn), system-ui, sans-serif" }}
      className={`${fraunces.variable} ${inter.variable} min-h-screen bg-[var(--t-bg)] text-[var(--t-ink)]`}
    >
      {/* green top bar: name on the left, categories as the menu */}
      <header className="sticky top-0 z-20 text-[#f0ead9]" style={{ background: GREEN }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-5 py-3">
          <div className="font-[family-name:var(--t-head)] text-[22px] font-extrabold leading-none">{shop.name || "·"}</div>
          {g.cats.length > 0 && (
            <nav className="flex flex-1 gap-5 overflow-x-auto text-[13px] font-bold uppercase tracking-wider [scrollbar-width:none] md:justify-end">
              {[null, ...g.cats].map((c) => (
                <button
                  key={c ?? "all"}
                  type="button"
                  onClick={() => g.setCat(c)}
                  className={`flex-none border-b-2 py-1.5 transition ${g.cat === c ? "border-[#fcab10]" : "border-transparent opacity-80 hover:opacity-100"}`}
                >
                  {c ?? t.all}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      <section className="px-5 pb-10 pt-14 text-center md:pt-20">
        {shop.name && (
          <h1 className="mx-auto max-w-3xl font-[family-name:var(--t-head)] text-[clamp(38px,7vw,76px)] font-extrabold leading-[1.05]">{shop.name}</h1>
        )}
        {shop.description && <p className="mx-auto mt-4 max-w-xl whitespace-pre-line text-[16px] leading-relaxed text-[#2a3f27]/80">{shop.description}</p>}
        <SocialRow
          shop={shop}
          className="mt-6 flex justify-center gap-3"
          itemClass="grid h-11 w-11 place-items-center rounded-lg border-2 border-[#2a3f27] transition hover:bg-[#2a3f27] hover:text-[#f0ead9]"
        />
      </section>

      <main className="mx-auto max-w-6xl px-5 pb-20">
        {g.showSearch && <SearchBox value={g.query} onChange={g.setQuery} t={t} className="mb-8" />}
        {products.length === 0 || g.visible.length === 0 ? (
          <p className="py-16 text-center text-[var(--t-muted)]">{products.length === 0 ? t.noProducts : t.noResults}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {g.visible.map((p) => (
              <article key={p.id} className="group relative flex flex-col overflow-hidden rounded-[18px] border-2 border-[#2a3f27] bg-[#fbf7ea]">
                <button type="button" onClick={() => g.open(p.id)} className="block w-full text-left">
                  <div className="aspect-[4/3] overflow-hidden border-b-2 border-[#2a3f27]">
                    <Photo src={p.thumb} alt={p.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-3.5">
                    {p.name && <div className="font-[family-name:var(--t-head)] text-[18px] font-extrabold leading-tight">{p.name}</div>}
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      {p.price != null && (
                        // a ticket stub: orange with a dashed inner edge
                        <span
                          className="px-3 py-1 text-[13.5px] font-extrabold"
                          style={{ background: ORANGE, color: GREEN, outline: `2px dashed ${GREEN}`, outlineOffset: -4, borderRadius: 4 }}
                        >
                          {formatPrice(p.price, shop.currency)}
                        </span>
                      )}
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--t-muted)]">{p.code}</span>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => g.share(p.id)}
                  aria-label={`${t.share}: ${p.name || p.code}`}
                  className="absolute right-2.5 top-2.5 grid h-10 w-10 place-items-center rounded-lg border-2 border-[#2a3f27] bg-[#fcab10] text-[#2a3f27] transition hover:scale-105"
                >
                  <ShareIcon className="h-[18px] w-[18px]" />
                </button>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="px-5 py-8 text-center text-xs font-bold uppercase tracking-wider" style={{ background: GREEN, color: CREAM }}>
        <Link href="/" target="_top" className="text-[#fcab10]">{t.madeWith}</Link>
      </footer>

      <ProductSheet product={g.active} shop={shop} t={t} onClose={g.close} onShare={g.share} />
      <ShareDialog product={g.sharing} shop={shop} t={t} links={links} onClose={g.closeShare} />
    </div>
  );
}
