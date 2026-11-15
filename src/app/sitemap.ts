import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

// Shops come from the database, so build this when asked rather than at build time.
export const dynamic = "force-dynamic";

const SITE = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Only galleries that actually have products are worth indexing.
  const shops = await db.shop.findMany({
    where: { products: { some: {} } },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 5000,
  });
  return [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/signup`, changeFrequency: "monthly", priority: 0.6 },
    ...shops.map((s) => ({
      url: `${SITE}/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
