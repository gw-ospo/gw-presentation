# Licensing

This repository holds four kinds of material under different terms. Every file's copyright and license is recorded in [`REUSE.toml`](REUSE.toml) in the [REUSE](https://reuse.software) format; run `reuse lint` to check it. The full license texts are in [`LICENSES/`](LICENSES/).

| Material | Examples | License |
|---|---|---|
| **Code** | the skill's scripts, deck template and CSS theme (`skills/gw-presentation/src/`), example build scripts | [BSD 3-Clause](LICENSES/BSD-3-Clause.txt) |
| **Text and design** | `SKILL.md`, `references/`, this README and the docs, and the slide content and design of the example decks | [Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSES/CC-BY-4.0.txt) |
| **Free fonts** | `skills/gw-presentation/fonts/` | [SIL Open Font License 1.1](LICENSES/OFL-1.1.txt) — see [Bundled fonts](#bundled-fonts) |
| **GW brand assets** | logos and graphic elements in `skills/gw-presentation/assets/` (including the pre-rendered images in `assets/pptx/`) and `source-assets/`, and copies of them embedded in the example decks | **Not licensed by this project:** © The George Washington University, all rights reserved; see [the notice](LICENSES/LicenseRef-GW-Brand-Assets.txt) |

Copyright © 2026 Lorena A. Barba for the code and the text and design.

## Attribution

To reuse the text or design under CC BY 4.0, credit it as, for example: *"gw-presentation" by Lorena A. Barba, https://github.com/gw-ospo/gw-presentation, licensed under CC BY 4.0.* Say if you changed it.

## GW brand assets and trademarks

The GW logos and graphic elements belong to The George Washington University. They are included so the skill can follow the [GW brand guidelines](https://communications.gwu.edu/brand-guidelines/), which govern their use. Neither license above applies to them. Some of them were recolored to the brand's published hex values and cropped to seamless tiles, as the [README](README.md#changes-to-official-brand-assets) describes; that doesn't change their ownership.

"The George Washington University," "George Washington University," "GW," and the GW logos are trademarks of The George Washington University.

## Bundled fonts

`skills/gw-presentation/fonts/` contains the free substitute fonts — Barlow Condensed, Nunito Sans, Source Serif 4, and Oswald — unmodified except for simpler file names, under the [SIL Open Font License 1.1](LICENSES/OFL-1.1.txt). Each family's copyright and license is in its `OFL-*.txt` file next to the fonts. They are included so previews look right on machines without them.

## Not included here

The project does not distribute, and does not license, either of these:
- **Brand fonts:** Gazzetta, Avenir Next and Source Serif, licensed through Adobe Fonts.
- **PptxGenJS:** installed from npm under the MIT License.

## Decks you make with the skill

Presentations you create with this skill are yours. Any GW logos and graphic elements they contain remain the university's, under the brand guidelines.
