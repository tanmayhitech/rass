import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoryCardProps {
  id: ProductCategory;
  title: string;
  image: string;
  cleanImage?: string;
  heightClass: string;
  onClick: (category: ProductCategory) => void;
  priority?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  title,
  image,
  cleanImage,
  heightClass,
  onClick,
  priority = false,
}) => {
  // Prioritize active live image (including custom replaced photos) with cleanImage fallback
  const displayImage = image || cleanImage;

  return (
    <div
      onClick={() => onClick(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(id);
        }
      }}
      className={`group relative w-full overflow-hidden rounded-[8px] sm:rounded-[10px] cursor-pointer shadow-subtle hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ease-out ${heightClass} focus:outline-none focus:ring-2 focus:ring-[#A783A2] focus:ring-offset-2 hover-sheen`}
      aria-label={`View ${title} collection`}
    >
      {/* Background Photography */}
      <img
        src={displayImage}
        alt={`${title} jewellery collection`}
        className="w-full h-full object-cover object-center transform group-hover:scale-[1.06] transition-transform duration-700 ease-out"
        loading={priority ? 'eager' : 'lazy'}
      />

      {/* Subtle bottom gradient to ensure optimal typography contrast */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Content Bar at Bottom - Mobile Optimized Padding and Proportions */}
      <div className="absolute inset-x-0 bottom-0 p-1.5 sm:p-3 lg:p-4 flex items-center justify-between pointer-events-none">
        {/* Category Label (Cormorant Garamond) */}
        <span className="font-serif font-semibold text-[9.5px] xs:text-[11px] sm:text-[13px] lg:text-[15px] tracking-[0.10em] sm:tracking-[0.18em] text-white uppercase drop-shadow-sm select-none truncate pr-0.5 sm:pr-1">
          {title}
        </span>

        {/* Circular Action Arrow */}
        <div 
          className="w-4 h-4 xs:w-5 xs:h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-white text-[#292624] flex items-center justify-center shadow-md group-hover:bg-[#A783A2] group-hover:text-white group-hover:scale-110 group-hover:translate-x-0.5 active:scale-95 transition-all duration-300 shrink-0"
          aria-hidden="true"
        >
          <ArrowRight className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 stroke-[2.2]" />
        </div>
      </div>
    </div>
  );
};
