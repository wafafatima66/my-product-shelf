import { chooseTemplate } from "@/app/actions";
import { btn, btnGhost, btnSmall } from "@/components/ui";
import ScaledFrame from "@/components/ScaledFrame";
import { requireUser } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { TEMPLATES } from "@/templates/registry";

export default async function TemplatePage() {
  const { shop } = await requireUser();
  const { t, locale } = await getDict();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.dash.template.title}</h1>
        <p className="mt-1 max-w-2xl text-[15px] text-muted">{t.dash.template.sub}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((x) => {
          const on = shop.template === x.id;
          return (
            <article
              key={x.id}
              className={`flex flex-col overflow-hidden rounded-2xl border-2 bg-white transition ${on ? "border-brand" : "border-line"}`}
            >
              <ScaledFrame src={`/preview/${x.id}?embed=1`} title={x.name} />
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{x.name}</h2>
                  <span className="ml-auto flex gap-1" aria-hidden>
                    {x.swatch.map((c) => (
                      <i key={c} className="h-4 w-4 rounded-full border border-black/10" style={{ background: c }} />
                    ))}
                  </span>
                </div>
                <p className="text-sm text-muted">{x.blurb[locale]}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-1">
                  {on ? (
                    <span className="inline-flex items-center rounded-xl bg-ok/10 px-4 py-2 text-sm font-bold text-ok">✓ {t.dash.template.current}</span>
                  ) : (
                    <form action={chooseTemplate.bind(null, x.id)}>
                      <button className={`${btn} ${btnSmall}`}>{t.dash.template.use}</button>
                    </form>
                  )}
                  <a href={`/preview/${x.id}`} target="_blank" className={`${btnGhost} ${btnSmall}`}>
                    {t.dash.template.fullPreview}
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
