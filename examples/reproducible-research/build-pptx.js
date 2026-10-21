/**
 * Builds reproducible-research.pptx with the skill's PowerPoint helper.
 *
 *   cd <a folder where `npm install pptxgenjs` has been run>
 *   node /path/to/examples/reproducible-research/build-pptx.js [out.pptx] [brand|substitutes]
 *
 * The statistic is from Stodden, Seiler & Ma (2018), PNAS 115(11):2584–2589; check the
 * wording against the paper before presenting.
 */
const path = require('path');
const gw = require('../../skills/gw-presentation/src/gw_pptx.js');

const out = process.argv[2] || path.join(__dirname, 'reproducible-research.pptx');
const fonts = process.argv[3] || 'brand';

const deck = gw.createDeck({
  title: 'Reproducible by Design', author: 'Lorena A. Barba', fonts, pattern: 'chevrons',
  company: 'The George Washington University, School of Engineering and Applied Science',
});

deck.cover({
  eyebrow: 'Research Symposium · 2026',
  title: [{ text: 'Reproducible', breakLine: true }, { text: 'by Design', italic: true }],
  subtitle: 'Why computational research should be rerunnable — by others, and by our future selves',
  byline: 'Lorena A. Barba · School of Engineering and Applied Science',
});
deck.stat({
  stats: [{ value: '26%', label: 'of computational studies could be reproduced' }],
  gloss: 'Even after the journal required authors to share code and data.',
  source: 'Stodden, Seiler & Ma (2018), PNAS 115(11): 2584–2589 · 204 computational articles in Science',
});
deck.bigIdea({ text: 'A result no one else can rerun\nis a claim, not a finding.' });
deck.divider({ label: 'Part two', title: 'From principle\nto practice' });
deck.tiles({
  title: 'Three habits make results rerunnable',
  tiles: [
    { label: 'Version it', body: 'Code, data, and computing environment under version control, with a tag for every published figure.' },
    { label: 'Automate it', body: 'One command regenerates every result from raw data. No manual steps, no undocumented tweaks.' },
    { label: 'Share it', body: 'Publish code and data with an open license and a DOI, alongside the paper.' },
  ],
});
deck.close({ text: 'Make your next paper\none anyone can rerun.', gloss: 'Version it. Automate it. Share it.' });

deck.save(out).then(({ file, slides }) => console.log(`${file} (${slides} slides, ${fonts} fonts)`))
  .catch((e) => { console.error(e); process.exit(1); });
