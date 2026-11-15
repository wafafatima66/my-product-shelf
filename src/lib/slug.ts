import { db } from "@/lib/db";

/** Paths that must never be used as a shop address. */
export const RESERVED = new Set([
  "dashboard", "login", "signup", "demo", "preview", "media", "api", "admin",
  "_next", "static", "public", "about", "help", "terms", "privacy", "favicon.ico",
]);

export function slugify(input: string) {
  const s = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return s.length >= 3 ? s : "";
}

export const isValidSlug = (s: string) => /^[a-z0-9](?:[a-z0-9-]{1,38})[a-z0-9]$/.test(s) && !RESERVED.has(s);

/** Returns `base`, or `base-2`, `base-3`… until it is free. */
export async function uniqueSlug(base: string, exceptShopId?: string) {
  let root = base && !RESERVED.has(base) ? base : "shop";
  if (root.length < 3) root = `shop-${root}`;
  let slug = root;
  for (let i = 2; ; i++) {
    const hit = await db.shop.findUnique({ where: { slug }, select: { id: true } });
    if (!hit || hit.id === exceptShopId) return slug;
    slug = `${root}-${i}`;
  }
}
