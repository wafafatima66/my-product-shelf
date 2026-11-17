"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { track } from "@/lib/analytics";
import { formatPrice } from "@/lib/format";
import { fill } from "@/lib/i18n/fill";
import type { GalleryProduct, GalleryShop } from "@/lib/gallery";
import type { Dict } from "@/lib/i18n/en";
import type { GalleryLinks } from "../types";
import { CopyIcon, FacebookIcon, ImageIcon, InstagramIcon, MessengerIcon, ShareIcon, WhatsAppIcon } from "./Icons";

type T = Dict["gallery"];

/** For values that are read from the browser once and never change. */
const noSubscribe = () => () => {};

/** Open/close a native <dialog> from React state. */
function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const h = () => onClose();
    d.addEventListener("close", h);
    return () => d.removeEventListener("close", h);
  }, [onClose]);
  return ref;
}

const dialogClass =
  "m-auto max-h-[92vh] w-[min(880px,calc(100%-24px))] overflow-auto p-0 backdrop:bg-black/55 " +
  "bg-[var(--t-card)] text-[var(--t-ink)] rounded-[var(--t-radius-lg)] " +
  "border-[length:var(--t-bw)] border-[color:var(--t-border)] shadow-[var(--t-card-shadow)]";

const btn =
  "flex w-full items-center justify-center gap-2 rounded-[var(--t-radius-btn)] px-5 py-3 text-[15px] font-semibold " +
  "border-[length:var(--t-bw)] border-[color:var(--t-border)] shadow-[var(--t-btn-shadow)] " +
  "transition active:translate-y-[2px] hover:brightness-95";

export function absoluteUrl(path: string) {
  return typeof window === "undefined" ? path : new URL(path, window.location.origin).toString();
}

