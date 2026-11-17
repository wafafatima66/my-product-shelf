"use client";

import { useEffect, useState } from "react";
import type { GalleryData } from "@/lib/gallery";
import type { Dict } from "@/lib/i18n/en";
import { getTemplate } from "@/templates/registry";

/** What the editor posts to this frame every time something changes. */
export type LivePayload = {
  type: "live-preview";
  template: string;
  data: GalleryData;
  /** True when the seller has no products yet and sample ones are shown. */
  sample: boolean;
};

/**
 * Renders a gallery from data sent by the editor with postMessage, so the preview updates
 * on every keystroke without saving anything. It tells the editor when it is ready.
 */
export default function LiveFrame({ t }: { t: Dict["gallery"] }) {
  const [live, setLive] = useState<LivePayload | null>(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const m = e.data as Partial<LivePayload> | null;
      if (m?.type === "live-preview" && m.data) setLive(m as LivePayload);
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "live-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!live) return <div className="min-h-screen bg-white" />;
  const { Component } = getTemplate(live.template);
  const slug = live.data.shop.slug;
  return (
    <Component
      data={live.data}
      t={t}
      links={{ share: `/${slug}/p/{id}`, card: live.sample ? undefined : `/${slug}/p/{id}/card` }}
    />
  );
}
