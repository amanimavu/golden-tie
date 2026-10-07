# Page Override: index (`/`)

Overrides MASTER.md where noted. Site is now **multi-page** (Index, CSR, Blogs) — index is the
main marketing page: Hero, Subsidiaries, About, Partners, Footer.

## Navigation (site-wide, lives in Hero on every page)

Wordmark/logo left, nav right, rendered as pills per MASTER's Signature Shape Language:

- **About** — outline pill, anchor to `#about` on index; from other pages, link to `/#about`
- **Subsidiaries** — outline pill, anchor to `#subsidiaries` on index; from other pages, link to
  `/#subsidiaries`
- **Partners** — outline pill, anchor to `#partners` on index; from other pages, link to
  `/#partners`
- **Corporate Social Responsibility** — filled Gold pill, links to `/csr` page (label may
  abbreviate to "CSR" on small screens). Filled, not outline, because it's the one nav item that
  goes to a different page rather than scrolling this one.

Hover/focus state on outline pills uses a Gold border/fill transition (scroll-spy "active
section" tracking was considered and skipped as unnecessary complexity for a single page).

## Sections (in order)

1. **Hero** (contains navigation) — wordmark, nav, large display headline (company name +
   one-line positioning), orchestrated load-in animation per MASTER.
2. **Subsidiaries** — the three editorial-spread sections from MASTER's Signature Layout (Tipping
   App, Biodiesel Feedstock Trader, Training Institute). `id="subsidiaries"` on the wrapping
   section for nav anchoring.
3. **About** — conglomerate description + industries list. `id="about"` on the section.
4. **Partners** — partner marks on bordered tiles in a wrapping flex row, not a grid: flex
   shrink-wraps to the actual partner count, so a short list reads as a deliberate compact block
   instead of a lopsided row followed by dead space. 5 tiles across at the 1180px content max,
   stepping to 2 per row below 640px. `id="partners"` on the section for nav anchoring. On Paper,
   continuing the light band from About and separated from it by a single hairline. Logos live in
   `src/lib/images/partners/` and are added as entries to the `partners` array in `index.astro`'s
   frontmatter. **Overrides MASTER's "no bordered card" rule** — the logo wall is the one place
   framed marks are wanted, and reads as a logo grid rather than as content cards.
5. **Footer** — company info, social icons (with hover micro-interactions per MASTER). No
   secondary nav — tried, removed; primary nav in the hero is the only nav on the page.

## Subsidiary content (for the three spreads)

| Subsidiary | Eyebrow (category) | Reserved identity color (unused today) |
|---|---|---|
| Tipping App | Fintech — Digital Tipping | Yellow `#FFDD00` |
| Biodiesel Feedstock Trader | Energy — Feedstock Trading | Orange `#F07200` |
| Training Institute | Education — Skills Training | Amber `#FFC766` |

Order on the page: Tipping App → Biodiesel Feedstock Trader → Training Institute (matches the
order given in the brief). No numbering — these are peer businesses, not a sequence. Each spread
is text + whitespace only (eyebrow, hairline, name, description) — the per-subsidiary color
capsule was tried and removed as an unneeded decorative element (see MASTER).

## Superseded from earlier version

- The one-page-only scope, the old black/gold placeholder palette (`#0D0D0D` / `#D4AF37`), the
  Bodoni Moda/Jost typography, the bordered subsidiary card-grid, the thin-SVG-line-motif
  concept, and the static halftone texture background are all replaced by MASTER.md's current
  rules (pills/capsules, the accent family above, the interactive `NoiseReveal` component for
  the hero graphic). The thin gold scrollbar retargets its tint to `#EFBF04` (not the old
  `#D4AF37`).
