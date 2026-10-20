---
name: gw-presentation
description: >
  Creates George Washington University (GW) branded slide presentations — self-contained HTML decks by default, PowerPoint (.pptx) on request — applying the GW brand palette, typography, official graphic elements, and Presentation Zen principles. Use when the user asks for slides, a deck, or a presentation for a GW context (research talk, course lecture, conference, seminar, department meeting), mentions GW or GWU branding, or wants existing slides redesigned in the GW style.
metadata:
  author: Lorena A. Barba
  version: "2.0-dev"
---

# GW Presentation

Produce slide decks that are brand-coherent and audience-first. The goal is not compliance — it's impact. Done right, those are the same thing.

## Files in this skill

| Path | Read when |
|---|---|
| `references/brand.md` | Always, before designing: colors, accessible pairings, typography, graphic-element rules, logo rules |
| `references/layouts.md` | Choosing and building slide layouts (nine patterns, with CSS) |
| `references/pptx.md` | The user asks for PowerPoint |
| `src/gw-theme.css` | Building any HTML deck — the CSS foundation (tokens, font stacks, helpers) |
| `src/build-pptx.js` | Building PowerPoint — a complete working PptxGenJS example |
| `assets/` | Official brand files: chevrons, six-pointed star pattern, logos |

## Workflow

1. **Understand the talk.** Audience, setting (lecture hall, conference, workshop), length, and the one message the audience should leave with. Ask if it isn't clear.
2. **Plan the narrative before any code.** Write the deck as a sequence of one-line slide intents. Each slide gets one idea.
3. **Choose a layout per slide** from `references/layouts.md`, based on what the slide must do — not on how much content it has.
4. **Pick one graphic-element style for the deck** (see Graphic elements below) and one secondary accent color at most.
5. **Build** the HTML deck (default) or the PPTX (`references/pptx.md`).
6. **Render and check** every slide: text overflow, overlapping boxes, contrast against the pairings table, one element per slide. Fix before delivering.

## Philosophy: Presentation Zen first

These principles shape every decision, including which CSS to write.

- **One idea per slide.** Three bullets are three competing ideas — split them. "And also…" mid-bullet marks the split point.
- **Signal over noise.** Every element earns its place. White space gives ideas room to land; a slide that feels "empty" is often doing exactly the right amount of work.
- **Amplify, don't duplicate.** Slides are not speaker notes on a screen. Amplify the spoken message with an image, a key number, or one concept crystallized into a phrase.
- **Images over bullets.** A full-bleed photograph with five words beats six bullet points — it is understood faster and remembered longer.
- **Restraint in design.** Choose one visual motif and carry it through the deck. Every color and every pattern on every slide is noise, not richness.
- **Contrast creates hierarchy.** The audience should never search for the main point. Size, weight, and color contrast make the most important thing obviously the most important.

## Brand essentials

Full definitions are in `references/brand.md`. The essentials:

**Colors.** GW Blue `#033C5A`, GW Buff `#D6BF91`, Potomac `#0075C8`, Navy Yard `#00223E`, White. Core colors carry 80%+ of the visual weight. Use only the approved 80/50/20% tints. At most one secondary accent per deck (Row House, Blossom, Parchment, Blue Fog, Patina).

**Contrast.** Use only text/background pairs from the WCAG AA table in `references/brand.md` §2. GW Buff is never a text color on white or light backgrounds — on light slides it is for rules, borders, and fills only.

**Typography — brand fonts first, free substitutes second.**

| Role | Brand font | Free substitute | Use for |
|---|---|---|---|
| Display | Gazzetta | Barlow Condensed (Oswald for heavy all-caps numerals/stamps only) | Titles, dividers, big numbers |
| Body | Avenir Next | Nunito Sans | Body, labels, eyebrows, captions |
| Accent | Source Serif | Source Serif 4 | Sparingly: pull quotes, short callouts |

The font stacks in `src/gw-theme.css` already list the installed brand family names before the substitutes. Pairing two typefaces usually feels best; three is permissible when intentional.

## Graphic elements

Use the **official files in `assets/`** — never draw imitations of chevrons or star patterns in CSS.

- **Chevron ribbon / chip** (`assets/chevrons/`): forward motion. Ribbon under a title or above a footer; chip to anchor a stat or quote. Always pointing right; max three colors per slide; never a chevron background together with chips.
- **Six-pointed star pattern** (`assets/battle-flag/`): background texture bleeding off the edge on covers and dividers. Never isolated as a badge.
- **Gate crossbar** and **five-pointed star**: CSS fallbacks in `src/gw-theme.css` until official SVGs are added. Crossbar is a single-line divider; the five-pointed star is a single upright accent, never a pattern.
- **One pattern per slide, one element style per deck**, and no patterns on content-heavy slides.

