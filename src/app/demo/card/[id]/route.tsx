import { renderCard } from "@/lib/card";
import { formatPrice } from "@/lib/format";
import { DEMO } from "@/templates/demo";

/** Share cards for the sample products, used on the home page. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = DEMO.products.find((x) => x.id === id);
  if (!p) return new Response("Not found", { status: 404 });
  return renderCard({
    shopName: DEMO.shop.name,
    name: p.name,
    code: p.code,
    price: formatPrice(p.price, DEMO.shop.currency),
    image: p.image,
    format: new URL(req.url).searchParams.get("f") === "story" ? "story" : "og",
  });
}
