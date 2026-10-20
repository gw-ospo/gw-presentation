---
name: gwu-presentation
description: >
  Create GWU-branded HTML slide presentations following the updated George Washington University brand guidelines and Presentation Zen principles. Use this skill whenever the user asks for GWU slides, a GW-branded presentation, a slide deck for GWU, or any presentation for George Washington University contexts — including research talks, course lectures, conference presentations, or department meetings. Also trigger when the user asks to improve or redesign existing slides using the GWU theme. This skill governs all visual and structural decisions: color palette, typography, layout patterns, graphic elements, and narrative pacing. Do not skip this skill if the user mentions "slides" or "presentation" in a GWU work context — always read and apply it.
---

# GWU Presentation Skill

Produce HTML slide presentations that are simultaneously brand-coherent and audience-first. The goal is not compliance — it's impact. These two things, when done right, are the same thing.

---

## Philosophy: Presentation Zen First

These principles shape every decision, including which CSS to write and which layouts to choose. Read them before touching a line of code.

**One idea per slide.** A slide with three bullet points has three competing ideas. Break them apart. If you catch yourself writing "and also…" mid-bullet, that's the split point.

**Signal over noise.** Every element must earn its place. White space is not absence — it gives ideas room to land. A slide that feels "empty" is often doing exactly the right amount of work.

**Amplify, don't duplicate.** Slides are not speaker notes projected on a screen. If the slide says what the presenter is saying, one of them is redundant. Design each slide to amplify the spoken message — with a powerful image, a key number, or a single concept crystallized into a phrase.

**Images over bullets.** A full-bleed photograph paired with five words often communicates more — and is remembered longer — than six bullet points. When you have the choice, lean toward the image.

**Restraint in design.** The GWU brand is built around discipline. Choose a visual motif (a single graphic element, a consistent color pairing) and carry it through the entire deck. Don't use every color and every pattern on every slide — that's noise, not richness.

**Contrast creates hierarchy.** Audiences should never need to search for the main point. Use size, weight, and color contrast to make the most important thing obviously the most important thing.

---

## Brand Identity

### Color Palette

The refreshed GWU palette. Use exact hex values.

**Core colors** — these should dominate (80%+ of visual weight across the deck):

```css
--gw-blue:    #033C5A;   /* Primary — headlines, dark backgrounds, authoritative contexts */
--gw-buff:    #D6BF91;   /* GWU's signature warm gold — borders, accent rules, warmth */
--potomac:    #0075C8;   /* Bright blue — links, data callouts, energetic accents */
--navy-yard:  #00223E;   /* Deepest navy — premium dark slides, dramatic effect */
--white:      #FFFFFF;   /* Slide backgrounds, reversed text on dark slides */
```

**Tints** — when you need softer versions, use only these approved tints (never mix your own):

```css
--gw-buff-80: #DAC8A3;
--gw-buff-50: #E8DDC6;
--gw-buff-20: #F6F1E8;   /* Warm off-white — excellent subtle content area fill */
--potomac-80: #3391D3;
--potomac-50: #7FBAE3;
--potomac-20: #CCE3F4;   /* Pale blue — gentle backgrounds for data-heavy slides */
```

**Secondary accents** — use at most one per deck, and sparingly:

```css
--row-house:  #EF4343;   /* Red — emphasis, warnings, urgency; not for decoration */
--blossom:    #D1A0B9;   /* Dusty rose — humanistic, arts, or community contexts */
--parchment:  #FFEFAE;   /* Warm yellow — callout highlights, key findings */
--blue-fog:   #52C9E8;   /* Bright cyan — innovation, technology, energy */
--patina:     #ADCAB8;   /* Sage — research, sustainability, calm authority */
```

**Color strategy**: Lead with GW Blue + White. Add GW Buff for warmth and heritage. Bring in Potomac for digital energy or interactivity. For formal academic talks, use a higher ratio of white — it reads as elevated. Reach for secondary accents only when the content genuinely calls for them.

### Accessible Color Pairings (WCAG AA)

Only use these combinations — don't guess at contrast:

| Background | Text that works |
|---|---|
| GW Blue `#033C5A` | White, GW Buff, Potomac 50%, Potomac 20% |
| Navy Yard `#00223E` | White, GW Buff, Potomac 80%, Potomac 50% |
| White `#FFFFFF` | GW Blue, Navy Yard, Potomac |
| GW Buff `#D6BF91` | GW Blue, Navy Yard (never light on buff) |
| Potomac `#0075C8` | White only |

