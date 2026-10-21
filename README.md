# gw-presentation
Agent skill to generate GW-branded presentation slides

> **Status:** refactor in progress toward the current [Agent Skills specification](https://agentskills.io/specification). The April 2026 version of the skill is in the first commit.

## Layout

| Path | Contents |
|---|---|
| `skills/gw-presentation/` | The skill: `SKILL.md`, `references/` (brand, layouts, PowerPoint), `src/` (code and CSS theme), `assets/` (official brand SVG/PNG files) |
| `docs/HISTORY.md` | Project log for how the skill was built |
| `docs/source/` | Brand guideline notes used as source material for the skill |
| `examples/` | Sample decks: `what-is-a-skill/` (HTML) and `reproducible-research/` (HTML, and PowerPoint with its build script), made with the refactored skill; `skill-workflow/` and `early-test/` (April 2026 versions, with the original PPTX scripts) |
| `source-assets/` | Print-format brand files (EPS) still to be converted to SVG; not shipped with the skill |

## Adapting the skill for another school or unit

The skill ships the **GW Engineering** (SEAS) logo lockup. Faculty and staff in other GW schools, centers, or institutes can fork this repository and swap in their own unit's logo:

1. Fork the repository and get your unit's official logo files from your communications office (GW asks that only official logo files be used).
2. Add them under `skills/gw-presentation/assets/logos/<your-unit>/`, ideally with the same `-1c`, `-2c`, `-2c-rev`, `-blk`, `-wht-rev` variants (`-rev` for dark backgrounds).
3. Replace the references to `assets/logos/seas/` in `SKILL.md`, `references/brand.md` (§5), `references/layouts.md` (Cover), and `src/gw_pptx.js` (`LOGO_REV`, `LOGO_LIGHT`, and the lockup's 1500×445 aspect in `LOGO_H`) with your folder, and update the lockup's dimensions in `brand.md` §5.
4. Remove `assets/logos/seas/` if you don't need it.

Everything else — palette, typography, graphic elements, and layouts — is university-wide and needs no change.

## Changes to official brand assets

The SVG graphic elements in `skills/gw-presentation/assets/` come from the GW brand asset packs (chevrons and battle flag). Their fill colors have been **normalized to the brand's published hex values** so they match the CSS and PowerPoint colors on screen. Shapes and all other content are unchanged; file names were converted to kebab-case.

| Color | Fill in distributed files | Normalized to |
|---|---|---|
| GW Blue | `#003a5d` (chevrons), `#003a60` (battle flag) | `#033C5A` |
| Potomac | `#0073bb` (chevrons), `#0080c5` (battle flag) | `#0075C8` |
| Blue Fog | `#5ccbf2` (battle flag) | `#52C9E8` |
| GW Buff, White | `#d6bf91`, `#fff` | unchanged |

The six-pointed star (battle flag) SVGs were also **cropped to a seamless tile**: the distributed 216×144 tile holds 12.5 × 8.33 periods of the 17.28-unit star grid, so repeating it cut stars in half along visible seams. The viewBox and background rectangle are now 207.36×138.24 (exactly 12 × 8 periods); the star grid itself is unchanged. The chevron ribbon SVGs had the same problem (159.28 units wide, 26.5 periods of the 6-unit chevron spacing); their viewBox is now 156×12, exactly 26 periods.

Logo PNGs are unchanged.
