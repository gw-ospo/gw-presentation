/**
 * gw_pptx.js — build GW-branded PowerPoint decks with PptxGenJS.
 *
 *   const gw = require('/path/to/skill/src/gw_pptx.js');
 *   const deck = gw.createDeck({ title: 'Reproducible by design', author: 'A. Presenter',
 *                                fonts: 'brand', pattern: 'chevrons' });
 *   deck.cover({ eyebrow: 'Research symposium', title: 'Reproducible\nby design', subtitle: '…', byline: '…' });
 *   deck.stat({ stats: [{ value: '26%', label: 'of studies could be reproduced' }], gloss: '…', source: '…' });
 *   deck.close({ text: 'Make your next paper one anyone can rerun.' });
 *   await deck.save('talk.pptx');
 *
 * Every slide is built on a GW slide layout with real title/body placeholders, and the file
 * carries GW theme fonts and a GW theme color palette, so slides a presenter adds later in
 * PowerPoint (Home → New Slide) come out on brand. See references/pptx.md.
 *
 * Needs: npm install pptxgenjs (in the working folder), Google Chrome or Chromium (for SVG
 * fallback images and the star pattern), and the brand or substitute fonts installed.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const PptxGenJS = requireFromCwd('pptxgenjs');
const JSZip = requireFromCwd('jszip');   // installed with pptxgenjs

const ASSETS = path.join(__dirname, '..', 'assets');

// ── Brand ────────────────────────────────────────────────────────────────────
const C = {
  gwBlue: '033C5A', gwBuff: 'D6BF91', potomac: '0075C8', navyYard: '00223E', white: 'FFFFFF',
  buff20: 'F6F1E8', buff50: 'E8DDC6', buff80: 'DAC8A3', potomac20: 'CCE3F4', potomac50: '7FBAE3',
  body: '1E1E1E', caption: '666666',
};
// Tone-on-tone star pattern: slide background → star color one step away (references/brand.md §4)
const STAR_ON = { [C.navyYard]: 'gw-blue', [C.gwBlue]: 'navy-yard', [C.white]: 'gw-buff-20' };
const FONTS = {
  brand:       { display: 'Gazzetta', displayItalic: 'Gazzetta Slanted', body: 'Avenir Next',
                 accent: 'Source Serif Pro', displayBold: false, italicFlag: false, scale: 1 },
  // Barlow sets ~1.6× wider and lighter: smaller and bold (references/brand.md §3, two font modes)
  substitutes: { display: 'Barlow Condensed', displayItalic: 'Barlow Condensed', body: 'Nunito Sans',
                 accent: 'Source Serif 4', displayBold: true, italicFlag: true, scale: 0.8 },
};

// ── Geometry (inches; 16:9 is 10 × 5.625; 1 px of the 1280×720 HTML slide = 1/128 in) ──
const SW = 10, SH = 5.625, M = 0.6;
const LOGO_W = 1.72, LOGO_H = LOGO_W * 445 / 1500, LOGO_M = 0.44;     // 220 px wide, 56 px margin
const RIBBON_TILES = 6, RIBBON_W = SW / RIBBON_TILES, RIBBON_H = RIBBON_W * 12 / 156;
const LOGO_REV = path.join(ASSETS, 'logos', 'seas', 'gw-sch-seas-short-2c-rev.png');
const LOGO_LIGHT = path.join(ASSETS, 'logos', 'seas', 'gw-sch-seas-short-2c.png');

// ── Layouts (slide masters in PptxGenJS terms) ───────────────────────────────
// Each entry: background, dark?, and placeholders. Sizes are brand-mode points.
function layoutSpecs(F) {
  const d = (pt) => Math.round(pt * F.scale);
  // align must be explicit: otherwise the master's centered title style wins
  const title = (o) => ({ type: 'title', name: 'title', fontFace: F.display, bold: F.displayBold,
                          color: C.gwBlue, align: 'left', margin: 0, ...o });
  const body = (o) => ({ type: 'body', name: 'body', fontFace: F.body, fontSize: 16, color: C.body,
                         align: 'left', margin: 0, lineSpacingMultiple: 1.3, ...o });
  return {
    'GW Cover': { bg: C.navyYard, dark: true, ph: [
      title({ x: M, y: 1.55, w: 6.4, h: 1.9, fontSize: d(60), color: C.white, valign: 'bottom', prompt: 'Talk title' }),
      body({ x: M, y: 3.55, w: 6.4, h: 0.8, fontFace: F.accent, italic: true, fontSize: 19, color: C.buff80,
             lineSpacingMultiple: 1.1, valign: 'top', prompt: 'Subtitle' }),
    ] },
    'GW Section': { bg: C.gwBlue, dark: true, ph: [
      title({ x: 1, y: 1.85, w: 8, h: 1.7, fontFace: F.displayItalic, italic: F.italicFlag, fontSize: d(48),
              color: C.white, align: 'center', valign: 'middle', prompt: 'Section title' }),
    ] },
    'GW Title and Content': { bg: C.white, rule: true, ph: [
      title({ x: M, y: 0.42, w: SW - 2 * M, h: 0.9, fontSize: d(36), valign: 'bottom', prompt: 'Slide title' }),
      body({ x: M, y: 1.75, w: SW - 2 * M, h: 3.3, valign: 'top', prompt: 'One idea. Four lines at most.' }),
    ] },
    'GW Title Only': { bg: C.white, rule: true, ph: [
      title({ x: M, y: 0.42, w: SW - 2 * M, h: 0.9, fontSize: d(36), valign: 'bottom', prompt: 'Slide title' }),
    ] },
    'GW Big Idea': { bg: C.white, ph: [
      title({ x: 1, y: 1.6, w: 8, h: 2.0, fontSize: d(44), align: 'center', valign: 'middle', prompt: 'The one big idea' }),
    ] },
    'GW Big Idea Dark': { bg: C.navyYard, dark: true, ph: [
      title({ x: 1, y: 1.45, w: 8, h: 2.0, fontSize: d(46), color: C.white, align: 'center', valign: 'middle',
              prompt: 'The closing statement' }),
    ] },
    'GW Blank': { bg: C.white, ph: [] },
    'GW Blank Dark': { bg: C.navyYard, dark: true, ph: [] },
    // Picture placeholders: the presenter clicks the icon (or drags a photo in) and it fills the area
    'GW Photo Split': { bg: C.white, panel: { x: 0, y: 0, w: SW / 2, h: SH, color: C.buff20 }, ph: [
      { type: 'image', name: 'photo', x: 0, y: 0, w: SW / 2, h: SH, prompt: 'Drop a photo here' },
    ] },
    'GW Photo': { bg: C.navyYard, dark: true, ph: [
      { type: 'image', name: 'photo', x: 0, y: 0, w: SW, h: SH, prompt: 'Drop a full-bleed photo here' },
    ] },
  };
}

// ── Deck ─────────────────────────────────────────────────────────────────────
function createDeck({ title = 'GW presentation', author = '', company = 'The George Washington University',
                      fonts = 'brand', pattern = 'chevrons' } = {}) {
  if (!FONTS[fonts]) throw new Error(`fonts must be 'brand' or 'substitutes'`);
  if (![null, 'chevrons', 'stars'].includes(pattern)) throw new Error(`pattern must be 'chevrons', 'stars', or null`);
  const F = FONTS[fonts];
  const d = (pt) => Math.round(pt * F.scale);
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  Object.assign(pptx, { title, author, company });
  pptx.theme = { headFontFace: F.display, bodyFontFace: F.body };

  const specs = {};
  function defineLayout(name, spec) {
    // spec: { bg: hex, dark?: bool, rule?: bool, panel?: { x, y, w, h, color },
    //         ph: [{ type: 'title'|'body'|'image', name, x, y, w, h, prompt, …text options }] }
    if (specs[name]) throw new Error(`layout '${name}' already exists`);
    const objects = [];
    if (spec.panel) objects.push({ rect: { x: spec.panel.x, y: spec.panel.y, w: spec.panel.w, h: spec.panel.h,
                                           fill: { color: spec.panel.color }, line: { type: 'none' } } });
    if (spec.rule) objects.push({ rect: { x: M, y: 1.4, w: 0.62, h: 0.03, fill: { color: C.gwBuff }, line: { type: 'none' } } });
    for (const p of spec.ph) {
      const { prompt, ...options } = p;
      objects.push({ placeholder: { options, text: prompt } });
    }
    pptx.defineSlideMaster({ title: name, background: { color: spec.bg }, objects });
    specs[name] = spec;
  }
  for (const [name, spec] of Object.entries(layoutSpecs(F))) defineLayout(name, spec);

  const svgSources = new Map();   // SVG text (no prolog) → temp file, for the PNG fallbacks
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gw-pptx-'));
  let count = 0;

  // ── low-level helpers ──
  const text = (sl, t, o) => sl.addText(t, { margin: 0, fit: 'none', ...o });
  const ph = (sl, name, t, o = {}) => sl.addText(runs(t, o.italicRuns), { placeholder: name });
  function runs(t, italicRuns) {
    // A string, or an array of strings / { text, italic } runs. Italic display runs use the
    // separate Gazzetta Slanted family in brand mode (never a synthetic slant).
    if (typeof t === 'string') return t;
    return t.map((r) => typeof r === 'string' ? { text: r } : r.italic && italicRuns
      ? { text: r.text, options: { fontFace: F.displayItalic, italic: F.italicFlag, breakLine: r.breakLine } }
      : { text: r.text, options: { breakLine: r.breakLine } });
  }
  function svg(sl, file, fill, box) {
    let markup = fs.readFileSync(file, 'utf8');
    if (fill) markup = markup.replace(/(fill\s*[:=]\s*"?)#[0-9A-Fa-f]{3,6}/g, `$1#${fill}`);
    const key = markup.replace(/^\s*<\?xml[^>]*\?>\s*/, '').trim();
    if (!svgSources.has(key)) {
      const out = path.join(tmp, `svg-${svgSources.size}.svg`);
      fs.writeFileSync(out, markup);
      svgSources.set(key, out);
    }
    sl.addImage({ path: svgSources.get(key), ...box });
  }
  function ribbon(sl, color = C.gwBuff) {
    const name = color === C.gwBuff ? 'gw-buff' : color === C.gwBlue ? 'gw-blue' : 'potomac';
    for (let i = 0; i < RIBBON_TILES; i++) {
      svg(sl, path.join(ASSETS, 'chevrons', 'ribbon', `${name}.svg`), null,
          { x: i * RIBBON_W, y: SH - RIBBON_H, w: RIBBON_W, h: RIBBON_H, altText: i ? '' : 'GW chevron ribbon' });
    }
  }
  function stars(sl, bg, edge = 'right') {
    const png = starPatternPng(tmp, STAR_ON[bg], bg, edge);
    sl.addImage({ path: png, x: edge === 'right' ? SW * 0.45 : 0, y: 0, w: SW * 0.55, h: SH, altText: '' });
  }
  function logo(sl, dark, corner) {
    // corner: 'top-left' | 'bottom-left' | 'bottom-right' — always away from the pattern
    const y = corner.startsWith('top') ? LOGO_M : SH - LOGO_M - LOGO_H;
    const x = corner.endsWith('right') ? SW - LOGO_M - LOGO_W : LOGO_M;
    sl.addImage({ path: dark ? LOGO_REV : LOGO_LIGHT, x, y, w: LOGO_W, h: LOGO_H, altText: 'GW Engineering' });
  }
  function add(layout) { count++; return pptx.addSlide({ masterName: layout }); }

  // ── slide builders (one per pattern in references/layouts.md) ──
  const deck = {
    pptx, colors: C, fonts: F, size: { w: SW, h: SH, margin: M },
    /** Display font size for this font mode: d(36) is 36 pt with Gazzetta, 29 pt with Barlow Condensed. */
    d,
    /** Add a custom layout (same spec shape as the built-in ones) before using it with slide(). */
    defineLayout,

    /** A. Cover. Logo and the deck's pattern are added automatically. */
    cover({ eyebrow, title, subtitle, byline }) {
      const sl = add('GW Cover');
      if (pattern === 'stars') stars(sl, C.navyYard);
      if (pattern === 'chevrons') ribbon(sl);
      logo(sl, true, 'top-left');   // the byline and the bottom edge stay clear
      if (eyebrow) text(sl, eyebrow.toUpperCase(), { x: M, y: 1.15, w: 6.4, h: 0.3, fontFace: F.body, fontSize: 12,
        bold: true, color: C.gwBuff, charSpacing: 2 });
      ph(sl, 'title', title, { italicRuns: true });
      if (subtitle) ph(sl, 'body', subtitle);
      if (byline) text(sl, byline, { x: M, y: 4.5, w: 6.4, h: 0.35, fontFace: F.body, fontSize: 15, color: C.white });
      return sl;
    },

    /** B. Big Idea. dark: true for the closing variant. */
    bigIdea({ text: phrase, gloss, dark = false }, decorate) {
      const sl = add(dark ? 'GW Big Idea Dark' : 'GW Big Idea');
      if (decorate) decorate(sl);   // pattern and logo go under the text
      sl.addShape(pptx.ShapeType.rect, { x: SW / 2 - 0.39, y: 1.25, w: 0.78, h: 0.025, fill: { color: C.gwBuff }, line: { type: 'none' } });
      ph(sl, 'title', phrase, { italicRuns: true });
      if (gloss) text(sl, gloss, { x: 1, y: 3.6, w: 8, h: 0.45, fontFace: F.accent, italic: true, fontSize: 18,
        color: dark ? C.gwBuff : C.gwBlue, align: 'center' });
      return sl;
    },

    /** E. Stat Callout: 1–3 stats. A chevron chip anchors a single stat in a chevron deck. */
    stat({ stats, gloss, source }) {
      if (!stats || stats.length < 1 || stats.length > 3) throw new Error('stat() takes 1–3 stats');
      const sl = add('GW Blank');
      const colW = (SW - 2 * M) / stats.length;
      stats.forEach((s, i) => {
        const x = M + i * colW;
        if (stats.length === 1 && pattern === 'chevrons') {
          // beside a ~3-character number centered on the slide
          svg(sl, path.join(ASSETS, 'chevrons', 'chip', 'gw-buff.svg'), null, { x: SW / 2 - 1.75, y: 1.62, w: 0.66, h: 0.88, altText: '' });
        }
        text(sl, s.value, { x, y: 1.25, w: colW, h: 1.35, fontFace: F.display, bold: F.displayBold, fontSize: d(96),
          color: s.color === 'potomac' ? C.potomac : C.gwBlue, align: 'center', valign: 'bottom' });
        text(sl, s.label.toUpperCase(), { x: x + 0.3, y: 2.7, w: colW - 0.6, h: 0.65, fontFace: F.body, fontSize: 14,
          bold: true, color: C.gwBlue, align: 'center', valign: 'top', charSpacing: 1 });
        if (i > 0) sl.addShape(pptx.ShapeType.rect, { x: x - 0.01, y: 1.45, w: 0.02, h: 1.6, fill: { color: C.buff50 }, line: { type: 'none' } });
      });
      if (gloss) text(sl, gloss, { x: 1, y: 3.55, w: 8, h: 0.45, fontFace: F.accent, italic: true, fontSize: 18,
        color: C.gwBlue, align: 'center' });
      if (source) text(sl, source, { x: M, y: SH - 0.6, w: SW - 2 * M, h: 0.3, fontFace: F.body, fontSize: 10,
        color: C.caption, align: 'center' });
      return sl;
    },

    /** G. Section Divider. */
    divider({ label, title }) {
      const sl = add('GW Section');
      if (pattern === 'stars') stars(sl, C.gwBlue);
      if (pattern === 'chevrons') ribbon(sl);
      if (label) text(sl, label.toUpperCase(), { x: 1, y: 1.4, w: 8, h: 0.3, fontFace: F.body, fontSize: 12, bold: true,
        color: C.gwBuff, align: 'center', charSpacing: 3 });
      ph(sl, 'title', title);
      return sl;
    },

    /** F. Tiled Content: 2–4 tiles of { label, body }, with an optional title. */
    tiles({ title, tiles }) {
      if (!tiles || tiles.length < 2 || tiles.length > 4) throw new Error('tiles() takes 2–4 tiles');
      const sl = add(title ? 'GW Title Only' : 'GW Blank');
      if (title) ph(sl, 'title', title);
      const gap = 0.22, top = title ? 1.75 : 1.2, h = SH - top - 0.75;
      const w = (SW - 2 * M - gap * (tiles.length - 1)) / tiles.length;
      tiles.forEach((t, i) => {
        const x = M + i * (w + gap);
        sl.addShape(pptx.ShapeType.rect, { x, y: top, w, h, fill: { color: C.buff20 }, line: { type: 'none' } });
        sl.addShape(pptx.ShapeType.rect, { x, y: top, w, h: 0.05, fill: { color: C.gwBuff }, line: { type: 'none' } });
        text(sl, t.label.toUpperCase(), { x: x + 0.22, y: top + 0.3, w: w - 0.44, h: 0.3, fontFace: F.body, fontSize: 13,
          bold: true, color: C.gwBlue, charSpacing: 1 });   // GW Blue: Potomac on Buff 20% fails AA at this size
        text(sl, t.body, { x: x + 0.22, y: top + 0.72, w: w - 0.44, h: h - 0.95, fontFace: F.body, fontSize: 15,
          color: C.body, valign: 'top', lineSpacingMultiple: 1.35 });
      });
      return sl;
    },

    /** I. Standard Content: a title and short prose, or up to 4 bullets (array). */
    content({ title, body }) {
      if (Array.isArray(body) && body.length > 4) throw new Error('content() lists take at most 4 items');
      const sl = add('GW Title and Content');
      ph(sl, 'title', title);
      sl.addText(Array.isArray(body) ? body.map((b) => ({ text: b, options: { bullet: { indent: 18 }, breakLine: true } })) : body,
        { placeholder: 'body' });
      return sl;
    },

    /** D. Split: a photo (path), a photo placeholder to fill later, or a plain panel on one side;
     *  eyebrow/title/body on the other. Break the title with \n; the rule and body follow its lines. */
    split({ eyebrow, title, body, image, imageAlt = '', photoPlaceholder = false, visualBg = C.buff20, imageLeft = true }) {
      if (photoPlaceholder && !imageLeft) throw new Error('photoPlaceholder puts the photo on the left');
      const sl = add(photoPlaceholder ? 'GW Photo Split' : 'GW Blank');
      const vx = imageLeft ? 0 : SW / 2, tx = imageLeft ? SW / 2 + 0.5 : M, tw = SW / 2 - 1;
      if (photoPlaceholder) sl.addText('', { placeholder: 'photo' });   // the empty picture placeholder
      else if (image) sl.addImage({ path: image, x: vx, y: 0, w: SW / 2, h: SH, sizing: { type: 'cover', w: SW / 2, h: SH }, altText: imageAlt });
      else sl.addShape(pptx.ShapeType.rect, { x: vx, y: 0, w: SW / 2, h: SH, fill: { color: visualBg }, line: { type: 'none' } });
      const lines = String(title).split('\n').length;
      const titleH = 0.62 * lines * F.scale + 0.1, top = 1.25 + (3 - Math.min(lines, 3)) * 0.22;
      if (eyebrow) text(sl, eyebrow.toUpperCase(), { x: tx, y: top - 0.38, w: tw, h: 0.3, fontFace: F.body, fontSize: 12,
        bold: true, color: C.potomac, charSpacing: 2 });
      text(sl, title, { x: tx, y: top, w: tw, h: titleH, fontFace: F.display, bold: F.displayBold, fontSize: d(34),
        color: C.gwBlue, valign: 'top' });
      const ruleY = top + titleH + 0.15;
      sl.addShape(pptx.ShapeType.rect, { x: tx, y: ruleY, w: 0.62, h: 0.03, fill: { color: C.gwBuff }, line: { type: 'none' } });
      text(sl, body, { x: tx, y: ruleY + 0.22, w: tw, h: SH - ruleY - 0.8, fontFace: F.body, fontSize: 15, color: C.body,
        valign: 'top', lineSpacingMultiple: 1.35 });
      return sl;
    },

    /** C. Full-Bleed Image: a photo (path) or a photo placeholder, with ≤ 12 words on a GW Blue band. */
    image({ image, imageAlt = '', photoPlaceholder = false, text: phrase }) {
      if (!image && !photoPlaceholder) throw new Error('image() needs image or photoPlaceholder: true');
      const sl = add(photoPlaceholder ? 'GW Photo' : 'GW Blank Dark');
      if (photoPlaceholder) sl.addText('', { placeholder: 'photo' });
      else sl.addImage({ path: image, x: 0, y: 0, w: SW, h: SH, sizing: { type: 'cover', w: SW, h: SH }, altText: imageAlt });
      if (phrase) {
        sl.addShape(pptx.ShapeType.rect, { x: 0, y: SH * 0.64, w: SW, h: SH * 0.36, fill: { color: C.gwBlue, transparency: 12 }, line: { type: 'none' } });
        text(sl, phrase, { x: M, y: SH * 0.64 + 0.2, w: SW - 2 * M, h: SH * 0.36 - 0.4, fontFace: F.display, bold: F.displayBold,
          fontSize: d(36), color: C.white, valign: 'middle' });
      }
      return sl;
    },

    /** H. Pull Quote. */
    quote({ quote, attribution, dark = false }) {
      const sl = add(dark ? 'GW Blank Dark' : 'GW Blank');
      if (!dark) sl.background = { color: C.buff20 };
      text(sl, '“', { x: 0.7, y: 0.4, w: 1.2, h: 1.4, fontFace: F.accent, fontSize: 110, color: C.gwBuff });
      text(sl, quote, { x: 1.4, y: 1.4, w: 7.4, h: 2.3, fontFace: F.accent, italic: true, fontSize: 28,
        color: dark ? C.white : C.gwBlue, valign: 'middle' });
      if (attribution) text(sl, `— ${attribution}`, { x: 1.4, y: 3.85, w: 7.4, h: 0.4, fontFace: F.body, fontSize: 14,
        color: dark ? C.gwBuff : C.caption });
      return sl;
    },

    /** Closing slide: dark Big Idea with the logo and the deck's pattern. */
    close({ text: phrase, gloss }) {
      return deck.bigIdea({ text: phrase, gloss, dark: true }, (sl) => {
        if (pattern === 'stars') stars(sl, C.navyYard, 'left');   // mirrors the cover
        if (pattern === 'chevrons') ribbon(sl);
        logo(sl, true, pattern === 'stars' ? 'bottom-right' : 'top-left');
      });
    },

    /** Any GW layout, for slides the builders don't cover. Returns the PptxGenJS slide. */
    slide(layout = 'GW Blank') {
      if (!specs[layout]) throw new Error(`unknown layout '${layout}'; choose from ${Object.keys(specs).join(', ')}`);
      return add(layout);
    },

    /** Write the file, then make it fully GW: theme colors, layout fixes, real SVG fallbacks. */
    async save(file) {
      const zip = await JSZip.loadAsync(await pptx.write({ outputType: 'nodebuffer' }));
      await gwTheme(zip);
      await fixLayouts(zip, specs);
      await fixSlidePictures(zip);
      await svgFallbacks(zip, svgSources, tmp);
      fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
      fs.writeFileSync(file, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
      fs.rmSync(tmp, { recursive: true, force: true });
      return { file, slides: count };
    },
  };
  return deck;
}

