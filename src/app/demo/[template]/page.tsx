import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { DEMO } from "@/templates/demo";
import { isTemplate, getTemplate } from "@/templates/registry";

type Props = { params: Promise<{ template: string }>; searchParams: Promise<{ p?: string }> };

export const metadata: Metadata = { title: "Demo gallery · My Product Shelf", robots: { index: false } };

export default async function DemoPage({ params, searchParams }: Props) {
  const { template } = await params;
  if (!isTemplate(template)) notFound();
  const { p } = await searchParams;
  const { t } = await getDict();
  const { Component } = getTemplate(template);
  return (
    <Component
      data={DEMO}
      t={t.gallery}
      links={{ share: `/demo/${template}?p={id}`, card: "/demo/card/{id}" }}
      initialProductId={p}
    />
  );
}
