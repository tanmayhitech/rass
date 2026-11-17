import { 
  Product, 
  ProductVariant, 
  InventoryMovement, 
  ProductStatus, 
  ProductCategory,
  Order
} from '../types';
import { PRODUCTS } from '../data/products';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'rass_db_products',
  VARIANTS: 'rass_db_variants',
  MOVEMENTS: 'rass_db_inventory_movements',
  ORDERS: 'rass_orders',
};

// Deprecated legacy non-client dummy products that must never be loaded
const DEPRECATED_LEGACY_IDS = new Set([
  'rass-ring-01',
  'rass-earring-01',
  'rass-kangan-01',
  'rass-kangna-01',
  'rass-kangna-02',
  'rass-necklace-01',
  'rass-bracelet-01',
]);

// Categories that have 0 client products (must remain empty unless new products are added via admin)
const ZERO_PRODUCT_CATEGORIES = new Set([
  'rings',
  'kangan-sets',
  'kangna',
  'bracelets',
  'necklaces',
  'earrings',
]);

// Initial Variants generated from PRODUCTS
const INITIAL_VARIANTS: ProductVariant[] = [
  {
    id: 'var-jhumka-01-std',
    productId: 'rass-jhumka-01',
    sku: 'RASS-JHM-01-STD',
    variantName: 'Standard Pair',
    optionType: 'Size',
    optionValue: 'Standard',
    isActive: true,
    stockQuantity: 25,
    reservedQuantity: 0,
    lowStockThreshold: 4,
  },
  {
    id: 'var-wst-01-std',
    productId: 'rass-wst-01',
    sku: 'RASS-WST-001',
    variantName: 'Standard (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-wst-02-std',
    productId: 'rass-wst-02',
    sku: 'RASS-WST-002',
    variantName: 'Standard (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-wst-03-std',
    productId: 'rass-wst-03',
    sku: 'RASS-WST-003',
    variantName: 'Standard (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-wst-04-std',
    productId: 'rass-wst-04',
    sku: 'RASS-WST-004',
    variantName: 'Standard (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-wst-05-std',
    productId: 'rass-wst-05',
    sku: 'RASS-WST-005',
    variantName: 'Standard (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-wst-06-std',
    productId: 'rass-wst-06',
    sku: 'RASS-WST-006',
    variantName: 'Standard (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-wst-07-std',
    productId: 'rass-wst-07',
    sku: 'RASS-WST-007',
    variantName: 'Standard (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-wst-08-std',
    productId: 'rass-wst-08',
    sku: 'RASS-WST-008',
    variantName: 'Standard (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-wst-09-std',
    productId: 'rass-wst-09',
    sku: 'RASS-WST-009',
    variantName: 'Standard (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-wst-10-std',
    productId: 'rass-wst-10',
    sku: 'RASS-WST-010',
    variantName: 'Standard (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-wst-11-std',
    productId: 'rass-wst-11',
    sku: 'RASS-WST-011',
    variantName: 'Standard (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-wst-12-std',
    productId: 'rass-wst-12',
    sku: 'RASS-WST-012',
    variantName: 'Standard (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-wst-13-std',
    productId: 'rass-wst-13',
    sku: 'RASS-WST-013',
    variantName: 'Standard (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-wst-14-std',
    productId: 'rass-wst-14',
    sku: 'RASS-WST-014',
    variantName: 'Standard (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-01-std',
    productId: 'rass-ear-01',
    sku: 'RASS-EAR-001',
    variantName: 'Standard Pair (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-02-std',
    productId: 'rass-ear-02',
    sku: 'RASS-EAR-002',
    variantName: 'Standard Pair (2 Pieces)',
    optionType: 'Edition',
    optionValue: '2 Pieces',
    isActive: true,
    stockQuantity: 2,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-03-std',
    productId: 'rass-ear-03',
    sku: 'RASS-EAR-003',
    variantName: 'Standard Pair (2 Pieces)',
    optionType: 'Edition',
    optionValue: '2 Pieces',
    isActive: true,
    stockQuantity: 2,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-04-std',
    productId: 'rass-ear-04',
    sku: 'RASS-EAR-004',
    variantName: 'Standard Pair (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-05-std',
    productId: 'rass-ear-05',
    sku: 'RASS-EAR-005',
    variantName: 'Standard Pair (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-06-std',
    productId: 'rass-ear-06',
    sku: 'RASS-EAR-006',
    variantName: 'Standard Pair (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-07-std',
    productId: 'rass-ear-07',
    sku: 'RASS-EAR-007',
    variantName: 'Standard Pair (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-08-std',
    productId: 'rass-ear-08',
    sku: 'RASS-EAR-008',
    variantName: 'Standard Pair (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-09-std',
    productId: 'rass-ear-09',
    sku: 'RASS-EAR-009',
    variantName: 'Standard Pair (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-10-std',
    productId: 'rass-ear-10',
    sku: 'RASS-EAR-010',
    variantName: 'Standard Pair (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-11-std',
    productId: 'rass-ear-11',
    sku: 'RASS-EAR-011',
    variantName: 'Standard Pair (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-12-std',
    productId: 'rass-ear-12',
    sku: 'RASS-EAR-012',
    variantName: 'Standard Pair (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-13-std',
    productId: 'rass-ear-13',
    sku: 'RASS-EAR-013',
    variantName: 'Standard Pair (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-14-std',
    productId: 'rass-ear-14',
    sku: 'RASS-EAR-014',
    variantName: 'Standard Pair (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-15-std',
    productId: 'rass-ear-15',
    sku: 'RASS-EAR-015',
    variantName: 'Standard Pair (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-16-std',
    productId: 'rass-ear-16',
    sku: 'RASS-EAR-016',
    variantName: 'Standard Pair (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-ear-17-std',
    productId: 'rass-ear-17',
    sku: 'RASS-EAR-017',
    variantName: 'Standard Pair (1 Piece)',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },

  // --- Earpins & Bugadi Collection Initial Variants ---
  {
    id: 'var-pin-01-std',
    productId: 'rass-pin-01',
    sku: 'RASS-PIN-001',
    variantName: 'Single Piece',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-02-std',
    productId: 'rass-pin-02',
    sku: 'RASS-PIN-002',
    variantName: 'Standard Pair (2 Pieces)',
    optionType: 'Edition',
    optionValue: '2 Pieces',
    isActive: true,
    stockQuantity: 2,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-03-std',
    productId: 'rass-pin-03',
    sku: 'RASS-PIN-003',
    variantName: 'Standard Pair (2 Pieces)',
    optionType: 'Edition',
    optionValue: '2 Pieces',
    isActive: true,
    stockQuantity: 2,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-04-std',
    productId: 'rass-pin-04',
    sku: 'RASS-PIN-004',
    variantName: 'Standard Pair (2 Pieces)',
    optionType: 'Edition',
    optionValue: '2 Pieces',
    isActive: true,
    stockQuantity: 2,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-05-std',
    productId: 'rass-pin-05',
    sku: 'RASS-PIN-005',
    variantName: 'Collector Set (3 Pieces)',
    optionType: 'Edition',
    optionValue: '3 Pieces',
    isActive: true,
    stockQuantity: 3,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-06-std',
    productId: 'rass-pin-06',
    sku: 'RASS-PIN-006',
    variantName: 'Single Piece',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-07-std',
    productId: 'rass-pin-07',
    sku: 'RASS-PIN-007',
    variantName: 'Single Piece',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-08-std',
    productId: 'rass-pin-08',
    sku: 'RASS-PIN-008',
    variantName: 'Single Piece',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-09-std',
    productId: 'rass-pin-09',
    sku: 'RASS-PIN-009',
    variantName: 'Standard Pair (2 Pieces)',
    optionType: 'Edition',
    optionValue: '2 Pieces',
    isActive: true,
    stockQuantity: 2,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-10-std',
    productId: 'rass-pin-10',
    sku: 'RASS-PIN-010',
    variantName: 'Collector Set (3 Pieces)',
    optionType: 'Edition',
    optionValue: '3 Pieces',
    isActive: true,
    stockQuantity: 3,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-11-std',
    productId: 'rass-pin-11',
    sku: 'RASS-PIN-011',
    variantName: 'Single Piece',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-12-std',
    productId: 'rass-pin-12',
    sku: 'RASS-PIN-012',
    variantName: 'Standard Pair (2 Pieces)',
    optionType: 'Edition',
    optionValue: '2 Pieces',
    isActive: true,
    stockQuantity: 2,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-13-std',
    productId: 'rass-pin-13',
    sku: 'RASS-PIN-013',
    variantName: 'Collector Set (6 Pieces)',
    optionType: 'Edition',
    optionValue: '6 Pieces',
    isActive: true,
    stockQuantity: 6,
    reservedQuantity: 0,
    lowStockThreshold: 2,
  },
  {
    id: 'var-pin-14-std',
    productId: 'rass-pin-14',
    sku: 'RASS-PIN-014',
    variantName: 'Standard Pair (2 Pieces)',
    optionType: 'Edition',
    optionValue: '2 Pieces',
    isActive: true,
    stockQuantity: 2,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-15-std',
    productId: 'rass-pin-15',
    sku: 'RASS-PIN-015',
    variantName: 'Standard Pair (2 Pieces)',
    optionType: 'Edition',
    optionValue: '2 Pieces',
    isActive: true,
    stockQuantity: 2,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-16-std',
    productId: 'rass-pin-16',
    sku: 'RASS-PIN-016',
    variantName: 'Single Piece',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-17-std',
    productId: 'rass-pin-17',
    sku: 'RASS-PIN-017',
    variantName: 'Collector Set (5 Pieces)',
    optionType: 'Edition',
    optionValue: '5 Pieces',
    isActive: true,
    stockQuantity: 5,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-18-std',
    productId: 'rass-pin-18',
    sku: 'RASS-PIN-018',
    variantName: 'Collector Set (3 Pieces)',
    optionType: 'Edition',
    optionValue: '3 Pieces',
    isActive: true,
    stockQuantity: 3,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-19-std',
    productId: 'rass-pin-19',
    sku: 'RASS-PIN-019',
    variantName: 'Collector Set (5 Pieces)',
    optionType: 'Edition',
    optionValue: '5 Pieces',
    isActive: true,
    stockQuantity: 5,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-20-std',
    productId: 'rass-pin-20',
    sku: 'RASS-PIN-020',
    variantName: 'Standard Pair (2 Pieces)',
    optionType: 'Edition',
    optionValue: '2 Pieces',
    isActive: true,
    stockQuantity: 2,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-21-std',
    productId: 'rass-pin-21',
    sku: 'RASS-PIN-021',
    variantName: 'Collector Set (3 Pieces)',
    optionType: 'Edition',
    optionValue: '3 Pieces',
    isActive: true,
    stockQuantity: 3,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-22-std',
    productId: 'rass-pin-22',
    sku: 'RASS-PIN-022',
    variantName: 'Single Piece',
    optionType: 'Edition',
    optionValue: '1 Piece',
    isActive: true,
    stockQuantity: 1,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-23-std',
    productId: 'rass-pin-23',
    sku: 'RASS-PIN-023',
    variantName: 'Collector Set (3 Pieces)',
    optionType: 'Edition',
    optionValue: '3 Pieces',
    isActive: true,
    stockQuantity: 3,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: 'var-pin-24-std',
    productId: 'rass-pin-24',
    sku: 'RASS-PIN-024',
    variantName: 'Collector Set (4 Pieces)',
    optionType: 'Edition',
    optionValue: '4 Pieces',
    isActive: true,
    stockQuantity: 4,
    reservedQuantity: 0,
    lowStockThreshold: 1,
  },
];

