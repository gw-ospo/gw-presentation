# HISTORY — GWU Brand Skill & Presentation Tooling

Project log for the GWU-branded presentation work. Started **April 3, 2026** (Lorena A. Barba, labarba@gwu.edu). Written to hand off to a new cloud-based task and a fresh chat.

> **Two parts.** Part I (§1–§7) is the April 2026 log, kept as written: its file paths refer to the old Box workspace `GW-brand/`, and it says "GWU", which the project has since dropped for the official "GW". Part II (§8–§14) logs the October 2026 refactor into this repository (`gw-ospo/gw-presentation`) and supersedes Part I's open items and technical notes.

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

---

# Part II — Refactor into `gw-ospo/gw-presentation` (October 20–21, 2026)

Work done in one Claude Code session (Lorena A. Barba with Claude), moving the April skill from the Box workspace into this version-controlled repository and bringing it up to the current [Agent Skills specification](https://agentskills.io/specification). Each phase ended in a commit by Lorena; the commit subjects are listed in §9.

## 8. Decisions made

- **Name:** "GW", never "GWU" (the official university acronym). The skill is `gw-presentation`.
- **Typefaces:** the body font is **Avenir Next**, not Proxima Nova; that was an error carried over from the pre-refresh theme. Brand fonts come first whenever they're installed. The free substitutes are:
  - Source Serif → **Source Serif 4**, the same Adobe open-source family;
  - Avenir Next → **Nunito Sans**;
  - Gazzetta → **Barlow Condensed**, with **Oswald** only for heavy all-caps numerals and stamps.
- **Graphic elements:** use the real brand SVG/PNG assets, never CSS imitations.
- **Templates:** don't use GW's official PowerPoint templates. The skill has its own design.
- **Logo:** the GW Engineering (SEAS) lockup, on the first and last slides only. Other units fork the repo and swap logos; the README has instructions.
- **Asset colors:** recolor the official SVGs to the published hex values (screen colors), and document the change in the README.
- **Licensing:** BSD-3-Clause for code; CC BY 4.0 for text and design; GW logos and graphic elements excluded (© GWU, not licensed); bundled free fonts under OFL-1.1. Copyright holder: Lorena A. Barba. GW's copyright policy lets faculty keep copyright in scholarly works, and this was done on personal time; Lorena is faculty director of the GW OSPO.
- **Out of scope for now:** the Marp theme (`gwu.css`) and the Excalidraw diagramming specs. Both were Lorena's experiments, to be revisited later.

## 9. Timeline

1. **Audit and plan.** Read the Box workspace and Part I of this log. Checked the current Agent Skills spec (agentskills.io) and the live GW brand pages. Findings:
   - `SKILL.md` was 686 lines in one file.
   - The body font was wrong (Proxima Nova instead of Avenir Next).
   - The stat label used buff on white, which fails contrast (1.6:1).
   - Chevrons were faked in CSS, and no code shipped with the skill.
   - Resolved Part I's open item 6: the packaged `.skill` was byte-identical to `src/SKILL.md`.
2. **Baseline import** (`3aaa1e7`). Historic files copied into the repo layout unchanged: `skills/gw-presentation/`, `docs/`, `examples/` and `source-assets/`. Skipped: the Marp files, the diagramming specs, the old theme, the EPS/AI duplicates, and some SEAS logo variants.
3. **SKILL.md refactor** (`2f595dd`). Cut from 686 to about 140 lines, with the details moved out:
   - `references/brand.md`: palette, the full WCAG table, typography, graphic elements and logos.
   - `references/layouts.md`: the nine layout patterns.
   - `references/pptx.md`: the PowerPoint workflow.
   - `src/gw-theme.css`: the CSS foundation.

   The frontmatter was renamed, with a third-person description, and passes `agentskills validate`.
4. **Asset normalization** (`faf24d0`). Chevron and battle-flag SVG fills recolored to hex. The distributed files used inconsistent blues close to the published RGB values. The Engineering lockup became the default logo.
5. **First fresh-agent test** (3-slide "What is an agent skill?"). A subagent with only the skill found many gaps:
   - Gazzetta was described as a serif.
   - Display weights were wrong for Gazzetta.
   - The chip's aspect ratio was wrong (it is 3:4).
   - The data-URI example broke.
   - There was no star-pattern guidance and no render method.
6. **Deck template and tooling** (`6639b12`).
   - Added `src/deck-template.html`, with navigation, `#slide=N`, `?fonts=substitutes`, print, and font-mode detection.
   - Added `src/render_deck.py` (headless Chrome, both font modes) and `src/inline_asset.py`.
   - Added display-weight tokens, star-pattern and logo helpers, and the definition of a graphic element (one pattern family per deck).
   - Added the dark Big Idea close, the short-deck guidance, and the fork instructions.
   - Cropped the battle-flag SVGs to a seamless tile.
   - Second fresh-agent test (6-slide symposium deck) fixed the render-script hang, nav visible in renders, logo inlining, and logo/pattern collisions.
7. **Third test and fixes** (`db7071d`).
   - Added `src/build_deck.py`, an assembly helper with `{{asset:…}}` and `{{img:…}}` placeholders.
   - Added contact sheets, renders to a temp folder, and font detection that re-checks once fonts load.
   - Added `--display-scale`: 1.25 with Gazzetta, so brand-mode headlines match Barlow's presence.
   - Fixed tile labels: Potomac on Buff 20% is 4.3:1, so they are now GW Blue.
   - Regenerated `examples/what-is-a-skill/`.
8. **PowerPoint path refactor** (`c30b56e`, `75c8b7a`).
   - Added `src/gw_pptx.js` with:
     - slide builders (`cover`, `bigIdea`, `stat`, `divider`, `tiles`, `content`, `split`, `image`, `quote`, `close`);
     - GW layouts with real title, body and picture placeholders, and the stray DEFAULT layout removed;
     - GW theme fonts and color palette, and white text on dark layouts;
     - real SVG fallback PNGs;
     - `defineLayout()` and `d()`.
   - Added `src/render_pptx.py`, using LibreOffice, or PowerPoint on macOS through AppleScript plus PDFKit.
   - Rewrote `references/pptx.md`.
   - Moved the old `build-pptx.js` and `inspect_pptx.py` to `examples/skill-workflow/`.
   - Cropped the chevron ribbon to a seamless tile.
   - Added the PowerPoint example (`examples/reproducible-research/`).
   - Rewrote the README around the two output formats.
   - Verified in PowerPoint: placeholder slides added by hand inherit brand styling, and PowerPoint reports the photo placeholder as a picture placeholder.
9. **Licensing** (`d89836b`). `LICENSES/` (BSD-3-Clause, CC-BY-4.0, LicenseRef-GW-Brand-Assets), `REUSE.toml`, `LICENSE.md` at the root and in the skill folder, SPDX headers, the `SKILL.md` `license` field, and a README trademark notice. `reuse lint` passes.
10. **Cloud readiness** (`1b9b3ad`). Researched Claude Code on the web, the Claude apps sandbox, and the API container (§12). Then:
    - Pre-rendered the PowerPoint images into `assets/pptx/`, so builds need no browser.
    - Bundled the OFL substitute fonts in `fonts/`, installed by `src/install_fonts.py`.
    - Made the render scripts degrade gracefully (status 3, "NOT RENDERED").
    - Added sandbox guidance to `SKILL.md` and `pptx.md`, and requirements by environment to the README.

## 10. Repository map (as of `1b9b3ad`)

| Path | Contents |
|---|---|
| `skills/gw-presentation/SKILL.md` | Workflow, principles, brand essentials, layout menu, checklist, HTML/PPTX output, sandbox guidance, gotchas (~160 lines) |
| `…/references/` | `brand.md`, `layouts.md`, `pptx.md` |
| `…/src/` | `deck-template.html`, `gw-theme.css`, `build_deck.py`, `inline_asset.py`, `render_deck.py`, `gw_pptx.js`, `render_pptx.py`, `install_fonts.py` |
| `…/assets/` | Official SVGs (chevrons, battle flag), logo PNGs (GW monogram, SEAS lockup), `pptx/` pre-rendered images |
| `…/fonts/` | Barlow Condensed, Nunito Sans, Source Serif 4, Oswald (OFL) |
| `examples/` | `what-is-a-skill/` (HTML), `reproducible-research/` (HTML, PPTX and build script), `skill-workflow/` and `early-test/` (April) |
| `docs/` | This log; `source/` brand notes |
| `source-assets/` | Gate crossbar and five-point star EPS, not yet converted to SVG |
| `LICENSE.md`, `LICENSES/`, `REUSE.toml` | Licensing |

## 11. Problems encountered and how they were solved

| Problem | Cause | Fix |
|---|---|---|
| HTML brand fonts "didn't work" (Part I open item 1) | Gazzetta's italic is a separate family, `Gazzetta Slanted`; Safari restricts pages to system fonts | Separate italic stack; documented Safari behavior; per-viewer font-mode detection |
| Display text far too heavy | Gazzetta Regular (400) already reads bold; 600 is ultra-black | Weight tokens: 300/400/500 brand, 400/600/700 substitutes |
| Headlines wrap differently by font | Barlow Condensed sets ~1.6× wider than Gazzetta | Size for substitute mode; `max-width` + `text-wrap: balance`; `--display-scale` 1.25 in brand mode |
| Visible seams in star and ribbon patterns | Distributed tiles weren't whole periods (12.5 × 8.33; 26.5) | Cropped viewBoxes to 207.36×138.24 and 156×12 |
| Slide arrows did nothing in the embedded browser | The pane shows local files as a static snapshot, without scripts | Serve over localhost; documented as a gotcha |
| `render_deck.py` hung for minutes | Headless Chrome calls shared a profile | Fresh `--user-data-dir` per call, timeouts and retries |
| PPTX titles centered, insets off | Master title style wins when the layout doesn't set alignment; PptxGenJS sets insets only on slides | Explicit `align`; post-process layout `bodyPr` insets and anchors |
| Star texture invisible in PPTX | Inverted background→star color map (navy stars on navy) | `STAR_ON` map; bake the slide color into the texture |
| Closing slide text hidden | Pattern added after the text | `decorate` callback runs before text |
| Picture placeholder became a generic box | PptxGenJS drops `type="pic"` | Post-process layouts and slides |
| Broken-image fallback PNGs | PptxGenJS can't rasterize SVG in Node | Pre-rendered PNGs in `assets/pptx/` |
| PowerPoint AppleScript couldn't reach layouts | Its dictionary doesn't expose custom layouts reliably | Tested hand-added slides by injecting PowerPoint-style slide XML |

## 12. Technical notes for resuming

- **Validating:** `uvx --from skills-ref agentskills validate skills/gw-presentation` and `uvx --from 'reuse[charset-normalizer]' reuse lint`.
- **Rendering:**
  - `python3 src/render_deck.py deck.html` renders both font modes and a contact sheet.
  - `python3 src/render_pptx.py deck.pptx` uses LibreOffice, or PowerPoint on macOS; the PowerPoint route copies the file into PowerPoint's sandbox folder.
- **PowerPoint builds:** run `node script.js` from a folder with `npm install pptxgenjs`; `src/gw_pptx.js` resolves the package from the current folder, NODE_PATH, or the global npm root. `node src/gw_pptx.js --make-images` regenerates `assets/pptx/` (needs Chrome).
- **Testing method:** a fresh `general-purpose` subagent gets only the skill path and a realistic user request, then reports its feedback. I render the result myself before trusting it. Three HTML tests and two PowerPoint tests were run this way.
- **Measured widths,** with substitutes relative to brand fonts as the skill sizes them:
  - display +31% (HTML) and +34% (PowerPoint);
  - accent +5%;
  - bold labels ±0;
  - body −3% (Nunito Sans narrower than Avenir Next).

  So free-font renders are a safe stand-in for brand-font line breaks, except for body text.
- **Cloud environments** (per Anthropic docs, not yet tested):

  | | Machine and tools | Network | Notes |
  |---|---|---|---|
  | Claude Code on the web | Ubuntu 24.04 VM; Python and Node preinstalled | Trusted allowlist includes npm, PyPI, Ubuntu apt and Google Fonts | Root setup scripts; no browser or LibreOffice documented |
  | Claude apps | Sandbox; Anthropic's pptx skill says pptxgenjs, `soffice` and `pdftoppm` are present | Package registries only | Not verified |
  | Claude API | Python 3.11, no Node | None | — |

## 13. Open items (prioritized)

1. **Cloud probe.** Run a real Claude Code on the web session:
   - see what's installed;
   - try installing Chromium (Ubuntu's apt `chromium` is a snap; Playwright's download hosts may not be allowlisted), LibreOffice and poppler;
   - run both paths end to end.

   Then add a tested environment setup script to the README and update its environment table.
2. **Fresh-agent retests** of what no fresh agent has used yet: `build_deck.py`, the PowerPoint photo placeholders, `image()`, `defineLayout()` and `d()`, and the sandbox workflow (build twice, render the substitutes copy).
3. **Body-text margin.** Optionally add a strict check mode that widens body text about 3% in substitute renders.
4. **Evals.** Formalize the test prompts as `skills/gw-presentation/evals/evals.json`, following the spec's evaluation guidance.
5. **Publishing** (Phase 5 of the original plan):
   - a Claude Code plugin marketplace manifest (`.claude-plugin/marketplace.json`; check the current format in the docs);
   - a tagged release;
   - a zip for the Claude apps;
   - a CHANGELOG.
6. **Remaining assets.** Convert the gate crossbar and five-point star EPS files to SVG, which would replace the CSS fallbacks. Decide about the SEAS city-outline lockup.
7. **Smaller gaps:**
   - `quote()` has no chevron-chip anchor and can't omit the em dash;
   - there is no way to detect installed brand fonts before a PowerPoint build;
   - API support for PowerPoint would need a `python-pptx` port (not planned).
8. **Content to verify** before using the examples:
   - the Stodden et al. 2018 statistic in `reproducible-research`;
   - the Frank Lloyd Wright quote from the test lecture deck (not in the repo).
9. **Deferred by decision:** the Marp theme and the diagramming/Excalidraw specs.

## 14. Kickoff prompt for the next session

See §13 for the work list. A suggested prompt:

> I'm continuing work on the `gw-presentation` agent skill in this repository (gw-ospo/gw-presentation). Read `docs/HISTORY.md` first, especially Part II (§8–§14), then `README.md` and `skills/gw-presentation/SKILL.md`. Don't re-litigate the decisions in §8. Start with open item 1: probe this cloud environment (what's installed, whether Chromium, LibreOffice and poppler can be installed, and whether both the HTML and PowerPoint paths work end to end). Report findings before changing files.
