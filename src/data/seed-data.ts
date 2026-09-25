import type { PredefinedProduct, PortfolioPiece } from '@/domain/types';

export const SEED_PREDEFINED_PRODUCTS: PredefinedProduct[] = [
  {
    id: 'prod-001',
    name: 'Traditional Bronze Kalash (Lota)',
    slug: 'traditional-bronze-kalash',
    description:
      'Handcrafted sacred water vessel forged from authentic five-metal Panchaloha alloy. Used for home rituals, sanctum consecrations, and everyday Ayurvedic water storage.',
    pricePaise: 280000, // ₹2,800
    weight: '1.25 kg',
    dimensions: '15cm x 15cm x 18cm',
    alloyDescription: 'Traditional Panchaloha (copper, zinc, tin, lead, silver)',
    careGuide:
      'Clean with tamarind paste or pitambari powder; rinse with clear water and dry immediately with a soft cotton cloth.',
    stockQuantity: 8,
    images: ['/images/products/bronze-kalash.jpg'],
    createdAt: 1720000000000,
    updatedAt: 1720000000000,
  },
  {
    id: 'prod-002',
    name: 'Handcrafted Bronze Water Bottle',
    slug: 'handcrafted-bronze-water-bottle',
    description:
      'Ergonomically shaped pure Kansa bronze bottle that keeps water naturally cool and mineral-rich according to Ayurvedic wisdom. Features a leak-proof brass cap.',
    pricePaise: 220000, // ₹2,200
    weight: '680g',
    dimensions: '7.5cm x 7.5cm x 26cm (900ml)',
    alloyDescription: '78% Copper, 22% Tin traditional Kansa bronze',
    careGuide:
      'Rinse daily with warm water. Hand wash with mild lemon or tamarind water once weekly. Do not refrigerate or freeze.',
    stockQuantity: 15,
    images: ['/images/products/bronze-bottle.jpg'],
    createdAt: 1720000000000,
    updatedAt: 1720000000000,
  },
  {
    id: 'prod-003',
    name: 'Artisanal Bronze Coffee Mug',
    slug: 'artisanal-bronze-coffee-mug',
    description:
      'Heavy-bottomed bell-metal mug crafted for hot filter coffee, tea, or water. Its curved lip and comfortable handle balance artisanal weight with modern ergonomics.',
    pricePaise: 110000, // ₹1,100
    weight: '420g',
    dimensions: '8.5cm x 8.5cm x 10cm (320ml)',
    alloyDescription: 'Pure Bell Metal bronze (Kansya)',
    careGuide:
      'Hand wash gently with mild soap. Wipe dry promptly. Never place in microwave or dishwasher.',
    stockQuantity: 24,
    images: ['/images/products/bronze-mug.jpg'],
    createdAt: 1720000000000,
    updatedAt: 1720000000000,
  },
  {
    id: 'prod-004',
    name: 'Temple Motif Bronze Jewellery Set',
    slug: 'temple-motif-bronze-jewellery-set',
    description:
      'Intricate cast bronze Kada (bracelet) and matching Jhumka earrings inspired by Chola-dynasty temple sculpture. Hand-burnished to an antique gold sheen.',
    pricePaise: 350000, // ₹3,500
    weight: '190g',
    dimensions: 'Adjustable Kada (6cm dia), Jhumka (4.5cm length)',
    alloyDescription: 'Panchaloha casting with antique gold patina finish',
    careGuide:
      'Store in dry cotton or muslin cloth pouch away from direct perfumes, lotions, and moisture.',
    stockQuantity: 6,
    images: ['/images/products/bronze-jewellery.jpg'],
    createdAt: 1720000000000,
    updatedAt: 1720000000000,
  },
  {
    id: 'prod-005',
    name: 'Fluted Traditional Urli Bowl',
    slug: 'fluted-traditional-urli-bowl',
    description:
      'Gracefully fluted ceremonial bronze Urli bowl for floating flowers and fragrant candles in living spaces and entryways. Sand-cast with deep ring handles.',
    pricePaise: 420000, // ₹4,200
    weight: '3.1 kg',
    dimensions: '30cm dia x 9cm depth',
    alloyDescription: 'Sand-cast Panchaloha bronze alloy',
    careGuide:
      'Wipe down after water use. Apply tamarind paste once a month to restore its warm golden luster.',
    stockQuantity: 5,
    images: ['/images/products/bronze-urli.jpg'],
    createdAt: 1720000000000,
    updatedAt: 1720000000000,
  },
  {
    id: 'prod-006',
    name: 'Panchaloha Daily Pooja Set',
    slug: 'panchaloha-daily-pooja-set',
    description:
      'Essential 5-piece devotional ensemble: sacred Diya, sweet-toned hand bell, incense burner, Panchapatra with spoon, and embossed arati plate.',
    pricePaise: 450000, // ₹4,500
    weight: '2.2 kg',
    dimensions: 'Arati plate 18cm dia, Hand bell 12cm H, Diya 8cm H',
    alloyDescription: 'Sacramental five-metal alloy (Panchaloha)',
    careGuide:
      'Clean periodically with vibhuti (sacred ash) or pitambari powder; buff with dry flannel.',
    stockQuantity: 4,
    images: ['/images/products/bronze-pooja-set.jpg'],
    createdAt: 1720000000000,
    updatedAt: 1720000000000,
  },
];

