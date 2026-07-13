// ============================================
// ATELIER — App Logic
// ============================================

// ---------- DATELINE ----------
(function setDateline() {
  const d = new Date();
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dateline = `Vol. I  ·  ${months[d.getMonth()]} ${d.getFullYear()}  ·  London Edition`;
  document.getElementById('dateline').textContent = dateline;
})();

// ---------- TAB SWITCHING ----------
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
    // Centre the tapped tab in view so users on narrow screens can always see it
    tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ============================================
// GARMENT CATALOGUE + GENDER FILTER
// --------------------------------------------
// Fabric science is identical whoever wears it — the gender filter only
// changes which garment types are offered (and some fit advice). Each
// garment maps to an "analysis" archetype that drives the verdict logic.
// ============================================
const GARMENTS = [
  // Shared (shown for everyone)
  { value: 'tshirt',       label: 'T-shirt / Top',            gender: 'shared', analysis: 'tshirt' },
  { value: 'longsleeve',   label: 'Long-sleeve top',          gender: 'shared', analysis: 'tshirt' },
  { value: 'shirt',        label: 'Shirt',                    gender: 'shared', analysis: 'shirt' },
  { value: 'jumper',       label: 'Jumper / Knitwear',        gender: 'shared', analysis: 'jumper' },
  { value: 'cardigan',     label: 'Cardigan',                 gender: 'shared', analysis: 'jumper' },
  { value: 'sweatshirt',   label: 'Sweatshirt / Hoodie',      gender: 'shared', analysis: 'tshirt' },
  { value: 'jeans',        label: 'Jeans',                    gender: 'shared', analysis: 'jeans' },
  { value: 'trousers',     label: 'Trousers (tailored)',      gender: 'shared', analysis: 'trousers' },
  { value: 'chinos',       label: 'Chinos / Casual trousers', gender: 'shared', analysis: 'trousers' },
  { value: 'shorts',       label: 'Shorts',                   gender: 'shared', analysis: 'trousers' },
  { value: 'blazer',       label: 'Blazer',                   gender: 'shared', analysis: 'blazer' },
  { value: 'coat',         label: 'Coat / Overcoat',          gender: 'shared', analysis: 'coat' },
  { value: 'jacket',       label: 'Casual jacket',            gender: 'shared', analysis: 'coat' },
  { value: 'activewear',   label: 'Activewear / Sportswear',  gender: 'shared', analysis: 'activewear' },
  { value: 'loungewear',   label: 'Loungewear / Pyjamas',     gender: 'shared', analysis: 'tshirt' },
  { value: 'socks',        label: 'Socks',                    gender: 'shared', analysis: 'hosiery' },
  { value: 'underwear',    label: 'Underwear',                gender: 'shared', analysis: 'hosiery' },
  { value: 'scarf',        label: 'Scarf',                    gender: 'shared', analysis: 'jumper' },
  { value: 'hat',          label: 'Hat / Beanie',             gender: 'shared', analysis: 'jumper' },
  { value: 'gloves',       label: 'Gloves',                   gender: 'shared', analysis: 'jumper' },
  // Women
  { value: 'dress',        label: 'Dress',                    gender: 'women', analysis: 'dress' },
  { value: 'skirt',        label: 'Skirt',                    gender: 'women', analysis: 'skirt' },
  { value: 'blouse',       label: 'Blouse',                   gender: 'women', analysis: 'shirt' },
  { value: 'camisole',     label: 'Camisole / Vest top',      gender: 'women', analysis: 'shirt' },
  { value: 'jumpsuit',     label: 'Jumpsuit',                 gender: 'women', analysis: 'dress' },
  { value: 'leggings',     label: 'Leggings',                 gender: 'women', analysis: 'activewear' },
  { value: 'tights',       label: 'Tights',                   gender: 'women', analysis: 'hosiery' },
  // Men
  { value: 'suitjacket',   label: 'Suit jacket',              gender: 'men', analysis: 'blazer' },
  { value: 'suittrousers', label: 'Suit trousers',            gender: 'men', analysis: 'trousers' },
  { value: 'tie',          label: 'Tie',                      gender: 'men', analysis: 'tie' }
];

const GARMENT_ANALYSIS = {};
GARMENTS.forEach(g => { GARMENT_ANALYSIS[g.value] = g.analysis; });

function garmentsFor(gender) {
  return GARMENTS.filter(g => gender === 'all' || g.gender === 'shared' || g.gender === gender);
}

function renderGarmentOptions(gender) {
  const sel = document.getElementById('garment-type');
  if (!sel) return;
  const prev = sel.value;
  const list = garmentsFor(gender);
  let html = '<option value="">Choose a category…</option>';
  list.forEach(g => { html += `<option value="${g.value}">${g.label}</option>`; });
  sel.innerHTML = html;
  sel.value = (prev && list.some(g => g.value === prev)) ? prev : '';
}

document.querySelectorAll('.gender-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGarmentOptions(btn.dataset.gender);
  });
});
renderGarmentOptions('all');

document.querySelectorAll('.example-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const input = document.getElementById('composition-input');
    input.value = chip.dataset.fill;
    input.focus();
  });
});

// ============================================
// TOOL 1: FABRIC CHECK
// ============================================

