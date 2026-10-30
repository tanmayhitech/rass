import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product, ProductCategory } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: ProductCategory) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = query.trim() === ''
    ? []
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryDisplay.toLowerCase().includes(query.toLowerCase()) ||
          p.gemstones.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );

  const quickTags: { label: string; cat: ProductCategory }[] = [
    { label: 'Rings', cat: 'rings' },
    { label: 'Jhumka', cat: 'jhumka' },
    { label: 'Necklaces', cat: 'necklaces' },
    { label: 'Earrings', cat: 'earrings' },
    { label: 'Kangan Sets', cat: 'kangan-sets' },
    { label: 'Bracelets', cat: 'bracelets' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="min-h-full flex items-start justify-center p-4 sm:p-6 lg:p-8 pt-16 sm:pt-24">
        <div className="relative bg-[#FAF8F5] rounded-[14px] max-w-2xl w-full overflow-hidden shadow-modal border border-[#E7E0DA] animate-fadeIn">
          
          {/* Search Input Bar */}
          <div className="p-4 sm:p-6 bg-white border-b border-[#E7E0DA] flex items-center space-x-3">
            <Search className="w-5 h-5 text-[#A783A2]" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search handcrafted rings, jhumkas, emeralds, pearls..."
              className="flex-1 text-sm sm:text-base bg-transparent text-[#292624] placeholder-[#77716F]/70 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-full hover:bg-black/5 text-[#77716F]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-xs uppercase font-semibold tracking-wider text-[#77716F] hover:text-[#292624] px-2 py-1"
            >
              Esc
            </button>
          </div>

          {/* Quick Categories Bar */}
          <div className="p-4 sm:px-6 bg-[#E2D5E5]/20 border-b border-[#E7E0DA] flex flex-wrap gap-2 items-center text-xs">
            <span className="text-[#77716F] font-medium mr-1">Popular:</span>
            {quickTags.map((tag) => (
              <button
                key={tag.label}
                onClick={() => {
                  onSelectCategory(tag.cat);
                  onClose();
                }}
                className="px-3 py-1 rounded-full bg-white border border-[#E7E0DA] hover:border-[#A783A2] text-[#292624] hover:text-[#A783A2] transition-colors"
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
            {query.trim() === '' ? (
              <div className="py-8 text-center text-xs text-[#77716F]">
                Type a piece name, gemstone, or category to discover heirlooms.
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-8 text-center">
                <p className="font-playfair text-lg text-[#292624]">No matching jewellery pieces found</p>
                <p className="text-xs text-[#77716F] mt-1">Try searching for "Jhumka", "Emerald", "Ring", or "Necklace".</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E7E0DA]">
                {filtered.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="py-3 flex items-center justify-between hover:bg-white rounded-lg p-2 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.cleanImage || product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-white border border-[#E7E0DA]"
                      />
                      <div>
                        <h4 className="font-playfair text-[14.5px] font-medium text-[#292624] group-hover:text-[#A783A2] transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-[#77716F]">{product.categoryDisplay} • {product.metal}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-sans text-sm font-semibold text-[#292624]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#A783A2] transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
