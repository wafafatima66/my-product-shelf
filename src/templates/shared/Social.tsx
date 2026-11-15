import type { ReactNode } from "react";
import type { GalleryShop } from "@/lib/gallery";
import { FacebookIcon, InstagramIcon, MessengerIcon, WhatsAppIcon } from "./Icons";

/** Only the links the seller actually filled in. */
export function socialLinks(shop: GalleryShop) {
  const out: { key: string; href: string; label: string; icon: ReactNode }[] = [];
  const cls = "h-5 w-5";
  if (shop.instagram) out.push({ key: "ig", label: "Instagram", href: `https://instagram.com/${shop.instagram}`, icon: <InstagramIcon className={cls} /> });
  if (shop.facebook) out.push({ key: "fb", label: "Facebook", href: `https://facebook.com/${shop.facebook}`, icon: <FacebookIcon className={cls} /> });
  if (shop.whatsapp) out.push({ key: "wa", label: "WhatsApp", href: `https://wa.me/${shop.whatsapp}`, icon: <WhatsAppIcon className={cls} /> });
  if (shop.messenger) out.push({ key: "ms", label: "Messenger", href: `https://m.me/${shop.messenger}`, icon: <MessengerIcon className={cls} /> });
  return out;
}

export function SocialRow({ shop, className, itemClass }: { shop: GalleryShop; className?: string; itemClass: string }) {
  const links = socialLinks(shop);
  if (!links.length) return null;
  return (
    <nav className={className} aria-label="Social links">
      {links.map((l) => (
        <a key={l.key} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.label} className={itemClass}>
          {l.icon}
        </a>
      ))}
    </nav>
  );
}
