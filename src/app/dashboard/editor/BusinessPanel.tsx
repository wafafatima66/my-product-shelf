"use client";

import { btnGhost, btnSmall, card, input, label } from "@/components/ui";
import { CURRENCIES } from "@/lib/format";
import type { Dict } from "@/lib/i18n/en";

export type Biz = {
  name: string;
  description: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  messenger: string;
  currency: string;
};

/** Business details. Every keystroke goes straight to the live preview; saving happens by itself. */
export default function BusinessPanel({
  biz,
  onChange,
  slug,
  onSlugChange,
  onSaveSlug,
  slugError,
  slugDirty,
  t,
}: {
  biz: Biz;
  onChange: (patch: Partial<Biz>) => void;
  slug: string;
  onSlugChange: (v: string) => void;
  onSaveSlug: () => void;
  slugError: string;
  slugDirty: boolean;
  t: Dict["dash"];
}) {
  const b = t.business;
  return (
    <section className={`${card} space-y-5`}>
      <div>
        <h2 className="text-lg font-bold">{b.title}</h2>
        <p className="mt-0.5 text-[14px] text-muted">{b.sub}</p>
      </div>

      <div>
        <label htmlFor="name" className={label}>{b.name}</label>
        <input id="name" value={biz.name} onChange={(e) => onChange({ name: e.target.value })} placeholder={b.namePh} maxLength={80} className={input} />
      </div>
      <div>
        <label htmlFor="description" className={label}>{b.description}</label>
        <textarea
          id="description"
          value={biz.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder={b.descriptionPh}
          maxLength={600}
          rows={3}
          className={`${input} resize-y`}
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="mb-2 text-[13px] font-bold uppercase tracking-wider text-muted">{b.links}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="instagram" className={label}>{b.instagram}</label>
            <input id="instagram" value={biz.instagram} onChange={(e) => onChange({ instagram: e.target.value })} placeholder={b.instagramPh} className={input} />
          </div>
          <div>
            <label htmlFor="facebook" className={label}>{b.facebook}</label>
            <input id="facebook" value={biz.facebook} onChange={(e) => onChange({ facebook: e.target.value })} placeholder={b.facebookPh} className={input} />
          </div>
          <div>
            <label htmlFor="whatsapp" className={label}>{b.whatsapp}</label>
            <input id="whatsapp" value={biz.whatsapp} onChange={(e) => onChange({ whatsapp: e.target.value })} placeholder={b.whatsappPh} inputMode="tel" className={input} />
          </div>
          <div>
            <label htmlFor="messenger" className={label}>{b.messenger}</label>
            <input id="messenger" value={biz.messenger} onChange={(e) => onChange({ messenger: e.target.value })} placeholder={b.messengerPh} className={input} />
          </div>
        </div>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="currency" className={label}>{b.currency}</label>
          <select id="currency" value={biz.currency} onChange={(e) => onChange({ currency: e.target.value })} className={input}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} · {c.code} · {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="slug" className={label}>{b.address}</label>
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center overflow-hidden rounded-xl border border-line bg-white focus-within:border-brand focus-within:ring-4 focus-within:ring-brand-soft">
              <span className="select-none pl-3.5 text-[14px] text-muted" dir="ltr">/</span>
              <input
                id="slug"
                value={slug}
                onChange={(e) => onSlugChange(e.target.value.toLowerCase())}
                maxLength={40}
                dir="ltr"
                spellCheck={false}
                className="w-full min-w-0 bg-transparent px-1.5 py-2.5 text-[15px] outline-none"
              />
            </div>
            {slugDirty && (
              <button type="button" className={`${btnGhost} ${btnSmall} flex-none`} onClick={onSaveSlug}>
                {t.saveAddress}
              </button>
            )}
          </div>
          <p className={`mt-1 text-xs ${slugError ? "font-semibold text-red-700" : "text-muted"}`}>{slugError || b.addressHint}</p>
        </div>
      </div>
    </section>
  );
}
