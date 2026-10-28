export const locales = ["ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeMeta: Record<Locale, { short: string; name: string; openGraph: string }> = {
  ru: { short: "RU", name: "Русский", openGraph: "ru_RU" },
  en: { short: "EN", name: "English", openGraph: "en_US" },
};

export function localePath(locale: Locale, hash?: string) {
  return hash ? `/${locale}#${hash}` : `/${locale}`;
}
