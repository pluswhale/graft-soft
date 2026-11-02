import type { Dictionary, Stage } from "@/content/types";
import { STAGES } from "@/content/stages";
import { HorizontalAccordion } from "@/components/accordion/HorizontalAccordion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reveal } from "@/lib/motion";

/**
 * Interactive stage-journey section. Structure comes from `@/content/stages`,
 * copy from the active locale dictionary; the accordion itself is a client
 * component fed with plain, serializable stage objects.
 */
export function WorkStagesSection({ stages }: { stages: Dictionary["stages"] }) {
  const steps: Stage[] = STAGES.map((structure, index) => {
    const copy = stages.items[index];
    return {
      id: structure.id,
      index: structure.index,
      accent: structure.accent,
      icon: structure.icon,
      title: copy.title,
      tagline: copy.tagline,
      description: copy.description,
      duration: copy.duration,
      bullets: copy.bullets,
      deliverables: copy.deliverables,
      media: structure.media ? { ...structure.media, alt: copy.mediaAlt } : null,
    };
  });

  return (
    <section id="stages" aria-labelledby="stages-title" className="section-space relative">
      <Container>
        <SectionHeading id="stages-title" eyebrow={stages.eyebrow} title={stages.title} />
        <p
          {...reveal(120)}
          className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ink-secondary"
        >
          {stages.lead}
        </p>
        <div className="mt-12 lg:mt-16">
          <HorizontalAccordion
            steps={steps}
            stageLabel={stages.stageLabel}
            statusOverview={stages.statusOverview}
            hint={stages.hint}
          />
        </div>
      </Container>
    </section>
  );
}
