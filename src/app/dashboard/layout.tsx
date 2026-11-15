import type { Metadata } from "next";
import { logout } from "@/app/actions";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { Logo } from "@/components/Logo";
import { btn, btnGhost, btnSmall } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import DashNav from "./DashNav";

export const metadata: Metadata = { title: "Dashboard · My Product Shelf", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { shop } = await requireUser();
  const { t } = await getDict();

  const nav = [
    { href: "/dashboard", label: t.dash.navStart, exact: true },
    { href: "/dashboard/business", label: t.dash.navBusiness },
    { href: "/dashboard/products", label: t.dash.navProducts },
    { href: "/dashboard/template", label: t.dash.navTemplate },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-3 z-30 mx-auto mt-3 max-w-5xl px-3">
       <div className="rounded-2xl border border-black/5 bg-white/95 shadow-[0_8px_30px_rgba(57,53,51,.1)] backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <Logo href="/dashboard" />
          <div className="flex items-center gap-2">
            <a href={`/preview/${shop.template}`} target="_blank" className={`${btn} ${btnSmall}`}>
              {t.dash.preview}
            </a>
            <a href={`/${shop.slug}`} target="_blank" className={`${btnGhost} ${btnSmall} hidden sm:inline-flex`}>
              {t.dash.viewPage}
            </a>
            <LocaleSwitch />
            <form action={logout}>
              <button className={`${btnGhost} ${btnSmall}`}>{t.common.logout}</button>
            </form>
          </div>
        </div>
        <DashNav items={nav} />
       </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-7">{children}</main>
    </div>
  );
}