function parseComposition(input) {
  const text = input.toLowerCase().trim();
  // Match: "98% cotton, 2% elastane" or "98 cotton 2 elastane" etc.
  const regex = /(\d+(?:\.\d+)?)\s*%?\s*([a-z\s'’]+?)(?=[,;\d/]|$)/g;
  const matches = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    const pct = parseFloat(m[1]);
    let name = m[2].trim().replace(/[,;]/g, '').trim();
    // Normalise
    const normalised = FIBRE_ALIASES[name] || null;
    matches.push({ raw: name, normalised, pct });
  }
  return matches;
}

function classifyFibre(fibre) {
  const data = FIBRES[fibre];
  if (!data) return 'unknown';
  if (data.type === 'natural' || data.type === 'cellulosic') return 'good';
  if (data.type === 'stretch') return 'neutral';
  if (data.type === 'synthetic') return 'poor';
  return 'unknown';
}

// ============================================
// FABRIC SCORECARD
// --------------------------------------------
// Every rating below is a well-established, inherent property of the fibre.
// Values are on a 1–4 scale (1 = Poor, 2 = Fair, 3 = Good, 4 = Excellent).
// Higher is always better: pilling/wrinkle columns rate RESISTANCE.
// A garment's score for each quality is the composition-weighted average
// of its fibres — so it's transparent and reproducible, never invented.
// ============================================

const FIBRE_PROPS = {
  // key:               [breathability, durability, pilling-resist, wrinkle-resist, ease-of-care]
  cotton:              { breathability: 4, durability: 3, pilling: 4, wrinkle: 2, care: 4 },
  organic_cotton:      { breathability: 4, durability: 3, pilling: 4, wrinkle: 2, care: 4 },
  pima_cotton:         { breathability: 4, durability: 4, pilling: 4, wrinkle: 2, care: 4 },
  supima_cotton:       { breathability: 4, durability: 4, pilling: 4, wrinkle: 2, care: 4 },
  egyptian_cotton:     { breathability: 4, durability: 4, pilling: 4, wrinkle: 2, care: 4 },
  linen:               { breathability: 4, durability: 4, pilling: 4, wrinkle: 1, care: 3 },
  hemp:                { breathability: 4, durability: 4, pilling: 4, wrinkle: 1, care: 3 },
  wool:                { breathability: 4, durability: 3, pilling: 3, wrinkle: 4, care: 2 },
  merino_wool:         { breathability: 4, durability: 3, pilling: 3, wrinkle: 4, care: 2 },
  virgin_wool:         { breathability: 4, durability: 3, pilling: 3, wrinkle: 4, care: 2 },
  lambswool:           { breathability: 3, durability: 3, pilling: 3, wrinkle: 4, care: 2 },
  alpaca:              { breathability: 3, durability: 3, pilling: 3, wrinkle: 4, care: 2 },
  cashmere:            { breathability: 3, durability: 2, pilling: 2, wrinkle: 3, care: 1 },
  mohair:              { breathability: 3, durability: 3, pilling: 2, wrinkle: 3, care: 1 },
  silk:                { breathability: 3, durability: 2, pilling: 4, wrinkle: 2, care: 1 },

  lyocell:             { breathability: 4, durability: 3, pilling: 3, wrinkle: 3, care: 3 },
  tencel:              { breathability: 4, durability: 3, pilling: 3, wrinkle: 3, care: 3 },
  modal:               { breathability: 4, durability: 2, pilling: 3, wrinkle: 3, care: 3 },
  cupro:               { breathability: 4, durability: 2, pilling: 3, wrinkle: 2, care: 2 },
  viscose:             { breathability: 3, durability: 1, pilling: 1, wrinkle: 1, care: 1 },
  rayon:               { breathability: 3, durability: 1, pilling: 1, wrinkle: 1, care: 1 },

  elastane:            { breathability: 1, durability: 3, pilling: 4, wrinkle: 4, care: 3 },
  spandex:             { breathability: 1, durability: 3, pilling: 4, wrinkle: 4, care: 3 },
  lycra:               { breathability: 1, durability: 3, pilling: 4, wrinkle: 4, care: 3 },

  polyester:           { breathability: 1, durability: 4, pilling: 2, wrinkle: 4, care: 4 },
  recycled_polyester:  { breathability: 1, durability: 3, pilling: 2, wrinkle: 4, care: 4 },
  nylon:               { breathability: 1, durability: 4, pilling: 3, wrinkle: 3, care: 4 },
  polyamide:           { breathability: 1, durability: 4, pilling: 3, wrinkle: 3, care: 4 },
  acrylic:             { breathability: 1, durability: 2, pilling: 1, wrinkle: 4, care: 4 }
};

// Fibre families — used only to pick the plain-English reason shown to the user.
const FIBRE_FAMILY = {
  cotton: 'cotton', organic_cotton: 'cotton', pima_cotton: 'cotton',
  supima_cotton: 'cotton', egyptian_cotton: 'cotton',
  linen: 'linen_hemp', hemp: 'linen_hemp',
  wool: 'wool', merino_wool: 'wool', virgin_wool: 'wool', lambswool: 'wool', alpaca: 'wool',
  cashmere: 'luxury_wool', mohair: 'luxury_wool',
  silk: 'silk',
  lyocell: 'cellulosic_good', tencel: 'cellulosic_good', modal: 'cellulosic_good', cupro: 'cellulosic_good',
  viscose: 'viscose', rayon: 'viscose',
  elastane: 'stretch', spandex: 'stretch', lycra: 'stretch',
  polyester: 'synthetic', recycled_polyester: 'synthetic', acrylic: 'synthetic',
  nylon: 'nylon', polyamide: 'nylon'
};

const SCORE_DIMENSIONS = [
  { key: 'breathability', label: 'Breathability' },
  { key: 'durability',    label: 'Durability' },
  { key: 'pilling',       label: 'Pilling resistance' },
  { key: 'wrinkle',       label: 'Wrinkle resistance' },
  { key: 'care',          label: 'Ease of care' }
];

// Reason shown for each quality, chosen by the garment's dominant known fibre.
// These are statements of fact about the fibre, so they explain the rating.
const SCORE_REASONS = {
  breathability: {
    cotton: 'Cotton lets air through and absorbs moisture, so it wears cool.',
    linen_hemp: 'Linen and hemp are among the most breathable fibres there are.',
    wool: 'Wool breathes and regulates temperature — warm without overheating.',
    luxury_wool: 'Cashmere breathes well and insulates for its light weight.',
    silk: 'Silk breathes reasonably and feels cool against the skin.',
    cellulosic_good: 'Lyocell, modal and cupro breathe much like cotton.',
    viscose: 'Viscose breathes moderately, but less reliably than cotton.',
    synthetic: "Polyester and acrylic don't let air through, so they trap heat and odour.",
    nylon: 'Nylon is tightly structured and barely breathes.',
    stretch: "Elastane itself doesn't breathe, but a small percentage has little effect."
  },
  durability: {
    cotton: 'Cotton is a sturdy everyday fibre; long-staple types (Pima, Supima) last longest.',
    linen_hemp: 'Linen and hemp are exceptionally strong and last for years.',
    wool: 'Wool is resilient and springs back to shape well.',
    luxury_wool: "Cashmere is soft but delicate — shorter fibres wear faster than sheep's wool.",
    silk: 'Silk is fine and can weaken with rough handling or sunlight.',
    cellulosic_good: 'Lyocell is stronger than ordinary viscose, especially when wet.',
    viscose: 'Viscose is weak, particularly when wet, and loses shape over time.',
    synthetic: 'Polyester fibres are strong, though acrylic is weaker and wears out sooner.',
    nylon: 'Nylon is extremely strong and abrasion-resistant.',
    stretch: 'Elastane loses its stretch over the years, especially with heat.'
  },
  pilling: {
    cotton: "Cotton's smooth fibres rarely bobble.",
    linen_hemp: 'Linen and hemp resist pilling almost entirely.',
    wool: 'Wool can pill a little, but pure wool far less than blends.',
    luxury_wool: 'Cashmere pills at first as short fibres release, then settles.',
    silk: "Silk's smooth surface resists pilling well.",
    cellulosic_good: 'Lyocell and modal resist pilling reasonably well.',
    viscose: 'Viscose tends to pill and look tired quickly.',
    synthetic: 'Polyester fibres are strong, so pills tend to stay attached rather than shed; acrylic is the worst offender and bobbles quickly.',
    nylon: 'Nylon resists pilling reasonably well.',
    stretch: "Elastane doesn't pill itself."
  },
  wrinkle: {
    cotton: 'Cotton creases and usually needs ironing.',
    linen_hemp: "Linen wrinkles readily — that's part of its character, not a fault.",
    wool: 'Wool naturally resists wrinkles and drops creases when hung.',
    luxury_wool: 'Cashmere resists creasing fairly well.',
    silk: 'Silk can crease and mark, needing careful pressing.',
    cellulosic_good: 'Lyocell and modal drape well and resist creasing better than viscose.',
    viscose: 'Viscose wrinkles easily and can be hard to press out.',
    synthetic: 'Polyester and acrylic resist wrinkles well — an easy-care trait.',
    nylon: 'Nylon holds its shape and resists creasing.',
    stretch: 'A little elastane helps fabric spring back rather than crease.'
  },
  care: {
    cotton: 'Cotton is easy to wash, though hot washes can shrink and fade it.',
    linen_hemp: 'Linen machine-washes easily but usually needs pressing.',
    wool: 'Wool needs gentle, cool washing and flat drying.',
    luxury_wool: 'Cashmere is high-maintenance — hand-wash and dry flat.',
    silk: 'Silk is delicate, often hand-wash or dry-clean only.',
    cellulosic_good: 'Lyocell and modal are usually machine-washable and low-fuss.',
    viscose: 'Viscose can shrink or lose shape and needs careful washing.',
    synthetic: 'Polyester washes easily but holds onto odour and sheds microfibres.',
    nylon: 'Nylon washes and dries quickly and easily.',
    stretch: 'Elastane blends need cool washes and no tumble drying to keep their stretch.'
  }
};

function scoreToBand(v) {
  if (v >= 3.5) return { key: 'excellent', label: 'Excellent' };
  if (v >= 2.5) return { key: 'good', label: 'Good' };
  if (v >= 1.5) return { key: 'fair', label: 'Fair' };
  return { key: 'poor', label: 'Poor' };
}

function naturalBand(pct) {
  if (pct >= 90) return { key: 'excellent', label: 'Excellent' };
  if (pct >= 70) return { key: 'good', label: 'Good' };
  if (pct >= 40) return { key: 'fair', label: 'Fair' };
  return { key: 'poor', label: 'Poor' };
}

// Build the scorecard from the parsed composition ({ raw, normalised, pct }).
function buildScorecard(fibres) {
  const known = fibres.filter(f => f.normalised && FIBRE_PROPS[f.normalised]);
  if (known.length === 0) return null;

  const totalKnown = known.reduce((s, f) => s + f.pct, 0);
  if (totalKnown <= 0) return null;

  // dominant fibre drives the plain-English reason for each quality
  const dominant = known.reduce((a, b) => (b.pct > a.pct ? b : a));
  const domFamily = FIBRE_FAMILY[dominant.normalised];

  const rows = SCORE_DIMENSIONS.map(dim => {
    const weighted = known.reduce((s, f) => s + FIBRE_PROPS[f.normalised][dim.key] * f.pct, 0) / totalKnown;
    const band = scoreToBand(weighted);
    const reason = (SCORE_REASONS[dim.key] && SCORE_REASONS[dim.key][domFamily]) || '';
    return { label: dim.label, band, reason };
  });

  // Natural & plant-derived content (natural + cellulosic fibres like linen, cotton, wool, viscose)
  const naturalPct = fibres.reduce((s, f) => {
    const t = f.normalised && FIBRES[f.normalised] ? FIBRES[f.normalised].type : null;
    return (t === 'natural' || t === 'cellulosic') ? s + f.pct : s;
  }, 0);

  return { rows, naturalPct: Math.round(naturalPct), naturalBand: naturalBand(naturalPct) };
}

function analyseComposition(garmentType, fibres) {
  if (fibres.length === 0) {
    return {
      verdict: 'poor',
      title: "I couldn't read that.",
      reasoning: ['Try the format: <strong>98% cotton, 2% elastane</strong>. Check the care label inside the garment — usually at the neck or side seam.'],
      breakdown: []
    };
  }

  const total = fibres.reduce((s, f) => s + f.pct, 0);
  if (total < 90 || total > 105) {
    return {
      verdict: 'poor',
      title: 'Composition doesn\'t add up.',
      reasoning: [`Percentages should total ~100% but yours totals ${total}%. Did you miss a fibre?`],
      breakdown: fibres.map(f => ({ name: f.raw, pct: f.pct, tag: 'neutral' }))
    };
  }

  // Sum by classification
  let naturalPct = 0, syntheticPct = 0, stretchPct = 0, cellulosicPct = 0;
  const breakdown = fibres.map(f => {
    const cls = classifyFibre(f.normalised);
    const data = FIBRES[f.normalised];
    if (!data) {
      return { name: f.raw, pct: f.pct, tag: 'neutral' };
    }
    if (data.type === 'natural') naturalPct += f.pct;
    else if (data.type === 'cellulosic') cellulosicPct += f.pct;
    else if (data.type === 'stretch') stretchPct += f.pct;
    else if (data.type === 'synthetic') syntheticPct += f.pct;

    let tag = 'neutral';
    if (cls === 'good') tag = 'good';
    else if (cls === 'poor') tag = 'poor';
    return { name: prettyName(f.normalised, f.raw), pct: f.pct, tag };
  });

  const naturalishPct = naturalPct + cellulosicPct;
  const fibreNames = fibres.map(f => f.normalised).filter(Boolean);

  // Garment-specific verdict
  const result = judgeForGarment(garmentType, {
    naturalPct, syntheticPct, stretchPct, cellulosicPct, naturalishPct,
    fibres: fibreNames, breakdown, raw: fibres
  });

  // Attach the transparent fabric scorecard
  result.scorecard = buildScorecard(fibres);
  return result;
}

function prettyName(normalised, raw) {
  if (!normalised) return capitalise(raw);
  return normalised.split('_').map(capitalise).join(' ');
}

function capitalise(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function judgeForGarment(type, data) {
  const { naturalPct, syntheticPct, stretchPct, naturalishPct, fibres, breakdown } = data;
  const hasAcrylic = fibres.includes('acrylic');
  const hasPolyester = fibres.includes('polyester') || fibres.includes('recycled_polyester');
  const hasViscose = fibres.includes('viscose') || fibres.includes('rayon');
  const hasWool = fibres.some(f => ['wool', 'merino_wool', 'virgin_wool', 'lambswool'].includes(f));
  const hasLuxuryWool = fibres.some(f => ['cashmere', 'alpaca', 'mohair'].includes(f));
  const hasCotton = fibres.some(f => f && f.includes('cotton'));
  const hasLinen = fibres.includes('linen') || fibres.includes('hemp');
  const hasSilk = fibres.includes('silk');

  let verdict, title, reasoning = [];

  switch (type) {
    case 'tshirt':
      if (naturalishPct >= 95 && hasCotton && stretchPct === 0) {
        verdict = 'excellent';
        title = 'Excellent. A foundation-quality tee.';
        reasoning.push('Pure or near-pure cotton is the ideal for t-shirts — it breathes, holds shape with proper weight, and ages beautifully.');
        reasoning.push('Check the weight: look for at least 180gsm if the label gives it. Heavyweight tees outlast lightweight ones by years.');
      } else if (naturalishPct >= 90 && stretchPct <= 5) {
        verdict = 'excellent';
        title = 'Excellent — a fitted tee with proper stretch.';
        reasoning.push('Small elastane (2–5%) is ideal for fitted tees: they hug without bagging at the neck after a few washes.');
      } else if (naturalishPct >= 80 && syntheticPct <= 15) {
        verdict = 'good';
        title = 'A solid choice.';
        reasoning.push('Predominantly natural with a modest synthetic component. Should wear well.');
      } else if (syntheticPct >= 30) {
        verdict = 'poor';
        title = 'Walk away.';
        reasoning.push(`<strong>${syntheticPct}% synthetic</strong> in a t-shirt means it will trap odour, feel plasticky, and pill within a season.`);
        reasoning.push('Hold out for a higher-cotton option — they exist at every price point.');
      } else {
        verdict = 'okay';
        title = 'Acceptable, not exceptional.';
        reasoning.push('It will do the job but won\'t age as well as a cotton-dominant tee.');
      }
      break;

    case 'jeans':
      const totalStretch = stretchPct + (fibres.includes('polyester') ? data.raw.find(f => f.normalised === 'polyester')?.pct || 0 : 0);
      if (hasCotton && stretchPct >= 1 && stretchPct <= 3 && naturalishPct >= 95) {
        verdict = 'excellent';
        title = 'Excellent jeans for everyday wear.';
        reasoning.push('98% cotton with 2% elastane is the ideal balance: cotton structure with just enough give to sit, walk and bend.');
        reasoning.push('Should hold shape through the day and wash up well.');
      } else if (hasCotton && stretchPct > 3 && stretchPct <= 8) {
        verdict = 'good';
        title = 'Good for slim or skinny fits.';
        reasoning.push(`<strong>${stretchPct}% stretch</strong> is in the right range for skinny / shaping jeans on curvier figures. Recovery should be decent.`);
        if (syntheticPct > 0 && syntheticPct <= 3) {
          reasoning.push('The small polyester (1–2%) is actually positive here — it helps the denim recover its shape rather than bagging at the knee.');
        }
      } else if (stretchPct > 8) {
        verdict = 'poor';
        title = 'Too much stretch.';
        reasoning.push('Above 8% stretch means jeggings territory — the denim won\'t hold structure, will sag through the day, and lose shape fast.');
      } else if (hasCotton && stretchPct === 0) {
        verdict = 'good';
        title = 'Rigid denim — good for relaxed cuts only.';
        reasoning.push('100% cotton denim will stretch to your body but never recover. <strong>Buy true to size or size down one</strong> — they relax with wear.');
        reasoning.push('Not recommended for skinny styles on curvier thighs — it will dig in.');
      } else if (syntheticPct > 15) {
        verdict = 'poor';
        title = 'Not really denim.';
        reasoning.push('Heavy synthetic content means this is "denim-look" fabric, not proper denim. Won\'t age, won\'t breathe, won\'t fade nicely.');
      } else {
        verdict = 'okay';
        title = 'Workable but not ideal.';
        reasoning.push('Cotton-dominant denim with small stretch is the sweet spot — this is close but not perfect.');
      }
      break;

    case 'trousers':
      if (hasWool && naturalishPct >= 90) {
        verdict = 'excellent';
        title = 'Excellent tailored trousers.';
        reasoning.push('Wool is the classic trouser fibre — drapes, holds a crease, ages beautifully. ' +
          (stretchPct > 0 ? `The ${stretchPct}% stretch helps with fit on a curvier figure.` : 'Pure wool gives the cleanest line.'));
      } else if (hasCotton && stretchPct >= 1 && stretchPct <= 4 && naturalishPct >= 90) {
        verdict = 'good';
        title = 'Good casual or chino-style trousers.';
        reasoning.push('Cotton + small elastane is ideal for casual tailoring like cigarette pants and chinos.');
      } else if (hasLinen) {
        verdict = 'excellent';
        title = 'Beautiful summer trousers.';
        reasoning.push('Linen is the gold standard for summer trousers. Expect creasing — that is the look.');
      } else if (syntheticPct > 30) {
        verdict = 'poor';
        title = 'Too synthetic for tailored.';
        reasoning.push(`<strong>${syntheticPct}% synthetic</strong> in trousers means they\'ll be shiny, sweaty, and look cheap. The shine is the giveaway.`);
      } else if (hasViscose && syntheticPct < 30) {
        verdict = 'okay';
        title = 'Will look good — briefly.';
        reasoning.push('Viscose drapes beautifully off the rack but stretches out at the seat and knees within weeks. Not for daily wear.');
      } else {
        verdict = 'okay';
        title = 'Acceptable, not ideal.';
        reasoning.push('Workable composition but not what you\'d call a long-life piece.');
      }
      break;

    case 'blazer':
      if (hasWool && naturalishPct >= 95) {
        verdict = 'excellent';
        title = 'A wardrobe investment.';
        reasoning.push('Wool 95%+ is the gold standard for blazers — structure, drape, longevity.');
        reasoning.push('Now check the construction: feel for separate canvas layers near the lapel (good) versus glued/fused stiffening (poor — will bubble after dry cleaning).');
      } else if (hasWool && naturalishPct >= 80 && syntheticPct <= 15) {
        verdict = 'good';
        title = 'A solid blazer.';
        reasoning.push('Wool-dominant with a modest synthetic component. Should hold shape and wear well.');
        if (stretchPct > 0) reasoning.push(`The ${stretchPct}% stretch helps with fit on a curvier figure.`);
      } else if (hasCotton && naturalishPct >= 90) {
        verdict = 'good';
        title = 'A casual blazer.';
        reasoning.push('Cotton blazers don\'t have the structure of wool but are right for casual smart looks — pair with jeans and tees.');
      } else if (syntheticPct >= 30) {
        verdict = 'poor';
        title = 'Avoid for a quality piece.';
        reasoning.push(`<strong>${syntheticPct}% synthetic</strong> means it will look plasticky, never drape properly, and feel sweaty.`);
        reasoning.push('Save up for a wool option — even an end-of-season sale wool blazer beats new polyester.');
      } else if (hasViscose) {
        verdict = 'okay';
        title = 'Looks good on the hanger.';
        reasoning.push('Viscose blazers drape lovely but lose their structure entirely after a season. Fine if cheap, not worth investment money.');
      } else {
        verdict = 'okay';
        title = 'Workable but not ideal.';
      }
      break;

    case 'coat':
      if (hasWool && naturalishPct >= 80) {
        verdict = 'excellent';
        title = 'An investment coat.';
        reasoning.push('80%+ wool is the threshold for a coat that will keep you warm and look refined. ' +
          (hasLuxuryWool ? 'The cashmere/alpaca adds softness and warmth.' : ''));
        reasoning.push('Check the inner lining: cupro or viscose lining = good. Polyester lining = will be sweaty.');
      } else if (hasWool && naturalishPct >= 50) {
        verdict = 'good';
        title = 'Acceptable winter coat.';
        reasoning.push('50–80% wool is the bottom acceptable range. Below this, you\'re paying for the wool look but not getting the warmth.');
      } else if (hasCotton && (fibres.includes('polyester') || fibres.includes('polyamide')) && naturalishPct >= 40) {
        verdict = 'good';
        title = 'A reasonable trench / spring coat.';
        reasoning.push('Cotton with polyester / polyamide is the standard trench coat blend — the synthetic provides water resistance, which is legitimate here.');
        reasoning.push('Look for 50%+ cotton minimum.');
      } else if (naturalishPct < 50) {
        verdict = 'poor';
        title = 'Mostly synthetic — won\'t last.';
        reasoning.push(`Only <strong>${naturalishPct}% natural</strong> means this is essentially a plastic coat dressed up. It will pill, feel cold, and look tired after one season.`);
        reasoning.push('A "wool blend" with less than 50% wool is the most common high-street trap.');
      } else {
        verdict = 'okay';
        title = 'Borderline.';
      }
      break;

    case 'jumper':
      if (hasAcrylic) {
        verdict = 'poor';
        title = 'Will bobble. Soon.';
        reasoning.push(`<strong>Acrylic is the #1 cause of bobbling.</strong> Even at 10–20%, the short synthetic fibres tangle with wool and create pills within weeks.`);
        reasoning.push('Hold out for an acrylic-free knit — Uniqlo merino, M&S pure cotton, or COS wool blends are mid-range options that avoid acrylic.');
      } else if (hasPolyester && syntheticPct > 10) {
        verdict = 'poor';
        title = 'Will pill.';
        reasoning.push(`<strong>${syntheticPct}% polyester</strong> in a knit means pilling and a synthetic feel. Skip.`);
      } else if ((hasWool || hasLuxuryWool) && naturalishPct >= 95) {
        verdict = 'excellent';
        title = 'Excellent knitwear.';
        reasoning.push('Pure wool / cashmere / alpaca knits pill far less than blends — and what pills can be shaved with a fabric comb to look new again.');
        if (hasLuxuryWool) reasoning.push('For cashmere especially: 2-ply or thicker yarn pills less than single-ply. Worth asking in store.');
      } else if (hasCotton && naturalishPct >= 95 && !hasAcrylic) {
        verdict = 'excellent';
        title = 'A solid cotton knit.';
        reasoning.push('Pure cotton knits are durable, minimal pilling, ideal for spring and summer weights.');
      } else if (naturalishPct >= 80 && !hasAcrylic && syntheticPct < 15) {
        verdict = 'good';
        title = 'Decent quality knit.';
        reasoning.push('Predominantly natural and acrylic-free — should wear acceptably.');
      } else if (syntheticPct > 30) {
        verdict = 'poor';
        title = 'Too synthetic.';
        reasoning.push('High synthetic content in a knit = pilling, no breathability, won\'t last.');
      } else {
        verdict = 'okay';
        title = 'Borderline.';
        reasoning.push('Check for acrylic specifically — it\'s the biggest predictor of pilling.');
      }
      break;

    case 'shirt':
      if (hasCotton && naturalishPct >= 95) {
        verdict = 'excellent';
        title = 'An excellent shirt.';
        reasoning.push('100% cotton (or with tiny elastane) is the standard for crisp shirts — takes ironing, breathes, lasts.');
      } else if (hasSilk && naturalishPct >= 90) {
        verdict = 'excellent';
        title = 'A beautiful blouse.';
        reasoning.push('Pure silk is luxurious. Hand-wash or dry-clean only — worth the care.');
      } else if (fibres.includes('lyocell') || fibres.includes('tencel') || fibres.includes('modal')) {
        verdict = 'excellent';
        title = 'A modern, drapey blouse.';
        reasoning.push('Lyocell / Tencel / modal give silk-like drape but machine-wash. Excellent modern alternative to silk.');
      } else if (syntheticPct >= 50) {
        verdict = 'poor';
        title = 'A sweaty shirt.';
        reasoning.push(`<strong>${syntheticPct}% synthetic</strong> in a shirt = visible sweat patches, no breathability. The "silk look" polyester blouse is the biggest offender.`);
      } else {
        verdict = 'okay';
        title = 'Acceptable.';
      }
      break;

    case 'dress':
      if (hasSilk || (hasWool && naturalishPct >= 80) || (hasCotton && naturalishPct >= 90) || hasLinen) {
        verdict = 'excellent';
        title = 'An elegant dress.';
        reasoning.push('Natural-fibre dominant with proper weight is what flatters figures — drape rather than cling.');
      } else if (naturalishPct >= 70 && syntheticPct <= 25) {
        verdict = 'good';
        title = 'A solid dress.';
        reasoning.push('Predominantly natural, modest synthetic. Should sit well.');
      } else if (syntheticPct >= 50) {
        verdict = 'poor';
        title = 'Will not flatter.';
        reasoning.push('High-synthetic dresses cling, suffocate, and look cheap — particularly difficult on curvier figures where the fabric needs drape.');
      } else {
        verdict = 'okay';
        title = 'Borderline.';
      }
      break;

    case 'skirt':
      if (hasWool || (hasCotton && naturalishPct >= 90) || hasSilk || hasLinen) {
        verdict = 'excellent';
        title = 'An elegant skirt.';
        reasoning.push('Natural fibres with structure are right for skirts — they sit, hang, and move properly.');
      } else if (naturalishPct >= 75) {
        verdict = 'good';
        title = 'A solid skirt.';
      } else if (syntheticPct >= 50) {
        verdict = 'poor';
        title = 'Skip.';
        reasoning.push('Synthetic skirts cling statically, lose pleats, and stretch at the seat.');
      } else {
        verdict = 'okay';
        title = 'Borderline.';
      }
      break;

    case 'activewear':
      if (hasWool) {
        verdict = 'excellent';
        title = 'The natural performer.';
        reasoning.push('Merino and wool wick moisture, resist odour and regulate temperature — the premium choice for performance layers.');
      } else if (syntheticPct >= 40 && stretchPct >= 3) {
        verdict = 'excellent';
        title = 'Built for movement.';
        reasoning.push('Technical synthetics with elastane wick sweat, dry fast and stretch with you — exactly what activewear is meant to do. This is the one place synthetics genuinely belong.');
      } else if (syntheticPct >= 40) {
        verdict = 'good';
        title = 'A capable performance fabric.';
        reasoning.push('Polyester and nylon wick and dry quickly. A few percent of elastane would add the stretch most activewear wants.');
      } else if (hasCotton && naturalishPct >= 70) {
        verdict = 'okay';
        title = 'Fine for light activity only.';
        reasoning.push('Cotton soaks up sweat and stays heavy and damp — comfortable for lounging or gentle movement, poor for a real workout.');
      } else {
        verdict = 'okay';
        title = 'Workable.';
      }
      break;

    case 'hosiery':
      if ((hasCotton || hasWool) && naturalishPct >= 55) {
        if (stretchPct > 0 || fibres.includes('nylon') || fibres.includes('polyamide')) {
          verdict = 'excellent';
          title = 'The right blend.';
          reasoning.push('A natural fibre for breathability and comfort, with a little elastane or nylon for the stretch and durability these need to keep their shape.');
        } else {
          verdict = 'good';
          title = 'Breathable and comfortable.';
          reasoning.push('Predominantly natural — breathable and kind to skin. A touch of stretch would help them hold their shape.');
        }
      } else if (syntheticPct >= 70) {
        verdict = 'okay';
        title = 'Hard-wearing, less breathable.';
        reasoning.push('Mostly synthetic — durable, stretchy and quick-drying (normal for tights), but less breathable and more prone to trapping odour in socks.');
      } else {
        verdict = 'okay';
        title = 'Workable.';
      }
      break;

    case 'tie':
      if (hasSilk && naturalishPct >= 85) {
        verdict = 'excellent';
        title = 'The classic tie.';
        reasoning.push('Silk is the standard for a reason — a rich sheen, a crisp knot, and it ages well.');
      } else if (hasWool && naturalishPct >= 80) {
        verdict = 'good';
        title = 'A smart textured tie.';
        reasoning.push('Wool and wool blends make relaxed, autumnal ties that knot neatly and sit well.');
      } else if (hasLinen) {
        verdict = 'good';
        title = 'A summer tie.';
        reasoning.push('Linen ties are casual and seasonal — expect a softer, more rumpled knot, which is part of the look.');
      } else if (syntheticPct >= 50) {
        verdict = 'poor';
        title = 'The shine gives it away.';
        reasoning.push('Polyester ties have a tell-tale sheen and a stiff, springy knot that never quite sits right.');
      } else {
        verdict = 'okay';
        title = 'Acceptable.';
      }
      break;

    default:
      if (naturalishPct >= 80) { verdict = 'good'; title = 'Mostly natural — a solid choice.'; }
      else if (syntheticPct >= 50) { verdict = 'poor'; title = 'Heavily synthetic.'; }
      else { verdict = 'okay'; title = 'Mixed composition.'; }
  }

  return { verdict, title, reasoning, breakdown };
}

document.getElementById('check-btn').addEventListener('click', () => {
  const garment = document.getElementById('garment-type').value;
  const composition = document.getElementById('composition-input').value;
  const resultEl = document.getElementById('check-result');

  if (!garment) {
    resultEl.className = 'result-card verdict-poor';
    resultEl.innerHTML = '<div class="verdict-label">Missing</div><div class="verdict-title">Choose a garment type first.</div>';
    return;
  }
  if (!composition.trim()) {
    resultEl.className = 'result-card verdict-poor';
    resultEl.innerHTML = '<div class="verdict-label">Missing</div><div class="verdict-title">Paste the composition.</div><div class="verdict-body">e.g. <em>98% cotton, 2% elastane</em></div>';
    return;
  }

  const fibres = parseComposition(composition);
  const analysisType = GARMENT_ANALYSIS[garment] || garment;
  const result = analyseComposition(analysisType, fibres);
  renderResult(result);
});

// Plain-English meaning of each band — revealed when a rating is tapped.
const BAND_DEFS = {
  excellent: 'Excellent — one of the best-performing fibres for this property.',
  good: 'Good — performs well in most everyday situations.',
  fair: 'Fair — adequate, but with noticeable limitations.',
  poor: 'Poor — one of the weaker fibres for this property.'
};

function renderScorecard(sc) {
  if (!sc) return '';
  let rows = sc.rows.map(r => `
    <div class="score-row">
      <div class="score-top">
        <span class="score-label">${r.label}</span>
        <button type="button" class="score-band band-${r.band.key}" aria-label="What does ${r.band.label} mean?">${r.band.label}</button>
      </div>
      ${r.reason ? `<div class="score-reason">${r.reason}</div>` : ''}
      <div class="band-def" hidden>${BAND_DEFS[r.band.key]}</div>
    </div>
  `).join('');
  rows += `
    <div class="score-row score-row-natural">
      <div class="score-top">
        <span class="score-label">Natural &amp; plant-derived content</span>
        <span class="score-band band-${sc.naturalBand.key}">${sc.naturalPct}%</span>
      </div>
    </div>
  `;
  return `
    <div class="scorecard">
      <div class="scorecard-heading">Fabric scorecard</div>
      ${rows}
      <div class="scorecard-foot">Each rating is an inherent property of the fibres in this composition, weighted by percentage. Tap a rating to see what it means.</div>
    </div>
  `;
}

function renderResult(result) {
  const verdictLabels = {
    excellent: 'Buy it',
    good: 'A good buy',
    okay: 'Acceptable',
    poor: 'Walk away'
  };
  const resultEl = document.getElementById('check-result');
  resultEl.className = `result-card verdict-${result.verdict}`;
  let html = `
    <div class="verdict-label">${verdictLabels[result.verdict]}</div>
    <div class="verdict-title">${result.title}</div>
  `;
  result.reasoning.forEach(r => {
    html += `<div class="verdict-body">${r}</div>`;
  });
  if (result.breakdown && result.breakdown.length > 0) {
    html += '<div class="fibre-breakdown">';
    html += '<div class="breakdown-heading">Composition</div>';
    result.breakdown.forEach(f => {
      html += `
        <div class="fibre-row">
          <span class="fibre-name">${f.name}<span class="fibre-tag ${f.tag}">${f.tag === 'good' ? 'Natural' : f.tag === 'poor' ? 'Synthetic' : 'Stretch / Other'}</span></span>
          <span class="fibre-pct">${f.pct}%</span>
        </div>
      `;
    });
    html += '</div>';
  }
  // Transparent fabric scorecard
  html += renderScorecard(result.scorecard);
  // Save button (only show if we have a real verdict)
  if (result.verdict && result.breakdown && result.breakdown.length > 0) {
    html += `
      <div class="save-find-row">
        <input type="text" id="save-note" class="save-note-input" placeholder="Add a note — brand, price, size…">
        <button id="save-find-btn" class="save-find-btn">＋ Save this find</button>
        <div id="save-confirm" class="save-confirm"></div>
      </div>
    `;
  }
  resultEl.innerHTML = html;

  // Tap a scorecard rating to reveal what the band means
  resultEl.querySelectorAll('button.score-band').forEach(btn => {
    btn.addEventListener('click', () => {
      const def = btn.closest('.score-row').querySelector('.band-def');
      if (def) def.hidden = !def.hidden;
    });
  });

  // Wire up save button if present
  const saveBtn = document.getElementById('save-find-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const garment = document.getElementById('garment-type').value;
      const garmentLabel = document.getElementById('garment-type').selectedOptions[0].text;
      const composition = document.getElementById('composition-input').value;
      const note = document.getElementById('save-note').value;
      saveFind({
        id: Date.now().toString(),
        garment, garmentLabel, composition, note,
        verdict: result.verdict,
        title: result.title,
        date: new Date().toISOString()
      });
      const confirm = document.getElementById('save-confirm');
      confirm.textContent = '✓ Saved to your finds';
      confirm.style.opacity = '1';
      setTimeout(() => { confirm.style.opacity = '0'; }, 2000);
      document.getElementById('save-note').value = '';
    });
  }
}