export const SEED_PORTFOLIO_PIECES: PortfolioPiece[] = [
  {
    id: 'port-001',
    name: 'Nataraja Ananda Tandava Murti',
    slug: 'nataraja-ananda-tandava-murti',
    description:
      'Masterwork lost-wax Panchaloha casting of the cosmic dancer Nataraja enclosed in the flaming Prabhamandala. Crafted following Agamic Shilpa Shastra canons.',
    referenceDimensions: '24" H x 18" W x 8" D (approx. 22 kg)',
    castingTechnique:
      'Traditional Madhuchishtavidhana (cire perdue / lost-wax) with alluvial clay mold',
    finishOptions: [
      'Antique Temple Patina',
      'Polished Bronze Highlights',
      'Deep Verdant Patina',
    ],
    typicalLeadTime: '8–10 weeks',
    images: ['/images/portfolio/nataraja.jpg'],
    createdAt: 1720000000000,
    updatedAt: 1720000000000,
  },
  {
    id: 'port-002',
    name: 'Temple Prabhavali Arch (Aureole)',
    slug: 'temple-prabhavali-arch',
    description:
      'Ornate ceremonial back-frame arch with intricate Kirtimukha crest, floral scrollwork, and tiered flame motifs designed for temple sanctorum vigrahas.',
    referenceDimensions: '36" H x 28" W x 4" D (approx. 35 kg)',
    castingTechnique: 'Multi-part lost-wax bronze casting with pinned assembly',
    finishOptions: ['Antique Patina', 'Mirror Polish', 'Matte Antique'],
    typicalLeadTime: '10–12 weeks',
    images: ['/images/portfolio/prabhavali.jpg'],
    createdAt: 1720000000000,
    updatedAt: 1720000000000,
  },
  {
    id: 'port-003',
    name: 'Deepastambha Ritual Branching Lamp',
    slug: 'deepastambha-ritual-branching-lamp',
    description:
      'Multi-tiered free-standing temple lamp crowned with the sacred Hamsa bird finial, seven stepped wick tiers, and an oil reservoir base.',
    referenceDimensions: '30" H x 12" base dia (approx. 18 kg)',
    castingTechnique: 'Segmented lost-wax casting with threaded joinery',
    finishOptions: ['Natural Warm Bronze', 'Antique Patina'],
    typicalLeadTime: '6–8 weeks',
    images: ['/images/portfolio/deepastambha.jpg'],
    createdAt: 1720000000000,
    updatedAt: 1720000000000,
  },
  {
    id: 'port-004',
    name: 'Ceremonial Ghanta & Temple Kalasham',
    slug: 'ceremonial-ghanta-temple-kalasham',
    description:
      'Resonant bell-metal Ghanta adorned with Nandi finial paired with a temple vimana pinnacle Kalasham crafted for ritual acoustics.',
    referenceDimensions: 'Ghanta: 14" H, Kalasham: 18" H',
    castingTechnique:
      'High-resonance bell metal (Kansya) casting and hand turning',
    finishOptions: ['High Mirror Luster', 'Sacred Temple Patina'],
    typicalLeadTime: '4–6 weeks',
    images: ['/images/portfolio/ghanta-kalasham.jpg'],
    createdAt: 1720000000000,
    updatedAt: 1720000000000,
  },
  {
    id: 'port-005',
    name: 'Embossed Deity Kavacham (Chest Armor)',
    slug: 'embossed-deity-kavacham',
    description:
      'Bespoke repoussé and cast bronze cuirass customized for temple vigraha consecrations with sacred iconography and jewel sockets.',
    referenceDimensions: 'Custom fitted (approx. 16" H x 14" W)',
    castingTechnique:
      'Hand-beaten sheet bronze combined with lost-wax cast relief borders',
    finishOptions: ['Sacred Gold Finish', 'Antique Bronzed Patina'],
    typicalLeadTime: '6–8 weeks',
    images: ['/images/portfolio/kavacham.jpg'],
    createdAt: 1720000000000,
    updatedAt: 1720000000000,
  },
];
