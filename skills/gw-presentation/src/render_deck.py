#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2026 Lorena A. Barba
# SPDX-License-Identifier: BSD-3-Clause
"""Render every slide of a deck built from src/deck-template.html to PNG with headless Chrome.

Usage:
  python3 src/render_deck.py deck.html                      # brand fonts and substitutes
  python3 src/render_deck.py deck.html --fonts substitutes  # one font mode only
  python3 src/render_deck.py deck.html --out /tmp/renders

Renders both font modes by default because Gazzetta and Barlow Condensed set at very
different widths: a headline that fits in one can wrap in the other. PNGs go to a fresh
temporary folder (printed) unless --out is given, so renders never land next to the deck.
Also writes <deck>-sheet.png, a contact sheet with one row per slide and one column per
font mode: look at it first, then open single slides at full size for detail. Check for
overflow, overlap, wrapping, and contrast before delivering the deck.

Chrome is found at the usual macOS/Linux locations (including a Playwright download), or set
CHROME=/path/to/chrome. Without a browser the script exits with status 3 and says so: the deck
is fine, but it hasn't been looked at — tell the user it wasn't visually checked.

Without the brand fonts (a cloud machine, say), brand mode would only repeat the substitute
renders, so only those are made. They are a safe stand-in for brand-font line breaks in
display, accent, and label text, which set wider with the substitutes; body text sets about 3%
narrower in Nunito Sans than in Avenir Next, so leave body text a little room to spare.
The bundled substitute fonts are installed first if needed (src/install_fonts.py), so renders
look right even without access to Google Fonts.
"""
import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
from html import escape
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import install_fonts   # noqa: E402

CHROME_CANDIDATES = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "google-chrome", "google-chrome-stable", "chromium", "chromium-browser",
]
SLIDE = re.compile(r'<div\s+class="slide[\s"]')
LOAD_BUDGET_MS = 6000   # time for Google Fonts and inlined images to load
TIMEOUT_S = 45          # headless Chrome occasionally hangs; kill and retry after this
ATTEMPTS = 3
SHEET_SCALE = 0.5       # contact-sheet thumbnails are half size (640×360)
NOT_RENDERED = 3        # exit status: tools missing, nothing rendered


def find_chrome():
    """Path to a Chrome/Chromium binary, or None."""
    if os.environ.get("CHROME"):
        return os.environ["CHROME"]
    for candidate in CHROME_CANDIDATES:
        path = candidate if os.path.isabs(candidate) else shutil.which(candidate)
        if path and os.path.exists(path):
            return path
    # Browsers downloaded by Playwright (`npx playwright install chromium` / `playwright install chromium`)
    for cache in (Path.home() / ".cache/ms-playwright", Path.home() / "Library/Caches/ms-playwright"):
        for path in sorted(cache.glob("chromium*/chrome-*/chrome"), reverse=True) + \
                    sorted(cache.glob("chromium*/chrome-mac*/Chromium.app/Contents/MacOS/Chromium"), reverse=True):
            if path.exists():
                return str(path)
    return None


def not_rendered(reason):
    """Stop without rendering, in words an agent can pass on to the user."""
    print(f"NOT RENDERED: {reason}\nThe deck itself is complete, but it has not been checked visually. "
          "Tell the user, and suggest they open it and look through every slide.", file=sys.stderr)
    sys.exit(NOT_RENDERED)


def has_brand_fonts():
    """False when fontconfig shows no Gazzetta (Linux sandboxes); True otherwise (macOS can't tell)."""
    if not shutil.which("fc-list"):
        return True
    out = subprocess.run(["fc-list", ":", "family"], capture_output=True, text=True).stdout
    return "Gazzetta" in out


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("deck", type=Path)
    parser.add_argument("--fonts", choices=["brand", "substitutes", "both"], default="both")
    parser.add_argument("--out", type=Path, help="output folder (default: a new temporary folder)")
    args = parser.parse_args()

    deck = args.deck.resolve()
    n_slides = len(SLIDE.findall(deck.read_text(encoding="utf-8")))
    if n_slides == 0:
        sys.exit(f'no <div class="slide"> elements found in {deck}')
    out = args.out.resolve() if args.out else Path(tempfile.mkdtemp(prefix=f"{deck.stem}-renders-"))
    out.mkdir(parents=True, exist_ok=True)
    chrome = find_chrome()
    if not chrome:
        not_rendered("no Chrome or Chromium found (set CHROME=/path/to/chrome, or install one, e.g. "
                     "`npx playwright install chromium`)")
    print(install_fonts.ensure(quiet=True), file=sys.stderr)
    modes = ["brand", "substitutes"] if args.fonts == "both" else [args.fonts]
    if "brand" in modes and not has_brand_fonts():
        modes = ["substitutes"]
        print("brand fonts not installed here: rendering the substitute fonts only (a safe stand-in for "
              "line breaks, except body text, which sets ~3% narrower than Avenir Next)", file=sys.stderr)

    pngs = {}
    for mode in modes:
        query = "?render" + ("&fonts=substitutes" if mode == "substitutes" else "")
        for i in range(1, n_slides + 1):
            png = out / f"{deck.stem}-s{i:02d}-{mode}.png"
            screenshot(chrome, f"{deck.as_uri()}{query}#slide={i}", png)
            pngs[i, mode] = png
            print(png, flush=True)
    print(contact_sheet(chrome, deck.stem, out, n_slides, modes, pngs), flush=True)


def contact_sheet(chrome, stem, out, n_slides, modes, pngs):
    """Lay the renders out in a grid (rows: slides, columns: font modes) and screenshot it."""
    w, h, pad, label = int(1280 * SHEET_SCALE), int(720 * SHEET_SCALE), 16, 24
    cells = "".join(
        f'<figure><figcaption>Slide {i} · {mode}</figcaption><img src="{pngs[i, mode].name}"></figure>'
        for i in range(1, n_slides + 1) for mode in modes)
    page = out / f"{stem}-sheet.html"
    page.write_text(
        f"<!doctype html><title>{escape(stem)}</title><style>"
        f"body{{margin:0;padding:{pad}px;background:#DDD8D0;font:13px/1 sans-serif;"
        f"display:grid;grid-template-columns:repeat({len(modes)},{w}px);gap:{pad}px}}"
        f"figure{{margin:0}}figcaption{{height:{label}px;color:#333}}img{{width:{w}px;height:{h}px;display:block}}"
        f"</style>{cells}", encoding="utf-8")
    sheet = out / f"{stem}-sheet.png"
    size = (len(modes) * (w + pad) + pad, n_slides * (h + label + pad) + pad)
    screenshot(chrome, page.as_uri(), sheet, size)
    return sheet


def screenshot(chrome, url, png, size=(1280, 720)):
    """One Chrome call per slide, each with a throwaway profile so calls can't block each other."""
    for attempt in range(1, ATTEMPTS + 1):
        with tempfile.TemporaryDirectory(prefix="gw-render-") as profile:
            try:
                subprocess.run(
                    [chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                     f"--user-data-dir={profile}", "--no-first-run", "--no-default-browser-check",
                     f"--window-size={size[0]},{size[1]}", f"--virtual-time-budget={LOAD_BUDGET_MS}",
                     f"--screenshot={png}", url],
                    check=True, timeout=TIMEOUT_S,
                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                )
                return
            except subprocess.TimeoutExpired:
                print(f"timed out ({attempt}/{ATTEMPTS}): {url}", file=sys.stderr, flush=True)
    sys.exit(f"Chrome kept hanging on {url}")


if __name__ == "__main__":
    main()