// ── Post-processing ──────────────────────────────────────────────────────────
async function gwTheme(zip) {
  // PptxGenJS always writes the Office palette; the GW palette makes PowerPoint's color
  // picker, new shapes, tables, and charts default to brand colors.
  const file = 'ppt/theme/theme1.xml';
  const scheme = '<a:clrScheme name="GW">' +
    `<a:dk1><a:srgbClr val="${C.body}"/></a:dk1><a:lt1><a:srgbClr val="${C.white}"/></a:lt1>` +
    `<a:dk2><a:srgbClr val="${C.gwBlue}"/></a:dk2><a:lt2><a:srgbClr val="${C.buff20}"/></a:lt2>` +
    [C.gwBlue, C.gwBuff, C.potomac, C.navyYard, C.potomac50, C.buff50]
      .map((c, i) => `<a:accent${i + 1}><a:srgbClr val="${c}"/></a:accent${i + 1}>`).join('') +
    `<a:hlink><a:srgbClr val="${C.potomac}"/></a:hlink><a:folHlink><a:srgbClr val="${C.gwBlue}"/></a:folHlink></a:clrScheme>`;
  let xml = await zip.file(file).async('string');
  const next = xml.replace(/<a:clrScheme[\s\S]*?<\/a:clrScheme>/, scheme)
                  .replace(/<a:fontScheme name="[^"]*"/, '<a:fontScheme name="GW"')
                  .replace(/<a:theme([^>]*) name="[^"]*"/, '<a:theme$1 name="GW"');
  if (next === xml) throw new Error('theme color scheme not found');
  zip.file(file, next);
}

