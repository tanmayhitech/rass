import React, { useState, useEffect } from 'react';
import { CategoryCard } from './CategoryCard';
import { SectionDivider } from './SectionDivider';
import { ProductCategory } from '../types';
import { homeMediaService, HomeMediaItem } from '../services/homeMediaService';

interface CategoryGalleryProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const CategoryGallery: React.FC<CategoryGalleryProps> = ({ onSelectCategory }) => {
  const [mediaItems, setMediaItems] = useState<HomeMediaItem[]>(() => homeMediaService.getAll());

  useEffect(() => {
    return homeMediaService.subscribe((items) => {
      setMediaItems(items);
    });
  }, []);

  const col1 = mediaItems.filter((i) => i.section === 'category' && i.column === 1 && i.isVisible).sort((a, b) => a.order - b.order);
  const col2 = mediaItems.filter((i) => i.section === 'category' && i.column === 2 && i.isVisible).sort((a, b) => a.order - b.order);
  const col3 = mediaItems.filter((i) => i.section === 'category' && i.column === 3 && i.isVisible).sort((a, b) => a.order - b.order);

  return (
    <section className="w-full max-w-[1280px] mx-auto px-2 xs:px-3 sm:px-8 lg:px-12 pt-4 sm:pt-10 lg:pt-14 pb-2 sm:pb-3 lg:pb-4">
      {/* Decorative Eyebrow Header - Riddhima's Curated Collections */}
      <div className="text-center mb-7 sm:mb-14 lg:mb-16 max-w-2xl mx-auto px-2">
        {/* Symmetrical Mauve Lotus Divider */}
        <div className="flex justify-center mb-3 sm:mb-5">
          <SectionDivider />
        </div>

        {/* Eyebrow */}
        <div className="flex items-center justify-center space-x-2.5 mb-2 sm:mb-2.5">
          <span className="font-sans font-semibold text-[9.5px] xs:text-[10px] sm:text-[11.5px] tracking-[0.22em] sm:tracking-[0.26em] text-[#A783A2] uppercase">
            RASS BY RIDHIMA • CURATED COLLECTIONS
          </span>
        </div>

        {/* Recreated Main Heading */}
        <h2 className="font-editorial text-[24px] xs:text-[28px] sm:text-[38px] lg:text-[44px] leading-[1.1] text-[#292624] font-normal tracking-[-0.01em] mb-2 sm:mb-2.5">
          Handcrafted with Love
        </h2>

        {/* Subtitle */}
        <p className="font-sans text-[11.5px] xs:text-[12.5px] sm:text-[14.5px] text-[#77716F] max-w-md sm:max-w-lg mx-auto leading-relaxed">
          Where Indian traditions meet contemporary expression &amp; everyday wearability.
        </p>

        {/* Sparkle Motif */}
        <div className="flex justify-center mt-2.5 sm:mt-4">
          <span 
            className="text-[#A783A2] text-[10.5px] sm:text-[12px] lg:text-[13px] leading-none select-none inline-block animate-pulse" 
            aria-hidden="true" 
          >
            ✦
          </span>
        </div>
      </div>

      {/* Perfectly Balanced 3-Column Staggered Masonry Gallery */}
      <div className="grid grid-cols-3 gap-1.5 xs:gap-2 sm:gap-4 lg:gap-5 items-start">
        
        {/* COLUMN 1 (Left): Flanking Wing - Symmetrical Height to Column 3 */}
        <div className="flex flex-col space-y-1.5 xs:space-y-2 sm:space-y-4 lg:space-y-5 mt-2 xs:mt-2.5 sm:mt-5 lg:mt-6 w-full">
          {col1.map((item) => (
            <CategoryCard
              key={item.id}
              itemId={item.id}
              id={(item.categoryKey || 'jhumka') as ProductCategory}
              title={item.title}
              image={item.currentImage}
              cleanImage={item.isCustom ? undefined : item.cleanImage}
              heightClass={item.heightClass}
              onClick={onSelectCategory}
              priority={item.order === 1}
              isCustom={item.isCustom}
            />
          ))}
        </div>

        {/* COLUMN 2 (Center): Pinnacle Arch (Pops upward - ucha dikhne ke liye elevated above side wings) */}
        <div className="flex flex-col space-y-1.5 xs:space-y-2 sm:space-y-4 lg:space-y-5 -mt-2.5 xs:-mt-3.5 sm:-mt-7 lg:-mt-9 w-full">
          {col2.map((item) => (
            <CategoryCard
              key={item.id}
              itemId={item.id}
              id={(item.categoryKey || 'necklaces') as ProductCategory}
              title={item.title}
              image={item.currentImage}
              cleanImage={item.isCustom ? undefined : item.cleanImage}
              heightClass={item.heightClass}
              onClick={onSelectCategory}
              priority={item.order === 1}
              isCustom={item.isCustom}
            />
          ))}
        </div>

        {/* COLUMN 3 (Right): Flanking Wing - Equal Height & Top to Column 1 */}
        <div className="flex flex-col space-y-1.5 xs:space-y-2 sm:space-y-4 lg:space-y-5 mt-2 xs:mt-2.5 sm:mt-5 lg:mt-6 w-full">
          {col3.map((item) => (
            <CategoryCard
              key={item.id}
              itemId={item.id}
              id={(item.categoryKey || 'rings') as ProductCategory}
              title={item.title}
              image={item.currentImage}
              cleanImage={item.isCustom ? undefined : item.cleanImage}
              heightClass={item.heightClass}
              onClick={onSelectCategory}
              priority={item.order === 1}
              isCustom={item.isCustom}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
