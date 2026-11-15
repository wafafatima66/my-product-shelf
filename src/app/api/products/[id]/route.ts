import { db } from "@/lib/db";
import { clip, parsePrice, shopOrNull, toDash } from "@/lib/products";
import { deleteImage } from "@/lib/storage";

type Ctx = { params: Promise<{ id: string }> };

async function owned(id: string) {
  const shop = await shopOrNull();
  if (!shop) return null;
  return db.product.findFirst({ where: { id, shopId: shop.id } });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const product = await owned((await params).id);
  if (!product) return Response.json({ error: "not_found" }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  if ("name" in body) data.name = clip(body.name, 120);
  if ("code" in body) data.code = clip(body.code, 40);
  if ("category" in body) data.category = clip(body.category, 40);
  if ("price" in body) data.price = parsePrice(body.price);

  const updated = await db.product.update({ where: { id: product.id }, data });
  return Response.json(toDash(updated));
}

export async function DELETE(_: Request, { params }: Ctx) {
  const product = await owned((await params).id);
  if (!product) return Response.json({ error: "not_found" }, { status: 404 });
  await db.product.delete({ where: { id: product.id } });
  if (product.image) await deleteImage(product.image);
  return Response.json({ ok: true });
}
