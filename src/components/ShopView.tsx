import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  SlidersHorizontal, 
  X, 
  Sparkles, 
  Check, 
  RotateCcw,
  Gem,
  ShieldCheck,
  ChevronDown,
  LayoutGrid,
  Rows
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { SectionDivider } from './SectionDivider';
import { ProductCard } from './ProductCard';

interface ShopViewProps {
  products: Product[];
  selectedCategory: ProductCategory | 'all';
  onCategoryChange: (category: ProductCategory | 'all') => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
  onBackToHome: () => void;
}

type PriceTier = 'all' | 'under-18k' | '18k-25k' | 'above-25k';
type GemstoneFilter = 'all' | 'emerald' | 'pearl' | 'amethyst' | 'jade' | 'tourmaline';
type SortOption = 'featured' | 'price-low' | 'price-high' | 'name-asc';

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  selectedCategory,
  onCategoryChange,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onBackToHome,
}) => {
  // Filter States
  const [priceTier, setPriceTier] = useState<PriceTier>('all');
  const [selectedGemstone, setSelectedGemstone] = useState<GemstoneFilter>('all');
  const [bestsellersOnly, setBestsellersOnly] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  
  // Mobile Grid View: 2 columns (compact catalogue) vs 1 column (large view)
  const [mobileColumns, setMobileColumns] = useState<1 | 2>(2);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

  // Categories metadata
  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Heirlooms' },
    { id: 'rings', label: 'Rings' },
    { id: 'earrings', label: 'Earrings' },
    { id: 'jhumka', label: 'Jhumka' },
    { id: 'necklaces', label: 'Necklaces' },
    { id: 'kangan-sets', label: 'Kangan Sets' },
    { id: 'kangna', label: 'Kangna' },
    { id: 'bracelets', label: 'Bracelets' },
  ];

  // Price Tiers metadata
  const priceTiers: { id: PriceTier; label: string }[] = [
    { id: 'all', label: 'All Prices' },
    { id: 'under-18k', label: 'Under ₹18,000' },
    { id: '18k-25k', label: '₹18,000 – ₹25,000' },
    { id: 'above-25k', label: 'Above ₹25,000' },
  ];

  // Gemstones metadata
  const gemstoneOptions: { id: GemstoneFilter; label: string }[] = [
    { id: 'all', label: 'All Gemstones' },
    { id: 'emerald', label: 'Zambian Emerald' },
    { id: 'pearl', label: 'Basra & Seed Pearls' },
    { id: 'amethyst', label: 'Lavender Amethyst' },
    { id: 'jade', label: 'Pastel Jade & Mint Quartz' },
    { id: 'tourmaline', label: 'Green Tourmaline' },
  ];

  // Calculate live counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    categories.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = products.filter((p) => p.category === cat.id).length;
      }
    });
    return counts;
  }, [products]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (priceTier !== 'all') count++;
    if (selectedGemstone !== 'all') count++;
    if (bestsellersOnly) count++;
    if (inStockOnly) count++;
    return count;
  }, [selectedCategory, priceTier, selectedGemstone, bestsellersOnly, inStockOnly]);

  // Reset all filters
  const handleResetFilters = () => {
    onCategoryChange('all');
    setPriceTier('all');
    setSelectedGemstone('all');
    setBestsellersOnly(false);
    setInStockOnly(false);
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      if (priceTier === 'under-18k' && product.price >= 18000) return false;
      if (priceTier === '18k-25k' && (product.price < 18000 || product.price > 25000)) return false;
      if (priceTier === 'above-25k' && product.price <= 25000) return false;

      if (selectedGemstone !== 'all') {
        const gem = product.gemstones.toLowerCase();
        if (selectedGemstone === 'emerald' && !gem.includes('emerald')) return false;
        if (selectedGemstone === 'pearl' && !gem.includes('pearl')) return false;
        if (selectedGemstone === 'amethyst' && !gem.includes('amethyst')) return false;
        if (selectedGemstone === 'jade' && !(gem.includes('jade') || gem.includes('quartz'))) return false;
        if (selectedGemstone === 'tourmaline' && !gem.includes('tourmaline')) return false;
      }

      if (bestsellersOnly && !product.isBestseller) return false;
      if (inStockOnly && !product.inStock) return false;

      return true;
    });
  }, [products, selectedCategory, priceTier, selectedGemstone, bestsellersOnly, inStockOnly]);

  // Sorted products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return b.price - a.price;
    });
  }, [filteredProducts, sortBy]);

  // Reusable Filter Content
  const FilterSectionContent = () => (
    <div className="space-y-6">
      
      {/* SECTION 1: CATEGORIES */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10.5px] font-semibold tracking-[0.22em] text-[#5C5856] uppercase">
            Categories
          </span>
          <span className="text-[10px] text-[#8C827A] tracking-wider uppercase font-medium">
            {products.length} Designs
          </span>
        </div>

        <div className="space-y-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-[13px] transition-all text-left ${
                  isActive
                    ? 'bg-[#F3EEF3] text-[#7A4B75] font-semibold'
                    : 'text-[#4A4543] hover:text-[#A783A2] hover:bg-[#FAF8F5]'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isActive && <span className="text-[#A783A2] text-xs">✦</span>}
                  <span>{cat.label}</span>
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-white text-[#7A4B75] font-bold shadow-xs' 
                      : 'bg-[#F2ECE6] text-[#8C827A]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-[#E7E0DA]" />

      {/* SECTION 2: PRICE TIERS */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10.5px] font-semibold tracking-[0.22em] text-[#5C5856] uppercase">
            Price Range
          </span>
          {priceTier !== 'all' && (
            <button
              onClick={() => setPriceTier('all')}
              className="text-[10px] text-[#A783A2] hover:underline tracking-wider uppercase font-medium"
            >
              Reset
            </button>
          )}
        </div>

        <div className="space-y-1">
          {priceTiers.map((tier) => {
            const isActive = priceTier === tier.id;
            return (
              <label
                key={tier.id}
                onClick={() => setPriceTier(tier.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-[8px] cursor-pointer text-[12.5px] transition-all ${
                  isActive
                    ? 'bg-[#F3EEF3] text-[#7A4B75] font-medium'
                    : 'text-[#4A4543] hover:bg-[#FAF8F5] hover:text-[#A783A2]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                    isActive ? 'border-[#A783A2] bg-[#A783A2]' : 'border-[#C8BFB8] bg-white'
                  }`}>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span>{tier.label}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <hr className="border-[#E7E0DA]" />

      {/* SECTION 3: SIGNATURE GEMSTONES */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10.5px] font-semibold tracking-[0.22em] text-[#5C5856] uppercase">
            Gemstones & Pearls
          </span>
          {selectedGemstone !== 'all' && (
            <button
              onClick={() => setSelectedGemstone('all')}
              className="text-[10px] text-[#A783A2] hover:underline tracking-wider uppercase font-medium"
            >
              Reset
            </button>
          )}
        </div>

        <div className="space-y-1">
          {gemstoneOptions.map((gem) => {
            const isActive = selectedGemstone === gem.id;
            return (
              <button
                key={gem.id}
                onClick={() => setSelectedGemstone(gem.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-[12.5px] text-left transition-all ${
                  isActive
                    ? 'bg-[#F3EEF3] text-[#7A4B75] font-medium'
                    : 'text-[#4A4543] hover:bg-[#FAF8F5] hover:text-[#A783A2]'
                }`}
              >
                <span>{gem.label}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-[#A783A2]" />}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-[#E7E0DA]" />

      {/* SECTION 4: CURATED HIGHLIGHTS */}
      <div>
        <span className="text-[10.5px] font-semibold tracking-[0.22em] text-[#5C5856] uppercase block mb-2.5">
          Curated Highlights
        </span>

        <div className="space-y-2">
          {/* Bestsellers Toggle */}
          <button
            onClick={() => setBestsellersOnly(!bestsellersOnly)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-[12.5px] border transition-all ${
              bestsellersOnly
                ? 'bg-[#FAF6FA] border-[#A783A2]/40 text-[#7A4B75] font-medium'
                : 'bg-white border-[#E7E0DA] text-[#4A4543] hover:border-[#A783A2]/40'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#A783A2]" />
              <span>Bestsellers Only</span>
            </span>
            <div className={`w-7 h-4 rounded-full transition-colors flex items-center p-0.5 ${
              bestsellersOnly ? 'bg-[#A783A2]' : 'bg-[#D6CDC5]'
            }`}>
              <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                bestsellersOnly ? 'translate-x-3' : 'translate-x-0'
              }`} />
            </div>
          </button>

          {/* In Stock Toggle */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-[12.5px] border transition-all ${
              inStockOnly
                ? 'bg-[#FAF6FA] border-[#A783A2]/40 text-[#7A4B75] font-medium'
                : 'bg-white border-[#E7E0DA] text-[#4A4543] hover:border-[#A783A2]/40'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#869E7B]" />
              <span>Ready to Ship</span>
            </span>
            <div className={`w-7 h-4 rounded-full transition-colors flex items-center p-0.5 ${
              inStockOnly ? 'bg-[#A783A2]' : 'bg-[#D6CDC5]'
            }`}>
              <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                inStockOnly ? 'translate-x-3' : 'translate-x-0'
              }`} />
            </div>
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <div className="w-full max-w-[1360px] mx-auto px-3.5 sm:px-6 lg:px-10 pt-3 sm:pt-8 pb-10 sm:pb-16 animate-fadeIn">
      
      {/* 1. COMPACT EDITORIAL HEADER */}
      <div className="text-center max-w-xl mx-auto mb-3 sm:mb-8">
        {/* Subtle Breadcrumb */}
        <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-[#8C827A] uppercase tracking-[0.16em] mb-1 sm:mb-1.5 font-medium">
          <button 
            onClick={onBackToHome}
            className="hover:text-[#A783A2] transition-colors flex items-center gap-1 group"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
            <span>Home</span>
          </button>
          <span className="text-[#A783A2] text-[10px]">✦</span>
          <span className="text-[#292624] font-semibold">
            {selectedCategory === 'all' ? 'Catalogue' : categories.find(c => c.id === selectedCategory)?.label}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-playfair text-[30px] sm:text-[44px] lg:text-[48px] font-medium text-[#292624] tracking-[-0.015em] leading-[1.12] mb-1.5 sm:mb-2">
          {selectedCategory === 'all' 
            ? 'All Heirlooms' 
            : categories.find(c => c.id === selectedCategory)?.label}
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-[12.5px] sm:text-[14px] text-[#77716F] max-w-lg mx-auto leading-relaxed px-2 font-normal">
          Sculpted by master goldsmiths in 18k gold vermeil, natural untreated gemstones, and Basra seed pearls.
        </p>

        {/* Lotus Divider */}
        <div className="mt-2.5 sm:mt-3 flex justify-center">
          <SectionDivider />
        </div>
      </div>

      {/* 2. MOBILE HORIZONTAL CATEGORY CHIPS (NO-SCROLLBAR FIX) */}
      <div className="lg:hidden mb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-3.5 px-3.5 sm:-mx-6 sm:px-6 select-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] tracking-wide transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#A783A2] text-white shadow-xs font-semibold'
                    : 'bg-white text-[#5C5856] border border-[#E7E0DA] hover:border-[#A783A2]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white font-bold' : 'bg-[#F2ECE6] text-[#8C827A]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MOBILE STICKY TOOLBAR (< lg) */}
      <div className="lg:hidden sticky top-16 z-20 bg-[#FAF8F5]/96 backdrop-blur-md py-2 px-3.5 border-y border-[#E7E0DA]/80 mb-3.5 flex items-center justify-between gap-2 -mx-3.5 sm:-mx-6 sm:px-6">
        {/* Filter Trigger */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E7E0DA] hover:border-[#A783A2] text-[#292624] text-xs font-semibold shadow-xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#A783A2]" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#A783A2] text-white text-[9.5px] flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* View Switcher (1-Col vs 2-Col) + Sort */}
        <div className="flex items-center gap-2">
          {/* Grid Toggle */}
          <div className="flex items-center bg-white border border-[#E7E0DA] rounded-full p-0.5 shadow-xs">
            <button
              onClick={() => setMobileColumns(1)}
              className={`p-1.5 rounded-full transition-colors ${
                mobileColumns === 1
                  ? 'bg-[#A783A2] text-white shadow-xs'
                  : 'text-[#77716F] hover:text-[#292624]'
              }`}
              title="1 Column View"
              aria-label="1 Column View"
            >
              <Rows className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMobileColumns(2)}
              className={`p-1.5 rounded-full transition-colors ${
                mobileColumns === 2
                  ? 'bg-[#A783A2] text-white shadow-xs'
                  : 'text-[#77716F] hover:text-[#292624]'
              }`}
              title="2 Column Grid"
              aria-label="2 Column Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-white border border-[#E7E0DA] rounded-full pl-2.5 pr-6 py-1.5 text-xs text-[#292624] font-medium focus:outline-none focus:border-[#A783A2] shadow-xs cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low</option>
              <option value="price-high">Price: High</option>
              <option value="name-asc">A–Z</option>
            </select>
            <ChevronDown className="w-3 h-3 text-[#77716F] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4. MAIN LAYOUT: SIDEBAR + PRODUCT GRID */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
        
        {/* DESKTOP SIDEBAR (lg+) */}
        <aside className="hidden lg:block w-[250px] shrink-0 sticky top-28 bg-white/70 backdrop-blur-sm rounded-[16px] border border-[#E7E0DA] p-5 shadow-xs">
          
          {/* Sidebar Header */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E7E0DA]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#A783A2]" />
              <h2 className="font-serif text-[17px] text-[#292624] font-medium tracking-tight">
                Filter & Refine
              </h2>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-[11px] text-[#A783A2] hover:text-[#8E6989] font-medium hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* Filter Sections */}
          <FilterSectionContent />

        </aside>

        {/* MAIN PRODUCT AREA */}
        <div className="flex-1 w-full">
          
          {/* DESKTOP TOOLBAR */}
          <div className="hidden lg:flex items-center justify-between gap-3 mb-5 pb-3 border-b border-[#E7E0DA]">
            <span className="text-xs text-[#77716F]">
              Showing <strong className="text-[#292624]">{sortedProducts.length}</strong> of {products.length} Heirloom Designs
            </span>

            <div className="flex items-center space-x-2 text-xs text-[#77716F]">
              <span>Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-white border border-[#E7E0DA] rounded-full pl-3 pr-8 py-1.5 text-xs text-[#292624] font-medium focus:outline-none focus:border-[#A783A2] shadow-xs cursor-pointer"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Alphabetical (A–Z)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#77716F] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ACTIVE FILTER CHIPS */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4">
              <span className="text-[10px] sm:text-[11px] text-[#8C827A] uppercase tracking-wider font-semibold mr-1">
                Active:
              </span>

              {selectedCategory !== 'all' && (
                <button
                  onClick={() => onCategoryChange('all')}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#F4EFF3] text-[#7A4B75] border border-[#E5D7E4] text-[10.5px] sm:text-[11px] font-medium hover:bg-[#EAE0E9] transition-colors"
                >
                  <span>{categories.find(c => c.id === selectedCategory)?.label}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {priceTier !== 'all' && (
                <button
                  onClick={() => setPriceTier('all')}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#F4EFF3] text-[#7A4B75] border border-[#E5D7E4] text-[10.5px] sm:text-[11px] font-medium hover:bg-[#EAE0E9] transition-colors"
                >
                  <span>{priceTiers.find(p => p.id === priceTier)?.label}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {selectedGemstone !== 'all' && (
                <button
                  onClick={() => setSelectedGemstone('all')}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#F4EFF3] text-[#7A4B75] border border-[#E5D7E4] text-[10.5px] sm:text-[11px] font-medium hover:bg-[#EAE0E9] transition-colors"
                >
                  <span>{gemstoneOptions.find(g => g.id === selectedGemstone)?.label}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {bestsellersOnly && (
                <button
                  onClick={() => setBestsellersOnly(false)}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#F4EFF3] text-[#7A4B75] border border-[#E5D7E4] text-[10.5px] sm:text-[11px] font-medium hover:bg-[#EAE0E9] transition-colors"
                >
                  <span>Bestsellers</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {inStockOnly && (
                <button
                  onClick={() => setInStockOnly(false)}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#F4EFF3] text-[#7A4B75] border border-[#E5D7E4] text-[10.5px] sm:text-[11px] font-medium hover:bg-[#EAE0E9] transition-colors"
                >
                  <span>Ready to Ship</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              <button
                onClick={handleResetFilters}
                className="text-[10.5px] sm:text-[11px] text-[#A783A2] hover:underline font-semibold ml-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* RESPONSIVE PRODUCTS GRID */}
          {sortedProducts.length > 0 ? (
            <div className={`grid ${
              mobileColumns === 1
                ? 'grid-cols-1 gap-4 sm:grid-cols-2'
                : 'grid-cols-2 gap-2 sm:gap-4'
            } lg:grid-cols-3 lg:gap-6 xl:gap-7`}>
              {sortedProducts.map((product) => {
                const isWishlisted = wishlistIds.includes(product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={isWishlisted}
                    onToggleWishlist={onToggleWishlist}
                    onSelectProduct={onSelectProduct}
                    onAddToCart={onAddToCart}
                    isSingleColumnMobile={mobileColumns === 1}
                  />
                );
              })}
            </div>
          ) : (
            /* EMPTY RESULTS */
            <div className="bg-white rounded-[16px] border border-[#E7E0DA] p-8 sm:p-14 text-center max-w-md mx-auto my-6 sm:my-8">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E7E0DA] flex items-center justify-center mx-auto mb-3 text-[#A783A2]">
                <Gem className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-[20px] text-[#292624] font-medium mb-1.5">
                No designs match your criteria
              </h3>
              <p className="text-xs text-[#77716F] mb-5 leading-relaxed">
                Try widening your price range or clearing selected gemstones to view more handcrafted heirloom pieces.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A783A2] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#966F91] transition-all shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* 5. MOBILE SLIDE-OVER FILTER DRAWER */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            aria-hidden="true"
          />

          <div className="relative w-full max-w-[320px] sm:max-w-xs bg-white h-full ml-auto shadow-2xl flex flex-col justify-between z-10 animate-slideLeft">
            <div className="p-4 sm:p-5 border-b border-[#E7E0DA] flex items-center justify-between bg-[#FAF8F5]/90">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#A783A2]" />
                <h3 className="font-serif text-[17px] text-[#292624] font-medium">
                  Filter & Refine
                </h3>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white text-[#5C5856] flex items-center justify-center transition-colors"
                aria-label="Close filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto flex-1 overscroll-contain">
              <FilterSectionContent />
            </div>

            <div className="p-4 border-t border-[#E7E0DA] bg-[#FAF8F5] flex items-center gap-2.5">
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-2.5 rounded-full border border-[#E7E0DA] bg-white text-[#5C5856] hover:text-[#292624] text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                >
                  Reset
                </button>
              )}
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-[2] py-2.5 rounded-full bg-[#A783A2] hover:bg-[#966F91] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95"
              >
                View {sortedProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
