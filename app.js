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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Garment-specific analysis
  return judgeForGarment(garmentType, {
    naturalPct, syntheticPct, stretchPct, cellulosicPct, naturalishPct,
    fibres: fibreNames, breakdown, raw: fibres
  });
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
  const result = analyseComposition(garment, fibres);
  renderResult(result);
});

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
