# Golden Tie Limited — Website

Minimal one-page marketing site for **Golden Tie Limited**, an experiential holding company.

## About Golden Tie Limited

Golden Tie Limited is a conglomerate with interests across:

- Service Industry
- Hospitality
- Entertainment
- Recycling
- Biodiesel
- Entrepreneurship
- Tipping App
- Supplies and Staffing

## Scope (v1)

Single-page site. Sections:

1. **Hero** — company name, one-line description ("Experiential Company"), brief intro to the conglomerate.
2. **About** — short paragraph on Golden Tie Limited and its areas of interest (list above).
3. **Subsidiaries** — card grid listing the three subsidiaries in focus for v1:
   - **Biodiesel Feedstock Trader** — Sourcing and trading waste-oil feedstock for sustainable biodiesel production.
   - **Training School** — Hands-on training programs building skills for hospitality, service, and entrepreneurship.
   - **Tipping App** — A digital tipping platform connecting service staff with the customers they serve.
4. **Footer** — company name, year, contact placeholder (generic for now, no real email/phone/address yet).

No dedicated sub-pages for v1 — everything lives on the single page.

## Brand

- **Colors**: Black and Gold.
  - Black: `#0D0D0D` (background) / `#1A1A1A` (surface)
  - Gold: `#D4AF37` (primary accent) / `#F4E5B2` (light gold, highlights)
  - Off-white `#F5F5F0` for body text on dark backgrounds.
- **Typography**: Bodoni Moda (headings/display) + Jost (body) — luxury, minimalist pairing.
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