---

### Typography

GWU uses three brand fonts available as Adobe Fonts through GW's Creative Cloud institutional subscription. Faculty and staff can install them by following the links at [communications.gwu.edu/brand-guidelines/typography](https://communications.gwu.edu/brand-guidelines/typography).

| Role | GWU Brand Font (Adobe Fonts) | Google Fonts Substitute (HTML fallback) | When to Use |
|---|---|---|---|
| Display | **Gazzetta** | Playfair Display | Cover titles, major impact text, large-format display |
| Body / UI | **Proxima Nova** | Nunito Sans | Body copy, captions, eyebrows, step labels, UI text |
| Editorial | **Source Serif Pro** | Source Serif 4 | Slide titles, pull quotes, subtitles, section dividers |

**For HTML presentations:** use the Google Fonts substitutes (they load from CDN with no installation required).

**For PowerPoint (.pptx):** use the actual brand font names if installed — see the PowerPoint Output section below. If not installed, fall back to Georgia (for Gazzetta / Source Serif Pro) and Trebuchet MS (for Proxima Nova).

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Nunito+Sans:ital,opsz,wght@0,6..12,300;0,6..12,400;0,6..12,600;0,6..12,700;1,6..12,400&family=Source+Serif+4:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet">
```

**Type scale for 1280×720px HTML slides** (use Google Fonts names here):

| Element | Font | Size | Weight | Notes |
|---|---|---|---|---|
| Cover display title | Playfair Display | 72–80px | 700 | Generous leading, 1.1; often all-caps in the text itself |
| Slide title | Playfair Display | 48–54px | 700 | Left-aligned; skip decorative underlines |
| Section divider title | Playfair Display | 52px | 400 italic | Centered; elegant and unhurried |
| Subheading / eyebrow | Nunito Sans | 13–14px | 700 | Spaced caps; GW Buff on dark, Potomac on light |
| Body text | Nunito Sans | 20–24px | 400 | Line height 1.55; generous paragraph spacing |
| Pull quote | Source Serif 4 | 40–48px | 400 italic | This IS the message — let it breathe |
| Caption / label | Nunito Sans | 14–16px | 300 | Muted; never competes with body |
| Big stat / number | Playfair Display | 96–120px | 700–900 | The number IS the message |
| Byline / attribution | Nunito Sans | 14–16px | 400 | Warm buff on dark slides |

---

## CSS Foundation

Every HTML presentation starts from this base. Copy it whole, then extend.

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Nunito+Sans:ital,opsz,wght@0,6..12,300;0,6..12,400;0,6..12,600;0,6..12,700;1,6..12,400&family=Source+Serif+4:ital,wght@0,400;0,600;1,400;1,600&display=swap');

:root {
  /* Core brand colors */
  --gw-blue:    #033C5A;
  --gw-buff:    #D6BF91;
  --potomac:    #0075C8;
  --navy-yard:  #00223E;
  --white:      #FFFFFF;

  /* Approved tints */
  --gw-buff-20: #F6F1E8;
  --gw-buff-50: #E8DDC6;
  --gw-buff-80: #DAC8A3;
  --potomac-20: #CCE3F4;
  --potomac-50: #7FBAE3;
  --potomac-80: #3391D3;

  /* Secondary accents — use sparingly */
  --row-house:  #EF4343;
  --parchment:  #FFEFAE;
  --blue-fog:   #52C9E8;
  --patina:     #ADCAB8;
  --blossom:    #D1A0B9;

  /* Type stacks */
  --font-headline: 'Playfair Display', Georgia, serif;
  --font-body:     'Nunito Sans', 'Helvetica Neue', Arial, sans-serif;
  --font-accent:   'Source Serif 4', Georgia, serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #ddd8d0;  /* Warm neutral canvas that echoes GW Buff family */
  font-family: var(--font-body);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 48px;
}

/* Slide shell */
.slide {
  width: 1280px;
  height: 720px;
  position: relative;
  overflow: hidden;
  background: var(--white);
  box-shadow: 0 8px 48px rgba(3, 60, 90, 0.15);
  display: flex;
  flex-direction: column;
}

/* Typography helpers */
.t-headline { font-family: var(--font-headline); color: var(--gw-blue); line-height: 1.15; }
.t-body     { font-family: var(--font-body);     color: #1e1e1e;        line-height: 1.55; }
.t-accent   { font-family: var(--font-accent);   font-style: italic;    color: var(--gw-blue); }

/* Reversed type helpers (on dark backgrounds) */
.t-reversed           { color: var(--white); }
.t-reversed-secondary { color: var(--gw-buff); }
```

