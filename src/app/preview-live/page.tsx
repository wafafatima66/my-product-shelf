import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import LiveFrame from "./LiveFrame";

export const metadata: Metadata = { title: "Live preview · My Product Shelf", robots: { index: false } };

/** The page inside the editor's preview frame. It draws whatever the editor sends it. */
export default async function PreviewLive() {
  const { t } = await getDict();
  return <LiveFrame t={t.gallery} />;
}
