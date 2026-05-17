// ============================================
// ATELIER — Data
// All material composition rules & capsule items
// ============================================

// ---------- FIBRE CLASSIFICATIONS ----------
const FIBRES = {
  // Natural fibres
  cotton: { type: 'natural', breathable: true, durable: true },
  organic_cotton: { type: 'natural', breathable: true, durable: true },
  pima_cotton: { type: 'natural', breathable: true, durable: true, premium: true },
  supima_cotton: { type: 'natural', breathable: true, durable: true, premium: true },
  egyptian_cotton: { type: 'natural', breathable: true, durable: true, premium: true },
  linen: { type: 'natural', breathable: true, durable: true },
  wool: { type: 'natural', breathable: true, durable: true, warm: true },
  merino_wool: { type: 'natural', breathable: true, durable: true, warm: true, premium: true },
  virgin_wool: { type: 'natural', breathable: true, durable: true, warm: true, premium: true },
  lambswool: { type: 'natural', breathable: true, durable: true, warm: true },
  cashmere: { type: 'natural', breathable: true, warm: true, premium: true, delicate: true },
  alpaca: { type: 'natural', breathable: true, warm: true, premium: true },
  mohair: { type: 'natural', warm: true, premium: true, delicate: true },
  silk: { type: 'natural', breathable: true, premium: true, delicate: true },
  hemp: { type: 'natural', breathable: true, durable: true },

  // Cellulosic (plant-derived semi-synthetics — generally good)
  lyocell: { type: 'cellulosic', breathable: true, premium: true }, // Tencel
  tencel: { type: 'cellulosic', breathable: true, premium: true },
  modal: { type: 'cellulosic', breathable: true },
  cupro: { type: 'cellulosic', breathable: true, premium: true },
  viscose: { type: 'cellulosic', breathable: true, pills: true },
  rayon: { type: 'cellulosic', breathable: true, pills: true },

  // Synthetic stretch (small amounts good for jeans/trousers)
  elastane: { type: 'stretch', pills: false, good_small_pct: true },
  spandex: { type: 'stretch', pills: false, good_small_pct: true },
  lycra: { type: 'stretch', pills: false, good_small_pct: true },

  // Synthetics (avoid in large quantities)
  polyester: { type: 'synthetic', breathable: false, pills: true, cheap: true },
  recycled_polyester: { type: 'synthetic', breathable: false, pills: true, cheap: true },
  nylon: { type: 'synthetic', breathable: false, durable: true },
  polyamide: { type: 'synthetic', breathable: false, durable: true },
  acrylic: { type: 'synthetic', breathable: false, pills: true, cheap: true }
};

// Normalisation map — what people actually paste from labels
const FIBRE_ALIASES = {
  'cotton': 'cotton',
  'organic cotton': 'organic_cotton',
  'pima': 'pima_cotton',
  'pima cotton': 'pima_cotton',
  'supima': 'supima_cotton',
  'supima cotton': 'supima_cotton',
  'egyptian cotton': 'egyptian_cotton',
  'linen': 'linen',
  'flax': 'linen',
  'wool': 'wool',
  'merino': 'merino_wool',
  'merino wool': 'merino_wool',
  'virgin wool': 'virgin_wool',
  'new wool': 'virgin_wool',
  'lambswool': 'lambswool',
  'lamb wool': 'lambswool',
  "lamb's wool": 'lambswool',
  'cashmere': 'cashmere',
  'alpaca': 'alpaca',
  'mohair': 'mohair',
  'silk': 'silk',
  'hemp': 'hemp',
  'lyocell': 'lyocell',
  'tencel': 'tencel',
  'tencel lyocell': 'lyocell',
  'modal': 'modal',
  'cupro': 'cupro',
  'viscose': 'viscose',
  'rayon': 'rayon',
  'elastane': 'elastane',
  'spandex': 'spandex',
  'lycra': 'lycra',
  'elastomultiester': 'elastane',
  'polyester': 'polyester',
  'recycled polyester': 'recycled_polyester',
  'rpet': 'recycled_polyester',
  'nylon': 'nylon',
  'polyamide': 'polyamide',
  'acrylic': 'acrylic'
};

