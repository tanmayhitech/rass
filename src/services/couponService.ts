import { Coupon, CouponRedemption, ProductCategory } from '../types';

const STORAGE_KEYS = {
  COUPONS: 'rass_db_coupons',
  REDEMPTIONS: 'rass_db_coupon_redemptions',
};

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-festive20',
    code: 'FESTIVE20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 2999,
    maxDiscountCap: 10000,
    startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 120 * 86400000).toISOString(),
    maxRedemptions: 500,
    redemptionCount: 28,
    maxPerCustomer: 1,
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'coup-rass20',
    code: 'RASS20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 10000,
    maxDiscountCap: 10000,
    startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 90 * 86400000).toISOString(),
    maxRedemptions: 100,
    redemptionCount: 14,
    maxPerCustomer: 1,
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'coup-welcome10',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 15000,
    maxDiscountCap: 3000,
    startDate: new Date(Date.now() - 60 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 180 * 86400000).toISOString(),
    maxRedemptions: 500,
    redemptionCount: 42,
    maxPerCustomer: 1,
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'coup-heirloom5000',
    code: 'HEIRLOOM5000',
    discountType: 'fixed_amount',
    discountValue: 5000,
    minOrderValue: 50000,
    startDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 60 * 86400000).toISOString(),
    maxRedemptions: 50,
    redemptionCount: 6,
    maxPerCustomer: 1,
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  }
];