// ============================================
// TOOL 2: MATERIALS LIST
// ============================================
function renderMaterials() {
  const container = document.getElementById('materials-list');
  let html = '';
  Object.entries(MATERIAL_GUIDES).forEach(([key, m], i) => {
    html += `
      <div class="material-card" data-key="${key}">
        <div class="material-header">
          <div class="material-title-group">
            <div class="material-name">${m.name}</div>
            <div class="material-sub">${m.sub}</div>
          </div>
          <div class="material-toggle">+</div>
        </div>
        <div class="material-body">
          <div class="material-body-inner">
            <div class="spec-block">
              <div class="spec-heading">What to look for</div>
              <ul class="spec-list good-list">
                ${m.ideal.map(i => `<li>${i}</li>`).join('')}
              </ul>
            </div>
            <div class="spec-block">
              <div class="spec-heading">Practical note</div>
              <div style="font-family: var(--serif); font-size: 1rem; color: var(--ink-soft); line-height: 1.5;">${m.weight_note}</div>
            </div>
            <div class="spec-block">
              <div class="spec-heading">What to avoid</div>
              <ul class="spec-list avoid-list">
                ${m.avoid.map(i => `<li>${i}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;

  document.querySelectorAll('.material-card').forEach(card => {
    card.querySelector('.material-header').addEventListener('click', () => {
      card.classList.toggle('open');
    });
  });
}
renderMaterials();

// ============================================
// TOOL 3: CAPSULE
// ============================================
let currentSeason = 'foundation';

function renderCapsule(season) {
  const data = CAPSULE[season];
  const container = document.getElementById('capsule-content');
  let html = `<div class="capsule-intro">${data.intro}</div>`;
  data.categories.forEach(cat => {
    const essentialCount = cat.items.filter(i => i.essential).length;
    html += `
      <div class="capsule-category">
        <div class="category-title">${cat.name}</div>
        <div class="category-count">${cat.items.length} pieces · ${essentialCount} essential</div>
        <div class="item-list">
          ${cat.items.map(item => `
            <div class="item-card ${item.essential ? 'essential' : ''}">
              ${item.essential ? '<div class="item-essential-flag">★ Essential</div>' : ''}
              <div class="item-name">${item.name}</div>
              <div class="item-desc">${item.desc}</div>
              <div class="item-spec"><strong>Look for</strong>${item.spec}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

document.querySelectorAll('.season-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.season-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSeason = btn.dataset.season;
    renderCapsule(currentSeason);
  });
});
renderCapsule('foundation');

// ============================================
// TOOL 4: CHECKLIST (with localStorage)
// ============================================

function getAllItems() {
  const items = [];
  Object.entries(CAPSULE).forEach(([seasonKey, season]) => {
    season.categories.forEach(cat => {
      cat.items.forEach(item => {
        items.push({
          id: `${seasonKey}__${cat.name}__${item.name}`,
          season: seasonKey,
          category: cat.name,
          name: item.name,
          essential: item.essential
        });
      });
    });
  });
  return items;
}

function loadChecked() {
  try {
    return JSON.parse(localStorage.getItem('atelier-checklist') || '{}');
  } catch { return {}; }
}

function saveChecked(state) {
  try {
    localStorage.setItem('atelier-checklist', JSON.stringify(state));
  } catch {}
}

function renderChecklist() {
  const allItems = getAllItems();
  const checked = loadChecked();
  const container = document.getElementById('checklist-content');

  // Group by season
  const seasonNames = {
    foundation: 'Foundation (year-round)',
    spring: 'Spring',
    summer: 'Summer',
    autumn: 'Autumn',
    winter: 'Winter'
  };
  const grouped = {};
  allItems.forEach(item => {
    if (!grouped[item.season]) grouped[item.season] = {};
    if (!grouped[item.season][item.category]) grouped[item.season][item.category] = [];
    grouped[item.season][item.category].push(item);
  });

  let html = '';
  Object.entries(grouped).forEach(([seasonKey, cats]) => {
    html += `<div class="checklist-category">`;
    html += `<div class="checklist-cat-title">${seasonNames[seasonKey]}</div>`;
    Object.entries(cats).forEach(([catName, items]) => {
      html += `<div style="font-family: var(--sans); font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-faint); margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 500;">${catName}</div>`;
      items.forEach(item => {
        const isChecked = checked[item.id];
        html += `
          <div class="check-item ${isChecked ? 'checked' : ''}" data-id="${item.id}">
            <div class="check-box"></div>
            <div class="check-label">${item.name}${item.essential ? ' <span style="color:var(--accent); font-size:0.7rem;">★</span>' : ''}</div>
          </div>
        `;
      });
    });
    html += `</div>`;
  });
  container.innerHTML = html;

  // Wire up checks
  document.querySelectorAll('.check-item').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      const state = loadChecked();
      if (state[id]) delete state[id];
      else state[id] = true;
      saveChecked(state);
      el.classList.toggle('checked');
      updateProgress();
    });
  });
  updateProgress();
}

