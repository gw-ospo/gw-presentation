# HISTORY — GWU Brand Skill & Presentation Tooling

Project log for the GWU-branded presentation work. Started **April 3, 2026** (Lorena A. Barba, labarba@gwu.edu). Written to hand off to a new cloud-based task and a fresh chat.

---

## 1. Goal

Turn the refreshed George Washington University brand guidelines into reusable tooling:

1. A Claude **skill** (`gwu-presentation`) that produces GWU-branded slide decks following the new palette, typography, graphic elements, and Presentation Zen principles.
2. Working **examples** that prove the skill (an HTML deck, then a PowerPoint export).
3. Companion **specs** for other tools (Excalidraw and similar diagramming tools).

---

## 2. Workspace inventory

Files in the `GW-brand/` workspace folder. "Origin" notes whether the file came out of the work described in this log.

| File | Purpose | Origin |
|---|---|---|
| `gwu-brand-specs.md` | Source brand spec (colors, type, etc.) used to build the skill | Pre-existing input |
| `gwu-graphic-elements-guidelines.md` | University guidance on chevrons, crossbar, stars | Pre-existing input |
| `Chevrons/`, `Elements/`, `gw_logos/`, `gw_engineering_logos/` | Official brand assets (SVG/PNG) | Pre-existing input |
| `OLD-gwu-light-theme.md` | Earlier (pre-refresh) theme, kept for reference | Pre-existing |
| `gwu-presentation.skill` | Packaged skill (ZIP containing `gwu-presentation/SKILL.md`), ~10.8 KB | Created, then re-packaged |
| `skill-workflow.html` | 8-slide sample deck describing this very workflow; HTML, 1280×720 stage scaled to viewport | Created |
| `skill-workflow.pptx` | PowerPoint export of the sample deck (PptxGenJS), later hand-tweaked by Lorena with real brand fonts | Created, then edited by user |
| `skill-workflow.pdf` | PDF of the sample deck | Present in folder; not worked on in the portion of the thread reviewed |
| `gwu-presentation-test.html` | Early test deck | Present in folder; not worked on in the portion reviewed |
| `gwu.css`, `marp-slides.md`, `marp-slides.html`, `.vscode/` | Marp/CSS experiments | Present in folder; not worked on in the portion reviewed — confirm provenance before relying on them |
| `gwu-diagramming-specs.md` | Brand specs for Excalidraw and similar tools | Created |
| `src/SKILL.md` | Unpacked working copy of the skill (685 lines, includes the PPTX section) | Created; copied into workspace |
| `src/build-pptx.js` | PptxGenJS generator for `skill-workflow.pptx` (v2, inches-based) | Created; copied into workspace |
| `src/inspect_pptx.py` | python-pptx script used to inspect fonts (blocked by the FUSE lock; fonts were read via PowerPoint instead) | Created; copied into workspace |
| `HISTORY.md` | This file | Created |

**Source files:** the unpacked skill and build scripts now live in `src/` (see table above). The durable packaged skill is still `gwu-presentation.skill`. After editing `src/SKILL.md`, re-zip it into the `.skill`.

> **Verify:** the `.skill` file's modified time shows April 5, which predates the PPTX section edits. This may just be a Box sync timestamp quirk. `src/SKILL.md` was confirmed to contain the `## PowerPoint (.pptx) Output` section (685 lines), but the packaged `.skill` has not been unzipped to confirm it matches. Unzip a copy in `/tmp` (see §6) and diff against `src/SKILL.md`.

---

## 3. Timeline

### Phase 1 — Skill creation (April 3)
- Read the saved brand specs and graphic-element guidelines and built the `gwu-presentation` skill with the refreshed palette.
- Palette: GW Blue `#033C5A`, GW Buff `#D6BF91`, Potomac `#0075C8`, Navy Yard `#00223E`, plus Buff and Potomac tints (20/50/80%).
- Proposed **fallback fonts** for the new brand typography, since the brand fonts are licensed via Adobe Fonts and can't be assumed in HTML: Gazzetta → Playfair Display; Source Serif Pro → Source Serif 4; Proxima Nova → Nunito Sans (Google Fonts).
- Located and incorporated the university's new graphic elements: chevron ribbon (alternating blue/buff diagonal stripes), Gate Crossbar (dashed horizontal rule), star motifs.
- Applied **Presentation Zen** principles at Lorena's direction: one idea per slide, restraint, high contrast for hierarchy, generous whitespace, one visual motif per slide.

