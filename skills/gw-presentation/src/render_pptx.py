#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2026 Lorena A. Barba
# SPDX-License-Identifier: BSD-3-Clause
"""Render every slide of a .pptx to PNG, plus a contact sheet, to check it before delivering.

Usage:
  python3 src/render_pptx.py deck.pptx                 # PNGs in a new temporary folder (printed)
  python3 src/render_pptx.py deck.pptx --out /tmp/renders

Converts to PDF with LibreOffice when `soffice` is available, otherwise with Microsoft
PowerPoint on macOS (driven by AppleScript; the first run may ask to allow automation).
PowerPoint renders exactly what the presenter will see, including locally installed brand
fonts; LibreOffice may substitute fonts. PDF pages become PNGs with `pdftoppm` (poppler)
or, on macOS, PDFKit via `swift`. The contact sheet needs Chrome (as render_deck.py does).
"""
import argparse
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from render_deck import contact_sheet, find_chrome   # noqa: E402

TIMEOUT_S = 180
POWERPOINT_DIR = Path.home() / "Library/Containers/com.microsoft.Powerpoint/Data/gw-render"   # inside its sandbox

PDFKIT = r"""
import PDFKit
import AppKit
let a = CommandLine.arguments
let doc = PDFDocument(url: URL(fileURLWithPath: a[1]))!
for i in 0..<doc.pageCount {
  let page = doc.page(at: i)!
  let box = page.bounds(for: .mediaBox)
  let s = 1280.0 / box.width
  let size = NSSize(width: box.width * s, height: box.height * s)
  let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: Int(size.width), pixelsHigh: Int(size.height),
    bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB,
    bytesPerRow: 0, bitsPerPixel: 0)!
  NSGraphicsContext.saveGraphicsState()
  NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
  NSColor.white.set(); NSRect(origin: .zero, size: size).fill()
  let ctx = NSGraphicsContext.current!.cgContext
  ctx.scaleBy(x: s, y: s)
  page.draw(with: .mediaBox, to: ctx)
  NSGraphicsContext.restoreGraphicsState()
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: String(format: "%@/%@-s%02d.png", a[2], a[3], i + 1)))
}
print(doc.pageCount)
"""


def to_pdf(pptx, work):
    soffice = shutil.which("soffice") or shutil.which("libreoffice")
    if soffice:
        subprocess.run([soffice, "--headless", "--convert-to", "pdf", "--outdir", str(work), str(pptx)],
                       check=True, timeout=TIMEOUT_S, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return work / (pptx.stem + ".pdf")
    if sys.platform == "darwin" and Path("/Applications/Microsoft PowerPoint.app").exists():
        POWERPOINT_DIR.mkdir(parents=True, exist_ok=True)
        src, pdf = POWERPOINT_DIR / pptx.name, POWERPOINT_DIR / (pptx.stem + ".pdf")
        shutil.copy(pptx, src)
        pdf.unlink(missing_ok=True)
        script = f'''
            tell application "Microsoft PowerPoint"
              open POSIX file "{src}"
              delay 2
              set p to active presentation
              save p in POSIX file "{pdf}" as save as PDF
              close p saving no
            end tell'''
        subprocess.run(["osascript", "-e", script], check=True, timeout=TIMEOUT_S, stdout=subprocess.DEVNULL)
        shutil.move(str(pdf), work / pdf.name)
        src.unlink(missing_ok=True)
        return work / pdf.name
    sys.exit("Need LibreOffice (soffice) or, on macOS, Microsoft PowerPoint to render a .pptx")


def to_pngs(pdf, out, stem):
    if shutil.which("pdftoppm"):
        subprocess.run(["pdftoppm", "-png", "-scale-to-x", "1280", "-scale-to-y", "-1", str(pdf), str(out / f"{stem}-s")],
                       check=True, timeout=TIMEOUT_S)
        for png in out.glob(f"{stem}-s-*.png"):   # pdftoppm numbers pages s-1 / s-01: normalize to s01
            png.rename(out / f"{stem}-s{int(png.stem.rsplit('-', 1)[1]):02d}.png")
    elif sys.platform == "darwin" and shutil.which("swift"):
        script = out / "pdf2png.swift"
        script.write_text(PDFKIT)
        subprocess.run(["swift", str(script), str(pdf), str(out), stem], check=True, timeout=TIMEOUT_S,
                       stdout=subprocess.DEVNULL)
        script.unlink()
    else:
        sys.exit("Need pdftoppm (poppler) or, on macOS, swift to turn the PDF into images")
    return sorted(out.glob(f"{stem}-s[0-9][0-9].png"))


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("deck", type=Path)
    parser.add_argument("--out", type=Path, help="output folder (default: a new temporary folder)")
    args = parser.parse_args()

    deck = args.deck.resolve()
    out = args.out.resolve() if args.out else Path(tempfile.mkdtemp(prefix=f"{deck.stem}-renders-"))
    out.mkdir(parents=True, exist_ok=True)
    pdf = to_pdf(deck, out)
    pngs = to_pngs(pdf, out, deck.stem)
    for png in pngs:
        print(png, flush=True)
    mode = "pptx"
    sheet = contact_sheet(find_chrome(), deck.stem, out, len(pngs), [mode],
                          {(i, mode): png for i, png in enumerate(pngs, 1)})
    print(sheet, flush=True)


if __name__ == "__main__":
    main()
