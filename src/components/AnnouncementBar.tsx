import React from 'react';

interface AnnouncementBarProps {
  onPromoClick?: () => void;
}

// Delicate Inline SVG Lotus Ornament
const LotusSymbol: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 20 16"
    fill="currentColor"
    className={`${className} inline-block shrink-0`}
    aria-hidden="true"
  >
    {/* Center tall petal */}
    <path d="M10 1 C8.8 4 8.2 7 10 10 C11.8 7 11.2 4 10 1 Z" opacity="0.95" />
    {/* Left inner petal */}
    <path d="M10 5 C7.5 6 6 8.5 7 11 C8.5 10.5 9.5 9 10 5 Z" opacity="0.9" />
    {/* Right inner petal */}
    <path d="M10 5 C12.5 6 14 8.5 13 11 C11.5 10.5 10.5 9 10 5 Z" opacity="0.9" />
    {/* Left outer petal */}
    <path d="M7 9 C4 10 2.5 12 4.5 13.5 C6.5 13 7 11.5 7 9 Z" opacity="0.8" />
    {/* Right outer petal */}
    <path d="M13 9 C16 10 17.5 12 15.5 13.5 C13.5 13 13 11.5 13 9 Z" opacity="0.8" />
    {/* Base pod */}
    <path d="M7 13.5 Q10 15 13 13.5 Q10 14.2 7 13.5 Z" />
  </svg>
);

// Delicate Inline SVG Sparkle Symbol
const SparkleSymbol: React.FC<{ className?: string }> = ({ className = 'w-2.5 h-2.5' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`${className} inline-block shrink-0`}
    aria-hidden="true"
  >
    <path d="M8 0 C8 4.2 9 7 16 8 C9 9 8 11.8 8 16 C8 11.8 7 9 0 8 C7 7 8 4.2 8 0 Z" />
  </svg>
);

// High-end promotional items for the moving marquee ribbon
const PROMO_ITEMS = [
  {
    text: 'FREE SHIPPING ON ORDERS ABOVE ₹2999',
    icon: 'lotus',
    highlight: false,
  },
  {
    text: 'FESTIVE EDIT LIVE NOW',
    icon: 'sparkle',
    highlight: true,
  },
  {
    text: 'UP TO 20% OFF • USE CODE: FESTIVE20',
    icon: 'lotus',
    highlight: false,
  },
  {
    text: 'HANDCRAFTED HEIRLOOM JEWELLERY',
    icon: 'sparkle',
    highlight: false,
  },
  {
    text: '100% ANTI-TARNISH & HYPOALLERGENIC',
    icon: 'lotus',
    highlight: false,
  },
  {
    text: 'EST. HYDERABAD • PAN-INDIA DISPATCH',
    icon: 'sparkle',
    highlight: false,
  },
];

// Replicate items so the marquee flows seamlessly without gaps on any screen width
const MARQUEE_SET = [...PROMO_ITEMS, ...PROMO_ITEMS];

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onPromoClick }) => {
  return (
    <aside
      aria-label="Promotional Announcements"
      onClick={onPromoClick}
      className="bg-[#A783A2] hover:bg-[#9B7596] text-[#FAF8F5] text-[10.5px] sm:text-[11px] font-medium tracking-[0.14em] uppercase select-none relative z-40 overflow-hidden cursor-pointer transition-colors duration-300 border-b border-white/10"
      title="Click to explore festive offers"
    >
      {/* Moving Marquee Container */}
      <div className="h-[38px] sm:h-[42px] flex items-center relative overflow-hidden">
        
        {/* Subtle gradient vignettes on edges for smooth entry/exit */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#A783A2] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#A783A2] to-transparent z-10 pointer-events-none" />

        {/* Infinite Moving Track */}
        <div className="animate-marquee flex items-center">
          
          {/* Segment 1 */}
          <div className="flex items-center shrink-0">
            {MARQUEE_SET.map((item, index) => (
              <div
                key={`track-1-${index}`}
                className="flex items-center space-x-3 px-6 sm:px-8 py-1 whitespace-nowrap"
              >
                {item.icon === 'sparkle' ? (
                  <SparkleSymbol className="w-2.5 h-2.5 text-white/90" />
                ) : (
                  <LotusSymbol className="w-3.5 h-3.5 text-white/90" />
                )}
                
                <span
                  className={
                    item.highlight
                      ? 'font-semibold text-white tracking-[0.16em] bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20'
                      : 'text-[#FAF8F5] tracking-[0.14em]'
                  }
                >
                  {item.text}
                </span>

                <span className="text-white/40 text-[10px] pl-3">✦</span>
              </div>
            ))}
          </div>

          {/* Segment 2 (Duplicate for 100% seamless infinite looping) */}
          <div className="flex items-center shrink-0" aria-hidden="true">
            {MARQUEE_SET.map((item, index) => (
              <div
                key={`track-2-${index}`}
                className="flex items-center space-x-3 px-6 sm:px-8 py-1 whitespace-nowrap"
              >
                {item.icon === 'sparkle' ? (
                  <SparkleSymbol className="w-2.5 h-2.5 text-white/90" />
                ) : (
                  <LotusSymbol className="w-3.5 h-3.5 text-white/90" />
                )}
                
                <span
                  className={
                    item.highlight
                      ? 'font-semibold text-white tracking-[0.16em] bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20'
                      : 'text-[#FAF8F5] tracking-[0.14em]'
                  }
                >
                  {item.text}
                </span>

                <span className="text-white/40 text-[10px] pl-3">✦</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </aside>
  );
};
