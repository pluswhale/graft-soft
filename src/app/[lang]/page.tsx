import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { isLocale } from "@/lib/i18n";
import { absoluteUrl, site } from "@/lib/site";
import { AuditSection } from "@/components/sections/AuditSection";
import { CasesSection } from "@/components/sections/CasesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { EngagementSection } from "@/components/sections/EngagementSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StudioSection } from "@/components/sections/StudioSection";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const newTab = dict.common.newTab;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    description: dict.meta.description,
    inLanguage: lang,
    image: absoluteUrl("/og.png"),
    sameAs: [site.telegram],
    knowsLanguage: ["ru", "en"],
  };

  return (
    <>
      <HeroSection hero={dict.hero} newTabLabel={newTab} />
      <StudioSection studio={dict.studio} />
      <ServicesSection services={dict.services} swipeHint={dict.common.swipe} />
      <AuditSection audit={dict.audit} newTabLabel={newTab} />
      <ProcessSection process={dict.process} />
      <CasesSection cases={dict.cases} common={dict.common} />
      <EngagementSection engagement={dict.engagement} newTabLabel={newTab} swipeHint={dict.common.swipe} />
      <ContactSection contact={dict.contact} newTabLabel={newTab} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