For HTML, inline SVG assets (as `<svg>` markup or a `data:image/svg+xml` URI) so the deck stays a single self-contained file. Placement rules and suggestions per slide type: `references/brand.md` §4.

**Logos** (`assets/logos/`): use only the official files, unaltered, with clear space of ¼ the logo width. The GW monogram must not stand alone — pair it with a school, center, or institute logo. Use `-rev` versions on dark backgrounds. Details: `references/brand.md` §5.

## Layout menu

| Pattern | Use it when |
|---|---|
| A. Cover (dark / light / image) | Opening — sets the deck's mood |
| B. Big Idea | The single most important point; once or twice per deck |
| C. Full-Bleed Image | Transitions, scene-setting, emotional moments |
| D. Split | Evidence on one side, story on the other |
| E. Stat Callout | A number is the whole point (1–3 stats) |
| F. Tiled Content | 3–4 parallel concepts of equal weight |
| G. Section Divider | Reset between major sections |
| H. Pull Quote | A human voice or testimonial |
| I. Standard Content | Prose or a short list, only when no visual serves |

CSS and sizing for each: `references/layouts.md`.

## Slide checklist

Run through this for every slide before writing its markup.

- **Purpose:** What is the one thing this slide must make the audience understand or feel? Is text, image, number, or a combination the best carrier?
- **Layout:** Does it serve the purpose, or was it just the first that fit? Is there a more powerful option (e.g., full-bleed image instead of text + image)?
- **Color:** Core palette only, plus at most the deck's one accent? Every text/background pair in the WCAG AA table?
- **Restraint:** Anything removable without losing the point? Lists ≤ 4 items, ≤ 12 words each, never nested?
- **Elements:** At most one graphic element, and the same style as the rest of the deck?

Deck level:

- No "Questions?" or "Q&A" slide at the end — close with a statement, image, or call to action.
- Dark cover + light content + dark or image close (the "sandwich") gives natural pacing.
- Slide numbers only if the user asks for them.

## HTML output (default)

Produce one self-contained HTML file:

- All CSS in a `<style>` block: start with the whole of `src/gw-theme.css`, then add layout CSS from `references/layouts.md`.
- Google Fonts `<link>` for the substitutes in `<head>` (exact URL in `references/brand.md` §3).
- Brand SVGs inlined; no references to local files.
- Font Awesome 6 via CDN only if icons are used: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`.
- Placeholder images: `https://picsum.photos/seed/<descriptive-keyword>/<width>/<height>`, keyword matching the slide content.
- Each slide is a `<div class="slide">` at 1280×720, positioned absolutely inside a fixed 1280×720 `#stage` that a script scales (`translate` + `scale`) to fill the viewport.
- Presentation mode: ArrowRight/ArrowLeft (and Space/PageDown/PageUp) navigation, plus a small floating nav overlay.
- Presenter notes, if requested: a `<details>` block per slide, hidden in print.

## PowerPoint output

Read `references/pptx.md` first. In short: PptxGenJS, `LAYOUT_16x9` (10" × 5.625"), work natively in inches, brand `fontFace` names with substitutes as fallback, official SVGs from `assets/`, and tell the user up front which fonts they need installed. Do not use GW's official PowerPoint templates.

## Gotchas

Mistakes that have actually happened building GW decks:

- **Showing one slide at a time:** toggle `visibility: hidden/visible` (or a single `.active` class), not `display` — a layout class like `.s2 { display: flex }` out-ranks `.slide { display: none }` and every slide shows at once.
- **Navigation script scope:** inline `onclick` handlers can't see `let`/`const` declared inside a block; keep the current-slide index at script top level (`var current = 0`) or attach listeners with `addEventListener`.
- **Gazzetta italic** is a separate family, `Gazzetta Slanted`. Use `var(--font-display-italic)` for italic display text; `font-style: italic` on `Gazzetta` gets a fake slant.
- **Safari** may ignore user-activated Adobe fonts (it restricts pages to system fonts) and fall back to the substitutes, while Chrome renders them. That is expected; the substitutes are the design's safety net.
- **Condensed display faces** set narrower than the type scale was first tuned for — check headline wrapping and adjust size rather than letting a title run to three lines.
- **Buff text on white** fails contrast (1.6:1). Make labels quieter with size and weight, not with pale color.
- **Brand SVG colors** are print conversions, slightly off the screen palette: GW Blue files fill with `#003a5d`/`#003a60`, Potomac with `#0073bb`/`#0080c5`, Blue Fog with `#5ccbf2`. Set the fill to the exact hex from `references/brand.md` when inlining.
- **PPTX:** no `#` in colors, no 8-character hex, never reuse option objects, never convert pixel coordinates — see `references/pptx.md`.
- **Synced folders (Box, Dropbox, iCloud):** some tools fail reading files there with "Resource deadlock avoided"; copy the file to a temp directory first.
