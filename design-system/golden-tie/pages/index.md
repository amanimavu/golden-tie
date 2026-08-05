# Page Override: index (one-page site)

Overrides MASTER.md for this project. Brief calls for a **minimal**, **dark** (black + gold) one-page
site — MASTER's default palette/style are light-bg "Liquid Glass" (blur/morph SaaS style), which
don't fit. Typography from MASTER is kept as-is.

## Color Palette (dark, overrides MASTER)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#0D0D0D` | `--color-background` |
| Surface (cards) | `#1A1A1A` | `--color-surface` |
| Foreground (body text) | `#F5F5F0` | `--color-foreground` |
| Accent/Gold | `#D4AF37` | `--color-accent` |
| Accent Light (highlights) | `#F4E5B2` | `--color-accent-light` |
| Border | `#33301F` | `--color-border` |
| On Accent (text on gold) | `#0D0D0D` | `--color-on-accent` |

Contrast check: `#D4AF37` on `#0D0D0D` ≈ 8:1 (passes AA). `#F5F5F0` on `#0D0D0D` ≈ 18:1.

## Typography (from MASTER, unchanged)

- Heading: Bodoni Moda
- Body: Jost
- Google Fonts import: `https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;600;700&family=Jost:wght@300;400;500;600;700&display=swap`

## Style (overrides MASTER)

Minimal, static, editorial — not "Liquid Glass". No blur/morph/glass effects. Flat surfaces,
generous whitespace, thin gold hairline borders/dividers, subtle hover states (translateY +
border-color transition, 150-250ms). No mega menu, no path-selection pattern — single page,
single nav (in-page anchor links only, if any).

## Sections (overrides MASTER's "Enterprise Gateway" pattern)

1. Hero — wordmark "Golden Tie", tagline ("Experiential Company"), one-line intro.
2. About — paragraph on the conglomerate + interest areas list.
3. Subsidiaries — 3-card grid: Biodiesel Feedstock Trader, Training School, Tipping App.
4. Footer — company name, year, generic contact placeholder.

## Components

- **Cards**: `background: var(--color-surface)`, `border: 1px solid var(--color-border)`,
  `border-radius: 8px`, padding `24px`, hover: `border-color: var(--color-accent)` +
  `translateY(-2px)`, transition 200ms.
- **Buttons/links**: gold text or gold border on transparent bg; avoid solid gold fills for large
  areas (only small CTAs if any — v1 has no hard CTA).

## Kept from MASTER

- Spacing scale, shadow depths, a11y checklist (contrast, focus states, reduced-motion, no
  emoji icons, responsive breakpoints 375/768/1024/1440).
