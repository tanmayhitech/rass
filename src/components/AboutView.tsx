import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Gem, 
  Ruler, 
  Droplets, 
  Package, 
  Layers, 
  Mail, 
  Truck, 
  CheckCircle2,
  Heart,
  Compass,
  MapPin,
  Clock,
  Sparkle
} from 'lucide-react';
import { NewsletterSection } from './NewsletterSection';

interface AboutViewProps {
  onBackToHome: () => void;
  onExploreShop: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBackToHome, onExploreShop }) => {
  const [activeTab, setActiveTab] = useState<'craft' | 'care' | 'sizing'>('craft');

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen text-[#292624] animate-fadeIn pb-16 relative overflow-hidden">
      
      {/* Subtle Botanical Sprig Background Accents */}
      <div className="absolute top-10 left-0 pointer-events-none opacity-25 select-none" aria-hidden="true">
        <img
          src="/elements/Mauve Botanical Sprig Line Art.png"
          alt=""
          className="w-24 sm:w-36 lg:w-48 h-auto object-contain object-top-left"
        />
      </div>
      <div className="absolute top-10 right-0 pointer-events-none opacity-25 select-none -scale-x-100" aria-hidden="true">
        <img
          src="/elements/Mauve Botanical Sprig Line Art.png"
          alt=""
          className="w-24 sm:w-36 lg:w-48 h-auto object-contain object-top-right"
        />
      </div>

      {/* 1. EDITORIAL HERO & BREADCRUMB */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-10 relative z-10">
        
        {/* Subtle Minimal Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-[10.5px] sm:text-xs text-[#8C827A] tracking-[0.18em] uppercase mb-3 font-medium">
          <button 
            onClick={onBackToHome}
            className="hover:text-[#A783A2] transition-colors flex items-center gap-1 group cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
            <span>Home</span>
          </button>
          <span className="text-[#C8BFB8] font-light">/</span>
          <span className="text-[#292624] font-medium">Our Story</span>
        </nav>

        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF5F9] border border-[#A783A2]/25 text-[#8E6789] text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-medium mb-3 shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#A783A2]" />
            <span>EST. HYDERABAD • OUR STORY</span>
          </span>

          <h1 className="font-cormorant font-normal text-[36px] sm:text-[50px] lg:text-[60px] text-[#292624] tracking-[0.015em] leading-[1.08] mb-3 sm:mb-4">
            RASS BY RIDHIMA
          </h1>

          <p className="font-cormorant italic text-[18px] sm:text-[22px] text-[#8E6789] leading-relaxed max-w-2xl mx-auto font-normal px-2">
            RASS — An expression of culture, crafted with love.
          </p>

          <div className="flex justify-center mt-4">
            <img 
              src="/elements/Elegant Mauve Lotus Ornamental Divider.png" 
              alt="" 
              className="w-40 sm:w-52 h-auto object-contain opacity-75 select-none pointer-events-none"
            />
          </div>
        </div>

      </div>

      {/* 2. MAIN STORY SECTION: ARCHITECTURAL FRAME & FOUNDER'S NOTE */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Mughal Architectural Frame */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-[480px]">
              {/* Fine Gold / Mauve Halo Border */}
              <div className="absolute -inset-2.5 rounded-tl-[130px] sm:rounded-tl-[160px] rounded-tr-3xl rounded-b-3xl border border-[#A783A2]/25 pointer-events-none hidden sm:block" />
              
              <div className="relative rounded-tl-[120px] sm:rounded-tl-[150px] rounded-tr-3xl rounded-b-3xl overflow-hidden shadow-[0_12px_36px_rgba(41,38,36,0.08)] border border-[#E7E0DA] bg-white group">
                <img
                  src="/images/craftsmanship.png"
                  alt="Artisan jeweler delicately setting gemstones onto gold filigree jewellery"
                  className="w-full h-[380px] sm:h-[490px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />
                
                {/* Floating Glass Studio Tag */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E7E0DA] flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-[#A783A2] font-semibold block">Headquartered in Hyderabad</span>
                    <span className="font-cormorant text-[16px] sm:text-[17px] text-[#292624] font-medium leading-snug">Dispatched in 2–4 Business Days • Pan-India Delivery</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-[#A783A2] shrink-0" />
                </div>
              </div>

              {/* Floating Mini Accent Badge */}
              <div className="absolute -bottom-5 -right-2 sm:-right-4 hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#E7E0DA] shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#6E8B62]" />
                <span className="text-[11px] font-sans font-medium text-[#292624] tracking-wider uppercase">100% Skin-Safe & Hypoallergenic</span>
              </div>
            </div>
          </div>

          {/* Right Column: Exact Client Story & Founder's Letter */}
          <div className="lg:col-span-6 space-y-5 lg:pl-2">
            <div className="flex items-center space-x-2 text-[#A783A2]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">Our Story</span>
            </div>

            <h2 className="font-cormorant font-normal text-[30px] sm:text-[40px] text-[#292624] leading-[1.12] tracking-[0.01em]">
              The Brand Story &amp; Founder
            </h2>

            <div className="space-y-3.5 text-[14px] sm:text-[15px] text-[#5C5855] leading-relaxed font-sans">
              <p>
                Rass was born out of my love for jewellery, fashion and the richness of Indian culture.
              </p>
              <p>
                Inspired by the beauty of traditions, timeless artistry and the little details that make every piece special, I wanted to create a space where culture meets contemporary expression.
              </p>
              <p>
                To me, jewellery is more than just an accessory. It's an emotion, a form of self-expression and a beautiful way of celebrating individuality.
              </p>
              <p>
                Through Rass, I hope to bring together the charm of tradition and the beauty of modern aesthetics, creating pieces that tell a story and make every moment feel special.
              </p>
              <p className="font-medium text-[#292624]">
                A reflection of my passion, my creativity and my love for all things beautiful.
              </p>
              <p className="font-cormorant text-[19px] sm:text-[21px] text-[#8E6789] italic font-semibold pt-1">
                RASS — An expression of culture, crafted with love.
              </p>
            </div>

            {/* Founder Ridhima's Stationery Letter */}
            <div className="p-6 sm:p-7 bg-white rounded-2xl border border-[#E7E0DA] relative shadow-2xs overflow-hidden">
              {/* Subtle Lotus Emblem Watermark */}
              <div className="absolute -right-6 -bottom-6 pointer-events-none opacity-10 select-none">
                <img
                  src="/elements/Mauve Layered Lotus Emblem.png"
                  alt=""
                  className="w-36 h-36 object-contain"
                />
              </div>

              <div className="flex items-center justify-between mb-3 text-[#8B5E86]">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A783A2]">The Founder Note</span>
                <span className="text-[#B49A6C] text-xs">✦</span>
              </div>

              <div className="space-y-3 text-[13.5px] sm:text-[14.5px] text-[#5C5855] leading-relaxed font-sans">
                <p>
                  Rass by Ridhima was born out of Ridhima’s love for jewellery and her belief that the right piece can make a woman feel beautiful, confident and effortlessly elegant. She wanted to create a brand that brings together traditional Indian craftsmanship, contemporary designs and everyday wearability.
                </p>
                <p>
                  Her personal philosophy is simple: Jewellery is not just an accessory; it is an expression of who you are. It should make you feel confident, special and connected to your personal style. Through Rass by Ridhima, she hopes to make every woman feel that a little piece of jewellery can carry a lot of beauty, personality and emotion.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#E7E0DA]">
                <div>
                  <span className="font-cormorant text-lg text-[#292624] font-medium block leading-none">— Ridhima</span>
                  <span className="text-[11px] text-[#8C827A] font-sans mt-0.5 block">Founder, Rass by Ridhima</span>
                </div>
                <span className="text-xs text-[#A783A2] font-serif italic">Crafted with love ♡</span>
              </div>
            </div>

            {/* Direct CTA */}
            <div className="pt-2">
              <button
                onClick={onExploreShop}
                className="inline-flex items-center space-x-2.5 px-8 py-3.5 rounded-full bg-[#292624] hover:bg-black text-white text-[11.5px] font-medium tracking-[0.16em] uppercase transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-98 cursor-pointer"
              >
                <span>Explore Curated Collections</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 3. FOUR EDITORIAL HERITAGE PILLARS */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="text-[10.5px] uppercase tracking-[0.24em] text-[#A783A2] font-semibold block mb-1">
            HERITAGE & ARTISAN PROVENANCE
          </span>
          <h2 className="font-cormorant font-normal text-[28px] sm:text-[38px] text-[#292624] leading-tight">
            Craftsmanship Rooted in Mastery
          </h2>
          <p className="text-xs sm:text-sm text-[#77716F] mt-1 font-sans">
            Bridging master Indian craftsmanship clusters with durable modern metallurgy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 01 */}
          <div className="p-6 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs hover:shadow-subtle transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-full bg-[#FAF5F9] border border-[#E2D5E5] flex items-center justify-center text-[#A783A2] group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold block">Craftsmanship Clusters</span>
              <h3 className="font-cormorant font-medium text-[20px] text-[#292624] leading-snug mt-0.5">Generational Karigari</h3>
            </div>
            <p className="text-xs text-[#6B6562] leading-relaxed font-sans">
              Handcrafted by generational artisans (karigars), designed exclusively in-house, and curated from master craftsmanship clusters across Jaipur, Rajkot, and Bengal.
            </p>
            <div className="text-[10.5px] text-[#A783A2] font-medium pt-1">
              ✦ Handcrafted with Love
            </div>
          </div>

          {/* Pillar 02 */}
          <div className="p-6 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs hover:shadow-subtle transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-full bg-[#FBF8F2] border border-[#EDE4D4] flex items-center justify-center text-[#B49A6C] group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#B49A6C] font-semibold block">Micro Gold Polish & E-Coating</span>
              <h3 className="font-cormorant font-medium text-[20px] text-[#292624] leading-snug mt-0.5">Noble Metallurgy</h3>
            </div>
            <p className="text-xs text-[#6B6562] leading-relaxed font-sans">
              Solid brass with micro gold plating, 925 sterling silver, 18k gold vermeil, and anti-tarnish stainless steel (everyday waterproof) finished with anti-tarnish e-coating.
            </p>
            <div className="text-[10.5px] text-[#B49A6C] font-medium pt-1">
              ✦ Anti-Tarnish Finish
            </div>
          </div>

          {/* Pillar 03 */}
          <div className="p-6 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs hover:shadow-subtle transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-full bg-[#F3F7F1] border border-[#D9E4D6] flex items-center justify-center text-[#6E8B62] group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#6E8B62] font-semibold block">Nickel-Free & Lead-Free</span>
              <h3 className="font-cormorant font-medium text-[20px] text-[#292624] leading-snug mt-0.5">100% Skin-Safe</h3>
            </div>
            <p className="text-xs text-[#6B6562] leading-relaxed font-sans">
              100% skin-safe &amp; hypoallergenic. Crafted without nickel or lead, so you can wear every piece comfortably all day.
            </p>
            <div className="text-[10.5px] text-[#6E8B62] font-medium pt-1">
              ✦ Hypoallergenic Comfort
            </div>
          </div>

          {/* Pillar 04 */}
          <div className="p-6 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs hover:shadow-subtle transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-full bg-[#FAF5F9] border border-[#E2D5E5] flex items-center justify-center text-[#865A80] group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#865A80] font-semibold block">Headquartered in Hyderabad</span>
              <h3 className="font-cormorant font-medium text-[20px] text-[#292624] leading-snug mt-0.5">Pan-India Delivery</h3>
            </div>
            <p className="text-xs text-[#6B6562] leading-relaxed font-sans">
              Dispatched within 24 to 48 business hours (2 to 4 business days). Free shipping above ₹3,999 (below that ₹250 for orders). Pan-India only for now.
            </p>
            <div className="text-[10.5px] text-[#865A80] font-medium pt-1">
              ✦ Secure Prepaid Delivery
            </div>
          </div>
        </div>
      </div>

      {/* 4. MATERIALS, CARE & SIZING */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-14 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#A783A2] font-semibold block mb-1">
            MATERIALS, CARE &amp; SIZING
          </span>
          <h2 className="font-cormorant font-normal text-[28px] sm:text-[36px] text-[#292624] leading-tight">
            Materials, Care &amp; Size Guide
          </h2>
          <p className="text-xs sm:text-sm text-[#77716F] mt-1 font-sans">
            Transparent insights into our cluster origins, care rituals, and jewellery sizing.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('craft')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
              activeTab === 'craft'
                ? 'bg-[#292624] text-white shadow-sm'
                : 'bg-white border border-[#E7E0DA] text-[#6B6562] hover:text-[#292624] hover:border-[#A783A2]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Materials & Metallurgy</span>
          </button>

          <button
            onClick={() => setActiveTab('care')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
              activeTab === 'care'
                ? 'bg-[#292624] text-white shadow-sm'
                : 'bg-white border border-[#E7E0DA] text-[#6B6562] hover:text-[#292624] hover:border-[#A783A2]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>4 Golden Care Rituals</span>
          </button>

          <button
            onClick={() => setActiveTab('sizing')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
              activeTab === 'sizing'
                ? 'bg-[#292624] text-white shadow-sm'
                : 'bg-white border border-[#E7E0DA] text-[#6B6562] hover:text-[#292624] hover:border-[#A783A2]'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Sizing & Fitting Guide</span>
          </button>
        </div>

        {/* TAB 1: CRAFT & NOBLE MATERIALS */}
        {activeTab === 'craft' && (
          <div className="bg-white rounded-3xl border border-[#E7E0DA] p-6 sm:p-10 shadow-2xs space-y-8 animate-fadeIn">
            <div className="border-b border-[#E7E0DA] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold block mb-1">Regional Specialization</span>
                <h3 className="font-cormorant font-normal text-[24px] sm:text-[30px] text-[#292624]">The Craftsmanship Clusters</h3>
              </div>
              <span className="text-[11px] text-[#8C827A] bg-[#FAF8F5] px-3.5 py-1 rounded-full border border-[#E7E0DA] font-medium">
                Jaipur • Rajkot • Bengal
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-3">
                <div className="w-9 h-9 rounded-full bg-white border border-[#E7E0DA] flex items-center justify-center text-[#B49A6C]">
                  <Gem className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#B49A6C] font-semibold block">Jaipur, Rajasthan</span>
                  <h4 className="font-cormorant font-medium text-lg text-[#292624]">Jaipur Kundan & Stones</h4>
                </div>
                <p className="text-xs text-[#5C5855] leading-relaxed font-sans">
                  World-renowned for delicate kundan setting, vibrant meenakari reverse enameling, and uncut gemstone curation including untreated pearls and quartz.
                </p>
              </div>

              <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-3">
                <div className="w-9 h-9 rounded-full bg-white border border-[#E7E0DA] flex items-center justify-center text-[#A783A2]">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold block">Rajkot, Gujarat</span>
                  <h4 className="font-cormorant font-medium text-lg text-[#292624]">Rajkot Precision Metalwork</h4>
                </div>
                <p className="text-xs text-[#5C5855] leading-relaxed font-sans">
                  Celebrated for exceptional precision casting, hand-engraved kadas, seamless bangle closures, and authentic micro gold dipping techniques.
                </p>
              </div>

              <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-3">
                <div className="w-9 h-9 rounded-full bg-white border border-[#E7E0DA] flex items-center justify-center text-[#6E8B62]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#6E8B62] font-semibold block">Bengal Cluster</span>
                  <h4 className="font-cormorant font-medium text-lg text-[#292624]">Bengal Fine Filigree (Rupa)</h4>
                </div>
                <p className="text-xs text-[#5C5855] leading-relaxed font-sans">
                  Centuries-old hereditary mastery of gossamer wirework, openwork jali domes, and delicate hanging jhumka bells with featherweight balance.
                </p>
              </div>
            </div>

            {/* Layered Metallurgy Anatomy */}
            <div className="p-6 bg-[#FAF5F9] rounded-2xl border border-[#A783A2]/25">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8E6789] font-semibold block mb-2">Anatomy of a Rass Heirloom</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-white/80 rounded-xl border border-[#E7E0DA]">
                  <span className="text-xs font-semibold text-[#292624] block">1. Solid Base</span>
                  <span className="text-[11px] text-[#77716F]">Premium non-recycled brass</span>
                </div>
                <div className="p-3 bg-white/80 rounded-xl border border-[#E7E0DA]">
                  <span className="text-xs font-semibold text-[#292624] block">2. Gold Dipping</span>
                  <span className="text-[11px] text-[#77716F]">18k/24k micro gold vermeil</span>
                </div>
                <div className="p-3 bg-white/80 rounded-xl border border-[#E7E0DA]">
                  <span className="text-xs font-semibold text-[#292624] block">3. Ceramic E-Shield</span>
                  <span className="text-[11px] text-[#77716F]">Anti-tarnish polymer coating</span>
                </div>
                <div className="p-3 bg-white/80 rounded-xl border border-[#E7E0DA]">
                  <span className="text-xs font-semibold text-[#292624] block">4. Hypoallergenic Seal</span>
                  <span className="text-[11px] text-[#77716F]">100% skin-safe & nickel-free</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: A LITTLE LOVE & CARE */}
        {activeTab === 'care' && (
          <div className="bg-white rounded-3xl border border-[#E7E0DA] p-6 sm:p-10 shadow-2xs space-y-6 animate-fadeIn">
            <div className="border-b border-[#E7E0DA] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold block mb-1">Rass by Ridhima</span>
                <h3 className="font-cormorant font-normal text-[24px] sm:text-[30px] text-[#292624]">A Little Love &amp; Care for Your Jewellery ♡</h3>
              </div>
              <span className="text-[11px] text-[#8C827A] bg-[#FAF8F5] px-3.5 py-1 rounded-full border border-[#E7E0DA] font-medium">
                Keep Beautiful for Longer
              </span>
            </div>

            <p className="text-[14px] sm:text-[15.5px] text-[#5C5855] leading-relaxed font-sans max-w-2xl font-normal">
              Your jewellery is special, and with a little care, you can keep it beautiful for longer.
            </p>

            <div className="space-y-3 max-w-2xl">
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E0DA] flex items-start gap-3">
                <span className="text-base select-none shrink-0 leading-none mt-0.5">✨</span>
                <p className="text-xs sm:text-sm text-[#292624] font-medium leading-relaxed">
                  Keep away from water, perfumes and lotions .
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E0DA] flex items-start gap-3">
                <span className="text-base select-none shrink-0 leading-none mt-0.5">✨</span>
                <p className="text-xs sm:text-sm text-[#292624] font-medium leading-relaxed">
                  Store each piece separately in a jewellery pouch or airtight box to prevent scratches and tangling.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E0DA] flex items-start gap-3">
                <span className="text-base select-none shrink-0 leading-none mt-0.5">✨</span>
                <p className="text-xs sm:text-sm text-[#292624] font-medium leading-relaxed">
                  Keep away from direct sunlight, moisture and humidity.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E0DA] flex items-start gap-3">
                <span className="text-base select-none shrink-0 leading-none mt-0.5">✨</span>
                <p className="text-xs sm:text-sm text-[#292624] font-medium leading-relaxed">
                  Clean gently with a soft, dry cloth after every use.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E0DA] flex items-start gap-3">
                <span className="text-base select-none shrink-0 leading-none mt-0.5">✨</span>
                <p className="text-xs sm:text-sm text-[#292624] font-medium leading-relaxed">
                  Handle delicate pieces with love and care.
                </p>
              </div>
            </div>

            <div className="p-6 bg-[#FAF5F9] rounded-2xl border border-[#A783A2]/25 max-w-2xl text-center space-y-2">
              <p className="font-cormorant text-[17px] sm:text-[19px] text-[#8B5E86] italic leading-relaxed font-normal">
                “A little reminder: Jewellery is made to make you shine. Treat every piece with love, and it will remain a beautiful part of your story.”
              </p>
              <div className="text-xs font-sans text-[#A783A2] font-semibold pt-1">
                With love,<br />
                Team Rass by Ridhima ♡
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SIZING & FITTING GUIDE */}
        {activeTab === 'sizing' && (
          <div className="bg-white rounded-3xl border border-[#E7E0DA] p-6 sm:p-10 shadow-2xs space-y-6 animate-fadeIn">
            <div className="border-b border-[#E7E0DA] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold block mb-1">Rass by Ridhima</span>
                <h3 className="font-cormorant font-normal text-[24px] sm:text-[30px] text-[#292624]">Jewellery Sizing Guide</h3>
              </div>
              <span className="text-[11px] text-[#8C827A] bg-[#FAF8F5] px-3.5 py-1 rounded-full border border-[#E7E0DA] font-medium">
                Standard Indian Fit
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E0DA]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm text-[#292624]">Ring Sizing</span>
                      <span className="text-[11px] text-[#A783A2] font-semibold uppercase tracking-wider">Free-Size &amp; Fixed</span>
                    </div>
                    <ul className="text-xs text-[#5C5855] font-sans space-y-1 list-disc list-inside">
                      <li>Mostly adjustable / free-size comfort bands</li>
                      <li>Standard Indian sizes (Size 10 to 20)</li>
                      <li>Mix of both adjustable and fixed sizes</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E0DA]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm text-[#292624]">Bangle &amp; Kada Sizing</span>
                      <span className="text-[11px] text-[#A783A2] font-semibold uppercase tracking-wider">All Standard Sizes</span>
                    </div>
                    <ul className="text-xs text-[#5C5855] font-sans space-y-1 list-disc list-inside">
                      <li>Standard Indian sizes: 2.4, 2.6, 2.8</li>
                      <li>Openable screw/hinge mechanism (fits most wrists)</li>
                      <li>Adjustable pull-cord / chain</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Concierge Direct Box */}
              <div className="p-6 sm:p-7 bg-[#FAF5F9] rounded-2xl border border-[#A783A2]/25 text-center space-y-3.5">
                <div className="w-12 h-12 rounded-full bg-white border border-[#E7E0DA] flex items-center justify-center text-[#A783A2] mx-auto shadow-2xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-cormorant font-medium text-[22px] text-[#292624]">Customer Care</h4>
                  <p className="text-xs text-[#77716F] max-w-xs mx-auto leading-relaxed mt-1 font-sans">
                    Need help with ring or kada sizing? Send us an email and we will be delighted to guide you.
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href="mailto:Rassbyridhima@gmail.com?subject=Sizing%20Guidance"
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#A783A2] hover:bg-[#936E8F] text-white text-[11px] font-semibold tracking-[0.14em] uppercase transition-all shadow-xs cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email: Rassbyridhima@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 5. STATELY LUXURY TRUST STRIP */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 my-6 sm:my-10">
        <div className="py-4 sm:py-5 px-6 sm:px-8 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs flex flex-wrap items-center justify-around gap-4 text-xs text-[#5C5855] font-sans">
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-[#A783A2]" />
            <span className="font-medium text-[#292624]">Free Shipping Pan-India Above ₹3,999 (Flat ₹250 Below)</span>
          </div>
          <span className="hidden lg:inline text-[#E7E0DA]">•</span>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#A783A2]" />
            <span className="font-medium text-[#292624]">Exchange / Store Credit within 48 Hours</span>
          </div>
          <span className="hidden lg:inline text-[#E7E0DA]">•</span>
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#A783A2]" />
            <span className="font-medium text-[#292624]">Prepaid Only via Razorpay • Pan-India</span>
          </div>
          <span className="hidden lg:inline text-[#E7E0DA]">•</span>
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-[#A783A2]" />
            <span className="font-medium text-[#292624]">Rassbyridhima@gmail.com</span>
          </div>
        </div>
      </div>

      {/* 6. NEWSLETTER BAND */}
      <NewsletterSection />

    </div>
  );
};
