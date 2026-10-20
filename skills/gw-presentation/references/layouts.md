# GW Slide Layout Patterns

Nine layout patterns for 1280×720 HTML slides. Choose the layout for *what the slide must make the audience feel or understand*, not for how much content there is. If content doesn't fit one pattern cleanly, the slide is usually doing too much.

All CSS below assumes the variables and helpers in `src/gw-theme.css`. Font roles (Display, Body, Accent) and sizes are defined in `references/brand.md` §3.

## Contents

- [A. Cover](#a-cover)
- [B. Big Idea](#b-big-idea)
- [C. Full-Bleed Image](#c-full-bleed-image)
- [D. Split](#d-split)
- [E. Stat Callout](#e-stat-callout)
- [F. Tiled Content](#f-tiled-content)
- [G. Section Divider](#g-section-divider)
- [H. Pull Quote](#h-pull-quote)
- [I. Standard Content with Title](#i-standard-content-with-title)

---

## A. Cover

Sets the mood for the whole deck. Be deliberate — don't default to the first variant that fits.

**Variant 1 — Dark authority** (conferences, formal talks, large venues)
- Background: `--gw-blue` or `--navy-yard`
- Optional texture: six-pointed star pattern (`assets/battle-flag/`) in a tone-on-tone color, bleeding off one edge
- Title: Display 72–88px, white
- Subtitle or unit name: Body 22px, `--gw-buff`
- Bottom edge: chevron ribbon (`assets/chevrons/ribbon/gw-buff.svg`) or a 6px solid buff rule, full width

**Variant 2 — Light and open** (workshops, courses, inviting contexts)
- White background
- Left vertical band (240px): `--gw-blue`, presenter name/unit in white
- Right area: title in GW Blue, subtitle in Potomac, vertically centered in the right two-thirds

**Variant 3 — Full-bleed image** (when one visual captures the theme)
- Image covers the full canvas: `background-size: cover; background-position: center`
- Overlay: `rgba(3, 60, 90, 0.72)` so white text stays legible
- Title: white Display, centered or lower-left, max 12 words; no subtitle

A logo, if used, sits in a corner with clear space (see `references/brand.md` §5).

---

## B. Big Idea

The single most important point in the deck. Use once, maybe twice.

- White background — the emptiness is the design
- One phrase: Display 56–72px, `--gw-blue`, centered, max 15 words
- GW Buff rule: 3px × 100px, centered, above or below the text
- No bullets, notes, or supporting text. The slide should feel like a pause.

---

## C. Full-Bleed Image

The image carries the emotional weight. Use for transitions, scene-setting, or moments where feeling matters more than information. Max 12 words of text.

```html
<div class="slide slide-image" style="background-image: url('IMAGE_URL'); background-size: cover; background-position: center;">
  <div class="image-overlay">
    <p class="t-headline t-reversed" style="font-size: 56px; font-weight: 600;">Your key phrase here.</p>
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

---

## D. Split

One side holds evidence (image, chart, big number, icon cluster); the other tells the story behind it. Each side should stand alone — if the text only makes sense by pointing at the visual, redesign the split.

```css
.slide-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
}
.slide-split .visual-side {
  background: var(--gw-blue);         /* or an image */
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

Swap the column order in the DOM now and then so the deck doesn't feel monotonous.

---

## E. Stat Callout

When a number is the whole point, give it room.

- 1–3 stats per slide; with 4, make two slides
- Value: Display 96–140px, `--gw-blue` or `--potomac`; for heavy all-caps numerals Oswald 700 is allowed. Use the low end of the range for 5+ characters in 3-stat layouts.
- Label: Body 18px, uppercase, `--gw-blue` on light (`--gw-buff` on dark) — quieter through size and weight, not through low-contrast color
- Optional gloss: Accent italic 18–22px, max 12 words
- Separator between stats: `--gw-buff-50` vertical rule, 2px × 140px
- Anchor option: one chevron chip (`assets/chevrons/chip/`) beside the stat

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
  font-family: var(--font-display);
  font-size: 120px;
  font-weight: 700;
  color: var(--gw-blue);
  line-height: 1;
}
.stat-label {
  font-family: var(--font-body);
  font-size: 18px;
  font-weight: 600;
  color: var(--gw-blue);
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.stat-rule { width: 2px; height: 140px; background: var(--gw-buff-50); }
```

---

## F. Tiled Content

For 3–4 parallel concepts of equal weight — principles, phases, options. Not a bullet list in a grid: each tile is a complete thought.

```css
.slide-tiles {
  padding: 56px 72px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);   /* or repeat(2, 1fr) */
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
  color: #1E1E1E;
  line-height: 1.5;
}
```

---

## G. Section Divider

A clean mental reset between major sections.

- Background: `--gw-blue` or `--navy-yard`
- Section number/label: Body 14px, `--gw-buff`, uppercase, letter-spaced
- Title: Display 56px, white, italic preferred, centered
- One divider element: two 120px × 2px buff rules flanking the text, **or** a gate crossbar between label and title, **or** a chevron ribbon — not several
- Optional: six-pointed star pattern bleeding off one edge (then no other element)

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
.divider-rule { width: 120px; height: 2px; background: var(--gw-buff); }
.divider-label {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: var(--gw-buff);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.divider-title {
  font-family: var(--font-display-italic);
  font-size: 56px;
  font-weight: 400;
  font-style: italic;
  color: var(--white);
  max-width: 800px;
}
```

---

## H. Pull Quote

A human voice deserves generous space. Don't squeeze a quote into a corner.

- Background: `--gw-buff-20` (warm, personal) or `--gw-blue` (formal)
- Decorative opening mark: Accent 140px, `--gw-buff`, absolutely positioned top-left behind the quote
- Quote: Accent italic 36–44px, centered or left-aligned with a left margin
- Attribution: Body 15px, preceded by an em dash
- Optional: one chevron chip or one five-pointed star as anchor

---

## I. Standard Content with Title

For content that genuinely needs prose or a short list. Use sparingly — only when a visual won't serve.

- Title: Display 48–56px, `--gw-blue`, left-aligned
- Buff rule below title: 3px × 80px (an accent, not a divider) — or a chevron ribbon if that is the deck's element
- Body: Body 22–24px
- Lists: max 4 items, max 12 words each, never nested

```css
.slide-content {
  padding: 56px 80px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.slide-title-block { margin-bottom: 36px; }
.slide-title {
  font-family: var(--font-display);
  font-size: 52px;
  font-weight: 600;
  color: var(--gw-blue);
}
.title-rule { width: 80px; height: 3px; background: var(--gw-buff); margin-top: 14px; }
```