async function fixLayouts(zip, specs) {
  const layoutFiles = Object.keys(zip.files).filter((f) => /^ppt\/slideLayouts\/slideLayout\d+\.xml$/.test(f));
  for (const f of layoutFiles) {
    let xml = await zip.file(f).async('string');
    const name = (xml.match(/<p:cSld name="([^"]*)"/) || [])[1];
    if (name === 'DEFAULT') { await dropLayout(zip, f); continue; }
    const spec = specs[name];
    if (!spec) continue;
    // Dark layouts: map text to light colors, so text a presenter adds is readable.
    if (spec.dark) {
      xml = xml.replace(/<p:clrMapOvr>[\s\S]*?<\/p:clrMapOvr>/, '')
               .replace('</p:cSld>', '</p:cSld><p:clrMapOvr><a:overrideClrMapping bg1="dk1" tx1="lt1" bg2="dk2" tx2="lt2" ' +
                 'accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" ' +
                 'hlink="hlink" folHlink="folHlink"/></p:clrMapOvr>');
    }
    // Picture placeholders: PptxGenJS drops type="pic" (it looks up the mapped value as a key).
    if (spec.ph.some((p) => p.type === 'image')) xml = xml.replace(/<p:ph(\s+idx="\d+")\s+hasCustomPrompt/g, '<p:ph$1 type="pic" hasCustomPrompt');
    // Placeholders: carry vertical alignment and zero insets into the layout (PptxGenJS sets
    // them only on its own slides), so placeholders on hand-added slides line up the same way.
    for (const p of spec.ph) {
      const anchor = { top: 't', middle: 'ctr', bottom: 'b' }[p.valign];
      const re = new RegExp(`(<p:ph[^>]*type="${p.type}"[^>]*/>[\\s\\S]*?<a:bodyPr)([^>]*)>`);
      xml = xml.replace(re, (m, head, attrs) => {
        const kept = attrs.replace(/\s(anchor|[lrtb]Ins)="[^"]*"/g, '');
        return `${head}${kept} lIns="0" tIns="0" rIns="0" bIns="0"${anchor ? ` anchor="${anchor}"` : ''}>`;
      });
    }
    zip.file(f, xml);
  }
}

