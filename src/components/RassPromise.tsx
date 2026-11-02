import React from 'react';
import { Sparkles, ShieldCheck, Award, Truck, ArrowRight, Heart } from 'lucide-react';

interface RassPromiseProps {
  onExploreClick?: () => void;
  onStoryClick?: () => void;
  className?: string;
  showCareNote?: boolean;
}

export const RassPromise: React.FC<RassPromiseProps> = ({
  onExploreClick,
  onStoryClick,
  className = '',
  showCareNote = true,
}) => {
  const promises = [
    {
      icon: Sparkles,
      iconColor: 'text-[#A783A2]',
      iconBg: 'bg-[#FAF5F9]',
      iconBorder: 'border-[#E2D5E5]',
      badge: 'Jaipur • Rajkot • Bengal',
      badgeColor: 'bg-[#FAF5F9] text-[#865A80] border-[#E2D5E5]',
      title: 'Generational Karigari',
      description:
        'Curated directly from master craftsmanship clusters across Jaipur, Rajkot, and Bengal—preserving age-old Indian artistry with modern aesthetics and everyday wearability.',
      highlight: '✦ Authentic Heritage Clusters',
    },
    {
      icon: Award,
      iconColor: 'text-[#B49A6C]',
      iconBg: 'bg-[#FBF8F2]',
      iconBorder: 'border-[#EDE4D4]',
      badge: '18k/24k Micro Gold Polish',
      badgeColor: 'bg-[#FBF8F2] text-[#8C7345] border-[#EDE4D4]',
      title: 'Anti-Tarnish & Waterproof',
      description:
        'Solid brass finished with 18k/24k micro gold polish and protective anti-tarnish e-coating, complemented by waterproof stainless steel for effortless daily wear.',
      highlight: '✦ E-Coated Long-Lasting Shine',
    },
    {
      icon: ShieldCheck,
      iconColor: 'text-[#6E8B62]',
      iconBg: 'bg-[#F3F7F1]',
      iconBorder: 'border-[#D9E4D6]',
      badge: 'Nickel-Free & Lead-Free',
      badgeColor: 'bg-[#F3F7F1] text-[#4F6D44] border-[#D9E4D6]',
      title: '100% Skin-Safe',
      description:
        'Guaranteed 100% hypoallergenic and sensitive-skin friendly. Zero harsh irritants, nickel, or lead—crafted so you can wear your favourite pieces in complete comfort.',
      highlight: '✦ Pure Sensitive Skin Comfort',
    },
    {
      icon: Truck,
      iconColor: 'text-[#A783A2]',
      iconBg: 'bg-[#FAF5F9]',
      iconBorder: 'border-[#E2D5E5]',
      badge: 'Dispatched in 2–4 Days',
      badgeColor: 'bg-[#FAF5F9] text-[#865A80] border-[#E2D5E5]',
      title: 'Global Express & Exchange',
      description:
        'Dispatched from Hyderabad in 2 to 4 business days. Complimentary Pan-India delivery above ₹3,999, worldwide shipping via DHL/FedEx, and 48-hour exchange assurance.',
      highlight: '✦ Pan-India & Worldwide Express',
    },
  ];

  return (
    <section className={`w-full py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-[#FAF8F5] border-t border-[#E7E0DA]/80 ${className}`}>
      {/* Subtle Ambient Background Watermark */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          {/* Eyebrow with decorative lines */}
          <div className="flex items-center justify-center space-x-3 mb-2.5">
            <div className="w-8 sm:w-12 h-[1px] bg-[#A783A2]/40" />
            <span className="text-[10px] sm:text-[11.5px] font-semibold uppercase tracking-[0.24em] text-[#A783A2]">
              THE RASS PROMISE
            </span>
            <div className="w-8 sm:w-12 h-[1px] bg-[#A783A2]/40" />
          </div>

          {/* Main Title */}
          <h2 className="font-editorial text-[28px] sm:text-[38px] lg:text-[44px] text-[#292624] font-normal tracking-[-0.01em] leading-tight mb-3">
            Craftsmanship & Integrity
          </h2>

          {/* Subtitle / Brand Philosophy */}
          <p className="text-[13px] sm:text-[15px] text-[#77716F] leading-relaxed max-w-xl mx-auto font-sans">
            <span className="italic font-serif text-[#A783A2]">&ldquo;An expression of culture, crafted with love.&rdquo;</span>{' '}
            Every piece bridges the charm of Indian traditions with contemporary designs and effortless everyday wearability.
          </p>
        </div>

        {/* 4 Brand Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
          {promises.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white/90 hover:bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E0DA] hover:border-[#A783A2]/40 shadow-2xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Icon & Pill Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${p.iconBg} border ${p.iconBorder} flex items-center justify-center ${p.iconColor} shadow-2xs group-hover:scale-105 transition-transform duration-300`}
                    >
                      <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[1.8]" />
                    </div>

                    <span
                      className={`text-[9.5px] sm:text-[10.5px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full border ${p.badgeColor}`}
                    >
                      {p.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-editorial text-[20px] sm:text-[22px] text-[#292624] font-medium mb-2 group-hover:text-[#A783A2] transition-colors">
                    {p.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[12.5px] sm:text-[13.5px] text-[#77716F] leading-[1.65] font-sans">
                    {p.description}
                  </p>
                </div>

                {/* Bottom Highlight Tag */}
                <div className="pt-4 mt-4 border-t border-[#F2EDE8] flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-medium tracking-wider text-[#A783A2] uppercase">
                    {p.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Founder's Gentle Reminder Banner */}
        {showCareNote && (
          <div className="mt-8 sm:mt-12 bg-white/70 backdrop-blur-xs rounded-2xl border border-[#E7E0DA] p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center space-x-3.5">
              <div className="w-9 h-9 rounded-full bg-[#FAF5F9] border border-[#E2D5E5] flex items-center justify-center text-[#A783A2] shrink-0">
                <Heart className="w-4 h-4 fill-[#A783A2]/20 stroke-[1.8]" />
              </div>
              <div>
                <p className="text-[12.5px] sm:text-[13.5px] text-[#292624] font-medium italic font-serif">
                  &ldquo;Jewellery is made to make you shine. Treat every piece with love, and it will remain a beautiful part of your story.&rdquo;
                </p>
                <span className="text-[10.5px] sm:text-[11.5px] text-[#77716F] uppercase tracking-[0.16em] font-sans font-medium">
                  — Ridhima, Founder of Rass ♡
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 shrink-0">
              {onStoryClick && (
                <button
                  onClick={onStoryClick}
                  className="px-4 py-2 rounded-full border border-[#E7E0DA] hover:border-[#A783A2] text-[#5C5855] hover:text-[#A783A2] text-[11px] sm:text-[12px] font-medium tracking-wider uppercase transition-all cursor-pointer"
                >
                  Our Story
                </button>
              )}
              {onExploreClick && (
                <button
                  onClick={onExploreClick}
                  className="inline-flex items-center space-x-1.5 px-4.5 py-2 rounded-full bg-[#292624] hover:bg-[#A783A2] text-white text-[11px] sm:text-[12px] font-medium tracking-wider uppercase transition-all shadow-2xs hover:shadow-sm cursor-pointer"
                >
                  <span>Explore Pieces</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