function updateProgress() {
  const all = getAllItems();
  const checked = loadChecked();
  const checkedCount = Object.keys(checked).filter(k => all.find(i => i.id === k)).length;
  const totalCount = all.length;
  const pct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent = `${checkedCount} of ${totalCount} owned · ${pct}%`;
}

document.getElementById('reset-checklist').addEventListener('click', () => {
  if (confirm('Clear all ticks and start over?')) {
    saveChecked({});
    renderChecklist();
  }
});

renderChecklist();

// ============================================
// TOOL 5: RULES
// ============================================
function renderRules() {
  const container = document.getElementById('rules-content');
  container.innerHTML = RULES.map(r => `
    <div class="rule-card">
      <div class="rule-number">${r.num}</div>
      <div class="rule-title">${r.title}</div>
      <div class="rule-body">${r.body}</div>
    </div>
  `).join('');
}
renderRules();

// ============================================
// SAVED FINDS (localStorage)
// ============================================
function loadSavedFinds() {
  try {
    return JSON.parse(localStorage.getItem('atelier-finds') || '[]');
  } catch { return []; }
}

function persistFinds(finds) {
  try {
    localStorage.setItem('atelier-finds', JSON.stringify(finds));
  } catch {}
}

function saveFind(find) {
  const finds = loadSavedFinds();
  finds.unshift(find); // newest first
  persistFinds(finds);
  renderSavedFinds();
}

