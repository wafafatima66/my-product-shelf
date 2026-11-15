import { getLocale } from "@/lib/i18n";
import LocaleMenu from "./LocaleMenu";

/** The language dropdown shown in the navbar of every My Product Shelf page. */
export async function LocaleSwitch() {
  return <LocaleMenu locale={await getLocale()} />;
}
