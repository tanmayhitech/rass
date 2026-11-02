import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCategory } from '../types';

// Signature Sacred 5-Petal Lotus Crest & Tapered Horizontal Accent Wings
const LotusCrest: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 402 60" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fillRule="evenodd" d="M 0 46 L 8 46 L 9 47 L 45 47 L 46 48 L 142 48 L 143 47 L 143 45 L 142 44 L 54 44 L 53 45 L 10 45 L 9 46 Z M 257 46 L 260 48 L 284 48 L 285 47 L 376 47 L 377 46 L 400 46 L 398 45 L 374 45 L 373 44 L 335 44 L 334 43 L 258 43 Z M 250 30 L 240 30 L 239 31 L 237 31 L 233 33 L 231 35 L 231 36 L 234 34 L 237 34 L 238 33 L 242 33 L 243 34 L 239 42 L 232 49 L 224 53 L 221 53 L 220 54 L 212 54 L 211 53 L 207 53 L 206 52 L 207 51 L 215 49 L 219 46 L 220 46 L 227 39 L 231 31 L 231 28 L 232 27 L 232 22 L 233 21 L 233 16 L 229 16 L 228 17 L 226 17 L 217 22 L 215 25 L 213 23 L 213 20 L 209 12 L 200 0 L 191 12 L 188 18 L 187 23 L 186 24 L 185 24 L 182 21 L 179 20 L 177 18 L 175 18 L 171 16 L 168 16 L 168 26 L 169 27 L 169 30 L 171 33 L 171 35 L 173 37 L 175 41 L 182 47 L 188 50 L 191 50 L 194 52 L 193 53 L 190 53 L 189 54 L 181 54 L 180 53 L 174 52 L 167 48 L 161 42 L 160 39 L 157 35 L 158 33 L 162 33 L 163 34 L 166 34 L 169 36 L 169 35 L 167 33 L 163 31 L 161 31 L 160 30 L 151 30 L 151 33 L 155 41 L 158 44 L 158 45 L 162 49 L 163 49 L 168 53 L 172 54 L 173 55 L 177 55 L 178 56 L 188 56 L 189 55 L 191 55 L 192 54 L 194 54 L 195 53 L 197 53 L 201 51 L 203 53 L 205 53 L 209 55 L 212 55 L 213 56 L 222 56 L 223 55 L 230 54 L 237 49 L 238 49 L 243 44 L 243 43 L 247 38 Z M 205 49 L 206 48 L 207 49 L 206 50 Z M 227 21 L 228 22 L 228 29 L 223 39 L 214 47 L 210 48 L 209 49 L 207 49 L 206 48 L 210 44 L 210 43 L 213 39 L 214 33 L 215 32 L 215 28 L 220 23 L 224 22 L 225 21 Z M 173 21 L 176 21 L 180 23 L 185 28 L 186 30 L 186 36 L 187 37 L 187 39 L 189 41 L 191 45 L 195 48 L 194 49 L 191 49 L 185 46 L 177 39 L 172 29 L 172 22 Z M 200 9 L 206 16 L 211 27 L 211 34 L 210 35 L 210 37 L 207 43 L 200 50 L 195 46 L 195 45 L 191 40 L 191 38 L 189 34 L 189 28 L 190 27 L 190 24 L 194 16 Z" />
  </svg>
);

// Tapered Horizontal Accent Divider Bar
const TaperedWingDivider: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 320 8" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M 0 4 Q 80 1, 160 1 Q 240 1, 320 4 Q 240 7, 160 7 Q 80 7, 0 4 Z" />
  </svg>
);

