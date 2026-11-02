import { Product } from '../types';

export const PRODUCTS: Product[] = [
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
    weight: '14.2g (pair)'
  }
];

export const CATEGORIES_CONFIG = [
  { id: 'jhumka', name: 'JHUMKA', count: 1, path: '/shop/jhumka' },
  { id: 'tribal', name: 'TRIBAL', count: 1, path: '/shop/tribal' },
  { id: 'earrings', name: 'EARRINGS', count: 1, path: '/shop/earrings' },
  { id: 'rings', name: 'RINGS', count: 0, path: '/shop/rings' },
  { id: 'western', name: 'WESTERN', count: 0, path: '/shop/western' },
  { id: 'kadas', name: 'KADAS', count: 0, path: '/shop/kadas' },
  { id: 'accessories', name: 'EARPINS & BUGADI', count: 0, path: '/shop/accessories' },
  { id: 'toran', name: 'TORAN', count: 0, path: '/shop/toran' },
  { id: 'kangan-sets', name: 'KANGAN SETS', count: 0, path: '/shop/kangan-sets' },
  { id: 'kangna', name: 'KANGNA', count: 0, path: '/shop/kangna' },
  { id: 'necklaces', name: 'NECKLACES', count: 0, path: '/shop/necklaces' },
  { id: 'bracelets', name: 'BRACELETS', count: 0, path: '/shop/bracelets' },
];
