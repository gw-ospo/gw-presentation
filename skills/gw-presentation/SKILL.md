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
| `src/deck-template.html` | Building any HTML deck — start every deck from this file (deck shell, navigation, font-mode detection) |
| `src/gw-theme.css` | Building any HTML deck — the CSS foundation (tokens, font stacks, element helpers), pasted into the template |
| `src/inline_asset.py` | Putting a brand SVG or logo PNG into a deck (base64 data URI; optional SVG recolor) |
| `src/render_deck.py` | Checking a finished HTML deck — renders every slide to PNG in both font modes |
| `src/build-pptx.js` | Building PowerPoint — a complete working PptxGenJS example |
| `assets/` | Official brand files: chevrons, six-pointed star pattern, logos |

Run scripts from the skill directory with `python3` (standard library only; `render_deck.py` needs Google Chrome or Chromium).

## Workflow

1. **Understand the talk.** Audience, setting (lecture hall, conference, workshop), length, and the one message the audience should leave with. Ask if it isn't clear; if you can't ask, assume and state your assumptions.
2. **Plan the narrative before any code.** Write the deck as a sequence of one-line slide intents. Each slide gets one idea. For 3–5 slides, see "Short decks" in `references/layouts.md`.
3. **Choose a layout per slide** from `references/layouts.md`, based on what the slide must do — not on how much content it has.
4. **Pick one pattern family for the deck** (chevrons or six-pointed stars; see Graphic elements below) and one secondary accent color at most.
5. **Build** the HTML deck from `src/deck-template.html` (default) or the PPTX (`references/pptx.md`).
6. **Render and check:** `python3 src/render_deck.py <deck.html>`, then look at every PNG for text overflow, overlapping boxes, headline wrapping, contrast against the pairings table, and one element per slide. Fix and re-render before delivering.

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

The font stacks in `src/gw-theme.css` list the installed brand family names before the substitutes. Pairing two typefaces usually feels best; three is permissible when intentional.

**Two font modes.** A deck renders with Gazzetta where it's installed and with Barlow Condensed everywhere else, and Barlow sets about 1.6× wider and needs heavier weights. The template detects which is available and swaps weights automatically, so: set display weights only with `var(--display-light | --display-weight | --display-strong)`, size headlines to fit in the wider substitute mode, and check both renders. Details: `references/brand.md` §3.

## Graphic elements

Use the **official files in `assets/`** — never draw imitations of chevrons or star patterns in CSS.

- **Chevron ribbon / chip** (`assets/chevrons/`, helpers `.chevron-ribbon`, `.chevron-chip`): forward motion. Ribbon under a title or along an edge; chip (portrait 3:4) to anchor a stat or quote. Always pointing right; max three colors per slide.
- **Six-pointed star pattern** (`assets/battle-flag/`, helper `.star-pattern`): tone-on-tone background texture bleeding off one edge on covers, dividers, and the close. Never isolated as a badge.
- **Gate crossbar** and **five-pointed star**: CSS fallbacks in `src/gw-theme.css` until official SVGs are added. Small accents usable in either family: crossbar as a single-line divider, the five-pointed star as a single upright accent, never a pattern.
- **One pattern family per deck, at most one element per slide**, no patterns on content-heavy slides. Plain solid rules and color bands are not graphic elements.

Inline every SVG with `python3 src/inline_asset.py <file> [--fill <color>]`, which prints a base64 `url(...)` for `background-image`; `--fill` gives tone-on-tone variants. Which color goes on which background, and suggestions per slide type: `references/brand.md` §4.

**Logos** (`assets/logos/`): **first and last slides only** — interior slides carry no logo. Use the GW Engineering lockup (`seas/`), unaltered, in a corner with clear space of ¼ its width; `-rev` versions on dark backgrounds. The bare GW monogram must not stand alone. Details: `references/brand.md` §5.

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

CSS and sizing for each, plus what to drop in short decks: `references/layouts.md`.

## Slide checklist

Run through this for every slide before writing its markup.

