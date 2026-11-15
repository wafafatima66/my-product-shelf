"use client";

import { useActionState } from "react";
import { saveBusiness, type FormState } from "@/app/actions";
import { btn, card, input, label } from "@/components/ui";
import { CURRENCIES } from "@/lib/format";
import type { Dict } from "@/lib/i18n/en";

type Shop = {
  slug: string;
  name: string;
  description: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  messenger: string;
  currency: string;
};

export default function BusinessForm({ shop, t }: { shop: Shop; t: Dict }) {
  const b = t.dash.business;
  const [state, action, pending] = useActionState<FormState, FormData>(saveBusiness, {});

  return (
    <form action={action} className={`${card} space-y-5`}>
      <div>
        <label htmlFor="name" className={label}>{b.name}</label>
        <input id="name" name="name" defaultValue={shop.name} placeholder={b.namePh} maxLength={80} className={input} />
      </div>
      <div>
        <label htmlFor="description" className={label}>{b.description}</label>
        <textarea
          id="description"
          name="description"
          defaultValue={shop.description}
          placeholder={b.descriptionPh}
          maxLength={600}
          rows={3}
          className={`${input} resize-y`}
        />
      </div>

      <fieldset className="space-y-4">
        <legend className="mb-3 text-[13px] font-bold uppercase tracking-wider text-muted">{b.links}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="instagram" className={label}>{b.instagram}</label>
            <input id="instagram" name="instagram" defaultValue={shop.instagram} placeholder={b.instagramPh} className={input} />
          </div>
          <div>
            <label htmlFor="facebook" className={label}>{b.facebook}</label>
            <input id="facebook" name="facebook" defaultValue={shop.facebook} placeholder={b.facebookPh} className={input} />
          </div>
          <div>
            <label htmlFor="whatsapp" className={label}>{b.whatsapp}</label>
            <input id="whatsapp" name="whatsapp" defaultValue={shop.whatsapp} placeholder={b.whatsappPh} inputMode="tel" className={input} />
          </div>
          <div>
            <label htmlFor="messenger" className={label}>{b.messenger}</label>
            <input id="messenger" name="messenger" defaultValue={shop.messenger} placeholder={b.messengerPh} className={input} />
          </div>
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="currency" className={label}>{b.currency}</label>
          <select id="currency" name="currency" defaultValue={shop.currency} className={input}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} · {c.code} · {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="slug" className={label}>{b.address}</label>
          <div className="flex items-center overflow-hidden rounded-xl border border-line bg-white focus-within:border-brand focus-within:ring-4 focus-within:ring-brand-soft">
            <span className="select-none pl-3.5 text-[14px] text-muted" dir="ltr">/</span>
            <input
              id="slug"
              name="slug"
              defaultValue={shop.slug}
              maxLength={40}
              dir="ltr"
              spellCheck={false}
              className="w-full bg-transparent px-1.5 py-2.5 text-[15px] outline-none"
            />
          </div>
          <p className="mt-1 text-xs text-muted">{b.addressHint}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className={btn} disabled={pending}>{t.common.save}</button>
        <span role="status" className={`text-sm font-semibold ${state.error ? "text-red-700" : "text-ok"}`}>
          {state.error ?? (state.ok ? `✓ ${t.common.saved}` : "")}
        </span>
      </div>
    </form>
  );
}
