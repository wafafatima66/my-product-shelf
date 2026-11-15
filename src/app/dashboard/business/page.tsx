import { requireUser } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import BusinessForm from "./BusinessForm";

export default async function BusinessPage() {
  const { shop } = await requireUser();
  const { t } = await getDict();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.dash.business.title}</h1>
        <p className="mt-1 text-[15px] text-muted">{t.dash.business.sub}</p>
      </div>
      <BusinessForm
        t={t}
        shop={{
          slug: shop.slug,
          name: shop.name,
          description: shop.description,
          instagram: shop.instagram,
          facebook: shop.facebook,
          whatsapp: shop.whatsapp,
          messenger: shop.messenger,
          currency: shop.currency,
        }}
      />
    </div>
  );
}