---

## Layout Patterns

Choose the layout based on *what the slide needs to make the audience feel or understand* — not based on how much content you have. If the content doesn't fit a single pattern cleanly, that's usually a sign the slide is doing too much.

---

### A. Cover Slide

Sets the entire deck's mood. Be deliberate — don't default to the first thing that fits.

**Variant 1 — Dark authority** (conferences, formal talks, large venues):
- Full background: `--gw-blue` or `--navy-yard`
- Tone-on-tone chevron texture in background (see Graphic Elements)
- Title: Playfair Display 72–80px, white
- Subtitle or unit name: Nunito Sans 22px, `--gw-buff`
- Bottom edge: 6px horizontal buff rule spanning the full slide width

**Variant 2 — Light and open** (workshops, courses, inviting contexts):
- White background
- Left vertical band (240px wide): `--gw-blue`, with presenter name/unit in white
- Right area: title in GW Blue, subtitle in Potomac — ample top margin (keep title vertically centered in the right two-thirds)

**Variant 3 — Full-bleed image** (when a visual can capture the theme):
- `background-image` covers the full 1280×720 canvas; `background-size: cover; background-position: center`
- Dark overlay: `rgba(3, 60, 90, 0.72)` — enough to ensure white text legibility
- Title: white, Playfair Display, centered or lower-left, max 12 words
- No subtitle needed — let the image carry the atmosphere

---

### B. Big Idea Slide

Reserved for the single most important point in the deck. Use once, maybe twice.

- White background — the emptiness is the design
- Single phrase or sentence: Playfair Display 56–72px, `--gw-blue`, centered, max 15 words
- GW Buff horizontal rule: 3px thick, 100px wide, centered, above or below the text
- Resist every urge to add bullets, notes, or supporting text. The slide should feel like a pause.

---

### C. Full-Bleed Image

Let the image carry the emotional weight. Use for transitions, scene-setting, or moments when a feeling matters more than information.

```html
<div class="slide slide-image" style="background-image: url('IMAGE_URL'); background-size: cover; background-position: center;">
  <div class="image-overlay">
    <p class="t-headline t-reversed" style="font-size: 52px; font-weight: 700;">Your key phrase here.</p>
  </div>
</div>
```

```css
.slide-image .image-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 48px 72px;
  background: linear-gradient(to top, rgba(3,60,90,0.88) 0%, rgba(3,60,90,0.3) 60%, transparent 100%);
}
```

Maximum 12 words of text. The image already said the rest.

---

### D. Split Layout

One side: evidence (image, chart, big number, icon cluster). Other side: the story behind it. The two sides should each be able to stand alone — if the text only makes sense by pointing at the visual, redesign the split.

```css
.slide-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
}
.slide-split .visual-side {
  background: var(--gw-blue);         /* Or use an image */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px;
}
.slide-split .text-side {
  padding: 64px 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}
```

Reverse the column order occasionally (`grid-template-columns: 1fr 1fr` with columns swapped in the DOM) so the deck doesn't feel monotonous.

---

### E. Stat Callout

When a number is the entire point, give it the space it deserves.

- 1–3 stats maximum on one slide; if you have 4, make two slides
- Stat value: Playfair Display 96–120px, `--gw-blue` or `--potomac`; use the lower end of the range (96px) for numbers with 5+ characters to prevent overflow in 3-stat layouts
- Stat label: Nunito Sans 18px, `--gw-buff-80` or a blue tint — deliberately quieter than the number
- Optional short gloss: Source Serif 4 italic, 18–22px, below the stat, max 12 words
- Layout: flex row, centered, generous gap between stats; add a thin `--gw-buff-50` vertical rule (2px × 140px) between stats as a separator

