import {
  BarChart3,
  Bot,
  Code2,
  Compass,
  Database,
  FileText,
  Gauge,
  Globe,
  Layers,
  MessageCircle,
  PenTool,
  Phone,
  PlugZap,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/** Icon registry — content data refers to icons by name (mindmap, stage journey). */
const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  Bot,
  Code2,
  Compass,
  Database,
  FileText,
  Gauge,
  Globe,
  Layers,
  MessageCircle,
  PenTool,
  Phone,
  PlugZap,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
};

const FALLBACK_ICON = Sparkles;

export function getIcon(name?: string): LucideIcon {
  if (!name) return FALLBACK_ICON;
  return ICON_MAP[name] ?? FALLBACK_ICON;
}
