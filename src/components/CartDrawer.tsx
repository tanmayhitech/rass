import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  ArrowRight, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ShieldCheck 
} from 'lucide-react';
import { CartItem } from '../types';
import { couponService } from '../services/couponService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState('');

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 2999;
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = discountAmount;
  const total = Math.max(0, subtotal - discount);
  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);

  const applyCoupon = (code: string) => {
    const res = couponService.validateCoupon({
      code,
      subtotal,
    });

    if (res.valid) {
      setActiveCoupon(res.coupon?.code || code.trim().toUpperCase());
      setDiscountAmount(res.discountAmount);
      setPromoCode(res.coupon?.code || code.trim().toUpperCase());
      setPromoError('');
    } else {
      setActiveCoupon(null);
      setDiscountAmount(0);
      setPromoError(res.message);
    }
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    applyCoupon(promoCode);
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setDiscountAmount(0);
    setPromoCode('');
    setPromoError('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden flex justify-end" 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="bag-heading"
    >
      {/* 1. Backdrop */}
      <div 
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 animate-fadeIn" 
        onClick={onClose} 
      />

      {/* 2. Slide-out Drawer Panel */}
      <div className="relative w-full sm:w-[420px] bg-[#FAF8F5] shadow-[-12px_0_36px_rgba(41,38,36,0.18)] flex flex-col justify-between h-full border-l border-[#E7E0DA] z-10 animate-slideLeft">
        
        {/* Header (Clean & Minimal) */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-[#E7E0DA] bg-white/80 backdrop-blur-xs flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <h2 id="bag-heading" className="font-playfair text-[20px] sm:text-[22px] text-[#292624] font-medium tracking-wide">
              Shopping Bag
            </h2>
            {totalQuantity > 0 && (
              <span className="font-sans text-[11px] font-medium text-[#77716F] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#E7E0DA]">
                {totalQuantity} {totalQuantity === 1 ? 'piece' : 'pieces'}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#E7E0DA] hover:border-[#292624] hover:bg-[#FAF8F5] flex items-center justify-center text-[#77716F] hover:text-[#292624] transition-all active:scale-90 cursor-pointer"
            aria-label="Close shopping bag"
          >
            <X className="w-4 h-4 stroke-[1.8]" />
          </button>
        </div>

        {/* Body: Items or Empty */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 divide-y divide-[#E7E0DA]/80 overscroll-contain">
          {items.length === 0 ? (
            <div className="h-full min-h-[340px] flex flex-col items-center justify-center text-center py-14 px-6">
              <div className="w-16 h-16 rounded-full bg-white border border-[#E7E0DA] flex items-center justify-center text-[#A783A2] mb-4 shadow-xs">
                <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
              </div>
              <p className="font-playfair text-[20px] text-[#292624] mb-1.5 font-medium">
                Your bag is empty
              </p>
              <p className="text-[12.5px] text-[#77716F] mb-6 max-w-xs leading-relaxed font-sans font-normal">
                Discover our handcrafted heirlooms curated with fine pearls, gemstones, and precious gold.
              </p>
              <button
                onClick={onClose}
                className="px-7 py-3 rounded-full bg-[#24211E] hover:bg-black text-white text-[11px] font-sans font-medium tracking-[0.14em] uppercase transition-all shadow-sm active:scale-98 cursor-pointer"
              >
                Explore Heirlooms
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="py-4 sm:py-5 flex gap-3.5 sm:gap-4 items-start group">
                {/* Thumbnail */}
                <div className="w-20 h-24 sm:w-22 sm:h-26 rounded-[10px] bg-[#F4F1EC] border border-[#E7E0DA] overflow-hidden shrink-0 shadow-2xs">
                  <img
                    src={item.product.cleanImage || item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                  <div>
                    <div className="flex items-start justify-between gap-1.5">
                      <h3 className="font-serif text-[15px] sm:text-[16px] text-[#292624] font-medium leading-snug line-clamp-1">
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#A8A19C] hover:text-[#C53030] transition-colors p-1 -mr-1 cursor-pointer active:scale-90"
                        aria-label={`Remove ${item.product.name}`}
                        title="Remove piece"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.8]" />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#8C827A] font-sans mt-0.5 truncate">
                      {item.product.categoryDisplay} {item.product.metal ? `• ${item.product.metal}` : ''}
                    </p>
                    {item.selectedSize && (
                      <span className="inline-block text-[10px] font-sans text-[#77716F] bg-white border border-[#E7E0DA] px-1.5 py-0.2 rounded mt-1">
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-auto">
                    {/* Quantity Stepper */}
                    <div className="inline-flex items-center border border-[#E7E0DA] rounded-full bg-white px-1.5 py-0.5 shadow-2xs">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            onUpdateQuantity(item.product.id, item.quantity - 1);
                          } else {
                            onRemoveItem(item.product.id);
                          }
                        }}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[#77716F] hover:text-[#292624] hover:bg-[#FAF8F5] transition-colors active:scale-90 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3 stroke-[2.2]" />
                      </button>
                      <span className="w-6 text-center font-sans font-semibold text-[12px] text-[#292624]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[#77716F] hover:text-[#292624] hover:bg-[#FAF8F5] transition-colors active:scale-90 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3 stroke-[2.2]" />
                      </button>
                    </div>

                    {/* Price (NO SERIF on numbers) */}
                    <div className="text-right">
                      <span className="font-sans text-[14.5px] sm:text-[15.5px] font-semibold text-[#292624] block">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-[#8C827A] font-sans block mt-0.5">
                          ₹{item.product.price.toLocaleString('en-IN')} each
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Coupon Option & Price Breakdown */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#E7E0DA] bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.04)] space-y-3.5 shrink-0">
            
            {/* Coupon Code Option (Clean & Minimal) */}
            <div className="pb-2.5 border-b border-[#E7E0DA]/80">
              {activeCoupon ? (
                <div className="flex items-center justify-between px-3 py-2 bg-[#FAF8F5] rounded-[6px] border border-[#E7E0DA] text-xs font-sans">
                  <div>
                    <span className="font-semibold text-[#292624] text-[11.5px] tracking-wide block leading-tight">
                      {activeCoupon} (-₹{discount.toLocaleString('en-IN')})
                    </span>
                    <span className="text-[10px] text-emerald-800 font-medium">Promotional discount applied</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-[#77716F] hover:text-[#292624] text-[11px] font-medium underline transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleCouponSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Coupon code"
                      className="flex-1 h-9 px-3 rounded-[6px] border border-[#E7E0DA] bg-[#FAF8F5] text-xs font-sans uppercase tracking-wider text-[#292624] placeholder:text-[#A8A19C] placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:border-[#292624] focus:bg-white transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!promoCode.trim()}
                      className="px-4 h-9 rounded-[6px] bg-[#24211E] hover:bg-black disabled:opacity-40 text-white text-[11px] font-sans font-medium tracking-wider uppercase transition-colors shrink-0 cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                  {promoError && (
                    <p className="text-[10.5px] font-sans text-red-600 mt-1 pl-1">{promoError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Price Calculations (Minimal & Neutral) */}
            <div className="space-y-1.5 text-xs font-sans">
              <div className="flex justify-between items-baseline text-[#77716F]">
                <span className="text-[11.5px] uppercase tracking-wider">Subtotal</span>
                <span className="font-sans font-medium text-[#292624] text-[13.5px]">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-baseline text-emerald-800 font-medium">
                  <span className="text-[11.5px] uppercase tracking-wider">Promotion Discount {activeCoupon ? `(${activeCoupon})` : ''}</span>
                  <span className="font-sans font-semibold">
                    -₹{discount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-baseline text-[#77716F]">
                <span className="text-[11.5px] uppercase tracking-wider">Insured Shipping</span>
                <span className="font-medium text-[#292624]">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? 'Complimentary' : 'Calculated at checkout'}
                </span>
              </div>

              <div className="flex justify-between items-baseline text-[14px] font-medium text-[#292624] pt-2 border-t border-[#E7E0DA]">
                <span className="text-[12px] uppercase tracking-wider font-semibold">Total Payable</span>
                <span className="font-sans text-[17px] font-bold text-[#292624]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full h-12 sm:h-13 rounded-full bg-[#24211E] hover:bg-black text-white text-[12.5px] sm:text-[13px] font-sans font-semibold tracking-[0.12em] uppercase transition-all shadow-[0_4px_16px_rgba(36,33,30,0.2)] hover:shadow-[0_6px_22px_rgba(36,33,30,0.3)] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Checkout • ₹{total.toLocaleString('en-IN')}</span>
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Micro Reassurance */}
            <p className="text-center text-[10.5px] text-[#8C827A] font-sans flex items-center justify-center gap-1.5 pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8C827A]" />
              <span>100% Insured Delivery • Tamper-proof Packaging</span>
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

