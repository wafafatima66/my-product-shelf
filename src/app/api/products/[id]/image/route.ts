import { db } from "@/lib/db";
import { MAX_UPLOAD, shopOrNull, toDash } from "@/lib/products";
import { deleteImage, saveImage } from "@/lib/storage";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const shop = await shopOrNull();
  if (!shop) return Response.json({ error: "unauthorized" }, { status: 401 });
  const product = await db.product.findFirst({ where: { id: (await params).id, shopId: shop.id } });
  if (!product) return Response.json({ error: "not_found" }, { status: 404 });

  const file = (await req.formData()).get("image");
  if (!(file instanceof File) || file.size === 0) return Response.json({ error: "bad_image" }, { status: 400 });
  if (file.size > MAX_UPLOAD) return Response.json({ error: "too_big" }, { status: 413 });

  let image;
  try {
    image = await saveImage(Buffer.from(await file.arrayBuffer()));
  } catch (e) {
    if (e instanceof Error && e.message === "bad_image") return Response.json({ error: "bad_image" }, { status: 400 });
    console.error("photo upload failed (storage)", e);
    return Response.json({ error: "storage" }, { status: 500 });
  }

  const updated = await db.product.update({
    where: { id: product.id },
    data: { image: image.key, width: image.width, height: image.height },
  });
  if (product.image) await deleteImage(product.image);
  return Response.json(toDash(updated));
}
