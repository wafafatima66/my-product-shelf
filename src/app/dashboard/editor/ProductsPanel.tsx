"use client";

import { useActionState, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { requestMoreProducts, type FormState } from "@/app/actions";
import { btn, btnGhost, btnSmall, card, input, label } from "@/components/ui";
import { MAX_PRODUCTS, MORE_OPTIONS } from "@/lib/limits";
import { fill } from "@/lib/i18n/fill";
import type { Dict } from "@/lib/i18n/en";
import type { DashProduct } from "@/lib/products";

type T = Dict["dash"]["products"];
type Editable = "name" | "code" | "price";

/** Shrink a phone photo before upload so it is quick on mobile data. */
async function shrink(file: File, max = 1600): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * s);
    c.height = Math.round(bmp.height * s);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    bmp.close();
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.85));
    if (blob) return blob;
  } catch {
    /* fall through: let the server try the original */
  }
  return file;
}

async function send(url: string, method: string, body: FormData | string, json = false) {
  const res = await fetch(url, { method, body, headers: json ? { "Content-Type": "application/json" } : undefined });
  if (!res.ok) throw new Error(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "failed");
  return res.json();
}

/**
 * Add, edit and delete products. The list lives in the editor so the live preview
 * sees every keystroke; changes are saved to the server when a box loses focus.
 */
