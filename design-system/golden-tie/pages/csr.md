# Page Override: Corporate Social Responsibility (`/csr`)

Inherits MASTER.md in full. New page — content and exact section breakdown not yet specified by
the brief.

## Known

- Shares site-wide Hero (with nav) and Footer from the index page.
- Nav's "Corporate Social Responsibility" item links here.
- Per MASTER's Component Notes: any CSR highlight/initiative listing should avoid a generic card
  grid — prefer editorial list rows, large pull-quote blocks, or asymmetric split layouts,
  consistent with the Subsidiaries section's approach on the index page.
- Uses the photo `page-header` variant (grayscale, scrimmed) — not the site hero — with a fixed
  headline ("Responsibility, built into how we operate") and lede.

## Sections

The page body is a single **Programs** list (`#programs`) — the concrete initiatives Golden Tie
runs, no separate "focus areas" / values section. One gold `.eyebrow` label ("Programs",
uppercase, accent color — `.programs-label`) heads the list; no visible section headline or
description under it. A `visually-hidden` `<h2>` backs the landmark.

Each program row **reuses the `.venture` classes** from the index Subsidiaries section (styling,
scroll-reveal, reduced-motion, mobile padding all inherited — keeps CSR "consistent with the
Subsidiaries section's approach" as MASTER requires). Row shape:

- `.eyebrow` = program category (e.g. "Environment — Reforestation").
- Gold `.hairline` — the one linear container device, never a box.
- `.venture-name` = short program name (Reforestation, Waste-Oil Collection, Skills Training).
- `.program-lead` = one-line statement, display face, medium weight, one step below the name.
  Numbers that carry the point (e.g. "500 kg") are wrapped in `.hi` → Gold.
- `.venture-desc` = one muted supporting sentence.

Current programs: **Reforestation** (one tree per 500 kg of oil collected, funded off the
biodiesel feedstock tally), **Waste-Oil Collection** (used cooking oil diverted from drains /
landfill into fuel), **Skills Training** (Training Institute, employability-focused). Add more as
sibling rows.

## Open

- Real numbers to date (trees planted / oil collected) if Golden Tie wants a live tally — omit
  rather than fabricate, per MASTER.
- Any programs beyond the current three.
- A partner/verification link per program (would bring in the circular-arrow signature icon on
  the row, matching the linked `.venture` rows on the index page).
