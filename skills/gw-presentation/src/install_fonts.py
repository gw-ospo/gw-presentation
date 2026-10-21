#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2026 Lorena A. Barba
# SPDX-License-Identifier: BSD-3-Clause
"""Install the free substitute fonts bundled in fonts/ so offline renders look right.

Usage:
  python3 src/install_fonts.py            # install if missing (Linux), report status
  python3 src/install_fonts.py --check    # only report which families are available

The bundled fonts are Barlow Condensed, Nunito Sans, Source Serif 4, and Oswald (SIL Open
Font License; licenses in fonts/). They stand in for the Adobe brand fonts in previews made
on machines that don't have them — typically a cloud sandbox, often without access to Google
Fonts. render_deck.py and render_pptx.py call this automatically.

On Linux they go to ~/.local/share/fonts/gw-presentation/ and the fontconfig cache is
refreshed, which makes them visible to Chrome and LibreOffice. On macOS nothing is installed
unless --force is given: Macs that render decks normally reach Google Fonts, and PowerPoint
builds for the brand fonts.
"""
import argparse
import shutil
import subprocess
import sys
from pathlib import Path

FONTS = Path(__file__).resolve().parent.parent / "fonts"
FAMILIES = ["Barlow Condensed", "Nunito Sans", "Source Serif 4", "Oswald"]
LINUX_DIR = Path.home() / ".local/share/fonts/gw-presentation"
MAC_DIR = Path.home() / "Library/Fonts"


def available():
    """Families fontconfig can find, or None where fontconfig isn't installed (e.g. macOS)."""
    if not shutil.which("fc-list"):
        return None
    out = subprocess.run(["fc-list", ":", "family"], capture_output=True, text=True).stdout
    names = {n.strip() for line in out.splitlines() for n in line.split(",")}
    return {f: f in names for f in FAMILIES}


def install(force=False):
    if sys.platform == "darwin" and not force:
        return None
    target = LINUX_DIR if sys.platform != "darwin" else MAC_DIR
    target.mkdir(parents=True, exist_ok=True)
    for font in FONTS.glob("*.ttf"):
        if not (target / font.name).exists():
            shutil.copy2(font, target / font.name)
    if shutil.which("fc-cache"):
        subprocess.run(["fc-cache", "-f", str(target)], check=False, capture_output=True)
    return target


def ensure(quiet=False):
    """Install the bundled fonts if any family is missing. Returns a one-line status."""
    status = available()
    if status is not None and all(status.values()):
        return "substitute fonts available"
    target = install()
    if target is None:
        return "substitute fonts: not installed on macOS (renders load them from Google Fonts)"
    status = available()
    missing = [f for f, ok in (status or {}).items() if not ok]
    msg = f"substitute fonts installed to {target}" + (f"; still missing: {', '.join(missing)}" if missing else "")
    if not quiet:
        print(msg, file=sys.stderr)
    return msg


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--check", action="store_true", help="only report availability")
    parser.add_argument("--force", action="store_true", help="install on macOS too (into ~/Library/Fonts)")
    args = parser.parse_args()
    if args.check:
        status = available()
        print("fontconfig not available" if status is None else
              "\n".join(f"{'ok     ' if ok else 'missing'} {f}" for f, ok in status.items()))
    elif args.force:
        print(f"installed to {install(force=True)}")
    else:
        print(ensure(quiet=True))


if __name__ == "__main__":
    main()
