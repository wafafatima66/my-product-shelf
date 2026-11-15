import { dataUri, renderCard } from "@/lib/card";
import { formatPrice } from "@/lib/format";
import { getPublicGallery } from "@/lib/shops";
import { readImage } from "@/lib/storage";

type Ctx = { params: Promise<{ slug: string; id: string }> };

/** The share card for one product. `?f=story` is the tall version; the default is the link-preview size. */
export async function GET(req: Request, { params }: Ctx) {
  const { slug, id } = await params;
  const g = await getPublicGallery(slug);
  const p = g?.shop.products.find((x) => x.id === id);
  if (!g || !p) return new Response("Not found", { status: 404 });

  const file = p.image ? await readImage(p.image, false) : null;
  return renderCard({
    shopName: g.shop.name || "My Product Shelf",
    name: p.name,
    code: p.code,
    price: formatPrice(p.price, g.shop.currency),
    image: file ? dataUri(file) : null,
    format: new URL(req.url).searchParams.get("f") === "story" ? "story" : "og",
  });
}