// ---------- MATERIAL GUIDES BY GARMENT ----------
const MATERIAL_GUIDES = {
  tshirt: {
    name: 'T-shirts & Basic Tops',
    sub: 'The everyday foundation',
    ideal: [
      '<strong>100% cotton</strong> — particularly Pima, Supima or combed cotton. Holds shape, breathes, wears beautifully.',
      '<strong>Cotton + 3–5% elastane</strong> — for fitted tees that need to hug without bagging at the neck.',
      '<strong>100% linen</strong> — for summer; relaxed elegance, gets softer with washing.',
      '<strong>Modal or Tencel blends</strong> (with cotton) — silky drape, more luxurious than pure cotton.',
      '<strong>Silk</strong> — for elevated camis and shell tops under blazers.'
    ],
    weight_note: 'For longevity, look for tees described as <strong>"heavyweight"</strong> or above <strong>180gsm</strong>. The cheap, see-through 120gsm tees from fast fashion don\'t survive ten washes.',
    avoid: [
      '<strong>Anything over 20% polyester</strong> — traps odour, pills, looks plasticky.',
      '<strong>Viscose or rayon as the main fibre</strong> — drapes nicely off the rack but loses shape and shrinks.',
      '<strong>Acrylic in tops</strong> — almost always feels cheap and pills within weeks.'
    ]
  },
  jeans: {
    name: 'Jeans',
    sub: 'For curvy thighs & legs — stretch matters',
    ideal: [
      '<strong>98% cotton, 2% elastane</strong> — the goldilocks for tighter rigid-looking jeans that still let you sit down.',
      '<strong>92–95% cotton, 4–6% elastane, 1–2% polyester</strong> — for skinny or "shaping" jeans where the small polyester helps recovery (stops them bagging at the knee).',
      '<strong>Cotton + lyocell + elastane</strong> — premium denim, softer hand, less stiff break-in.',
      '<strong>100% cotton rigid denim</strong> — for relaxed/wide-leg cuts only. Will stretch to your body but won\'t recover, so size carefully.'
    ],
    weight_note: 'For curvier figures: look for <strong>"power stretch"</strong> or <strong>"sculpting"</strong> denim from mid-range brands (Levi\'s 721/Mile-High, M&S Magic Shaping, Mango Sculpt). These have the higher elastane + polyester recovery blend. Denim weight of <strong>11–13oz</strong> holds shape best for hourglass figures.',
    avoid: [
      '<strong>Below 2% elastane in skinny styles</strong> — will dig in and feel rigid.',
      '<strong>Above 8% elastane</strong> — feels like jeggings, distorts shape, sags fast.',
      '<strong>"Soft denim" with 30%+ polyester</strong> — usually a sign of cheap construction.'
    ]
  },
  trousers: {
    name: 'Tailored Trousers',
    sub: 'Smart, structured, polished',
    ideal: [
      '<strong>Wool or wool blend (60%+ wool)</strong> — the classic. Drapes beautifully, holds a crease, ages well. Look for "tropical wool" or "Super 100s/110s" for year-round wear.',
      '<strong>Wool + 2–4% elastane</strong> — for fitted tailored cuts.',
      '<strong>Cotton + elastane</strong> (chinos, cigarette pants) — cotton 96–98%, elastane 2–4%.',
      '<strong>Linen or linen-cotton</strong> — for summer trousers; expect creasing as part of the charm.',
      '<strong>Lyocell/Tencel blends</strong> — modern alternative with drape, less wrinkle.'
    ],
    weight_note: 'For trousers that hold shape on curvy figures, structure matters. <strong>Avoid pure stretch jersey "work trousers"</strong> from fast fashion — they look like leggings within months. A small synthetic addition (3–5% polyester) is actually fine and helps tailored trousers keep their line.',
    avoid: [
      '<strong>100% polyester suit trousers</strong> — shiny, sweaty, look cheap.',
      '<strong>Viscose-heavy "smart" trousers</strong> — wrinkle catastrophically, lose shape.',
      '<strong>Anything thin enough to see your hand through</strong> — won\'t skim your shape.'
    ]
  },
  blazer: {
    name: 'Blazers',
    sub: 'The wardrobe workhorse',
    ideal: [
      '<strong>100% wool</strong> or <strong>wool 90%+ blend</strong> — the gold standard. Look for terms like "Italian wool," "Merino," "virgin wool."',
      '<strong>Wool + viscose or cupro (lining)</strong> — fine. Lining should be cupro, viscose or silk, never polyester (sweat-trapping).',
      '<strong>Linen blazers</strong> for summer — expect rumpled elegance.',
      '<strong>Cotton sateen or stretch cotton blazers</strong> — fine for casual settings, won\'t have the structure of wool.',
      '<strong>Wool + 2% elastane</strong> — for fitted, modern shapes.'
    ],
    weight_note: 'A blazer is where to spend most. The <strong>shoulder construction</strong> matters as much as the fabric. Look at the inside — quality blazers have a soft canvas or "half-canvas" construction (you can pinch and feel separate layers near the lapel), not just glued fusing which bubbles after dry cleaning.',
    avoid: [
      '<strong>Polyester blazers (above 30%)</strong> — sweaty, plasticky, never look refined.',
      '<strong>Pure viscose blazers</strong> — drape but lose shape entirely.',
      '<strong>Polyester linings</strong> — make the whole blazer feel cheap even if outer is wool.'
    ]
  },
  coat: {
    name: 'Coats & Outerwear',
    sub: 'Investment pieces, decade-long wear',
    ideal: [
      '<strong>100% wool</strong> (for wool/winter coats) — minimum 70% wool for proper warmth and drape.',
      '<strong>Wool + cashmere blend</strong> (90% wool / 10% cashmere typical) — softer hand, slightly warmer, more luxurious.',
      '<strong>100% camel hair</strong> or wool + camel — the iconic Parisian camel coat.',
      '<strong>Cotton gabardine or cotton-blend</strong> — for trench coats. Look for Burberry-style 51% cotton / 49% poly blends; the polyester here is for water-resistance, that\'s legitimate.',
      '<strong>Down + outer shell</strong> (for puffer/insulated) — minimum 600 fill power. Shell can be nylon or polyester (here durability matters more than breathability).'
    ],
    weight_note: 'For a long-life winter coat: minimum <strong>500–700gsm</strong> wool fabric weight. The label may not say this, but you can feel it — the coat should have substantial heft. Length to <strong>mid-thigh or longer</strong> looks more elegant and gives more coverage.',
    avoid: [
      '<strong>"Wool blend" with less than 50% wool</strong> — usually means 30% wool, 50% polyester, 20% acrylic, which pills and feels stiff.',
      '<strong>Pure acrylic "wool look" coats</strong> — they\'re everywhere on high streets, last one season.',
      '<strong>Pure polyester puffers without proper insulation</strong> — cold, sweaty.'
    ]
  },
  jumper: {
    name: 'Jumpers & Knitwear',
    sub: 'Anti-bobble buying',
    ideal: [
      '<strong>100% merino wool</strong> — fine, soft, doesn\'t itch, minimal pilling. The everyday wool.',
      '<strong>100% lambswool</strong> — slightly chunkier feel, very durable, classic.',
      '<strong>100% cashmere</strong> — luxurious but pills more (it\'s the short fibres). Choose 2-ply or thicker; single-ply pills fastest.',
      '<strong>Wool + cashmere (70/30 or 80/20)</strong> — better pilling resistance than pure cashmere, still soft.',
      '<strong>100% cotton</strong> — fine for spring/summer knits; minimal pilling.',
      '<strong>Wool + silk + cashmere blends</strong> — premium, sleek surface, less pilling.'
    ],
    weight_note: 'PILLING RULE: pure natural fibres pill less than blends. <strong>The worst blends are wool + acrylic, or cashmere + acrylic.</strong> The short synthetic fibres tangle with the long wool ones and create bobbles fast. If you see "acrylic" anywhere on a knit, expect pilling. <strong>Ply matters too:</strong> 2-ply or 4-ply (the yarn is twisted from 2 or 4 strands) wears far better than single ply. Look for "2-ply cashmere" specifically.',
    avoid: [
      '<strong>Acrylic in any percentage</strong> — biggest cause of bobbling. Even 20% acrylic in a "wool blend" jumper means pills within weeks.',
      '<strong>Polyester knits</strong> — pill, look cheap, trap odour.',
      '<strong>Very loose, fuzzy yarns ("brushed")</strong> — look gorgeous on the hanger, shed and pill almost immediately.',
      '<strong>Single-ply cashmere from budget brands</strong> — won\'t last a season.'
    ]
  },
  shirt: {
    name: 'Shirts & Blouses',
    sub: 'The polish piece',
    ideal: [
      '<strong>100% cotton</strong> — particularly poplin, oxford, or sea island. Crisp, breathable, takes ironing.',
      '<strong>Cotton + 2–3% elastane</strong> — for fitted shirts.',
      '<strong>100% silk</strong> — for blouses. Hand-wash or dry-clean only; worth it.',
      '<strong>Silk + cotton blends</strong> — easier to care for than pure silk.',
      '<strong>Tencel/lyocell blouses</strong> — gorgeous drape, machine-washable, modern alternative to silk.'
    ],
    weight_note: 'For a white shirt that\'s opaque (not flashing your bra): look for <strong>poplin</strong> or <strong>twill</strong> rather than voile. Two-ply cotton is denser and wears longer than single-ply.',
    avoid: [
      '<strong>Polyester "silk-look" blouses</strong> — sweat patches show immediately, no breathability.',
      '<strong>100% viscose shirts</strong> — wrinkle terribly, shrink unpredictably.',
      '<strong>Cheap shirts with synthetic interfacing</strong> at collars and cuffs — bubble after first wash.'
    ]
  },
  dress: {
    name: 'Dresses',
    sub: 'Day to evening',
    ideal: [
      '<strong>100% silk</strong> — for slip dresses and elegant evening pieces.',
      '<strong>Wool crepe or wool blends</strong> — for tailored work dresses.',
      '<strong>Cotton sateen or cotton + small elastane</strong> — for structured day dresses.',
      '<strong>Linen or linen-cotton</strong> — for summer dresses.',
      '<strong>Lyocell or modal jersey</strong> — for casual day dresses with drape.'
    ],
    weight_note: 'For dresses that flatter curvier shapes, weight and structure trump everything. A thin clingy fabric magnifies; a substantial fabric with drape skims. <strong>Lined</strong> dresses (with a cupro or viscose lining) sit better.',
    avoid: [
      '<strong>Pure polyester occasion dresses</strong> — common but suffocating; will smell after a single wear.',
      '<strong>Bodycon in polyester/elastane</strong> — exhausting to wear, no breathability.',
      '<strong>Viscose jersey day dresses</strong> — stretch out by lunchtime, look slept-in.'
    ]
  },
  skirt: {
    name: 'Skirts',
    sub: 'A neglected basic',
    ideal: [
      '<strong>Wool or wool blend</strong> — for tailored pencil and A-line skirts.',
      '<strong>Cotton + small elastane</strong> — for fitted skirts.',
      '<strong>Silk or silk-blend</strong> — for slip and bias-cut skirts.',
      '<strong>Linen</strong> — for summer A-line and midi skirts.',
      '<strong>Lyocell</strong> — modern, drapes like rayon but holds shape better.',
      '<strong>Leather or suede</strong> — investment skirts; nothing else has that drape and longevity.'
    ],
    weight_note: 'For pencil skirts on curvy figures: a stable fabric with <strong>1–3% elastane</strong> is ideal — gives without bagging.',
    avoid: [
      '<strong>Pleated polyester midi skirts</strong> — pleats fall out, fabric clings statically.',
      '<strong>Pure viscose skirts</strong> — drape lovely but stretch out at the seat.',
      '<strong>Cheap faux leather (PU)</strong> — peels and cracks within a year.'
    ]
  }
};

