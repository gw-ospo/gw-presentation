// SPDX-FileCopyrightText: 2026 Lorena A. Barba
// SPDX-License-Identifier: BSD-3-Clause
/**
 * build-pptx.js  (v2 — fixed layout)
 * Generates skill-workflow.pptx using PptxGenJS.
 * Works in inches directly (10" × 5.625" slides) for reliable layout.
 */

const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_16x9'; // 10" × 5.625"

// ── Brand Colors (no # prefix, ever) ─────────────────────────────────────
const C = {
  navyYard:  '00223E',
  gwBlue:    '033C5A',
  gwBuff:    'D6BF91',
  gwBuff80:  'DAC8A3',
  gwBuff50:  'E8DDC6',
  gwBuff20:  'F6F1E8',
  potomac:   '0075C8',
  potomac80: '3391D3',
  potomac50: '7FBAE3',
  potomac20: 'CCE3F4',
  white:     'FFFFFF',
  dark:      '1E1E1E',
  mid:       '333333',
  muted:     '666666',
  lightGray: 'E8E8E8',
};

// ── Fonts ─────────────────────────────────────────────────────────────────
const F = { head: 'Georgia', body: 'Trebuchet MS' };

// ── Slide dimensions ──────────────────────────────────────────────────────
const SW = 10;      // width inches
const SH = 5.625;   // height inches

// ── Chevron ribbon helper ─────────────────────────────────────────────────
// Approximates the CSS chevron pattern with alternating rect segments
function addChevronRibbon(sl, y, h, col1, col2) {
  const segW = 0.22;
  const count = Math.ceil(SW / (segW * 2)) + 2;
  for (let i = -1; i < count; i++) {
    sl.addShape(pptx.ShapeType.rect, { x: i*segW*2,        y, w: segW, h, fill:{color:col1}, line:{type:'none'} });
    sl.addShape(pptx.ShapeType.rect, { x: i*segW*2+segW,   y, w: segW, h, fill:{color:col2}, line:{type:'none'} });
  }
}

