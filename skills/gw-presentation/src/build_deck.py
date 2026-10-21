#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2026 Lorena A. Barba
# SPDX-License-Identifier: BSD-3-Clause
"""Assemble a self-contained HTML deck from the template, the theme, and this deck's own parts.

Usage:
  python3 src/build_deck.py --title "Deck title" --css layout.css --slides slides.html --out deck.html
  python3 src/build_deck.py ... --drop-font Oswald --drop-font "Source Serif 4"

Write two files for the deck:
  layout.css   the layout CSS for this deck (from references/layouts.md)
  slides.html  the <div class="slide …"> elements, in order

Both may use placeholders, with paths relative to the skill directory:
  {{asset:assets/battle-flag/gw-blue.svg fill=navy-yard}}   ->  url("data:…")   (fill= optional)
  {{img:assets/logos/seas/gw-sch-seas-short-2c-rev.png alt="GW Engineering" class="gw-logo"}}
                                                            ->  <img src="data:…" …>

The script pastes src/gw-theme.css and the layout CSS into src/deck-template.html, puts the
slides in #stage, inlines every placeholder, and drops unused Google Fonts families.
Rebuild after every edit, then check with src/render_deck.py.
"""
import argparse
import html
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from inline_asset import data_uri   # noqa: E402

SKILL_DIR = Path(__file__).resolve().parent.parent
TEMPLATE = SKILL_DIR / "src" / "deck-template.html"
THEME = SKILL_DIR / "src" / "gw-theme.css"
THEME_MARKER = "/* ==== Paste the whole of src/gw-theme.css here ==== */"
LAYOUT_MARKER = "/* ==== Layout CSS for this deck (from references/layouts.md) ==== */"
STAGE = re.compile(r'(<div id="stage">).*?(\n</div>\n\n<nav)', re.S)
PLACEHOLDER = re.compile(r"\{\{(asset|img):([^\s}]+)((?:\s+[a-z-]+=(?:\"[^\"]*\"|[^\s}]+))*)\s*\}\}")
ATTR = re.compile(r'([a-z-]+)=(?:"([^"]*)"|([^\s}]+))')


def expand(text, source):
    def replace(m):
        kind, path, attrs = m.group(1), SKILL_DIR / m.group(2), dict(
            (a.group(1), a.group(2) if a.group(2) is not None else a.group(3)) for a in ATTR.finditer(m.group(3)))
        try:
            if kind == "asset":
                return f'url("{data_uri(path, attrs.pop("fill", None))}")'
            attrs.setdefault("alt", "")
            extra = "".join(f' {k}="{html.escape(v)}"' for k, v in attrs.items())
            return f'<img src="{data_uri(path)}"{extra}>'
        except (OSError, ValueError) as e:
            sys.exit(f"{source}: {m.group(0)}: {e}")
    return PLACEHOLDER.sub(replace, text)


def drop_fonts(page, families):
    for family in families:
        pattern = r"family=" + re.escape(family.replace(" ", "+")) + r"(?::[^&\"]*)?&?"
        page, n = re.subn(pattern, "", page)
        if n == 0:
            sys.exit(f"font family not in the template's Google Fonts link: {family}")
    return page


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--title", required=True)
    parser.add_argument("--css", type=Path, required=True, help="this deck's layout CSS")
    parser.add_argument("--slides", type=Path, required=True, help="this deck's slide <div>s")
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--drop-font", action="append", default=[], metavar="FAMILY",
                        help="Google Fonts family the deck doesn't use (repeatable)")
    args = parser.parse_args()

    page = TEMPLATE.read_text(encoding="utf-8")
    for marker in (THEME_MARKER, LAYOUT_MARKER):
        if marker not in page:
            sys.exit(f"template marker missing: {marker}")
    page = page.replace("<title>DECK TITLE</title>", f"<title>{html.escape(args.title)}</title>")
    page = page.replace(THEME_MARKER, THEME.read_text(encoding="utf-8"))
    page = page.replace(LAYOUT_MARKER, LAYOUT_MARKER + "\n" + expand(args.css.read_text(encoding="utf-8"), args.css))
    slides = expand(args.slides.read_text(encoding="utf-8"), args.slides)
    page, n = STAGE.subn(lambda m: m.group(1) + "\n" + slides.rstrip() + "\n" + m.group(2), page)
    if n != 1:
        sys.exit("could not find #stage in the template")
    page = drop_fonts(page, args.drop_font)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(page, encoding="utf-8")
    print(args.out)


if __name__ == "__main__":
    main()
