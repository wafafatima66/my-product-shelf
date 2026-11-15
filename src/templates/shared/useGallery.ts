"use client";

import { useCallback, useMemo, useState } from "react";
import { categoriesOf, type GalleryProduct } from "@/lib/gallery";
import type { GalleryLinks } from "../types";

/** The search box only appears once a gallery is big enough that scrolling gets tiring. */
export const SEARCH_FROM = 8;

/** Filter, search, open-product and share state shared by every template. */
export function useGallery(
  products: GalleryProduct[],
  links: GalleryLinks,
  initialProductId?: string,
) {
  const [picked, setCat] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(
    initialProductId && products.some((p) => p.id === initialProductId) ? initialProductId : null,
  );
  const [sharingId, setSharingId] = useState<string | null>(null);

  const cats = useMemo(() => categoriesOf(products), [products]);
  // A category that no longer exists must not hide everything.
  const cat = picked && cats.includes(picked) ? picked : null;
  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      products.filter(
        (p) =>
          (!cat || p.category.trim() === cat) &&
          (!q || [p.name, p.code, p.category].some((v) => v.toLowerCase().includes(q))),
      ),
    [products, cat, q],
  );
  const active = products.find((p) => p.id === activeId) ?? null;
  const sharing = products.find((p) => p.id === sharingId) ?? null;

  const open = useCallback(
    (id: string) => {
      setActiveId(id);
      if (links.item) history.replaceState(null, "", links.item.replace("{id}", id));
    },
    [links.item],
  );
  const close = useCallback(() => {
    setActiveId(null);
    if (links.root) history.replaceState(null, "", links.root);
  }, [links.root]);

  return {
    cats,
    cat,
    setCat,
    query,
    setQuery,
    showSearch: products.length >= SEARCH_FROM,
    visible,
    active,
    open,
    close,
    sharing,
    share: (id: string) => setSharingId(id),
    closeShare: () => setSharingId(null),
  };
}