// ---------- CAPSULE WARDROBE ----------
const CAPSULE = {
  foundation: {
    intro: 'Your foundation wardrobe — the year-round pieces that anchor every season. Build these first.',
    categories: [
      {
        name: 'Foundation Layers',
        items: [
          { name: 'White cotton t-shirt', essential: true, desc: 'Plain crew or v-neck. Two if budget allows.', spec: '100% cotton or 95% cotton + 5% elastane. Heavyweight (180gsm+).' },
          { name: 'Black cotton t-shirt', essential: true, desc: 'The other half of the duo.', spec: '100% cotton or 95% cotton + 5% elastane.' },
          { name: 'White poplin shirt', essential: true, desc: 'Worn open as a layer, buttoned with trousers, knotted with jeans.', spec: '100% cotton poplin, two-ply if possible.' },
          { name: 'Silk or lyocell camisole', essential: false, desc: 'Under blazers, under knits, with high-waist trousers.', spec: '100% silk or Tencel/lyocell. Cream, black or nude.' },
          { name: 'Striped Breton top', essential: false, desc: 'The Parisian classic. Long-sleeve, weight enough to wear alone.', spec: '100% cotton, mid-weight knit.' }
        ]
      },
      {
        name: 'Foundation Bottoms',
        items: [
          { name: 'Dark indigo straight or slim jeans', essential: true, desc: 'Dress up with a blazer, down with a tee. The most-worn item in the wardrobe.', spec: '98% cotton + 2% elastane (straight) or 92% cotton + 6% elastane + 2% polyester (slim).' },
          { name: 'Black tailored trousers', essential: true, desc: 'Cigarette or wide-leg, your call. Should hit at the ankle.', spec: 'Wool blend (60%+ wool) + elastane, OR cotton + elastane in a structured weave.' },
          { name: 'Cream/ecru trousers', essential: false, desc: 'The Parisian alternative to navy. Wide-leg or cigarette.', spec: 'Wool, cotton-twill, or linen-blend depending on season.' }
        ]
      },
      {
        name: 'Foundation Tailoring',
        items: [
          { name: 'Black or navy blazer', essential: true, desc: 'Single-breasted, slightly oversized or cropped — your shape. The one piece that elevates everything.', spec: 'Wool 90%+ with cupro/viscose lining (NOT polyester lining). Half-canvas construction if possible.' },
          { name: 'Tailored shirtdress', essential: false, desc: 'Belt it, layer over jeans, wear alone. Most versatile dress shape.', spec: 'Cotton poplin or sateen, possibly with small elastane.' }
        ]
      },
      {
        name: 'Foundation Footwear',
        items: [
          { name: 'White leather trainers', essential: true, desc: 'Minimal, low-profile. Common Projects / Veja / Stan Smith silhouette.', spec: 'Full-grain leather upper. Not "leather look" / PU.' },
          { name: 'Black leather ankle boots', essential: true, desc: 'Block heel, pointed or almond toe. Year-round.', spec: 'Full-grain leather upper, leather or rubber sole.' },
          { name: 'Ballet flats or loafers', essential: true, desc: 'For tailored looks, work, summer.', spec: 'Full-grain leather. Sambag/Repetto/Aeyde silhouette.' },
          { name: 'Leather handbag (medium)', essential: true, desc: 'Structured, dark brown or black. Carries you through everything.', spec: 'Full-grain or top-grain leather. Worth saving for one good one.' }
        ]
      },
      {
        name: 'Foundation Accessories',
        items: [
          { name: 'Slim leather belt (black)', essential: true, desc: 'Plain buckle, dress weight.', spec: 'Full-grain leather.' },
          { name: 'Slim leather belt (brown/tan)', essential: false, desc: 'For warmer outfits.', spec: 'Full-grain leather.' },
          { name: 'Silk scarf', essential: false, desc: 'The Parisian flourish. Worn at the neck, on the bag, in the hair.', spec: '100% silk twill.' },
          { name: 'Gold-tone everyday earrings', essential: false, desc: 'Small hoops or studs. Worn daily.', spec: 'Solid gold-plated or vermeil; not flash-plated.' },
          { name: 'Watch or delicate bracelet', essential: false, desc: 'A small wrist anchor.', spec: 'Metal or leather strap.' }
        ]
      }
    ]
  },

  spring: {
    intro: 'Spring layers over your foundation. Lighter weights, the first colour, transitional outerwear.',
    categories: [
      {
        name: 'Tops & Knits',
        items: [
          { name: 'Lightweight cotton or linen shirt', essential: true, desc: 'In white, blue stripe, or a soft colour. Worn open or buttoned.', spec: '100% cotton, or cotton + linen blend.' },
          { name: 'Fine merino crew jumper', essential: true, desc: 'For cool mornings. Beige, navy, or cream.', spec: '100% merino wool, fine gauge.' },
          { name: 'Lightweight cardigan', essential: false, desc: 'Cropped or longline. The "throw-over."', spec: '100% cotton, merino, or cashmere blend (no acrylic).' }
        ]
      },
      {
        name: 'Bottoms',
        items: [
          { name: 'Cropped or ankle-length jeans', essential: false, desc: 'A lighter wash for spring.', spec: 'As foundation jeans, lighter colour.' },
          { name: 'A-line midi skirt', essential: false, desc: 'Worn with knits and trainers, or shirt and flats.', spec: 'Cotton, linen, or wool-blend.' }
        ]
      },
      {
        name: 'Outerwear',
        items: [
          { name: 'Trench coat', essential: true, desc: 'The non-negotiable spring piece. Knee-length, belted, classic beige or stone.', spec: 'Cotton gabardine, or cotton + polyester blend (for water resistance). 50%+ cotton minimum.' },
          { name: 'Light wool blazer or cropped jacket', essential: false, desc: 'For days when the trench is too much.', spec: 'Tropical wool or cotton-blend.' }
        ]
      },
      {
        name: 'Footwear',
        items: [
          { name: 'Loafers or moccasins', essential: true, desc: 'For when boots are too much, trainers too little.', spec: 'Full-grain leather.' },
          { name: 'Low-block-heel sandals', essential: false, desc: 'For warmer spring days.', spec: 'Leather upper.' }
        ]
      }
    ]
  },

  summer: {
    intro: 'Summer in linen and cotton. Less synthetic, more breath. Lighter colours, simpler shapes.',
    categories: [
      {
        name: 'Tops',
        items: [
          { name: 'Linen or cotton shirt (short or long sleeve)', essential: true, desc: 'White, blue, or pinstripe. Loose enough to be elegant in heat.', spec: '100% linen, or linen + cotton blend.' },
          { name: 'Fitted cotton tee or vest', essential: true, desc: 'For under linen pieces and alone.', spec: '100% cotton, or cotton + small elastane.' },
          { name: 'Silk or lyocell camisole', essential: false, desc: 'With trousers or under unbuttoned shirt.', spec: '100% silk or lyocell.' }
        ]
      },
      {
        name: 'Bottoms',
        items: [
          { name: 'Linen wide-leg trousers', essential: true, desc: 'The summer trouser. Cream, beige, or navy.', spec: '100% linen, or linen + cotton blend.' },
          { name: 'White or cream denim', essential: false, desc: 'For when a polished casual look is needed.', spec: '98% cotton + 2% elastane.' },
          { name: 'Cotton or linen midi skirt', essential: false, desc: 'A-line or bias cut.', spec: '100% cotton, linen, or linen blend.' }
        ]
      },
      {
        name: 'Dresses',
        items: [
          { name: 'Linen midi or maxi dress', essential: true, desc: 'Shirt-dress, bias-cut slip, or A-line. The summer hero.', spec: '100% linen or linen + viscose blend.' },
          { name: 'Cotton sundress', essential: false, desc: 'For lighter days. Strappy or with sleeves.', spec: '100% cotton or cotton-linen.' }
        ]
      },
      {
        name: 'Footwear',
        items: [
          { name: 'Leather sandals (flat or low heel)', essential: true, desc: 'Elegant, simple — Ancient Greek Sandals / The Row / Birkenstock-style.', spec: 'Full-grain leather.' },
          { name: 'Espadrilles', essential: false, desc: 'For relaxed summer days.', spec: 'Canvas or linen upper, jute sole.' }
        ]
      },
      {
        name: 'Accessories',
        items: [
          { name: 'Straw or raffia bag', essential: false, desc: 'A summer alternative to leather.', spec: 'Real raffia / straw / woven natural fibres.' },
          { name: 'Sunglasses (classic shape)', essential: true, desc: 'Tortoiseshell or black; round, oval, or aviator.', spec: 'Quality acetate frame; UV400 lenses.' }
        ]
      }
    ]
  },

  autumn: {
    intro: 'Layering season — the most stylish months. Warmer fibres added back over the foundation.',
    categories: [
      {
        name: 'Knitwear',
        items: [
          { name: 'Cashmere or merino crewneck jumper', essential: true, desc: 'In camel, cream, navy, or grey.', spec: '100% cashmere (2-ply), 100% merino, or merino + cashmere blend. NO acrylic.' },
          { name: 'Cable knit or chunky jumper', essential: true, desc: 'For weekends and walks. Oversized fit looks best.', spec: '100% wool, lambswool, or merino + cashmere blend.' },
          { name: 'Roll-neck / turtleneck (fine)', essential: false, desc: 'Layered under blazers and over shirts.', spec: '100% merino wool, fine gauge.' },
          { name: 'Long cardigan', essential: false, desc: 'Worn instead of a jacket on milder days.', spec: 'Wool, cotton, or wool-blend (no acrylic).' }
        ]
      },
      {
        name: 'Tops',
        items: [
          { name: 'Long-sleeve cotton or silk top', essential: false, desc: 'For under jumpers and alone with trousers.', spec: '100% cotton or silk.' }
        ]
      },
      {
        name: 'Bottoms',
        items: [
          { name: 'Wool tailored trousers', essential: true, desc: 'Heavier weight than summer. Charcoal, brown, or burgundy in addition to black.', spec: 'Wool 70%+ with elastane, or pure wool flannel.' },
          { name: 'Corduroy trousers', essential: false, desc: 'Autumnal alternative. Wide-leg works best.', spec: 'Cotton corduroy + small elastane.' }
        ]
      },
      {
        name: 'Outerwear',
        items: [
          { name: 'Trench (worn again)', essential: false, desc: 'Layered over knits.', spec: 'See spring spec.' },
          { name: 'Wool overcoat or short wool jacket', essential: true, desc: 'Bridge between trench and winter coat. Camel, brown, or grey.', spec: 'Wool 70%+, ideally 100% wool or wool + cashmere blend.' },
          { name: 'Leather jacket (biker or blouson)', essential: false, desc: 'For the everyday-cool element.', spec: 'Full-grain leather. NOT PU/faux leather.' }
        ]
      },
      {
        name: 'Footwear',
        items: [
          { name: 'Knee-high or mid-calf leather boots', essential: true, desc: 'Block heel or flat. Riding-boot or sleek shaft.', spec: 'Full-grain leather upper, leather sole or proper rubber.' },
          { name: 'Suede ankle boots', essential: false, desc: 'A warmer texture for autumn.', spec: 'Real suede, not "suedette."' }
        ]
      }
    ]
  },

  winter: {
    intro: 'Winter is when material quality shows most. The wrong coat is misery; the right one lasts a decade.',
    categories: [
      {
        name: 'Heavy Knitwear',
        items: [
          { name: 'Chunky polo-neck or roll-neck jumper', essential: true, desc: 'Cream or black is most useful. Worn with everything.', spec: '100% wool, lambswool, or wool + cashmere. Min 2-ply.' },
          { name: 'Heavy cardigan or knit blazer', essential: false, desc: 'For warmth at home or layering out.', spec: 'Wool or wool + cashmere; no acrylic.' }
        ]
      },
      {
        name: 'Layers',
        items: [
          { name: 'Thermal long-sleeve base layer', essential: true, desc: 'Worn invisibly under shirts and knits. Game-changing for warmth without bulk.', spec: '100% merino wool (Icebreaker / Smartwool / Uniqlo Heattech — heattech is synthetic but works).' },
          { name: 'Silk or merino tights/leggings', essential: false, desc: 'Under trousers in deep cold.', spec: 'Merino wool, or wool blend.' }
        ]
      },
      {
        name: 'Outerwear (the investments)',
        items: [
          { name: 'Long wool overcoat', essential: true, desc: 'Mid-thigh to mid-calf length. Camel, black, navy, or grey. The single most-worn winter item.', spec: 'Minimum 70% wool — ideally 100% wool or wool + cashmere. 500gsm+ fabric weight. Inner lining cupro or viscose (NOT polyester).' },
          { name: 'Quilted or down puffer (optional)', essential: false, desc: 'For extreme cold or sportier days.', spec: 'Real goose down (600+ fill power) or properly insulated. Outer can be nylon/poly (here it\'s functional).' }
        ]
      },
      {
        name: 'Bottoms',
        items: [
          { name: 'Heavier wool or flannel trousers', essential: true, desc: 'A winter version of your tailored trousers.', spec: 'Wool flannel, or wool 70%+ blend.' },
          { name: 'Dark winter jeans', essential: true, desc: 'Heavier weight denim than summer.', spec: '98% cotton + 2% elastane; 12oz+ weight if available.' }
        ]
      },
      {
        name: 'Footwear',
        items: [
          { name: 'Leather knee boots (winter weight)', essential: true, desc: 'Lined, weather-resistant.', spec: 'Full-grain leather, rubber sole for grip.' },
          { name: 'Chelsea or Chunky-sole boots', essential: false, desc: 'For weekends and pavement weather.', spec: 'Full-grain leather, lugged rubber sole.' }
        ]
      },
      {
        name: 'Accessories',
        items: [
          { name: 'Cashmere or wool scarf (oversized)', essential: true, desc: 'The single accessory that does most of the work.', spec: '100% cashmere or 100% wool. Avoid acrylic blends.' },
          { name: 'Leather gloves (lined)', essential: true, desc: 'Cashmere or wool lined.', spec: 'Full-grain leather upper, cashmere or wool lining.' },
          { name: 'Wool beret or beanie', essential: false, desc: 'Beret for elegance, beanie for the weekend.', spec: '100% wool or wool + cashmere.' }
        ]
      }
    ]
  }
};

