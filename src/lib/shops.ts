import "server-only";
import { db } from "@/lib/db";
import { toGallery } from "@/lib/gallery";

/** A shop's public gallery data, newest products first. Null when the address is unknown. */
export async function getPublicGallery(slug: string) {
  const shop = await db.shop.findUnique({
    where: { slug: slug.toLowerCase() },
    include: { products: { orderBy: [{ createdAt: "desc" }, { id: "desc" }] } },
  });
  if (!shop) return null;
  return { shop, data: toGallery(shop, shop.products) };
}
