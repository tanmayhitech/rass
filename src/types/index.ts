export type ProductCategory = 
  | 'rings'
  | 'jhumka'
  | 'necklaces'
  | 'earrings'
  | 'kangan-sets'
  | 'kangna'
  | 'bracelets';

export type ProductStatus = 'draft' | 'published' | 'archived' | 'inactive';

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  variantName: string;
  optionType: string;
  optionValue: string;
  priceOverride?: number;
  isActive: boolean;
  stockQuantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
}

export interface Product {
  id: string;
  name: string;
  title?: string;
  slug?: string;
  category: ProductCategory;
  categoryDisplay: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  image: string;
  cleanImage: string;
  additionalImages?: string[];
  description: string;
  details: string[];
  metal: string;
  gemstones: string;
  inStock: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  dimensions?: string;
  weight?: string;
  sku?: string;
  status?: ProductStatus;
  variants?: ProductVariant[];
  stockCount?: number;
  lowStockThreshold?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  variantId?: string;
}

export type PaymentStatus = 
  | 'pending' 
  | 'authorized' 
  | 'captured' 
  | 'failed' 
  | 'refunded' 
  | 'partially_refunded';

export type FulfilmentStatus = 
  | 'unfulfilled' 
  | 'processing' 
  | 'ready_to_ship' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'returned';

export interface OrderItemSnapshot {
  id: string;
  productId: string;
  productTitle: string;
  variantName: string;
  sku: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  lineSubtotal: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  items: CartItem[];
  itemSnapshots?: OrderItemSnapshot[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax?: number;
  total: number;
  date: string;
  orderTime?: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus?: PaymentStatus;
  fulfilmentStatus?: FulfilmentStatus;
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  awbNumber?: string;
  courierPartner?: string;
  trackingUrl?: string;
  adminNotes?: string;
  appliedCoupon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryMovement {
  id: string;
  variantId: string;
  productTitle: string;
  sku: string;
  movementType: 
    | 'purchase_receipt' 
    | 'order_reservation' 
    | 'order_deduction' 
    | 'order_restock' 
    | 'manual_adjustment' 
    | 'damaged' 
    | 'audit_variance';
  quantityChange: number;
  quantityAfter: number;
  referenceId?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minOrderValue: number;
  maxDiscountCap?: number;
  startDate: string;
  expiryDate?: string;
  maxRedemptions?: number;
  redemptionCount: number;
  maxPerCustomer: number;
  isActive: boolean;
  categoryRestrictions?: ProductCategory[];
  createdAt: string;
}

export interface CouponRedemption {
  id: string;
  couponId: string;
  orderId: string;
  customerEmail: string;
  discountApplied: number;
  redeemedAt: string;
}

export interface ProductPerformance {
  productId: string;
  productTitle: string;
  sku: string;
  category: ProductCategory;
  unitsSold: number;
  grossRevenue: number;
  discounts: number;
  refunds: number;
  netRevenue: number;
  stockAvailable: number;
  imageUrl: string;
  unitsPerWeek?: number;
  velocityScore?: number;
  velocityTier?: 'hot' | 'trending' | 'steady' | 'slow';
  daysOfInventoryLeft?: number;
  revenueContributionPct?: number;
  restockRecommendation?: number;
  stockoutRisk?: 'critical' | 'moderate' | 'healthy' | 'excess';
}

export interface AnalyticsSummary {
  grossSalesToday: number;
  netSalesToday: number;
  paidRevenueTotal: number;
  codOrdersCount: number;
  codCollectionsTotal: number;
  totalOrdersCount: number;
  averageOrderValue: number;
  totalRefunds: number;
  totalDiscounts: number;
  pendingPayments: number;
  lowStockVariantsCount: number;
}

export type ActivePage = 'home' | 'shop' | 'about' | 'help' | 'admin' | 'cart';

export type InfoSection = 
  | 'story'
  | 'materials'
  | 'care'
  | 'sizing'
  | 'faqs'
  | 'contact'
  | 'shipping'
  | 'returns'
  | 'privacy'
  | 'terms';

// ============================================================================
// ADMIN AUTHENTICATION & DATABASE DIAGNOSTIC TYPES
// ============================================================================

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
  name?: string;
  authProvider: 'supabase' | 'master_credential';
  lastLogin: string;
}

export interface DatabaseFeatureTestResult {
  id: string;
  featureName: string;
  category: 'schema' | 'catalog' | 'inventory' | 'promotions' | 'security' | 'rpc';
  status: 'passed' | 'failed' | 'running';
  latencyMs?: number;
  details: string;
  error?: string;
}

