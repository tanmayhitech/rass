import React, { useState } from 'react';
import { Instagram, Facebook, MessageCircle, ChevronDown } from 'lucide-react';
import { ActivePage, ProductCategory, InfoSection } from '../types';

interface SiteFooterProps {
  onNavClick: (page: ActivePage) => void;
  onCategoryClick: (category: ProductCategory) => void;
  onPolicyClick: (policy: InfoSection) => void;
  onReplayIntro?: () => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  onNavClick,
  onCategoryClick,
  onPolicyClick,
  onReplayIntro,
}) => {
  // Mobile accordion state (Shop is open by default for immediate discovery)
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    shop: true,
    about: false,
    help: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <footer className="w-full bg-[#FAF8F5] text-[#292624] pt-10 sm:pt-16 pb-10 sm:pb-14 md:pb-12 relative overflow-hidden">
      
      {/* Decorative Botanical Sprigs in Bottom Corners (matching reference) */}
      <div className="absolute left-0 bottom-0 pointer-events-none opacity-25 sm:opacity-45 select-none" aria-hidden="true">
        <img
          src="/elements/Mauve Botanical Sprig Line Art.png"
          alt=""
          className="w-16 sm:w-24 lg:w-28 h-auto object-contain object-bottom-left"
        />
      </div>

      <div className="absolute right-0 bottom-0 pointer-events-none opacity-25 sm:opacity-45 select-none -scale-x-100" aria-hidden="true">
        <img
          src="/elements/Mauve Botanical Sprig Line Art.png"
          alt=""
          className="w-16 sm:w-24 lg:w-28 h-auto object-contain object-bottom-right"
        />
      </div>

      {/* Main Footer Container */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* 5-Zone Footer Layout with Vertical Dividers (matching reference) */}
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-0 mb-10 sm:mb-16">
          
          {/* Column 1: Brand Info & Socials */}
          <div className="lg:w-[32%] lg:pr-8 xl:pr-10 flex flex-col justify-between">
            <div>
              <div className="mb-3.5 sm:mb-4">
                <button
                  onClick={() => {
                    onNavClick('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left cursor-pointer focus:outline-none"
                  aria-label="Rass by Riddhima - Go to Homepage"
                >
                  <img
                    src="/images/Rass by Ridhima Wordmark.png"
                    alt="Rass by Riddhima"
                    className="h-9 sm:h-12 w-auto object-contain mb-3 select-none"
                  />
                </button>
              </div>

              <p className="font-sans text-[13px] sm:text-[14px] font-medium text-[#5C5855] leading-[1.6] max-w-[280px] mb-5 sm:mb-6">
                Premium oxidized & fashion jewelry. Curated pieces for the Modern Muse. Based in Hyderabad, shipping Pan-India.
              </p>
            </div>

            {/* Social Icons: Solid Mauve Circles (matching reference) */}
            <div className="flex items-center space-x-3 pt-1">
              <a
                href="https://instagram.com/rassbyridhima"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#A783A2] hover:bg-[#936E8F] text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105 active:scale-95"
                aria-label="Follow Rass by Ridhima on Instagram"
              >
                <Instagram className="w-4 h-4 stroke-[2]" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#A783A2] hover:bg-[#936E8F] text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105 active:scale-95"
                aria-label="Follow Rass by Ridhima on Pinterest"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.365-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.546.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#A783A2] hover:bg-[#936E8F] text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105 active:scale-95"
                aria-label="Connect with Rass on Facebook"
              >
                <Facebook className="w-4 h-4 fill-white stroke-none" />
              </a>
              <a
                href="https://wa.me/919819733572"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#A783A2] hover:bg-[#936E8F] text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105 active:scale-95"
                aria-label="Chat on WhatsApp concierge"
              >
                <MessageCircle className="w-4 h-4 stroke-[2]" />
              </a>
            </div>
          </div>

          {/* Thin Vertical Divider 1 */}
          <div className="hidden lg:block w-[1px] bg-[#292624]/15 shrink-0 self-stretch my-1" />

          {/* Middle 3 Columns: Shop, About, Help */}
          {/* DESKTOP VIEW: 3 crisp parallel columns */}
          <div className="hidden sm:grid sm:grid-cols-3 lg:w-[42%] gap-x-6 sm:gap-x-8 lg:px-8 xl:px-10">
            {/* Column 2: Shop */}
            <div>
              <h3 className="font-sans font-extrabold text-[14.5px] sm:text-[15px] text-[#1A1817] tracking-tight mb-4 sm:mb-5">
                Shop
              </h3>
              <ul className="space-y-3 sm:space-y-3.5 text-[13.5px] sm:text-[14px] font-medium text-[#5C5855]">
                <li>
                  <button 
                    onClick={() => {
                      onNavClick('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    All Products
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onCategoryClick('rings')} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    Rings
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onCategoryClick('jhumka')} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    Jhumka
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onCategoryClick('earrings')} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    Earrings
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onCategoryClick('necklaces')} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    Necklaces
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onCategoryClick('bracelets')} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    Bracelets
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onCategoryClick('kangan-sets')} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    Kangan Sets
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: About */}
            <div>
              <h3 className="font-sans font-extrabold text-[14.5px] sm:text-[15px] text-[#1A1817] tracking-tight mb-4 sm:mb-5">
                About
              </h3>
              <ul className="space-y-3 sm:space-y-3.5 text-[13.5px] sm:text-[14px] font-medium text-[#5C5855]">
                <li>
                  <button 
                    onClick={() => onPolicyClick('story')} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    Our Story
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onPolicyClick('materials')} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    Materials
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onPolicyClick('care')} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    Care Guide
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onPolicyClick('sizing')} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    Size Guide
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onPolicyClick('faqs')} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    FAQs
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onPolicyClick('contact')} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    Contact Concierge
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Help */}
            <div>
              <h3 className="font-sans font-extrabold text-[14.5px] sm:text-[15px] text-[#1A1817] tracking-tight mb-4 sm:mb-5">
                Help
              </h3>
              <ul className="space-y-3 sm:space-y-3.5 text-[13.5px] sm:text-[14px] font-medium text-[#5C5855]">
                <li>
                  <button 
                    onClick={() => onPolicyClick('shipping')} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    Shipping Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onPolicyClick('returns')} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    Return & Exchange
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onPolicyClick('privacy')} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onPolicyClick('terms')} 
                    className="hover:text-[#A783A2] transition-colors text-left cursor-pointer"
                  >
                    Terms & Conditions
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* MOBILE ACCORDION VIEW: Clean, luxury collapsible panels for phone screens (< 640px) */}
          <div className="sm:hidden flex flex-col divide-y divide-[#E7E0DA] border-y border-[#E7E0DA]">
            {/* Accordion 1: Shop */}
            <div className="py-1">
              <button
                onClick={() => toggleSection('shop')}
                className="w-full py-3.5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                aria-expanded={openSections.shop}
              >
                <span className="font-sans font-extrabold text-[14px] text-[#1A1817] tracking-wide">
                  Shop
                </span>
                <ChevronDown className={`w-4 h-4 text-[#77716F] transition-transform duration-300 ${openSections.shop ? 'rotate-180 text-[#A783A2]' : ''}`} />
              </button>
              {openSections.shop && (
                <ul className="pb-3 pt-0.5 space-y-2.5 text-[13.5px] font-medium text-[#5C5855]">
                  <li>
                    <button 
                      onClick={() => {
                        onNavClick('shop');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      All Products
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onCategoryClick('rings')} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      Rings
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onCategoryClick('jhumka')} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      Jhumka
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onCategoryClick('earrings')} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      Earrings
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onCategoryClick('necklaces')} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      Necklaces
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onCategoryClick('bracelets')} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      Bracelets
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onCategoryClick('kangan-sets')} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      Kangan Sets
                    </button>
                  </li>
                </ul>
              )}
            </div>

            {/* Accordion 2: About */}
            <div className="py-1">
              <button
                onClick={() => toggleSection('about')}
                className="w-full py-3.5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                aria-expanded={openSections.about}
              >
                <span className="font-sans font-extrabold text-[14px] text-[#1A1817] tracking-wide">
                  About
                </span>
                <ChevronDown className={`w-4 h-4 text-[#77716F] transition-transform duration-300 ${openSections.about ? 'rotate-180 text-[#A783A2]' : ''}`} />
              </button>
              {openSections.about && (
                <ul className="pb-3 pt-0.5 space-y-2.5 text-[13.5px] font-medium text-[#5C5855]">
                  <li>
                    <button 
                      onClick={() => onPolicyClick('story')} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      Our Story
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onPolicyClick('materials')} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      Materials & Craft
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onPolicyClick('care')} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      Jewellery Care Guide
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onPolicyClick('sizing')} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      Size Guide
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onPolicyClick('faqs')} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      Frequently Asked Questions
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onPolicyClick('contact')} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      Contact Concierge
                    </button>
                  </li>
                </ul>
              )}
            </div>

            {/* Accordion 3: Help */}
            <div className="py-1">
              <button
                onClick={() => toggleSection('help')}
                className="w-full py-3.5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                aria-expanded={openSections.help}
              >
                <span className="font-sans font-extrabold text-[14px] text-[#1A1817] tracking-wide">
                  Help & Policies
                </span>
                <ChevronDown className={`w-4 h-4 text-[#77716F] transition-transform duration-300 ${openSections.help ? 'rotate-180 text-[#A783A2]' : ''}`} />
              </button>
              {openSections.help && (
                <ul className="pb-3 pt-0.5 space-y-2.5 text-[13.5px] font-medium text-[#5C5855]">
                  <li>
                    <button 
                      onClick={() => onPolicyClick('shipping')} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      Shipping & Delivery
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onPolicyClick('returns')} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      Returns & Exchange
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onPolicyClick('privacy')} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onPolicyClick('terms')} 
                      className="w-full text-left py-1 hover:text-[#A783A2] transition-colors"
                    >
                      Terms & Conditions
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Thin Vertical Divider 2 */}
          <div className="hidden lg:block w-[1px] bg-[#292624]/15 shrink-0 self-stretch my-1" />

          {/* Column 5: Right Open Text "Details that stay with you." (matching reference) */}
          <div className="lg:w-[26%] flex flex-col items-center justify-center text-center pt-2 sm:pt-10 lg:pt-0 lg:pl-8 xl:pl-10">
            {/* Lotus Motif */}
            <div className="mb-2 sm:mb-3">
              <img
                src="/elements/Mauve Layered Lotus Emblem.png"
                alt=""
                className="w-10 sm:w-12 h-auto object-contain mx-auto"
              />
            </div>

            <p className="font-playfair font-medium text-[22px] sm:text-[26px] lg:text-[28px] leading-[1.2] text-[#1A1817] mb-2.5">
              Details<br />that stay with you.
            </p>

            <span className="text-[#A783A2] text-xs">✦</span>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Symmetrical Lotus Divider, & Made in India */}
        <div className="relative pt-6 sm:pt-8 border-t border-[#E7E0DA]/80 flex flex-col md:flex-row items-center justify-between text-[11.5px] sm:text-[12.5px] font-medium text-[#5C5855] gap-3 sm:gap-4 md:gap-0">
          <div className="text-center md:text-left order-2 md:order-1 flex items-center justify-center md:justify-start gap-2 sm:gap-2.5 flex-wrap">
            <span>© 2026 Rass by Ridhima. All rights reserved.</span>
            {onReplayIntro && (
              <>
                <span className="text-[#D6CDC5] hidden sm:inline">•</span>
                <button
                  onClick={onReplayIntro}
                  className="text-[#8C827A] hover:text-[#A783A2] transition-colors cursor-pointer text-[11px] underline underline-offset-2"
                  title="Replay Welcome Animation"
                >
                  Replay Intro
                </button>
              </>
            )}
          </div>

          <div className="w-auto flex items-center justify-center pointer-events-none select-none px-4 order-1 md:order-2" aria-hidden="true">
            <img 
              src="/elements/Elegant Mauve Lotus Ornamental Divider.png" 
              alt="" 
              className="w-36 sm:w-48 md:w-56 lg:w-64 h-auto object-contain"
            />
          </div>

          <div className="flex items-center space-x-1.5 font-medium text-[11.5px] sm:text-[13px] text-center md:text-right order-3">
            <span>Made with love in India</span>
            <span className="text-[#A783A2]">♡</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
