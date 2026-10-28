import { ArrowDown, ArrowUpRight, Send } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "inverse" | "outline-dark";
type ButtonIcon = "arrow" | "down" | "telegram";

type ButtonProps = {
  href: string;
  children: string;
  variant?: ButtonVariant;
  icon?: ButtonIcon;
  external?: boolean;
  newTabLabel?: string;
  className?: string;
  onClick?: () => void;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white shadow-[0_12px_28px_-14px_rgb(49_94_251/0.8)] hover:bg-primary-hover",
  secondary: "border border-border-strong bg-surface text-ink hover:border-ink",
  inverse: "bg-white text-ink hover:bg-mint",
  "outline-dark": "border border-white/25 text-white hover:border-white/70",
};

const icons: Record<ButtonIcon, ReactNode> = {
  arrow: <ArrowUpRight aria-hidden className="size-[1.1rem]" strokeWidth={2} />,
  down: <ArrowDown aria-hidden className="size-[1.1rem]" strokeWidth={2} />,
  telegram: <Send aria-hidden className="size-[1.05rem]" strokeWidth={2} />,
};

export function Button({
  href,
  children,
  variant = "primary",
  icon = "arrow",
  external = false,
  newTabLabel,
  className,
  onClick,
}: ButtonProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-magnetic=""
      data-cursor="button"
      className={cn(
        "group inline-flex min-h-13 items-center justify-center gap-3 rounded-full px-6 text-[0.95rem] font-semibold tracking-[-0.01em]",
        variants[variant],
        className,
      )}
    >
      <span className="roll">
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
      <span className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        {icons[icon]}
      </span>
      {external && newTabLabel ? <span className="sr-only">({newTabLabel})</span> : null}
    </a>
  );
}
