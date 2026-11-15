import { db } from "@/lib/db";
import { clip, MAX_UPLOAD, parsePrice, shopOrNull, toDash } from "@/lib/products";
import { saveImage } from "@/lib/storage";

export async function POST(req: Request) {
  const shop = await shopOrNull();
  if (!shop) return Response.json({ error: "unauthorized" }, { status: 401 });

  const fd = await req.formData();
  const file = fd.get("image");
  let image = { key: "", width: 0, height: 0 };

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_UPLOAD) return Response.json({ error: "too_big" }, { status: 413 });
    try {
      image = await saveImage(Buffer.from(await file.arrayBuffer()));
    } catch {
      return Response.json({ error: "bad_image" }, { status: 400 });
    }
  }

  const product = await db.product.create({
    data: {
      shopId: shop.id,
      image: image.key,
      width: image.width,
      height: image.height,
      name: clip(fd.get("name"), 120),
      code: clip(fd.get("code"), 40),
      price: parsePrice(fd.get("price")),
      category: clip(fd.get("category"), 40),
    },
  });
  return Response.json(toDash(product));
}