async function fixSlidePictures(zip) {
  // Same PptxGenJS bug on slides: an empty picture placeholder comes out with no type, so
  // PowerPoint shows a generic box instead of "click to add picture".
  for (const f of Object.keys(zip.files).filter((x) => /^ppt\/slides\/slide\d+\.xml$/.test(x))) {
    const xml = await zip.file(f).async('string');
    const next = xml.replace(/<p:ph(\s+idx="\d+")\s+hasCustomPrompt/g, '<p:ph$1 type="pic" hasCustomPrompt');
    if (next !== xml) zip.file(f, next);
  }
}

async function dropLayout(zip, f) {
  // PptxGenJS always writes an unused "DEFAULT" layout; remove it from the New Slide menu.
  const base = path.posix.basename(f);
  const slideRels = Object.keys(zip.files).filter((r) => /^ppt\/slides\/_rels\/.*\.rels$/.test(r));
  for (const r of slideRels) {
    if ((await zip.file(r).async('string')).includes(`slideLayouts/${base}"`)) return;   // in use: keep it
  }
  const masterRels = 'ppt/slideMasters/_rels/slideMaster1.xml.rels';
  let rels = await zip.file(masterRels).async('string');
  const rid = (rels.match(new RegExp(`Id="(rId\\d+)"[^>]*Target="\\.\\./slideLayouts/${base}"`)) || [])[1];
  if (!rid) return;
  zip.file(masterRels, rels.replace(new RegExp(`<Relationship[^>]*Id="${rid}"[^>]*/>`), ''));
  const master = 'ppt/slideMasters/slideMaster1.xml';
  zip.file(master, (await zip.file(master).async('string')).replace(new RegExp(`<p:sldLayoutId[^>]*r:id="${rid}"[^>]*/>`), ''));
  const types = '[Content_Types].xml';
  zip.file(types, (await zip.file(types).async('string')).replace(new RegExp(`<Override[^>]*PartName="/${f}"[^>]*/>`), ''));
  zip.remove(f);
  zip.remove(`ppt/slideLayouts/_rels/${base}.rels`);
}

