import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemove: (productId: string) => void;
  onMoveToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemove,
  onMoveToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl border-l border-[#E7E0DA] flex flex-col justify-between animate-slideLeft">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E7E0DA] flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-[#A783A2] fill-[#A783A2]" />
              <h2 className="font-playfair text-[22px] text-[#292624] font-medium">Saved Heirlooms</h2>
              <span className="text-xs text-[#77716F]">({items.length})</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/5 text-[#292624] transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#E7E0DA]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <Heart className="w-12 h-12 text-[#77716F]/30 stroke-[1] mb-3" />
                <h3 className="font-playfair text-xl text-[#292624] mb-1">Your wishlist is empty</h3>
                <p className="text-xs text-[#77716F] max-w-xs mb-6">
                  Save pieces you love to revisit or add to your shopping bag later.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#A783A2] text-white text-xs font-medium tracking-wider uppercase hover:bg-[#936E8F] transition-all"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((product) => (
                <div key={product.id} className="py-4 flex space-x-4 first:pt-0 last:pb-0">
                  <img
                    src={product.cleanImage || product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-[8px] object-cover bg-white border border-[#E7E0DA]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-playfair text-[15.5px] text-[#292624] font-medium leading-snug">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemove(product.id)}
                          className="text-[#77716F] hover:text-red-700 transition-colors p-1"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#77716F] mt-0.5">{product.categoryDisplay}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-sans font-semibold text-[#292624]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => {
                          onMoveToCart(product);
                          onRemove(product.id);
                        }}
                        className="px-3 py-1 rounded-full bg-[#A783A2] hover:bg-[#936E8F] text-white text-[11px] font-medium tracking-wider uppercase flex items-center space-x-1 shadow-xs"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E7E0DA]">
              <p className="text-xs text-[#77716F] text-center mb-3">
                Pieces in your wishlist remain saved on this device.
              </p>
              <button
                onClick={onClose}
                className="w-full h-11 rounded-full border border-[#E7E0DA] hover:bg-black/5 text-[#292624] text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Continue Browsing
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