```css
.slide-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 96px;
  height: 100%;
  padding: 64px;
}
.stat-block { text-align: center; }
.stat-number {
  font-family: var(--font-headline);
  font-size: 108px;
  font-weight: 700;
  color: var(--gw-blue);
  line-height: 1;
}
.stat-label {
  font-family: var(--font-body);
  font-size: 18px;
  color: var(--gw-buff-80);
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

---

### F. Tiled Content

For 3–4 parallel concepts that deserve equal visual weight — guiding principles, research phases, decision options. This is not a bullet list in a grid. Each tile should be a complete thought.

```css
.slide-tiles {
  padding: 56px 72px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);   /* Or repeat(2, 1fr) for 2 tiles */
  gap: 28px;
  align-content: center;
  height: 100%;
}
.tile {
  padding: 32px 28px;
  background: var(--gw-buff-20);
  border-top: 5px solid var(--gw-buff);
}
.tile-label {
  font-family: var(--font-body);
  font-size: 18px;
  font-weight: 700;
  color: var(--potomac);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 14px;
}
.tile-body {
  font-family: var(--font-body);
  font-size: 20px;
  color: #1e1e1e;
  line-height: 1.5;
}
```

---

### G. Section Divider

A clean mental reset between major sections. Gives the audience permission to let go of the previous section and lean into what's next.

- Background: `--gw-blue` or `--navy-yard`
- Section number or label: Nunito Sans 14px, `--gw-buff`, uppercase, letter-spaced, centered
- Section title: Playfair Display 52px, white, italic preferred, centered
- GW Buff rules: two 120px-wide horizontal rules, each 2px, flanking the text block
- Optional: Gate Crossbar CSS motif between the number and title (one per slide)

```css
.slide-divider {
  background: var(--gw-blue);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 100%;
  text-align: center;
}
.divider-rule {
  width: 120px;
  height: 2px;
  background: var(--gw-buff);
}
.divider-label {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: var(--gw-buff);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.divider-title {
  font-family: var(--font-headline);
  font-size: 52px;
  font-weight: 400;
  font-style: italic;
  color: var(--white);
  max-width: 800px;
}
```

---

### H. Pull Quote / Testimonial

A human voice deserves generous space. Don't squeeze a quote into a corner.

- Background: `--gw-buff-20` (warm, personal) or `--gw-blue` (formal, authoritative)
- Decorative opening mark: Playfair Display 140px, `--gw-buff`, absolutely positioned top-left, behind the quote text
- Quote text: Source Serif 4 italic, 32–40px, centered or left-aligned with left margin
- Attribution: Nunito Sans 15px, lighter weight, indented under the quote, preceded by an em dash

---

### I. Standard Content with Title

For content that genuinely needs prose or a short list. Use sparingly — only when a visual won't serve.

- Slide title: Playfair Display 48px, `--gw-blue`, left-aligned, top of content area
- GW Buff rule below title: 3px, 80px wide (not full-width — keeps it as an accent, not a divider)
- Body: Nunito Sans 22–24px, natural paragraph spacing
- If a list is truly necessary: 4 items maximum, each max 12 words, no nested bullets ever

```css
.slide-content {
  padding: 56px 80px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.slide-title-block {
  margin-bottom: 36px;
}
.slide-title {
  font-family: var(--font-headline);
  font-size: 48px;
  font-weight: 700;
  color: var(--gw-blue);
}
.title-rule {
  width: 80px;
  height: 3px;
  background: var(--gw-buff);
  margin-top: 14px;
}
```

---

## Graphic Elements (CSS-Simulated)

The official GWU brand packs include SVG/EPS files for chevrons, the Gate Crossbar, and the star motifs. Simulate these in CSS — they provide visual richness and GWU identity without external file dependencies.

**Rule before adding any graphic element:** ask which one serves this specific slide's purpose. Use at most one pattern element per slide. Do not mix elements within the same deck unless there is a strong reason tied to different slide types (e.g., chevron ribbons on content slides, Gate Crossbar on section dividers).

---

### Chevron Ribbon

Chevrons signal forward motion and progress. As a ribbon, they create horizontal rhythm — use beneath a slide title on content slides or above the footer area of the closing slide.

```css
.chevron-ribbon {
  height: 7px;
  background: repeating-linear-gradient(
    112deg,
    var(--gw-blue)   0px,  var(--gw-blue)   14px,
    var(--gw-buff)   14px, var(--gw-buff)   28px
  );
  width: 100%;
  flex-shrink: 0;
}
```

For a subtler tone-on-tone variant (cover slides, dark backgrounds):
```css
.chevron-ribbon-subtle {
  height: 7px;
  background: repeating-linear-gradient(
    112deg,
    rgba(214,191,145,0.35)   0px,  rgba(214,191,145,0.35)   14px,
    rgba(214,191,145,0.12)  14px, rgba(214,191,145,0.12)  28px
  );
  width: 100%;
}
```

---

### Gate Crossbar

Derived from the interlocking motif at the top of Professor's Gate on GWU's Foggy Bottom campus. Use as a single-line divider — between a section number and section title on a divider slide, or to separate a header from body text. One per slide, set in a single color only.

```css
.gate-crossbar {
  height: 2px;
  background: repeating-linear-gradient(
    90deg,
    var(--gw-buff) 0px, var(--gw-buff) 9px,
    transparent    9px, transparent   15px
  );
  width: 200px;   /* Constrain width — this should feel like a detail, not a full rule */
  margin: 0 auto;
}
```

On dark backgrounds, use `var(--gw-buff)`. On white backgrounds, use `var(--gw-blue)` or `var(--gw-buff)`.

---

### Five-Pointed Star Accent

Reflects the stars on the DC flag. Use as a single small accent — near a pull quote, alongside a key stat, or on a closing slide. Always oriented with one tip pointing directly up. Never tile or repeat.

```css
.star-accent {
  display: inline-block;
  width: 28px;
  height: 28px;
  background: var(--gw-buff);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}
```

---

## Slide Construction Checklist

Work through these mentally for every slide before writing its HTML.

**Purpose first:**
- What is the one thing this slide must make the audience understand or feel?
- Is that best served by text, image, number, or a combination?

**Layout selection:**
- Does the layout serve the purpose, or is it just the first one that fit?
- Is there a more powerful option (e.g., full-bleed image instead of text + image)?

**Color discipline:**
- Am I using core palette colors? (GW Blue, White, Buff, Potomac)
- If I'm using a secondary accent, is it the same one used elsewhere in this deck?
- Do all text/background combinations follow the WCAG AA pairings above?

**Content restraint:**
- Is there anything on this slide I could remove without losing the point?
- If it's a list, does it have ≤4 items and ≤12 words each?

**Graphic elements:**
- Am I using at most one graphic element on this slide?
- Am I using the same element style I've used elsewhere in the deck?

**Deck level:**
- No "Questions?" or "Q&A" slide at the end — close with a statement, image, or call to action
- Deck has a consistent graphic element style throughout (or none, which is also valid)
- Dark cover + light content + dark or image close ("sandwich") creates natural pacing

---

## Output Format

### HTML (default)

Produce a single, self-contained HTML file:
- All CSS in a `<style>` block in `<head>`; no external CSS files
- Google Fonts via `<link rel="stylesheet">` in `<head>`
- Font Awesome 6 via CDN if icons are used: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
- Placeholder images: `https://picsum.photos/seed/[descriptive-keyword]/[width]/[height]` — use a keyword that matches the slide content
- Each slide: `<div class="slide">…</div>` at 1280×720px, positioned absolutely inside a scaled `#stage` div
- Presentation mode: include a `<script>` block that scales the stage to fill the viewport, supports keyboard navigation (ArrowRight/ArrowLeft), and shows a floating nav overlay
- Slide numbers: omit unless the user specifically requests them
- Presenter notes: if requested, place in a `<details>` block below each slide div, hidden by default from print

---

## PowerPoint (.pptx) Output

When the user asks for a `.pptx` file, generate it with **PptxGenJS** (Node.js). The reference implementation for all layout patterns is the HTML version above — use it as the design source of truth and reproduce it faithfully in PowerPoint.

### Step 0 — Font check (do this first)

The GWU brand fonts are available as **Adobe Fonts** through GW's Creative Cloud institutional subscription. Before generating the file, tell the user:

> "To display this presentation with the official GWU brand fonts, you'll need **Gazzetta**, **Source Serif Pro**, and **Proxima Nova** installed on your computer via Adobe Fonts. Installation links are at:
> **https://communications.gwu.edu/brand-guidelines/typography**
> If you don't have them installed yet, the file will still open — PowerPoint will substitute fonts — but the brand look won't be correct until you install them."

### Brand fonts for PptxGenJS

Use these exact `fontFace` strings. PowerPoint matches them by name to locally installed Adobe Fonts.

| Role | fontFace string | Notes |
|---|---|---|
| Display / cover title | `"Gazzetta"` | Bold; use all-caps in the text string itself |
| Slide titles, subtitles, pull quotes | `"Source Serif Pro"` | Bold for titles; italic for quotes and dividers |
| Body, eyebrows, labels, captions | `"Proxima Nova"` | The workhorse — everything that isn't a headline |

**Fallbacks** (when fonts not installed or for quick drafts):

| Brand font | Fallback fontFace |
|---|---|
| Gazzetta | `"Georgia"` |
| Source Serif Pro | `"Georgia"` |
| Proxima Nova | `"Trebuchet MS"` |

### Type scale for PPTX (10" × 5.625", LAYOUT_16x9)

Sizes in points. Colors as 6-char hex — **never include `#`**.

| Element | fontFace | pt | bold | italic | color | notes |
|---|---|---|---|---|---|---|
| Cover display title | `Gazzetta` | 60–80 | true | false/true | `FFFFFF` | All-caps in text; try italic for the key word |
| Slide title | `Source Serif Pro` | 32–36 | true | false | `033C5A` | Left-aligned |
| Section divider title | `Source Serif Pro` | 44–52 | false | true | `FFFFFF` | Centered; let it breathe |
| Big idea / pull quote | `Source Serif Pro` | 40–48 | false | true | `033C5A` | Centered; this IS the message |
| Cover subtitle | `Source Serif Pro` | 18–22 | false | true | `DAC8A3` | GW Buff-80 on dark background |
| Body paragraph | `Proxima Nova` | 14–16 | false | false | `1E1E1E` | lineSpacingMultiple: 1.5 |
| Eyebrow / step label | `Proxima Nova` | 10–12 | true | false | `D6BF91` | Text in ALL CAPS; charSpacing: 2 |
| Feature / section label | `Proxima Nova` | 13–14 | true | false | `0075C8` | Potomac blue |
| Card text / caption | `Proxima Nova` | 11–13 | false | false | `666666` | Never competes with body |
| Byline / footer | `Proxima Nova` | 16–20 | false | false | `DAC8A3` | On dark slides |

### PptxGenJS rules — never break these

```js
// ✅ CORRECT — no # on colors
fill: { color: "033C5A" }
color: "FFFFFF"

// ❌ WRONG — # prefix breaks color silently
fill: { color: "#033C5A" }

// ✅ CORRECT — transparency for semi-transparent fills
fill: { color: "FFFFFF", transparency: 85 }

// ❌ WRONG — 8-char hex is not supported
fill: { color: "FFFFFF80" }

// ✅ CORRECT — fresh object for every shape call
sl.addShape(pptx.ShapeType.rect, { x:0, y:0, w:SW, h:SH, fill:{color:"00223E"}, line:{type:"none"} });

// ❌ WRONG — reusing option objects (PptxGenJS mutates them)
const opts = { fill:{color:"00223E"} };
sl.addShape(pptx.ShapeType.rect, opts);  // first call OK
sl.addShape(pptx.ShapeType.rect, opts);  // second call may be corrupted
```

### Layout in inches (work in these, not px)

```js
pptx.layout = 'LAYOUT_16x9';  // 10" × 5.625"
const SW = 10, SH = 5.625;    // always define these constants

// Standard margins
const margin = 0.5;            // 0.5" from edges
const col2start = 3.75;        // typical left-col end (split layouts)
```

Work in inches directly. Do not try to convert from HTML pixel coordinates — PPTX and HTML render text at different line heights for the same nominal point size, so converted coordinates drift. Instead, derive positions from the design intent (e.g., "title in top third, body in middle, footer at bottom").

### SVG brand assets

The GWU brand SVG files (Chevron Ribbon, Chevron Chip, Battle Flag star pattern) can be embedded in PPTX slides directly:

```js
sl.addImage({
  path: "/absolute/path/to/GW-brand/Chevrons/SVG/Ribbon/GWBlue.svg",
  x: 0, y: SH - 0.12, w: SW, h: 0.12,
});
```

If the absolute path to the asset folder is not available, approximate the chevron ribbon with alternating colored rectangles (0.22" wide segments, alternating GW Blue and GW Buff).

### Workflow checklist for .pptx generation

1. **Font check** — tell the user to install fonts from the typography page if not done
2. **Design from the HTML spec** — use the layout patterns above as your design source; reproduce each slide faithfully
3. **Work in inches** — define `SW = 10`, `SH = 5.625`; position everything in inches
4. **One slide at a time** — complete and verify each slide before moving to the next
5. **Use real SVGs if available** — check if the GW-brand asset folder path is accessible; prefer SVG assets over CSS approximations
6. **Never reuse option objects** — create a fresh object literal for every `addShape` / `addText` call
7. **Save to the workspace folder** — write the output file to the user's selected folder so they can open it directly