export function ProductSheet({
  product,
  shop,
  t,
  onClose,
  onShare,
}: {
  product: GalleryProduct | null;
  shop: GalleryShop;
  t: T;
  onClose: () => void;
  onShare: (id: string) => void;
}) {
  const ref = useDialog(!!product, onClose);
  const p = product;

  return (
    <dialog
      ref={ref}
      className={dialogClass}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={p?.name || p?.code || ""}
    >
      {p && (
        <div className="relative grid md:grid-cols-[1.1fr_1fr]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-[var(--t-card)] text-xl leading-none shadow-md"
          >
            ×
          </button>
          <div className="grid min-h-[260px] place-items-center bg-[var(--t-line)]">
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt={p.name} className="max-h-[72vh] w-full object-cover md:h-full" />
            ) : (
              <ImageIcon className="h-12 w-12 opacity-30" />
            )}
          </div>
          <div className="flex flex-col gap-1 p-6 md:p-8">
            {p.code && <div className="text-xs font-semibold uppercase tracking-widest text-[var(--t-muted)]">{p.code}</div>}
            {p.name && <h2 className="font-[family-name:var(--t-head)] text-3xl leading-tight">{p.name}</h2>}
            {p.price != null && (
              <div className="mt-1 text-xl font-semibold text-[var(--t-accent-text)]">{formatPrice(p.price, shop.currency)}</div>
            )}
            {p.category && <div className="mt-2 text-sm text-[var(--t-muted)]">{p.category}</div>}
            <button
              type="button"
              onClick={() => onShare(p.id)}
              className={`${btn} mt-6 bg-[var(--t-accent)] text-[var(--t-accent-ink)]`}
            >
              <ShareIcon className="h-[18px] w-[18px]" /> {t.share}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

export function ShareDialog({
  product,
  shop,
  t,
  links,
  onClose,
}: {
  product: GalleryProduct | null;
  shop: GalleryShop;
  t: T;
  links: GalleryLinks;
  onClose: () => void;
}) {
  const ref = useDialog(!!product, onClose);
  const [toast, setToast] = useState("");
  const canNative = useSyncExternalStore(noSubscribe, () => !!navigator.share, () => false);
  const p = product;

  if (!p) return <dialog ref={ref} />;

  const url = absoluteUrl(links.share.replace("{id}", p.id));
  // The designed card (photo, name, price, shop). Not available for every gallery.
  const cardUrl = links.card ? links.card.replace("{id}", p.id) : "";
  const title = [p.name, p.code && `(${p.code})`].filter(Boolean).join(" ");
  const price = formatPrice(p.price, shop.currency);
  const text = `${fill(t.shareLine, { shop: shop.name || "My Product Shelf" })}\n${[title, price].filter(Boolean).join(" - ")}\n${url}`;
  const mobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  // A message from the customer to the shop owner: "I want this!" plus the product.
  const askText = `${t.wantLine}\n${[title, price].filter(Boolean).join(" - ")}\n${url}`;
  const hasContact = !!(shop.whatsapp || shop.messenger || shop.instagram);
  // Which products get shared, and where: shows up in Google Analytics as a "share" event.
  const sent = (method: string) => track("share", { method, item_id: p.id, shop: shop.slug });

  const say = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2400);
  };
  const copy = async (what: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(what);
      say(msg);
    } catch {
      say(what);
    }
  };

  async function more() {
    sent("more_apps");
    const data: ShareData = { title: title || shop.name, text, url };
    try {
      // Prefer the designed card so the picture itself carries the name and price.
      const src = cardUrl ? `${cardUrl}?f=story` : p!.image;
      if (src) {
        const blob = await (await fetch(src)).blob();
        const file = new File([blob], `${p!.code || p!.id}.${cardUrl ? "png" : "jpg"}`, { type: blob.type || "image/jpeg" });
        if (navigator.canShare?.({ files: [file] })) data.files = [file];
      }
    } catch {
      /* share without the picture file */
    }
    try {
      await navigator.share(data);
    } catch {
      /* cancelled */
    }
  }

  return (
    <dialog
      ref={ref}
      className={`${dialogClass} !w-[min(420px,calc(100%-24px))]`}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={t.shareTitle}
    >
      <div className="relative flex flex-col gap-3 p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-[var(--t-line)] text-xl leading-none"
        >
          ×
        </button>
        <h3 className="font-[family-name:var(--t-head)] text-2xl">{t.shareTitle}</h3>
        {cardUrl ? (
          // The card is exactly what friends will see in the chat.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cardUrl} alt={title} className="aspect-[1200/630] w-full rounded-[var(--t-radius)] border border-[var(--t-line)] bg-[var(--t-line)] object-cover" />
        ) : (
          <div className="flex items-center gap-3 rounded-[var(--t-radius)] border border-[var(--t-line)] bg-[var(--t-bg)] p-2">
            <div className="grid h-16 w-16 flex-none place-items-center overflow-hidden rounded-[calc(var(--t-radius)-2px)] bg-[var(--t-line)]">
              {p.thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.thumb} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-6 w-6 opacity-40" />
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate font-semibold">{p.name || p.code}</div>
              <div className="text-sm text-[var(--t-muted)]">{[p.code, price].filter(Boolean).join(" · ")}</div>
            </div>
          </div>
        )}

        {hasContact && (
          <>
            <div className="mt-1 text-sm font-bold">{fill(t.askTitle, { shop: shop.name || "My Product Shelf" })}</div>
            {shop.whatsapp && (
              <a
                className={`${btn} bg-[#1faa59] text-white`}
                href={`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(askText)}`}
                target="_blank"
                rel="noopener"
                onClick={() => sent("ask_whatsapp")}
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" /> {t.askWhatsApp}
              </a>
            )}
            {shop.messenger && (
              <a
                className={`${btn} bg-[#0a7cff] text-white`}
                href={`https://m.me/${shop.messenger}`}
                target="_blank"
                rel="noopener"
                onClick={() => {
                  sent("ask_messenger");
                  copy(askText, t.askCopied);
                }}
              >
                <MessengerIcon className="h-[18px] w-[18px]" /> {t.askMessenger}
              </a>
            )}
            {shop.instagram && (
              <a
                className={`${btn} bg-[linear-gradient(45deg,#f09433,#dc2743,#bc1888)] text-white`}
                href={`https://ig.me/m/${shop.instagram}`}
                target="_blank"
                rel="noopener"
                onClick={() => {
                  sent("ask_instagram");
                  copy(askText, t.askCopied);
                }}
              >
                <InstagramIcon className="h-[18px] w-[18px]" /> {t.askInstagram}
              </a>
            )}
            <div className="mt-2 border-t border-[var(--t-line)] pt-3 text-sm font-bold">{t.shareOthers}</div>
          </>
        )}

        <a
          className={`${btn} ${hasContact ? "bg-[var(--t-card)] ring-1 ring-[var(--t-line)]" : "bg-[#1faa59] text-white"}`}
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener"
          onClick={() => sent("whatsapp")}
        >
          <WhatsAppIcon className="h-[18px] w-[18px]" /> {t.whatsapp}
        </a>
        <a
          className={`${btn} bg-[#0a7cff] text-white`}
          href={mobile ? `fb-messenger://share/?link=${encodeURIComponent(url)}` : "https://www.messenger.com/"}
          target={mobile ? undefined : "_blank"}
          rel="noopener"
          onClick={() => {
            sent("messenger");
            if (!mobile) copy(text, t.messengerCopied);
          }}
        >
          <MessengerIcon className="h-[18px] w-[18px]" /> {t.messenger}
        </a>
        <button type="button" className={`${btn} bg-[var(--t-card)] ring-1 ring-[var(--t-line)]`} onClick={() => {
          sent("copy_link");
          copy(url, t.copied);
        }}>
          <CopyIcon className="h-[18px] w-[18px]" /> {t.copyLink}
        </button>
        {cardUrl && (
          <a
            className={`${btn} bg-[var(--t-card)] ring-1 ring-[var(--t-line)]`}
            href={`${cardUrl}?f=story`}
            download={`${p.code || p.name || "product"}.png`}
            onClick={() => sent("save_card")}
          >
            <ImageIcon className="h-[18px] w-[18px]" /> {t.saveCard}
          </a>
        )}
        {canNative && (
          <button type="button" className={`${btn} bg-[var(--t-card)] ring-1 ring-[var(--t-line)]`} onClick={more}>
            <FacebookIcon className="h-[18px] w-[18px]" /> {t.moreApps}
          </button>
        )}
        <div
          role="status"
          className={`pointer-events-none text-center text-sm font-semibold text-[var(--t-accent-text)] transition-opacity ${toast ? "opacity-100" : "opacity-0"}`}
        >
          {toast || " "}
        </div>
      </div>
    </dialog>
  );
}
