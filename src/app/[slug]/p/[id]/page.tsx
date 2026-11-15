import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { getDict } from "@/lib/i18n";
import { getPublicGallery } from "@/lib/shops";
import { getTemplate } from "@/templates/registry";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; id: string }> };

/** The page a shared product link opens: the shop gallery with that product already open. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, id } = await params;
  const g = await getPublicGallery(slug);
  const p = g?.data.products.find((x) => x.id === id);
  if (!g || !p) return {};
  const title = [p.name || p.code, g.shop.name].filter(Boolean).join(" · ");
  const description = [p.code, formatPrice(p.price, g.shop.currency)].filter(Boolean).join(" · ") || undefined;
  // The link preview is the designed share card, not the bare photo.
  const card = `/${g.shop.slug}/p/${id}/card`;
  const images = [{ url: card, width: 1200, height: 630, alt: title }];
  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: "summary_large_image", title, description, images: [card] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug, id } = await params;
  const g = await getPublicGallery(slug);
  if (!g || !g.data.products.some((p) => p.id === id)) notFound();
  const { t } = await getDict();
  const { Component } = getTemplate(g.shop.template);
  const base = `/${g.shop.slug}`;
  return (
    <Component
      data={g.data}
      t={t.gallery}
      links={{ share: `${base}/p/{id}`, item: `${base}/p/{id}`, root: base, card: `${base}/p/{id}/card` }}
      initialProductId={id}
    />
  );
}
