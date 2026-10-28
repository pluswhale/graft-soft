import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((locale) => [locale, absoluteUrl(`/${locale}`)]));

  return locales.map((locale) => ({
    url: absoluteUrl(`/${locale}`),
    changeFrequency: "monthly",
    priority: locale === defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
