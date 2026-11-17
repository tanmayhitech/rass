import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface FeaturedCreationsCarouselProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onExploreAll: () => void;
}

export const FeaturedCreationsCarousel: React.FC<FeaturedCreationsCarouselProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
  onExploreAll,
}) => {
  // Filter for tribal creations in their curated order
  const tribalProducts = products.filter((p) => p.category === 'tribal');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (tribalProducts.length === 0) return null;

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth >= 1024 
        ? scrollRef.current.clientWidth / 3 
        : scrollRef.current.clientWidth >= 640 
        ? scrollRef.current.clientWidth / 2 
        : scrollRef.current.clientWidth * 0.85;

      const offset = direction === 'left' ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 pb-4 border-b border-[#292725]/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A18AA5] mb-2 select-none">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Creations · New Tribal Edit</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#292725] tracking-tight">
            Heirloom Tribal Masterpieces
          </h2>
          <p className="text-[13px] sm:text-[14.5px] text-[#77736F] mt-1.5 max-w-xl font-normal leading-relaxed">
            Handcrafted hasalis, coin drop chokers, and silver malas curated from heritage artisan clusters.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-end">
          {/* Explore All Link */}
          <button
            onClick={onExploreAll}
            className="group inline-flex items-center gap-1.5 text-[13px] font-medium tracking-[0.04em] text-[#292725] hover:text-[#A18AA5] transition-colors py-2 px-1 cursor-pointer select-none"
          >
            <span>View All ({tribalProducts.length} Designs)</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#A18AA5]" />
          </button>

          {/* Desktop Slider Controls */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-9 h-9 rounded-full border border-[#292725]/20 flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'hover:bg-[#292725] hover:text-white text-[#292725] cursor-pointer'
                  : 'opacity-30 cursor-not-allowed text-[#77736F]'
              }`}
              aria-label="Previous creations"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-9 h-9 rounded-full border border-[#292725]/20 flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'hover:bg-[#292725] hover:text-white text-[#292725] cursor-pointer'
                  : 'opacity-30 cursor-not-allowed text-[#77736F]'
              }`}
              aria-label="Next creations"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative group/carousel">
        {/* Floating Left Carousel Arrow for Exact User Mockup Visual Match */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/75 hover:bg-black text-white shadow-lg backdrop-blur-md flex items-center justify-center transition-all active:scale-95 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Floating Right Carousel Arrow for Exact User Mockup Visual Match */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/75 hover:bg-black text-white shadow-lg backdrop-blur-md flex items-center justify-center transition-all active:scale-95 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Horizontal Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-1"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {tribalProducts.map((product, idx) => (
            <div
              key={product.id}
              className="w-[82vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ProductCard
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
                priority={idx < 3}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
