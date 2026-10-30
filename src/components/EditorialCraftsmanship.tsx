import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionDivider } from './SectionDivider';
import { homeMediaService, HomeMediaItem } from '../services/homeMediaService';

interface EditorialCraftsmanshipProps {
  onStoryClick: () => void;
}

export const EditorialCraftsmanship: React.FC<EditorialCraftsmanshipProps> = ({ onStoryClick }) => {
  const [craftMedia, setCraftMedia] = useState<HomeMediaItem | undefined>(() =>
    homeMediaService.getById('editorial-craftsmanship')
  );

  useEffect(() => {
    return homeMediaService.subscribe(() => {
      setCraftMedia(homeMediaService.getById('editorial-craftsmanship'));
    });
  }, []);

  // If admin marked it as hidden, do not render
  if (craftMedia && !craftMedia.isVisible) {
    return null;
  }

  const imageSrc = craftMedia?.currentImage || '/images/craftsmanship.png';
  const imageAlt = craftMedia?.altText || 'Artisan jeweler delicately setting emerald gemstone onto gold filigree ring using precision tweezers';
  return (
    <section className="relative w-full overflow-hidden isolate pt-0 pb-12 sm:pb-20 lg:pb-28">
      {/* 1. Ornamental Transition Divider (with generous reference margins above and below mauve) */}
      <div className="pt-14 sm:pt-18 lg:pt-22 pb-12 sm:pb-15 lg:pb-18">
        <SectionDivider />
      </div>

      {/* 2. Pastel Lilac Semi-Circle Panel Flush on Far-Left Wall (matching reference) */}
      <div 
        className="absolute left-0 -ml-px top-[90px] sm:top-[105px] lg:top-[115px] pointer-events-none select-none z-0" 
        aria-hidden="true" 
      >
        <img
          src="/elements/Pastel Lilac Half-Circle Panel.png"
          alt=""
          className="w-14 sm:w-16 md:w-20 lg:w-24 xl:w-28 h-auto object-contain object-left block opacity-95"
        />
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Left Column: Editorial Text (Starts below lilac arch top) */}
          <div className="lg:col-span-5 lg:pr-4 pt-4 sm:pt-8 lg:pt-10">
            {/* Eyebrow with decorative line */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 mb-3.5 sm:mb-5">
              <span className="font-sans font-medium text-[10.5px] sm:text-[12px] tracking-[0.22em] sm:tracking-[0.25em] text-[#77716F] uppercase">
                OUR CRAFTSMANSHIP
              </span>
              <div className="w-10 sm:w-12 h-[1px] bg-[#292624]/20" />
            </div>

            {/* Editorial Heading (Cormorant Garamond) */}
            <h2 className="font-editorial text-[32px] sm:text-[46px] lg:text-[54px] leading-[1.08] sm:leading-[1.06] tracking-[-0.01em] text-[#292624] font-normal mb-3.5 sm:mb-5">
              Rooted in<br />
              tradition, made<br />
              for today.
            </h2>

            {/* Narrative Body Copy */}
            <p className="font-sans text-[14px] sm:text-[15.5px] leading-[1.65] text-[#77716F] max-w-md mb-6 sm:mb-8">
              Each piece is thoughtfully crafted by skilled hands, blending age-old artistry with modern sensibilities.
            </p>

            {/* Pill CTA Button */}
            <button
              onClick={onStoryClick}
              className="inline-flex items-center space-x-2.5 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#A783A2] hover:bg-[#936E8F] text-white text-[11.5px] sm:text-[13px] font-medium tracking-[0.14em] uppercase transition-all duration-300 shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98] group focus:outline-none focus:ring-2 focus:ring-[#A783A2] focus:ring-offset-2 cursor-pointer"
            >
              <span>OUR STORY</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </div>

          {/* Right Column: Artisan Photography with Concentric Curvature & Nested Backdrop */}
          <div className="lg:col-span-7 relative mt-8 lg:mt-0 pt-6 sm:pt-8 lg:pt-10 pl-6 sm:pl-9 lg:pl-11">
            {/* Concentric Lilac Upper Arch Layer Rising High Above Photo */}
            <div 
              className="absolute top-0 left-0 right-0 h-[84%] bg-[#DACEDD] rounded-tl-[120px] sm:rounded-tl-[160px] lg:rounded-tl-[190px] rounded-tr-2xl lg:rounded-tr-3xl -z-10 pointer-events-none transition-transform duration-700" 
              aria-hidden="true" 
            />

            {/* Concentric Sage Green Lower Lobe Layer */}
            <div 
              className="absolute bottom-0 left-0 w-44 sm:w-56 lg:w-68 h-28 sm:h-36 lg:h-44 bg-[#CAD2C5] rounded-tl-[60px] sm:rounded-tl-[80px] rounded-bl-2xl -z-10 pointer-events-none" 
              aria-hidden="true" 
            />

            {/* Artisan Photo Container with Architectural Curved Top-Left Arch */}
            <div className="group relative overflow-hidden rounded-tl-[90px] sm:rounded-tl-[120px] lg:rounded-tl-[145px] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-card hover:shadow-xl transition-all duration-700 bg-[#FAF8F5] hover-sheen">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-[250px] sm:h-[360px] lg:h-[420px] object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-700 ease-out block"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
