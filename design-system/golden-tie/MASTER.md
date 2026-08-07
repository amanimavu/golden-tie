# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Golden Tie Limited
**Updated:** 2026-08-05
**Category:** Corporate Conglomerate (multi-industry holding company)

---

## Brand Brief

Golden Tie Limited is a conglomerate with interests across multiple industries. Current
subsidiaries in scope:

1. **Tipping App** — digital tipping/fintech
2. **Biodiesel Feedstock Trader** — energy/waste-oil trading
3. **Training Institute** — education/skills training

Audience: partners, investors, and institutional stakeholders scanning for credibility, plus
prospective trainees and app users. The page's job: read as one confident holding company while
giving each subsidiary enough distinct identity that a visitor immediately understands these are
three real, different businesses — not one generic startup with three feature bullets.

---

## Global Rules

### Color Palette (fixed — derived from logo + reconciled reference direction)

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Ink | `#131313` | `--color-ink` | Deepest background layer, full-bleed hero/section base |
| Charcoal | `#222126` | `--color-charcoal` | Primary brand dark — main surface color |
| Slate | `#2b2b2b` | `--color-slate` | Tertiary/raised surface, hairline dividers |
| Gold | `#EFBF04` | `--color-gold` | Primary accent — nav, primary CTA pill, hairline rules, the one accent used structurally everywhere |
| Amber | `#FFC766` | `--color-amber` | Secondary accent — Training Institute's identity color, softer pill fills |
| Yellow | `#FFDD00` | `--color-yellow` | Secondary accent — Tipping App's identity color, highest-energy pill/tag |
| Orange | `#F07200` | `--color-orange` | Secondary accent — Biodiesel Feedstock Trader's identity color (warm = energy/fuel) |
| Paper | `#ffffff` | `--color-paper` | Reversed sections, high-contrast headline text on darkest backgrounds |

Body-text grays should be derived as low-opacity Paper (e.g. `rgba(255,255,255,0.72)` / `0.5`)
rather than introducing new neutrals. The three secondary accents are a warm gold/amber/orange
family, not arbitrary hues — that's what keeps four accent colors from reading as a rainbow. Each
subsidiary owns one secondary accent as its identity color; Gold stays the connective brand
thread used everywhere else (nav, CTAs, structural rules).

**Contrast notes:** Gold `#EFBF04` on Charcoal `#222126` ≈ 9.4:1 (passes AA for text). Paper on
Ink/Charcoal both exceed 15:1. Yellow/Amber/Orange are decorative fills (capsules, pill
backgrounds), not text colors on their own — pair with Ink/Charcoal text when used as a fill, not
Paper-on-accent for body copy.

### Typography

- **Display:** Space Grotesk (weights 500, 700) — geometric grotesk with enough character (the
  spurred G, the single-story y) to carry "large, bold headings" without reading as either
  luxury-editorial serif or generic SaaS-sans. Set tight (`letter-spacing: -0.01em` to `-0.02em`
  at large sizes), scaled aggressively (`clamp()` up to 7–10rem for hero/subsidiary names).
- **Body:** Manrope (weights 400, 500, 600) — clean humanist sans, quiet partner to the display
  face, holds up in long-form CSR/blog copy.
