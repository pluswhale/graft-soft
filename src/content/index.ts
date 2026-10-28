import type { Locale } from "@/lib/i18n";
import { en } from "./en";
import { ru } from "./ru";
import type { Dictionary } from "./types";

const dictionaries: Record<Locale, Dictionary> = { ru, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
