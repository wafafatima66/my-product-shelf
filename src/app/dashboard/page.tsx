import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fill, getDict } from "@/lib/i18n";
import { card } from "@/components/ui";
import CopyLink from "./CopyLink";

export default async function DashboardHome() {
  const { shop } = await requireUser();
  const { t } = await getDict();
  const count = await db.product.count({ where: { shopId: shop.id } });

  const businessDone = !!(shop.name || shop.description || shop.instagram || shop.facebook || shop.whatsapp || shop.messenger);
  const productsDone = count > 0;
  const templateDone = businessDone && productsDone; // a look is only meaningful once there is something to show
  const steps = [
    { n: 1, href: "/dashboard/business", title: t.dash.step1, sub: t.dash.step1Sub, done: businessDone },
    { n: 2, href: "/dashboard/products", title: t.dash.step2, sub: t.dash.step2Sub, done: productsDone },
    { n: 3, href: "/dashboard/template", title: t.dash.step3, sub: t.dash.step3Sub, done: templateDone },
  ];
  const finished = steps.filter((s) => s.done).length;

  return (
    <div className="space-y-5">
      <section className={`${card} bg-gradient-to-br from-brand-soft/60 to-white`}>
        <h1 className="text-2xl font-bold tracking-tight">
          {shop.name ? fill(t.dash.welcomeNamed, { name: shop.name }) : t.dash.welcome}
        </h1>
        <p className="mt-1 max-w-2xl text-[15px] text-muted">{t.dash.welcomeSub}</p>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={finished} aria-valuemin={0} aria-valuemax={3}>
          <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(finished / 3) * 100}%` }} />
        </div>
      </section>

      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <li key={s.n}>
            <Link href={s.href} className={`${card} group flex h-full flex-col transition hover:border-ink`}>
              <span
                className={`mb-3 grid h-8 w-8 place-items-center rounded-full text-sm font-bold text-white ${s.done ? "bg-ok" : "bg-ink"}`}
              >
                {s.done ? "✓" : s.n}
              </span>
              <span className="text-[16px] font-bold leading-snug">{s.title}</span>
              <span className="mt-1 text-sm text-muted">{s.sub}</span>
              <span className="mt-auto pt-4 text-sm font-semibold text-brand group-hover:underline">
                {s.done ? t.dash.done : t.dash.open} →
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <section className={card}>
        <h2 className="mb-3 text-[15px] font-bold">{t.dash.yourLink}</h2>
        <CopyLink path={`/${shop.slug}`} copyLabel={t.dash.copy} copiedLabel={t.dash.copied} />
      </section>
    </div>
  );
}
