const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ukgjkmjhhxtaedxyhaeu.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
const supabase = createClient(supabaseUrl, serviceKey);

const TRIBAL_CATALOG = [
  {
    id: 'rass-trb-01',
    sku: 'RASS-TRB-001',
    name: 'Durga Hasali Collar Necklace',
    price: 2150,
    originalPrice: 2850,
    costPrice: 950,
    image: '/images/tribal/durga-hasali-necklace.webp',
    cleanImage: '/images/tribal/durga-hasali-necklace.webp',
    stockCount: 1,
    metal: 'Solid Brass with Antique Silver Oxidised Polish',
    gemstones: 'Embossed Maa Durga Talisman & Filigree Drops',
    dimensions: '14.5cm collar diameter + adjustable dori cord',
    weight: '48.5g',
    description: 'An auspicious tribal statement hasali featuring an intricately sculpted Maa Durga medallion flanked by radiant filigree spikes and antique oxidised silver bead tassels.',
    details: [
      'Sacred Maa Durga central medallion hand-cast by heritage Bengal karigars',
      'Solid brass construction with deep oxidised silver patina & protective lacquer',
      'Traditional rigid torque collar with soft adjustable silk cord for bespoke fit',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive heirloom creation (1 piece only)'
    ],
    isBestseller: true,
    isNew: true
  },
  {
    id: 'rass-trb-02',
    sku: 'RASS-TRB-002',
    name: 'Kamal Sutra Hasali Necklace',
    price: 2150,
    originalPrice: 2850,
    costPrice: 950,
    image: '/images/tribal/kamal-sutra-hasali-necklace.webp',
    cleanImage: '/images/tribal/kamal-sutra-hasali-necklace.webp',
    stockCount: 1,
    metal: 'Solid Brass with Oxidised Antique Silver Finish',
    gemstones: 'Sacred Lotus Floral Carvings & Temple Beads',
    dimensions: '14.8cm collar diameter + adjustable dori tie',
    weight: '46.2g',
    description: 'Embodying purity and renewal, this torque collar hasali showcases blooming lotus motifs sculpted in relief along a hand-twisted silver wire silhouette.',
    details: [
      'Sculptural blooming lotus (Kamal) center flanked by temple prayer beads',
      'Antique silver finish with dual anti-tarnish protective sealing',
      'Ergonomic contouring designed to rest gracefully along the collarbone',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: true,
    isNew: true
  },
  {
    id: 'rass-trb-03',
    sku: 'RASS-TRB-003',
    name: 'Dual-Tone Tribal Collar Necklace',
    price: 2950,
    originalPrice: 3850,
    costPrice: 1300,
    image: '/images/tribal/dual-tone-tribal-collar-necklace.webp',
    cleanImage: '/images/tribal/dual-tone-tribal-collar-necklace.webp',
    stockCount: 1,
    metal: 'Dual-Tone Brass & Sterling Silver Polish',
    gemstones: 'Kundan Accents & Kinetic Silver Bell Tassels',
    dimensions: '42cm choker curve + 6cm extender',
    weight: '58.0g',
    description: 'A striking blend of warm artisanal gold brass and cool oxidised silver, punctuated with architectural diamond medallions and musical ghungroo drops.',
    details: [
      'Striking dual-tone metal palette uniting antique gold and oxidised silver',
      'Cascading drop medallions with soft kinetic movement and chime',
      'Protective e-coat preventing oxidation and tarnish',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: true,
    isNew: true
  },
  {
    id: 'rass-trb-04',
    sku: 'RASS-TRB-004',
    name: 'Kiyaara Coin Drop Choker',
    price: 2450,
    originalPrice: 3250,
    costPrice: 1100,
    image: '/images/tribal/kiyaara-coin-drop-choker.webp',
    cleanImage: '/images/tribal/kiyaara-coin-drop-choker.webp',
    stockCount: 1,
    metal: 'Oxidised German Silver Plating',
    gemstones: 'Embossed Regal Coin Motifs',
    dimensions: '38cm choker + 7cm extender',
    weight: '52.4g',
    description: 'Inspired by ancient royal treasury currencies, the Kiyaara choker arrays delicately stamped coin medallions with soft brushed oxidisation.',
    details: [
      'Authentic antique coin replicas with embossed dynastic crests',
      'High-grade skin-safe alloy with anti-tarnish micro lacquer',
      'Comfort-fit links that articulate fluidly with neck movement',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: true,
    isNew: true
  },
  {
    id: 'rass-trb-05',
    sku: 'RASS-TRB-005',
    name: 'Grand Silver Statement Neckpiece',
    price: 3250,
    originalPrice: 4250,
    costPrice: 1450,
    image: '/images/tribal/grand-silver-statement-neckpiece.webp',
    cleanImage: '/images/tribal/grand-silver-statement-neckpiece.webp',
    stockCount: 1,
    metal: 'Solid Brass with Heavy Silver Polish',
    gemstones: 'Geometric Lattice Carvings & Bell Drops',
    dimensions: '40cm neck curve + 5cm extender',
    weight: '64.8g',
    description: 'A masterpiece of tribal craftsmanship showcasing dense architectural silver openwork paired with tiered rows of musical bell drops.',
    details: [
      'Intricate lattice openwork hand-chiseled by generational metalworkers',
      'Deep dual-finish oxidisation highlighting sculptural shadow lines',
      'Stately bridal and celebratory festive presence',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: true,
    isNew: true
  },
  {
    id: 'rass-trb-06',
    sku: 'RASS-TRB-006',
    name: 'Pachi Kundan Pink Stone Hasali',
    price: 2150,
    originalPrice: 2850,
    costPrice: 950,
    image: '/images/tribal/pachi-kundan-pink-stone-hasali.webp',
    cleanImage: '/images/tribal/pachi-kundan-pink-stone-hasali.webp',
    stockCount: 1,
    metal: 'Antique Oxidised Silver with Gold Foil Bezels',
    gemstones: 'Raw-Cut Pink Tourmaline Quartz & Pachi Kundan Stones',
    dimensions: '14.5cm collar diameter + dori tie',
    weight: '44.0g',
    description: 'Raw Jaipur Pachi Kundan stones in soft rose quartz hues set into antique silver prong bezels along an artisanal torque collar.',
    details: [
      'Authentic Pachi Kundan setting with radiant faceted pink stones',
      'Sturdy yet lightweight torque silhouette with adjustable dori',
      'Contrast between rough-luxe oxidised metal and luminous gemstone sparkle',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: false,
    isNew: true
  },
  {
    id: 'rass-trb-07',
    sku: 'RASS-TRB-007',
    name: 'Royal Floral Long Pendant Necklace',
    price: 3450,
    originalPrice: 4500,
    costPrice: 1550,
    image: '/images/tribal/royal-floral-long-pendant-necklace.webp',
    cleanImage: '/images/tribal/royal-floral-long-pendant-necklace.webp',
    stockCount: 1,
    metal: 'Oxidised Silver Plating on Solid Brass',
    gemstones: 'Carved Floral Medallion & Suspended Ghungroos',
    dimensions: '68cm chain drop; 65mm pendant diameter',
    weight: '72.0g',
    description: 'A majestic long tribal mala featuring a heavy statement floral medallion suspended from an ornate double-link chain with swinging ghungroo clusters.',
    details: [
      'Magnificent 65mm dimensional floral pendant with radial filigree petals',
      'Sturdy hand-assembled double link chain designed for dramatic layering',
      'Rich antique tribal patina sealed with tarnish-resistant coating',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: true,
    isNew: true
  },
  {
    id: 'rass-trb-08',
    sku: 'RASS-TRB-008',
    name: 'Pachi Kundan Black Stone Hasali',
    price: 2150,
    originalPrice: 2850,
    costPrice: 950,
    image: '/images/tribal/pachi-kundan-black-stone-hasali.webp',
    cleanImage: '/images/tribal/pachi-kundan-black-stone-hasali.webp',
    stockCount: 1,
    metal: 'Antique Oxidised Silver with Gold Leaf Accents',
    gemstones: 'Midnight Black Onyx Pachi Kundan Stones',
    dimensions: '14.5cm collar diameter + dori tie',
    weight: '45.1g',
    description: 'Dramatic midnight black Kundan stones hand-set into vintage silver claw mounts, creating an edgy yet regal high-contrast collar piece.',
    details: [
      'Faceted jet-black stones capturing ambient light with dark allure',
      'Protective e-coat preventing moisture damage and oxidation',
      'Flexible back dori cord accommodating various neck sizes comfortably',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: false,
    isNew: true
  },
  {
    id: 'rass-trb-09',
    sku: 'RASS-TRB-009',
    name: 'Heritage Long Silver Mala Necklace',
    price: 2850,
    originalPrice: 3750,
    costPrice: 1250,
    image: '/images/tribal/heritage-long-silver-mala-necklace.webp',
    cleanImage: '/images/tribal/heritage-long-silver-mala-necklace.webp',
    stockCount: 1,
    metal: 'Oxidised Silver Polish on Brass',
    gemstones: 'Fluted Silver Melon Beads & Filigree Drops',
    dimensions: '64cm drop length',
    weight: '55.3g',
    description: 'A fluid long-line silver mala composed of hand-fluted melon prayer beads and swinging ghungroo drops, ideal for styling over ethnic raw silks and kurtas.',
    details: [
      'Hollow-core hand-fluted melon beads keeping the necklace lightweight',
      'Versatile length designed to wear standalone or layered with hasalis',
      'Double-knotted interior stringing ensuring exceptional durability',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: false,
    isNew: true
  },
  {
    id: 'rass-trb-10',
    sku: 'RASS-TRB-010',
    name: 'Wired Torque Hasali Necklace',
    price: 2850,
    originalPrice: 3750,
    costPrice: 1250,
    image: '/images/tribal/wired-torque-hasali-necklace.webp',
    cleanImage: '/images/tribal/wired-torque-hasali-necklace.webp',
    stockCount: 1,
    metal: 'Solid Twisted Brass with Heavy Silver Plating',
    gemstones: 'Coiled Wire Texture & Ball Finials',
    dimensions: '14.2cm collar diameter; 12mm torque gauge',
    weight: '50.8g',
    description: 'An ancient nomadic torque design formed by multi-strand twisted wire coils that taper cleanly into polished sphere finials at the collarbone.',
    details: [
      'Rigid structural torque wire shaped to hug the collarline naturally',
      'Multi-gauge twisted wire detailing showcasing authentic rustic forging',
      'Smooth hand-polished inner edge preventing skin pinching or irritation',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: false,
    isNew: true
  },
  {
    id: 'rass-trb-11',
    sku: 'RASS-TRB-011',
    name: 'Royal Grand Silver Choker',
    price: 3150,
    originalPrice: 4150,
    costPrice: 1400,
    image: '/images/tribal/royal-grand-silver-choker.webp',
    cleanImage: '/images/tribal/royal-grand-silver-choker.webp',
    stockCount: 1,
    metal: 'Sterling Silver Finish on Solid Brass',
    gemstones: 'Filigree Arches & Tiered Bead Drops',
    dimensions: '39cm neck curve + 6cm extender',
    weight: '61.5g',
    description: 'Grandeur in every detail: arched Mughal filigree windows crown this regal choker, trimmed with dangling silver beads that shimmer with each step.',
    details: [
      'Architectural Mughal dome motifs hand-pierced by veteran artisans',
      'Rich multi-tier fringe creating dramatic visual fullness',
      'Anti-tarnish treatment for long-lasting radiant silver sheen',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: true,
    isNew: true
  },
  {
    id: 'rass-trb-12',
    sku: 'RASS-TRB-012',
    name: 'Leher Wave Hasali',
    price: 1450,
    originalPrice: 1950,
    costPrice: 650,
    image: '/images/tribal/leher-wave-hasali.webp',
    cleanImage: '/images/tribal/leher-wave-hasali.webp',
    stockCount: 1,
    metal: 'Solid Brass with Silver Patina',
    gemstones: 'Hand-Hammered Wave Undulations',
    dimensions: '14.0cm collar diameter + cord',
    weight: '34.2g',
    description: 'Modern minimalism meets tribal heritage in this streamlined hasali, featuring undulating hammer marks that catch the light like sunlit water.',
    details: [
      'Subtle hammered ripples created by hand with silversmith forging hammer',
      'Featherlight feel for all-day comfort without neck fatigue',
      'Understated statement styling for both fusion and traditional silhouettes',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: false,
    isNew: true
  },
  {
    id: 'rass-trb-13',
    sku: 'RASS-TRB-013',
    name: 'Artisan Long Pendant Necklace',
    price: 2850,
    originalPrice: 3750,
    costPrice: 1250,
    image: '/images/tribal/artisan-long-pendant-necklace.webp',
    cleanImage: '/images/tribal/artisan-long-pendant-necklace.webp',
    stockCount: 1,
    metal: 'Oxidised Silver on Brass',
    gemstones: 'Geometric Sunburst Talisman Pendant',
    dimensions: '60cm chain length; 52mm pendant',
    weight: '56.0g',
    description: 'Centered on an ancient sunburst amulet, this long-line tribal necklace balances bold geometry with artisan oxidisation and articulated drops.',
    details: [
      'Radial sunburst symbol signifying inner vitality and strength',
      'Interlocking textured cable links providing superior tensile strength',
      'Antiqued matte silver finish that will not peel or discolour',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: false,
    isNew: true
  },
  {
    id: 'rass-trb-14',
    sku: 'RASS-TRB-014',
    name: 'Magnificent Tribal Choker',
    price: 3250,
    originalPrice: 4250,
    costPrice: 1450,
    image: '/images/tribal/magnificent-tribal-choker.webp',
    cleanImage: '/images/tribal/magnificent-tribal-choker.webp',
    stockCount: 1,
    metal: 'Heavy Oxidised Brass & Silver Plating',
    gemstones: 'Sculpted Diamond Medallions & Rhythmic Tassels',
    dimensions: '41cm choker line + 5cm extender',
    weight: '66.4g',
    description: 'A heavyweight heirloom collar featuring embossed tribal chevron plates linked in harmony, finished with rhythmic chiming drop charms.',
    details: [
      'Interlocking chevron plates sculpted with Rajasthani tribal motifs',
      'Substantial heirloom heft with velvety smooth skin-contact backing',
      'Durable dual clasp with security extender chain',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: true,
    isNew: true
  },
  {
    id: 'rass-trb-15',
    sku: 'RASS-TRB-015',
    name: 'Layered Silver Long Necklace',
    price: 2450,
    originalPrice: 3250,
    costPrice: 1100,
    image: '/images/tribal/layered-silver-long-necklace.webp',
    cleanImage: '/images/tribal/layered-silver-long-necklace.webp',
    stockCount: 1,
    metal: 'Oxidised Silver Plating on Solid Brass',
    gemstones: 'Tiered Tribal Beads & Crescent Droplets',
    dimensions: '58cm drop length',
    weight: '49.1g',
    description: 'Cascading tiers of oxidised silver beads create instant dimension and boho sophistication, flowing effortlessly with your movements.',
    details: [
      'Multi-tier cascading structure providing layered styling in one single clasp',
      'Feather-light hollow beads ensuring zero strain on neck muscles',
      'Anti-tarnish protective lacquer for everyday longevity',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: false,
    isNew: true
  },
  {
    id: 'rass-trb-16',
    sku: 'RASS-TRB-016',
    name: 'Ornate Filigree Silver Choker',
    price: 2850,
    originalPrice: 3750,
    costPrice: 1250,
    image: '/images/tribal/ornate-filigree-silver-choker.webp',
    cleanImage: '/images/tribal/ornate-filigree-silver-choker.webp',
    stockCount: 1,
    metal: 'Solid Brass with Antique Silver Finish',
    gemstones: 'Lace Filigree Scrollwork & Dome Drops',
    dimensions: '38cm neck curve + 7cm extender',
    weight: '53.8g',
    description: 'Delicate gossamer-thin filigree wire woven like lacework into a regal choker collar, finished with miniature silver jhumka bells along the hem.',
    details: [
      'Fine wire filigree work crafted by master silversmiths',
      'Miniature jhumka bells offering delicate chime and movement',
      'Comfort-molded back ensuring a plush, snug fit at the throat',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: false,
    isNew: true
  },
  {
    id: 'rass-trb-17',
    sku: 'RASS-TRB-017',
    name: 'Oxidised Silver Pendant Necklace',
    price: 2150,
    originalPrice: 2850,
    costPrice: 950,
    image: '/images/tribal/oxidised-silver-pendant-necklace.webp',
    cleanImage: '/images/tribal/oxidised-silver-pendant-necklace.webp',
    stockCount: 1,
    metal: 'Antique Oxidised Silver on Brass',
    gemstones: 'Embossed Floral Medallion & Beaded Fringe',
    dimensions: '52cm chain; 45mm pendant drop',
    weight: '41.3g',
    description: 'An everyday statement talisman centered on an ornate tribal medallion, framed by hanging bead drops on an artisanal chain.',
    details: [
      'Intricately embossed central talisman with high-relief depth',
      'Medium-length chain ideal for v-neck kurtas, sarees, and dresses',
      'Long-lasting dual coat protection against oxidation',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: false,
    isNew: true
  },
  {
    id: 'rass-trb-18',
    sku: 'RASS-TRB-018',
    name: 'Heritage Coin Tribal Choker',
    price: 1850,
    originalPrice: 2450,
    costPrice: 800,
    image: '/images/tribal/heritage-coin-tribal-choker.webp',
    cleanImage: '/images/tribal/heritage-coin-tribal-choker.webp',
    stockCount: 1,
    metal: 'German Silver Alloy with Antique Patina',
    gemstones: 'Vintage Currency Coin Replicas',
    dimensions: '37cm collar curve + 6cm extender',
    weight: '43.7g',
    description: 'A charming traditional coin necklace echoing the banjara nomadic aesthetic, featuring embossed coins that gently click together with natural kinetic grace.',
    details: [
      'Authentic coin profile with heritage royal insignia',
      'Flexible linked backing that sits flat and flush against collarbones',
      'Micro-lacquered to prevent skin greening and metal scent',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: false,
    isNew: true
  },
  {
    id: 'rass-trb-19',
    sku: 'RASS-TRB-019',
    name: 'Tribal Textured Choker (Edition II)',
    price: 1850,
    originalPrice: 2450,
    costPrice: 800,
    image: '/images/tribal/tribal-textured-choker-edition-2.webp',
    cleanImage: '/images/tribal/tribal-textured-choker-edition-2.webp',
    stockCount: 1,
    metal: 'Solid Brass with Dark Antique Patina',
    gemstones: 'Chiseled Chevron Bands & Drop Beads',
    dimensions: '38cm neck curve + 6cm extender',
    weight: '42.9g',
    description: 'A companion edition featuring deeper chiseled chevron grooves and darker smoky oxidisation for an authentic tribal bohemian allure.',
    details: [
      'Hand-chiseled textured bands displaying raw artisanal charisma',
      'Smoky dark patina accentuating geometric light reflection',
      'Smooth hand-finished edges for comfortable wear',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: false,
    isNew: true
  },
  {
    id: 'rass-trb-20',
    sku: 'RASS-TRB-020',
    name: 'Classic Tribal Bell Choker',
    price: 1650,
    originalPrice: 2150,
    costPrice: 720,
    image: '/images/tribal/classic-tribal-bell-choker.webp',
    cleanImage: '/images/tribal/classic-tribal-bell-choker.webp',
    stockCount: 1,
    metal: 'Solid Brass with Silver Polish',
    gemstones: 'Artisan Ghungroo Bell Fringe',
    dimensions: '36cm collar line + 6cm extender',
    weight: '39.0g',
    description: 'Rhythmic and playful, this classic tribal choker features a neat ribbon of silver bells that create a subtle, melodious whisper with every movement.',
    details: [
      'A continuous fringe of hollow musical ghungroo bells',
      'Subtle musical presence ideal for festive celebrations and dandiya',
      'Hypoallergenic, nickel-free alloy with skin-friendly polish',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: false,
    isNew: true
  },
  {
    id: 'rass-trb-21',
    sku: 'RASS-TRB-021',
    name: 'Dual Brass & Silver Choker',
    price: 1450,
    originalPrice: 1950,
    costPrice: 650,
    image: '/images/tribal/dual-brass-silver-choker.webp',
    cleanImage: '/images/tribal/dual-brass-silver-choker.webp',
    stockCount: 1,
    metal: 'Dual-Finish Antique Brass & Silver Polish',
    gemstones: 'Two-Tone Geometric Textured Plates',
    dimensions: '37cm neck curve + 5cm extender',
    weight: '36.5g',
    description: 'An eclectic two-tone choker intertwining golden brass warmth with cool silver oxidisation, effortlessly matching both gold and silver accessories.',
    details: [
      'Seamless two-tone palette easily paired with diverse jewellery styles',
      'Streamlined modern tribal aesthetic for everyday casual wear',
      'Anti-oxidation protective sealing ensuring lasting luster',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: false,
    isNew: true
  },
  {
    id: 'rass-trb-22',
    sku: 'RASS-TRB-022',
    name: 'Padma Filigree Choker',
    price: 1450,
    originalPrice: 1950,
    costPrice: 650,
    image: '/images/tribal/padma-filigree-choker.webp',
    cleanImage: '/images/tribal/padma-filigree-choker.webp',
    stockCount: 1,
    metal: 'Oxidised Silver Polish on Brass',
    gemstones: 'Lotus Petal Filigree & Drop Accents',
    dimensions: '37cm neck line + 6cm extender',
    weight: '35.0g',
    description: 'Graceful lotus petal openwork forms an airy, feminine choker that rests delicately against the neck with zero heaviness.',
    details: [
      'Delicate lotus petal lace motifs crafted with fine silver wire',
      'Ultra-light construction designed for effortless all-day wear',
      'Subtle oxidised finish highlighting individual petal details',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: false,
    isNew: true
  },
  {
    id: 'rass-trb-23',
    sku: 'RASS-TRB-023',
    name: 'Aarohi Tribal Choker',
    price: 1350,
    originalPrice: 1850,
    costPrice: 600,
    image: '/images/tribal/aarohi-tribal-choker.webp',
    cleanImage: '/images/tribal/aarohi-tribal-choker.webp',
    stockCount: 1,
    metal: 'Solid Brass with Antique Silver Finish',
    gemstones: 'Minimalist Chevron Nodes & Bead Droplets',
    dimensions: '36cm neck curve + 6cm extender',
    weight: '32.5g',
    description: 'An accessible and versatile entry piece into tribal silver jewellery, combining minimalist chevron nodes with subtle swinging droplets.',
    details: [
      'Minimalist tribal silhouette perfect for college, office, and weekend outings',
      'Comfort-crafted links that do not catch on clothing or hair',
      'Double-sealed anti-tarnish protective lacquer',
      '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
      'Single exclusive creation (1 piece only)'
    ],
    isBestseller: false,
    isNew: true
  }
];

async function seed() {
  console.log('Seeding', TRIBAL_CATALOG.length, 'Tribal Jewellery products...');

  // 1. Sync to Supabase Database
  for (const item of TRIBAL_CATALOG) {
    const pId = item.id;
    const vId = 'var-' + pId + '-std';

    const { error: pErr } = await supabase.from('products').upsert([{
      id: pId,
      category_id: 'tribal',
      title: item.name,
      slug: pId,
      short_description: item.description,
      long_description: item.description,
      base_price: item.price,
      compare_at_price: item.originalPrice,
      cost_price: item.costPrice,
      metal_type: item.metal,
      gemstones: item.gemstones,
      dimensions: item.dimensions,
      weight_grams: parseFloat(item.weight) || 45,
      details: item.details,
      status: 'published',
      updated_at: new Date().toISOString()
    }]);

    if (pErr) console.error('Product error for', pId, pErr.message);

    const { error: vErr } = await supabase.from('product_variants').upsert([{
      id: vId,
      product_id: pId,
      sku: item.sku,
      variant_name: 'Standard (1 Piece)',
      option_type: 'Edition',
      option_value: '1 Piece',
      is_active: true
    }]);

    if (vErr) console.error('Variant error for', vId, vErr.message);

    const { error: iErr } = await supabase.from('inventory_items').upsert([{
      variant_id: vId,
      quantity_on_hand: item.stockCount,
      quantity_reserved: 0,
      low_stock_threshold: 1
    }], { onConflict: 'variant_id' });

    if (iErr) console.error('Inventory error for', vId, iErr.message);
  }

  // Insert images without explicit id so PostgreSQL generates UUIDs
  await supabase.from('product_images').delete().like('product_id', 'rass-trb-%');
  const images = TRIBAL_CATALOG.map(item => ({
    product_id: item.id,
    image_url: item.image,
    clean_image_url: item.cleanImage,
    alt_text: item.name,
    display_order: 0,
    is_primary: true
  }));

  const { error: imgErr } = await supabase.from('product_images').insert(images);
  if (imgErr) console.error('Images insert error:', imgErr.message);
  else console.log('Successfully inserted all 23 product images to Supabase!');

  console.log('All 23 products upserted to Supabase PostgreSQL database!');
}

module.exports = { TRIBAL_CATALOG, seed };

if (require.main === module) {
  seed().catch(console.error);
}