- **Purpose:** What is the one thing this slide must make the audience understand or feel? Is text, image, number, or a combination the best carrier?
- **Layout:** Does it serve the purpose, or was it just the first that fit? Is there a more powerful option (e.g., full-bleed image instead of text + image)?
- **Color:** Core palette only, plus at most the deck's one accent? Every text/background pair in the WCAG AA table?
- **Restraint:** Anything removable without losing the point? Lists ≤ 4 items, ≤ 12 words each, never nested?
- **Elements:** At most one graphic element, from the deck's pattern family? Logo only if this is the first or last slide?

Deck level:

- No "Questions?" or "Q&A" slide at the end — close with a statement, image, or call to action.
- Dark cover + light content + dark or image close (the "sandwich") gives natural pacing.
- Slide numbers only if the user asks for them.

## HTML output (default)

Produce one self-contained HTML file, starting from a copy of `src/deck-template.html`:

- Paste the whole of `src/gw-theme.css` at the marked spot in the `<style>` block, then add this deck's layout CSS from `references/layouts.md`.
- Add one `<div class="slide …">` per slide inside `#stage` (1280×720 each). Keep the deck shell CSS, the nav, and the script as they are: they provide scaling, keyboard and click navigation, `#slide=N` links, print layout, and font-mode detection.
- Trim the Google Fonts link to the families the deck uses.
- Brand SVGs and logo PNGs inlined with `src/inline_asset.py` (`--img` for logos); no references to local files.
- Font Awesome 6 via CDN only if icons are used: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`.
- Placeholder images: `https://picsum.photos/seed/<descriptive-keyword>/<width>/<height>`, keyword matching the slide content.
- Presenter notes, if requested: a `<details>` block per slide, hidden in print.

## PowerPoint output

Read `references/pptx.md` first. In short: PptxGenJS, `LAYOUT_16x9` (10" × 5.625"), work natively in inches, brand `fontFace` names with substitutes as fallback, official SVGs from `assets/`, and tell the user up front which fonts they need installed. Do not use GW's official PowerPoint templates.

## Gotchas

Mistakes that have actually happened building GW decks:

- **Don't rewrite the template's slide switching.** It toggles `visibility`, not `display`: a layout class like `.s2 { display: flex }` out-ranks `.slide { display: none }` and every slide shows at once.
- **Gazzetta is heavy.** Its Regular (400) already reads bold; 600 is ultra-black. Raw `font-weight` numbers on display text look right in one font mode and wrong in the other — use the weight tokens.
- **Gazzetta italic** is a separate family, `Gazzetta Slanted`. For italic display text use `font-family: var(--font-display-italic); font-style: italic;` — the italic style matches Gazzetta Slanted's real italic (and Barlow's in substitute mode). `font-style: italic` with plain `--font-display` gets a fake slant.
- **Display lines break differently in the two font modes.** Give display text a `max-width` and `text-wrap: balance` (body text: `text-wrap: pretty`) so both modes break into the same, even lines instead of one long line in brand mode and an orphan in substitute mode.
- **Safari** may ignore user-activated Adobe fonts (it restricts pages to system fonts) and show substitute mode while Chrome shows brand mode. That is expected — it's why both modes must look right.
- **Hand-made SVG data URIs break** on the `<?xml?>` prolog and the `#` in fill colors. Use `src/inline_asset.py`. Pasting several SVGs as raw `<svg>` markup can also collide on internal pattern IDs; prefer the `url(...)` form.
- **Buff text on white** fails contrast (1.6:1). Make labels quieter with size and weight, not with pale color.
- **Previewing a local deck in an embedded browser pane** may show a static snapshot with scripts disabled, so navigation looks broken. Open the file in a real browser, or serve it (`python3 -m http.server`) and open it via `localhost`.
- **PPTX:** no `#` in colors, no 8-character hex, never reuse option objects, never convert pixel coordinates — see `references/pptx.md`.
- **Synced folders (Box, Dropbox, iCloud):** some tools fail reading files there with "Resource deadlock avoided"; copy the file to a temp directory first.
