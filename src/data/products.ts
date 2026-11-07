import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // 1. Heritage Flagship Signature Piece
  {
    id: 'rass-jhumka-01',
    name: 'Pastel Tribal Silver Jhumka Earrings',
    category: 'jhumka',
    categoryDisplay: 'Jhumka',
    price: 5000,
    originalPrice: 6500,
    image: '/images/Pastel Tribal Silver Jhumka Earrings.png',
    cleanImage: '/images/Pastel Tribal Silver Jhumka Earrings.png',
    description: 'A timeless silhouette featuring our signature bell contour, adorned with artisan filigree dome work, delicate pastel bead drops, and anti-tarnish protective polish.',
    details: [
      'Handcrafted by generational artisans (karigars)',
      'Solid brass with micro silver finish & anti-tarnish e-coating',
      'Delicate pastel enamel bead drops with hand-finished filigree',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Lightweight hollow-core construction for comfortable everyday wear'
    ],
    metal: 'Solid Brass with Silver Polish & Anti-Tarnish E-Coating',
    gemstones: 'Pastel Enamel Drops & Beads',
    inStock: true,
    isBestseller: true,
    isNew: true,
    dimensions: '55mm drop length',
    weight: '14.2g (pair)',
    sku: 'RASS-JHM-01-STD',
    stockCount: 25
  },

  // 2. Ruby Crimson & Pavé Bee
  {
    id: 'rass-wst-11',
    name: 'Scarlet Bee Necklace',
    category: 'western',
    categoryDisplay: 'Western Jewellery',
    price: 1450,
    originalPrice: 1950,
    image: '/images/western/scarlet-bee-necklace.png',
    cleanImage: '/images/western/scarlet-bee-necklace.png',
    description: 'A captivating honeybee motif centered with a glowing scarlet red crystal heart and shimmering pavé filigree wings.',
    details: [
      'Detailed bee emblem with filigree textured wings and faceted crimson centerpiece',
      'Triple-plated anti-tarnish gold finish with e-coat seal',
      'A signature conversational talisman celebrating nature and sweetness',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive piece (1 piece available)'
    ],
    metal: 'Solid Brass with 18k Gold Plating',
    gemstones: 'Scarlet Red Faceted Crystal & Micro Zirconia',
    inStock: true,
    isBestseller: true,
    isNew: true,
    dimensions: '42cm length + 5cm extender; 20mm bee charm',
    weight: '7.3g',
    sku: 'RASS-WST-011',
    stockCount: 1
  },

  // 3. Sculptural Baroque Pearl & Waves
  {
    id: 'rass-ear-07',
    name: 'Oceania Earrings',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 1450,
    originalPrice: 1950,
    image: '/images/earrings/oceania-earrings.png',
    cleanImage: '/images/earrings/oceania-earrings.png',
    description: 'Oceanic drama meets haute joaillerie with cascading baroque shell motifs, sea-spray texture, and luminous organic pearl drops.',
    details: [
      'Sculptural organic waves reminiscent of Aegean seafoam',
      'Natural iridescent shell pearl drops with graceful kinetic swing',
      'Dual anti-tarnish protective layering for lasting ocean-fresh shine',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)'
    ],
    metal: 'Solid Brass with 18k Gold Plating',
    gemstones: 'Cultured Baroque Shell Pearls',
    inStock: true,
    isBestseller: true,
    isNew: true,
    dimensions: '52mm drop length',
    weight: '9.4g (pair)',
    sku: 'RASS-EAR-007',
    stockCount: 1
  },

  // 4. Golden Scarab Talisman
  {
    id: 'rass-wst-01',
    name: 'Beetle Boo Necklace',
    category: 'western',
    categoryDisplay: 'Western Jewellery',
    price: 2250,
    originalPrice: 2850,
    image: '/images/western/beetle-boo-necklace.png',
    cleanImage: '/images/western/beetle-boo-necklace.png',
    description: 'A whimsical contemporary statement piece featuring an intricately crafted scarab beetle motif suspended on a delicate chain with rich enamel and gemstone accents.',
    details: [
      'Artisan-crafted scarab beetle silhouette with hand-enameled highlights',
      'Solid brass with 18k gold polish & anti-tarnish e-coating',
      'Protective finish for lasting brilliance and moisture resistance',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Adjustable chain clasp for versatile styling'
    ],
    metal: 'Solid Brass with 18k Gold Finish & Anti-Tarnish E-Coating',
    gemstones: 'Hand-Poured Enamel & Cubic Zirconia',
    inStock: true,
    isBestseller: true,
    isNew: true,
    dimensions: '42cm length + 5cm extender; 22mm pendant drop',
    weight: '8.4g',
    sku: 'RASS-WST-001',
    stockCount: 1
  },

  // 5. Nocturnal Emerald Owl Talisman
  {
    id: 'rass-ear-02',
    name: 'Emerald Eye Owl Earrings',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 950,
    originalPrice: 1350,
    image: '/images/earrings/emerald-eye-owl-earrings.png',
    cleanImage: '/images/earrings/emerald-eye-owl-earrings.png',
    description: 'A whimsical nocturnal talisman featuring sculpted feathered owl motifs set with luminous emerald-green crystal eyes symbolizing wisdom and intuition.',
    details: [
      'Chiseled feather detailing with rich dimensional relief',
      'Vivid emerald-green faceted crystal eyes',
      'Lightweight anti-tarnish golden finish',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Exclusive limited edition (2 pieces available)'
    ],
    metal: 'Fine Brass with 18k Gold Finish',
    gemstones: 'Vibrant Emerald-Green Crystals',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '24mm drop length',
    weight: '6.2g (pair)',
    sku: 'RASS-EAR-002',
    stockCount: 2
  },

  // 6. Rainbow Jewel-Toned Hearts
  {
    id: 'rass-wst-09',
    name: 'Multicoloured Heart Neckpiece',
    category: 'western',
    categoryDisplay: 'Western Jewellery',
    price: 1950,
    originalPrice: 2550,
    image: '/images/western/multicoloured-heart-neckpiece.png',
    cleanImage: '/images/western/multicoloured-heart-neckpiece.png',
    description: 'A vibrant, celebratory composition of jewel-toned bezel-set crystal hearts that dance and capture radiance with every movement.',
    details: [
      'Station necklace with multi-hued crystal heart charms',
      'Prong and bezel set stones in amethyst, sapphire, and ruby tones',
      'Anti-tarnish gold chain with fluid drape and zero snagging',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive piece'
    ],
    metal: 'Solid Brass with 18k Yellow Gold Finish',
    gemstones: 'Multicolor Faceted Crystals & Cubic Zirconia',
    inStock: true,
    isBestseller: true,
    isNew: true,
    dimensions: '40cm length with 6cm extender',
    weight: '9.6g',
    sku: 'RASS-WST-009',
    stockCount: 1
  },

  // 7. Fluted Gold & Mother-of-Pearl Scallop
  {
    id: 'rass-ear-12',
    name: 'Seashell Earrings',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 1650,
    originalPrice: 2250,
    image: '/images/earrings/seashell-earrings.png',
    cleanImage: '/images/earrings/seashell-earrings.png',
    description: 'Statement coastal glamour featuring sculpted golden scallop shells with lustrous mother-of-pearl cabochons and swinging drop beads.',
    details: [
      'High-relief fluted scallop shell detailing with mirror gold polish',
      'Iridescent mother-of-pearl centers that reflect rainbow hues',
      'Premium anti-tarnish e-coating ensuring vacation longevity',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)'
    ],
    metal: 'Solid Brass with 18k Rich Gold Finish',
    gemstones: 'Natural Iridescent Mother-of-Pearl & Shell Pearls',
    inStock: true,
    isBestseller: true,
    isNew: true,
    dimensions: '44mm drop length',
    weight: '10.2g (pair)',
    sku: 'RASS-EAR-012',
    stockCount: 1
  },

  // 8. Resort-Luxe Marine Pearls
  {
    id: 'rass-wst-02',
    name: 'Coastal Charm Neckpiece',
    category: 'western',
    categoryDisplay: 'Western Jewellery',
    price: 2150,
    originalPrice: 2750,
    image: '/images/western/coastal-charm-neckpiece.png',
    cleanImage: '/images/western/coastal-charm-neckpiece.png',
    description: 'Inspired by sun-drenched coastlines and organic marine treasures, blending sea shell motifs and baroque pearl textures for an effortless resort-luxe aesthetic.',
    details: [
      'Sculpted organic marine motifs with baroque shell pearl accents',
      'Warm golden micro-finish with dual anti-tarnish protective layering',
      'Comfort-fit chain designed for layering or standalone wear',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive edition handcrafted with care'
    ],
    metal: 'Solid Brass with 18k Gold Plating',
    gemstones: 'Cultured Baroque Shell Pearls',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '40cm length + 6cm extender',
    weight: '11.2g',
    sku: 'RASS-WST-002',
    stockCount: 1
  },

  // 9. Articulated Tangerine Koi Fish
  {
    id: 'rass-ear-03',
    name: 'Fish Fanta Earrings',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 1050,
    originalPrice: 1450,
    image: '/images/earrings/fish-fanta-earrings.png',
    cleanImage: '/images/earrings/fish-fanta-earrings.png',
    description: 'Articulated koi fish earrings inspired by Eastern fortune and vitality, with fluid undulating fins and radiant translucent enamel color.',
    details: [
      'Segmented articulating spine that moves gracefully with your turn of head',
      'Hand-painted warm tangerine enamel wash over golden filigree',
      'Featherlight hollow construction for all-day comfort',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Exclusive limited edition (2 pieces available)'
    ],
    metal: 'Brass with 18k Yellow Gold Plating',
    gemstones: 'Translucent Hand-Poured Glass Enamel',
    inStock: true,
    isBestseller: true,
    isNew: true,
    dimensions: '45mm drop length',
    weight: '7.8g (pair)',
    sku: 'RASS-EAR-003',
    stockCount: 2
  },

  // 10. Sparkling Micro-Pavé Azure Eye
  {
    id: 'rass-wst-03',
    name: 'Diamond Evil Eye Neckpiece',
    category: 'western',
    categoryDisplay: 'Western Jewellery',
    price: 1050,
    originalPrice: 1450,
    image: '/images/western/diamond-evil-eye-neckpiece.png',
    cleanImage: '/images/western/diamond-evil-eye-neckpiece.png',
    description: 'A talisman of positive energy and protection, adorned with radiant micro-pavé crystalline accents and an iconic azure protective eye.',
    details: [
      'Classic nazar protective medallion with radiant pave surround',
      'Faceted cubic zirconia stones that catch natural light brilliantly',
      'Ultra-fine everyday chain with anti-tarnish protective seal',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Lightweight construction for comfortable everyday wear'
    ],
    metal: 'Solid Brass with 18k Yellow Gold Polish',
    gemstones: 'Micro-Pavé Cubic Zirconia & Azure Enamel Eye',
    inStock: true,
    isBestseller: true,
    isNew: true,
    dimensions: '40cm length with 5cm adjustable links',
    weight: '4.8g',
    sku: 'RASS-WST-003',
    stockCount: 1
  },

  // 11. Marquise CZ Botanical Ear Climber
  {
    id: 'rass-ear-01',
    name: 'Creeper Earrings',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 1450,
    originalPrice: 1950,
    image: '/images/earrings/creeper-earrings.png',
    cleanImage: '/images/earrings/creeper-earrings.png',
    description: 'A poetic climber silhouette that traces the curve of the earlobe with delicate branching botanical vines and shimmering pavé leaves.',
    details: [
      'Ergonomic ear crawler design that contours comfortably along the lobe',
      '18k gold polish with protective anti-tarnish barrier',
      'Micro-faceted cubic zirconia crystalline buds',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Secure pressure-cuff and post backing for a snug fit'
    ],
    metal: 'Solid Brass with 18k Gold Finish & E-Coating',
    gemstones: 'Faceted Marquise & Round Cubic Zirconia',
    inStock: true,
    isBestseller: true,
    isNew: true,
    dimensions: '32mm climber length',
    weight: '5.4g (pair)',
    sku: 'RASS-EAR-001',
    stockCount: 1
  },

  // 12. Puffy Mirror-Finish Gold Heart
  {
    id: 'rass-wst-06',
    name: 'Golden Heart Neckpiece',
    category: 'western',
    categoryDisplay: 'Western Jewellery',
    price: 1450,
    originalPrice: 1950,
    image: '/images/western/golden-heart-neckpiece.png',
    cleanImage: '/images/western/golden-heart-neckpiece.png',
    description: 'A romantic sculpted puffy heart pendant suspended on a lustrous chain, embodying warmth, affection, and enduring modern glamour.',
    details: [
      'Dimensional hollow-form heart charm with mirror-finish polish',
      'High-durability anti-tarnish gold plating',
      'Smooth curved contours that rest flush against the collarbone',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Secure lobster clasp closure'
    ],
    metal: 'Solid Brass with 18k Rich Gold Polish',
    gemstones: 'None (High Polish Gold Silhouette)',
    inStock: true,
    isBestseller: true,
    isNew: true,
    dimensions: '42cm length + 5cm extender; 16mm heart motif',
    weight: '6.5g',
    sku: 'RASS-WST-006',
    stockCount: 1
  },

  // 13. Baby-Pink Tulip Petals
  {
    id: 'rass-ear-10',
    name: 'Pink Tulip Earrings',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 950,
    originalPrice: 1350,
    image: '/images/earrings/pink-tulip-earrings.png',
    cleanImage: '/images/earrings/pink-tulip-earrings.png',
    description: 'Sculpted spring tulips in soft baby-pink enamel with golden foliage drops, evoking fresh blooms and youthful springtime joy.',
    details: [
      'Delicate tulip bud cups with naturalistic petal separation',
      'Golden stem accents with micro-e-coating for moisture resistance',
      'Lightweight profile ideal for day outings and weekend brunches',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)'
    ],
    metal: 'Fine Brass with 18k Gold Finish',
    gemstones: 'Soft Pink Blossom Enamel',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '35mm drop length',
    weight: '5.2g (pair)',
    sku: 'RASS-EAR-010',
    stockCount: 1
  },

  // 14. Graphic Monochrome Zebra
  {
    id: 'rass-wst-13',
    name: 'The Zebra Muse Neckpiece',
    category: 'western',
    categoryDisplay: 'Western Jewellery',
    price: 1150,
    originalPrice: 1600,
    image: '/images/western/the-zebra-muse-neckpiece.png',
    cleanImage: '/images/western/the-zebra-muse-neckpiece.png',
    description: 'Striking monochrome elegance featuring graphic zebra enamel striping against polished gold geometry for the modern muse.',
    details: [
      'Artisanal black and white enamel striping with clean lines',
      'Bold contemporary silhouette designed to elevate everyday outfits',
      'Durable e-coated anti-tarnish finish',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive piece (1 piece available)'
    ],
    metal: 'Solid Brass with 18k Gold Polish',
    gemstones: 'Monochrome Enamel Inlay',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '43cm length + 5cm extender',
    weight: '8.1g',
    sku: 'RASS-WST-013',
    stockCount: 1
  },

  // 15. Hand-Shaded Peach Floral
  {
    id: 'rass-ear-08',
    name: 'Peachy Pink Earrings',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 950,
    originalPrice: 1350,
    image: '/images/earrings/peachy-pink-earrings.png',
    cleanImage: '/images/earrings/peachy-pink-earrings.png',
    description: 'Feminine pastel blossoms featuring soft peach and blush enamel petals framed in warm antique golden borders.',
    details: [
      'Hand-shaded peach-to-blush ombré enamel petals',
      'Gentle floral curvature that softens and frames the jawline',
      'Anti-tarnish protective lacquer preventing fading',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)'
    ],
    metal: 'Brass with 18k Warm Gold Polish',
    gemstones: 'Pastel Peach & Blush Enamel',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '30mm drop length',
    weight: '5.6g (pair)',
    sku: 'RASS-EAR-008',
    stockCount: 1
  },

  // 16. Persian Turquoise & Royal Sapphire
  {
    id: 'rass-ear-15',
    name: 'Turquoise and Sapphire Gold Drop Earrings',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 1450,
    originalPrice: 1950,
    image: '/images/earrings/turquoise-sapphire-gold-drop-earrings.png',
    cleanImage: '/images/earrings/turquoise-sapphire-gold-drop-earrings.png',
    description: 'A regal color harmony pairing sky-blue Persian turquoise stones with deep royal sapphire crystals in an ornate filigree drop frame.',
    details: [
      'Bezel-set turquoise cabochon top connected to faceted sapphire crystal teardrop',
      'Antique-inspired filigree milgrain borders with 18k gold plating',
      'Sweat and tarnish resistant protective e-coat',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)'
    ],
    metal: 'Solid Brass with 18k Antique Gold Finish',
    gemstones: 'Turquoise Cabochons & Royal Sapphire Crystals',
    inStock: true,
    isBestseller: true,
    isNew: true,
    dimensions: '48mm drop length',
    weight: '8.9g (pair)',
    sku: 'RASS-EAR-015',
    stockCount: 1
  },

  // 17. Vintage Filigree Clover Key
  {
    id: 'rass-wst-07',
    name: 'Key Necklace',
    category: 'western',
    categoryDisplay: 'Western Jewellery',
    price: 950,
    originalPrice: 1350,
    image: '/images/western/key-necklace.png',
    cleanImage: '/images/western/key-necklace.png',
    description: 'An ornate vintage-inspired skeleton key charm, symbolizing mystery, freedom, and unlocking new beginnings.',
    details: [
      'Filigree clover-top key silhouette with antique-inspired detailing',
      'Slender cable chain with sturdy lobster closure',
      'Anti-tarnish protective lacquer preventing darkening',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive piece'
    ],
    metal: 'Brass with 18k Vintage Gold Polish',
    gemstones: 'Crystalline Accent Stone',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '45cm chain length; 28mm key drop',
    weight: '5.2g',
    sku: 'RASS-WST-007',
    stockCount: 1
  },

  // 18. Royal Indian Elephant Majesty
  {
    id: 'rass-ear-04',
    name: 'Gold Elephant Pearl Tassel Earrings',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 1050,
    originalPrice: 1450,
    image: '/images/earrings/golden-elephant-earrings.png',
    cleanImage: '/images/earrings/golden-elephant-earrings.png',
    description: 'A revered Indian regal motif featuring sculpted royal elephants with raised trunks and cascading lustrous shell pearl tassel drops, bringing majesty and enduring prosperity.',
    details: [
      'Intricately etched howdah and trunk detailing in high relief',
      'Cascading lustrous shell pearl tassels with fluid kinetic swing',
      'Lustrous satin gold polish with anti-tarnish e-coating',
      'Balanced stud-to-drop silhouette for versatile ethnic-fusion wear',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)'
    ],
    metal: 'Solid Brass with 18k Rich Gold Finish',
    gemstones: 'Lustrous Shell Pearl Tassels',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '28mm drop length',
    weight: '7.1g (pair)',
    sku: 'RASS-EAR-004',
    stockCount: 1
  },

  // 19. Architectural Padlock Charm
  {
    id: 'rass-wst-08',
    name: 'Lock Neckpiece',
    category: 'western',
    categoryDisplay: 'Western Jewellery',
    price: 950,
    originalPrice: 1350,
    image: '/images/western/lock-neckpiece.png',
    cleanImage: '/images/western/lock-neckpiece.png',
    description: 'Modern padlock minimalism meets chic street-luxe elegance, designed to symbolize unbreakable bonds, devotion, and quiet inner strength.',
    details: [
      'Architectural mini padlock charm with subtle engraved detailing',
      'High-shine reflective surface with anti-tarnish protective coating',
      'Versatile statement piece for both casual styling and evening wear',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive piece'
    ],
    metal: 'Fine Brass with 18k Yellow Gold Polish',
    gemstones: 'None (High Polish)',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '42cm chain with 5cm extension',
    weight: '5.8g',
    sku: 'RASS-WST-008',
    stockCount: 1
  },

  // 20. Modern Geometric Asymmetry
  {
    id: 'rass-ear-11',
    name: 'Quirky Danglers',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 1250,
    originalPrice: 1750,
    image: '/images/earrings/quirky-danglers.png',
    cleanImage: '/images/earrings/quirky-danglers.png',
    description: 'Eclectic artistic asymmetry featuring playful geometric charms and colorful enamel accents that make a modern artistic statement.',
    details: [
      'Conversational art-deco inspired silhouette with kinetic movement',
      'Hand-enameled jewel-toned geometric drops',
      'Anti-tarnish high-shine protective coating',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)'
    ],
    metal: 'Solid Brass with 18k Yellow Gold Finish',
    gemstones: 'Multicolor Enamel & Crystalline Accents',
    inStock: true,
    isBestseller: true,
    isNew: true,
    dimensions: '48mm drop length',
    weight: '7.4g (pair)',
    sku: 'RASS-EAR-011',
    stockCount: 1
  },

  // 21. Hand-Knotted Classic Pearls
  {
    id: 'rass-wst-10',
    name: 'Pearl Neckpiece',
    category: 'western',
    categoryDisplay: 'Western Jewellery',
    price: 850,
    originalPrice: 1250,
    image: '/images/western/pearl-neckpiece.png',
    cleanImage: '/images/western/pearl-neckpiece.png',
    description: 'Classic understated grace featuring hand-knotted pearls that illuminate the neckline with a soft, iridescent glow.',
    details: [
      'Lustrous ivory shell pearls with deep iridescent luster',
      'Secure gold-plated clasp with anti-tarnish protection',
      'Timeless silhouette for workwear, weekend brunches, and festive evenings',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive piece'
    ],
    metal: '18k Gold-Plated Clasp & Findings',
    gemstones: 'Hand-Selected Lustrous Shell Pearls',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '40cm collar length',
    weight: '12.0g',
    sku: 'RASS-WST-010',
    stockCount: 1
  },

  // 22. Translucent Amber Sunburst Glow
  {
    id: 'rass-ear-17',
    name: 'Yellow Acrylic Earrings',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 1250,
    originalPrice: 1750,
    image: '/images/earrings/yellow-acrylic-earrings.png',
    cleanImage: '/images/earrings/yellow-acrylic-earrings.png',
    description: 'Vibrant sunshine chic featuring warm amber-yellow translucent acrylic shapes suspended within polished golden geometric rings.',
    details: [
      'Modern retro statement with warm amber-citrine glow when hit by sunlight',
      'Ultra-lightweight resin construction that offers bold drama without weight',
      'High-durability anti-tarnish gold frame',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)'
    ],
    metal: 'Fine Brass with 18k Yellow Gold Polish',
    gemstones: 'Warm Amber-Yellow Translucent Resin',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '50mm drop length',
    weight: '6.5g (pair)',
    sku: 'RASS-EAR-017',
    stockCount: 1
  },

  // 23. Satin Gold Parisian Openwork Lace
  {
    id: 'rass-wst-12',
    name: 'Suzet Neckpiece',
    category: 'western',
    categoryDisplay: 'Western Jewellery',
    price: 1450,
    originalPrice: 1950,
    image: '/images/western/suzet-neckpiece.png',
    cleanImage: '/images/western/suzet-neckpiece.png',
    description: 'Parisian grace reimagined with delicate geometric links and a central openwork floral medallion that radiates quiet poise.',
    details: [
      'Art deco inspired medallion with delicate openwork lace motifs',
      'Premium satin gold finish with protective anti-tarnish barrier',
      'Lightweight ergonomic design comfortable for long wear',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive piece (1 piece available)'
    ],
    metal: 'Brass with 18k Satin Gold Finish',
    gemstones: 'Cubic Zirconia Center Spark',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '42cm chain with 5cm extender',
    weight: '6.9g',
    sku: 'RASS-WST-012',
    stockCount: 1
  },

  // 24. Glossy Rose-Pink Enamel Heart Huggies
  {
    id: 'rass-ear-09',
    name: 'Pink Heart Earrings',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 950,
    originalPrice: 1350,
    image: '/images/earrings/pink-heart-earrings.png',
    cleanImage: '/images/earrings/pink-heart-earrings.png',
    description: 'Playful romance captured in glowing rose quartz pink enamel hearts suspended from polished golden huggie hoops.',
    details: [
      'Vibrant candy-pink enamel heart charms with golden trim',
      'Comfort-hinged huggie hoops for easy click-and-wear closure',
      'Featherlight construction that never pulls on the earlobe',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)'
    ],
    metal: 'Solid Brass with 18k Yellow Gold Plating',
    gemstones: 'Rose Pink Gloss Enamel',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '26mm total drop; 12mm hoop',
    weight: '4.9g (pair)',
    sku: 'RASS-EAR-009',
    stockCount: 1
  },

  // 25. Petite Golden Bee Studs
  {
    id: 'rass-ear-06',
    name: 'Little Bee Earrings',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 650,
    originalPrice: 950,
    image: '/images/earrings/little-bee-earrings.png',
    cleanImage: '/images/earrings/little-bee-earrings.png',
    description: 'Dainty and delightful, these miniature bee studs feature openwork lace wings and a tiny enameled honeybee abdomen.',
    details: [
      'Sweet petite silhouette perfect for primary or second ear piercings',
      'Glossy enamel highlights with gold filigree wings',
      'Featherlight weight for 24/7 effortless wear',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)'
    ],
    metal: 'Fine Brass with 18k Gold Flash & E-Coating',
    gemstones: 'Hand-Inlaid Honey Enamel',
    inStock: true,
    isBestseller: true,
    isNew: true,
    dimensions: '11mm x 12mm',
    weight: '2.4g (pair)',
    sku: 'RASS-EAR-006',
    stockCount: 1
  },

  // 26. Classic Cobalt & Gold Talisman
  {
    id: 'rass-wst-04',
    name: 'Evil Eye Neckpiece',
    category: 'western',
    categoryDisplay: 'Western Jewellery',
    price: 950,
    originalPrice: 1350,
    image: '/images/western/evil-eye-neckpiece.png',
    cleanImage: '/images/western/evil-eye-neckpiece.png',
    description: 'An iconic modern talisman featuring hand-inlaid blue and white enamel framed in a polished golden silhouette for everyday warding and good fortune.',
    details: [
      'Artisanal hand-inlaid enamel warding off negative energies',
      'Polished golden bezel with featherlight construction',
      'Perfect for daily wear and modern neck-stacking',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Anti-tarnish protective e-coating'
    ],
    metal: 'Anti-Tarnish Brass with High-Shine Gold Finish',
    gemstones: 'Hand-Inlaid Glass Enamel',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '42cm chain with 5cm extender',
    weight: '4.2g',
    sku: 'RASS-WST-004',
    stockCount: 1
  },

  // 27. Sculpted Flared Tulip Blossoms
  {
    id: 'rass-ear-14',
    name: 'Tulip Flower Earrings',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 1450,
    originalPrice: 1950,
    image: '/images/earrings/tulip-flower-earrings.png',
    cleanImage: '/images/earrings/tulip-flower-earrings.png',
    description: 'An exquisite botanical statement featuring sculpted flared tulip blossoms with golden pistils and dangling crystal droplets.',
    details: [
      'Three-dimensional blossom architecture that catches light from all angles',
      'Hand-finished satin enamel with anti-tarnish golden trim',
      'Graceful kinetic swing that dances with natural head movement',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)'
    ],
    metal: 'Solid Brass with 18k Gold Finish',
    gemstones: 'Blossom Enamel & Faceted Crystal Drops',
    inStock: true,
    isBestseller: true,
    isNew: true,
    dimensions: '46mm drop length',
    weight: '8.3g (pair)',
    sku: 'RASS-EAR-014',
    stockCount: 1
  },

  // 28. Bohemian Antique Chiseled Chevrons
  {
    id: 'rass-wst-14',
    name: 'Tribe Necklace',
    category: 'western',
    categoryDisplay: 'Western Jewellery',
    price: 950,
    originalPrice: 1350,
    image: '/images/western/tribe-necklace.png',
    cleanImage: '/images/western/tribe-necklace.png',
    description: 'Inspired by nomadic bohemian craftsmanship, featuring etched geometric chevron drops and an earthy rustic luxury charm.',
    details: [
      'Chiseled chevron charms with bohemian artisanal textures',
      'Dual-tone antique gold finish with anti-tarnish treatment',
      'Fluid drape that moves gracefully with your neckline',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive piece (1 piece available)'
    ],
    metal: 'Brass with Antique 18k Gold Finish',
    gemstones: 'None (Textured Metalwork)',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '40cm length + 6cm extender',
    weight: '7.8g',
    sku: 'RASS-WST-014',
    stockCount: 1
  },

  // 29. Mirror-Finish Geometric Gold Studs
  {
    id: 'rass-ear-05',
    name: 'Golden Stud Earrings',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 850,
    originalPrice: 1200,
    image: '/images/earrings/golden-stud-earrings.png',
    cleanImage: '/images/earrings/golden-stud-earrings.png',
    description: 'Classic everyday luxury studs featuring sculpted geometric floral geometry with a radiant mirror-polished center.',
    details: [
      'Timeless everyday profile designed for effortless work-to-dinner wear',
      'High-durability anti-tarnish micro-gold finish',
      'Secure comfort-fit push backings that stay firm all day',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)'
    ],
    metal: 'Fine Brass with 18k Mirror Gold Polish',
    gemstones: 'None (Polished Geometry)',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '14mm diameter',
    weight: '3.8g (pair)',
    sku: 'RASS-EAR-005',
    stockCount: 1
  },

  // 30. Dainty Minimalist Turquoise Amulet
  {
    id: 'rass-wst-05',
    name: 'Evil Eye Small Neckpiece',
    category: 'western',
    categoryDisplay: 'Western Jewellery',
    price: 750,
    originalPrice: 1100,
    image: '/images/western/evil-eye-small-neckpiece.png',
    cleanImage: '/images/western/evil-eye-small-neckpiece.png',
    description: 'Petite and minimalist, this delicate evil eye pendant offers subtle everyday protection with clean geometric symmetry and featherlight elegance.',
    details: [
      'Dainty petite medallion ideal for subtle minimalist styling',
      'Premium e-coated finish ensuring anti-tarnish daily durability',
      'Comfort clasp designed for effortless 24/7 wear',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Ideal for layering with choker and collar chains'
    ],
    metal: 'Fine Brass with 18k Gold Flash & E-Coating',
    gemstones: 'Miniature Turquoise & Onyx Enamel',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '38cm chain + 5cm extender',
    weight: '3.1g',
    sku: 'RASS-WST-005',
    stockCount: 1
  },

  // 31. Sculpted Organic Marine Conch Studs
  {
    id: 'rass-ear-13',
    name: 'Shell Earrings',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 950,
    originalPrice: 1350,
    image: '/images/earrings/shell-earrings.png',
    cleanImage: '/images/earrings/shell-earrings.png',
    description: 'Minimalist cowrie and conch shell silhouettes in gleaming gold, capturing carefree bohemian spirit and seaside bliss.',
    details: [
      'Cast shell silhouette with natural organic hollow-back contour',
      'Warm golden micro-finish with anti-tarnish protective lacquer',
      'Effortless everyday studs suited for both beach days and office style',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)'
    ],
    metal: 'Fine Brass with 18k Gold Plating',
    gemstones: 'None (Sculpted Marine Gold)',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '22mm drop',
    weight: '4.6g (pair)',
    sku: 'RASS-EAR-013',
    stockCount: 1
  },

  // 32. Romantic Antique Filigree Locket & Teardrop
  {
    id: 'rass-ear-16',
    name: 'Victorian Beauty Earrings',
    category: 'earrings',
    categoryDisplay: 'Earrings',
    price: 1250,
    originalPrice: 1750,
    image: '/images/earrings/victorian-beauty-earrings.png',
    cleanImage: '/images/earrings/victorian-beauty-earrings.png',
    description: 'Vintage romance inspired by 19th-century cameos and royal lockets, featuring intricate filigree openwork and a crystal teardrop.',
    details: [
      'Lace-like ornamental filigree frame with delicate rawa ball beads',
      'Warm vintage gold patina with modern anti-tarnish longevity',
      'Regal evening statement piece that pairs beautifully with ethnic and formal gowns',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)'
    ],
    metal: 'Brass with 18k Antique Gold Patina & E-Coating',
    gemstones: 'Faceted Crystalline Teardrop',
    inStock: true,
    isBestseller: false,
    isNew: true,
    dimensions: '44mm drop length',
    weight: '7.9g (pair)',
    sku: 'RASS-EAR-016',
    stockCount: 1
  }
];

export const CATEGORIES_CONFIG = [
  { id: 'earrings', name: 'EARRINGS', count: 17, path: '/shop/earrings' },
  { id: 'western', name: 'WESTERN', count: 14, path: '/shop/western' },
  { id: 'jhumka', name: 'JHUMKA', count: 1, path: '/shop/jhumka' },
  { id: 'tribal', name: 'TRIBAL', count: 1, path: '/shop/tribal' },
  { id: 'rings', name: 'RINGS', count: 0, path: '/shop/rings' },
  { id: 'kadas', name: 'KADAS', count: 0, path: '/shop/kadas' },
  { id: 'accessories', name: 'EARPINS & BUGADI', count: 0, path: '/shop/accessories' },
  { id: 'toran', name: 'TORAN', count: 0, path: '/shop/toran' },
  { id: 'kangan-sets', name: 'KANGAN SETS', count: 0, path: '/shop/kangan-sets' },
  { id: 'kangna', name: 'KANGNA', count: 0, path: '/shop/kangna' },
  { id: 'necklaces', name: 'NECKLACES', count: 0, path: '/shop/necklaces' },
  { id: 'bracelets', name: 'BRACELETS', count: 0, path: '/shop/bracelets' },
];
