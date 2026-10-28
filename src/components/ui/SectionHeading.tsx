import { reveal } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
};

export function SectionHeading({ id, eyebrow, title, lead, className }: SectionHeadingProps) {
  return (
    <div className={cn("grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10", className)}>
      <div className="lg:col-span-8 xl:col-span-7" {...reveal()}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id} className="mt-6 text-heading font-semibold">
          {title}
        </h2>
      </div>
      {lead ? (
        <p
          className="max-w-xl text-lead text-ink-secondary lg:col-span-4 lg:col-start-9"
          {...reveal(120)}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
