import "server-only";
import type { Product } from "@prisma/client";
import { getUser } from "@/lib/auth";
import { mediaUrl } from "@/lib/media";

/** What the dashboard needs for one product row (and for the live preview). */
export type DashProduct = {
  id: string;
  name: string;
  code: string;
  price: string; // kept as text so the field can be blank
  thumb: string;
  image: string;
  width: number;
  height: number;
};

export const toDash = (p: Product): DashProduct => ({
  id: p.id,
  name: p.name,
  code: p.code,
  price: p.price == null ? "" : String(p.price),
  thumb: mediaUrl(p.image, true),
  image: mediaUrl(p.image),
  width: p.width,
  height: p.height,
});

export function parsePrice(v: unknown): number | null {
  const s = String(v ?? "").trim().replace(/,/g, "");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 && n < 1e10 ? n : null;
}

export const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

/** The logged-in user's shop for route handlers (no redirects). */
export async function shopOrNull() {
  const user = await getUser();
  return user?.shop ?? null;
}

export const MAX_UPLOAD = 15 * 1024 * 1024;
