# Graftsoft — Project Instructions

## Project Overview

Build and maintain the official website for **Graftsoft**, an AI automation and software engineering studio.

**Canonical domain:** `https://www.graftsoft.com/`

Always use the exact brand name `Graftsoft` and the canonical domain `https://www.graftsoft.com/`.

Never use `Ngraftsoft`, `ngraftsoft.com`, or alternative brand spellings.

## Business Positioning

Graftsoft combines enthusiasm for AI with software development and systems integration experience.

The studio helps businesses:
- Reduce repetitive manual work.
- Identify valuable automation opportunities.
- Improve operational efficiency.
- Connect existing software and data systems.
- Implement AI agents and automation workflows.
- Develop custom software and internal tools.
- Maintain and continuously improve implemented solutions.

The studio focuses on practical business outcomes rather than AI hype.

### Engagement Model

1. Introductory conversation.
2. Business process audit.
3. Prioritization of opportunities.
4. Solution design and implementation planning.
5. Development and integration.
6. Testing and deployment.
7. Ongoing improvement, maintenance, and support.

Offer project-based implementation and subscription/retainer engagements where appropriate.

**Primary conversion:** Introductory call.

**Secondary conversion:** Business process audit.

**Telegram:** `https://t.me/pluswhale`

Use the Telegram link if this is the intended public username. Do not invent contact information or booking integrations.

## Technology Stack

- Next.js, using the latest stable version compatible with the existing project.
- React.
- TypeScript with strict typing.
- Tailwind CSS compatible with the installed configuration.
- CSS custom properties for design tokens.
- `next/font` where appropriate.
- Lucide or an existing consistent icon library.
- GSAP/ScrollTrigger only when justified.

Inspect the existing repository before changing dependencies or configuration.

Preserve working infrastructure and avoid unnecessary upgrades.

## Languages and Localization

- Default language: Russian (`ru`).
- Secondary language: English (`en`).

Requirements:
- Complete localization of all content and interface elements.
- Natural, professional writing in both languages.
- Localized navigation, buttons, cases, metadata, accessibility labels, and footer.
- Correct document language attributes.
- Localized SEO titles and descriptions.
- Consistent locale handling across routes and internal links.

Prefer `/ru` and `/en` routes when introducing localization into a compatible Next.js App Router project.

Store translations in typed dictionaries or a suitable localization system. Avoid duplicating entire pages or scattering language conditionals throughout components.

Inspect the existing implementation before selecting a localization strategy.

## Design Direction

The website should feel premium, contemporary, editorial, creative, and technically sophisticated.

### Reference Websites

- https://www.hatchworks.com/
- https://presencify.digital/
- https://valentingassend.com/en/

Use these references for inspiration, not as templates to copy.

### Color Palette

Use CSS custom properties and maintain a consistent design system.

| Token | Value | Purpose |
|---|---|---|
| `--color-canvas` | `#F7F9FC` | Main background |
| `--color-surface` | `#FFFFFF` | Primary surfaces |
| `--color-surface-muted` | `#EEF2F8` | Secondary surfaces |
| `--color-ink` | `#131B2E` | Primary text |
| `--color-ink-secondary` | `#59657A` | Body text |
| `--color-ink-muted` | `#8B96A8` | Metadata |
| `--color-primary` | `#315EFB` | Primary accent |
| `--color-primary-hover` | `#2449D8` | Hover state |
| `--color-violet` | `#8067F7` | Secondary accent |
| `--color-mint` | `#7CE8BF` | Positive highlights |
| `--color-lime` | `#D5F36A` | Occasional accent |
| `--color-border` | `#E1E7F0` | Borders and dividers |

Use a light theme, dark navy typography, electric blue as the main accent, violet as a supporting accent, and mint/lime sparingly.

Avoid generic purple AI templates, excessive gradients, and unnecessary glassmorphism.

### Typography

- Primary font: Manrope.
- Secondary accent font: IBM Plex Mono, used sparingly.
- Use responsive typography with `clamp()`.
- Use generous body line height.
- Maintain clear hierarchy, deliberate line breaks, and readable line lengths.

Use `next/font` where appropriate.

## Signature Navigation

Desktop navigation must be a fixed vertical rail on the **left side of the viewport**.

The rail expands into a navigation panel when hovered.

Requirements:
- Compact collapsed state.
- Smooth expanded state.
- No page-content reflow.
- Brand identity and navigation links.
- RU/EN language switcher.
- Contact CTA.
- Keyboard accessibility.
- Click and touch support.
- Accessible open/close state.
- Mobile navigation drawer.
- Reduced-motion support.

Do not rely exclusively on hover.

## Motion and Interactions

Implement a polished, restrained motion system.

### Custom Cursor

- Smooth pointer tracking on supported desktop devices.
- Contextual states for links, buttons, and project visuals.
- Optional contextual labels.
- Subtle color and shape changes.
- No interference with native usability.

