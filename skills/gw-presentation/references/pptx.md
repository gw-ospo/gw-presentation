# PowerPoint (.pptx) Output

When the user asks for a `.pptx` file, generate it with **PptxGenJS** (Node.js). The HTML layout patterns (`references/layouts.md`) are the design source of truth — reproduce them faithfully in PowerPoint. Do not use GW's official PowerPoint templates; this skill has its own design.

`src/build-pptx.js` is a complete working example (an 8-slide deck) to adapt.

## Contents

- [Step 0 — Font check](#step-0--font-check)
- [Fonts](#fonts)
- [Type scale](#type-scale-10--5625-layout_16x9)
- [PptxGenJS rules](#pptxgenjs-rules--never-break-these)
- [Layout in inches](#layout-in-inches)
- [Brand assets](#brand-assets)
- [Workflow](#workflow)

## Step 0 — Font check

PowerPoint embeds font *names*, not fonts, so tell the user before generating:

> "To display this presentation in the official GW brand fonts, you need **Gazzetta**, **Avenir Next**, and **Source Serif** installed via Adobe Fonts (GW Creative Cloud subscription). Installation links: **https://communications.gwu.edu/brand-guidelines/typography**. Without them the file still opens, but PowerPoint substitutes fonts and the brand look won't be right."

If the user can't install the brand fonts, offer the free substitutes (Barlow Condensed, Nunito Sans, Source Serif 4 from Google Fonts) — they must be installed locally too.

## Fonts

Use these exact `fontFace` strings — they are the family names macOS registers (see `references/brand.md` §3).

| Role | Brand `fontFace` | Free substitute `fontFace` | Last resort |
|---|---|---|---|
| Display: cover, slide titles, dividers, big numbers | `"Gazzetta"` | `"Barlow Condensed"` | `"Georgia"` |
| Display italic | `"Gazzetta Slanted"` | `"Barlow Condensed"` + `italic: true` | `"Georgia"` + `italic: true` |
| Body: paragraphs, eyebrows, labels, captions | `"Avenir Next"` | `"Nunito Sans"` | `"Trebuchet MS"` |
| Accent: pull quotes, glosses, short callouts | `"Source Serif Pro"` | `"Source Serif 4"` | `"Georgia"` |

Gazzetta's italic is a separate family: use `fontFace: "Gazzetta Slanted"`, not `"Gazzetta"` with `italic: true` (which would give a synthesized slant).

## Type scale (10" × 5.625", LAYOUT_16x9)

Sizes in points. Colors as 6-char hex — **never include `#`**.

| Element | Role | pt | bold | italic | color | Notes |
|---|---|---|---|---|---|---|
| Cover display title | Display | 52–72 | true | false | `FFFFFF` | Try italic (Gazzetta Slanted) for one key word |
| Slide title | Display | 32–36 | true | false | `033C5A` | Left-aligned |
| Section divider title | Display italic | 44–52 | false | true | `FFFFFF` | Centered |
| Big stat | Display | 72–96 | true | false | `033C5A` | |
| Big idea / pull quote | Accent | 36–44 | false | true | `033C5A` | Centered |
| Cover subtitle | Accent | 18–22 | false | true | `DAC8A3` | Buff 80% on dark only |
| Body paragraph | Body | 14–16 | false | false | `1E1E1E` | `lineSpacingMultiple: 1.5` |
| Eyebrow / step label | Body | 10–12 | true | false | `D6BF91` on dark, `0075C8` on light | ALL CAPS; `charSpacing: 2` |
| Feature / section label | Body | 13–14 | true | false | `0075C8` | |
| Caption | Body | 11–13 | false | false | `666666` | Never competes with body |
| Byline / footer | Body | 16–20 | false | false | `DAC8A3` | Dark slides only |

These sizes avoided overlap in the sample deck; condensed display faces may allow slightly larger titles.

## PptxGenJS rules — never break these

```js
// ✅ no # on colors
fill: { color: "033C5A" }
// ❌ # prefix breaks color silently
fill: { color: "#033C5A" }

// ✅ transparency for semi-transparent fills
fill: { color: "FFFFFF", transparency: 85 }
// ❌ 8-char hex is not supported
fill: { color: "FFFFFF80" }

// ✅ fresh object literal for every addShape / addText call
sl.addShape(pptx.ShapeType.rect, { x:0, y:0, w:SW, h:SH, fill:{color:"00223E"}, line:{type:"none"} });
// ❌ reusing option objects — PptxGenJS mutates them
const opts = { fill:{color:"00223E"} };
sl.addShape(pptx.ShapeType.rect, opts);  // OK
sl.addShape(pptx.ShapeType.rect, opts);  // may be corrupted
```

Avoid curly quotes and apostrophes inside single-quoted JS strings — use `’`, `—` escapes.

## Layout in inches

```js
pptx.layout = 'LAYOUT_16x9';  // 10" × 5.625"
const SW = 10, SH = 5.625;    // always define these
const margin = 0.5;           // standard edge margin
```

Work in inches from the design intent ("title in top third, body in middle, footer at bottom"). Never convert HTML pixel coordinates — PowerPoint line heights differ from browsers, so converted positions drift and text boxes overlap. Give text boxes extra height; a title that wraps to two lines needs ~1.0".

## Brand assets

Embed the official SVGs from the skill's `assets/` folder; resolve paths relative to the skill directory:

```js
const path = require('path');
const ASSETS = path.join(__dirname, '..', 'assets');   // when the script lives in src/
sl.addImage({
  path: path.join(ASSETS, 'chevrons', 'ribbon', 'gw-blue.svg'),
  x: 0, y: SH - 0.12, w: SW, h: 0.12,
});
```

Keep the SVG's aspect ratio (ribbon viewBox is 159.28 × 12; tile several copies side by side for a full-width ribbon). Logos: the GW Engineering lockup PNG from `assets/logos/seas/`, on the first and last slides only, with the clear-space and minimum-size rules in `references/brand.md` §5.

## Workflow

1. **Font check** — tell the user about the brand fonts (Step 0).
2. **Design from the HTML patterns** — pick layouts from `references/layouts.md`.
3. **Work in inches** — define `SW`, `SH`; position from design intent.
4. **One slide at a time** — build and check each slide before the next.
5. **Use the real SVG assets** from `assets/`, never hand-drawn imitations.
6. **Fresh option objects** for every call.
7. **Render and inspect** — convert to PDF or images (e.g., `soffice --headless --convert-to pdf`) and look for overflow and overlap before delivering.
8. **Save to the user's folder** so they can open it directly.