async function svgFallbacks(zip, sources, tmp) {
  // PptxGenJS can't rasterize SVGs in Node and writes a broken-image PNG as each SVG's
  // fallback; viewers without SVG support show that. Swap in real renders.
  const byKey = sources;
  const cache = new Map();
  const relFiles = Object.keys(zip.files).filter((f) => /^ppt\/slides\/_rels\/slide\d+\.xml\.rels$/.test(f));
  for (const rf of relFiles) {
    const rels = [...(await zip.file(rf).async('string')).matchAll(/Id="rId(\d+)"[^>]*Target="\.\.\/media\/([^"]+)"/g)]
      .map((m) => ({ id: +m[1], file: m[2] }));
    for (const r of rels.filter((x) => x.file.endsWith('.svg'))) {
      const png = rels.find((p) => p.id === r.id - 1 && p.file.endsWith('.png'));
      if (!png) continue;
      const key = (await zip.file(`ppt/media/${r.file}`).async('string')).replace(/^\s*<\?xml[^>]*\?>\s*/, '').trim();
      const src = byKey.get(key);
      if (!src) continue;
      if (!cache.has(src)) cache.set(src, rasterizeSvg(src, tmp));
      zip.file(`ppt/media/${png.file}`, cache.get(src));
    }
  }
}

