import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDict } from "@/lib/i18n";
import { toDash } from "@/lib/products";
import ProductManager from "./ProductManager";

export default async function ProductsPage() {
  const { shop } = await requireUser();
  const { t } = await getDict();
  const products = await db.product.findMany({ where: { shopId: shop.id }, orderBy: [{ createdAt: "desc" }, { id: "desc" }] });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.dash.products.title}</h1>
        <p className="mt-1 text-[15px] text-muted">{t.dash.products.sub}</p>
      </div>
      <ProductManager initial={products.map(toDash)} t={t.dash.products} />
    </div>
  );
}
