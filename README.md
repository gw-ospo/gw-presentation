# gw-presentation
Agent skill to generate GW-branded presentation slides

> **Status:** refactor in progress toward the current [Agent Skills specification](https://agentskills.io/specification). The April 2026 version of the skill is in the first commit.

## Layout

| Path | Contents |
|---|---|
| `skills/gw-presentation/` | The skill: `SKILL.md`, `references/` (brand, layouts, PowerPoint), `src/` (code and CSS theme), `assets/` (official brand SVG/PNG files) |
| `docs/HISTORY.md` | Project log for how the skill was built |
| `docs/source/` | Brand guideline notes used as source material for the skill |
| `examples/` | Sample decks produced with the skill |
| `source-assets/` | Print-format brand files (EPS) still to be converted to SVG; not shipped with the skill |

## Changes to official brand assets

The SVG graphic elements in `skills/gw-presentation/assets/` come from the GW brand asset packs (chevrons and battle flag). Their fill colors have been **normalized to the brand's published hex values** so they match the CSS and PowerPoint colors on screen. Shapes and all other content are unchanged; file names were converted to kebab-case.

| Color | Fill in distributed files | Normalized to |
|---|---|---|
| GW Blue | `#003a5d` (chevrons), `#003a60` (battle flag) | `#033C5A` |
| Potomac | `#0073bb` (chevrons), `#0080c5` (battle flag) | `#0075C8` |
| Blue Fog | `#5ccbf2` (battle flag) | `#52C9E8` |
| GW Buff, White | `#d6bf91`, `#fff` | unchanged |

Logo PNGs are unchanged.