// Initial movement ledger
const INITIAL_MOVEMENTS: InventoryMovement[] = INITIAL_VARIANTS.map((v) => ({
  id: `mov-${v.id}-init`,
  variantId: v.id,
  productTitle: PRODUCTS.find((p) => p.id === v.productId)?.name || 'Jewellery Design',
  sku: v.sku,
  movementType: 'purchase_receipt',
  quantityChange: v.stockQuantity,
  quantityAfter: v.stockQuantity,
  referenceId: 'PO-2026-INIT',
  notes: 'Opening inventory stock receipt',
  createdBy: 'riddhima@rassbyriddhima.com',
  createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
}));

// Hydrate initial products with variants and SKUs
const INITIAL_PRODUCTS: Product[] = PRODUCTS.map((p) => {
  const matchingVariants = INITIAL_VARIANTS.filter((v) => v.productId === p.id);
  const primaryVariant = matchingVariants[0];
  const totalStock = matchingVariants.reduce((sum, v) => sum + v.stockQuantity, 0);

  return {
    ...p,
    title: p.name,
    slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    sku: primaryVariant?.sku || `RASS-SKU-${p.id.toUpperCase()}`,
    costPrice: Math.round(p.price * 0.46),
    status: 'published',
    variants: matchingVariants,
    stockCount: totalStock,
    lowStockThreshold: primaryVariant?.lowStockThreshold || 3,
    inStock: totalStock > 0,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

class StoreService {
  private products: Product[] = [];
  private variants: ProductVariant[] = [];
  private movements: InventoryMovement[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      const storedVariants = localStorage.getItem(STORAGE_KEYS.VARIANTS);
      const storedMovements = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);

      if (storedProducts) {
        const parsed = JSON.parse(storedProducts) as Product[];
        // Strictly filter out legacy dummy non-client products (rings, bracelets, kangna, kangan-sets, necklaces, etc.)
        // Only accept canonical PRODUCTS or custom products created by admin (rass-prod-)
        const valid = parsed.filter((p) => {
          if (!p || !p.id) return false;
          if (DEPRECATED_LEGACY_IDS.has(p.id)) return false;
          if (p.id.startsWith('rass-seed-')) return false;
          if (ZERO_PRODUCT_CATEGORIES.has(p.category) && !p.id.startsWith('rass-prod-')) {
            return false;
          }
          return PRODUCTS.some((prod) => prod.id === p.id) || p.id.startsWith('rass-prod-');
        });

        if (valid.length > 0) {
          const validProductIds = new Set(valid.map((p) => p.id));
          const missingCanonical = INITIAL_PRODUCTS.filter((p) => !validProductIds.has(p.id));
          const combined = [
            ...valid.map((p) => {
              const canonical = PRODUCTS.find((prod) => prod.id === p.id);
              return canonical ? { 
                ...p, 
                name: canonical.name, 
                title: canonical.name, 
                price: canonical.price, 
                originalPrice: canonical.originalPrice, 
                image: canonical.image, 
                cleanImage: canonical.cleanImage,
                details: canonical.details,
                description: canonical.description,
                gemstones: canonical.gemstones,
                category: canonical.category,
                categoryDisplay: canonical.categoryDisplay
              } : p;
            }),
            ...missingCanonical,
          ];
          // Preserve the curated editorial order of canonical PRODUCTS, keeping custom products at the front
          this.products = combined
            .filter((p) => !DEPRECATED_LEGACY_IDS.has(p.id) && (PRODUCTS.some((cp) => cp.id === p.id) || p.id.startsWith('rass-prod-')))
            .sort((a, b) => {
              const isCustomA = a.id.startsWith('rass-prod-');
              const isCustomB = b.id.startsWith('rass-prod-');
              if (isCustomA && !isCustomB) return -1;
              if (!isCustomA && isCustomB) return 1;
              const indexA = PRODUCTS.findIndex((p) => p.id === a.id);
              const indexB = PRODUCTS.findIndex((p) => p.id === b.id);
              return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
            });
        } else {
          this.products = INITIAL_PRODUCTS;
        }
      } else {
        this.products = INITIAL_PRODUCTS;
      }

      const currentValidProdIds = new Set(this.products.map((p) => p.id));

      if (storedVariants) {
        const parsedV = JSON.parse(storedVariants) as ProductVariant[];
        const validV = parsedV.filter((v) => v && v.id && currentValidProdIds.has(v.productId));
        if (validV.length > 0) {
          const validVariantIds = new Set(validV.map((v) => v.id));
          const missingVariants = INITIAL_VARIANTS.filter((v) => currentValidProdIds.has(v.productId) && !validVariantIds.has(v.id));
          this.variants = [...validV, ...missingVariants];
        } else {
          this.variants = INITIAL_VARIANTS.filter((v) => currentValidProdIds.has(v.productId));
        }
      } else {
        this.variants = INITIAL_VARIANTS.filter((v) => currentValidProdIds.has(v.productId));
      }

      this.movements = storedMovements ? JSON.parse(storedMovements) : INITIAL_MOVEMENTS;
      // Immediately write back sanitized catalog to localStorage
      this.saveState();
    } catch (e) {
      this.products = INITIAL_PRODUCTS;
      this.variants = INITIAL_VARIANTS;
      this.movements = INITIAL_MOVEMENTS;
    }
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
      localStorage.setItem(STORAGE_KEYS.VARIANTS, JSON.stringify(this.variants));
      localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(this.movements));
    } catch (e) {
      console.error('Error saving store state:', e);
    }
  }

  // --------------------------------------------------------------------------
  // PRODUCT MANAGEMENT (MODULE 1)
  // --------------------------------------------------------------------------

  public getProducts(includeInactive = false): Product[] {
    if (includeInactive) {
      return [...this.products];
    }
    // Public storefront only gets published products that are active and have inStock variants
    return this.products.filter((p) => p.status === 'published');
  }

  /**
   * Bi-directional synchronization with remote Supabase PostgreSQL catalog
   */
  public async syncWithSupabase(): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      const { data: remoteProducts, error } = await supabase.from('products').select('*');
      if (error || !remoteProducts || !remoteProducts.length) return;

      const { data: remoteImages } = await supabase.from('product_images').select('*').eq('is_primary', true);
      const imageMap = new Map<string, { image_url: string; clean_image_url?: string }>();
      if (remoteImages) {
        for (const img of remoteImages) {
          imageMap.set(img.product_id, { image_url: img.image_url, clean_image_url: img.clean_image_url });
        }
      }

      const currentIds = new Set(this.products.map((p) => p.id));
      let stateChanged = false;

      for (const remote of remoteProducts) {
        // Strictly ignore deprecated legacy non-client dummy products
        if (DEPRECATED_LEGACY_IDS.has(remote.id)) continue;
        if (remote.id.startsWith('rass-seed-')) continue;
        if (ZERO_PRODUCT_CATEGORIES.has(remote.category_id) && !remote.id.startsWith('rass-prod-')) {
          continue;
        }

        // If it's a canonical product (e.g. the 17 earrings), ensure category is synced from canonical PRODUCTS
        const canonical = PRODUCTS.find((p) => p.id === remote.id);
        if (canonical) {
          const localIdx = this.products.findIndex((p) => p.id === remote.id);
          if (localIdx !== -1) {
            if (this.products[localIdx].category !== canonical.category || this.products[localIdx].categoryDisplay !== canonical.categoryDisplay) {
              this.products[localIdx] = {
                ...this.products[localIdx],
                category: canonical.category,
                categoryDisplay: canonical.categoryDisplay,
              };
              stateChanged = true;
            }
          }
          continue;
        }

        // Only allow new custom admin products from remote
        if (remote.id.startsWith('rass-prod-') && !currentIds.has(remote.id)) {
          const category = (remote.category_id || 'western') as ProductCategory;
          const imgInfo = imageMap.get(remote.id);
          const newProduct: Product = {
            id: remote.id,
            name: remote.title,
            title: remote.title,
            slug: remote.slug,
            category,
            categoryDisplay: remote.category_id || 'Western Jewellery',
            price: Number(remote.base_price) || 0,
            originalPrice: remote.compare_at_price ? Number(remote.compare_at_price) : undefined,
            costPrice: remote.cost_price ? Number(remote.cost_price) : undefined,
            image: imgInfo?.image_url || '/images/western/scarlet-bee-necklace.png',
            cleanImage: imgInfo?.clean_image_url || imgInfo?.image_url || '/images/western/scarlet-bee-necklace.png',
            description: remote.short_description || remote.long_description || '',
            details: Array.isArray(remote.details) ? remote.details : [],
            metal: remote.metal_type || '18k Gold Vermeil',
            gemstones: remote.gemstones || '',
            dimensions: remote.dimensions || '',
            weight: remote.weight_grams ? `${remote.weight_grams}g` : '10g',
            sku: `RASS-SKU-${remote.id.toUpperCase()}`,
            inStock: remote.status === 'published',
            status: (remote.status || 'published') as ProductStatus,
            variants: [],
            stockCount: 10,
            lowStockThreshold: 3,
            createdAt: remote.created_at || new Date().toISOString(),
            updatedAt: remote.updated_at || new Date().toISOString(),
          };
          this.products.push(newProduct);
          stateChanged = true;
        }
      }

      // Ensure no deprecated products remain in this.products
      const initialCount = this.products.length;
      this.products = this.products.filter(
        (p) => !DEPRECATED_LEGACY_IDS.has(p.id) && (PRODUCTS.some((cp) => cp.id === p.id) || p.id.startsWith('rass-prod-'))
      );
      if (this.products.length !== initialCount) {
        stateChanged = true;
      }

      if (stateChanged) {
        this.saveState();
      }
    } catch (err) {
      console.warn('[StoreService] Cloud product synchronization failed:', err);
    }
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  public createProduct(data: {
    name: string;
    category: ProductCategory;
    categoryDisplay: string;
    price: number;
    originalPrice?: number;
    costPrice?: number;
    image: string;
    cleanImage?: string;
    description: string;
    details: string[];
    metal: string;
    gemstones: string;
    dimensions?: string;
    weight?: string;
    sku: string;
    initialStock?: number;
    lowStockThreshold?: number;
    status?: ProductStatus;
    isBestseller?: boolean;
    isNew?: boolean;
  }): Product {
    // Validate unique SKU
    const existingSku = this.variants.some((v) => v.sku.toUpperCase() === data.sku.trim().toUpperCase());
    if (existingSku) {
      throw new Error(`SKU "${data.sku}" is already in use by another variant.`);
    }

    if (!data.name.trim()) throw new Error('Product title is required.');
    if (data.price <= 0) throw new Error('Valid price greater than ₹0 is required.');

    const newId = `rass-prod-${Date.now().toString(36)}`;
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const stockQty = data.initialStock ?? 10;
    const threshold = data.lowStockThreshold ?? 3;

    // Create default variant
    const variantId = `var-${newId}-std`;
    const newVariant: ProductVariant = {
      id: variantId,
      productId: newId,
      sku: data.sku.trim().toUpperCase(),
      variantName: 'Standard',
      optionType: 'Standard',
      optionValue: 'Standard',
      isActive: true,
      stockQuantity: stockQty,
      reservedQuantity: 0,
      lowStockThreshold: threshold,
    };

    const newProduct: Product = {
      id: newId,
      name: data.name.trim(),
      title: data.name.trim(),
      slug,
      category: data.category,
      categoryDisplay: data.categoryDisplay,
      price: data.price,
      originalPrice: data.originalPrice,
      costPrice: data.costPrice || Math.round(data.price * 0.45),
      image: data.image || '/images/cat_rings.png',
      cleanImage: data.cleanImage || data.image || '/images/clean_cat_rings.png',
      description: data.description,
      details: data.details,
      metal: data.metal,
      gemstones: data.gemstones,
      dimensions: data.dimensions,
      weight: data.weight,
      sku: data.sku.trim().toUpperCase(),
      inStock: stockQty > 0,
      isBestseller: Boolean(data.isBestseller),
      isNew: Boolean(data.isNew),
      status: data.status || 'published',
      variants: [newVariant],
      stockCount: stockQty,
      lowStockThreshold: threshold,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.products.unshift(newProduct);
    this.variants.push(newVariant);

    // Initial movement
    if (stockQty > 0) {
      this.movements.unshift({
        id: `mov-${Date.now()}`,
        variantId,
        productTitle: newProduct.name,
        sku: newVariant.sku,
        movementType: 'purchase_receipt',
        quantityChange: stockQty,
        quantityAfter: stockQty,
        referenceId: 'INIT-CREATE',
        notes: 'Initial catalog creation stock',
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
      });
    }

    this.saveState();

    // Asynchronously synchronize new product to Supabase Cloud Database
    if (typeof window !== 'undefined' && window.location?.host) {
      (async () => {
        try {
          const apiResp = await fetch('/api/catalog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'create_product',
              product: newProduct,
            }),
          });
          if (apiResp.ok) {
            console.log('[StoreService] Product successfully synced to Supabase via serverless API');
            return;
          }
        } catch (apiErr) {
          console.warn('[StoreService] Serverless catalog sync error, attempting direct client fallback:', apiErr);
        }

        // Client-side fallback if API route unavailable
        if (isSupabaseConfigured) {
          try {
            await supabase.from('products').upsert([{
              id: newId,
              category_id: data.category,
              title: data.name.trim(),
              slug,
              short_description: data.description,
              long_description: data.description,
              base_price: data.price,
              compare_at_price: data.originalPrice || null,
              cost_price: data.costPrice || Math.round(data.price * 0.45),
              metal_type: data.metal,
              gemstones: data.gemstones,
              dimensions: data.dimensions || '',
              weight_grams: parseFloat(data.weight || '10') || 10,
              details: data.details || [],
              status: data.status || 'published',
              updated_at: new Date().toISOString(),
            }]);

            await supabase.from('product_variants').upsert([{
              id: variantId,
              product_id: newId,
              sku: data.sku.trim().toUpperCase(),
              variant_name: 'Standard',
              option_type: 'Standard',
              option_value: 'Standard',
              is_active: true,
            }]);

            await supabase.from('inventory_items').upsert([{
              variant_id: variantId,
              quantity_on_hand: stockQty,
              quantity_reserved: 0,
              low_stock_threshold: threshold,
            }], { onConflict: 'variant_id' });

            if (data.image) {
              await supabase.from('product_images').insert([{
                product_id: newId,
                image_url: data.image,
                clean_image_url: data.cleanImage || data.image,
                alt_text: data.name.trim(),
                display_order: 0,
                is_primary: true,
              }]);
            }
          } catch (err) {
            console.warn('[StoreService] Direct Supabase product sync deferred:', err);
          }
        }
      })();
    }

    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product ${id} not found.`);
    }

    const current = this.products[index];
    const updated: Product = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // If title changed, update slug
    if (updates.name && updates.name !== current.name) {
      updated.title = updates.name;
      updated.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    this.products[index] = updated;
    this.saveState();
    return updated;
  }

  public setProductStatus(id: string, status: ProductStatus): Product {
    if (typeof window !== 'undefined' && window.location?.host) {
      fetch('/api/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', productId: id, status }),
      }).catch((err) => {
        console.warn('[StoreService] Cloud status sync deferred:', err);
      });
    }

    return this.updateProduct(id, {
      status,
      inStock: status === 'published' ? (this.getProductById(id)?.stockCount ?? 0) > 0 : false,
    });
  }

  public archiveProduct(id: string): Product {
    return this.updateProduct(id, {
      status: 'archived',
      inStock: false,
    });
  }

  public deleteProductSafely(id: string): { success: boolean; message: string } {
    // Check if historical orders reference this product
    let orders: Order[] = [];
    try {
      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (storedOrders) orders = JSON.parse(storedOrders);
    } catch (e) {
      orders = [];
    }

    const hasOrderReferences = orders.some((order) =>
      order.items.some((item) => item.product.id === id) ||
      order.itemSnapshots?.some((snap) => snap.productId === id)
    );

    if (hasOrderReferences) {
      throw new Error(
        `Security Rule Violation: Cannot permanently delete "${this.getProductById(id)?.name}". ` +
        `This product has historical orders associated with it. To preserve financial and legal order integrity, ` +
        `archive or deactivate this product instead.`
      );
    }

    this.products = this.products.filter((p) => p.id !== id);
    this.variants = this.variants.filter((v) => v.productId !== id);
    this.saveState();

    // Asynchronously delete from Supabase via serverless API
    if (typeof window !== 'undefined' && window.location?.host) {
      fetch('/api/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_product', productId: id }),
      }).catch((err) => {
        console.warn('[StoreService] Cloud delete sync deferred:', err);
      });
    }

    return {
      success: true,
      message: 'Product deleted permanently with no historical references.',
    };
  }

  // --------------------------------------------------------------------------
  // INVENTORY & STOCK MANAGEMENT (MODULE 2)
  // --------------------------------------------------------------------------

  public getVariants(productId?: string): ProductVariant[] {
    if (productId) {
      return this.variants.filter((v) => v.productId === productId);
    }
    return [...this.variants];
  }

  public getInventoryMovements(variantId?: string): InventoryMovement[] {
    if (variantId) {
      return this.movements.filter((m) => m.variantId === variantId);
    }
    return [...this.movements];
  }

  public adjustStock(params: {
    variantId: string;
    quantityChange: number;
    movementType: InventoryMovement['movementType'];
    notes: string;
    referenceId?: string;
    createdBy?: string;
  }): { variant: ProductVariant; movement: InventoryMovement } {
    const vIndex = this.variants.findIndex((v) => v.id === params.variantId);
    if (vIndex === -1) {
      throw new Error(`Variant ${params.variantId} not found.`);
    }

    const variant = this.variants[vIndex];
    const newQuantity = variant.stockQuantity + params.quantityChange;

    if (newQuantity < 0) {
      throw new Error(
        `Negative inventory prevented. Cannot deduct ${Math.abs(params.quantityChange)} units from available stock of ${variant.stockQuantity}.`
      );
    }

    variant.stockQuantity = newQuantity;
    this.variants[vIndex] = variant;

    // Update parent product total stock and inStock status
    const product = this.products.find((p) => p.id === variant.productId);
    if (product) {
      const allProductVariants = this.variants.filter((v) => v.productId === product.id);
      const totalStock = allProductVariants.reduce((sum, v) => sum + v.stockQuantity, 0);
      product.stockCount = totalStock;
      product.inStock = totalStock > 0 && product.status === 'published';
      product.variants = allProductVariants;
      product.updatedAt = new Date().toISOString();
    }

    // Record movement
    const movement: InventoryMovement = {
      id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      variantId: variant.id,
      productTitle: product?.name || 'Jewellery Design',
      sku: variant.sku,
      movementType: params.movementType,
      quantityChange: params.quantityChange,
      quantityAfter: newQuantity,
      referenceId: params.referenceId || 'MANUAL-ADJ',
      notes: params.notes,
      createdBy: params.createdBy || 'riddhima@rassbyriddhima.com',
      createdAt: new Date().toISOString(),
    };

    this.movements.unshift(movement);
    this.saveState();

    // Asynchronously push stock adjustment to Supabase via serverless API
    if (typeof window !== 'undefined' && window.location?.host) {
      fetch('/api/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'adjust_stock',
          variantId: params.variantId,
          quantityChange: params.quantityChange,
          notes: params.notes,
        }),
      }).catch((err) => {
        console.warn('[StoreService] Cloud stock sync deferred:', err);
      });
    }

    return { variant, movement };
  }

  public setExactStock(params: {
    variantId: string;
    exactQuantity: number;
    reason?: string;
    createdBy?: string;
  }): { variant: ProductVariant; movement: InventoryMovement } {
    if (params.exactQuantity < 0) {
      throw new Error('Stock quantity cannot be negative.');
    }
    const vIndex = this.variants.findIndex((v) => v.id === params.variantId);
    if (vIndex === -1) {
      throw new Error(`Variant ${params.variantId} not found.`);
    }

    const variant = this.variants[vIndex];
    const diff = params.exactQuantity - variant.stockQuantity;
    return this.adjustStock({
      variantId: params.variantId,
      quantityChange: diff,
      movementType: diff >= 0 ? 'purchase_receipt' : 'manual_adjustment',
      notes: params.reason || `Direct inventory update to ${params.exactQuantity} units`,
      createdBy: params.createdBy || 'admin@rassbyriddhima.com',
    });
  }

  public updateLowStockThreshold(variantId: string, threshold: number): ProductVariant {
    if (threshold < 0) throw new Error('Threshold cannot be negative.');
    const variant = this.variants.find((v) => v.id === variantId);
    if (!variant) throw new Error('Variant not found.');
    variant.lowStockThreshold = threshold;
    this.saveState();
    return variant;
  }

  public getLowStockAlerts(): Array<{
    product: Product;
    variant: ProductVariant;
    available: number;
    threshold: number;
  }> {
    const alerts: Array<{
      product: Product;
      variant: ProductVariant;
      available: number;
      threshold: number;
    }> = [];

    for (const v of this.variants) {
      const available = v.stockQuantity - v.reservedQuantity;
      if (available <= v.lowStockThreshold) {
        const prod = this.products.find((p) => p.id === v.productId);
        if (prod && prod.status === 'published') {
          alerts.push({
            product: prod,
            variant: v,
            available,
            threshold: v.lowStockThreshold,
          });
        }
      }
    }

    return alerts;
  }

  public getStockValuation(): {
    totalUnits: number;
    retailValuation: number;
    costValuation: number;
    lowStockSKUs: number;
  } {
    let totalUnits = 0;
    let retailValuation = 0;
    let costValuation = 0;
    let lowStockSKUs = 0;

    for (const v of this.variants) {
      const prod = this.products.find((p) => p.id === v.productId);
      const units = v.stockQuantity;
      totalUnits += units;

      const price = v.priceOverride || prod?.price || 0;
      const cost = prod?.costPrice || Math.round(price * 0.45);

      retailValuation += units * price;
      costValuation += units * cost;

      if (v.stockQuantity - v.reservedQuantity <= v.lowStockThreshold) {
        lowStockSKUs++;
      }
    }

    return {
      totalUnits,
      retailValuation,
      costValuation,
      lowStockSKUs,
    };
  }
}

export const storeService = new StoreService();
