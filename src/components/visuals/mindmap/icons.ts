import {
  BarChart3,
  Bot,
  Code2,
  Database,
  FileText,
  Gauge,
  Globe,
  Layers,
  MessageCircle,
  Phone,
  PlugZap,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/** Icon registry — map data refers to icons by name. */
const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  Bot,
  Code2,
  Database,
  FileText,
  Gauge,
  Globe,
  Layers,
  MessageCircle,
  Phone,
  PlugZap,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
};

const FALLBACK_ICON = Sparkles;

export function getIcon(name?: string): LucideIcon {
  if (!name) return FALLBACK_ICON;
  return ICON_MAP[name] ?? FALLBACK_ICON;
}
