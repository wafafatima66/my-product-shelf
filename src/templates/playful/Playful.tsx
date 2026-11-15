"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { formatPrice } from "@/lib/format";
import { fredoka, nunito } from "../fonts";
import type { TemplateProps } from "../types";
import { ProductSheet, ShareDialog } from "../shared/Dialogs";
import { ShareIcon } from "../shared/Icons";
import { Photo, initialOf } from "../shared/Photo";
import { SearchBox } from "../shared/SearchBox";
import { SocialRow } from "../shared/Social";
import { useGallery } from "../shared/useGallery";

/** Chunky type, hard shadows, scalloped edges and loud colour. */
const theme = {
  "--t-bg": "#fff3df",
  "--t-card": "#fffaf0",
  "--t-ink": "#2a0f4d",
  "--t-muted": "#7a6590",
  "--t-line": "#ffe3b0",
  "--t-accent": "#c4128f",
  "--t-accent-ink": "#ffffff",
  "--t-accent-text": "#e0360c",
  "--t-radius": "16px",
  "--t-radius-lg": "28px",
  "--t-radius-btn": "16px",
  "--t-bw": "3px",
  "--t-border": "#2a0f4d",
  "--t-card-shadow": "0 8px 0 #2a0f4d",
  "--t-btn-shadow": "0 5px 0 #2a0f4d",
  "--t-head": "var(--font-fredoka), var(--font-bn), system-ui, sans-serif",
} as CSSProperties;

const INK = "#2a0f4d";

export default function Playful({ data, t, links, initialProductId }: TemplateProps) {
  const { shop, products } = data;
  const g = useGallery(products, links, initialProductId);
  const hard = "border-[3px] border-[#2a0f4d] shadow-[0_5px_0_#2a0f4d]";

  return (
    <div
      style={{ ...theme, fontFamily: "var(--font-nunito), var(--font-bn), system-ui, sans-serif" }}
      className={`${fredoka.variable} ${nunito.variable} min-h-screen bg-[var(--t-bg)] font-bold text-[var(--t-ink)]`}
    >
      <header className="relative bg-[#ff4a1c] px-5 pb-16 pt-10 text-center text-white">
        <div
          className="mx-auto mb-4 grid h-[108px] w-[108px] -rotate-[4deg] place-items-center rounded-full border-[5px] border-[#fff3df] bg-[#fff3df] font-[family-name:var(--t-head)] text-4xl font-bold shadow-[0_6px_0_#2a0f4d]"
          style={{ color: INK }}
        >
          {initialOf(shop.name)}
        </div>
        {shop.name && (
          <h1 className="font-[family-name:var(--t-head)] text-[clamp(38px,11vw,64px)] font-bold leading-none text-[#fff3df] [text-shadow:3px_3px_0_#2a0f4d]">
            {shop.name}
          </h1>
        )}
        {shop.instagram && <div className="mt-2 text-sm opacity-95">@{shop.instagram}</div>}
        {shop.description && <p className="mx-auto mt-2.5 max-w-md whitespace-pre-line text-[15px]">{shop.description}</p>}
        <SocialRow
          shop={shop}
          className="mt-5 flex justify-center gap-2.5"
          itemClass={`grid h-11 w-11 place-items-center rounded-full bg-[#fff3df] text-[#2a0f4d] ${hard} !shadow-[0_4px_0_#2a0f4d] transition active:translate-y-[3px]`}
        />
        {/* scalloped edge */}
        <div
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-[26px]"
          style={{
            background: "radial-gradient(circle at 26px 26px, #fff3df 25px, transparent 26px) repeat-x",
            backgroundSize: "52px 26px",
          }}
        />
      </header>

      {g.cats.length > 0 && (
        <div className="sticky top-0 z-10 bg-[var(--t-bg)] py-3">
          <div className="mx-auto flex max-w-5xl justify-start gap-2.5 overflow-x-auto px-5 pb-2 pt-1 md:justify-center [scrollbar-width:none]">
            {[null, ...g.cats].map((c) => (
              <button
                key={c ?? "all"}
                type="button"
                onClick={() => g.setCat(c)}
                className={`flex-none rounded-full px-5 py-2 font-[family-name:var(--t-head)] text-[15px] font-semibold ${hard} !shadow-[0_4px_0_#2a0f4d] transition active:translate-y-[3px] ${
                  g.cat === c ? "bg-[#0d5cab] text-white" : "bg-[#fffaf0]"
                }`}
              >
                {c ?? t.all}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-5 pb-20 pt-5">
        {g.showSearch && <SearchBox value={g.query} onChange={g.setQuery} t={t} className="mb-6" />}
        {products.length === 0 || g.visible.length === 0 ? (
          <p className="py-16 text-center text-[var(--t-muted)]">{products.length === 0 ? t.noProducts : t.noResults}</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-6 md:grid-cols-3 md:gap-x-6 md:gap-y-8 lg:grid-cols-4">
            {g.visible.map((p, i) => (
              <article
                key={p.id}
                className={`relative rounded-3xl bg-[#fffaf0] p-2 pb-3 transition hover:-translate-y-1 hover:rotate-0 ${hard} ${
                  i % 3 === 0 ? "-rotate-1" : i % 3 === 1 ? "rotate-[.8deg]" : ""
                }`}
              >
                <button type="button" onClick={() => g.open(p.id)} className="block w-full text-left">
                  <div className="aspect-square overflow-hidden rounded-2xl bg-[#ffc83d]">
                    <Photo src={p.thumb} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="px-1.5 pt-2.5">
                    {p.name && <div className="font-[family-name:var(--t-head)] text-base font-semibold leading-tight">{p.name}</div>}
                    {(p.price != null || p.code) && (
                      <div className="mt-2 flex items-center justify-between gap-1.5">
                        {p.price != null && (
                          <span className="rounded-full border-2 border-[#2a0f4d] bg-[#ff4a1c] px-2.5 py-0.5 font-[family-name:var(--t-head)] text-[13px] font-semibold text-white">
                            {formatPrice(p.price, shop.currency)}
                          </span>
                        )}
                        <span className="text-xs text-[var(--t-muted)]">{p.code}</span>
                      </div>
                    )}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => g.share(p.id)}
                  aria-label={`${t.share}: ${p.name || p.code}`}
                  className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full border-2 border-[#2a0f4d] bg-[#fff3df] shadow-[0_3px_0_#2a0f4d] transition active:translate-y-0.5"
                >
                  <ShareIcon className="h-[18px] w-[18px]" />
                </button>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-[#2a0f4d] px-5 py-7 text-center text-[13px] text-[#fff3df]">
        <Link href="/" target="_top" className="text-[#ffc83d]">{t.madeWith}</Link>
      </footer>

      <ProductSheet product={g.active} shop={shop} t={t} onClose={g.close} onShare={g.share} />
      <ShareDialog product={g.sharing} shop={shop} t={t} links={links} onClose={g.closeShare} />
    </div>
  );
}