// ---------- HAND-FEEL TESTS (in-store physical checks) ----------
const HAND_FEEL_TESTS = [
  {
    name: 'The Scrunch Test',
    icon: '✋',
    when: 'Trousers, blazers, dresses, anything you want to look pressed.',
    how: 'Grab a fistful of the fabric, squeeze hard for five seconds, let go.',
    pass: 'Wrinkles fall out within a minute — good recovery, will wear sharp.',
    fail: 'Stays creased and bunched — will look slept-in by lunchtime.',
    note: 'Linen always fails this test — but that\'s linen\'s charm. Apply it to wool, cotton, and "smart" fabrics where crispness matters.'
  },
  {
    name: 'The Light-Through Test',
    icon: '☀',
    when: 'T-shirts, white shirts, anything that needs to not be see-through.',
    how: 'Hold the garment up to a window or shop light. Check if you can see your hand or the light through it.',
    pass: 'Substantial, opaque — you can\'t see your hand clearly through it.',
    fail: 'You can read text through it. Will be sheer when worn, won\'t last ten washes.',
    note: 'Particularly important for white tees and shirts where seeing your bra is the giveaway of poor fabric weight.'
  },
  {
    name: 'The Fingernail Scrape',
    icon: '✦',
    when: 'Knitwear, jumpers, soft sweatshirts, anything fuzzy.',
    how: 'Scrape the surface lightly with your fingernail in one direction, then check what comes up.',
    pass: 'Nothing or very little lifts. Tight fibres, won\'t pill quickly.',
    fail: 'Loose fibres lift up immediately or you see fluff under your nail. This is what will become bobbles within weeks.',
    note: 'The single most predictive test for pilling. If it fails this in the shop, it will pill at home — guaranteed.'
  },
  {
    name: 'The Stretch & Release',
    icon: '↔',
    when: 'Jeans, fitted trousers, knit dresses, anything with stretch.',
    how: 'Pull a section of fabric horizontally between your hands. Hold for five seconds. Release.',
    pass: 'Snaps back to original shape immediately. Good recovery, won\'t bag.',
    fail: 'Stays stretched, looks distorted, or feels limp. Will sag at the knees, seat, or elbows within hours of wearing.',
    note: 'Crucial for skinny jeans on curvier figures — poor recovery means knee-bags by midday.'
  },
  {
    name: 'The Weight Test',
    icon: '⚖',
    when: 'Coats, blazers, trousers, any "structured" piece.',
    how: 'Lift the garment off the hanger. Feel its weight in your hands.',
    pass: 'Substantial, has heft. A wool coat should feel like a coat. Tailored trousers should drape rather than float.',
    fail: 'Feels flimsy or paper-light. Means thin fabric, no insulation (in coats), no drape (in trousers).',
    note: 'For a winter coat: it should feel heavy enough that you notice when you put it down.'
  },
  {
    name: 'The Seam Pull',
    icon: '✕',
    when: 'Any garment — checks construction, not just fabric.',
    how: 'Find a seam. Gently pull on either side of it. Look at the stitching.',
    pass: 'Tight, even, no gaps appear between stitches. Stitches run straight.',
    fail: 'Gaps open up between stitches, or you can see the fabric through the seam. Wonky stitching, loose threads.',
    note: 'A great fabric ruined by cheap construction will fail at the seams long before the fabric wears out.'
  },
  {
    name: 'The Drape Test',
    icon: '〰',
    when: 'Dresses, skirts, trousers, blouses.',
    how: 'Hold the garment up by its shoulders or waistband. Let it hang naturally for ten seconds.',
    pass: 'Falls in smooth, natural lines. Skirts hang straight. Trouser legs hang neat.',
    fail: 'Sticks out stiffly, clings statically, or twists out of shape. Means cheap synthetic or poor cut.',
    note: 'Particularly important for skirts and trousers on curvier figures — drape skims, stiffness emphasises.'
  },
  {
    name: 'The Cool Touch',
    icon: '❄',
    when: 'When the label is missing or you suspect mislabelling.',
    how: 'Press the fabric to the inside of your wrist or your cheek.',
    pass: 'Feels cool to the touch — sign of natural fibres (cotton, linen, silk, wool).',
    fail: 'Feels warm or neutral immediately — likely heavy synthetic content even if the label says otherwise.',
    note: 'Not foolproof but a quick sanity check. Synthetics retain skin warmth; naturals dissipate it.'
  }
];

