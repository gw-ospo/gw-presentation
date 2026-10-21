---
name: gw-presentation
description: >
  Creates George Washington University (GW) branded slide presentations — self-contained HTML decks by default, PowerPoint (.pptx) on request — applying the GW brand palette, typography, official graphic elements, and Presentation Zen principles. Use when the user asks for slides, a deck, or a presentation for a GW context (research talk, course lecture, conference, seminar, department meeting), mentions GW or GWU branding, or wants existing slides redesigned in the GW style.
license: BSD-3-Clause (code) and CC-BY-4.0 (text); GW logos and graphic elements are not licensed. See LICENSE.md.
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
| `src/build_deck.py` | Building any HTML deck — assembles template + theme + your layout CSS and slides, inlining assets |
| `src/inline_asset.py` | Putting a brand SVG or logo PNG into a deck (base64 data URI; optional SVG recolor) |
| `src/render_deck.py` | Checking a finished HTML deck — renders every slide to PNG in both font modes |
| `src/gw_pptx.js` | Building PowerPoint — slide builders, GW layouts with placeholders, theme fonts and colors (Node + PptxGenJS) |
| `src/render_pptx.py` | Checking a finished .pptx — renders every slide to PNG (LibreOffice, or PowerPoint on macOS) |
| `src/install_fonts.py` | Called by the render scripts; installs the bundled free fonts where they're missing |
| `assets/` | Official brand files: chevrons, six-pointed star pattern, logos; `assets/pptx/` holds pre-rendered images for PowerPoint |
| `fonts/` | The free substitute fonts (SIL Open Font License), for renders on machines without them |

Run Python scripts from the skill directory with `python3` (standard library only). Building needs no browser: HTML decks need only Python; PowerPoint decks need Node with pptxgenjs (`npm install pptxgenjs` in the folder the deck script runs from, or a global install). Checking needs Chrome or Chromium (HTML) or LibreOffice or PowerPoint (pptx).

## Workflow

1. **Understand the talk.** Audience, setting (lecture hall, conference, workshop), length, and the one message the audience should leave with. Ask if it isn't clear; if you can't ask, assume and state your assumptions.
2. **Plan the narrative before any code.** Write the deck as a sequence of one-line slide intents. Each slide gets one idea. For 3–5 slides, see "Short decks" in `references/layouts.md`.
3. **Choose a layout per slide** from `references/layouts.md`, based on what the slide must do — not on how much content it has.
4. **Pick one pattern family for the deck** (chevrons or six-pointed stars; see Graphic elements below) and one secondary accent color at most.
5. **Build** the HTML deck with `src/build_deck.py` (default) or the PPTX (`references/pptx.md`).
6. **Render and check:** `python3 src/render_deck.py <deck.html>` (PowerPoint: `python3 src/render_pptx.py <deck.pptx>`), then look at the contact sheet it prints and at single slides where needed, for text overflow, overlapping boxes, headline wrapping, contrast against the pairings table, and one element per slide. Fix and re-render before delivering.

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

**Two font modes.** A deck renders with Gazzetta where it's installed and with Barlow Condensed everywhere else, and Barlow sets about 1.6× wider and needs heavier weights. The template detects which is available and swaps weights automatically, so: set display weights only with `var(--display-light | --display-weight | --display-strong)`, write display sizes as `calc(<size>px * var(--display-scale))` (brand mode draws them 1.25× larger to match Barlow's presence), size headlines to fit in the wider substitute mode, and check both renders. Details: `references/brand.md` §3.

## Graphic elements

Use the **official files in `assets/`** — never draw imitations of chevrons or star patterns in CSS.

- **Chevron ribbon / chip** (`assets/chevrons/`, helpers `.chevron-ribbon`, `.chevron-chip`): forward motion. Ribbon under a title or along an edge; chip (portrait 3:4) to anchor a stat or quote. Always pointing right; max three colors per slide.
- **Six-pointed star pattern** (`assets/battle-flag/`, helper `.star-pattern`): tone-on-tone background texture bleeding off one edge on covers, dividers, and the close. Never isolated as a badge.
- **Gate crossbar** and **five-pointed star**: CSS fallbacks in `src/gw-theme.css` until official SVGs are added. Small accents usable in either family: crossbar as a single-line divider, the five-pointed star as a single upright accent, never a pattern.
- **One pattern family per deck, at most one element per slide**, no patterns on content-heavy slides. Plain solid rules and color bands are not graphic elements.

Inline every SVG with a `{{asset:<file> fill=<color>}}` placeholder (see HTML output below), or by hand with `python3 src/inline_asset.py <file> [--fill <color>]`; `fill` gives tone-on-tone variants. Which color goes on which background, and suggestions per slide type: `references/brand.md` §4.

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

