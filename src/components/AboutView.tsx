import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Award, 
  HeartHandshake, 
  ShieldCheck, 
  Gem, 
  Ruler, 
  MessageCircle,
  CheckCircle2,
  Clock,
  Truck,
  Droplets,
  Package,
  Layers,
  Sparkle,
  Phone
} from 'lucide-react';
import { SectionDivider } from './SectionDivider';
import { NewsletterSection } from './NewsletterSection';

interface AboutViewProps {
  onBackToHome: () => void;
  onExploreShop: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBackToHome, onExploreShop }) => {
  const [activeTab, setActiveTab] = useState<'craft' | 'care' | 'sizing'>('craft');

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen text-[#292624] animate-fadeIn pb-16 relative overflow-hidden">
      
      {/* Decorative Botanical Sprigs in Background */}
      <div className="absolute top-12 left-0 pointer-events-none opacity-20 sm:opacity-35 select-none" aria-hidden="true">
        <img
          src="/elements/Mauve Botanical Sprig Line Art.png"
          alt=""
          className="w-24 sm:w-36 lg:w-44 h-auto object-contain object-top-left"
        />
      </div>
      <div className="absolute top-12 right-0 pointer-events-none opacity-20 sm:opacity-35 select-none -scale-x-100" aria-hidden="true">
        <img
          src="/elements/Mauve Botanical Sprig Line Art.png"
          alt=""
          className="w-24 sm:w-36 lg:w-44 h-auto object-contain object-top-right"
        />
      </div>

      {/* 1. EDITORIAL HERO & BREADCRUMB */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-10 relative z-10">
        
        {/* Breadcrumb with Diamond Symbol */}
        <div className="flex items-center justify-center gap-2 text-[10.5px] sm:text-xs text-[#8C827A] uppercase tracking-[0.2em] mb-3 font-medium">
          <button 
            onClick={onBackToHome}
            className="hover:text-[#A783A2] transition-colors flex items-center gap-1 group cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
            <span>Home</span>
          </button>
          <span className="text-[#A783A2] text-[10px]">✦</span>
          <span className="text-[#292624] font-semibold">Our Story & Atelier</span>
        </div>

        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF5F9] border border-[#A783A2]/30 text-[#8B5E86] text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-semibold mb-3">
            <Sparkles className="w-3 h-3 text-[#A783A2]" />
            <span>EST. HYDERABAD • ATELIER STORY</span>
          </span>

          <h1 className="font-playfair text-[34px] sm:text-[50px] lg:text-[58px] font-medium text-[#292624] tracking-tight leading-[1.08] mb-3.5">
            Rooted in Tradition,<br className="hidden sm:inline" /> Made for Today.
          </h1>

          <p className="font-sans text-[14px] sm:text-[16px] text-[#77716F] leading-relaxed max-w-xl mx-auto">
            Curated pieces for the Modern Muse. Thoughtful demi-fine jewellery celebrating everyday moments and life's grandest celebrations.
          </p>

          <div className="flex justify-center mt-4">
            <img 
              src="/elements/Elegant Mauve Lotus Ornamental Divider.png" 
              alt="" 
              className="w-44 sm:w-56 h-auto object-contain opacity-80 select-none pointer-events-none"
            />
          </div>
        </div>

      </div>

      {/* 2. MAIN STORY SECTION WITH PHOTOGRAPHY & FOUNDER LETTER */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Visual Architectural Arch Frame */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-[480px]">
              {/* Decorative Offset Outline */}
              <div className="absolute -inset-2.5 rounded-tl-[110px] sm:rounded-tl-[140px] rounded-tr-3xl rounded-b-3xl border border-[#A783A2]/25 pointer-events-none hidden sm:block" />
              
              <div className="relative rounded-tl-[100px] sm:rounded-tl-[130px] rounded-tr-3xl rounded-b-3xl overflow-hidden shadow-[0_12px_36px_rgba(41,38,36,0.12)] border border-[#E7E0DA] bg-white group">
                <img
                  src="/images/craftsmanship.png"
                  alt="Artisan jeweler delicately crafting filigree jewellery"
                  className="w-full h-[360px] sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                
                {/* Floating Glass Atelier Tag */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E7E0DA] flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold block">Dispatched from Hyderabad</span>
                    <span className="font-playfair text-sm text-[#292624] font-medium">Handcrafted with Intention • 24–48h Dispatch</span>
                  </div>
                  <span className="text-[#A783A2] text-sm">✦</span>
                </div>
              </div>

              {/* Floating Mini Accent Card */}
              <div className="absolute -bottom-6 -right-2 sm:-right-4 hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#FAF5F9] rounded-xl border border-[#A783A2]/40 shadow-sm backdrop-blur-xs">
                <Sparkles className="w-4 h-4 text-[#A783A2]" />
                <span className="text-[11px] font-sans font-semibold text-[#8B5E86] uppercase tracking-wider">Anti-Tarnish Sealed</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Copy & Founder's Personal Note */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 lg:pl-2">
            <div className="flex items-center space-x-2 text-[#A783A2]">
              <Sparkles className="w-4 h-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">The Philosophy</span>
            </div>

            <h2 className="font-playfair text-[28px] sm:text-[36px] text-[#292624] font-medium leading-[1.18]">
              Jewellery that effortlessly fits into your everyday life.
            </h2>

            <div className="space-y-3.5 text-[14px] sm:text-[15px] text-[#5C5855] leading-relaxed font-sans">
              <p>
                Founded by <strong>Ridhima</strong>, <strong>Rass</strong> was created to bridge the space between heavy, formal bridal jewellery and disposable fast fashion. We believe exquisite ornaments belong in everyday moments—over morning chai, intimate family gatherings, festive dinners, and quiet celebrations.
              </p>
              <p>
                Based in Hyderabad and shipping Pan-India, each collection is curated with deep affection for Indian artisanal heritage: regal jhumkas, intricate filigree, rawa ball detailing, and statement rings reimagined with lightweight comfort.
              </p>
              <p>
                Every piece features a durable brass base finished in antique gold and silver micro-polish, dual-tone oxidised silver, semi-precious Kundan, Polki, Onyx, Zircon, and real freshwater pearls, shielded by an anti-tarnish protective sealing coat.
              </p>
            </div>

            {/* Founder Ridhima's Personal Note on Fine Stationery */}
            <div className="p-5 sm:p-6 bg-[#FAF5F9] rounded-2xl border border-[#E7E0DA] relative shadow-2xs overflow-hidden">
              {/* Subtle Lotus Emblem Watermark */}
              <div className="absolute -right-4 -bottom-4 pointer-events-none opacity-10 select-none">
                <img
                  src="/elements/Mauve Layered Lotus Emblem.png"
                  alt=""
                  className="w-32 h-32 object-contain"
                />
              </div>

              <div className="flex items-center gap-2 mb-2 text-[#8B5E86]">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em]">A Personal Note from the Founder</span>
                <span className="text-[#A783A2] text-xs">✦</span>
              </div>

              <p className="font-serif italic text-[14px] sm:text-[15.5px] text-[#292624] leading-relaxed">
                “More than jewellery, it’s a feeling, a story, a reflection of you. At Rass by Ridhima, we believe every piece holds a little magic — celebrating your individuality, embracing timeless elegance, and adding a touch of beauty to every moment. Inspired by the charm of tradition and the grace of modern style, our jewellery is designed for the moments you want to cherish and the memories you want to create.”
              </p>
              <p className="font-serif italic text-[14px] sm:text-[15.5px] text-[#292624] leading-relaxed mt-2.5">
                “Fall in love with your next favourite piece. Explore our collection, find the jewellery that speaks to you, and make it yours today! 🤍✨”
              </p>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#E7E0DA]">
                <div>
                  <span className="font-sans font-semibold text-xs text-[#8B5E86] tracking-wider uppercase block">— Ridhima</span>
                  <span className="text-[11px] text-[#77716F]">Founder & Creative Director</span>
                </div>
                <span className="text-[#A783A2] text-xs">✦</span>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-2">
              <button
                onClick={onExploreShop}
                className="inline-flex items-center space-x-2.5 px-8 py-3.5 rounded-full bg-[#292624] hover:bg-black text-white text-[12px] font-medium tracking-[0.14em] uppercase transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-98 cursor-pointer"
              >
                <span>Discover The Heirlooms</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 3. FOUR CORE BRAND PILLARS */}
      <div className="bg-[#F4EFEA]/80 border-y border-[#E7E0DA] py-12 sm:py-16 my-8 relative">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="text-center max-w-lg mx-auto mb-10">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#8C827A] block mb-1">
              THE RASS PROMISE
            </span>
            <h3 className="font-playfair text-[26px] sm:text-[34px] text-[#292624] font-medium">
              Craftsmanship & Integrity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Pillar 1 */}
            <div className="p-6 bg-white rounded-2xl border border-[#E7E0DA] space-y-3 shadow-2xs hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-full bg-[#FAF5F9] border border-[#E7E0DA] flex items-center justify-center text-[#A783A2] group-hover:scale-105 group-hover:bg-[#A783A2] group-hover:text-white transition-all">
                <HeartHandshake className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h4 className="font-playfair text-[17px] text-[#292624] font-medium">Artisanal Roots</h4>
              <p className="text-[12.5px] text-[#77716F] leading-relaxed">
                Celebrating hereditary Indian karigar techniques including rawa work, meenakari motifs, and delicate filigree.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 bg-white rounded-2xl border border-[#E7E0DA] space-y-3 shadow-2xs hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-full bg-[#FAF5F9] border border-[#E7E0DA] flex items-center justify-center text-[#B49A6C] group-hover:scale-105 group-hover:bg-[#B49A6C] group-hover:text-white transition-all">
                <Award className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h4 className="font-playfair text-[17px] text-[#292624] font-medium">Anti-Tarnish Longevity</h4>
              <p className="text-[12.5px] text-[#77716F] leading-relaxed">
                Finished with a specialized micro-coating designed to resist moisture, sweat, and oxidation for enduring daily wear.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 bg-white rounded-2xl border border-[#E7E0DA] space-y-3 shadow-2xs hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-full bg-[#FAF5F9] border border-[#E7E0DA] flex items-center justify-center text-[#869E7B] group-hover:scale-105 group-hover:bg-[#869E7B] group-hover:text-white transition-all">
                <Gem className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h4 className="font-playfair text-[17px] text-[#292624] font-medium">Semi-Precious Gemstones</h4>
              <p className="text-[12.5px] text-[#77716F] leading-relaxed">
                Hand-selected Kundan, Polki, Onyx cabochons, sparkling Zircons, and real freshwater & shell pearls.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 bg-white rounded-2xl border border-[#E7E0DA] space-y-3 shadow-2xs hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-full bg-[#FAF5F9] border border-[#E7E0DA] flex items-center justify-center text-[#A783A2] group-hover:scale-105 group-hover:bg-[#A783A2] group-hover:text-white transition-all">
                <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h4 className="font-playfair text-[17px] text-[#292624] font-medium">Insured Transit</h4>
              <p className="text-[12.5px] text-[#77716F] leading-relaxed">
                Dispatched from Hyderabad within 24–48 hours with 100% insured courier transit, tamper-proof packaging, and direct tracking.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* 4. INTERACTIVE ATELIER GUIDE (CRAFT, CARE, SIZING TABS) */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-14 relative z-10">
        
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#A783A2] font-semibold block mb-1">
            ATELIER INSIGHTS & STANDARDS
          </span>
          <h2 className="font-playfair text-[26px] sm:text-[34px] text-[#292624] font-medium">
            Everything You Need to Know
          </h2>
          <p className="text-xs sm:text-sm text-[#77716F] mt-1">
            Explore our materials, the 4 golden care rituals, and personalized virtual sizing.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('craft')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'craft'
                ? 'bg-[#292624] text-white shadow-sm'
                : 'bg-white border border-[#E7E0DA] text-[#5C5855] hover:border-[#A783A2]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Materials & Craftsmanship</span>
          </button>

          <button
            onClick={() => setActiveTab('care')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'care'
                ? 'bg-[#292624] text-white shadow-sm'
                : 'bg-white border border-[#E7E0DA] text-[#5C5855] hover:border-[#A783A2]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>4 Golden Care Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('sizing')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'sizing'
                ? 'bg-[#292624] text-white shadow-sm'
                : 'bg-white border border-[#E7E0DA] text-[#5C5855] hover:border-[#A783A2]'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>Sizing & Atelier Concierge</span>
          </button>
        </div>

        {/* TAB 1: CRAFT & NOBLE MATERIALS */}
        {activeTab === 'craft' && (
          <div className="bg-white rounded-3xl border border-[#E7E0DA] p-6 sm:p-10 shadow-2xs space-y-6 animate-fadeIn">
            <div className="border-b border-[#E7E0DA] pb-4">
              <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold block mb-1">Material Integrity</span>
              <h3 className="font-playfair text-[22px] sm:text-[26px] text-[#292624] font-medium">Noble Foundation & Durable Finishes</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-2">
                <div className="w-9 h-9 rounded-full bg-[#FAF5F9] border border-[#E7E0DA] flex items-center justify-center text-[#B49A6C]">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-playfair text-base text-[#292624] font-medium">Brass Core & Micro-Polish</h4>
                <p className="text-xs text-[#5C5855] leading-relaxed">
                  Crafted on a sturdy hypoallergenic brass foundation coated with multi-step antique gold, silver, and dual-tone micro-polishing.
                </p>
              </div>

              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-2">
                <div className="w-9 h-9 rounded-full bg-[#FAF5F9] border border-[#E7E0DA] flex items-center justify-center text-[#A783A2]">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-playfair text-base text-[#292624] font-medium">Anti-Tarnish Sealing Coat</h4>
                <p className="text-xs text-[#5C5855] leading-relaxed">
                  Every curve is sealed with an invisible protective anti-tarnish barrier designed to resist environmental moisture and perspiration.
                </p>
              </div>

              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-2">
                <div className="w-9 h-9 rounded-full bg-[#FAF5F9] border border-[#E7E0DA] flex items-center justify-center text-[#869E7B]">
                  <Gem className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-playfair text-base text-[#292624] font-medium">Kundan, Polki & Pearls</h4>
                <p className="text-xs text-[#5C5855] leading-relaxed">
                  Embellished with precision glass-foil Kundan, faceted Onyx, micro-pave Zircons, and freshwater & shell pearls strung securely by hand.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 4 GOLDEN CARE RULES */}
        {activeTab === 'care' && (
          <div className="bg-white rounded-3xl border border-[#E7E0DA] p-6 sm:p-10 shadow-2xs space-y-6 animate-fadeIn">
            <div className="border-b border-[#E7E0DA] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold block mb-1">Preserve Your Heirlooms</span>
                <h3 className="font-playfair text-[22px] sm:text-[26px] text-[#292624] font-medium">The 4 Golden Rules of Jewellery Care</h3>
              </div>
              <span className="text-[11px] text-[#8C827A] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#E7E0DA]">Essential Rituals</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Rule 01 */}
              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-2 relative overflow-hidden">
                <span className="text-[10px] font-bold text-[#A783A2] uppercase tracking-wider block">Rule 01</span>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-[#A783A2]" />
                  <h4 className="font-playfair text-[16px] text-[#292624] font-medium">Keep Away from Water & Chemicals</h4>
                </div>
                <p className="text-xs text-[#5C5855] leading-relaxed">
                  Avoid contact with water, soaps, perfumes, hair sprays, and chemical lotions. Always wear your jewellery after applying beauty products.
                </p>
              </div>

              {/* Rule 02 */}
              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-2 relative overflow-hidden">
                <span className="text-[10px] font-bold text-[#A783A2] uppercase tracking-wider block">Rule 02</span>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#A783A2]" />
                  <h4 className="font-playfair text-[16px] text-[#292624] font-medium">Store in Airtight Zip-Locks</h4>
                </div>
                <p className="text-xs text-[#5C5855] leading-relaxed">
                  Store each piece individually in sealed airtight zip-locks or soft pouches. <strong>Do NOT store in velvet boxes</strong> to prevent moisture retention.
                </p>
              </div>

              {/* Rule 03 */}
              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-2 relative overflow-hidden">
                <span className="text-[10px] font-bold text-[#A783A2] uppercase tracking-wider block">Rule 03</span>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#A783A2]" />
                  <h4 className="font-playfair text-[16px] text-[#292624] font-medium">Gentle Microfibre Cleaning</h4>
                </div>
                <p className="text-xs text-[#5C5855] leading-relaxed">
                  Wipe your jewellery gently with a clean, dry microfibre cloth after each wear to remove residual skin oils and airborne dust.
                </p>
              </div>

              {/* Rule 04 */}
              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-2 relative overflow-hidden">
                <span className="text-[10px] font-bold text-[#A783A2] uppercase tracking-wider block">Rule 04</span>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#A783A2]" />
                  <h4 className="font-playfair text-[16px] text-[#292624] font-medium">Dry & Friction-Free</h4>
                </div>
                <p className="text-xs text-[#5C5855] leading-relaxed">
                  Remove before bathing, workouts, or sleeping. Separate each piece to prevent stones and chains from scratching against one another.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SIZING & CONCIERGE */}
        {activeTab === 'sizing' && (
          <div className="bg-white rounded-3xl border border-[#E7E0DA] p-6 sm:p-10 shadow-2xs space-y-6 animate-fadeIn">
            <div className="border-b border-[#E7E0DA] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold block mb-1">Standard Sizing</span>
                <h3 className="font-playfair text-[22px] sm:text-[26px] text-[#292624] font-medium">Atelier Size Recommendations</h3>
              </div>
              <span className="text-[11px] text-[#8C827A] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#E7E0DA]">Standard Indian Gauges</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-[#5C5855] leading-relaxed">
                  To ensure rapid dispatch and artisanal excellence, all pieces follow standard catalogue measurements. Need help finding your fit?
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E0DA] flex justify-between items-center">
                    <span className="font-medium text-[#292624]">Rings (Standard Indian Gauge)</span>
                    <span className="text-[#77716F]">Sizes 12 to 18 (Adjustable options available)</span>
                  </div>
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E0DA] flex justify-between items-center">
                    <span className="font-medium text-[#292624]">Bangles & Kangans</span>
                    <span className="text-[#77716F]">2.4 (Small), 2.6 (Medium), 2.8 (Large)</span>
                  </div>
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E0DA] flex justify-between items-center">
                    <span className="font-medium text-[#292624]">Necklaces</span>
                    <span className="text-[#77716F]">Adjustable silk dori chords & extension links</span>
                  </div>
                </div>
              </div>

              {/* Concierge Direct Box */}
              <div className="p-6 bg-[#FAF5F9] rounded-2xl border border-[#A783A2]/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white border border-[#E7E0DA] flex items-center justify-center text-[#A783A2] mx-auto shadow-2xs">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h4 className="font-playfair text-[18px] text-[#292624] font-medium">Unsure of Your Size?</h4>
                <p className="text-xs text-[#77716F] max-w-xs mx-auto leading-relaxed">
                  Our Hyderabad atelier team is ready on WhatsApp to assist with exact measurements and fitting suggestions.
                </p>
                <div className="pt-1">
                  <a
                    href="https://wa.me/919819733572?text=Hello%20Rass,%20I%20would%20like%20sizing%20guidance%20for%20a%20jewellery%20piece"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#A783A2] hover:bg-[#936E8F] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-xs cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Concierge (+91 98197 33572)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 5. LUXURY TRUST GUARANTEE STRIP */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 my-6">
        <div className="py-4 px-6 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs flex flex-wrap items-center justify-around gap-4 text-xs text-[#5C5855]">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#A783A2]" />
            <span className="font-medium text-[#292624]">Free Shipping Above ₹2,999</span>
          </div>
          <span className="hidden sm:inline text-[#E7E0DA]">•</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#A783A2]" />
            <span className="font-medium text-[#292624]">48-Hour Exchange Window</span>
          </div>
          <span className="hidden sm:inline text-[#E7E0DA]">•</span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A783A2]" />
            <span className="font-medium text-[#292624]">100% Insured Delivery</span>
          </div>
          <span className="hidden sm:inline text-[#E7E0DA]">•</span>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#A783A2]" />
            <span className="font-medium text-[#292624]">Dedicated WhatsApp Concierge</span>
          </div>
        </div>
      </div>

      {/* 6. NEWSLETTER BAND */}
      <NewsletterSection />

    </div>
  );
};
