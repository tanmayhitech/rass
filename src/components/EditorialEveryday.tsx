import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { homeMediaService, HomeMediaItem } from '../services/homeMediaService';

interface EditorialEverydayProps {
  onExploreClick: () => void;
}

export const EditorialEveryday: React.FC<EditorialEverydayProps> = ({ onExploreClick }) => {
  const [everydayMedia, setEverydayMedia] = useState<HomeMediaItem | undefined>(() =>
    homeMediaService.getById('editorial-everyday')
  );

  useEffect(() => {
    return homeMediaService.subscribe(() => {
      setEverydayMedia(homeMediaService.getById('editorial-everyday'));
    });
  }, []);

  // If admin marked it as hidden, do not render
  if (everydayMedia && !everydayMedia.isVisible) {
    return null;
  }

  const imageSrc = everydayMedia?.currentImage || '/images/everyday_moments.png';
  const imageAlt = everydayMedia?.altText || 'Intricate golden chandelier jhumka earrings resting gracefully on a textured stone block';
  return (
    <section className="relative w-full overflow-hidden pt-8 sm:pt-12 lg:pt-14 pb-12 sm:pb-16 lg:pb-14">
      {/* Delicate Botanical Line Art Branch (25% hidden off-screen, above the wave, no clipping) */}
      <div 
        className="hidden md:block absolute -right-16 sm:-right-20 lg:-right-24 xl:-right-28 top-0 sm:top-1 lg:top-2 pointer-events-none select-none z-0 opacity-80"
        aria-hidden="true"
      >
        <img
          src="/elements/Delicate Mauve Botanical Branch.png"
          alt=""
          className="w-60 sm:w-72 md:w-80 lg:w-88 xl:w-96 h-auto max-h-[390px] lg:max-h-[440px] object-contain object-right block"
        />
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Domed Arch Photography with Concentric Lilac Arch Frame */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-start">
            {/* Unified Composition Frame: contains both decorative arch and photo with ample clearance so curves are NEVER cut off */}
            <div className="relative w-full max-w-[340px] sm:max-w-[390px] lg:max-w-[430px] pt-7 sm:pt-9 lg:pt-11 pl-6 sm:pl-8 lg:pl-10">
              
              {/* Concentric Solid Pastel Lilac Arch Frame — fully contained at (0, 0), pristine unclipped semicircle */}
              <div 
                className="absolute top-0 left-0 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] lg:w-[calc(100%-2.5rem)] h-[calc(100%-1.25rem)] sm:h-[calc(100%-1.5rem)] bg-[#DACEDD] rounded-t-full rounded-bl-3xl -z-10 pointer-events-none select-none shadow-sm" 
                aria-hidden="true" 
              />

              {/* Domed Arch Window Framing the Earrings */}
              <div className="group relative w-full overflow-hidden rounded-t-full rounded-b-md shadow-card hover:shadow-xl transition-all duration-700 bg-[#FAF8F5] hover-sheen">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full h-[320px] sm:h-[370px] lg:h-[400px] object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-700 ease-out block"
                />
              </div>

            </div>
          </div>

          {/* Right Column: Narrative Text and CTA */}
          <div className="lg:col-span-6 lg:pl-6 relative mt-4 lg:mt-0">
            {/* Eyebrow with horizontal line accent */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 mb-3.5 sm:mb-5">
              <span className="font-sans font-medium text-[10.5px] sm:text-[12px] tracking-[0.22em] sm:tracking-[0.25em] text-[#77716F] uppercase">
                MADE FOR YOUR
              </span>
              <div className="w-10 sm:w-12 h-[1px] bg-[#E7E0DA]" />
            </div>

            {/* Editorial Heading (Cormorant Garamond) */}
            <h2 className="font-editorial text-[36px] sm:text-[52px] lg:text-[60px] leading-[1.08] sm:leading-[1.04] tracking-[-0.01em] text-[#292624] font-normal mb-3.5 sm:mb-5">
              Everyday<br />
              moments.
            </h2>

            {/* Narrative Body Copy */}
            <p className="font-sans text-[14px] sm:text-[16px] leading-[1.6] text-[#77716F] max-w-md mb-6 sm:mb-8">
              Jewellery that effortlessly fits into life's little celebrations.
            </p>

            {/* Pill CTA Button */}
            <button
              onClick={onExploreClick}
              className="inline-flex items-center space-x-2.5 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#A783A2] hover:bg-[#936E8F] text-white text-[11.5px] sm:text-[13px] font-medium tracking-[0.14em] uppercase transition-all duration-300 shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98] group focus:outline-none focus:ring-2 focus:ring-[#A783A2] focus:ring-offset-2 cursor-pointer mb-2 lg:mb-0"
            >
              <span>EXPLORE NOW</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