class CouponService {
  private coupons: Coupon[] = [];
  private redemptions: CouponRedemption[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const storedCoupons = localStorage.getItem(STORAGE_KEYS.COUPONS);
      const storedRedemptions = localStorage.getItem(STORAGE_KEYS.REDEMPTIONS);

      let loaded = storedCoupons ? JSON.parse(storedCoupons) : INITIAL_COUPONS;
      // Ensure default coupons like FESTIVE20 always exist
      INITIAL_COUPONS.forEach((initCoupon) => {
        if (!loaded.some((c: Coupon) => c.code === initCoupon.code)) {
          loaded.push(initCoupon);
        }
      });
      this.coupons = loaded;
      this.redemptions = storedRedemptions ? JSON.parse(storedRedemptions) : [];
    } catch (e) {
      this.coupons = INITIAL_COUPONS;
      this.redemptions = [];
    }
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(this.coupons));
      localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(this.redemptions));
    } catch (e) {
      console.error('Error saving coupon state:', e);
    }
  }

  public getCoupons(includeInactive = true): Coupon[] {
    if (includeInactive) return [...this.coupons];
    return this.coupons.filter((c) => c.isActive);
  }

  public getCouponByCode(code: string): Coupon | undefined {
    return this.coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
  }

  public createCoupon(data: {
    code: string;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
    minOrderValue?: number;
    maxDiscountCap?: number;
    expiryDate?: string;
    maxRedemptions?: number;
    maxPerCustomer?: number;
    isActive?: boolean;
    categoryRestrictions?: ProductCategory[];
  }): Coupon {
    const formattedCode = data.code.trim().toUpperCase();
    if (!formattedCode) throw new Error('Coupon code is required.');

    const exists = this.coupons.some((c) => c.code === formattedCode);
    if (exists) {
      throw new Error(`Coupon with code "${formattedCode}" already exists.`);
    }

    if (data.discountValue <= 0) {
      throw new Error('Discount value must be greater than 0.');
    }

    if (data.discountType === 'percentage' && data.discountValue > 100) {
      throw new Error('Percentage discount cannot exceed 100%.');
    }

    const newCoupon: Coupon = {
      id: `coup-${Date.now().toString(36)}`,
      code: formattedCode,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minOrderValue: data.minOrderValue || 0,
      maxDiscountCap: data.maxDiscountCap,
      startDate: new Date().toISOString(),
      expiryDate: data.expiryDate,
      maxRedemptions: data.maxRedemptions,
      redemptionCount: 0,
      maxPerCustomer: data.maxPerCustomer || 1,
      isActive: data.isActive !== undefined ? data.isActive : true,
      categoryRestrictions: data.categoryRestrictions,
      createdAt: new Date().toISOString(),
    };

    this.coupons.unshift(newCoupon);
    this.saveState();
    return newCoupon;
  }

  public updateCoupon(id: string, updates: Partial<Coupon>): Coupon {
    const index = this.coupons.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Coupon ${id} not found.`);

    if (updates.code) {
      const codeUpper = updates.code.trim().toUpperCase();
      const duplicate = this.coupons.some((c) => c.id !== id && c.code === codeUpper);
      if (duplicate) throw new Error(`Code "${codeUpper}" is already in use.`);
      updates.code = codeUpper;
    }

    this.coupons[index] = { ...this.coupons[index], ...updates };
    this.saveState();
    return this.coupons[index];
  }

  public toggleCouponActive(id: string): Coupon {
    const coupon = this.coupons.find((c) => c.id === id);
    if (!coupon) throw new Error(`Coupon ${id} not found.`);
    coupon.isActive = !coupon.isActive;
    this.saveState();
    return coupon;
  }

  public deleteCoupon(id: string): void {
    this.coupons = this.coupons.filter((c) => c.id !== id);
    this.saveState();
  }

  /**
   * Server-grade validation and calculation
   */
  public validateCoupon(params: {
    code: string;
    subtotal: number;
    customerEmail?: string;
  }): {
    valid: boolean;
    message: string;
    discountAmount: number;
    coupon?: Coupon;
  } {
    const formatted = params.code.trim().toUpperCase();
    const coupon = this.coupons.find((c) => c.code === formatted);

    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code.', discountAmount: 0 };
    }

    if (!coupon.isActive) {
      return { valid: false, message: 'This coupon is currently inactive.', discountAmount: 0 };
    }

    // Check expiry
    if (coupon.expiryDate && new Date(coupon.expiryDate).getTime() < Date.now()) {
      return { valid: false, message: 'This coupon has expired.', discountAmount: 0 };
    }

    // Check minimum order value
    if (params.subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        message: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required.`,
        discountAmount: 0,
      };
    }

    // Check global usage limit
    if (coupon.maxRedemptions && coupon.redemptionCount >= coupon.maxRedemptions) {
      return { valid: false, message: 'This coupon has reached its maximum redemptions limit.', discountAmount: 0 };
    }

    // Check per-customer limit
    if (params.customerEmail) {
      const customerRedemptions = this.redemptions.filter(
        (r) => r.couponId === coupon.id && r.customerEmail.toLowerCase() === params.customerEmail?.toLowerCase()
      ).length;

      if (customerRedemptions >= coupon.maxPerCustomer) {
        return {
          valid: false,
          message: 'You have already reached the redemption limit for this promotion.',
          discountAmount: 0,
        };
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((params.subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountCap && discountAmount > coupon.maxDiscountCap) {
        discountAmount = coupon.maxDiscountCap;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, params.subtotal);
    }

    return {
      valid: true,
      message: `Coupon "${coupon.code}" applied successfully! You saved ₹${discountAmount.toLocaleString('en-IN')}`,
      discountAmount,
      coupon,
    };
  }

  public recordRedemption(params: {
    couponId: string;
    orderId: string;
    customerEmail: string;
    discountApplied: number;
  }): void {
    const coupon = this.coupons.find((c) => c.id === params.couponId);
    if (coupon) {
      coupon.redemptionCount += 1;
    }

    this.redemptions.push({
      id: `redemp-${Date.now()}`,
      couponId: params.couponId,
      orderId: params.orderId,
      customerEmail: params.customerEmail,
      discountApplied: params.discountApplied,
      redeemedAt: new Date().toISOString(),
    });

    this.saveState();
  }

  public getRedemptions(couponId?: string): CouponRedemption[] {
    if (couponId) {
      return this.redemptions.filter((r) => r.couponId === couponId);
    }
    return [...this.redemptions];
  }
}

export const couponService = new CouponService();