- **Eyebrow/utility:** Space Grotesk, uppercase, small size (0.75–0.85rem), wide tracking
  (0.15–0.2em) — used for section labels and category tags. Eyebrow text must always encode real
  information (a category, a date, a status) — never decorative numbering (01/02/03) unless the
  content is genuinely a sequence, which subsidiaries are not (they're peers, not steps).
- **Google Fonts import:**
  `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Manrope:wght@400;500;600&display=swap`

**Superseded:** the earlier Bodoni Moda / Jost luxury-editorial pairing is dropped — it read as
luxury-fashion, not corporate-industrial, and doesn't fit this brief.

### Spacing & Scale

- Base unit 8px. Section vertical padding is generous and asymmetric where it serves the layout
  concept below — negative space is a design element here, not filler.
- Type scale is intentionally wide: body 16–18px, section headings 2.5–4rem, hero/subsidiary
  display names 6–10rem (`clamp()`), so the jump from body copy to display type is dramatic.

### Style Direction

**Clean corporate, not SaaS-minimal and not luxury-editorial.** Reference point: a dark-canvas
studio site (Treize Grammes-style) — oversized bold sans headlines, huge confident negative
space, pill/capsule shapes as the recurring UI device, a signature small circular-arrow icon
reused everywhere, restrained but real color energy via the accent family above.

**Explicitly avoid:** generic bordered/shadowed "card" components for the subsidiaries (or
anywhere else feature-list-shaped content would default to a card grid); template SaaS patterns
(icon-in-circle + heading + paragraph ×3 in a grid); fabricated stats/testimonials/copy not
grounded in real content — skip a stats row or quote block rather than invent numbers.

**Reversed from an earlier draft of this doc:** rounded pill/capsule shapes are the primary
device for *functional* UI (nav, CTAs) and the subsidiary identity capsules — but purely
*decorative* pill use (e.g. a floating pill-per-item treatment for list content) was tried for
About's interest list and dropped; that list is now plain hairline-divided rows instead. Pills
are for buttons/links and the subsidiary capsules, not a decorative wrapper for arbitrary lists.

### Signature Shape Language — Pills & Capsules

Rounded-full pills and capsules replace bordered cards as the recurring decorative/structural
device:
- **Nav items** that scroll the page (About, Subsidiaries): outline pills.
- **Nav items** that link to a real page (CSR): filled Gold pill — the fill distinguishes "goes
  to a page" from "scrolls this one."
- **Signature icon**: a small circular arrow (↗ in a circle) reused across pills/buttons as a
  recurring brand mark.

Tried and dropped: a large vertical color capsule per subsidiary (one per accent color) as a
section visual. Removed as an unnecessary decorative element — the subsidiary sections are text
and whitespace only now, no accompanying graphic. The Yellow/Orange/Amber accents remain reserved
as each subsidiary's identity color for future use (e.g. if a real icon/photo is added later) but
aren't rendered as decoration today.

### Signature Layout — Subsidiaries as Editorial Spreads (not cards)

Each subsidiary gets its own full-bleed section — not a card in a grid. Scrolling through
subsidiaries feels like turning pages in a corporate report, not scanning a feature grid.

Per subsidiary section:
- Eyebrow = subsidiary's category (e.g. "Energy — Feedstock Trading"), not a number.
- Subsidiary name set at display scale (see type scale above), the dominant visual element on
  the section — no border, no background fill, no rounded box around the text.
- One short line of body copy, generously spaced from the headline.
- Thin gold hairline rule as the one linear "container" device — a line, never a box around text.
- Revealed on scroll (fade/rise, once per section — not a looping ambient animation).

### Animation Principles

- One orchestrated hero load sequence (headline + nav, staggered fade/rise, ~500–600ms total) —
  not scattered effects.
- Scroll-triggered reveals: `transform`/`opacity` only, `IntersectionObserver`-driven, each
  section's motif animates once on first entry (not looping).
- Animated icons (nav, footer social icons, any UI icon): hover/focus micro-interactions
  (nudge, morph, draw-in), not autoplaying loops — keeps things lively without ambient CPU cost.
- Respect `prefers-reduced-motion` everywhere; motion must never block or delay content
  legibility.
- Rule of thumb: motion should feel *occasional and earned*, not ambient — this is what keeps
  a heavily-animated brief from slowing the site down or reading as generic AI output.

### Component Notes

**No generic bordered/shadowed cards** anywhere structurally similar to a feature grid — this
includes the subsidiaries section (see Signature Layout above) and should be checked against for
CSR highlights / blog listings too. Prefer: pills/capsules (see Signature Shape Language),
full-bleed sections, large pull-quote-style blocks, asymmetric split layouts. If a boxed
component is truly needed (e.g. a blog post preview), keep it borderless — differentiate with
typography and whitespace, not a bordered/shadowed container.

### Icons

SVG only, stroke-based, never emoji. The small circular-arrow icon is the recurring signature
mark (see Signature Shape Language). Icons that appear in the nav, pills, or footer should have a
subtle hover animation (see Animation Principles).

---

## Pre-Delivery Checklist

- [ ] No generic bordered/shadowed cards used for the subsidiaries or similar list content
- [ ] Only the eight approved brand hex values in use (plus opacity variants of Paper for text)
- [ ] Secondary accents (Amber/Yellow/Orange) used only as decorative fills, not body text color
- [ ] Display type scaled dramatically larger than body (see Type Scale)
- [ ] Section eyebrows encode real info, not decorative numbering
- [ ] Scroll/hover animations respect `prefers-reduced-motion`
- [ ] No ambient/looping decorative animation running at rest
- [ ] Icons are SVG, stroke-based, no emoji
- [ ] Nav and footer social icons have hover micro-interactions
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] Focus states visible for keyboard nav
- [ ] Contrast: Gold-on-Charcoal and Paper-on-Ink/Charcoal checked (see Contrast notes)
