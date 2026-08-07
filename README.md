# Golden Tie Limited — Website

Multi-page corporate site for **Golden Tie Limited**, a conglomerate holding company.

## About Golden Tie Limited

Golden Tie Limited is a conglomerate with interests across multiple industries. Current
subsidiaries in scope for this site:

- **Tipping App** — digital tipping platform (fintech)
- **Biodiesel Feedstock Trader** — sourcing and trading waste-oil feedstock (energy)
- **Training Institute** — hands-on skills training (education)

## Scope

Multi-page Astro site:

1. **Index (`/`)** — Hero (with navigation), Subsidiaries, About, Footer.
2. **Corporate Social Responsibility (`/csr`)** — content TBD.
3. **Blogs (`/blog`)** — post listing + individual post pages, content TBD.

Nav items: About, Subsidiaries, Corporate Social Responsibility.

Full design direction (palette, typography, layout philosophy) lives in
`design-system/golden-tie/MASTER.md`, with per-page overrides in
`design-system/golden-tie/pages/`.

## Brand

- **Colors** (fixed, derived from the logo):
  - Gold `#EFBF04` — primary accent
  - Charcoal `#222126` — primary dark surface
  - Ink `#131313` / Slate `#2b2b2b` — supporting dark tones
  - Paper `#ffffff` — reversed/high-contrast text
- **Typography**: Space Grotesk (display/headings, bold) + Manrope (body) — clean corporate
  pairing, large bold headline scale.
- **Style**: Large bold headings, creative negative space, large decorative elements, no generic
  card grids (subsidiaries presented as full-bleed editorial spreads, not cards), tasteful
  scroll/hover animation, animated icons.
- **Logo**: text wordmark ("Golden Tie"), no logo file supplied.

## Tech

- [Astro](https://astro.build) (static, minimal JS), `minimal` starter template.
- Plain CSS (no framework).
- Deploy target: **Cloudflare Pages**.

## Commands

| Command           | Action                                      |
| :----------------- | :------------------------------------------- |
| `npm install`       | Installs dependencies                        |
| `npm run dev`       | Starts local dev server at `localhost:4321`  |
| `npm run build`     | Build production site to `./dist/`           |
| `npm run preview`   | Preview build locally before deploying       |