// ══════════════════════════════════════════════════════════════════════════
// SLIDE 1 — Cover
// ══════════════════════════════════════════════════════════════════════════
{
  const sl = pptx.addSlide();

  // Navy Yard solid background
  sl.addShape(pptx.ShapeType.rect, { x:0, y:0, w:SW, h:SH, fill:{color:C.navyYard}, line:{type:'none'} });

  // Left accent bar (GW Buff, thin vertical)
  sl.addShape(pptx.ShapeType.rect, { x:0.5, y:0.5, w:0.04, h:3.2, fill:{color:C.gwBuff}, line:{type:'none'} });

  // Eyebrow
  sl.addText('George Washington University  ·  A Workflow Story', {
    x:0.65, y:0.55, w:8, h:0.3,
    fontFace:F.body, fontSize:11, bold:true, charSpacing:2,
    color:C.gwBuff, align:'left', valign:'middle',
  });

  // Title
  sl.addText('From Webpage\nto Skill', {
    x:0.65, y:1.0, w:7.5, h:2.0,
    fontFace:F.head, fontSize:52, bold:true,
    color:C.white, align:'left', valign:'top',
    lineSpacingMultiple:1.1,
  });

  // Subtitle
  sl.addText(
    'How Claude read the brand guidelines and learned to design presentations in the GWU style \u2014 without being asked twice.',
    {
      x:0.65, y:3.15, w:6, h:1.1,
      fontFace:F.head, fontSize:16, italic:true,
      color:C.gwBuff80, align:'left', valign:'top',
      lineSpacingMultiple:1.5,
    }
  );

  // Byline
  sl.addText('Lorena A. Barba  \u00b7  April 2026', {
    x:0.5, y:5.05, w:4, h:0.3,
    fontFace:F.body, fontSize:12, color:C.gwBuff80, align:'left', valign:'middle',
  });

  // Subtle chevron ribbon at bottom
  addChevronRibbon(sl, SH-0.07, 0.07, 'D6BF91', '00223E');
}


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 2 — Big Idea
// ══════════════════════════════════════════════════════════════════════════
{
  const sl = pptx.addSlide();

  // White background
  sl.addShape(pptx.ShapeType.rect, { x:0, y:0, w:SW, h:SH, fill:{color:C.white}, line:{type:'none'} });

  // Top buff rule
  sl.addShape(pptx.ShapeType.rect, { x:4.6, y:1.1, w:0.8, h:0.03, fill:{color:C.gwBuff}, line:{type:'none'} });

  // Big idea text
  sl.addText(
    'The work isn\u2019t the slides.\nIt\u2019s teaching Claude to make them.',
    {
      x:0.8, y:1.25, w:8.4, h:2.8,
      fontFace:F.head, fontSize:44, bold:true,
      color:C.gwBlue, align:'center', valign:'middle',
      lineSpacingMultiple:1.25,
    }
  );

  // Bottom buff rule
  sl.addShape(pptx.ShapeType.rect, { x:4.6, y:4.4, w:0.8, h:0.03, fill:{color:C.gwBuff}, line:{type:'none'} });

  // Chevron ribbon at bottom
  addChevronRibbon(sl, SH-0.07, 0.07, C.gwBlue, C.gwBuff);
}


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 3 — The Challenge (split)
// ══════════════════════════════════════════════════════════════════════════
{
  const sl = pptx.addSlide();

  // Left panel: GW Blue
  sl.addShape(pptx.ShapeType.rect, { x:0, y:0, w:3.75, h:SH, fill:{color:C.gwBlue}, line:{type:'none'} });
  // Right panel: white
  sl.addShape(pptx.ShapeType.rect, { x:3.75, y:0, w:6.25, h:SH, fill:{color:C.white}, line:{type:'none'} });

  // ── Browser mockup (left panel) ──
  const bx=0.3, by=0.6, bw=3.15, bh=3.5;

  // Browser frame
  sl.addShape(pptx.ShapeType.roundRect, { x:bx, y:by, w:bw, h:bh, fill:{color:'F0F0F0'}, line:{color:'CCCCCC',pt:1}, rectRadius:0.06 });
  // Browser chrome
  sl.addShape(pptx.ShapeType.rect, { x:bx, y:by, w:bw, h:0.35, fill:{color:'E0E0E0'}, line:{type:'none'} });
  // Traffic light dots
  [[0.12,'FF5F57'],[0.23,'FFBC2E'],[0.34,'28C840']].forEach(([ox,col]) => {
    sl.addShape(pptx.ShapeType.ellipse, { x:bx+ox, y:by+0.12, w:0.09, h:0.09, fill:{color:col}, line:{type:'none'} });
  });
  // URL bar
  sl.addShape(pptx.ShapeType.roundRect, { x:bx+0.48, y:by+0.06, w:bw-0.58, h:0.23, fill:{color:C.white}, line:{color:'DDDDDD',pt:1}, rectRadius:0.02 });
  sl.addText('communications.gwu.edu/brand-guidelines', { x:bx+0.52, y:by+0.07, w:bw-0.7, h:0.21, fontFace:'Courier New', fontSize:6, color:'555555', align:'left', valign:'middle' });

  // Browser content
  const cy = by+0.35;
  // Header bar
  sl.addShape(pptx.ShapeType.roundRect, { x:bx+0.1, y:cy+0.12, w:bw-0.2, h:0.55, fill:{color:C.navyYard}, line:{type:'none'}, rectRadius:0.03 });
  sl.addText('GW Brand Guidelines', { x:bx+0.2, y:cy+0.18, w:bw-0.4, h:0.43, fontFace:F.body, fontSize:10, bold:true, color:C.white, align:'left', valign:'middle' });

  // Text stubs
  const lx=bx+0.1, lw=bw-0.2;
  [[0.8,0.82],[1.0,0.6]].forEach(([dy,r]) => {
    sl.addShape(pptx.ShapeType.roundRect, { x:lx, y:cy+dy, w:lw*r, h:0.08, fill:{color:C.lightGray}, line:{type:'none'}, rectRadius:0.02 });
  });
  // Color swatches
  const swY=cy+1.25;
  [C.gwBlue,C.gwBuff,C.potomac,C.navyYard,'EF4343'].forEach((col,i) => {
    sl.addShape(pptx.ShapeType.roundRect, { x:lx+i*0.27, y:swY, w:0.22, h:0.22, fill:{color:col}, line:{type:'none'}, rectRadius:0.02 });
  });
  // More text stubs
  [[1.65,0.82],[1.85,0.45],[2.05,0.82],[2.25,0.6]].forEach(([dy,r]) => {
    sl.addShape(pptx.ShapeType.roundRect, { x:lx, y:cy+dy, w:lw*r, h:0.08, fill:{color:C.lightGray}, line:{type:'none'}, rectRadius:0.02 });
  });

  // Caption
  sl.addText('communications.gwu.edu/brand-guidelines', { x:bx, y:by+bh+0.12, w:bw, h:0.28, fontFace:F.body, fontSize:10, color:C.gwBuff80, align:'center', valign:'middle' });

  // ── Right panel content ──
  const rx=4.1, rw=5.6;

  // Title
  sl.addText('GWU refreshed its brand.', {
    x:rx, y:0.65, w:rw, h:1.1,
    fontFace:F.head, fontSize:36, bold:true,
    color:C.gwBlue, align:'left', valign:'top', lineSpacingMultiple:1.2,
  });
  // Buff rule
  sl.addShape(pptx.ShapeType.rect, { x:rx, y:1.8, w:0.62, h:0.03, fill:{color:C.gwBuff}, line:{type:'none'} });

  // Body paras
  const paras = [
    { t:'New colors. New typefaces. New graphic elements drawn from campus architecture and the DC flag.', col:C.dark },
    { t:'The guidelines live on three web pages \u2014 detailed, thoughtful, and written for designers, not for an AI.', col:C.dark },
    { t:'The question was how to get that knowledge into Claude\u2019s hands, permanently and precisely.', col:C.potomac, bold:true },
  ];
  let py = 1.92;
  paras.forEach(p => {
    sl.addText(p.t, { x:rx, y:py, w:rw, h:1.0, fontFace:F.body, fontSize:15, bold:p.bold||false, color:p.col, align:'left', valign:'top', lineSpacingMultiple:1.6 });
    py += 1.05;
  });
}


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 4 — Step 1: Claude on Chrome
// ══════════════════════════════════════════════════════════════════════════
{
  const sl = pptx.addSlide();

  // Left panel: white (full background)
  sl.addShape(pptx.ShapeType.rect, { x:0, y:0, w:SW, h:SH, fill:{color:C.white}, line:{type:'none'} });
  // Right panel: Potomac
  sl.addShape(pptx.ShapeType.rect, { x:6.8, y:0, w:3.2, h:SH, fill:{color:C.potomac}, line:{type:'none'} });

  // ── Left ──
  const lx=0.5, lw=6.0;

  // Step badge
  sl.addShape(pptx.ShapeType.ellipse, { x:lx, y:0.38, w:0.38, h:0.38, fill:{color:C.gwBuff}, line:{type:'none'} });
  sl.addText('1', { x:lx, y:0.38, w:0.38, h:0.38, fontFace:F.head, fontSize:18, bold:true, color:C.gwBlue, align:'center', valign:'middle' });
  sl.addText('EXTRACT', { x:lx+0.48, y:0.44, w:1.5, h:0.26, fontFace:F.body, fontSize:11, bold:true, charSpacing:2, color:C.gwBuff80, align:'left', valign:'middle' });

  // Title
  sl.addText('Claude on Chrome\nread the guidelines.', {
    x:lx, y:0.88, w:lw, h:1.35,
    fontFace:F.head, fontSize:36, bold:true,
    color:C.gwBlue, align:'left', valign:'top', lineSpacingMultiple:1.15,
  });
  // Buff rule
  sl.addShape(pptx.ShapeType.rect, { x:lx, y:2.28, w:0.62, h:0.03, fill:{color:C.gwBuff}, line:{type:'none'} });

  // Body 1
  sl.addText(
    'Using Claude\u2019s browser extension, three pages of brand documentation were visited and distilled \u2014 keeping only what a slide designer needs: colors, type, and graphic elements.',
    { x:lx, y:2.38, w:lw, h:1.3, fontFace:F.body, fontSize:14, color:C.dark, align:'left', valign:'top', lineSpacingMultiple:1.55 }
  );

  // Body 2
  sl.addText(
    'No copy-pasting. No manual transcription. Claude read the pages and produced structured Markdown files, ready to use.',
    { x:lx, y:3.78, w:lw, h:0.75, fontFace:F.body, fontSize:14, color:C.potomac, align:'left', valign:'top', lineSpacingMultiple:1.55 }
  );

  // ── Right panel ──
  const rx=6.95, rw=2.9;

  // Chrome icon box
  sl.addShape(pptx.ShapeType.roundRect, { x:rx+0.95, y:0.38, w:0.9, h:0.9, fill:{color:'FFFFFF',transparency:80}, line:{type:'none'}, rectRadius:0.12 });
  sl.addText('\u25CE', { x:rx+0.95, y:0.38, w:0.9, h:0.9, fontFace:'Arial', fontSize:30, color:C.white, align:'center', valign:'middle' });
  sl.addText('Claude on Chrome', { x:rx, y:1.35, w:rw, h:0.3, fontFace:F.body, fontSize:12, bold:true, color:C.white, align:'center', valign:'middle' });

  // Arrow
  sl.addText('\u2193', { x:rx, y:1.7, w:rw, h:0.28, fontFace:'Arial', fontSize:18, color:C.gwBuff80, align:'center', valign:'middle' });

  // Pill 1
  sl.addShape(pptx.ShapeType.roundRect, { x:rx, y:2.05, w:rw, h:0.7, fill:{color:'FFFFFF',transparency:85}, line:{color:'FFFFFF',transparency:70,pt:1}, rectRadius:0.07 });
  sl.addText('gwu-brand-specs.md', { x:rx+0.12, y:2.1, w:rw-0.2, h:0.28, fontFace:F.body, fontSize:12, bold:true, color:C.white, align:'left', valign:'middle' });
  sl.addText('Colors \u00b7 Typography \u00b7 Accessibility', { x:rx+0.12, y:2.4, w:rw-0.2, h:0.28, fontFace:F.body, fontSize:10, color:C.white, align:'left', valign:'middle' });

  // Pill 2
  sl.addShape(pptx.ShapeType.roundRect, { x:rx, y:2.85, w:rw, h:0.7, fill:{color:'FFFFFF',transparency:85}, line:{color:'FFFFFF',transparency:70,pt:1}, rectRadius:0.07 });
  sl.addText('gwu-graphic-elements-guidelines.md', { x:rx+0.12, y:2.9, w:rw-0.2, h:0.3, fontFace:F.body, fontSize:10, bold:true, color:C.white, align:'left', valign:'top' });
  sl.addText('Chevrons \u00b7 Gate Crossbar \u00b7 Stars', { x:rx+0.12, y:3.2, w:rw-0.2, h:0.28, fontFace:F.body, fontSize:10, color:C.white, align:'left', valign:'middle' });

  // Caption
  sl.addText('Minimal. Structured.\nOnly what matters.', { x:rx, y:3.68, w:rw, h:0.6, fontFace:F.body, fontSize:11, color:C.white, align:'center', valign:'middle', lineSpacingMultiple:1.5 });

  // Chevron ribbon at bottom
  addChevronRibbon(sl, SH-0.07, 0.07, C.gwBlue, C.gwBuff);
}


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 5 — What Was Captured (3 tiles)
// ══════════════════════════════════════════════════════════════════════════
{
  const sl = pptx.addSlide();

  sl.addShape(pptx.ShapeType.rect, { x:0, y:0, w:SW, h:SH, fill:{color:C.white}, line:{type:'none'} });

  // Header
  sl.addText('Three aspects of the brand \u2014 captured precisely.', {
    x:0.5, y:0.35, w:9, h:0.75,
    fontFace:F.head, fontSize:30, bold:true,
    color:C.gwBlue, align:'left', valign:'middle', lineSpacingMultiple:1.2,
  });
  // Buff rule
  sl.addShape(pptx.ShapeType.rect, { x:0.5, y:1.15, w:0.62, h:0.03, fill:{color:C.gwBuff}, line:{type:'none'} });

  // Tiles — generous tile height, compact fonts
  const tileW = 2.88, tileH = 4.1, tileY = 1.12, tileGap = 0.13;
  const tiles = [
    {
      icon:'\u25A0', iconColor:C.gwBlue,
      label:'COLOR SYSTEM',
      body:'10 named brand colors with tints. Exact hex values. WCAG AA\u2013compliant pairings for every background.',
      detail:'GW Blue \u00b7 GW Buff \u00b7 Potomac \u00b7 Navy Yard \u2014 plus five secondary accents.',
    },
    {
      icon:'T', iconColor:C.gwBlue,
      label:'TYPOGRAPHY',
      body:'Three brand typefaces with roles defined. Google Fonts substitutes identified for free use online.',
      detail:'Gazzetta \u2192 Playfair Display\nAvenir Next \u2192 Nunito Sans\nSource Serif \u2192 Source Serif 4',
    },
    {
      icon:'\u25c6', iconColor:C.gwBlue,
      label:'GRAPHIC ELEMENTS',
      body:'Chevrons, Gate Crossbar, and star motifs \u2014 each with specific rules for orientation, color, and placement.',
      detail:'One pattern per slide. Single color only. Consistent throughout the deck.',
    },
  ];

  tiles.forEach((tile, i) => {
    const tx = 0.5 + i * (tileW + tileGap);

    // Tile background
    sl.addShape(pptx.ShapeType.rect, { x:tx, y:tileY, w:tileW, h:tileH, fill:{color:C.gwBuff20}, line:{type:'none'} });
    // Top accent bar
    sl.addShape(pptx.ShapeType.rect, { x:tx, y:tileY, w:tileW, h:0.06, fill:{color:C.gwBuff}, line:{type:'none'} });

    // Icon
    sl.addText(tile.icon, { x:tx+0.2, y:tileY+0.18, w:0.5, h:0.44, fontFace:F.head, fontSize:22, bold:true, color:tile.iconColor, align:'left', valign:'middle' });

    // Label
    sl.addText(tile.label, { x:tx+0.2, y:tileY+0.68, w:tileW-0.4, h:0.3, fontFace:F.body, fontSize:11, bold:true, charSpacing:1, color:C.potomac, align:'left', valign:'middle' });

    // Body
    sl.addText(tile.body, { x:tx+0.2, y:tileY+1.04, w:tileW-0.4, h:1.5, fontFace:F.body, fontSize:13, color:C.dark, align:'left', valign:'top', lineSpacingMultiple:1.5 });

    // Divider
    sl.addShape(pptx.ShapeType.rect, { x:tx+0.2, y:tileY+2.62, w:tileW-0.4, h:0.015, fill:{color:C.gwBuff50}, line:{type:'none'} });

    // Detail
    sl.addText(tile.detail, { x:tx+0.2, y:tileY+2.68, w:tileW-0.4, h:1.28, fontFace:F.body, fontSize:11, color:C.muted, align:'left', valign:'top', lineSpacingMultiple:1.45 });
  });

  // Chevron ribbon at bottom
  addChevronRibbon(sl, SH-0.07, 0.07, C.gwBlue, C.gwBuff);
}


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 6 — Section Divider
// ══════════════════════════════════════════════════════════════════════════
{
  const sl = pptx.addSlide();

  sl.addShape(pptx.ShapeType.rect, { x:0, y:0, w:SW, h:SH, fill:{color:C.gwBlue}, line:{type:'none'} });

  // Step label
  sl.addText('STEP TWO', { x:0, y:1.5, w:SW, h:0.3, fontFace:F.body, fontSize:11, bold:true, charSpacing:3, color:C.gwBuff, align:'center', valign:'middle' });

  // Top rule
  sl.addShape(pptx.ShapeType.rect, { x:4.3, y:1.88, w:1.4, h:0.025, fill:{color:C.gwBuff}, line:{type:'none'} });

  // Main title
  sl.addText('Turning knowledge\ninto a reusable skill', {
    x:0.8, y:2.05, w:8.4, h:2.2,
    fontFace:F.head, fontSize:48, italic:true,
    color:C.white, align:'center', valign:'middle', lineSpacingMultiple:1.25,
  });

  // Bottom rule
  sl.addShape(pptx.ShapeType.rect, { x:4.3, y:4.35, w:1.4, h:0.025, fill:{color:C.gwBuff}, line:{type:'none'} });
}


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 7 — Step 2: Synthesis (split)
// ══════════════════════════════════════════════════════════════════════════
{
  const sl = pptx.addSlide();

  // Left panel: navy yard (3.125")
  sl.addShape(pptx.ShapeType.rect, { x:0, y:0, w:3.1, h:SH, fill:{color:C.navyYard}, line:{type:'none'} });
  // Right panel: white
  sl.addShape(pptx.ShapeType.rect, { x:3.1, y:0, w:6.9, h:SH, fill:{color:C.white}, line:{type:'none'} });

  // ── Left: Input stack ──
  const inputCards = [
    { label:'PREVIOUS SPEC',       text:'OLD-gwu-light-theme.md' },
    { label:'EXTRACTED FROM WEB',  text:'gwu-brand-specs.md' },
    { label:'EXTRACTED FROM WEB',  text:'gwu-graphic-elements-guidelines.md' },
  ];

  let cardY = 0.42;
  inputCards.forEach(card => {
    sl.addShape(pptx.ShapeType.roundRect, { x:0.18, y:cardY, w:2.72, h:0.72, fill:{color:'FFFFFF',transparency:92}, line:{color:C.gwBuff,transparency:75,pt:1}, rectRadius:0.07 });
    sl.addText(card.label, { x:0.32, y:cardY+0.06, w:2.44, h:0.22, fontFace:F.body, fontSize:9, bold:true, charSpacing:1, color:C.gwBuff80, align:'left', valign:'middle' });
    sl.addText(card.text,  { x:0.32, y:cardY+0.3,  w:2.44, h:0.32, fontFace:F.body, fontSize:13, color:C.white, align:'left', valign:'middle' });
    cardY += 0.82;
  });

  // Arrow
  sl.addText('\u2193', { x:0, y:cardY+0.04, w:3.1, h:0.3, fontFace:'Arial', fontSize:18, color:C.gwBuff, align:'center', valign:'middle' });

  // Output card
  sl.addShape(pptx.ShapeType.roundRect, { x:0.18, y:cardY+0.42, w:2.72, h:0.78, fill:{color:C.gwBuff}, line:{type:'none'}, rectRadius:0.07 });
  sl.addText('\u2726', { x:0.3, y:cardY+0.48, w:0.38, h:0.66, fontFace:'Arial', fontSize:20, color:C.gwBlue, align:'center', valign:'middle' });
  sl.addText('gwu-presentation.skill', { x:0.75, y:cardY+0.48, w:2.0, h:0.3, fontFace:F.body, fontSize:13, bold:true, color:C.gwBlue, align:'left', valign:'middle' });
  sl.addText('Installable \u00b7 Reusable \u00b7 Always brand-correct', { x:0.75, y:cardY+0.8, w:2.0, h:0.26, fontFace:F.body, fontSize:10, color:C.gwBlue, align:'left', valign:'middle' });

  // ── Right: Feature list ──
  const rx=3.4, rw=6.3;

  // Step badge
  sl.addShape(pptx.ShapeType.ellipse, { x:rx, y:0.35, w:0.38, h:0.38, fill:{color:C.gwBuff}, line:{type:'none'} });
  sl.addText('2', { x:rx, y:0.35, w:0.38, h:0.38, fontFace:F.head, fontSize:18, bold:true, color:C.gwBlue, align:'center', valign:'middle' });
  sl.addText('SYNTHESIZE', { x:rx+0.48, y:0.41, w:1.5, h:0.26, fontFace:F.body, fontSize:11, bold:true, charSpacing:1.5, color:C.gwBuff80, align:'left', valign:'middle' });

  // Title — 26pt fits 3 lines comfortably
  sl.addText('The skill-creator combined\nall three inputs.', {
    x:rx, y:0.85, w:rw, h:1.55,
    fontFace:F.head, fontSize:26, bold:true,
    color:C.gwBlue, align:'left', valign:'top', lineSpacingMultiple:1.2,
  });
  // Buff rule
  sl.addShape(pptx.ShapeType.rect, { x:rx, y:2.48, w:0.62, h:0.03, fill:{color:C.gwBuff}, line:{type:'none'} });

  // Feature rows — start below the buff rule with room to breathe
  const features = [
    { icon:'\u25a0', title:'Updated brand identity',        body:'New colors, typefaces, and graphic elements \u2014 replacing the outdated 2022 spec.' },
    { icon:'\u2665', title:'Presentation Zen built in',     body:'One idea per slide, signal over noise, images over bullets \u2014 woven into every layout rule.' },
    { icon:'\u25a6', title:'Nine layout patterns',          body:'Cover, big idea, split, stats, tiles, divider, quote, image \u2014 each chosen by communication purpose.' },
  ];

  let featureY = 2.6;
  features.forEach((f, i) => {
    // Icon circle
    sl.addShape(pptx.ShapeType.ellipse, { x:rx, y:featureY+0.05, w:0.34, h:0.34, fill:{color:C.gwBuff20}, line:{type:'none'} });
    sl.addText(f.icon, { x:rx, y:featureY+0.05, w:0.34, h:0.34, fontFace:F.head, fontSize:13, color:C.gwBlue, align:'center', valign:'middle' });
    // Title
    sl.addText(f.title, { x:rx+0.44, y:featureY+0.07, w:rw-0.44, h:0.26, fontFace:F.body, fontSize:13, bold:true, color:C.gwBlue, align:'left', valign:'middle' });
    // Body
    sl.addText(f.body,  { x:rx+0.44, y:featureY+0.35, w:rw-0.44, h:0.45, fontFace:F.body, fontSize:12, color:C.mid, align:'left', valign:'top', lineSpacingMultiple:1.4 });
    // Rule (except last)
    if (i < features.length-1) {
      sl.addShape(pptx.ShapeType.rect, { x:rx, y:featureY+0.88, w:rw, h:0.012, fill:{color:C.gwBuff50}, line:{type:'none'} });
    }
    featureY += 0.98;
  });
}


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 8 — Closing
// ══════════════════════════════════════════════════════════════════════════
{
  const sl = pptx.addSlide();

  // Navy Yard background
  sl.addShape(pptx.ShapeType.rect, { x:0, y:0, w:SW, h:SH, fill:{color:C.navyYard}, line:{type:'none'} });

  // Vertical separator
  sl.addShape(pptx.ShapeType.rect, { x:5.8, y:0, w:0.012, h:SH, fill:{color:'D6BF91',transparency:85}, line:{type:'none'} });

  // ── Left ──
  sl.addText('THE RESULT', { x:0.5, y:0.52, w:5, h:0.28, fontFace:F.body, fontSize:12, bold:true, charSpacing:2, color:C.gwBuff, align:'left', valign:'middle' });
  sl.addShape(pptx.ShapeType.rect, { x:0.5, y:0.86, w:0.62, h:0.03, fill:{color:C.gwBuff}, line:{type:'none'} });

  // Title — 30pt fits 3 lines in ~1.7", leaving room for body below
  sl.addText('One installation.\nBrand-compliant\nby default.', {
    x:0.5, y:1.0, w:5.1, h:2.0,
    fontFace:F.head, fontSize:32, bold:true,
    color:C.white, align:'left', valign:'top', lineSpacingMultiple:1.15,
  });

  // Body text — positioned safely below title
  sl.addText(
    'Every future GWU presentation starts with the right colors, the right typefaces, and the right design principles \u2014 without looking anything up.',
    {
      x:0.5, y:3.2, w:5.0, h:1.5,
      fontFace:F.head, fontSize:14, italic:true,
      color:C.gwBuff80, align:'left', valign:'top', lineSpacingMultiple:1.5,
    }
  );

  // ── Right ──
  const rx=6.05, rw=3.7;

  // Skill icon
  sl.addShape(pptx.ShapeType.roundRect, { x:rx+1.1, y:0.35, w:1.5, h:1.5, fill:{color:'FFFFFF',transparency:94}, line:{color:C.gwBuff,transparency:70,pt:1}, rectRadius:0.18 });
  sl.addText('\u2726', { x:rx+1.1, y:0.38, w:1.5, h:1.1, fontFace:'Arial', fontSize:42, color:C.gwBuff, align:'center', valign:'middle' });
  sl.addText('.skill', { x:rx+1.1, y:1.38, w:1.5, h:0.34, fontFace:F.body, fontSize:11, bold:true, charSpacing:1.5, color:C.gwBuff80, align:'center', valign:'middle' });

  // Workflow summary
  const steps = [
    { t:'Claude on Chrome reads brand guidelines',               muted:false },
    { t:'Extracts structured Markdown files',                    muted:false },
    { t:'Skill creator synthesizes with Presentation Zen',       muted:false },
    { t:'Packaged as an installable .skill file',                muted:false },
    { t:'Total time: one afternoon',                             muted:true  },
  ];
  let wsY = 2.05;
  steps.forEach(step => {
    const dotCol  = step.muted ? C.potomac50 : C.gwBuff;
    const textCol = step.muted ? C.potomac50 : 'BFBFBF';
    sl.addShape(pptx.ShapeType.ellipse, { x:rx+0.05, y:wsY+0.1, w:0.1, h:0.1, fill:{color:dotCol}, line:{type:'none'} });
    sl.addText(step.t, { x:rx+0.25, y:wsY, w:rw-0.35, h:0.32, fontFace:F.body, fontSize:13, color:textCol, align:'left', valign:'middle' });
    wsY += 0.43;
  });

  // Chevron ribbon at bottom
  addChevronRibbon(sl, SH-0.07, 0.07, C.gwBuff, C.navyYard);
}


// ── Save ──────────────────────────────────────────────────────────────────
const outPath = path.join('/sessions/amazing-happy-bardeen/mnt/GW-brand', 'skill-workflow.pptx');
pptx.writeFile({ fileName: outPath })
  .then(() => console.log('\u2713 Saved:', outPath))
  .catch(err => { console.error(err); process.exit(1); });
