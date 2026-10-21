# gw-presentation

An [Agent Skill](https://agentskills.io/specification) that makes slide presentations in the George Washington University (GW) brand: the GW palette and typefaces, the official graphic elements (chevrons, six-pointed star pattern) and the GW Engineering logo. It follows Presentation Zen principles: one idea per slide, restraint and strong contrast.

Ask your agent for "GW slides on …", "a GW-branded lecture deck", or "a PowerPoint for my talk at GW", and the skill takes over the design. It plans the narrative, picks a layout for each slide, builds the deck, renders every slide to check it, and fixes problems before handing it over.

> **Status:** refactor in progress toward the current Agent Skills specification. The April 2026 version of the skill is in the repository's first commit.

## Two output formats

| | HTML deck (default) | PowerPoint (.pptx) |
|---|---|---|
| **Best for** | Presenting from a browser; sharing a link or a single file | Presenting from PowerPoint; editing the deck yourself afterwards |
| **You get** | One self-contained `.html` file | A `.pptx` built on GW slide layouts |
| **Fonts** | Brand fonts if installed, free Google Fonts otherwise — automatically, per viewer | Chosen when the deck is built: brand fonts or free substitutes |
| **Editing later** | Ask the agent to change it | Edit in PowerPoint; added slides stay on brand |
| **Ask for it with** | Nothing special ("make me GW slides …") | "…as a PowerPoint", "…a .pptx" |

### HTML decks

The deck is a single file you can email, put on a website, or open from a USB stick. It needs only an internet connection to fetch the free fonts.

- **Presenting:** open the file in Chrome, Safari, Firefox or Edge. Use the arrow keys, Space, PageUp/PageDown, or the arrows in the bottom-right corner; Home and End jump to the first and last slide. The deck scales to any window or projector size.
- **Linking to a slide:** add `#slide=N` to the address (`talk.html#slide=4`).
- **Fonts:** viewers who have the brand fonts installed see Gazzetta, Avenir Next and Source Serif. Everyone else sees Barlow Condensed, Nunito Sans and Source Serif 4. The deck detects which it has and adjusts headline size and weight. To preview the free-font version, add `?fonts=substitutes` to the address. Safari shows the free fonts even when the brand fonts are installed, because it restricts web pages to system fonts.
- **Printing / PDF:** print from the browser; each slide prints on its own page.
- **Presenter notes:** ask for them and they're included, hidden from print.

### PowerPoint decks

The deck uses GW layouts, so it stays on brand after you edit it.

- **Adding a slide:** Home → New Slide offers the GW layouts:
  - GW Cover
  - GW Section
  - GW Title and Content
  - GW Title Only
  - GW Big Idea and GW Big Idea Dark
  - GW Blank and GW Blank Dark
  - GW Photo Split and GW Photo

  Type into a placeholder and the text comes out in the right typeface, size and color, including white text on the dark layouts.
- **Theme:** the file carries GW theme fonts and a GW color palette. New text boxes use the brand body font, and new shapes, tables and charts default to GW colors.
- **Photo slots:** ask for "a slide where I can drop in a photo later" and you get a real picture placeholder. Click its icon, or drag a photo onto it, and PowerPoint fills and crops the area.
- **Fonts:** a PowerPoint file can't switch fonts automatically. The agent asks which fonts your computer has and builds for them, or builds both versions.

## What you can ask for

The skill picks sensible defaults. You can steer it:

- **Length and setting:** "a 5-minute faculty-meeting talk", "a 50-minute lecture", "a 10-minute symposium talk".
- **Slide types:** a statistic callout, a pull quote, a section break, tiles for 3–4 parallel ideas, a split slide with a photo, a full-bleed image, a closing statement. A closing "Questions?" slide is never added.
- **Graphic style:** "use the chevrons" or "use the star pattern". Each deck uses one pattern family, on the cover, the section dividers and the close.
- **Accent color:** at most one secondary GW accent per deck, such as Row House red for urgency or Patina for sustainability.
- **Your details:** presenter name, department, event name.
- **Redesigning existing slides:** give it your current deck or outline and ask for the GW treatment.

What the skill enforces whatever you ask:
- only accessible color pairings (WCAG AA);
- the GW Engineering logo on the first and last slides only;
- at most one graphic element per slide;
- lists of no more than four short items.

## Getting the brand fonts

GW faculty and staff can activate **Gazzetta**, **Avenir Next** and **Source Serif** through GW's Adobe Creative Cloud subscription, using the links on the [typography page](https://communications.gwu.edu/brand-guidelines/typography). Avenir Next also ships with macOS. Without them, HTML decks fall back to free fonts automatically. For PowerPoint, ask for the free-font version and install [Barlow Condensed](https://fonts.google.com/specimen/Barlow+Condensed), [Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans) and [Source Serif 4](https://fonts.google.com/specimen/Source+Serif+4) from Google Fonts.

## Requirements

The agent running the skill needs:

| For | Needs |
|---|---|
| Building and checking HTML decks | Python 3 and Google Chrome or Chromium |
| Building PowerPoint decks | Node.js 18+ with `npm install pptxgenjs` in a working folder, and Chrome or Chromium |
| Checking PowerPoint decks | LibreOffice, or Microsoft PowerPoint on macOS |

## Installing the skill

The skill is the folder `skills/gw-presentation/`:

- **Claude Code:** copy or symlink the folder to `~/.claude/skills/gw-presentation/` (for all your projects) or `.claude/skills/gw-presentation/` inside a project.
- **Claude apps:** zip the `gw-presentation` folder and upload it in the Skills section of your settings.
- **Other agents** that support the open Agent Skills format: install the folder wherever that agent looks for skills.

## Repository layout

| Path | Contents |
|---|---|
| `skills/gw-presentation/` | The skill: `SKILL.md`, `references/` (brand, layouts, PowerPoint), `src/` (deck template, CSS theme, PowerPoint helper, build and render scripts), `assets/` (official brand SVG/PNG files) |
| `examples/` | Sample decks: `what-is-a-skill/` (HTML) and `reproducible-research/` (HTML, plus PowerPoint with its build script), made with the current skill; `skill-workflow/` and `early-test/` (April 2026 versions, with the original PowerPoint scripts) |
| `docs/HISTORY.md` | Project log of how the skill was built |
| `docs/source/` | Brand guideline notes used as source material |
| `source-assets/` | Print-format brand files (EPS) still to be converted to SVG; not shipped with the skill |

## Adapting the skill for another school or unit

The skill ships the **GW Engineering** (SEAS) logo lockup. Faculty and staff in other GW schools, centers or institutes can fork this repository and swap in their own unit's logo:

1. Fork the repository and get your unit's official logo files from your communications office (GW asks that only official logo files be used).
2. Add them under `skills/gw-presentation/assets/logos/<your-unit>/`, ideally with the same `-1c`, `-2c`, `-2c-rev`, `-blk`, `-wht-rev` variants (`-rev` for dark backgrounds).
3. Replace the references to `assets/logos/seas/` with your folder in these places:
   - `SKILL.md`
   - `references/brand.md` (§5), where you should also update the lockup's dimensions
   - `references/layouts.md` (Cover)
   - `src/gw_pptx.js`: the constants `LOGO_REV` and `LOGO_LIGHT`, and the lockup's 1500×445 aspect ratio in `LOGO_H`
4. Remove `assets/logos/seas/` if you don't need it.

Everything else (palette, typography, graphic elements and layouts) is university-wide and needs no change.

## Changes to official brand assets

The SVG graphic elements in `skills/gw-presentation/assets/` come from the GW brand asset packs (chevrons and battle flag). Their fill colors have been **normalized to the brand's published hex values** so they match the CSS and PowerPoint colors on screen. Shapes and all other content are unchanged; file names were converted to kebab-case.

| Color | Fill in distributed files | Normalized to |
|---|---|---|
| GW Blue | `#003a5d` (chevrons), `#003a60` (battle flag) | `#033C5A` |
| Potomac | `#0073bb` (chevrons), `#0080c5` (battle flag) | `#0075C8` |
| Blue Fog | `#5ccbf2` (battle flag) | `#52C9E8` |
| GW Buff, White | `#d6bf91`, `#fff` | unchanged |

Two sets of SVGs were also **cropped to seamless tiles**, because repeating the distributed files cut the design in half at every joint:

| SVG | Distributed tile | Problem | Now |
|---|---|---|---|
| Six-pointed star (battle flag) | 216×144 | 12.5 × 8.33 periods of the 17.28-unit star grid | viewBox and background rectangle 207.36×138.24, exactly 12 × 8 periods |
| Chevron ribbon | 159.28 units wide | 26.5 periods of the 6-unit chevron spacing | viewBox 156×12, exactly 26 periods |

The star grid and the chevrons themselves are unchanged.

Logo PNGs are unchanged.