export default function ProductsPanel({
  items,
  setItems,
  t,
  email,
}: {
  items: DashProduct[];
  setItems: Dispatch<SetStateAction<DashProduct[]>>;
  t: T;
  email: string;
}) {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const atLimit = items.length >= MAX_PRODUCTS;

  // add form
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [f, setF] = useState({ name: "", code: "", price: "" });
  const fileRef = useRef<HTMLInputElement>(null);
  const bulkRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const [replaceId, setReplaceId] = useState<string | null>(null);

  // What the server last saw for each product, so a box only saves when it really changed.
  const saved = useRef<Record<string, Record<Editable, string>>>(
    Object.fromEntries(items.map((i) => [i.id, { name: i.name, code: i.code, price: i.price }])),
  );
  const latest = useRef(items);
  useEffect(() => {
    latest.current = items;
  }, [items]);

  const say = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg((cur) => (cur === m ? "" : cur)), 3500);
  };
  const fail = (e: unknown) => {
    const code = e instanceof Error ? e.message : "";
    if (code === "limit") {
      setShowMore(true);
      return say(fill(t.limitReached, { max: MAX_PRODUCTS }));
    }
    say(code === "bad_image" ? t.badImage : t.failed);
  };
  const remember = (p: DashProduct) => {
    saved.current[p.id] = { name: p.name, code: p.code, price: p.price };
  };

  async function pickPhoto(file?: File) {
    if (!file) return;
    const blob = await shrink(file);
    setPhoto(blob);
    setPhotoUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(blob);
    });
  }

  async function add() {
    if (atLimit) return fail(new Error("limit"));
    if (!photo && !f.name.trim() && !f.code.trim() && !f.price.trim()) return say(t.needOne);
    setBusy(true);
    try {
      const fd = new FormData();
      if (photo) fd.append("image", photo, "photo.jpg");
      for (const [k, v] of Object.entries(f)) fd.append(k, v);
      const created: DashProduct = await send("/api/products", "POST", fd);
      remember(created);
      setItems((x) => [created, ...x]);
      setF({ name: "", code: "", price: "" });
      setPhoto(null);
      setPhotoUrl("");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }

  async function bulk(files: FileList | null) {
    if (!files?.length) return;
    if (atLimit) return fail(new Error("limit"));
    // Only as many photos as there is room for; the server enforces the same limit.
    const room = MAX_PRODUCTS - items.length;
    const list = [...files].slice(0, room);
    const trimmed = files.length > room;
    setBusy(true);
    let bad = 0;
    for (let i = 0; i < list.length; i++) {
      setMsg(fill(t.uploading, { n: i + 1, total: list.length }));
      try {
        const fd = new FormData();
        fd.append("image", await shrink(list[i]), "photo.jpg");
        const created: DashProduct = await send("/api/products", "POST", fd);
        remember(created);
        setItems((x) => [created, ...x]);
      } catch {
        bad++;
      }
    }
    setBusy(false);
    if (trimmed) setShowMore(true);
    say(bad ? t.badImage : trimmed ? fill(t.limitTrimmed, { n: list.length, max: MAX_PRODUCTS }) : "");
  }

  const edit = (id: string, key: Editable, value: string) =>
    setItems((x) => x.map((i) => (i.id === id ? { ...i, [key]: value } : i)));

  async function commit(id: string, key: Editable) {
    const cur = latest.current.find((i) => i.id === id);
    if (!cur) return;
    const value = cur[key].trim();
    if (saved.current[id]?.[key] === value) return;
    try {
      await send(`/api/products/${id}`, "PATCH", JSON.stringify({ [key]: value }), true);
      saved.current[id] = { ...saved.current[id], [key]: value };
    } catch (e) {
      fail(e);
    }
  }

  async function remove(id: string) {
    if (!confirm(t.deleteConfirm)) return;
    try {
      await send(`/api/products/${id}`, "DELETE", "");
      setItems((x) => x.filter((i) => i.id !== id));
    } catch (e) {
      fail(e);
    }
  }

  async function replace(file?: File) {
    const id = replaceId;
    if (!file || !id) return;
    try {
      const fd = new FormData();
      fd.append("image", await shrink(file), "photo.jpg");
      const updated: DashProduct = await send(`/api/products/${id}/image`, "POST", fd);
      setItems((x) => x.map((i) => (i.id === id ? { ...i, thumb: updated.thumb, image: updated.image, width: updated.width, height: updated.height } : i)));
    } catch (e) {
      fail(e);
    }
  }

  const count = items.length === 1 ? t.count1 : fill(t.count, { n: items.length });

  return (
    <div className="space-y-5">
      <section className={`${card} space-y-4`}>
        <div>
          <h2 className="text-lg font-bold">{t.title}</h2>
          <p className="mt-0.5 text-[14px] text-muted">{t.sub}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-[130px_1fr]">
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="grid aspect-square w-full max-w-[130px] place-items-center overflow-hidden rounded-xl border-2 border-dashed border-line bg-paper bg-cover bg-center text-sm font-semibold text-muted transition hover:border-brand"
              style={photoUrl ? { backgroundImage: `url(${photoUrl})`, borderStyle: "solid" } : undefined}
            >
              {photoUrl ? "" : t.addPhoto}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { pickPhoto(e.target.files?.[0]); e.target.value = ""; }} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={label} htmlFor="p-name">{t.name}</label>
              <input id="p-name" className={input} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} maxLength={120} />
            </div>
            <div>
              <label className={label} htmlFor="p-code">{t.code}</label>
              <input id="p-code" className={input} value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} maxLength={40} />
            </div>
            <div>
              <label className={label} htmlFor="p-price">{t.price}</label>
              <input id="p-price" className={input} type="number" min="0" step="any" inputMode="decimal" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <button type="button" className={btn} onClick={add} disabled={busy || atLimit}>
            {busy ? t.adding : t.add}
          </button>
          <span className="text-sm font-semibold text-muted">{fill(t.usage, { n: items.length, max: MAX_PRODUCTS })}</span>
          <button type="button" className="text-sm font-bold text-brand hover:underline" onClick={() => setShowMore((v) => !v)} aria-expanded={showMore || atLimit}>
            {t.moreOpen}
          </button>
        </div>

        <div className="flex flex-col items-start gap-2 rounded-xl bg-paper p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-bold">{t.bulkTitle}</div>
            <div className="text-[13px] text-muted">{t.bulkText}</div>
          </div>
          <button type="button" className={`${btnGhost} ${btnSmall} flex-none`} onClick={() => bulkRef.current?.click()} disabled={busy || atLimit}>
            {t.bulk}
          </button>
          <input ref={bulkRef} type="file" accept="image/*" multiple hidden onChange={(e) => { bulk(e.target.files); e.target.value = ""; }} />
        </div>
        <p role="status" className="min-h-5 text-sm font-semibold text-brand">{msg}</p>
      </section>

      {(showMore || atLimit) && <MoreForm t={t} email={email} />}

      <input ref={replaceRef} type="file" accept="image/*" hidden onChange={(e) => { replace(e.target.files?.[0]); e.target.value = ""; }} />

      <section className="space-y-3">
        {items.length > 0 && <div className="text-sm font-semibold text-muted">{count}</div>}
        {items.length === 0 ? (
          <div className={`${card} py-8 text-center text-[15px] text-muted`}>{t.empty}</div>
        ) : (
          <ul className="grid gap-3">
            {items.map((p) => (
              <li key={p.id} className="flex gap-3 rounded-2xl border border-line bg-white p-3">
                <button
                  type="button"
                  title={t.changePhoto}
                  onClick={() => { setReplaceId(p.id); replaceRef.current?.click(); }}
                  className="grid h-24 w-24 flex-none place-items-center overflow-hidden rounded-xl border border-line bg-paper bg-cover bg-center text-center text-[11px] font-semibold text-muted transition hover:border-brand"
                  style={p.thumb ? { backgroundImage: `url(${p.thumb})` } : undefined}
                >
                  {p.thumb ? "" : t.noPhoto}
                </button>
                <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
                  <Field wide ph={t.name} value={p.name} onChange={(v) => edit(p.id, "name", v)} onCommit={() => commit(p.id, "name")} />
                  <Field ph={t.code} value={p.code} onChange={(v) => edit(p.id, "code", v)} onCommit={() => commit(p.id, "code")} />
                  <Field ph={t.price} value={p.price} type="number" onChange={(v) => edit(p.id, "price", v)} onCommit={() => commit(p.id, "price")} />
                  <button type="button" onClick={() => remove(p.id)} className="col-span-2 justify-self-end text-[13px] font-semibold text-red-700 hover:underline">
                    {t.remove}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/** "I want more than the limit": sellers leave their email and how many products they need. */
function MoreForm({ t, email }: { t: T; email: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(requestMoreProducts, {});
  return (
    <section className={`${card} space-y-4`} aria-labelledby="more-title">
      <div>
        <h2 id="more-title" className="text-lg font-bold">{fill(t.moreTitle, { max: MAX_PRODUCTS })}</h2>
        <p className="mt-1 text-[14.5px] text-muted">{t.moreText}</p>
      </div>
      {state.ok ? (
        <p role="status" className="rounded-xl bg-paper p-4 text-[15px] font-bold text-ok">{t.moreThanks}</p>
      ) : (
        <form action={action} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="m-email">{t.moreEmail}</label>
            <input id="m-email" name="email" type="email" required defaultValue={email} className={input} maxLength={200} />
          </div>
          <div>
            <label className={label} htmlFor="m-wanted">{t.moreHowMany}</label>
            <select id="m-wanted" name="wanted" className={input} defaultValue={MORE_OPTIONS[0]}>
              {MORE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="m-note">{t.moreNote}</label>
            <textarea id="m-note" name="note" rows={3} maxLength={1000} className={input} />
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <button type="submit" className={btn} disabled={pending}>{pending ? t.moreSending : t.moreSend}</button>
            {state.error && <p role="alert" className="text-sm font-semibold text-red-700">{state.error}</p>}
          </div>
        </form>
      )}
    </section>
  );
}

/** A text box that updates the preview as you type and saves when you leave it. */
function Field({ value, onChange, onCommit, ph, type = "text", wide }: {
  value: string; onChange: (v: string) => void; onCommit: () => void; ph: string; type?: string; wide?: boolean;
}) {
  return (
    <input
      aria-label={ph}
      placeholder={ph}
      type={type}
      min={type === "number" ? 0 : undefined}
      step={type === "number" ? "any" : undefined}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onCommit}
      className={`${input} !px-3 !py-2 !text-[14px] ${wide ? "col-span-2" : ""}`}
    />
  );
}
