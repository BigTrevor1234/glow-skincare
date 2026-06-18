import { Product, Article, QuizQuestion } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'glow-cleanser',
    name: 'Purifying Lotus Milky Cleanser',
    subtitle: 'Nourishing botanical emulsion for clean, radiant base',
    price: 38.00,
    description: 'A creamy, low-foaming facial wash crafted with sacred white lotus flower extract and sweet almond seed oil. This soothing milk gently lifts deep-seated impurities, excess sebum, and environmental pollutants while completely shielding the delicate moisture barrier.',
    howToUse: 'Gently massage 2-3 pumps onto dry or damp skin in circular motions. Rinse thoroughly with lukewarm water. Use morning and night.',
    ingredients: [
      'Sacred Lotus Extract (Nelumbo Nucifera)',
      'Sweet Almond Seed Oil',
      'Panthenol (Pro-Vitamin B5)',
      'Organic Chamomile Hydrosol',
      'Glycerin',
      'Hyaluronic Acid'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop',
    skinTypes: ['Dry', 'Sensitive', 'Combination', 'Oily'],
    concerns: ['Hydration', 'Sensitivities'],
    category: 'Cleanser',
    rating: 4.8,
    reviewsCount: 142,
    inStock: true,
    size: '150 ML'
  },
  {
    id: 'bha-cleanser',
    name: 'Clarifying Salicyl Willow Bark Mud',
    subtitle: 'Exfoliating botanical clay cleanser',
    price: 42.00,
    description: 'Formulated with cold-pressed Tea Tree essence, Kaolin clay, and active salicylic acid (2%) derived from willow bark. This deep pore cleanser clears active acne blockages, minimizes pore size, and balances sebum without stripping natural skin lubricants.',
    howToUse: 'Dampen skin and gently smooth a cherry-sized amount across problematic areas. Allow to sit for 45 seconds as a quick mask, then add water and emulsify. Rinse with cool water.',
    ingredients: [
      'Willow Bark Extract (Natural BHA)',
      'Aerosolized Kaolin Clay',
      'Tea Tree Essential Oil',
      'Witch Hazel Distillate',
      'Salicylic Acid 2%',
      'Niacinamide 1%'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop',
    skinTypes: ['Oily', 'Combination'],
    concerns: ['Acne', 'Sensitivities'],
    category: 'Cleanser',
    rating: 4.6,
    reviewsCount: 98,
    inStock: true,
    size: '120 ML'
  },
  {
    id: 'hydrating-toner',
    name: 'Alpine Rose Infused Mineral Toner',
    subtitle: 'Deeply moisturizing alpine mist',
    price: 34.00,
    description: 'An ethereal, mineral-rich facial mist loaded with stem cells of Swiss Alpine Rose, Glacial Water, and high-potency Hyaluronic Acid. Instantly restores skin pH, primes skin for serum absorption, and quenches atmospheric dryness.',
    howToUse: 'Mist generously over cleansed face, neck, and décolletage. Alternatively, pat into the skin using clean palms. Apply multiple layers for optimal moisture locking.',
    ingredients: [
      'Alp Rose Stem Cell Extract',
      'Pure Swiss Glacial Mineral Complex',
      'Multi-Weight Hyaluronic Acid',
      'Rosewater Distillate',
      'Allantoin (Repairing Compound)'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
    skinTypes: ['Dry', 'Sensitive', 'Combination'],
    concerns: ['Hydration', 'Sensitivities'],
    category: 'Toner',
    rating: 4.9,
    reviewsCount: 184,
    inStock: true,
    size: '100 ML'
  },
  {
    id: 'niacinamide-serum',
    name: 'Radiance Amber Nectar Serum',
    subtitle: 'Illuminating niacinamide & peptides infusion',
    price: 68.00,
    description: 'A revolutionary brightening serum comprising 10% pure Niacinamide, Licorice Root Concentrate, and gold-conjugated Oligopeptides. This fluid targets deep hyperpigmentation, uneven post-acne scarring, and premature environmental dullness, delivering spectacular glass-skin brilliance.',
    howToUse: 'Apply 3-4 drops directly onto toned skin. Gently press into face and neck until fully absorbed. Follow with moisturizer. Ideal for daily morning application under sunscreen.',
    ingredients: [
      'Niacinamide 10% (Vitamin B3)',
      'Licorice Root Powder Extract',
      'Gold Conjugated Tri-Peptides',
      'Stabilized Ascorbyl Glucoside (Vitamin C derivative)',
      'Centella Asiatica (Cica) hydrosol'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop',
    skinTypes: ['Dry', 'Oily', 'Combination', 'Sensitive', 'All'],
    concerns: ['Dullness', 'Acne', 'Aging'],
    category: 'Serum',
    rating: 4.9,
    reviewsCount: 310,
    inStock: true,
    size: '30 ML'
  },
  {
    id: 'retinol-elixir',
    name: 'Luna Ceramide Retinol Night Nectar',
    subtitle: 'Accelerated line-reversing evening serum',
    price: 76.00,
    description: 'An advanced overnight treatment featuring micro-encapsulated Retinol (1%), Phytoceramides, and Blue Tansy organic oil. Formulated to minimize fine lines, promote cell renewal, and plump up structural sagging without the standard peeling associated with retinoids.',
    howToUse: 'Squeeze 2 drops on fingertips and sweep upwards over face. Use exclusively at night. If new to retinol, introduce slowly (twice weekly) and gradually increase frequency.',
    ingredients: [
      'Encapsulated Retinol 1%',
      'Ceramide NP, Ceramide AP, Ceramide EOP',
      'Blue Tansy Botanical Essential Oil',
      'Vegan Squalane'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?q=80&w=800&auto=format&fit=crop',
    skinTypes: ['Dry', 'Combination', 'Oily'],
    concerns: ['Aging', 'Dullness'],
    category: 'Serum',
    rating: 4.7,
    reviewsCount: 220,
    inStock: true,
    size: '30 ML'
  },
  {
    id: 'cloud-moisturizer',
    name: 'Cashmere Cloud Deep Barrier Cream',
    subtitle: 'Hyper-moisturizing lipid barrier barrier repair',
    price: 54.00,
    description: 'A decadent, ultra-sensorial whipped moisturizer formulated with an organic lipid matrix (Ceramides, Cholesterol, Squalene) and peptide-rich cloudberry butter. It immediately envelopes the skin in protective, breathable nourishment, locking in precious serum treatments.',
    howToUse: 'Warm a hazelnut-sized portion between clean palms and press gently into face, working from the center outwards. Excellent base for velvet makeup or as a restorative nocturnal shield.',
    ingredients: [
      'Nordic Cloudberry Butter',
      'Ceramide Lipid Complex (1:3:1 ratio)',
      'Oat Beta-Glucans',
      'Shea Butter Tri-Glycerides',
      'Hyaluronic Acid Tetramers'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1556228578-567ba47c943f?q=80&w=800&auto=format&fit=crop',
    skinTypes: ['Dry', 'Sensitive', 'Combination'],
    concerns: ['Hydration', 'Sensitivities'],
    category: 'Moisturizer',
    rating: 4.8,
    reviewsCount: 204,
    inStock: true,
    size: '50 ML'
  },
  {
    id: 'gel-moisturizer',
    name: 'Watermelon Glow Aqua Gel',
    subtitle: 'Ultra-lightweight oil-free hydrator',
    price: 48.00,
    description: 'An instantly refreshing, water-burst gel containing watermelon extract, organic aloe, and antioxidant-rich Gotu Kola. Ideal for warmer climates or oily pores, this hydrator delivers continuous moisture without a trace of heavy residue or pore blockages.',
    howToUse: 'Smooth generously over clean skin. Perfect for morning wear under makeup or sunscreen, providing a fresh, semi-matte canvas.',
    ingredients: [
      'Watermelon Fruit Infusion',
      'Gotu Kola (Centella Asiatica) Extract',
      'Glycerin & Squalane',
      'Organic Aloe Barbadensis Juice',
      'Green Tea Extract'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop',
    skinTypes: ['Oily', 'Combination', 'Sensitive'],
    concerns: ['Hydration', 'Acne'],
    category: 'Moisturizer',
    rating: 4.7,
    reviewsCount: 167,
    inStock: true,
    size: '60 ML'
  },
  {
    id: 'botanical-mask',
    name: 'Resurrection Algae Recovery Sleeping Mask',
    subtitle: 'Soothing mask for depleted or stressed skin',
    price: 52.00,
    description: 'An intensive balm-to-oil overnight mask containing resurrection plant molecules and arctic micro-algae. It triggers cell vitalization and completely extinguishes systemic irritation, high flaking, and winter environmental moisture depletion while you sleep.',
    howToUse: 'As the final step of your night skincare ritual, apply a generous layer over face and neck. Leave on overnight and rinse with lukewarm water in the morning.',
    ingredients: [
      'Selaginella Lepidophylla (Resurrection Plant)',
      'Arctic Chlorella Micro-Algae Essence',
      'Phytosqualane Complex',
      'Rosemary Hydrosol',
      'Vitamin E Acetate'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1590156221122-c241e7f3e2f8?q=80&w=800&auto=format&fit=crop',
    skinTypes: ['Dry', 'Sensitive', 'Combination'],
    concerns: ['Hydration', 'Sensitivities', 'Aging'],
    category: 'Mask',
    rating: 4.9,
    reviewsCount: 112,
    inStock: true,
    size: '75 ML'
  },
  {
    id: 'purity-supplement',
    name: 'Aura Complexion Daily Elixir Capsules',
    subtitle: 'Cellular support with organic probiotics & collagen',
    price: 60.00,
    description: 'A premium dietary supplement designed to nourish skin from the inside out. Formulated with marine collagen peptides, active probiotic cultures, and broad-spectrum antioxidants to bolster structural gut integrity and trigger dermal luminosity.',
    howToUse: 'Take 2 capsules daily in the morning with a full glass of water, ideally with a mindful meal.',
    ingredients: [
      'Type I hydrolyzed Marine Collagen Peptides',
      'Lactobacillus Acidophilus (Probiotics)',
      'Coenzyme Q10 Powder',
      'Pine Bark Extract (Pycnogenol)',
      'Vitamin C & Zinc'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=800&auto=format&fit=crop',
    skinTypes: ['All', 'Dry', 'Oily', 'Combination', 'Sensitive'],
    concerns: ['Aging', 'Dullness', 'Acne'],
    category: 'Supplement',
    rating: 4.8,
    reviewsCount: 89,
    inStock: true,
    size: '60 CAPSULES'
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'morning-skincare-ritual',
    title: 'The Art of the Mindful Morning Skincare Ritual',
    subtitle: 'Slowing down to truly celebrate your skin’,s morning breath.',
    category: 'Self-Care Ritual',
    readingTime: '5 MIN READ',
    date: 'May 18, 2026',
    summary: 'Transform your morning application from a hasty chore into a luxurious grounding practice that wakes up blood circulation and sets a mindful tone.',
    contentParagraphs: [
      'Your morning skincare sequence is not merely a utilitarian script to follow; it is an intimate conversation with your skin. As the barrier wakes up from overnight moisture synthesis, it is primed for replenishment. By turning this into a grounding ritual, we not only improve product efficacy but decrease salivary cortisol.',
      'Begin by inhaling the steam of fresh warm water. As you cleanse, use smooth, rhythmic upward circles. This simple motion stimulates microcirculation in the capillaries, urging oxy-hemoglobin to the surface for a natural rosy finish.',
      'When misting your toner, close your eyes. Let the micro-droplets drift onto your skin like alpine dew. Gently pat with clean palms rather than rubbing, pressing the botanical stem cells into your pores. Take a deep diaphragmatic breath, acknowledging the gift of a new day.',
      'Complement this with our Amber Nectar serum, focusing on areas prone to hyperpigmentation. Appreciate the smooth slip of the golden peptides, visualizing the barrier cells drinking in hydration and light.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
    author: 'Elena Vance, Holistic Esthetician'
  },
  {
    id: 'understanding-ceramides-skin',
    title: 'An Architectural Deep Dive: How Ceramides Safeguard Beauty',
    subtitle: 'The ultimate brick-and-mortar defense for sensitive skin structures.',
    category: 'Skincare Daily',
    readingTime: '7 MIN READ',
    date: 'April 22, 2026',
    summary: 'Learn about the cellular architecture of skin lipids and why ceramides are the key component to extinguishing redness and trans-epidermal water loss.',
    contentParagraphs: [
      'To understand ceramides, imagine your skin barrier (the stratum corneum) as a defensive brick wall. The skin cells themselves are the bricks, while the intercellular lipids represent the mortar holding them in place. When this lipid mortar depletes, moisture escapes instantly, and toxic irritants breach the walls.',
      'Ceramides constitute practically 50% of this critical lipid makeup. When standard environments draw moisture away, or when high-potency chemical cleansers peel these fats, a flaking, sensitive condition immediately ensues.',
      'Supplementing with biomimetic ceramides (specifically 1, 3, and 6) helps to fuse microscopic cracks in the lipid matrix. Combining them with healthy cholesterol and long-chain fatty acids forms a breathable, luxurious shield that stops trans-epidermal water loss.',
      'By sealing your active treatment serums below a high-quality lipid barrier cream like the Cashmere Cloud, you ensure continuous nighttime absorption for maximum dermal plumpness.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop',
    author: 'Dr. Marcus Aris, Dermatological Lead'
  },
  {
    id: 'inner-wellness-glow',
    title: 'True Radiance Begins Within: Probiotics and the Gut-Skin Connection',
    subtitle: 'How digestive balance and marine peptides feed cellular health.',
    category: 'Inner Wellness',
    readingTime: '6 MIN READ',
    date: 'April 05, 2026',
    summary: 'The science behind oral supplementation, gut probiotics, and high-purity collagen for building a radiant complexion from the cellular level.',
    contentParagraphs: [
      'Modern dermatology has proven beyond a shadow of doubt that facial health is deeply connected to internal gastrointestinal balance. High stress levels, poor diets, and environmental toxins can disrupt our gut flora, triggering systemic redness that manifests as acne flare-ups or dullness on the skin.',
      'By providing targeted daily oral supplementation, we support our bodily processes from the core. Living probiotic strains like Lactobacillus help keep the gut barrier secure, stopping systemic inflammation from reaching the bloodstream.',
      'Simultaneously, highly bioavailable Type I Marine Collagen Peptides supply the necessary building blocks for dermal regeneration, boosting density, elasticity, and water retention in the deep dermis.',
      'When you prioritize both outer topical botanicals and inner cell health, you create a harmonious feedback loop resulting in an unshakeable, luminous skin glow.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop',
    author: 'Clara Dupond, Wellness Nutritionist'
  },
  {
    id: 'sourcing-our-botanicals',
    title: 'The Sourcing Philosophy: Pure Foundations, Pure Results',
    subtitle: 'Uncompromising standard from Swiss roses to botanical cold-pressing.',
    category: 'Sourcing Story',
    readingTime: '4 MIN READ',
    date: 'March 12, 2026',
    summary: 'Go behind the scenes of our sourcing methodology, exploring why alpine micro-climatology and sustainable farming are critical to our active botanicals.',
    contentParagraphs: [
      'True luxury skincare is not defined by its marketing budget; it is defined by the absolute purity and ecological integrity of its raw components. At GlowSkincare, we partner solely with sustainable, family-owned cooperatives who honor the earth.',
      'Take our Swiss Alpine Rose stem cells: gathered from altitudes exceeding 2,000 meters, these resilient plants produce secondary metabolites that allow them to thrive in freezing temperatures and high UV radiation. By extracting these stem cells gently, we transfer this genetic resilience directly to your skin.',
      'Our cold-pressing techniques ensure that botanical fats are captured without heat, safeguarding precious antioxidants, vitamins, and omegas. We test every batch for chemical and pesticide contamination to maintain our promise of uncompromising, minimalist purity.',
      'From the volcanic soils where our sacred winter botanicals are gathered to the high-standard laboratory bottling, we preserve the life force of nature for your ultimate radiance.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop',
    author: 'Julian Vance, Founding Ethnobotanist'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'How does your skin typically feel about 2 hours after washing it?',
    options: [
      { label: 'Tight and flaky', description: 'Feels like it urgently needs rich cream or facial oil.', skinTypeScore: 'Dry' },
      { label: 'Shiny all over', description: 'Visible oiliness is present, especially across my cheeks and T-zone.', skinTypeScore: 'Oily' },
      { label: 'Slightly oily in T-zone only', description: 'Forehead and nose are shiny, but my cheeks feel normal or tight.', skinTypeScore: 'Combination' },
      { label: 'Prone to red, warm spots', description: 'Frequently feels tight, itchy, or irritated by new skincare formulas.', skinTypeScore: 'Sensitive' }
    ]
  },
  {
    id: 2,
    question: 'What is your primary skincare concern that you would like to target?',
    options: [
      { label: 'Fine lines & loss of elasticity', description: 'I want to lift sagging skin and reduce the depth of creases.', concernScore: 'Aging' },
      { label: 'Recurring breakouts & clogged pores', description: 'I deal with blackheads, bumpy spots, or oily congestion.', concernScore: 'Acne' },
      { label: 'Persistent dryness & dull shadows', description: 'My skin looks tired and feels thin or dehydrated.', concernScore: 'Hydration' },
      { label: 'Dark spots & uneven skin tone', description: 'I want to smooth out scars, sun damage, and bring back natural glow.', concernScore: 'Dullness' },
      { label: 'Easily irritated & persistent redness', description: 'I need formulas that soothe blotchy skins and repair barriers.', concernScore: 'Sensitivities' }
    ]
  },
  {
    id: 3,
    question: 'How does your skin react to staying in dry, air-conditioned rooms?',
    options: [
      { label: 'It starts flaking or itching immediately', description: 'Very reactive to dry air currents.', skinTypeScore: 'Dry' },
      { label: 'It actually produces even more grease', description: 'Compensating for dry air by releasing excess sebum.', skinTypeScore: 'Oily' },
      { label: 'It feels fine, maybe a little tight on cheeks', description: 'Generally balanced skin resilience.', skinTypeScore: 'Combination' },
      { label: 'It turns red and blotchy without barrier protection', description: 'Highly prone to external atmospheric shocks.', skinTypeScore: 'Sensitive' }
    ]
  }
];
