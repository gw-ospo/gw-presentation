#!/usr/bin/env python3
"""Turn a brand file from assets/ (SVG or PNG) into something you can paste into a self-contained deck.

Usage:
  python3 src/inline_asset.py assets/chevrons/ribbon/gw-blue.svg            # CSS url(...) value
  python3 src/inline_asset.py assets/battle-flag/gw-blue.svg --fill navy-yard
  python3 src/inline_asset.py assets/logos/seas/gw-sch-seas-short-2c-rev.png --img
  python3 src/inline_asset.py assets/chevrons/chip/gw-buff.svg --markup     # inline <svg> markup

Default output is a base64 CSS url(...) for background-image; base64 means the '#' in SVG
fill colors can't break the URI. --img prints an <img> tag instead (use it for logos, with
alt text). --fill recolors every fill in an SVG to one brand color (graphic elements are
single-color). Logos are never recolored.

src/build_deck.py uses the same functions for its {{asset:…}} and {{img:…}} placeholders.
"""
import argparse
import base64
import re
import sys
from pathlib import Path

# Brand colors allowed for graphic elements (references/brand.md §1).
PALETTE = {
    "gw-blue": "#033C5A",
    "gw-buff": "#D6BF91",
    "potomac": "#0075C8",
    "navy-yard": "#00223E",
    "white": "#FFFFFF",
    "gw-buff-20": "#F6F1E8",
    "gw-buff-50": "#E8DDC6",
    "gw-buff-80": "#DAC8A3",
    "potomac-20": "#CCE3F4",
    "potomac-50": "#7FBAE3",
    "potomac-80": "#3391D3",
    "blue-fog": "#52C9E8",
    "patina": "#ADCAB8",
}
MIME = {".svg": "image/svg+xml", ".png": "image/png"}

FILL = re.compile(r"(fill\s*[:=]\s*\"?)#[0-9A-Fa-f]{3,6}")


def svg_markup(path, fill=None):
    """SVG text without the XML prolog (invalid inside HTML), optionally recolored."""
    svg = Path(path).read_text(encoding="utf-8")
    svg = re.sub(r"<\?xml[^>]*\?>\s*", "", svg)
    if fill:
        if fill not in PALETTE:
            raise ValueError(f"unknown brand color '{fill}'; choose from {', '.join(sorted(PALETTE))}")
        svg, n = FILL.subn(lambda m: m.group(1) + PALETTE[fill], svg)
        if n == 0:
            raise ValueError(f"no fill colors found in {path}")
    return svg.strip()


def data_uri(path, fill=None):
    """base64 data: URI for an SVG (optionally recolored) or a PNG."""
    path = Path(path)
    suffix = path.suffix.lower()
    if suffix not in MIME:
        raise ValueError(f"unsupported file type: {path}")
    if suffix == ".svg":
        data = svg_markup(path, fill).encode("utf-8")
    else:
        if fill:
            raise ValueError("--fill applies to SVG files only; logos are never recolored")
        data = path.read_bytes()
    return f"data:{MIME[suffix]};base64,{base64.b64encode(data).decode('ascii')}"


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("file", type=Path)
    parser.add_argument("--fill", choices=sorted(PALETTE), help="SVG only: recolor all fills to this brand color")
    out = parser.add_mutually_exclusive_group()
    out.add_argument("--img", action="store_true", help="print an <img> tag instead of a CSS url()")
    out.add_argument("--markup", action="store_true", help="SVG only: print inline <svg> markup")
    args = parser.parse_args()

    try:
        if args.markup:
            if args.file.suffix.lower() != ".svg":
                raise ValueError("--markup applies to SVG files only")
            print(svg_markup(args.file, args.fill))
        elif args.img:
            print(f'<img src="{data_uri(args.file, args.fill)}" alt="">')
        else:
            print(f'url("{data_uri(args.file, args.fill)}")')
    except ValueError as e:
        sys.exit(str(e))


if __name__ == "__main__":
    main()
