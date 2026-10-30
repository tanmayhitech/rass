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

  const col1 = mediaItems.filter((i) => i.section === 'category' && i.column === 1 && i.isVisible);
  const col2 = mediaItems.filter((i) => i.section === 'category' && i.column === 2 && i.isVisible);
  const col3 = mediaItems.filter((i) => i.section === 'category' && i.column === 3 && i.isVisible);

  return (
    <section className="w-full max-w-[1280px] mx-auto px-2.5 sm:px-8 lg:px-12 pt-4 sm:pt-10 lg:pt-14 pb-2 sm:pb-3 lg:pb-4">
      {/* Decorative Eyebrow Header (Strictly matching reference screenshot) */}
      <div className="text-center mb-6 sm:mb-14 lg:mb-16">
        {/* Symmetrical Mauve Lotus Divider (This same mauve under header) */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <SectionDivider />
        </div>

        {/* Handcrafted Jewellery - Cormorant Garamond */}
        <h2 className="font-serif font-medium text-[11px] sm:text-[13px] lg:text-[14.5px] tracking-[0.24em] sm:tracking-[0.32em] text-[#5C5856] uppercase pl-[0.24em] sm:pl-[0.32em]">
          Handcrafted Jewellery
        </h2>

        {/* Sparkle Motif - Exactly Matching Navbar Sparkle Icon */}
        <div className="flex justify-center mt-3 sm:mt-5">
          <span 
            className="text-[#A783A2] text-[10px] sm:text-[12px] lg:text-[13px] leading-none select-none inline-block animate-pulse" 
            aria-hidden="true" 
          >
            ✦
          </span>
        </div>
      </div>

      {/* Perfectly Asymmetric 3-Column Staggered Masonry Gallery */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-4 lg:gap-5 items-start">
        
        {/* COLUMN 1 (Left): Starts Lowest with Generous Stagger Offset */}
        <div className="flex flex-col space-y-1.5 sm:space-y-4 lg:space-y-5 mt-4 sm:mt-14 lg:mt-20 w-full">
          {col1.map((item) => (
            <CategoryCard
              key={item.id}
              id={(item.categoryKey || 'rings') as ProductCategory}
              title={item.title}
              image={item.currentImage}
              cleanImage={item.isCustom ? undefined : item.cleanImage}
              heightClass={item.heightClass}
              onClick={onSelectCategory}
              priority={item.order === 1}
            />
          ))}
        </div>

        {/* COLUMN 2 (Center): Starts at Intermediate Offset */}
        <div className="flex flex-col space-y-1.5 sm:space-y-4 lg:space-y-5 mt-2 sm:mt-7 lg:mt-10 w-full">
          {col2.map((item) => (
            <CategoryCard
              key={item.id}
              id={(item.categoryKey || 'jhumka') as ProductCategory}
              title={item.title}
              image={item.currentImage}
              cleanImage={item.isCustom ? undefined : item.cleanImage}
              heightClass={item.heightClass}
              onClick={onSelectCategory}
              priority={item.order === 1}
            />
          ))}
        </div>

        {/* COLUMN 3 (Right): Starts Highest, Right at the Top */}
        <div className="flex flex-col space-y-1.5 sm:space-y-4 lg:space-y-5 mt-0 w-full">
          {col3.map((item) => (
            <CategoryCard
              key={item.id}
              id={(item.categoryKey || 'necklaces') as ProductCategory}
              title={item.title}
              image={item.currentImage}
              cleanImage={item.isCustom ? undefined : item.cleanImage}
              heightClass={item.heightClass}
              onClick={onSelectCategory}
              priority={item.order === 1}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
