import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, Gift, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WelcomeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAndShop: (couponCode: string) => void;
}

export const WelcomeOfferModal: React.FC<WelcomeOfferModalProps> = ({
  isOpen,
  onClose,
  onApplyAndShop,
}) => {
  const [copied, setCopied] = useState(false);
  const couponCode = 'FESTIVE20';

  if (!isOpen) return null;

  const handleCopy = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      
      // Joyful celebratory confetti burst
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A783A2', '#B49A6C', '#FAF8F5', '#E2D5E5'],
        });
      } catch (err) {
        // Fallback gracefully if confetti fails
      }

      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShopNow = () => {
    handleCopy();
    onApplyAndShop(couponCode);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-offer-title"
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl border border-[#A783A2]/40 shadow-[0_20px_60px_rgba(41,38,36,0.25)] overflow-hidden animate-slideUp text-[#292624]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Decorative Botanical Sprigs in Background */}
        <div className="absolute top-0 left-0 pointer-events-none opacity-20 select-none" aria-hidden="true">
          <img
            src="/elements/Mauve Botanical Sprig Line Art.png"
            alt=""
            className="w-24 sm:w-32 h-auto object-contain object-top-left"
          />
        </div>
        <div className="absolute top-0 right-0 pointer-events-none opacity-20 select-none -scale-x-100" aria-hidden="true">
          <img
            src="/elements/Mauve Botanical Sprig Line Art.png"
            alt=""
            className="w-24 sm:w-32 h-auto object-contain object-top-right"
          />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#77716F] hover:text-[#292624] border border-[#E7E0DA] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
          aria-label="Close welcome offer modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 pt-7 sm:pt-9 text-center relative z-10">
          
          {/* Top Privilege Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF5F9] border border-[#A783A2]/30 text-[#8B5E86] text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-semibold mb-3">
            <Sparkles className="w-3 h-3 text-[#A783A2]" />
            <span>WELCOME PRIVILEGE • FIRST VISIT</span>
          </div>

          {/* Headline */}
          <h2
            id="welcome-offer-title"
            className="font-luxury-serif text-[28px] sm:text-[36px] font-normal text-[#292624] tracking-tight leading-[1.18] mb-2"
          >
            A Little Magic for Your<br />First Rass Piece
          </h2>

          <p className="font-sans text-[13px] sm:text-[14px] text-[#77716F] leading-relaxed max-w-sm mx-auto mb-5">
            Enjoy an exclusive <strong>20% discount</strong> across our handcrafted demi-fine jewelry collections.
          </p>

          {/* Coupon Ticket Voucher Box */}
          <div className="bg-[#FAF5F9] rounded-2xl border-2 border-dashed border-[#A783A2]/50 p-4 sm:p-5 relative mb-6 shadow-2xs group hover:border-[#A783A2] transition-colors">
            
            {/* Ticket Left & Right Cutout Notches */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FAF8F5] border-r-2 border-dashed border-[#A783A2]/50" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FAF8F5] border-l-2 border-dashed border-[#A783A2]/50" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#8B5E86] font-semibold block mb-0.5">
                  Exclusive Coupon Code
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-[#292624]">
                  {couponCode}
                </span>
                <p className="text-[11px] text-[#77716F] mt-0.5">
                  Flat 20% OFF • Min. cart ₹2,999
                </p>
              </div>

              {/* Copy Code Button */}
              <button
                type="button"
                onClick={handleCopy}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center space-x-1.5 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#A783A2] hover:bg-[#936E8F] text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleShopNow}
              className="w-full py-3.5 px-6 rounded-full bg-[#292624] hover:bg-black text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-98 cursor-pointer"
            >
              <span>Apply & Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-[11px] sm:text-xs text-[#8C827A] hover:text-[#292624] transition-colors cursor-pointer py-1 block mx-auto underline-offset-4 hover:underline"
            >
              No thanks, I will browse at full price
            </button>
          </div>

          {/* Value Badges Bottom Row */}
          <div className="mt-5 pt-4 border-t border-[#E7E0DA] grid grid-cols-3 gap-2 text-[10px] sm:text-[11px] text-[#77716F]">
            <div className="flex items-center justify-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#A783A2] shrink-0" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B49A6C] shrink-0" />
              <span>Anti-Tarnish</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Gift className="w-3.5 h-3.5 text-[#A783A2] shrink-0" />
              <span>Luxury Box</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