// ---------- BRAND INTELLIGENCE (UK mid-range) ----------
const BRANDS = [
  {
    name: 'Massimo Dutti',
    tier: 'Upper mid-range',
    price: '£60–250',
    strong: [
      'Tailored trousers — wool blends with proper structure',
      'Leather goods (bags, belts, boots) — genuine full-grain leather at sensible prices',
      'Knitwear — frequently 100% wool or wool/cashmere blends, acrylic-free'
    ],
    watch: [
      'Sale items can be the older stock with synthetic blends — check labels',
      'Some "wool" coats drop to 60% wool with synthetic mix; verify before buying',
      'Sizing runs slim and small — try in store or order one size up'
    ],
    best_for: 'The polished workhorse blazer. Wool trousers. A good leather bag.',
    sweet_spot: 'Mid-season sales (June, December) — quality stays high.'
  },
  {
    name: 'COS',
    tier: 'Upper mid-range',
    price: '£45–250',
    strong: [
      'Knitwear — reliably acrylic-free, often pure wool, merino or cashmere blends',
      'Architectural basics — cotton shirts, oversized blazers in proper wool',
      'Tencel and lyocell pieces with genuine drape'
    ],
    watch: [
      'Cotton trousers can be too lightweight for proper structure',
      'Some "wool" pieces are blended down with viscose, which affects longevity',
      'Recent collections have trended towards more synthetic blends than older COS'
    ],
    best_for: 'A merino crewneck. An oversized wool blazer. Linen shirts in summer.',
    sweet_spot: 'End of season sales, particularly January and July.'
  },
  {
    name: 'Arket',
    tier: 'Mid-range',
    price: '£35–250',
    strong: [
      'Cotton basics — often heavyweight (180–230gsm), proper opacity',
      'Knitwear — merino and wool with no acrylic, clear composition labelling',
      'Coats — frequently 100% wool or wool/cashmere blends'
    ],
    watch: [
      'Trousers can lack structure — check the weight in hand',
      'Some pieces use recycled polyester; fine for outerwear linings, less ideal for everyday tops'
    ],
    best_for: 'White t-shirts that survive. Heavy knit jumpers. Wool overcoats.',
    sweet_spot: 'Mid-season events; outlet store if near one.'
  },
  {
    name: 'Mango',
    tier: 'Mid-range',
    price: '£20–150',
    strong: [
      'Sculpt jeans — 92% cotton / 6% elastane / 2% polyester blend ideal for curvier figures',
      'Tailored trousers — surprising quality at the price (often wool blends)',
      'Blazers in the Premium / Selected lines (sometimes 90%+ wool)'
    ],
    watch: [
      'Standard non-"Premium" line is often viscose-heavy or polyester-blend — verify the line',
      'Knitwear frequently contains acrylic — read every label',
      '"Wool effect" coats are often <50% wool'
    ],
    best_for: 'Their Sculpt jeans specifically. Premium line tailoring at sale prices.',
    sweet_spot: 'Black Friday and January for the Premium/Selected pieces.'
  },
  {
    name: '& Other Stories',
    tier: 'Mid-range',
    price: '£30–250',
    strong: [
      'Silk camisoles and blouses at relatively gentle prices',
      'Wool blazers and coats with cupro/viscose lining (not polyester)',
      'Cotton dresses with proper weight'
    ],
    watch: [
      'Sizing varies wildly between collections — always try on',
      'Some pieces use viscose where you\'d expect silk; check labels',
      'Knitwear sometimes blends in acrylic'
    ],
    best_for: 'A silk camisole. A wool blazer with good lining. Cotton sundresses.',
    sweet_spot: 'Sale season — quality holds, prices drop significantly.'
  },
  {
    name: 'M&S (Autograph & Collection)',
    tier: 'Mid-range',
    price: '£15–150',
    strong: [
      'Magic Shaping jeans — proper stretch + recovery blend for curvier figures',
      'Autograph cashmere — usually 2-ply, sometimes single — check ply if possible',
      'Tailoring in the Autograph line — wool blends with structure',
      'White cotton shirts — properly heavyweight, opaque'
    ],
    watch: [
      'Standard "Collection" line knitwear often contains acrylic — Autograph is safer',
      'Many pieces blend in significant polyester or viscose; check labels even for Autograph',
      'Coats range wildly — from genuine 80%+ wool to mostly synthetic'
    ],
    best_for: 'Magic Shaping jeans. Autograph wool coats. White shirts. Cashmere if it\'s 2-ply.',
    sweet_spot: 'Sparks card members get early sale access; Autograph drops in January and July.'
  },
  {
    name: 'Reiss',
    tier: 'Upper mid-range',
    price: '£80–400',
    strong: [
      'Tailoring — proper wool, half-canvas blazers at the upper end',
      'Coats — many genuine 100% wool or wool/cashmere',
      'Dresses with weight and structure for curvier figures'
    ],
    watch: [
      'Prices have crept up; not always worth full RRP',
      'Some "wool blend" knits contain acrylic; check labels',
      'Lining can be polyester even on wool blazers — feel inside'
    ],
    best_for: 'A proper investment blazer or wool coat. Tailored dresses.',
    sweet_spot: 'End-of-season sales; outlet stores deliver good value.'
  },
  {
    name: 'Whistles',
    tier: 'Upper mid-range',
    price: '£70–350',
    strong: [
      'Wool blazers and tailoring',
      'Cotton shirts and silk-blend blouses',
      'Day-to-evening dresses in natural fibres'
    ],
    watch: [
      'Recent collections have leaned more into viscose for "drape"',
      'Some knitwear blends contain acrylic',
      'Better in physical stores where you can check labels and feel'
    ],
    best_for: 'Workwear staples — blazers, midi skirts, silk blouses.',
    sweet_spot: 'Outlet shopping, mid-season sales.'
  },
  {
    name: 'Sezane',
    tier: 'Upper mid-range',
    price: '£60–400',
    strong: [
      'French-girl aesthetic done with proper materials — cotton, wool, silk',
      'Knitwear often pure merino or wool/cashmere with no acrylic',
      'The classic blouses are usually 100% cotton or silk-blend'
    ],
    watch: [
      'Sizing runs small even for European brands — order up',
      'Restocks sell out fast; sale items rarely return',
      'Some viscose pieces masquerade as silk — read labels'
    ],
    best_for: 'A Parisian-style cotton blouse. A merino jumper. Wool blazers.',
    sweet_spot: 'Their semi-annual sales (sale-archives are the only sale they do).'
  },
  {
    name: 'Uniqlo',
    tier: 'Budget-friendly',
    price: '£15–80',
    strong: [
      '100% Premium Lambswool / Extra Fine Merino jumpers — well below market price for the quality',
      'Heattech base layers — synthetic but functional in extreme cold',
      'Cotton tees with proper weight at low prices',
      'Cashmere — single ply mostly but pure cashmere, no blends'
    ],
    watch: [
      'Trousers and blazers are mostly synthetic blends — skip for tailoring',
      'Cashmere is single-ply, so will pill more than 2-ply but very affordable to replace',
      'Some "wool" pieces are blends with acrylic'
    ],
    best_for: 'The merino crewneck (one of the best £30–40 pieces in the high street). Cashmere on a budget.',
    sweet_spot: 'Their pricing is already so good; black Friday for the most discount.'
  },
  {
    name: 'Brora',
    tier: 'Upper mid-range / Premium',
    price: '£100–500',
    strong: [
      'Pure cashmere, often Scottish-spun and 2-ply or thicker',
      'Cashmere/wool blends genuinely cashmere-rich, not 5% novelty',
      'Tweed and lambswool pieces — proper heritage materials'
    ],
    watch: [
      'Full price is steep — wait for sale unless it\'s the perfect piece',
      'Cuts can be classic-to-the-point-of-conservative — try on'
    ],
    best_for: 'A cashmere investment — the jumper that lasts ten years.',
    sweet_spot: 'Their outlet (mid-season and end-of-season online sales reduce by 40–60%).'
  },
  {
    name: 'Aligne',
    tier: 'Upper mid-range',
    price: '£70–300',
    strong: [
      'Tailoring in real wool with thoughtful construction',
      'Coats often 80%+ wool or wool/recycled blends',
      'Cotton and linen pieces with proper weight'
    ],
    watch: [
      'A newer brand — quality has varied between collections',
      'Some pieces are recycled polyester focused, which is fine for outerwear shells'
    ],
    best_for: 'A modern, tailored coat. Wool trousers with shape.',
    sweet_spot: 'Sales tend to be deep when they happen.'
  }
];