### Cursor-Reactive Background

Use subtle radial illumination, moving gradients, or layered color transitions in selected areas.

Prefer CSS gradients and custom properties. Avoid unnecessary full-screen canvas effects and pointer-driven full React rerenders.

### Parallax

Use selective parallax for:
- Hero visuals.
- Layered project compositions.
- Process diagrams.
- Selected transitions.

Avoid applying parallax everywhere or interfering with scrolling.

Use GSAP only where justified. Otherwise prefer CSS and lightweight browser APIs.

Respect `prefers-reduced-motion`. Disable custom cursor effects on coarse-pointer devices.

## Website Sections

The complete website should include:

1. Hero and primary CTA.
2. Studio introduction.
3. Services and capabilities.
4. Business process audit.
5. How we work.
6. Cases and selected automation concepts.
7. Project-based and subscription/retainer engagement models.
8. Contact and final CTA.
9. Footer.

### Content Principles

Explain the studio's technical experience, enthusiasm for AI, practical approach, and focus on reducing operational costs and improving business efficiency.

Avoid exaggerated claims, unsupported statistics, empty buzzwords, and fake social proof.

Primary CTA: introductory call.

Secondary CTA: business process audit.

## Case Study Integrity

Two outreach/case-study files are located in the project root.

Read both files before creating or modifying case-study content.

Distinguish clearly between:
- Completed projects.
- Proposed solutions.
- Outreach concepts.
- Hypothetical workflows.

Never present a proposal as a completed project.

Do not invent client names, logos, testimonials, financial results, quantified savings, or performance metrics.

Use clear labels for concepts and proposals. Label expected results as estimates or hypotheses when appropriate.

## Component Architecture

Use a modular, maintainable architecture.

Suggested organization:

- `app/` — routes, layouts, metadata, global styles.
- `components/layout/` — site shell, vertical navigation, mobile navigation, footer.
- `components/sections/` — hero, studio, services, audit, process, cases, engagement, contact.
- `components/ui/` — buttons, containers, section headings, language switcher.
- `components/motion/` — reveal, parallax, cursor, reactive backgrounds.
- `components/visuals/` — custom diagrams and decorative compositions.
- `content/` — translations, services, case-study data.
- `lib/` — locale helpers, animation utilities, shared helpers.

Adapt this structure to the existing repository. Avoid unnecessary abstraction and empty component files.

### Architecture Rules

- Use Server Components by default.
- Add `'use client'` only when needed.
- Keep browser interactions isolated in small client components.
- Separate content, translations, and presentation.
- Use strict TypeScript types.
- Avoid `any`, duplicated logic, and unnecessary global state.
- Use semantic HTML and accessible controls.
- Use Tailwind CSS and shared CSS custom properties consistently.
- Avoid giant page components and excessive micro-components.
- Preserve working project conventions.

## Performance and Accessibility

- Optimize images.
- Use `next/image` where appropriate.
- Minimize unnecessary client-side JavaScript.
- Prevent layout shifts and horizontal overflow.
- Prefer transform and opacity for animations.
- Support keyboard navigation and visible focus states.
- Maintain readable contrast.
- Support reduced-motion preferences.
- Ensure the site remains usable without animation.
- Keep navigation usable on desktop, tablet, and mobile.

## SEO and Domain Consistency

The canonical domain is:

`https://www.graftsoft.com/`

Use this exact domain consistently in:
- Canonical URLs.
- Open Graph metadata.
- Sitemap.
- Robots configuration where relevant.
- Structured data.
- Other generated absolute URLs.

Do not use `https://ngraftsoft.com/`, `https://www.ngraftsoft.com/`, or `https://graftsoft.com/` as the canonical domain.

Inspect existing domain configuration before modifying it. Avoid unrelated infrastructure changes.

Implement localized metadata, appropriate `hreflang` alternates, Open Graph information, a sitemap, and robots configuration where appropriate.

## Quality Assurance

Before declaring a task complete:

1. Inspect the actual implementation.
2. Run the available lint checks.
3. Run TypeScript checks.
4. Run the production build.
5. Test navigation and language switching.
6. Test CTAs and internal links.
7. Check responsive layouts.
8. Inspect animation behavior and reduced-motion fallbacks.
9. Fix errors and visual inconsistencies.
10. Report what was actually tested.

If browser inspection is unavailable, state what could not be visually verified.

Never claim that a test passed unless it was actually run.

## Project Quality Standard

Do not settle for a generic template, wireframe, or hero-only implementation.

Prioritize:
- Exceptional visual design.
- Thoughtful interactions.
- Maintainable component architecture.
- Clear business positioning.
- Accessibility.
- Performance.
- Production reliability.

Do not leave core sections as TODOs or invent business claims.

Always use the correct brand name **Graftsoft** and canonical domain **https://www.graftsoft.com/**.

When completing a substantial task, report the implementation, architectural decisions, actual test results, and any remaining limitations.

