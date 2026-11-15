import type { Dict } from "@/lib/i18n/en";
import type { GalleryData } from "@/lib/gallery";

/** Where a gallery lives, so product links and share links can be built. */
export type GalleryLinks = {
  /** Link customers receive when they share a product, e.g. "/rina/p/{id}". */
  share: string;
  /** Address bar while a product is open (omit in previews). */
  item?: string;
  /** Address bar when no product is open. */
  root?: string;
  /** The designed share card for a product, e.g. "/rina/p/{id}/card". Omit when none exists. */
  card?: string;
};

export type TemplateProps = {
  data: GalleryData;
  t: Dict["gallery"];
  links: GalleryLinks;
  initialProductId?: string;
};