// ---------- CARE GUIDE (per-fibre care to extend life) ----------
const CARE_GUIDE = [
  {
    fibre: 'Wool & Merino',
    icon: '🐏',
    summary: 'The fibre that needs the least washing. Wool is naturally antibacterial — air it out rather than washing it.',
    wash: [
      'Wash only when actually dirty — every 5–10 wears at most.',
      'Hand-wash in cool water with wool detergent (Ecover, The Laundress, Woolite) OR use the wool cycle (max 30°C, slow spin).',
      'Never use regular detergent — enzymes attack the wool fibres.',
      'Never use fabric softener — coats the fibres and reduces breathability.'
    ],
    dry: [
      'Lay flat on a clean towel; reshape gently before drying.',
      'Never hang wet — gravity stretches the shoulders and waist permanently.',
      'Never tumble dry — shrinks, felts, ruins.',
      'Keep away from radiators and direct sun.'
    ],
    store: [
      'Fold, never hang. Hangers create permanent shoulder dimples.',
      'Store with cedar blocks or lavender to deter moths (NOT mothballs — they reek).',
      'In summer, store in breathable cotton bags, not plastic.'
    ],
    revive: 'Pilling? Use a fabric comb or proper de-bobbler (Philips brand is excellent) — works miracles. Smell? Hang in a steamy bathroom overnight; wool releases odour by itself.'
  },
  {
    fibre: 'Cashmere',
    icon: '✨',
    summary: 'Treated as delicate, but actually durable if handled correctly. The pilling you see in the first month is short fibres releasing — it stops.',
    wash: [
      'Hand-wash in cool water with cashmere shampoo (or baby shampoo at a push).',
      'Squeeze gently — never wring or twist.',
      'Rinse twice, very gently.',
      'Machine wool cycle is acceptable in a mesh bag for sturdier pieces — never for fine knits.'
    ],
    dry: [
      'Roll in a clean towel to remove excess water.',
      'Lay flat to dry, reshape carefully.',
      'NEVER hang — cashmere stretches permanently within hours.',
      'Away from heat and sun.'
    ],
    store: [
      'Fold flat in a drawer or shelf, not on hangers.',
      'Cedar or lavender essential.',
      'In summer, washed clean (moths eat dirty cashmere preferentially) and stored in breathable bags.'
    ],
    revive: 'De-bobble after the first month — initial pilling is normal short-fibre shedding and stops. After a year, gentle hand-wash actually softens cashmere further. A reputable steamer (not iron) removes wrinkles without damage.'
  },
  {
    fibre: 'Cotton',
    icon: '🌱',
    summary: 'Forgiving, but small care steps significantly extend life and prevent shrinkage.',
    wash: [
      'Cool to warm wash (30–40°C) — hot wash shrinks, fades, weakens fibres.',
      'Turn dark cottons inside-out to preserve colour.',
      'Wash whites separately with oxygen-based whitener (not bleach — bleach weakens fibres).',
      'Mild liquid detergent rather than powder, which can leave residue.'
    ],
    dry: [
      'Line-dry where possible — sunlight naturally brightens whites.',
      'Tumble dry on low only when needed; high heat is what causes most cotton shrinkage.',
      'Remove from dryer slightly damp and hang/fold — prevents heat-set wrinkles.'
    ],
    store: [
      'Fold knitted cotton (tees, polos) — hangers stretch the neckline.',
      'Hang woven cotton (shirts, dresses) on proper hangers.',
      'Iron when slightly damp for crisp results.'
    ],
    revive: 'Dingy whites? Soak overnight in oxygen whitener (OxiClean, Vanish), then wash. Faded blacks? Black-restoring dye sachets work surprisingly well (Dylon).'
  },
  {
    fibre: 'Linen',
    icon: '🌾',
    summary: 'The most durable everyday fibre. Gets softer and more beautiful with every wash. Embrace the wrinkles.',
    wash: [
      'Machine wash on gentle, cool to warm (30°C).',
      'Mild detergent — linen tolerates more than wool but no aggressive cleaners.',
      'Wash dark linens separately for the first few washes (they release colour).'
    ],
    dry: [
      'Air-dry — linen tolerates the sun.',
      'Remove slightly damp if you want to iron; iron damp linen on the wool/cotton setting.',
      'Tumble dry on low if pressed for time — won\'t damage but will increase wrinkles.'
    ],
    store: [
      'Hang or fold; linen is shape-stable either way.',
      'Stored linen creases — give it a steam or wear-and-walk-around to drop the creases.'
    ],
    revive: 'Linen rejuvenates itself — a fresh wash and air-dry restores it. Yellowing whites respond to oxygen whitener and sunlight.'
  },
  {
    fibre: 'Silk',
    icon: '✦',
    summary: 'High maintenance but lifelong if cared for. Many silks survive hand-washing despite the dry-clean label.',
    wash: [
      'Check the label first — some silk is genuinely dry-clean only (especially structured pieces and bright dyes).',
      'For washable silks: hand-wash in cool water with silk shampoo, baby shampoo, or wool detergent.',
      'No rubbing, no wringing — gentle squeezing only.',
      'Rinse with a teaspoon of white vinegar in cool water — restores natural sheen.'
    ],
    dry: [
      'Roll in a clean towel to absorb water.',
      'Hang on a padded hanger, not in direct sun.',
      'Iron on lowest "silk" setting, on the inside, while still slightly damp.'
    ],
    store: [
      'Hang on padded hangers.',
      'Keep away from direct sunlight — silk yellows in light over time.',
      'No deodorant or perfume contact — both damage silk fibres permanently.'
    ],
    revive: 'Sweat stains on silk? Don\'t panic — sponge with cool water and a touch of white vinegar, then proper hand-wash. For dry-clean-only pieces, see a specialist quickly; old sweat stains are nearly impossible to remove.'
  },
  {
    fibre: 'Denim',
    icon: '👖',
    summary: 'Wash far less than you think. Most denim improves with rare washing and develops better fade and fit.',
    wash: [
      'Every 10 wears or so — not every wear.',
      'Inside out, cold wash (30°C max), gentle cycle.',
      'Mild liquid detergent.',
      'No fabric softener — breaks down the stretch and recovery.',
      'For dark indigo: separate or with darks only.'
    ],
    dry: [
      'Hang to dry — extends life massively.',
      'NEVER tumble dry stretch jeans — destroys the elastane.',
      'Reshape damp jeans by stretching gently before hanging.'
    ],
    store: [
      'Fold or hang — either works.',
      'Hang by the waistband (not over the bar, which creates a crease).'
    ],
    revive: 'Knee bags? Wash inside out, hang dry, and they often shrink back. Smell-only refresh? Hang outside in cold air for a day, or use the freezer trick: bag and freeze for 24 hours (kills bacteria, no wash needed).'
  },
  {
    fibre: 'Leather (bags, shoes, jackets)',
    icon: '🐂',
    summary: 'The longest-lived material in your wardrobe IF you care for it. Decades, not seasons.',
    wash: [
      'Never machine wash anything leather.',
      'Spot-clean with a damp cloth and saddle soap or specific leather cleaner.',
      'For salt stains on boots: mix one part white vinegar to one part water, sponge gently, let dry naturally.'
    ],
    dry: [
      'Air-dry naturally, away from heat — heat cracks leather.',
      'For wet leather shoes: stuff with newspaper and let dry slowly over 24–48 hours.',
      'Never use a hairdryer.'
    ],
    store: [
      'Use shoe trees for boots and shoes (cedar absorbs moisture).',
      'Stuff bags with tissue paper when not in use to hold shape.',
      'Store in dust bags away from sunlight (which fades).',
      'Don\'t store in plastic — leather needs to breathe.'
    ],
    revive: 'Polish shoes monthly with cream polish in the matching colour, then buff. Condition bags every 3–6 months with leather conditioner (Apple Brand, Saphir). Scuffs on leather often respond to colour-matched cream polish; deeper scratches need a specialist.'
  },
  {
    fibre: 'Synthetics (Polyester, Acrylic, Nylon)',
    icon: '◇',
    summary: 'Won\'t last regardless of care, but a few habits prevent the worst issues.',
    wash: [
      'Cool wash only — heat warps and pills synthetics fast.',
      'Inside out always.',
      'Wash inside a mesh laundry bag to reduce microfibre shedding into waterways.',
      'Avoid fabric softener — coats synthetics and reduces breathability further.'
    ],
    dry: [
      'Air dry only — tumble drying melts and pills synthetics.',
      'Direct sun is fine for synthetics.'
    ],
    store: [
      'Fold or hang as appropriate to garment type.',
      'Synthetic knitwear should always be folded — hangers permanently stretch the shoulders.'
    ],
    revive: 'Pilled synthetics rarely recover gracefully — fabric combs help temporarily but the bobbles return fast. Use this as the prompt to phase synthetic pieces out of the wardrobe and replace with natural fibres over time.'
  }
];

