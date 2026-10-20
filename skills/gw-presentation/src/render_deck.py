#!/usr/bin/env python3
"""Render every slide of a deck built from src/deck-template.html to PNG with headless Chrome.

Usage:
  python3 src/render_deck.py deck.html                      # brand fonts and substitutes
  python3 src/render_deck.py deck.html --fonts substitutes  # one font mode only
  python3 src/render_deck.py deck.html --out /tmp/renders

Renders both font modes by default because Gazzetta and Barlow Condensed set at very
different widths: a headline that fits in one can wrap in the other. Look at every PNG
for overflow, overlap, wrapping, and contrast before delivering the deck.

Chrome is found at the usual macOS/Linux locations, or set CHROME=/path/to/chrome.
"""
import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

CHROME_CANDIDATES = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "google-chrome", "google-chrome-stable", "chromium", "chromium-browser",
]
SLIDE = re.compile(r'<div\s+class="slide[\s"]')
LOAD_BUDGET_MS = 6000   # time for Google Fonts and inlined images to load
TIMEOUT_S = 45          # headless Chrome occasionally hangs; kill and retry after this
ATTEMPTS = 3


def find_chrome():
    if os.environ.get("CHROME"):
        return os.environ["CHROME"]
    for candidate in CHROME_CANDIDATES:
        path = candidate if os.path.isabs(candidate) else shutil.which(candidate)
        if path and os.path.exists(path):
            return path
    sys.exit("Chrome not found; set CHROME=/path/to/chrome")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("deck", type=Path)
    parser.add_argument("--fonts", choices=["brand", "substitutes", "both"], default="both")
    parser.add_argument("--out", type=Path, help="output folder (default: <deck>-renders/ next to the deck)")
    args = parser.parse_args()

    deck = args.deck.resolve()
    n_slides = len(SLIDE.findall(deck.read_text(encoding="utf-8")))
    if n_slides == 0:
        sys.exit(f'no <div class="slide"> elements found in {deck}')
    out = (args.out or deck.with_name(deck.stem + "-renders")).resolve()
    out.mkdir(parents=True, exist_ok=True)
    chrome = find_chrome()
    modes = ["brand", "substitutes"] if args.fonts == "both" else [args.fonts]

    for mode in modes:
        query = "?render" + ("&fonts=substitutes" if mode == "substitutes" else "")
        for i in range(1, n_slides + 1):
            png = out / f"{deck.stem}-s{i:02d}-{mode}.png"
            screenshot(chrome, f"{deck.as_uri()}{query}#slide={i}", png)
            print(png, flush=True)


def screenshot(chrome, url, png):
    """One Chrome call per slide, each with a throwaway profile so calls can't block each other."""
    for attempt in range(1, ATTEMPTS + 1):
        with tempfile.TemporaryDirectory(prefix="gw-render-") as profile:
            try:
                subprocess.run(
                    [chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                     f"--user-data-dir={profile}", "--no-first-run", "--no-default-browser-check",
                     "--window-size=1280,720", f"--virtual-time-budget={LOAD_BUDGET_MS}",
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
