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


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("file", type=Path)
    parser.add_argument("--fill", choices=sorted(PALETTE), help="SVG only: recolor all fills to this brand color")
    out = parser.add_mutually_exclusive_group()
    out.add_argument("--img", action="store_true", help="print an <img> tag instead of a CSS url()")
    out.add_argument("--markup", action="store_true", help="SVG only: print inline <svg> markup")
    args = parser.parse_args()

    suffix = args.file.suffix.lower()
    if suffix not in MIME:
        sys.exit(f"unsupported file type: {args.file}")
    if suffix == ".svg":
        svg = args.file.read_text(encoding="utf-8")
        svg = re.sub(r"<\?xml[^>]*\?>\s*", "", svg)   # the XML prolog is invalid inside HTML
        if args.fill:
            svg, n = FILL.subn(lambda m: m.group(1) + PALETTE[args.fill], svg)
            if n == 0:
                sys.exit(f"no fill colors found in {args.file}")
        if args.markup:
            print(svg.strip())
            return
        data = svg.encode("utf-8")
    else:
        if args.fill or args.markup:
            sys.exit("--fill and --markup apply to SVG files only")
        data = args.file.read_bytes()

    uri = f"data:{MIME[suffix]};base64,{base64.b64encode(data).decode('ascii')}"
    print(f'<img src="{uri}" alt="">' if args.img else f'url("{uri}")')


if __name__ == "__main__":
    main()
