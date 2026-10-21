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
fonts. PDF pages become PNGs with `pdftoppm` (poppler), the `pypdfium2` Python package, or,
on macOS, PDFKit via `swift`. The contact sheet uses Chrome, or Pillow, or is skipped.

Without a converter the script exits with status 3 and says so: tell the user the deck wasn't
visually checked. The bundled substitute fonts are installed first if needed.

LibreOffice can only show fonts the machine has. A deck built for the brand fonts, rendered
where they aren't installed (a cloud machine), shows unrelated fallback fonts and misleading
line breaks — the script warns. There, build a second copy with fonts: 'substitutes' and check
that one: the substitutes set wider than the brand fonts in display, accent, and label text, so
if it fits there it fits for the presenter; leave body text a little room (Nunito Sans sets
~3% narrower than Avenir Next).
"""
import argparse
import re
import shutil
import zipfile
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from render_deck import contact_sheet, find_chrome, has_brand_fonts, not_rendered   # noqa: E402
import install_fonts   # noqa: E402

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
        # A fresh profile: a shared or locked one makes headless LibreOffice hang in sandboxes
        profile = Path(tempfile.mkdtemp(prefix="gw-lo-profile-"))
        try:
            subprocess.run([soffice, f"-env:UserInstallation={profile.as_uri()}", "--headless", "--norestore",
                            "--convert-to", "pdf", "--outdir", str(work), str(pptx)],
                           check=True, timeout=TIMEOUT_S, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as e:
            not_rendered(f"LibreOffice failed to convert the deck ({e.__class__.__name__})")
        finally:
            shutil.rmtree(profile, ignore_errors=True)
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
    not_rendered("no LibreOffice (soffice) found, and no Microsoft PowerPoint (macOS) to fall back on")


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
        try:
            import pypdfium2   # preinstalled in some sandboxes, e.g. the Claude API container
        except ImportError:
            not_rendered("no way to turn the PDF into images: install poppler (pdftoppm) or `pip install pypdfium2`")
        doc = pypdfium2.PdfDocument(str(pdf))
        for i, page in enumerate(doc, 1):
            page.render(scale=1280 / page.get_width()).to_pil().save(out / f"{stem}-s{i:02d}.png")
    return sorted(out.glob(f"{stem}-s[0-9][0-9].png"))


def names_brand_fonts(pptx):
    """True when the deck's theme uses the brand fonts (built with fonts: 'brand')."""
    with zipfile.ZipFile(pptx) as z:
        theme = z.read("ppt/theme/theme1.xml").decode("utf-8", "replace")
    return bool(re.search(r'<a:majorFont><a:latin typeface="Gazzetta"', theme))


def pillow_sheet(stem, out, pngs):
    """Contact sheet without a browser, if Pillow is installed; otherwise None."""
    try:
        from PIL import Image
    except ImportError:
        return None
    w, h, pad = 640, 360, 16
    sheet = Image.new("RGB", (w + 2 * pad, len(pngs) * (h + pad) + pad), (221, 216, 208))
    for i, png in enumerate(pngs):
        sheet.paste(Image.open(png).convert("RGB").resize((w, h)), (pad, pad + i * (h + pad)))
    path = out / f"{stem}-sheet.png"
    sheet.save(path)
    return path


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("deck", type=Path)
    parser.add_argument("--out", type=Path, help="output folder (default: a new temporary folder)")
    args = parser.parse_args()

    deck = args.deck.resolve()
    out = args.out.resolve() if args.out else Path(tempfile.mkdtemp(prefix=f"{deck.stem}-renders-"))
    out.mkdir(parents=True, exist_ok=True)
    print(install_fonts.ensure(quiet=True), file=sys.stderr)
    uses_soffice = bool(shutil.which("soffice") or shutil.which("libreoffice"))
    if uses_soffice and names_brand_fonts(deck) and not has_brand_fonts():
        print("WARNING: this deck uses the brand fonts, which aren't installed here; LibreOffice substitutes "
              "unrelated fonts, so these renders don't show the presenter's line breaks. Check a copy built "
              "with fonts: 'substitutes' instead (see references/pptx.md).", file=sys.stderr)
    pdf = to_pdf(deck, out)
    pngs = to_pngs(pdf, out, deck.stem)
    for png in pngs:
        print(png, flush=True)
    mode = "pptx"
    chrome = find_chrome()
    sheet = (contact_sheet(chrome, deck.stem, out, len(pngs), [mode], {(i, mode): png for i, png in enumerate(pngs, 1)})
             if chrome else pillow_sheet(deck.stem, out, pngs))
    print(sheet if sheet else "no contact sheet (no Chrome or Pillow): look at the slide PNGs one by one", flush=True)


if __name__ == "__main__":
    main()