function deleteFind(id) {
  const finds = loadSavedFinds().filter(f => f.id !== id);
  persistFinds(finds);
  renderSavedFinds();
}

function renderSavedFinds() {
  const container = document.getElementById('saved-list');
  const finds = loadSavedFinds();
  if (finds.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">◌</div>
        <div class="empty-title">No saved finds yet</div>
        <div class="empty-body">When you analyse a composition on the <strong>Check</strong> tab, you'll be able to save it here with notes — brand, price, size — for later review.</div>
      </div>
    `;
    return;
  }
  const verdictLabels = { excellent: 'Buy it', good: 'A good buy', okay: 'Acceptable', poor: 'Walk away' };
  container.innerHTML = finds.map(f => {
    const date = new Date(f.date);
    const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    return `
      <div class="saved-card verdict-${f.verdict}">
        <div class="saved-header">
          <div>
            <div class="saved-label">${verdictLabels[f.verdict]}</div>
            <div class="saved-garment">${f.garmentLabel}</div>
          </div>
          <button class="saved-delete" data-id="${f.id}" aria-label="Remove">×</button>
        </div>
        <div class="saved-title">${f.title}</div>
        <div class="saved-comp"><strong>Composition</strong> ${f.composition}</div>
        ${f.note ? `<div class="saved-note">"${f.note}"</div>` : ''}
        <div class="saved-date">Saved ${dateStr}</div>
      </div>
    `;
  }).join('');
  // Wire delete buttons
  container.querySelectorAll('.saved-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Remove this find?')) deleteFind(btn.dataset.id);
    });
  });
}
renderSavedFinds();

// ============================================
// HAND-FEEL TESTS
// ============================================
function renderTouchTests() {
  const container = document.getElementById('touch-list');
  container.innerHTML = HAND_FEEL_TESTS.map((t, i) => `
    <div class="touch-card">
      <div class="touch-num">${String(i + 1).padStart(2, '0')}</div>
      <div class="touch-icon">${t.icon}</div>
      <div class="touch-name">${t.name}</div>
      <div class="touch-when"><strong>For</strong> ${t.when}</div>
      <div class="touch-how"><strong>How</strong> ${t.how}</div>
      <div class="touch-result-row">
        <div class="touch-pass"><strong>✓ Pass</strong>${t.pass}</div>
        <div class="touch-fail"><strong>✗ Fail</strong>${t.fail}</div>
      </div>
      <div class="touch-note">${t.note}</div>
    </div>
  `).join('');
}
renderTouchTests();

// ============================================
// BRANDS
// ============================================
function renderBrands() {
  const container = document.getElementById('brands-list');
  container.innerHTML = BRANDS.map(b => `
    <div class="brand-card">
      <div class="brand-header">
        <div>
          <div class="brand-name">${b.name}</div>
          <div class="brand-tier">${b.tier} · ${b.price}</div>
        </div>
        <div class="brand-toggle">+</div>
      </div>
      <div class="brand-body">
        <div class="brand-body-inner">
          <div class="spec-block">
            <div class="spec-heading">What they do well</div>
            <ul class="spec-list good-list">
              ${b.strong.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
          <div class="spec-block">
            <div class="spec-heading">What to watch for</div>
            <ul class="spec-list avoid-list">
              ${b.watch.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
          <div class="spec-block">
            <div class="spec-heading">Best for</div>
            <div style="font-family: var(--serif); font-size: 1rem; color: var(--ink-soft); line-height: 1.5; font-style: italic;">${b.best_for}</div>
          </div>
          <div class="spec-block">
            <div class="spec-heading">When to buy</div>
            <div style="font-family: var(--serif); font-size: 1rem; color: var(--ink-soft); line-height: 1.5;">${b.sweet_spot}</div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  // Toggle handlers
  container.querySelectorAll('.brand-card').forEach(card => {
    card.querySelector('.brand-header').addEventListener('click', () => {
      card.classList.toggle('open');
    });
  });
}
renderBrands();

// ============================================
// CARE GUIDE
// ============================================
function renderCare() {
  const container = document.getElementById('care-list');
  container.innerHTML = CARE_GUIDE.map(c => `
    <div class="care-card">
      <div class="care-header">
        <div class="care-icon">${c.icon}</div>
        <div>
          <div class="care-name">${c.fibre}</div>
        </div>
        <div class="care-toggle">+</div>
      </div>
      <div class="care-summary">${c.summary}</div>
      <div class="care-body">
        <div class="care-body-inner">
          <div class="spec-block">
            <div class="spec-heading">Washing</div>
            <ul class="spec-list good-list">${c.wash.map(s => `<li>${s}</li>`).join('')}</ul>
          </div>
          <div class="spec-block">
            <div class="spec-heading">Drying</div>
            <ul class="spec-list good-list">${c.dry.map(s => `<li>${s}</li>`).join('')}</ul>
          </div>
          <div class="spec-block">
            <div class="spec-heading">Storing</div>
            <ul class="spec-list good-list">${c.store.map(s => `<li>${s}</li>`).join('')}</ul>
          </div>
          <div class="spec-block">
            <div class="spec-heading">Reviving</div>
            <div style="font-family: var(--serif); font-size: 1rem; color: var(--ink-soft); line-height: 1.5;">${c.revive}</div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('.care-card').forEach(card => {
    card.querySelector('.care-header').addEventListener('click', () => {
      card.classList.toggle('open');
    });
  });
}
renderCare();

// ============================================
// THE FIBRE INDEX (encyclopedia)
// --------------------------------------------
// A page per fibre. The "at a glance" ratings are pulled live from
// FIBRE_PROPS via `key`, so the encyclopedia can never contradict the
// Check scorecard — one source of truth for every rating.
// ============================================
const FIBRE_ENCYCLOPEDIA = [
  {
    key: 'cotton', name: 'Cotton', type: 'Natural fibre',
    what: "The world's most-used natural fibre — soft and spun from the fluffy bolls of the cotton plant. Long-staple types (Pima, Supima, Egyptian) are stronger, smoother and worth the premium.",
    strengths: ['Breathable and absorbent — wears cool', 'Soft, and softens further with washing', 'Durable everyday fibre; takes dye and ironing well', 'Long-staple grades resist pilling and last longest'],
    watch: ['Creases and usually needs ironing', 'Hot washes shrink and fade it', 'Cheap, low-weight cotton goes thin and see-through'],
    best: 'T-shirts, shirts, everyday knits, denim, summer dresses.',
    care: 'Wash cool (30–40°C), line-dry or tumble low, iron slightly damp.'
  },
  {
    key: 'linen', name: 'Linen', type: 'Natural fibre',
    what: 'A bast fibre from the flax plant, used for thousands of years. Crisp and cool, it softens with every wash.',
    strengths: ['Among the most breathable fibres — ideal in heat', 'Exceptionally strong and long-lasting', 'Resists pilling almost entirely', 'Gets softer and more beautiful with age'],
    watch: ["Creases readily — that's its character, not a flaw", 'Not for looks that must stay crisp', 'Dark linens can rub off colour early on'],
    best: 'Summer trousers, shirts, dresses, unstructured jackets.',
    care: 'Machine wash cool; press while damp if you want it smooth.'
  },
  {
    key: 'hemp', name: 'Hemp', type: 'Natural fibre',
    what: 'A bast fibre like linen, from the hemp plant. Coarser when new, it wears in beautifully — and it is one of the most sustainable fibres grown.',
    strengths: ['Extremely strong and durable', 'Very breathable', 'Resists pilling', 'Softens considerably with wear and washing'],
    watch: ['Stiff and creased when new', 'Still uncommon on the high street'],
    best: 'Summer trousers and shirts, hard-wearing casuals.',
    care: 'Machine wash cool; it softens fastest with regular washing.'
  },
  {
    key: 'merino_wool', name: 'Wool & Merino', type: 'Natural fibre',
    what: 'The fleece of sheep. Merino is the fine, soft grade that does not itch; virgin and lambswool are the classic everyday grades.',
    strengths: ['Breathes and regulates temperature — warm without overheating', 'Naturally resists wrinkles and drops creases when hung', 'Resists odour, so it needs washing far less often', 'Resilient — springs back to shape'],
    watch: ['Needs gentle, cool washing and flat drying', 'Moths favour dirty wool — store it clean', 'Pills a little in blends; pure wool far less'],
    best: 'Jumpers, tailoring, coats, base layers, scarves.',
    care: 'Wash rarely; wool cycle or hand-wash cool, dry flat, store folded.'
  },
  {
    key: 'cashmere', name: 'Cashmere', type: 'Natural fibre',
    what: 'The downy undercoat of cashmere goats — exceptionally soft and warm for its weight. Two-ply or thicker yarn lasts far better than single-ply.',
    strengths: ['Remarkably soft and light', 'Very warm for its weight', 'Breathable', 'Resists creasing fairly well'],
    watch: ["Delicate — shorter fibres wear faster than sheep's wool", 'Pills at first as short fibres release, then settles', 'Single-ply budget cashmere barely lasts a season'],
    best: 'Fine jumpers, scarves and wraps — an investment knit.',
    care: 'Hand-wash cool with cashmere shampoo, dry flat; de-bobble after the first month.'
  },
  {
    key: 'alpaca', name: 'Alpaca', type: 'Natural fibre',
    what: 'The fleece of the alpaca — warmer than wool, silky, and free of lanolin, so it rarely irritates skin.',
    strengths: ['Very warm and light', "Silky, and doesn't itch", 'Breathable', 'Recovers well from creasing'],
    watch: ['Less elastic than wool — heavy knits can stretch and drop', 'Can shed a little when new'],
    best: 'Warm jumpers, wraps, winter accessories.',
    care: 'Hand-wash cool, dry flat; store folded.'
  },
  {
    key: 'silk', name: 'Silk', type: 'Natural fibre',
    what: 'A protein filament spun by silkworms — smooth, lustrous and surprisingly strong for how fine it is.',
    strengths: ['Smooth surface resists pilling well', 'Luxurious drape and sheen', 'Breathable and cool against the skin', 'Strong for such a fine fibre'],
    watch: ['Delicate — weakens with sunlight, sweat and rough handling', 'Water spots, perfume and deodorant can mark it', 'Often hand-wash or dry-clean only'],
    best: 'Blouses, slip dresses, scarves, ties, camisoles.',
    care: 'Hand-wash cool with silk or baby shampoo, or dry-clean; iron low on the reverse.'
  },
  {
    key: 'lyocell', name: 'Lyocell & Tencel™', type: 'Semi-synthetic (plant-derived)',
    what: 'A cellulosic fibre made from wood pulp in a low-waste, closed-loop process (TENCEL™ is the best-known brand). Silk-like drape, but washable.',
    strengths: ['Breathes much like cotton', 'Silk-like drape with easy care', 'Stronger than ordinary viscose, especially when wet', 'Resists pilling reasonably well'],
    watch: ['Can crease; benefits from a cool press', 'Quality varies by blend'],
    best: 'Blouses, dresses, drapey trousers, modern shirts.',
    care: 'Usually machine-washable cool on gentle; low-fuss.'
  },
  {
    key: 'modal', name: 'Modal', type: 'Semi-synthetic (plant-derived)',
    what: 'A cellulosic fibre from beech pulp, similar to viscose but stronger and softer — common in premium jersey and underwear.',
    strengths: ['Very breathable and soft', 'Resists shrinking better than viscose', 'Good drape', 'Machine-washable'],
    watch: ['Less durable than lyocell', 'Weaker when wet than cotton'],
    best: 'T-shirts, jersey dresses, underwear, loungewear.',
    care: 'Machine wash cool; low-fuss.'
  },
  {
    key: 'cupro', name: 'Cupro', type: 'Semi-synthetic (plant-derived)',
    what: 'A cellulosic fibre made from the cotton linter (the fuzz around cotton seeds). A breathable, silky "vegan silk" often used for linings.',
    strengths: ['Breathable — a far better lining than polyester', 'Silky, and drapes well', 'Anti-static'],
    watch: ['Not very durable', 'Creases and can need careful washing', 'Weakens when wet'],
    best: 'Jacket and coat linings, drapey blouses and dresses.',
    care: 'Hand-wash cool or dry-clean; press low.'
  },
  {
    key: 'viscose', name: 'Viscose & Rayon', type: 'Semi-synthetic (plant-derived)',
    what: 'The original manufactured cellulosic, made from wood pulp. Cheap and drapey off the rack, but the weakest of the plant-derived fibres.',
    strengths: ['Soft, with a fluid drape', 'Breathes moderately', 'Takes colour vividly', 'Inexpensive'],
    watch: ['Weak, especially when wet — loses shape over time', 'Pills and looks tired quickly', 'Wrinkles easily and can shrink'],
    best: 'Occasional drapey pieces — not for daily-wear staples.',
    care: 'Wash cool and gently, or dry-clean; reshape damp and dry flat.'
  },
  {
    key: 'polyester', name: 'Polyester', type: 'Synthetic fibre',
    what: "The world's most common synthetic — a plastic (PET) fibre. Strong and cheap, but it doesn't breathe.",
    strengths: ['Very strong and hard-wearing', 'Resists wrinkles — easy-care', 'Quick-drying and inexpensive', 'Holds pleats and shape'],
    watch: ["Doesn't breathe — traps heat and odour", 'Can feel plasticky; lower grades pill', 'Sheds microplastics in the wash'],
    best: 'Structured outerwear shells, hard-wearing linings, activewear blends.',
    care: 'Wash cool inside-out; air-dry to avoid pilling; skip fabric softener.'
  },
  {
    key: 'nylon', name: 'Nylon & Polyamide', type: 'Synthetic fibre',
    what: 'A tough synthetic prized for strength and abrasion resistance. "Polyamide" is the same fibre family under another name.',
    strengths: ['Extremely strong and abrasion-resistant', 'Lightweight and quick-drying', 'Adds durability and stretch-recovery in blends'],
    watch: ["Doesn't breathe", 'Can feel clammy; sheds microplastics', 'Prone to static'],
    best: 'Hosiery and tights, activewear, outerwear shells, bag linings.',
    care: 'Wash cool; air-dry.'
  },
  {
    key: 'acrylic', name: 'Acrylic', type: 'Synthetic fibre',
    what: 'A synthetic made to imitate wool — soft and cheap, but the worst common fibre for pilling.',
    strengths: ['Soft, warm and lightweight', 'Cheap, and holds bright colour', 'Resists wrinkles and moths'],
    watch: ['The #1 cause of bobbling — pills fast, even in small amounts', "Doesn't breathe; traps odour", 'Can feel scratchy and looks cheap as it ages'],
    best: 'Honestly, best avoided in knitwear — hold out for wool or cotton.',
    care: 'Wash cool, air-dry; pilling rarely recovers.'
  },
  {
    key: 'elastane', name: 'Elastane, Spandex & Lycra', type: 'Stretch fibre',
    what: 'A super-stretchy synthetic (Lycra is a brand name) used in small amounts to add give and recovery. Almost never used on its own.',
    strengths: ['Exceptional stretch and recovery', 'A few percent stops jeans and tailoring bagging', 'Adds comfort and a closer fit'],
    watch: ['Loses its stretch over the years, especially with heat', "Doesn't breathe — fine at low %, poor at high", 'Tumble-drying destroys it'],
    best: 'A few percent in jeans, tailoring, activewear and hosiery.',
    care: 'Wash cool, never tumble dry — heat kills the stretch.'
  }
];

function renderFibres() {
  const container = document.getElementById('fibres-list');
  if (!container) return;
  container.innerHTML = FIBRE_ENCYCLOPEDIA.map(f => {
    const props = FIBRE_PROPS[f.key] || {};
    const ratings = SCORE_DIMENSIONS.map(d => {
      const b = scoreToBand(props[d.key]);
      return `<div class="fx-rate"><span class="fx-rl">${d.label}</span><span class="score-band band-${b.key}">${b.label}</span></div>`;
    }).join('');
    return `
      <div class="care-card fibre-entry">
        <div class="care-header">
          <div>
            <div class="care-name">${f.name}</div>
            <div class="fibre-type">${f.type}</div>
          </div>
          <div class="care-toggle">+</div>
        </div>
        <div class="care-summary">${f.what}</div>
        <div class="care-body">
          <div class="care-body-inner">
            <div class="spec-block">
              <div class="spec-heading">At a glance</div>
              <div class="fx-ratings">${ratings}</div>
            </div>
            <div class="spec-block">
              <div class="spec-heading">Strengths</div>
              <ul class="spec-list good-list">${f.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
            <div class="spec-block">
              <div class="spec-heading">Watch for</div>
              <ul class="spec-list avoid-list">${f.watch.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
            <div class="spec-block">
              <div class="spec-heading">Best for</div>
              <div class="fx-note">${f.best}</div>
            </div>
            <div class="spec-block">
              <div class="spec-heading">Care</div>
              <div class="fx-note">${f.care}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  container.querySelectorAll('.fibre-entry').forEach(card => {
    card.querySelector('.care-header').addEventListener('click', () => {
      card.classList.toggle('open');
    });
  });
}
renderFibres();

// ============================================
// CARE-LABEL SYMBOL DECODER
// --------------------------------------------
// The standard GINETEX/ISO laundry symbols, drawn as monochrome SVG so
// they sit in the black-and-white theme. A crossed symbol always = "don't".
// ============================================
const SY = {
  open: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
  close: '</svg>',
  tub: '<path d="M5 14 C10 9 14 18 20 14 C26 10 30 18 35 14 L33 31 a3 3 0 0 1 -3 2.5 H10 a3 3 0 0 1 -3 -2.5 Z"/>',
  tri: '<path d="M20 7 L34 32 H6 Z"/>',
  sq: '<rect x="6" y="9" width="28" height="25" rx="3"/>',
  circle: '<circle cx="20" cy="20" r="14"/>',
  iron: '<path d="M5 28 L9 20 Q10 17 13 17 H33 L34 28 Z"/><line x1="4" y1="28" x2="36" y2="28"/>',
  cross: '<path d="M8 8 L32 32 M32 8 L8 32"/>',
  hand: '<path d="M13 26 v-4 M16 26 v-6 M19 26 v-6 M22 26 v-4 M13 22 h9"/>',
  bar: '<line x1="11" y1="36.5" x2="29" y2="36.5"/>',
  dot: (x) => `<circle cx="${x}" cy="23" r="1.6" fill="currentColor" stroke="none"/>`,
  txt: (t, y) => `<text x="20" y="${y}" text-anchor="middle" font-size="10.5" fill="currentColor" stroke="none" font-family="Inter, system-ui, sans-serif">${t}</text>`
};
function sym(inner) { return SY.open + inner + SY.close; }

const CARE_SYMBOLS = [
  { group: 'Washing', items: [
    { svg: sym(SY.tub + SY.txt('30', 27)), name: 'Machine wash cool', meaning: 'Machine wash at the shown temperature (e.g. 30°C) or below. Cooler is gentler on colour and fibres.' },
    { svg: sym(SY.tub + SY.hand), name: 'Hand wash only', meaning: 'Hand wash in cool water — no machine.' },
    { svg: sym(SY.tub + SY.bar), name: 'Gentle / delicate cycle', meaning: 'A bar under the tub means reduced agitation and spin — use the delicate or synthetics cycle.' },
    { svg: sym(SY.tub + SY.cross), name: 'Do not wash', meaning: 'Do not wash in water — almost always means dry-clean only.' }
  ]},
  { group: 'Bleaching', items: [
    { svg: sym(SY.tri + '<path d="M13 27 L21 13 M19 29 L27 15"/>'), name: 'Non-chlorine bleach only', meaning: 'Only oxygen (colour-safe) bleach — no chlorine.' },
    { svg: sym(SY.tri + SY.cross), name: 'Do not bleach', meaning: 'No bleach of any kind.' }
  ]},
  { group: 'Drying', items: [
    { svg: sym(SY.sq + '<circle cx="20" cy="21.5" r="7"/>' + SY.dot(20)), name: 'Tumble dry, low heat', meaning: 'Tumble dry gently. Dots show heat — one is low, two is normal.' },
    { svg: sym(SY.sq + '<circle cx="20" cy="21.5" r="7"/>' + SY.cross), name: 'Do not tumble dry', meaning: 'Keep it out of the dryer — air-dry instead.' },
    { svg: sym(SY.sq + '<line x1="20" y1="12" x2="20" y2="31"/>'), name: 'Line dry', meaning: 'Hang to dry.' },
    { svg: sym(SY.sq + '<line x1="10" y1="21.5" x2="30" y2="21.5"/>'), name: 'Dry flat', meaning: 'Lay flat to dry — essential for knits, which stretch out of shape on a hanger.' }
  ]},
  { group: 'Ironing', items: [
    { svg: sym(SY.iron + SY.dot(20)), name: 'Iron low', meaning: 'One dot = low heat (silk, wool, synthetics).' },
    { svg: sym(SY.iron + SY.dot(15) + SY.dot(20) + SY.dot(25)), name: 'Iron medium to high', meaning: 'More dots, more heat: two dots for wool/polyester, three for cotton and linen.' },
    { svg: sym(SY.iron + SY.cross), name: 'Do not iron', meaning: 'No ironing — heat will scorch or melt the fibres.' }
  ]},
  { group: 'Dry cleaning', items: [
    { svg: sym(SY.circle + SY.txt('P', 24)), name: 'Dry-clean', meaning: 'Professionally dry-clean. The letter (P or F) tells the cleaner which solvent to use.' },
    { svg: sym(SY.circle + SY.cross), name: 'Do not dry-clean', meaning: 'Do not dry-clean.' }
  ]}
];

function renderCareSymbols() {
  const c = document.getElementById('care-symbols');
  if (!c) return;
  c.innerHTML = CARE_SYMBOLS.map(g => `
    <div class="symbol-group">
      <div class="symbol-group-title">${g.group}</div>
      ${g.items.map(s => `
        <div class="symbol-row">
          <div class="symbol-icon">${s.svg}</div>
          <div>
            <div class="symbol-name">${s.name}</div>
            <div class="symbol-meaning">${s.meaning}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');
}
renderCareSymbols();
