import React, { useState } from 'react';
import { Heart, Eye, Sparkles, Check, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  isSingleColumnMobile?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
  isSingleColumnMobile = false,
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div className={`group relative bg-white rounded-[12px] sm:rounded-[14px] border border-[#E7E0DA]/70 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden flex flex-col justify-between w-full`}>
      
      {/* 1. PHOTOGRAPHY AREA (PORTRAIT ASPECT RATIO 4/5) */}
      <div 
        onClick={() => onSelectProduct(product)}
        className="relative aspect-[4/5] overflow-hidden bg-[#F4F1EC] cursor-pointer select-none hover-sheen"
      >
        <img
          src={product.cleanImage || product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Soft vignette overlay on hover */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
          aria-hidden="true" 
        />

        {/* SINGLE CLEAN LUXURY BADGE */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 pointer-events-none">
          {product.isBestseller ? (
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-[#24211E] text-[8px] sm:text-[9.5px] uppercase tracking-[0.14em] sm:tracking-[0.16em] font-medium px-2 sm:px-2.5 py-0.5 rounded-full shadow-2xs">
              <Sparkles className="w-2.5 h-2.5 text-[#A783A2]" />
              <span>Bestseller</span>
            </span>
          ) : product.isNew ? (
            <span className="inline-flex items-center bg-[#24211E] text-white text-[8px] sm:text-[9.5px] uppercase tracking-[0.14em] sm:tracking-[0.16em] font-medium px-2 sm:px-2.5 py-0.5 rounded-full shadow-2xs">
              New Arrival
            </span>
          ) : discountPercent > 0 ? (
            <span className="inline-flex items-center bg-white/95 backdrop-blur-md text-[#24211E] text-[8px] sm:text-[9.5px] font-semibold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full shadow-2xs">
              {discountPercent}% OFF
            </span>
          ) : null}
        </div>

        {/* Floating Wishlist Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center transition-all duration-200 z-10 shadow-2xs active:scale-90 cursor-pointer ${
            isWishlisted
              ? 'bg-white text-[#A783A2]'
              : 'bg-white/85 hover:bg-white text-[#292624] backdrop-blur-xs'
          }`}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${isWishlisted ? 'fill-[#A783A2] text-[#A783A2] animate-heart-snap' : 'text-[#292624]'}`} />
        </button>

        {/* Desktop Quick View Overlay on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectProduct(product);
          }}
          className="hidden md:flex absolute inset-x-4 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 py-2.5 bg-white/95 hover:bg-white text-[#292624] text-[10.5px] font-semibold tracking-[0.2em] uppercase rounded-full shadow-md backdrop-blur-md items-center justify-center gap-1.5 border border-[#E7E0DA] z-10 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-[#A783A2]" />
          <span>Quick View</span>
        </button>
      </div>

      {/* 2. CARD CONTENT & TYPOGRAPHY (WITH CLEAN BG UNDER TEXT) */}
      <div className="bg-white p-2.5 sm:p-4 flex flex-col justify-between flex-1">
        <div>
          {/* Product Title (Clean modern sans-serif with uniform height) */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-sans text-[12.5px] sm:text-[14px] font-medium text-[#24211E] tracking-tight leading-snug cursor-pointer hover:text-[#A783A2] transition-colors line-clamp-2 min-h-[34px] sm:min-h-[40px]"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Metal Subtitle */}
          <p className="text-[10px] sm:text-[11.5px] font-sans text-[#8C827A] mt-0.5 truncate font-normal">
            {product.metal || '18K Gold Vermeil'}
          </p>
        </div>

        {/* 3. PRICE & SLEEK + ADD CTA */}
        <div className="pt-2 sm:pt-3 flex items-center justify-between gap-1 sm:gap-2">
          {/* Price Container */}
          <div className="flex items-baseline gap-1 sm:gap-1.5 min-w-0 flex-wrap">
            <span className="font-sans text-[13px] sm:text-[15.5px] font-semibold text-[#24211E] tracking-tight whitespace-nowrap">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="font-sans text-[10px] sm:text-[11.5px] text-[#9E9793] line-through whitespace-nowrap">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Sleek + Add CTA */}
          <button
            onClick={handleAddToCart}
            className={`h-7 sm:h-7.5 rounded-full text-[10.5px] font-sans font-medium tracking-[0.06em] uppercase transition-all duration-200 active:scale-90 flex items-center justify-center shrink-0 cursor-pointer ${
              isSingleColumnMobile 
                ? 'px-3 gap-1' 
                : 'w-7 sm:w-auto px-0 sm:px-3 sm:gap-1'
            } ${
              isAdded 
                ? 'bg-[#A783A2] text-white' 
                : 'bg-[#24211E] hover:bg-[#A783A2] text-white shadow-2xs hover:shadow-xs'
            }`}
            aria-label={`Add ${product.name} to bag`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className={isSingleColumnMobile ? 'inline' : 'hidden sm:inline'}>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                <span className={isSingleColumnMobile ? 'inline' : 'hidden sm:inline'}>Add</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
