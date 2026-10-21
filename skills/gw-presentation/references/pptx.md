# PowerPoint (.pptx) Output

Build PowerPoint decks with `src/gw_pptx.js`, a helper on top of PptxGenJS. It applies the same design as the HTML layouts (`references/layouts.md`) and makes the file itself carry the brand, so slides the presenter adds later come out right. Do not use GW's official PowerPoint templates; this skill has its own design.

## Contents

- [Step 0 — Fonts](#step-0--fonts)
- [Setup and quick start](#setup-and-quick-start)
- [Slide builders](#slide-builders)
- [What the file carries](#what-the-file-carries)
- [Custom slides](#custom-slides)
- [Type scale and fonts](#type-scale-and-fonts)
- [Sizes in inches](#sizes-in-inches)
- [Check before delivering](#check-before-delivering)
- [Gotchas](#gotchas)

## Step 0 — Fonts

A .pptx names its fonts; it can't carry a fallback stack the way CSS does. Build for the fonts on the presenter's machine, and tell them before you build:

> "This deck uses the GW brand fonts **Gazzetta**, **Avenir Next**, and **Source Serif** (Adobe Fonts, through GW's Creative Cloud subscription — https://communications.gwu.edu/brand-guidelines/typography). Without them PowerPoint substitutes other fonts and the layout won't look right. If you can't install them, I can build it with free Google Fonts instead (Barlow Condensed, Nunito Sans, Source Serif 4), which you'd install once."

Use `fonts: 'brand'` (default) or `fonts: 'substitutes'`. The helper adjusts display sizes and weights for each (Barlow Condensed sets ~1.6× wider and lighter than Gazzetta). If you don't know which the presenter has, build both files.

## Setup and quick start

Needs Node 18+, `npm install pptxgenjs` in a working folder (not in the skill), and Google Chrome or Chromium (the helper renders SVG fallback images and the star texture with it). Put the deck script anywhere, `require` the helper by its absolute path, and **run the script from the working folder** — the helper loads PptxGenJS from the current directory.

```js
// talk.js — run with: node talk.js
const gw = require('/path/to/skill/src/gw_pptx.js');

const deck = gw.createDeck({ title: 'Reproducible by Design', author: 'A. Presenter',
                             fonts: 'brand', pattern: 'chevrons' });   // or 'stars', or null
deck.cover({ eyebrow: 'Research Symposium · 2026',
             title: [{ text: 'Reproducible', breakLine: true }, { text: 'by Design', italic: true }],
             subtitle: 'Why computational research should be rerunnable',
             byline: 'A. Presenter · School of Engineering and Applied Science' });
deck.stat({ stats: [{ value: '26%', label: 'of studies could be reproduced' }],
            gloss: 'Even after the journal required shared code and data.', source: 'Author (Year), Journal' });
deck.divider({ label: 'Part two', title: 'From principle\nto practice' });
deck.close({ text: 'Make your next paper\none anyone can rerun.', gloss: 'Version it. Automate it. Share it.' });
deck.save('talk.pptx').then(({ file, slides }) => console.log(file, slides));
```

A complete six-slide example: `examples/reproducible-research/build-pptx.js` in the skill's repository.

## Slide builders

Each builder follows a pattern from `references/layouts.md` and returns the PptxGenJS slide.

| Builder | Pattern | Arguments |
|---|---|---|
| `cover()` | A. Cover (dark) | `eyebrow`, `title`, `subtitle`, `byline` |
| `bigIdea()` | B. Big Idea | `text`, `gloss`, `dark` |
| `stat()` | E. Stat Callout | `stats` (1–3 of `{ value, label, color: 'potomac'? }`), `gloss`, `source` |
| `divider()` | G. Section Divider | `label`, `title` |
| `tiles()` | F. Tiled Content | `title` (optional), `tiles` (2–4 of `{ label, body }`) |
| `content()` | I. Standard Content | `title`, `body` (prose, or an array of ≤ 4 bullets) |
| `split()` | D. Split | `eyebrow`, `title` (break lines with `\n`), `body`; on the other side `image` (path) + `imageAlt`, `photoPlaceholder: true` (an empty picture placeholder to fill later, on the left), or a plain panel; `imageLeft` |
| `image()` | C. Full-Bleed Image | `image` (path) + `imageAlt`, or `photoPlaceholder: true`; `text` (≤ 12 words) on a GW Blue band |
| `quote()` | H. Pull Quote | `quote`, `attribution`, `dark` |
| `close()` | dark Big Idea close | `text`, `gloss` |

- **Text:** a string (`\n` breaks lines) or, for titles, an array of runs `{ text, italic, breakLine }`. Italic display runs use Gazzetta Slanted automatically.
- **Pattern family** is set once in `createDeck` and applied for you: chevron ribbon along the bottom of the cover, divider, and close, plus a chevron chip beside a single stat (`'chevrons'`); or a tone-on-tone six-pointed star texture bleeding off the cover's right edge, the divider, and the close's left edge (`'stars'`).
- **Logo:** added for you on the cover and the close only, never on interior slides: top-left on the cover, and on the close in the corner away from the pattern.
- Builders refuse what the design rules forbid (four stats, five bullets, one tile).
- **"Leave a spot for a photo"** → `split({ …, photoPlaceholder: true })` or `image({ photoPlaceholder: true, text })`. The slide gets a real picture placeholder: the presenter clicks its icon or drags a photo onto it, and PowerPoint fills and crops the area.

## What the file carries

`deck.save()` writes the slides, then finishes the file so it stays on brand after hand-editing:

- **GW layouts** in PowerPoint's New Slide menu: GW Cover, GW Section, GW Title and Content, GW Title Only, GW Big Idea, GW Big Idea Dark, GW Blank, GW Blank Dark, GW Photo Split, GW Photo. Titles and bodies are real placeholders with brand font, size, color, alignment, and prompt text, so a slide added by hand and typed into comes out styled, and titles appear in the outline and to screen readers. PptxGenJS's stray "DEFAULT" layout is removed.
- **Theme fonts:** Gazzetta (headings) and Avenir Next (body), or the substitutes — any new text box gets the body font.
- **Theme colors:** a GW palette (text `#1E1E1E`, GW Blue, Buff 20%, accents GW Blue / GW Buff / Potomac / Navy Yard / Potomac 50% / Buff 50%), so the color picker, new shapes, tables, and charts default to brand colors.
- **Dark layouts** remap theme text to white, so text added on a dark slide is readable.
- **Real fallback images** for the SVG chevrons (PptxGenJS alone writes a broken-image placeholder, which non-SVG viewers would show).

## Custom slides

For a slide no builder covers, start from a GW layout and use the deck's constants:

```js
const sl = deck.slide('GW Title Only');                  // any layout name above
sl.addText('Results', { placeholder: 'title' });       // inherits the layout's title style
const { colors: C, fonts: F, size: S, d } = deck;       // brand hex (no #), font names, 10 × 5.625 in, display sizing
sl.addImage({ path: 'figure.png', x: S.margin, y: 1.7, w: 5.2, h: 3.4, altText: 'What the figure shows' });
sl.addText('One-line takeaway.', { x: 6.1, y: 2.2, w: 3.3, h: 1.2, fontFace: F.body, fontSize: 16, color: C.body });
sl.addText('42', { x: 6.1, y: 3.4, w: 3.3, h: 1.2, fontFace: F.display, bold: F.displayBold, fontSize: d(72), color: C.gwBlue });
```

- **Display text in custom slides:** `fontFace: F.display`, `bold: F.displayBold`, and `fontSize: d(<brand pt>)` — `d()` scales for substitute mode (×0.8), as the builders do.
- **A layout you'll reuse** (so hand-added slides get it too): `deck.defineLayout(name, spec)` before `deck.slide(name)`. The spec has the same shape as the built-ins in `gw_pptx.js` (`layoutSpecs`): `{ bg, dark?, rule?, panel?, ph: [{ type: 'title' | 'body' | 'image', name, x, y, w, h, prompt, …text options }] }`. Don't call PptxGenJS's `defineSlideMaster` directly: the file-finishing steps in `save()` only know layouts defined through the helper.

PptxGenJS rules — never break these:

- Colors are 6-digit hex **without `#`** (`'033C5A'`); a `#` fails silently. No 8-digit hex — use `transparency: 0–100`.
- Pass a **fresh options object to every call**; PptxGenJS mutates the objects it is given.
- **Work in inches** from the design intent. Never convert HTML pixel positions: PowerPoint line heights differ from browsers, so converted boxes drift and overlap.
- Write curly quotes and dashes as escapes in JS strings (`'’'`, `'—'`) to avoid encoding and quoting mistakes.
- Add patterns and logos **before** the text on a slide: later objects sit on top.

## Type scale and fonts

Points, brand mode. The helper multiplies display sizes by 0.8 and sets them bold in substitute mode.

| Element | Font role | pt | Notes |
|---|---|---|---|
| Cover title | Display | 60 | White on Navy Yard; one italic word is a nice touch |
| Slide title | Display | 36 | GW Blue, left-aligned |
| Section divider title | Display italic | 48 | White on GW Blue, centered |
| Big idea / closing line | Display | 44–46 | Centered; max 15 words |
| Big stat | Display | 96 | GW Blue or Potomac |
| Stat label | Body bold, caps | 14 | GW Blue |
| Cover subtitle | Accent italic | 19 | Buff 80% |
| Gloss | Accent italic | 18 | GW Blue (light) or GW Buff (dark) |
| Body / tile text | Body | 15–16 | `#1E1E1E`, line spacing 1.3–1.35 |
| Eyebrow / tile label | Body bold, caps | 12–13 | GW Buff on dark; GW Blue on Buff 20%; Potomac on white |
| Byline | Body | 15 | White on dark |
| Caption / source | Body | 10–11 | `#666666` |

| Role | Brand `fontFace` | Substitute `fontFace` |
|---|---|---|
| Display | `Gazzetta` — never `bold: true` (Regular already reads bold) | `Barlow Condensed` with `bold: true` |
| Display italic | `Gazzetta Slanted` — a separate family; never add `italic: true` | `Barlow Condensed` with `italic: true` |
| Body | `Avenir Next` | `Nunito Sans` |
| Accent | `Source Serif Pro` (the name Adobe Fonts registers) | `Source Serif 4` |

## Sizes in inches

The 16:9 slide is 10 × 5.625 in; one pixel of the 1280×720 HTML slide is 1/128 in (0.0078 in), so px values in the other references convert directly.

| Element | HTML | PowerPoint |
|---|---|---|
| Edge margin | 72–80 px | 0.6 in |
| Logo lockup width / edge offset | 220 / 56 px | 1.72 / 0.44 in |
| Title rule | 80 × 3 px | 0.62 × 0.03 in |
| Big Idea rule | 100 × 3 px | 0.78 × 0.025 in |
| Chevron ribbon tile | 156 × 12 units | 1.667 × 0.128 in (6 across) |

## Check before delivering

Text fit isn't measured when the file is written, so always render and look:

```bash
python3 src/render_pptx.py talk.pptx
```

It converts with LibreOffice if installed, otherwise with Microsoft PowerPoint on macOS (exactly what the presenter sees, brand fonts included), and prints one PNG per slide plus a contact sheet. Look for text running out of its box, overlaps, wrapping, and orphaned words; shorten text or adjust sizes and rebuild.

Renders don't show empty placeholders (PowerPoint never prints prompt text), so a photo-placeholder slide renders as its background — that's expected.

## Gotchas

- **Long titles overflow silently.** PowerPoint only shrinks text to fit while someone edits it. Keep cover titles to two short lines and slide titles to one; render to check.
- **The star pattern is a picture**, rendered with the slide color baked in (PowerPoint can't import the SVG `<pattern>` or the CSS fade). Use it only on the slide color it was made for — the builders handle this.
- **New Slide copies the layout's placeholders exactly.** Don't edit placeholder positions in custom slides; add separate text boxes instead.
- **Chrome hangs** occasionally in headless mode; the helper uses a throwaway profile per render and retries.
