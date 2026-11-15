import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getPublicGallery } from "@/lib/shops";
import { getTemplate } from "@/templates/registry";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = await getPublicGallery((await params).slug);
  if (!g) return {};
  const title = g.shop.name || "My Product Shelf";
  const first = g.data.products.find((p) => p.image);
  return {
    title,
    description: g.shop.description || undefined,
    openGraph: { title, description: g.shop.description || undefined, images: first ? [first.image] : undefined },
  };
}

export default async function GalleryPage({ params }: Props) {
  const { slug } = await params;
  const g = await getPublicGallery(slug);
  if (!g) notFound();
  const { t } = await getDict();
  const { Component } = getTemplate(g.shop.template);
  const base = `/${g.shop.slug}`;
  return <Component data={g.data} t={t.gallery} links={{ share: `${base}/p/{id}`, item: `${base}/p/{id}`, root: base, card: `${base}/p/{id}/card` }} />;
}
