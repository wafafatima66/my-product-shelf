import "server-only";
import { cookies, headers } from "next/headers";
import { en, type Dict } from "./en";
import { bn } from "./bn";

export type Locale = "en" | "bn";
export const LOCALE_COOKIE = "pr_locale";

const dicts: Record<Locale, Dict> = { en, bn };

export async function getLocale(): Promise<Locale> {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (saved === "en" || saved === "bn") return saved;
  const accept = (await headers()).get("accept-language") ?? "";
  return accept.toLowerCase().startsWith("bn") ? "bn" : "en";
}

export async function getDict() {
  const locale = await getLocale();
  return { locale, t: dicts[locale] };
}

export { fill } from "./fill";
export type { Dict };