// ── Chrome rasterizing ───────────────────────────────────────────────────────
function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const candidates = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  const found = candidates.find((c) => fs.existsSync(c));
  if (!found) throw new Error('Chrome not found; set CHROME=/path/to/chrome');
  return found;
}

function screenshot(html, pngPath, w, h, tmp) {
  const page = path.join(tmp, `page-${path.basename(pngPath, '.png')}.html`);
  fs.writeFileSync(page, html);
  for (let attempt = 1; attempt <= 3; attempt++) {
    const profile = fs.mkdtempSync(path.join(tmp, 'profile-'));   // a shared profile can hang Chrome
    try {
      execFileSync(findChrome(), ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${profile}`,
        '--no-first-run', '--no-default-browser-check', '--default-background-color=00000000',
        '--force-device-scale-factor=2', '--virtual-time-budget=3000',   // let data: images decode first
        `--window-size=${w},${h}`, `--screenshot=${pngPath}`, `file://${page}`],
        { stdio: 'ignore', timeout: 45000 });
      return pngPath;
    } catch (e) {
      if (attempt === 3) throw new Error(`Chrome failed to render ${pngPath}: ${e.message}`);
    } finally {
      fs.rmSync(profile, { recursive: true, force: true });
    }
  }
}

function rasterizeSvg(svgFile, tmp) {
  const markup = fs.readFileSync(svgFile, 'utf8');
  const vb = (markup.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/) || []).slice(1).map(Number);
  const w = 600, h = Math.round(w * (vb[1] || 1) / (vb[0] || 1));
  const b64 = Buffer.from(markup).toString('base64');
  const png = path.join(tmp, `${path.basename(svgFile, '.svg')}.png`);
  return fs.readFileSync(screenshot(`<!doctype html><body style="margin:0;background:transparent">` +
    `<img src="data:image/svg+xml;base64,${b64}" style="display:block;width:${w}px;height:${h}px">`, png, w, h, tmp));
}