Produce one self-contained HTML file. Write two working files — `layout.css` (this deck's CSS from `references/layouts.md`) and `slides.html` (one `<div class="slide …">` per slide, 1280×720 each) — then assemble:

```bash
python3 src/build_deck.py --title "…" --css layout.css --slides slides.html --out deck.html --drop-font Oswald
```

- Reference brand files with placeholders, which the build inlines: `{{asset:assets/battle-flag/gw-blue.svg fill=navy-yard}}` in CSS (becomes a `url(...)`), `{{img:assets/logos/seas/gw-sch-seas-short-2c-rev.png alt="GW Engineering" class="gw-logo"}}` in slides. No other references to local files.
- `--drop-font` removes Google Fonts families the deck doesn't use (repeatable).
- The build pastes `src/gw-theme.css` into `src/deck-template.html`, whose shell and script provide scaling, keyboard and click navigation, `#slide=N` links, print layout, and font-mode detection. Don't edit the built file by hand; change the working files and rebuild.
- Font Awesome 6 via CDN only if icons are used: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`.
- Placeholder images: `https://picsum.photos/seed/<descriptive-keyword>/<width>/<height>`, keyword matching the slide content.
- Presenter notes, if requested: a `<details>` block per slide, hidden in print.

## PowerPoint output

Read `references/pptx.md` first. In short: tell the user up front which fonts the file needs (brand or free substitutes — a .pptx can't fall back), write a short Node script that calls the slide builders in `src/gw_pptx.js` (`cover`, `stat`, `divider`, `tiles`, `close`, …), save, and check with `python3 src/render_pptx.py <deck.pptx>`. The helper puts patterns and logos in the right places and gives the file GW layouts, theme fonts, and theme colors, so slides added later in PowerPoint stay on brand. Do not use GW's official PowerPoint templates.

## Working in a sandbox or cloud session

Cloud machines usually lack the brand fonts, often lack a browser or LibreOffice, and may not reach Google Fonts. The skill still works there:

- **The files you deliver are unaffected.** HTML decks pick the brand fonts on the viewer's machine; PowerPoint files name the brand fonts and show them wherever they're installed. Build for the presenter, not for the sandbox.
- **Renders use the bundled free fonts**, installed automatically. Free-font renders are a safe stand-in for the brand fonts' line breaks in display, accent, and label text (the substitutes set wider), but body text sets about 3% narrower in Nunito Sans than in Avenir Next — leave every body text box at least a line of spare room.
- **PowerPoint:** build the deck twice from the same script — `fonts: 'brand'` to deliver, `fonts: 'substitutes'` to render and check. Rendering the brand-font file without the brand fonts shows unrelated fallback fonts.
- **When a render script exits with status 3 ("NOT RENDERED")**, a tool is missing. The deck is complete, but say plainly that it wasn't visually checked, and suggest the user look through every slide.

## Gotchas

Mistakes that have actually happened building GW decks:

- **Don't rewrite the template's slide switching.** It toggles `visibility`, not `display`: a layout class like `.s2 { display: flex }` out-ranks `.slide { display: none }` and every slide shows at once.
- **Gazzetta is heavy.** Its Regular (400) already reads bold; 600 is ultra-black. Raw `font-weight` numbers on display text look right in one font mode and wrong in the other — use the weight tokens.
- **Gazzetta italic** is a separate family, `Gazzetta Slanted`. For italic display text use `font-family: var(--font-display-italic); font-style: italic;` — the italic style matches Gazzetta Slanted's real italic (and Barlow's in substitute mode). `font-style: italic` with plain `--font-display` gets a fake slant.
- **Display lines break differently in the two font modes.** Give display text a `max-width` and `text-wrap: balance` (body text: `text-wrap: pretty`) so both modes break into the same, even lines instead of one long line in brand mode and an orphan in substitute mode.
- **Safari** may ignore user-activated Adobe fonts (it restricts pages to system fonts) and show substitute mode while Chrome shows brand mode. That is expected — it's why both modes must look right.
- **Hand-made SVG data URIs break** on the `<?xml?>` prolog and the `#` in fill colors. Use `src/inline_asset.py`. Pasting several SVGs as raw `<svg>` markup can also collide on internal pattern IDs; prefer the `url(...)` form.
- **Hyphenated words split at the hyphen** under `text-wrap: balance` ("know- / how"). Use a non-breaking hyphen (`&#8209;`) or wrap the word in `<span style="white-space: nowrap">`.
- **Buff text on white** fails contrast (1.6:1). Make labels quieter with size and weight, not with pale color.
- **Previewing a local deck in an embedded browser pane** may show a static snapshot with scripts disabled, so navigation looks broken. Open the file in a real browser, or serve it (`python3 -m http.server`) and open it via `localhost`.
- **PPTX:** use the builders; for custom slides, no `#` in colors, no 8-character hex, never reuse option objects, never convert pixel coordinates, and add patterns before text — see `references/pptx.md`.
- **Synced folders (Box, Dropbox, iCloud):** some tools fail reading files there with "Resource deadlock avoided"; copy the file to a temp directory first.
