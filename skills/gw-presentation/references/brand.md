# GW Brand Reference

Brand definitions for GW presentations: color, accessible pairings, typography, graphic elements, and logos.
Source: [GW Office of Communications and Marketing — Brand Guidelines](https://communications.gwu.edu/brand-guidelines/). Questions about brand use go to the Office of Communications and Marketing (visualidentity at gwu dot edu).

## Contents

1. [Color palette](#1-color-palette)
2. [Accessible color pairings](#2-accessible-color-pairings-wcag-aa)
3. [Typography](#3-typography)
4. [Graphic elements](#4-graphic-elements)
5. [Logos](#5-logos)

---

## 1. Color palette

Use exact hex values. The CSS custom properties are defined in `src/gw-theme.css`.

**Core colors** — should dominate (80%+ of visual weight across a deck):

| Name | Hex | CSS variable | Role |
|---|---|---|---|
| GW Blue | `#033C5A` | `--gw-blue` | Primary — headlines, dark backgrounds, authoritative contexts |
| GW Buff | `#D6BF91` | `--gw-buff` | Signature warm gold — rules, borders, accents, warmth |
| Potomac | `#0075C8` | `--potomac` | Bright blue — links, data callouts, energetic accents |
| Navy Yard | `#00223E` | `--navy-yard` | Deepest navy — premium dark slides, dramatic effect |
| White | `#FFFFFF` | `--white` | Slide backgrounds, reversed text |

**Approved tints** — never mix your own:

| Name | Hex | CSS variable | Note |
|---|---|---|---|
| GW Buff 80% | `#DAC8A3` | `--gw-buff-80` | |
| GW Buff 50% | `#E8DDC6` | `--gw-buff-50` | |
| GW Buff 20% | `#F6F1E8` | `--gw-buff-20` | Warm off-white; good subtle content-area fill |
| Potomac 80% | `#3391D3` | `--potomac-80` | |
| Potomac 50% | `#7FBAE3` | `--potomac-50` | |
| Potomac 20% | `#CCE3F4` | `--potomac-20` | Pale blue; gentle background for data-heavy slides |

**Secondary accents** — at most one per deck, used sparingly, never dominating:

| Name | Hex | CSS variable | Suggested context |
|---|---|---|---|
| Row House | `#EF4343` | `--row-house` | Emphasis, warnings, urgency; not decoration |
| Blossom | `#D1A0B9` | `--blossom` | Humanistic, arts, community |
| Parchment | `#FFEFAE` | `--parchment` | Callout highlights, key findings |
| Blue Fog | `#52C9E8` | `--blue-fog` | Innovation, technology, energy |
| Patina | `#ADCAB8` | `--patina` | Research, sustainability, calm authority |

**Strategy.** Lead with GW Blue + White. Add GW Buff for warmth and heritage. Bring in Potomac for digital energy. Formal academic talks take a higher ratio of white — it reads as elevated. Stay in the controlled spectrum (core colors) unless the content genuinely calls for an accent.

---

## 2. Accessible color pairings (WCAG AA)

All digital materials must meet WCAG AA. Use only these combinations — don't guess at contrast.
"Large text only" means regular text ≥ 18pt (24px) or bold text ≥ 14pt (~18.7px).

| Background | All text sizes | Large text only |
|---|---|---|
| GW Blue | White, GW Buff (and 80/50/20% tints), Potomac 50%, Potomac 20%, Blossom, Blue Fog, Parchment, Patina | Potomac 80%, Row House |
| Navy Yard | White, GW Buff (and 80/50/20% tints), Potomac 80%, Potomac 50%, Potomac 20%, Blossom, Blue Fog, Parchment, Patina | Potomac, Row House |
| White | GW Blue, Navy Yard, Potomac, Black | Potomac 80%, Row House |
| Potomac | White | GW Buff 20%, Potomac 20%, Parchment |
| GW Buff | GW Blue, Navy Yard, Black | *(none — never light text on buff)* |
| GW Buff 20% (tile and panel fill)\* | GW Blue, Navy Yard, `#1E1E1E`, `#666666` | Potomac (4.3:1) |

\* Not in GW's published matrix; computed for the fill this skill's layouts use (GW Blue 10.4:1, Potomac 4.3:1, `#666666` 5.1:1).

**Icons and other meaningful graphics** need 3:1 against their background (WCAG 1.4.11), so Potomac icons on white or Buff 20% are fine; text next to them still follows the table.

Not in the table means not accessible. In particular, **GW Buff and its tints are never text colors on white** (Buff 80% on white is 1.6:1) — on light slides, use buff only for rules, borders, and fills.

Neutral grays for body and caption text on white: `#1E1E1E` (body) and `#666666` (captions, 5.7:1) both pass.

---

## 3. Typography

GW uses three typefaces. Gazzetta and Avenir Next are primary; Source Serif is secondary. Pairing two tends to feel best; using all three is permissible but should be intentional.

| Role | Brand typeface | Use for | Free substitute |
|---|---|---|---|
| Display | **Gazzetta** — a tall, condensed display face with a large x-height | Headlines, slide titles, section dividers, big numbers | **Barlow Condensed** (primary); **Oswald** only for heavy all-caps display |
| Body | **Avenir Next** | Body copy, subheads, captions, eyebrows, labels, UI text | **Nunito Sans** |
| Accent | **Source Serif** | Used sparingly: headline emphasis, pull quotes, short callouts | **Source Serif 4** |

**Getting the brand fonts.** Faculty and staff activate them through GW's Adobe Creative Cloud subscription (links on the [typography page](https://communications.gwu.edu/brand-guidelines/typography)): [Gazzetta](https://fonts.adobe.com/fonts/gazzetta-variable), [Avenir Next](https://fonts.adobe.com/fonts/avenir-next), [Source Serif](https://fonts.adobe.com/fonts/source-serif). Avenir Next also ships with macOS.

**Rule: brand fonts first, free substitutes second.** Every font stack lists the brand family names first so a machine with the fonts installed renders them; the Google Fonts substitutes load from CDN for everyone else.

### About the substitutes

- **Source Serif 4** is the same Adobe open-source family as Source Serif, not a lookalike.
- **Nunito Sans** is a geometric-humanist sans with similar proportions to Avenir Next, a full variable weight range (200–1000), and italics.
- **Barlow Condensed** is the primary Gazzetta substitute: condensed width, tall structure, 9 weights with true italics, good mixed-case lowercase.
- **Oswald** — only for heavy all-caps display moments (big numerals, short stamps). It is narrower and punchier, but has no italics, stops at weight 700, and its lowercase is weak for long mixed-case headlines. Never use it for italic text or mixed-case titles.

### Installed family names (macOS)

Font family names as registered by macOS on a machine with the Adobe fonts activated (checked October 2026). These are the names CSS stacks and PowerPoint `fontFace` must use:

| Typeface | Upright family | Italic family | Notes |
|---|---|---|---|
| Gazzetta | `Gazzetta` | `Gazzetta Slanted` | Italic is a **separate family**; `font-style: italic` on `Gazzetta` will not find it. Weights Thin–Black; Regular (400) already reads bold |
| Avenir Next | `Avenir Next` | (same family) | macOS system font |
| Source Serif | `Source Serif Pro` | (same family) | Adobe Fonts registers the older "Pro" name |

Safari restricts web pages to system fonts for privacy, so user-activated Adobe fonts (Gazzetta, Source Serif Pro) may render in Chrome but fall through to the substitutes in Safari. Avenir Next is a system font and renders in both.

### Two font modes

The same deck renders in one of two modes, and both must look right:

| | Brand mode | Substitute mode |
|---|---|---|
| When | Gazzetta is available to the browser | Gazzetta missing (other machines, Safari), or `?fonts=substitutes` in the URL |
| Display face | Gazzetta | Barlow Condensed |
| `--display-light / -weight / -strong` | 300 / 400 / 500 | 400 / 600 / 700 |
| `--display-scale` | 1.25 | 1 |
| Headline width | narrower | **~1.6× wider** at the same size |

The deck runtime in `src/deck-template.html` detects Gazzetta and adds `html.gw-substitute-fonts`; `src/gw-theme.css` then swaps the stacks and weight tokens. Always set display weights with the tokens, never raw numbers, and write every display font size as `calc(<size>px * var(--display-scale))`: Gazzetta sets so much narrower and smaller that unscaled brand-mode headlines look undersized next to the substitute rendering. The sizes in the type scale below are the substitute-mode sizes; brand mode draws them 1.25× larger, still narrower than Barlow, so line breaks hold. Size headlines so they fit in substitute mode (the wider one), constrain them with `max-width` plus `text-wrap: balance` so both modes break into the same lines, and check both with `src/render_deck.py`.

### Google Fonts link

```html
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700&family=Oswald:wght@500;600;700&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap" rel="stylesheet">
```

Drop `Oswald` from the link if the deck has no heavy all-caps display moment.

### Type scale — 1280×720 HTML slides

Display sizes below are multiplied by `--display-scale` (see Two font modes).

| Element | Role | Size | Weight | Notes |
|---|---|---|---|---|
| Cover display title | Display | 80–104px | `--display-weight` | Line height 1.05; ≤ 2 lines in substitute mode |
| Slide title | Display | 48–60px | `--display-weight` | Left-aligned; no decorative underlines; 1 line in substitute mode |
| Section divider title | Display italic | 56–64px | `--display-weight` | Centered; elegant and unhurried |
| Big idea phrase | Display | 64–80px | `--display-weight` | Max 15 words |
| Big stat / number | Display (or Oswald, all-caps/numerals) | 96–140px | `--display-strong` | The number IS the message |
| Subheading / eyebrow | Body | 13–14px | 700 | Spaced caps; GW Buff on dark, Potomac on light |
| Body text | Body | 20–24px | 400 | Line height 1.55 |
| Caption / label | Body | 14–16px | 400 | `#666666` on light; never competes with body |
| Byline / attribution | Body | 14–16px | 400 | GW Buff on dark slides |
| Pull quote | Accent | 36–48px | 400 italic | Let it breathe |
| Gloss / short callout | Accent | 18–22px | 400 italic | Max 12 words |

Body, accent, and caption sizes are the same in both modes, but check paragraph wrapping in both renders too.

---

## 4. Graphic elements

GW's graphic elements support a composition — they never dominate it. They draw from GW's architecture, campus, and city; their strength comes from consistent, disciplined use.

Official files are in `assets/`. Use them instead of CSS imitations. Their fills have been normalized to the exact hex values in §1 (the files as distributed used slightly different blues), so they match CSS colors on screen. The gate crossbar and five-pointed star exist only as print files for now, so CSS fallbacks for those two are in `src/gw-theme.css`.

| Element | Files | CSS helper | Use |
|---|---|---|---|
| Chevron ribbon | `assets/chevrons/ribbon/{gw-blue,gw-buff,potomac}.svg` (156×12 seamless tile) | `.chevron-ribbon` | Thin horizontal accent beneath a title or above a footer |
| Chevron chip | `assets/chevrons/chip/{gw-blue,gw-buff,potomac}.svg` (portrait, 3:4) | `.chevron-chip` | Anchor beside a pull quote or key stat |
| Six-pointed star (battle flag) pattern | `assets/battle-flag/{gw-blue,gw-buff,potomac,blue-fog,white}.svg` (207.36×138.24 seamless tile) | `.star-pattern` | Background texture that bleeds off the slide edge |
| Gate crossbar | — | `.gate-crossbar` (CSS fallback) | Single-line divider between text sections |
| Five-pointed star | — | `.star-accent` (CSS fallback) | Single supporting accent |

**Inlining.** `python3 src/inline_asset.py <file> [--fill <color>]` prints a base64 `url(...)` for `background-image`. Base64 avoids the two traps of hand-made data URIs: the `<?xml?>` prolog and the unescaped `#` in fill colors. `--fill` recolors to any brand color (single-color elements), which is how to get tone-on-tone variants.

**Tone-on-tone star pattern.** Recolor the pattern one step from the slide background: Navy Yard slide → `gw-blue`; GW Blue slide → `navy-yard`; white slide → `gw-buff-20`. Scale the tile to about 540×360px (the helper does this) — at native size the stars are specks. Fade it toward the text with a mask, as `.star-pattern` does. Solid, high-contrast pattern colors (e.g., buff on blue) belong only on a slide with very little text.

### What counts as a graphic element

- **Graphic elements:** chevrons (ribbon, chip, background), the six-pointed star pattern, the gate crossbar, the five-pointed star.
- **Not graphic elements:** plain solid rules (the 3px title rule, a 6px cover-edge rule, divider rules), color bands, and photographs. These don't count toward the limits below.

### Rules for all elements

- **At most one graphic element per slide.** Never combine the gate crossbar, six-pointed star pattern, and five-pointed stars on the same slide.
- **One pattern family per deck:** either chevrons or the six-pointed star pattern, used wherever the deck has a pattern (cover, dividers, close). The gate crossbar and the five-pointed star are small accents and may appear in a deck of either family, one per slide.
- **Single color** for every gate crossbar and star element.
- **Brand colors only** — core palette and approved accents.
- **No patterns on content-heavy slides.**

### Chevrons

- Always point **to the right** (forward motion).
- No more than **three colors** in one slide layout.
- Fills may be one color, two colors, tone-on-tone, or a fading gradient; tone-on-tone works well behind text.
- Never combine a chevron background with chevron chips on the same slide.
- Use sparingly: title slides, section breaks, key moments — not every slide.

### Gate crossbar

Modeled on the interlocking motif atop the Professor's Gate on the Foggy Bottom campus. A single line, never tiled into a pattern; best placed near text as a divider.

### Six-pointed star

Recalls George Washington's battle flag. Use as a pattern, best as a background bleeding off the edge (section dividers, covers). Never isolate a six-pointed star as a badge or icon.

### Five-pointed star

Reflects the stars on the D.C. flag. Use individually as a supporting accent, always vertical with one tip pointing straight up. Never build a pattern from five-pointed stars; never combine with the six-pointed star pattern.

### Suggested placements

| Slide type | Chevron deck | Six-pointed star deck |
|---|---|---|
| Cover | Chevron ribbon along an edge | Tone-on-tone star pattern bleeding off one edge |
| Section divider | Chevron ribbon, or gate crossbar | Star pattern, or gate crossbar |
| Data / text content | Chevron chip anchoring a key stat or quote | Nothing, or a five-pointed star accent |
| Closing | Chevron ribbon, or a five-pointed star | Star pattern (mirroring the cover), or a five-pointed star |
| Text-heavy | Gate crossbar only, or nothing | Gate crossbar only, or nothing |

A full-bleed chevron background exists only as a print file for now; use ribbons and chips.

---

## 5. Logos

Files are in `assets/logos/`, each in `1c`, `2c`, `2c-rev` (reversed, for dark backgrounds), `blk`, and `wht-rev` versions:

- `seas/gw-sch-seas-short-*.png` — the **GW Engineering** school lockup (GW monogram | "Engineering"), 1500×445. The default logo for SEAS decks.
- `gw/gw-monogram-*.png` — the GW monogram alone.

Rules:

- **Logos go on the first and last slides only.** Interior slides carry no logo.
- This skill ships the GW Engineering lockup. Units outside SEAS fork the skill and swap in their own logo files (see the repository README).
- Use only official logo files; never redraw, recolor, stretch, or add effects. Keep original proportions.
- Place logos on plain backgrounds with generous clear space.
- **School lockup:** treat like the primary logo — corner or left/right-aligned, clear space ¼ of its width. On a 1280×720 slide make it 200–240px wide (helper `.gw-logo`; inline it with `python3 src/inline_asset.py <png> --img` and give it alt text such as "GW Engineering").
- **Plain background under the logo.** Put it in a corner away from any pattern: with the default right-edge `.star-pattern`, use a left corner; mirror both when the pattern bleeds left.
- **Default position:** bottom-left, 56px from the left and bottom edges (the `.gw-logo` defaults). Use top-left instead when the bottom of the slide holds a byline or rule that would crowd it; keep ¼ of the logo's width clear of other content on every side.
- **Monogram:** outside merchandise it must not appear on its own — use it only in visual proximity to the primary, horizontal, or a school/center/institute logo (e.g., the Engineering lockup elsewhere in the deck). Clear space: ¼ of the monogram's width. Minimum width: 20px digital.
- **Primary logo** (when supplied): place in a corner or left/right-aligned, not centered. Clear space: ¼ of its width. Minimum width: 54px digital.
- **Horizontal logo** (when supplied): only where the primary logo doesn't fit; centered. Minimum width: 150px digital.
- On dark slides use the `-rev` (reversed) files; on light slides the `2c` or `1c` files.
