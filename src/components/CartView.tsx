import React, { useState } from 'react';
import { 
  Trash2, 
  ArrowLeft, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import { CartItem } from '../types';

interface CartViewProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onContinueShopping,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<'RASS20' | 'WELCOME10' | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');

  const FREE_SHIPPING_THRESHOLD = 2999;
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = Math.round(subtotal * (discountPercent / 100));
  const total = subtotal - discount;
  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);

  const applyCoupon = (code: string) => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'RASS20') {
      setActiveCoupon('RASS20');
      setDiscountPercent(20);
      setPromoCode('RASS20');
      setPromoError('');
    } else if (formatted === 'WELCOME10') {
      setActiveCoupon('WELCOME10');
      setDiscountPercent(10);
      setPromoCode('WELCOME10');
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try RASS20 or WELCOME10');
    }
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    applyCoupon(promoCode);
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setDiscountPercent(0);
    setPromoCode('');
    setPromoError('');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-[1060px] mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <button 
          onClick={onContinueShopping}
          className="inline-flex items-center space-x-2 text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#8C827A] hover:text-[#292624] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>

        {/* Title */}
        <div className="border-b border-[#E7E0DA] pb-6 mb-8 flex items-baseline justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="font-playfair text-[30px] sm:text-[38px] text-[#292624] font-medium tracking-tight">
              Shopping Bag
            </h1>
            {totalQuantity > 0 && (
              <span className="font-sans text-[11.5px] font-semibold text-[#77716F] bg-white border border-[#E7E0DA] px-2.5 py-0.5 rounded-full">
                {totalQuantity} {totalQuantity === 1 ? 'piece' : 'pieces'}
              </span>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 border border-[#E7E0DA] rounded-[12px] bg-white p-8 max-w-lg mx-auto shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E7E0DA] flex items-center justify-center text-[#A783A2] mx-auto mb-4">
              <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
            </div>
            <p className="font-playfair text-[24px] text-[#292624] mb-2 font-medium">
              Your bag is currently empty
            </p>
            <p className="text-[13px] text-[#7A7471] mb-6 max-w-xs mx-auto leading-relaxed font-sans">
              Discover our handcrafted heirlooms curated with fine pearls, gemstones, and precious gold.
            </p>
            <button
              onClick={onContinueShopping}
              className="px-8 py-3.5 rounded-full bg-[#24211E] hover:bg-black text-white text-[11.5px] font-sans font-medium tracking-[0.16em] uppercase transition-all shadow-sm active:scale-98 cursor-pointer"
            >
              Explore Heirlooms
            </button>
          </div>
        ) : (
          /* Populated Bag with Coupon Option */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Items List (7 cols) */}
            <div className="lg:col-span-7 divide-y divide-[#E7E0DA] border-y border-[#E7E0DA]">
              {items.map((item) => (
                <div key={item.product.id} className="py-6 flex gap-4 sm:gap-6 items-start group">
                  <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-[10px] bg-[#F4F1EC] border border-[#E7E0DA] overflow-hidden shrink-0 shadow-2xs">
                    <img
                      src={item.product.cleanImage || item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-playfair text-[16.5px] sm:text-[18px] text-[#292624] font-medium leading-snug">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-[#A8A19C] hover:text-[#C53030] transition-colors p-1 cursor-pointer active:scale-90"
                          aria-label={`Remove ${item.product.name}`}
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.8]" />
                        </button>
                      </div>

                      <p className="text-[11.5px] text-[#8C827A] font-sans mt-0.5">
                        {item.product.categoryDisplay} {item.product.metal ? `• ${item.product.metal}` : ''}
                      </p>
                      {item.selectedSize && (
                        <span className="inline-block text-[10.5px] font-sans text-[#77716F] bg-white border border-[#E7E0DA] px-2 py-0.5 rounded mt-1.5">
                          Size: {item.selectedSize}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-auto">
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center border border-[#E7E0DA] rounded-full bg-white px-2 py-0.5 shadow-2xs">
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

                      {/* Total in font-sans (NO SERIF in numbers) */}
                      <div className="text-right">
                        <span className="font-sans text-[15px] sm:text-[16px] font-semibold text-[#292624] block">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10.5px] text-[#8C827A] font-sans block mt-0.5">
                            ₹{item.product.price.toLocaleString('en-IN')} each
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Summary + Coupon Section (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-[#E7E0DA] rounded-[12px] p-5 sm:p-7 space-y-5 shadow-xs sticky top-24">
              <h2 className="font-serif text-[19px] text-[#292624] font-medium pb-3 border-b border-[#E7E0DA]">
                Order Summary
              </h2>

              {/* Coupon Code Option */}
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C827A]">
                  Coupon Code
                </label>

                {activeCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-[8px] border border-[#E7E0DA] text-xs">
                    <div>
                      <span className="font-sans font-semibold text-[#292624] tracking-wide block">
                        {activeCoupon} ({discountPercent}% OFF)
                      </span>
                      <span className="text-[10px] text-[#77716F]">Discount applied</span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-[#77716F] hover:text-[#292624] text-[11px] font-medium underline cursor-pointer"
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
                      <p className="text-[11px] font-sans text-red-600 mt-1 pl-1">{promoError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Calculations (NO SERIF in numbers, Neutral colors) */}
              <div className="space-y-2 text-[13px] text-[#77716F] pt-3 border-t border-[#E7E0DA]">
                <div className="flex justify-between items-baseline">
                  <span>Subtotal</span>
                  <span className="font-sans font-medium text-[#292624] text-[14px]">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-baseline text-[#292624] font-medium">
                    <span>Preferred Discount ({discountPercent}%)</span>
                    <span className="font-sans font-semibold">
                      -₹{discount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-baseline">
                  <span>Insured Express Shipping</span>
                  <span className="font-medium text-[#292624]">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? 'Complimentary' : 'Calculated at checkout'}
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-[15px] text-[#292624] font-medium pt-2.5 border-t border-[#E7E0DA]">
                  <span className="font-semibold text-[13.5px] uppercase tracking-wider">Total Payable</span>
                  <span className="font-sans text-[18px] font-bold text-[#292624]">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onCheckout}
                className="w-full h-12 sm:h-13 rounded-full bg-[#24211E] hover:bg-black text-white text-[12.5px] font-sans font-semibold tracking-[0.14em] uppercase transition-all shadow-[0_4px_16px_rgba(36,33,30,0.2)] hover:shadow-[0_6px_22px_rgba(36,33,30,0.3)] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </button>

              <p className="text-center text-[11px] text-[#8C827A] font-sans flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8C827A]" />
                <span>256-bit encrypted secure checkout</span>
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

