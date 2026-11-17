import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { chooseTemplate } from "@/app/actions";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { toGallery } from "@/lib/gallery";
import { getDict } from "@/lib/i18n";
import { DEMO } from "@/templates/demo";
import { getTemplate, isTemplate, TEMPLATES } from "@/templates/registry";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Preview · My Product Shelf", robots: { index: false } };

type Props = { params: Promise<{ template: string }>; searchParams: Promise<{ embed?: string }> };

/** Your own gallery inside any template. `?embed=1` hides the top bar (used by the template picker). */
export default async function PreviewPage({ params, searchParams }: Props) {
  const { template } = await params;
  if (!isTemplate(template)) notFound();
  const { embed } = await searchParams;
  const { shop } = await requireUser();
  const { t, locale } = await getDict();

  const products = await db.product.findMany({ where: { shopId: shop.id }, orderBy: [{ createdAt: "desc" }, { id: "desc" }] });
  const own = toGallery(shop, products);
  const sample = products.length === 0;
  const data = sample
    ? {
        shop: { ...DEMO.shop, name: own.shop.name || DEMO.shop.name, description: own.shop.description || DEMO.shop.description, instagram: own.shop.instagram, facebook: own.shop.facebook, whatsapp: own.shop.whatsapp, messenger: own.shop.messenger, slug: own.shop.slug },
        products: DEMO.products,
      }
    : own;

  const { Component } = getTemplate(template);
  const selected = shop.template === template;

  return (
    <>
      {!embed && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-ink px-4 py-2.5 text-[13px] text-white">
          <Link href="/dashboard" className="font-semibold underline-offset-2 hover:underline">← {t.dash.previewBar.back}</Link>
          <span className="rounded bg-brand px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">{t.dash.previewBar.label}</span>
          <span className="hidden text-white/70 md:inline">{sample ? t.dash.previewBar.empty : t.dash.previewBar.hint}</span>
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            <span className="text-white/60">{t.dash.previewBar.switch}:</span>
            {TEMPLATES.map((x) => (
              <a
                key={x.id}
                href={`/preview/${x.id}`}
                className={`rounded-full px-3 py-1 ${x.id === template ? "bg-white text-ink" : "bg-white/10 hover:bg-white/20"}`}
              >
                {x.name}
              </a>
            ))}
            {selected ? (
              <span className="ml-1 rounded-full bg-ok px-3 py-1 font-semibold">✓ {t.dash.template.current}</span>
            ) : (
              <form action={chooseTemplate.bind(null, template)}>
                <button className="ml-1 rounded-full bg-brand px-3 py-1 font-semibold hover:bg-brand-dark">{t.dash.template.use}</button>
              </form>
            )}
          </div>
        </div>
      )}
      <div lang={locale}>
        <Component data={data} t={t.gallery} links={{ share: `/${shop.slug}/p/{id}`, card: sample ? "/demo/card/{id}" : `/${shop.slug}/p/{id}/card` }} />
      </div>
    </>
  );
}
