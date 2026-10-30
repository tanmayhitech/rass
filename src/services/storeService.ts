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

// Initial Variants generated from PRODUCTS
const INITIAL_VARIANTS: ProductVariant[] = [
  {
    id: 'var-ring-01-std',
    productId: 'rass-ring-01',
    sku: 'RASS-RNG-01-STD',
    variantName: 'Standard Adjustable',
    optionType: 'Size',
    optionValue: 'Adjustable',
    isActive: true,
    stockQuantity: 12,
    reservedQuantity: 0,
    lowStockThreshold: 3,
  },
  {
    id: 'var-earring-01-std',
    productId: 'rass-earring-01',
    sku: 'RASS-EAR-01-STD',
    variantName: 'Standard Pair',
    optionType: 'Size',
    optionValue: 'Standard',
    isActive: true,
    stockQuantity: 8,
    reservedQuantity: 0,
    lowStockThreshold: 2,
  },
  {
    id: 'var-jhumka-01-std',
    productId: 'rass-jhumka-01',
    sku: 'RASS-JHM-01-STD',
    variantName: 'Standard Pair',
    optionType: 'Size',
    optionValue: 'Standard',
    isActive: true,
    stockQuantity: 15,
    reservedQuantity: 0,
    lowStockThreshold: 4,
  },
  {
    id: 'var-kangan-01-std',
    productId: 'rass-kangan-01',
    sku: 'RASS-KST-01-STD',
    variantName: 'Standard Set',
    optionType: 'Size',
    optionValue: 'Standard',
    isActive: true,
    stockQuantity: 6,
    reservedQuantity: 0,
    lowStockThreshold: 2,
  },
  {
    id: 'var-kangna-01-24',
    productId: 'rass-kangna-01',
    sku: 'RASS-KNG-01-24',
    variantName: 'Size 2.4',
    optionType: 'Size',
    optionValue: '2.4',
    isActive: true,
    stockQuantity: 4,
    reservedQuantity: 0,
    lowStockThreshold: 2,
  },
  {
    id: 'var-kangna-01-26',
    productId: 'rass-kangna-01',
    sku: 'RASS-KNG-01-26',
    variantName: 'Size 2.6',
    optionType: 'Size',
    optionValue: '2.6',
    isActive: true,
    stockQuantity: 10,
    reservedQuantity: 0,
    lowStockThreshold: 3,
  },
  {
    id: 'var-kangna-01-28',
    productId: 'rass-kangna-01',
    sku: 'RASS-KNG-01-28',
    variantName: 'Size 2.8',
    optionType: 'Size',
    optionValue: '2.8',
    isActive: true,
    stockQuantity: 5,
    reservedQuantity: 0,
    lowStockThreshold: 2,
  },
  {
    id: 'var-neck-01-std',
    productId: 'rass-necklace-01',
    sku: 'RASS-NCK-01-STD',
    variantName: 'Standard Collar',
    optionType: 'Size',
    optionValue: 'Standard',
    isActive: true,
    stockQuantity: 2, // Low stock demo!
    reservedQuantity: 0,
    lowStockThreshold: 3,
  },
  {
    id: 'var-brac-01-std',
    productId: 'rass-bracelet-01',
    sku: 'RASS-BRC-01-STD',
    variantName: 'Standard 6.5"',
    optionType: 'Size',
    optionValue: 'Standard',
    isActive: true,
    stockQuantity: 9,
    reservedQuantity: 0,
    lowStockThreshold: 3,
  },
  {
    id: 'var-kangna-02-26',
    productId: 'rass-kangna-02',
    sku: 'RASS-KNG-02-26',
    variantName: 'Size 2.6',
    optionType: 'Size',
    optionValue: '2.6',
    isActive: true,
    stockQuantity: 7,
    reservedQuantity: 0,
    lowStockThreshold: 2,
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

      this.products = storedProducts ? JSON.parse(storedProducts) : INITIAL_PRODUCTS;
      this.variants = storedVariants ? JSON.parse(storedVariants) : INITIAL_VARIANTS;
      this.movements = storedMovements ? JSON.parse(storedMovements) : INITIAL_MOVEMENTS;
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