interface CategoryCardProps {
  id: ProductCategory;
  itemId?: string;
  title: string;
  subtitle?: string;
  image: string;
  cleanImage?: string;
  heightClass: string;
  onClick: (category: ProductCategory) => void;
  priority?: boolean;
  isCustom?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  itemId,
  title,
  subtitle,
  image,
  cleanImage,
  heightClass,
  onClick,
  priority = false,
  isCustom = false,
}) => {
  // Check if this card is one of the requested minimalist text cards (exact moodboard inspiration)
  const isJhumka = !isCustom && (itemId === 'cat-jhumka' || id === 'jhumka' || title.toUpperCase() === 'JHUMKA');
  const isKadas = !isCustom && (itemId === 'cat-kadas' || id === 'kadas' || title.toUpperCase() === 'KADAS');
  const isBuy4 = !isCustom && (itemId === 'cat-promo-4for999' || title.toUpperCase().includes('BUY 4'));

  // Prioritize active live image (including custom replaced photos) with cleanImage fallback
  const displayImage = image || cleanImage;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(id);
    }
  };

  // --- 1. JHUMKA TEXT CARD (Theme Pink #A783A2 with Bespoke Lotus Calligraphy in Luminous Sage) ---
  if (isJhumka) {
    return (
      <div
        onClick={() => onClick(id)}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`group relative w-full overflow-hidden rounded-[10px] sm:rounded-[14px] cursor-pointer hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-500 ease-out ${heightClass} focus:outline-none focus:ring-2 focus:ring-[#A783A2] focus:ring-offset-2 flex items-center justify-center select-none bg-[#A783A2] p-1 xs:p-1.5 sm:p-4 lg:p-5 ring-1 ring-inset ring-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] hover:shadow-[0_18px_38px_-8px_rgba(167,131,162,0.48)] hover-sheen`}
        aria-label="View Jhumka collection"
      >
        {/* Luxury Stationery Tactile Background with Soft Center Radiance */}
        <img
          src="/images/card_bg_jhumka.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-700 ease-out pointer-events-none"
          loading="eager"
        />

        {/* Bespoke Royal Passe-Partout Inset Hairline Frame */}
        <div className="absolute inset-1 xs:inset-1.5 sm:inset-3.5 border border-white/20 sm:border-white/25 rounded-[5px] sm:rounded-[8px] pointer-events-none z-10 flex flex-col justify-between p-0.5 sm:p-1 transition-all duration-500 group-hover:border-white/40">
          <div className="hidden sm:flex justify-between items-start text-white/35 text-[6px] sm:text-[7px] leading-none select-none">
            <span>✦</span>
            <span>✦</span>
          </div>
          <div className="hidden sm:flex justify-between items-end text-white/35 text-[6px] sm:text-[7px] leading-none select-none">
            <span>✦</span>
            <span>✦</span>
          </div>
        </div>

        {/* Center Dramatic Artwork: User's Exact Sacred Lotus & Winged Calligraphy for JHUMKA in Crisp Luminous Sage */}
        <div className="relative z-10 w-[92%] xs:w-[90%] sm:w-[86%] max-w-[380px] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
          <img
            src="/images/jhumka_motif_sage_3x.png"
            alt="Jhumka"
            className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.12)]"
            loading="eager"
          />
        </div>
      </div>
    );
  }

  // --- 2. KADAS TEXT CARD (Theme Sage Green #C8D4C1 with Sacred Lotus & Calligraphy for कड़ा in Pink) ---
  if (isKadas) {
    return (
      <div
        onClick={() => onClick(id)}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`group relative w-full overflow-hidden rounded-[10px] sm:rounded-[14px] cursor-pointer hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-500 ease-out ${heightClass} focus:outline-none focus:ring-2 focus:ring-[#C8D4C1] focus:ring-offset-2 flex items-center justify-center select-none bg-[#C8D4C1] p-1 xs:p-1.5 sm:p-4 lg:p-5 ring-1 ring-inset ring-black/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] hover:shadow-[0_12px_28px_-8px_rgba(180,195,173,0.35)] hover-sheen`}
        aria-label="View Kadas collection"
      >
        {/* Luxury Stationery Tactile Background with Soft Center Radiance */}
        <img
          src="/images/card_bg_kadas.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-700 ease-out pointer-events-none"
          loading="eager"
        />

        {/* Bespoke Royal Passe-Partout Inset Hairline Frame in Theme Plum */}
        <div className="absolute inset-1 xs:inset-1.5 sm:inset-3.5 border border-[#844C7F]/20 sm:border-[#844C7F]/25 rounded-[5px] sm:rounded-[8px] pointer-events-none z-10 flex flex-col justify-between p-0.5 sm:p-1 transition-all duration-500 group-hover:border-[#844C7F]/40">
          <div className="hidden sm:flex justify-between items-start text-[#844C7F]/35 text-[6px] sm:text-[7px] leading-none select-none">
            <span>✦</span>
            <span>✦</span>
          </div>
          <div className="hidden sm:flex justify-between items-end text-[#844C7F]/35 text-[6px] sm:text-[7px] leading-none select-none">
            <span>✦</span>
            <span>✦</span>
          </div>
        </div>

        {/* Center Dramatic Artwork: Sacred Lotus Flower & Winged Calligraphy for कड़ा in Rich Theme Pink - Perfectly Centered */}
        <div className="relative z-10 w-[92%] xs:w-[90%] sm:w-[86%] max-w-[380px] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
          <img
            src="/images/kada_motif_pink_3x.png"
            alt="कड़ा"
            className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.08)]"
            loading="eager"
          />
        </div>
      </div>
    );
  }

  // --- 3. BUY 4 FOR ₹999 TEXT CARD (Theme Pink #A783A2 with Bespoke Lotus Sparkle Motif in Luminous Sage) ---
  if (isBuy4) {
    return (
      <div
        onClick={() => onClick(id)}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`group relative w-full overflow-hidden rounded-[10px] sm:rounded-[14px] cursor-pointer hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-500 ease-out ${heightClass} focus:outline-none focus:ring-2 focus:ring-[#A783A2] focus:ring-offset-2 flex items-center justify-center select-none bg-[#A783A2] p-1 xs:p-1.5 sm:p-3 ring-1 ring-inset ring-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] hover:shadow-[0_12px_28px_-8px_rgba(167,131,162,0.35)] hover-sheen`}
        aria-label="View Buy 4 for 999 collection"
      >
        {/* Luxury Stationery Tactile Background with Soft Center Radiance */}
        <img
          src="/images/card_bg_buy4.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-700 ease-out pointer-events-none"
          loading="eager"
        />

        {/* Bespoke Royal Passe-Partout Inset Hairline Frame */}
        <div className="absolute inset-1 xs:inset-1.5 sm:inset-3 border border-white/20 sm:border-white/25 rounded-[5px] sm:rounded-[8px] pointer-events-none z-10 flex flex-col justify-between p-0.5 sm:p-1 transition-all duration-500 group-hover:border-white/40">
          <div className="hidden sm:flex justify-between items-start text-white/35 text-[6px] sm:text-[7px] leading-none select-none">
            <span>✦</span>
            <span>✦</span>
          </div>
          <div className="hidden sm:flex justify-between items-end text-white/35 text-[6px] sm:text-[7px] leading-none select-none">
            <span>✦</span>
            <span>✦</span>
          </div>
        </div>

        {/* Center Dramatic Artwork: Perfectly centered, 100% visible, fully contained to prevent desktop cropping */}
        <div className="relative z-10 w-full h-full max-h-full flex items-center justify-center p-0.5 xs:p-1 sm:p-2.5 transition-transform duration-500 group-hover:scale-105">
          <img
            src="/images/buy4_motif_sage_3x.png"
            alt="Buy 4 for ₹999"
            className="max-h-[90%] max-w-[90%] sm:max-h-[84%] sm:max-w-[84%] w-auto h-auto object-contain select-none pointer-events-none drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.12)]"
            loading="eager"
          />
        </div>
      </div>
    );
  }

  // --- 4. STANDARD PHOTOGRAPHY CARDS (Soft, Light & Natural Vignette, Elegant Typography) ---
  return (
    <div
      onClick={() => onClick(id)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`group relative w-full overflow-hidden rounded-[10px] sm:rounded-[14px] cursor-pointer hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-500 ease-out ${heightClass} focus:outline-none focus:ring-2 focus:ring-[#A783A2] focus:ring-offset-2 ring-1 ring-black/[0.05] hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.14)] hover-sheen`}
      aria-label={`View ${title} collection`}
    >
      {/* Background Photography with subtle hover zoom */}
      <img
        src={displayImage}
        alt={`${title} jewellery collection`}
        className={`w-full h-full object-cover ${id === 'earrings' ? 'object-[56%_48%]' : 'object-center'} transform group-hover:scale-[1.05] transition-transform duration-700 ease-out`}
        loading={priority ? 'eager' : 'lazy'}
      />

      {/* Light, soft & natural photographic bottom vignette */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 via-32% to-transparent pointer-events-none opacity-80 group-hover:opacity-90 transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Content Bar at Bottom: Aligned at bottom with wrap protection */}
      <div className="absolute inset-x-0 bottom-0 p-2 xs:p-2.5 sm:p-4 lg:p-5 flex items-end justify-between pointer-events-none">
        {/* Category Label: Crisp Roman serif with soft, light text shadow */}
        <span className="font-cinzel font-bold sm:font-semibold text-[9px] xs:text-[10.5px] sm:text-[13px] lg:text-[15px] leading-[1.14] sm:leading-tight tracking-[0.05em] xs:tracking-[0.08em] sm:tracking-[0.16em] text-white uppercase select-none line-clamp-2 pr-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
          {title}
        </span>

        {/* Circular Action Arrow */}
        <div 
          className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-6.5 sm:h-6.5 lg:w-7.5 lg:h-7.5 rounded-full bg-white/95 text-[#292624] flex items-center justify-center shadow-sm group-hover:bg-[#A783A2] group-hover:text-white group-hover:scale-110 active:scale-95 transition-all duration-300 shrink-0 ml-1 mb-0.5"
          aria-hidden="true"
        >
          <ArrowRight className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
};