### Phase 2 — Sample deck in HTML
- Used the skill to produce `skill-workflow.html`: 8 slides that describe the workflow followed here.
- Some background discussion about how skills work, plus troubleshooting (see §5: CSS specificity and `let` scoping bugs).

### Phase 3 — PowerPoint export
- Exported the HTML deck to `skill-workflow.pptx` with PptxGenJS (`LAYOUT_16x9`, 10" × 5.625").
- First attempt had overlapping elements because HTML pixel coordinates were converted to inches; rewrote the generator natively in inches with smaller fonts and taller text boxes (v2).
- Used safe fonts (Georgia / Trebuchet MS) in the generated file.

### Phase 4 — Brand fonts in PowerPoint
- Lorena installed the brand fonts locally via the GW institutional Creative Cloud subscription (Adobe Fonts) and hand-tweaked the PPTX to use them.
- Sandbox could not read the file (Box FUSE deadlock, §5), so the font spec was extracted by opening it in PowerPoint through computer-use and reading the toolbar.
- Result: **Gazzetta** (display/titles), **Source Serif Pro** (editorial/accent), **Proxima Nova** (body/UI).
- Updated `SKILL.md`: revised typography section (acknowledges Adobe Fonts; links to https://communications.gwu.edu/brand-guidelines/typography) and added a full `## PowerPoint (.pptx) Output` section: font-check prompt telling the user to install the fonts first, exact `fontFace` strings, fallback table, type scale in pt, PptxGenJS hard rules, SVG embedding, and a 7-step workflow.
- Re-packaged `gwu-presentation.skill`.

### Phase 5 — Brand fonts in HTML (unresolved)
- Question: can an HTML deck use locally installed brand fonts? **Yes** — browsers check local fonts before fetching web fonts, so listing the brand font names first in the CSS stack costs nothing and works on a machine that has them.
- Edited `skill-workflow.html` so all three font variables put brand fonts first:
  ```css
  --font-headline: 'Gazzetta', 'Playfair Display', Georgia, serif;
  --font-body:     'Proxima Nova', 'Nunito Sans', 'Helvetica Neue', Arial, sans-serif;
  --font-accent:   'Source Serif Pro', 'Source Serif 4', Georgia, serif;
  ```
- Lorena reported it **did not work**, and that Chrome and Safari render the file quite differently. A screenshot diagnosis was attempted but not concluded before moving on. See §4.

### Phase 6 — Excalidraw / diagramming specs
- Reviewed the brand guidelines and produced `gwu-diagramming-specs.md`: hex palette and tints, font mapping to Excalidraw's built-ins, stroke widths/styles, fills, corner radius (sharp by default), connector conventions, approximations of chevron ribbon / crossbar / star, a layer hierarchy, and design principles. Saved to the workspace.

---

## 4. Open items (prioritized)

1. **Brand fonts not resolving in HTML (unresolved).** Chrome vs Safari differ. Hypotheses, not yet tested:
   - The OS/browser registers the Adobe fonts under a different family name than `'Gazzetta'`, `'Proxima Nova'`, `'Source Serif Pro'` (e.g., a suffixed or width-specific family name). Check Font Book's family names.
   - Adobe Fonts activation is app-scoped or not yet active in the browser's font cache; restart the browser after activating.
   - One browser matched a local font while the other fell through to a fallback (stack order is correct, so a name mismatch is the likeliest cause).
   - Rendering-engine differences (Core Text in Safari vs Skia in Chrome) and the 112° `repeating-linear-gradient` texture also render slightly differently.
   - **Diagnosis plan:** in each browser's console run `document.fonts.check('16px "Gazzetta"')` (and the other two names), inspect the Computed → Rendered Fonts panel in DevTools on a title element, and compare against Font Book's exact family names. If names differ, update the stacks (and the PPTX `fontFace` table in `SKILL.md`, which was read from PowerPoint's toolbar and is therefore the app's display name).
2. **`SKILL.md` CSS Foundation not updated.** Brand-first font stacks were applied only to `skill-workflow.html`. Add them to the CSS template in `SKILL.md` once item 1 confirms the right family names, and re-package the `.skill`.
3. **Excalidraw specs unvalidated.** Not yet tried in Excalidraw. Font list was written from memory (Virgil, Helvetica, Cascadia); current Excalidraw versions may offer more fonts (e.g., Excalifont, Nunito, Liberation Sans), so re-check which is closest to Proxima Nova. The note "white on GW Blue ≈ 9:1 contrast" looks understated — a quick calculation gives roughly 11–12:1; verify and correct.
4. **Provenance of the Marp files** (`marp-slides.*`, `gwu.css`, `.vscode/`) is not covered by this log — add a note on what they are and whether they belong to the skill.
5. **Optional:** consider adding an Excalidraw/diagramming pointer to the skill or shipping the specs file with it.
6. **Confirm `.skill` matches `src/SKILL.md`** (see Verify note in §2).

---

## 5. Problems encountered and how they were solved

| Problem | Cause | Fix |
|---|---|---|
| `SyntaxError` in `build-pptx.js` v1 | Curly apostrophes inside single-quoted JS strings | Replaced with Unicode escapes (`’`, `—`) |
| PPTX unreadable from sandbox (`unzip`, `python-pptx`, `file` all fail with `Resource deadlock avoided`, errno 35) | Box-synced workspace is a FUSE mount that blocks some reads | Copy to `/tmp` first, or open in the native Mac app via computer-use (used to read fonts from PowerPoint) |
| Overlapping elements in PPTX v1 | HTML px → inch conversion; PowerPoint line heights differ from browsers | Rewrote in inches directly; smaller fonts; taller boxes |
| Slide-5 tile overflow | Title wrapped to 2 lines in a 0.75" box | Box 1.0", title 28 pt, shifted tile start |
| HTML slides all showing / wrong slide | `.s2 { display:flex }` etc. out-ranked `.slide { display:none }` | Switched to `visibility: hidden/visible` |
| Inline `onclick` couldn't see `current` | `let` is block-scoped | `var current = 0` |

---

## 6. Technical notes for resuming

- **PptxGenJS rules:** no `#` in colors; no 8-char hex (use `transparency`); never reuse option objects (the library mutates them); layout in inches. `LAYOUT_16x9` = 10" × 5.625".
- **Final PPTX sizes that avoided overlap:** cover title 52 pt; slide titles 32–36 pt; section divider 48 pt italic; body 14–15 pt; eyebrows 10–12 pt bold.
- **HTML deck architecture:** fixed 1280×720 `#stage`, scaled via `translate + scale` in `scaleStage()`.
- **Working around the FUSE lock:** `cp` files from `mnt/GW-brand/` to `/tmp/` before opening them with `unzip`/`python-pptx`; write generated output to the workspace folder at the end.
- **Packaging a skill:** a `.skill` is a ZIP containing `gwu-presentation/SKILL.md` (plus any assets). Re-zip with Python `zipfile` after edits.
- **Fonts quick reference**

  | Role | Brand font (Adobe Fonts) | HTML fallback | Excalidraw |
  |---|---|---|---|
  | Display / headline | Gazzetta | Playfair Display | Helvetica |
  | Editorial / accent | Source Serif Pro | Source Serif 4 | (none; Helvetica) |
  | Body / UI | Proxima Nova | Nunito Sans | Helvetica |

- **Color quick reference:** GW Blue `#033C5A` · GW Buff `#D6BF91` · Potomac `#0075C8` · Navy Yard `#00223E` · Buff 20/50/80 `#F6F1E8` / `#E8DDC6` / `#DAC8A3` · Potomac 20/50/80 `#CCE3F4` / `#7FBAE3` / `#3391D3`.

---

## 7. Suggested kickoff prompt for the new chat

> I'm continuing work on GWU brand tooling. Read `HISTORY.md` in the GW-brand folder first. Priorities: (1) diagnose why the locally installed Adobe brand fonts don't load in `skill-workflow.html` (Chrome vs Safari differ) using `document.fonts.check()` and DevTools' rendered-fonts panel; (2) once family names are confirmed, update the CSS Foundation in `SKILL.md` and re-package `gwu-presentation.skill`; (3) validate `gwu-diagramming-specs.md` in Excalidraw.