// ---------- SHOPPING RULES ----------
const RULES = [
  {
    num: 'I',
    title: 'Read the label before you read the price tag.',
    body: '<strong>Always check composition first.</strong> If a "wool blazer" is 30% wool and 70% polyester, you\'re paying wool prices for a synthetic jacket. The composition is the truth; everything else is marketing.'
  },
  {
    num: 'II',
    title: 'Buy in this order: cost-per-wear, not price.',
    body: 'A £200 wool coat worn 100 days a year for five years = <strong>£0.40 per wear</strong>. A £40 acrylic coat worn 30 days before pilling = <strong>£1.33 per wear</strong>. The "expensive" coat is the cheaper coat.'
  },
  {
    num: 'III',
    title: 'Spend most on the things you wear most.',
    body: '<strong>Coats, blazers, boots, jeans, leather handbag.</strong> These are seen in every outfit and worn hundreds of times. Skimp on novelty — the trend tee, the seasonal-colour skirt — not on the foundation.'
  },
  {
    num: 'IV',
    title: 'The mid-range sweet spot.',
    body: 'For the UK/EU: <strong>Massimo Dutti, COS, Arket, Mango, & Other Stories, Reiss, Whistles, Jigsaw, Sezane, Aligne.</strong> Sales are reliable; sign up to newsletters and buy out of season. M&S Autograph and Hobbs do well on tailoring. For knitwear specifically: <strong>Uniqlo merino, COS, Brora outlet, Mark&Spencer cashmere</strong> punch well above their price.'
  },
  {
    num: 'V',
    title: 'Try the fingernail test.',
    body: 'In the shop: <strong>scrape the surface lightly with your fingernail.</strong> If little fibres come up easily, expect pilling. <strong>Pinch the fabric and let go.</strong> If it doesn\'t spring back, it will bag and stretch. <strong>Hold it up to the light.</strong> If you can see through a t-shirt, it\'s underweight.'
  },
  {
    num: 'VI',
    title: 'Three colours only.',
    body: 'Pick a <strong>neutral base</strong> (black, navy, or camel), a <strong>second neutral</strong> (cream, white, beige), and <strong>one accent</strong> (burgundy, forest, soft pink — your choice). Every new buy must work in this palette. This is the secret to mix-and-match: it requires fewer pieces.'
  },
  {
    num: 'VII',
    title: 'One in, one out.',
    body: 'Buying a new white tee? <strong>The worn-out one leaves.</strong> Buying a new blazer? An old one goes to consignment or donation. This prevents creeping back to the cluttered wardrobe.'
  },
  {
    num: 'VIII',
    title: 'Wait 72 hours on anything over £100.',
    body: 'If you still want it three days later, buy it. <strong>Most impulse buys fail this test.</strong> The impulse fades; the genuinely needed item doesn\'t.'
  },
  {
    num: 'IX',
    title: 'Care extends life by years.',
    body: '<strong>Wash less, wash cold, hang dry.</strong> Knits especially: hand-wash or wool cycle, lay flat to dry, store folded (never hung — they stretch). Steam rather than iron. Polish leather shoes monthly. <strong>One good care routine doubles wardrobe lifespan.</strong>'
  },
  {
    num: 'X',
    title: 'The capsule is finished when…',
    body: 'You can dress for any situation — work, weekend, dinner, weather — using only items from your wardrobe, with confidence. <strong>You stop browsing; you stop wanting.</strong> That\'s the goal. Not minimalism for its own sake — relief from decision fatigue and the freedom to wear what you genuinely love every day.'
  }
];
