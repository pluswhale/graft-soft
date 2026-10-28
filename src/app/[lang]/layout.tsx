import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { isLocale, localeMeta, locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { VerticalNavigation } from "@/components/layout/VerticalNavigation";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { MotionRuntime } from "@/components/motion/MotionRuntime";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#f7f9fc",
  colorScheme: "light",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  const alternateLocales = locales.filter((locale) => locale !== lang).map((locale) => localeMeta[locale].openGraph);

  return {
    metadataBase: new URL(site.url),
    title: meta.title,
    description: meta.description,
    applicationName: site.name,
    alternates: {
      canonical: `/${lang}`,
      languages: { ru: "/ru", en: "/en", "x-default": "/ru" },
    },
    openGraph: {
      type: "website",
      url: `/${lang}`,
      siteName: site.name,
      title: meta.title,
      description: meta.description,
      locale: localeMeta[lang].openGraph,
      alternateLocale: alternateLocales,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/og.png"],
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: "/apple-icon.png",
    },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang} className={`${manrope.variable} ${plexMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-[200] rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {dict.common.skipToContent}
        </a>
        <VerticalNavigation locale={lang} nav={dict.nav} common={dict.common} />
        <MobileNavigation locale={lang} nav={dict.nav} common={dict.common} />
        <div className="lg:pl-[var(--rail-w)]">
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter locale={lang} dict={dict} />
        </div>
        <MotionRuntime />
        <CustomCursor />
      </body>
    </html>
  );
}
