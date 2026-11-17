import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDict } from "@/lib/i18n";
import { toDash } from "@/lib/products";
import { TEMPLATES } from "@/templates/registry";
import Editor from "./editor/Editor";

/** The one and only setup page: business details, products and a live preview together. */
export default async function DashboardHome() {
  const { user, shop } = await requireUser();
  const { t } = await getDict();
  const products = await db.product.findMany({ where: { shopId: shop.id }, orderBy: [{ createdAt: "desc" }, { id: "desc" }] });

  return (
    <Editor
      shop={{
        name: shop.name,
        description: shop.description,
        instagram: shop.instagram,
        facebook: shop.facebook,
        whatsapp: shop.whatsapp,
        messenger: shop.messenger,
        currency: shop.currency,
        slug: shop.slug,
        template: shop.template,
      }}
      products={products.map(toDash)}
      templates={TEMPLATES.map((x) => ({ id: x.id, name: x.name, swatch: x.swatch }))}
      t={t.dash}
      email={user.email}
    />
  );
}
