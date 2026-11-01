export type SectionId =
  | "studio"
  | "services"
  | "audit"
  | "process"
  | "cases"
  | "engagement"
  | "contact";

export type NavItem = {
  id: SectionId;
  label: string;
  hint: string;
};

export type TitledText = {
  title: string;
  text: string;
};

export type Service = TitledText & {
  tags: string[];
};

export type StatusTone = "ok" | "warn" | "info" | "muted";

export type AccentToken = "primary" | "violet" | "mint" | "amber" | "sky" | "rose";

export type MindmapVariant = "root" | "pillar" | "leaf";

export type MindmapSide = "top" | "right" | "bottom" | "left";

export type MindmapNodeCopy = {
  title: string;
  subtitle?: string;
  description: string;
  bullets: string[];
  metric?: string;
};

export type MindmapNodeBase = {
  id: string;
  position: { x: number; y: number };
  variant: MindmapVariant;
  accent: AccentToken;
  icon: string;
};

export type MindmapNode = MindmapNodeBase & {
  content: MindmapNodeCopy;
};

export type MindmapEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle: MindmapSide;
  targetHandle: MindmapSide;
};

export type MindmapCopy = {
  label: string;
  eyebrow: string;
  hint: string;
  panel: {
    hub: string;
    pillar: string;
    leaf: string;
    metric: string;
    cta: string;
    close: string;
  };
  empty: {
    title: string;
    description: string;
  };
  nodes: Record<string, MindmapNodeCopy>;
};

export type ScenarioRow = {
  time: string;
  text: string;
  status: string;
  tone: StatusTone;
};

export type ScenarioState = {
  caption: string;
  rows: ScenarioRow[];
  summary: string;
};

export type CaseConcept = {
  id: string;
  industry: string;
  title: string;
  problem: string;
  solution: string[];
  systems: string[];
  expected: string[];
  validate: string[];
  scenario: {
    title: string;
    now: ScenarioState;
    after: ScenarioState;
  };
};

export type EngagementModel = {
  kicker: string;
  title: string;
  text: string;
  items: string[];
  fit: string;
};

export type ProcessStep = TitledText & {
  output: string;
};

export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  common: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    menu: string;
    primaryNav: string;
    language: string;
    home: string;
    newTab: string;
    telegram: string;
    backToTop: string;
    swipe: string;
    details: string;
    hideDetails: string;
  };
  nav: {
    descriptor: string;
    items: NavItem[];
    cta: string;
  };
  hero: {
    eyebrow: string;
    title: string[];
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    systemsLabel: string;
    systems: string[];
    map: MindmapCopy;
    visual: {
      label: string;
      sources: string[];
      core: string;
      coreCaption: string;
      targets: string[];
      chatIn: string;
      chatOut: string;
      record: {
        title: string;
        meta: string;
        rows: [string, string][];
      };
      log: string;
    };
  };
  studio: {
    eyebrow: string;
    title: string;
    statement: string;
    approach: {
      label: string;
      title: string;
      text: string;
      team: string;
      teamNote: string;
      layer: string;
      layerNote: string;
      systems: string;
      systemItems: string[];
    };
    principles: TitledText[];
  };
  services: {
    eyebrow: string;
    title: string;
    lead: string;
    featured: Service & {
      flow: {
        input: string;
        steps: string[];
        output: string;
        handoff: string;
      };
    };
    items: Service[];
  };
  audit: {
    eyebrow: string;
    title: string;
    lead: string;
    examineTitle: string;
    examine: string[];
    deliverablesTitle: string;
    deliverables: TitledText[];
    sheets: {
      map: string;
      mapNodes: string[];
      priorities: string;
      impact: string;
      effort: string;
      startHere: string;
      roadmap: string;
      roadmapRows: string[];
    };
    example: {
      label: string;
      factors: string[];
      result: string;
      note: string;
    };
    disclaimer: string;
    cta: string;
  };
  process: {
    eyebrow: string;
    title: string;
    lead: string;
    outputLabel: string;
    steps: ProcessStep[];
  };
  cases: {
    eyebrow: string;
    title: string;
    lead: string;
    integrityNote: string;
    badge: string;
    labels: {
      problem: string;
      solution: string;
      systems: string;
      expected: string;
      validate: string;
      illustrative: string;
      now: string;
      after: string;
      compare: string;
      cursor: string;
    };
    items: CaseConcept[];
  };
  engagement: {
    eyebrow: string;
    title: string;
    lead: string;
    pilot: string;
    models: EngagementModel[];
    note: string;
    cta: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    ctaNote: string;
    prepareTitle: string;
    prepare: string[];
  };
  footer: {
    tagline: string;
    sections: string;
    contact: string;
    language: string;
    rights: string;
  };
};