function starPatternPng(tmp, fill, bg, edge) {
  // The star SVGs repeat a <pattern> and fade with a CSS mask — neither survives PowerPoint's
  // SVG import, so render the finished texture (tone-on-tone color, fade) to a PNG. The slide
  // color is baked in: a transparent render loses the faint tone-on-tone stars.
  const png = path.join(tmp, `stars-${fill}-${edge}.png`);
  if (fs.existsSync(png)) return png;
  let markup = fs.readFileSync(path.join(ASSETS, 'battle-flag', 'gw-blue.svg'), 'utf8');
  const hex = { 'gw-blue': C.gwBlue, 'navy-yard': C.navyYard, 'gw-buff-20': C.buff20 }[fill];
  markup = markup.replace(/(fill\s*[:=]\s*"?)#[0-9A-Fa-f]{3,6}/g, `$1#${hex}`);
  const b64 = Buffer.from(markup.replace(/^\s*<\?xml[^>]*\?>\s*/, '')).toString('base64');
  const dir = edge === 'right' ? 'to left' : 'to right';
  const w = 704, h = 720;   // 55% of a 1280×720 slide
  return screenshot(`<!doctype html><body style="margin:0;background:#${bg}">` +
    `<div style="width:${w}px;height:${h}px;background-image:url(data:image/svg+xml;base64,${b64});` +
    `background-size:540px 360px;-webkit-mask-image:linear-gradient(${dir},#000 30%,transparent 100%)"></div>`,
    png, w, h, tmp);
}

function requireFromCwd(name) {
  // Resolve npm packages from the folder the deck script runs in (where `npm install pptxgenjs` was run).
  try {
    return require(require.resolve(name, { paths: [process.cwd()] }));
  } catch (e) {
    throw new Error(`Cannot load '${name}'. Run \`npm install pptxgenjs\` in ${process.cwd()} first.`);
  }
}

module.exports = { createDeck, colors: C, layouts: Object.keys(layoutSpecs(FONTS.brand)) };
