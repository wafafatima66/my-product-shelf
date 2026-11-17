"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { chooseTemplate, saveBusiness } from "@/app/actions";
import type { LivePayload } from "@/app/preview-live/LiveFrame";
import { card } from "@/components/ui";
import { digitsOf, handleOf } from "@/lib/format";
import type { GalleryProduct } from "@/lib/gallery";
import type { Dict } from "@/lib/i18n/en";
import type { DashProduct } from "@/lib/products";
import { DEMO } from "@/templates/demo";
import CopyLink from "../CopyLink";
import BusinessPanel, { type Biz } from "./BusinessPanel";
import ProductsPanel from "./ProductsPanel";

export type TemplateChoice = { id: string; name: string; swatch: [string, string, string] };

type Status = "idle" | "saving" | "saved" | "error";

const priceOf = (v: string): number | null => {
  const s = v.trim().replace(/,/g, "");
  const n = Number(s);
  return s && Number.isFinite(n) && n >= 0 ? n : null;
};

/**
 * The whole setup on one page: business details and products on the left, and the real
 * gallery on the right, redrawn on every keystroke. Everything saves by itself.
 */
export default function Editor({
  shop,
  products,
  templates,
  t,
  email,
}: {
  shop: Biz & { slug: string; template: string };
  products: DashProduct[];
  templates: TemplateChoice[];
  t: Dict["dash"];
  email: string;
}) {
  const [biz, setBiz] = useState<Biz>({
    name: shop.name,
    description: shop.description,
    instagram: shop.instagram,
    facebook: shop.facebook,
    whatsapp: shop.whatsapp,
    messenger: shop.messenger,
    currency: shop.currency,
  });
  const [slug, setSlug] = useState(shop.slug);
  const [savedSlug, setSavedSlug] = useState(shop.slug);
  const [slugDirty, setSlugDirty] = useState(false);
  const [slugError, setSlugError] = useState("");
  const [template, setTemplate] = useState(shop.template);
  const [items, setItems] = useState(products);
  const [status, setStatus] = useState<Status>("idle");
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const slugDirtyRef = useRef(false);
  const frame = useRef<HTMLIFrameElement>(null);

  // ---- saving ----
  async function persist(next: Biz, withSlug: boolean, slugValue: string) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(next)) fd.append(k, v);
    if (withSlug) fd.append("slug", slugValue);
    try {
      const r = await saveBusiness({}, fd);
      if (r.error) {
        if (withSlug) setSlugError(r.error);
        return setStatus("error");
      }
      if (withSlug) {
        slugDirtyRef.current = false;
        setSlugDirty(false);
        setSlugError("");
      }
      // The address follows the name until the seller has products or chooses their own.
      if (r.slug) setSavedSlug(r.slug);
      if (r.slug && !slugDirtyRef.current) setSlug(r.slug);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  function change(patch: Partial<Biz>) {
    const next = { ...biz, ...patch };
    setBiz(next);
    setStatus("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => persist(next, false, ""), 700);
  }

  function changeSlug(v: string) {
    slugDirtyRef.current = true;
    setSlugDirty(true);
    setSlugError("");
    setSlug(v);
  }

  function saveSlug() {
    setStatus("saving");
    persist(biz, true, slug);
  }

  function pickTemplate(id: string) {
    setTemplate(id);
    setStatus("saving");
    chooseTemplate(id).then(() => setStatus("saved"), () => setStatus("error"));
  }

  // ---- live preview ----
  const payload = useMemo<LivePayload>(() => {
    const social = {
      instagram: handleOf(biz.instagram),
      facebook: handleOf(biz.facebook),
      whatsapp: digitsOf(biz.whatsapp),
      messenger: handleOf(biz.messenger),
    };
    if (items.length === 0) {
      // Nothing added yet: show sample products so the template is not an empty page.
      const scale = biz.currency === "BDT" ? 1 : 100;
      const sample = DEMO.products.map((p) => ({ ...p, price: p.price == null ? null : Math.round(p.price / scale) }));
      return {
        type: "live-preview",
        template,
        sample: true,
        data: {
          shop: { ...DEMO.shop, ...social, slug, currency: biz.currency, name: biz.name || DEMO.shop.name, description: biz.description || DEMO.shop.description },
          products: sample,
        },
      };
    }
    const own: GalleryProduct[] = items.map((i) => ({
      id: i.id,
      name: i.name,
      code: i.code,
      price: priceOf(i.price),
      category: "",
      image: i.image,
      thumb: i.thumb,
      width: i.width,
      height: i.height,
    }));
    return {
      type: "live-preview",
      template,
      sample: false,
      data: { shop: { slug, name: biz.name, description: biz.description, currency: biz.currency, ...social }, products: own },
    };
  }, [biz, items, slug, template]);

  const latest = useRef(payload);
  useEffect(() => {
    latest.current = payload;
    frame.current?.contentWindow?.postMessage(payload, window.location.origin);
  }, [payload]);

  // The frame says "ready" once it has loaded, and gets the current data straight away.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== "live-ready") return;
      frame.current?.contentWindow?.postMessage(latest.current, window.location.origin);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const statusText =
    status === "saving" ? t.saving : status === "saved" ? `✓ ${t.allSaved}` : status === "error" ? t.saveFailed : "";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.editorTitle}</h1>
          <p className="mt-1 max-w-2xl text-[15px] text-muted">{t.editorSub}</p>
        </div>
        <span role="status" className={`text-sm font-semibold ${status === "error" ? "text-red-700" : "text-ok"}`}>
          {statusText}
        </span>
      </div>

      {/* On a phone there is room for one or the other. */}
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-full bg-white p-1 shadow-sm lg:hidden" role="tablist">
        {(["edit", "preview"] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`rounded-full py-2 text-sm font-bold transition ${tab === k ? "bg-ink text-white" : "text-ink/70"}`}
          >
            {k === "edit" ? t.editTab : t.previewTab}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className={`${tab === "edit" ? "" : "hidden"} space-y-5 lg:block`}>
          <BusinessPanel
            biz={biz}
            onChange={change}
            slug={slug}
            onSlugChange={changeSlug}
            onSaveSlug={saveSlug}
            slugError={slugError}
            slugDirty={slugDirty}
            t={t}
          />
          <ProductsPanel items={items} setItems={setItems} t={t.products} email={email} />
          <section className={card}>
            <h2 className="mb-3 text-[15px] font-bold">{t.yourLink}</h2>
            <CopyLink path={`/${savedSlug}`} copyLabel={t.copy} copiedLabel={t.copied} />
          </section>
        </div>

        <aside className={`${tab === "preview" ? "" : "hidden"} lg:block`}>
          <div className="lg:sticky lg:top-24">
            <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]" role="radiogroup" aria-label={t.template.title}>
              <span className="flex-none text-[13px] font-bold text-muted">{t.previewBar.switch}</span>
              {templates.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  role="radio"
                  aria-checked={template === x.id}
                  onClick={() => pickTemplate(x.id)}
                  className={`flex flex-none items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-bold transition ${
                    template === x.id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"
                  }`}
                >
                  <span className="flex" aria-hidden>
                    {x.swatch.map((c) => (
                      <i key={c} className="-ml-1 h-3 w-3 rounded-full border border-white/60 first:ml-0" style={{ background: c }} />
                    ))}
                  </span>
                  {x.name}
                </button>
              ))}
            </div>
            <iframe
              ref={frame}
              src="/preview-live"
              title={t.previewTab}
              className="h-[calc(100vh-13rem)] min-h-[480px] w-full rounded-[1.6rem] border-[6px] border-ink bg-white shadow-[0_30px_60px_-25px_rgba(57,53,51,.5)]"
            />
            {items.length === 0 && <p className="mt-3 text-[13px] text-muted">{t.previewBar.empty}</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
