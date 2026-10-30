import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  ChevronDown, 
  Sparkles, 
  Gem, 
  ArrowRight,
  Award
} from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('specs');

  // Reset quantity and accordion state when new product opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setActiveAccordion('specs');
    }
  }, [isOpen, product?.id]);

  // Lock body scroll when Quick View modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const toggleAccordion = (key: string) => {
    setActiveAccordion(activeAccordion === key ? null : key);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 lg:p-8" 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      {/* 1. Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn" 
        onClick={onClose} 
        aria-hidden="true"
      />

      {/* 2. Main Modal Container */}
      {/* 2. Main Modal Container */}
      {/* Mobile: Full-width pull-up sheet (max-h 92vh) | Desktop: Centered fixed-height luxury dialog (640-670px) */}
      <div className="relative bg-[#FAF8F5] rounded-t-[24px] md:rounded-[22px] max-w-4xl lg:max-w-5xl w-full max-h-[92vh] md:max-h-[88vh] md:h-[640px] lg:h-[670px] overflow-hidden shadow-2xl border-t md:border border-[#E7E0DA] flex flex-col z-10 animate-slideUp md:animate-fadeIn">
        
        {/* Mobile Pull-up Grabber Handle */}
        <div className="md:hidden w-12 h-1 bg-[#D6CDC5] rounded-full mx-auto my-2.5 shrink-0" />

        {/* Mobile Header Bar */}
        <div className="md:hidden px-4 py-2 border-b border-[#E7E0DA]/80 flex items-center justify-between bg-[#FAF8F5]/95 shrink-0">
          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.2em] text-[#8C827A] uppercase">
            <span className="text-[#A783A2]">✦</span>
            <span>Quick View • {product.categoryDisplay}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-[#292624] flex items-center justify-center border border-[#E7E0DA] shadow-xs active:scale-90"
            aria-label="Close Quick View"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop Close Button (Floating Top Right) */}
        <button
          onClick={onClose}
          className="hidden md:flex absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#292624] items-center justify-center shadow-xs border border-[#E7E0DA] transition-all hover:scale-105 active:scale-95"
          aria-label="Close Quick View"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* SCROLLABLE BODY ON MOBILE (< md), SPLIT COLUMNS ON DESKTOP (md+) */}
        <div className="flex-1 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row md:h-full overscroll-contain">
          {/* ======================================================== */}
          {/* LEFT COLUMN: STATIC IMAGE PRESENTATION                   */}
          {/* ======================================================== */}
          <div className="w-full md:w-[48%] lg:w-[46%] bg-[#F5F2ED]/70 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-[#E7E0DA] shrink-0">
            
            <div className="relative w-full aspect-[4/3] xs:aspect-[1/1] md:aspect-square max-w-[280px] sm:max-w-[340px] md:max-w-[380px] rounded-[16px] overflow-hidden bg-white shadow-card border border-[#E7E0DA]/85 group">
            <img
              src={product.cleanImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
              {product.isBestseller && (
                <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-[#5C5856] text-[9.5px] uppercase tracking-[0.2em] font-medium px-2.5 py-1 rounded-full border border-[#E7E0DA] shadow-xs">
                  <Sparkles className="w-2.5 h-2.5 text-[#A783A2]" />
                  Bestseller
                </span>
              )}
              {discountPercent > 0 && (
                <span className="inline-flex items-center bg-[#EAF0E6] text-[#465E3D] text-[9.5px] font-semibold tracking-wider px-2 py-0.5 rounded-full border border-[#D5E3CC]">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Wishlist Button on Image for Mobile */}
            <button
              onClick={() => onToggleWishlist(product)}
              className={`md:hidden absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 shadow-xs active:scale-90 ${
                isWishlisted
                  ? 'bg-[#EFE8F0] text-[#A783A2] border border-[#A783A2]/40'
                  : 'bg-white/90 backdrop-blur-md text-[#292624] border border-[#E7E0DA]'
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#A783A2] text-[#A783A2]' : 'text-[#5C5856]'}`} />
            </button>

            {/* Desktop Hallmark Bottom Micro-Bar */}
            <div className="hidden md:flex absolute inset-x-0 bottom-0 py-2 px-3.5 bg-white/92 backdrop-blur-md border-t border-[#E7E0DA]/70 items-center justify-between text-[9px] tracking-[0.22em] uppercase text-[#77716F]">
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3 text-[#A783A2]" />
                <span>18K Gold Vermeil</span>
              </span>
              <span>Handcrafted with Care</span>
            </div>
          </div>

          {/* Desktop Subtitle below Image */}
          <div className="hidden md:flex items-center gap-2 mt-4 text-[#8C827A] text-xs">
            <span className="text-[#A783A2]">✦</span>
            <span className="font-playfair italic text-[13px] text-[#77716F]">Curated for the Modern Muse</span>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: SCROLLABLE PRODUCT DETAILS & ACTIONS       */}
        {/* ======================================================== */}
        <div className="w-full md:w-[52%] lg:w-[54%] md:h-full md:overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between overscroll-contain">
          <div>
            
            {/* 1. Category & In-Stock Status */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10.5px] font-semibold tracking-[0.24em] text-[#8C827A] uppercase">
                {product.categoryDisplay}
              </span>
              <span className="text-[10.5px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>In Stock, Ready to Ship</span>
              </span>
            </div>

            {/* 2. Product Name */}
            <h2 
              id="quickview-title"
              className="font-playfair text-[24px] sm:text-[28px] lg:text-[32px] leading-tight text-[#292624] font-medium mb-2.5 pr-8"
            >
              {product.name}
            </h2>

            {/* 3. Pricing Row (NO SERIF in numbers) */}
            <div className="flex items-baseline flex-wrap gap-2 mb-4 pb-3.5 border-b border-[#E7E0DA]/80">
              <span className="font-sans text-[22px] sm:text-[26px] text-[#292624] font-bold tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-[14px] text-[#9E9793] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-[11px] text-[#A783A2] font-semibold tracking-wide ml-1">
                Inclusive of all taxes • Free insured shipping
              </span>
            </div>

            {/* 4. Gemstone & Metal Highlights Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-white rounded-[10px] p-2.5 border border-[#E7E0DA]/90 flex items-center gap-2">
                <Gem className="w-4 h-4 text-[#A783A2] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] uppercase tracking-wider text-[#8C827A] font-semibold block">Gemstones</span>
                  <span className="text-[11.5px] text-[#292624] font-medium truncate block">{product.gemstones}</span>
                </div>
              </div>

              <div className="bg-white rounded-[10px] p-2.5 border border-[#E7E0DA]/90 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#869E7B] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] uppercase tracking-wider text-[#8C827A] font-semibold block">Craftsmanship</span>
                  <span className="text-[11.5px] text-[#292624] font-medium truncate block">{product.metal}</span>
                </div>
              </div>
            </div>

            {/* 5. Editorial Description */}
            <p className="font-sans text-[13px] sm:text-[13.5px] leading-relaxed text-[#6E6764] mb-5">
              {product.description}
            </p>

            {/* 6. Quantity Selector */}
            <div className="flex items-center space-x-3 mb-5">
              <span className="text-[11px] font-semibold text-[#292624] tracking-wider uppercase">Quantity</span>
              <div className="flex items-center border border-[#E7E0DA] rounded-full bg-white px-2 py-0.5 shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center text-[#77716F] hover:text-[#292624] font-bold text-base active:scale-90"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-semibold text-[#292624]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-[#77716F] hover:text-[#292624] font-bold text-base active:scale-90"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* 7. DESKTOP ACTION BUTTONS */}
            <div className="hidden md:flex items-center space-x-3 mb-6">
              <button
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                className="flex-1 h-12 rounded-full bg-[#A783A2] hover:bg-[#966F91] text-white text-[12px] font-semibold tracking-[0.14em] uppercase transition-all shadow-md hover:shadow-lg hover:shadow-[#A783A2]/20 flex items-center justify-center space-x-2 active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={() => {
                  onBuyNow(product, quantity);
                  onClose();
                }}
                className="flex-1 h-12 rounded-full bg-[#292624] hover:bg-black text-white text-[12px] font-semibold tracking-[0.14em] uppercase transition-all shadow-sm active:scale-98 flex items-center justify-center space-x-1.5"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`w-12 h-12 rounded-full border border-[#E7E0DA] flex items-center justify-center transition-all shrink-0 hover:scale-105 active:scale-95 ${
                  isWishlisted 
                    ? 'bg-[#E2D5E5] text-[#A783A2] border-[#A783A2]' 
                    : 'bg-white text-[#292624] hover:bg-[#FAF8F5]'
                }`}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#A783A2] text-[#A783A2]' : 'text-[#5C5856]'}`} />
              </button>
            </div>

            {/* 8. Trust Badges Banner */}
            <div className="grid grid-cols-3 gap-2 py-3.5 border-t border-b border-[#E7E0DA] text-[10.5px] text-[#77716F] mb-4">
              <div className="flex flex-col items-center text-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#B49A6C]" />
                <span className="font-medium">Certified 18k Vermeil</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-1">
                <Truck className="w-4 h-4 text-[#B49A6C]" />
                <span className="font-medium">Free Insured Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-1">
                <RefreshCw className="w-4 h-4 text-[#B49A6C]" />
                <span className="font-medium">7-Day Easy Returns</span>
              </div>
            </div>

            {/* 9. Specifications & Care Accordions */}
            <div className="divide-y divide-[#E7E0DA] text-xs">
              {/* Specifications */}
              <div>
                <button
                  onClick={() => toggleAccordion('specs')}
                  className="w-full py-2.5 flex items-center justify-between text-left font-semibold text-[#292624] hover:text-[#A783A2] transition-colors"
                >
                  <span className="uppercase tracking-wider text-[11px]">Specifications & Dimensions</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeAccordion === 'specs' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'specs' && (
                  <div className="pb-3 text-[12.5px] text-[#77716F] space-y-1 animate-fadeIn">
                    <p><strong className="text-[#292624]">Metal:</strong> {product.metal}</p>
                    <p><strong className="text-[#292624]">Gemstones:</strong> {product.gemstones}</p>
                    {product.dimensions && <p><strong className="text-[#292624]">Dimensions:</strong> {product.dimensions}</p>}
                    {product.weight && <p><strong className="text-[#292624]">Net Weight:</strong> {product.weight}</p>}
                    <ul className="list-disc list-inside mt-2 space-y-0.5">
                      {product.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Jewellery Care */}
              <div>
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full py-2.5 flex items-center justify-between text-left font-semibold text-[#292624] hover:text-[#A783A2] transition-colors"
                >
                  <span className="uppercase tracking-wider text-[11px]">Jewellery Care Guide</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeAccordion === 'care' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'care' && (
                  <div className="pb-3 text-[12.5px] text-[#77716F] space-y-1 animate-fadeIn">
                    <p>Store individually in the provided Rass anti-tarnish suede pouch.</p>
                    <p>Avoid contact with perfumes, hairsprays, and chlorinated swimming pools.</p>
                    <p>Buff gently with a soft microfibre cloth after each wear to preserve lustre.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

        {/* 3. PINNED MOBILE BOTTOM ACTION BAR (< md) */}
        <div className="md:hidden shrink-0 p-3 bg-white/98 backdrop-blur-md border-t border-[#E7E0DA] flex items-center gap-2 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <button
            onClick={() => {
              onAddToCart(product, quantity);
              onClose();
            }}
            className="flex-[1.2] h-12 rounded-full bg-[#A783A2] hover:bg-[#936E8F] text-white text-[11px] font-semibold tracking-[0.12em] uppercase transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>

          <button
            onClick={() => {
              onBuyNow(product, quantity);
              onClose();
            }}
            className="flex-1 h-12 rounded-full bg-[#292624] hover:bg-black text-white text-[11px] font-semibold tracking-[0.12em] uppercase transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1"
          >
            <span>Buy Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onToggleWishlist(product)}
            className={`w-12 h-12 rounded-full border border-[#E7E0DA] flex items-center justify-center transition-all shrink-0 active:scale-90 ${
              isWishlisted 
                ? 'bg-[#E2D5E5] text-[#A783A2] border-[#A783A2]' 
                : 'bg-white text-[#292624]'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-4.5 h-4.5 ${isWishlisted ? 'fill-[#A783A2]' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
};
