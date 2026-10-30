import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronRight } from 'lucide-react';
import { ActivePage, ProductCategory } from '../types';

interface SiteHeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onSelectCategory?: (category: ProductCategory | 'all') => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  activePage,
  setActivePage,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAccount,
  onSelectCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredPage, setHoveredPage] = useState<ActivePage | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track window scroll for luxury glassmorphic header morph
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems: { label: string; page: ActivePage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'About', page: 'about' },
    { label: 'Help', page: 'help' },
  ];

  const categories: { label: string; value: ProductCategory }[] = [
    { label: 'Rings', value: 'rings' },
    { label: 'Jhumka', value: 'jhumka' },
    { label: 'Necklaces', value: 'necklaces' },
    { label: 'Earrings', value: 'earrings' },
    { label: 'Kangan Sets', value: 'kangan-sets' },
    { label: 'Bracelets', value: 'bracelets' },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setHoveredPage(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (category: ProductCategory) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-30 transition-all duration-500 ease-out select-none ${
          isScrolled 
            ? 'bg-[#FAF8F3]/90 backdrop-blur-md shadow-xs border-b border-[#E7E0DA]/80' 
            : 'bg-[#FAF8F3]/98 backdrop-blur-none border-b border-transparent'
        }`}
      >
        {/* DESKTOP & MOBILE MAIN NAVIGATION ROW */}
        {/* Height: compresses from ~92px down to ~74px on scroll */}
        <div className={`max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between transition-all duration-500 ease-out ${
          isScrolled ? 'h-14 md:h-[74px]' : 'h-16 md:h-[92px]'
        }`}>
          
          {/* ZONE 1 (LEFT): BRAND LOGO */}
          <div className="flex-1 flex items-center justify-start">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left group focus:outline-none outline-none border-none py-1.5 transition-all duration-200 flex items-center"
              aria-label="Rass by Riddhima - Go to Homepage"
            >
              <img
                src="/images/Rass by Ridhima Wordmark.png"
                alt="Rass by Riddhima"
                className="h-6 sm:h-7 md:h-8 lg:h-[34px] w-auto object-contain transition-opacity duration-200 group-hover:opacity-85 select-none"
              />
            </button>
          </div>

          {/* ZONE 2 (CENTER): DESKTOP NAVIGATION LINKS (TRULY GEOMETRICALLY CENTERED) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex flex-shrink-0 items-center justify-center gap-8 lg:gap-11 select-none"
            onMouseLeave={() => setHoveredPage(null)}
          >
            {navItems.map((item) => {
              const isCurrent = activePage === item.page;
              const isTargeted = (hoveredPage ?? activePage) === item.page;

              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  onMouseEnter={() => setHoveredPage(item.page)}
                  className="group relative py-2.5 px-1.5 text-[14.5px] lg:text-[15px] font-medium tracking-[0.01em] text-[#292725] focus:outline-none outline-none border-none ring-0 select-none transition-colors duration-200"
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  <span
                    className={`transition-colors duration-200 ${
                      isTargeted ? 'text-[#A18AA5]' : 'text-[#292725] group-hover:text-[#A18AA5]'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* ACTIVE INDICATOR: TINY DUSTY-LAVENDER SPARKLE (✦) */}
                  <span
                    className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 pointer-events-none select-none transition-all duration-200 text-[#A18AA5] ${
                      isCurrent
                        ? 'opacity-100 scale-100 translate-y-0'
                        : isTargeted
                        ? 'opacity-40 scale-75 translate-y-0.5'
                        : 'opacity-0 scale-50 translate-y-1'
                    }`}
                    aria-hidden="true"
                  >
                    {/* SVG 4-Pointed Sparkle in Dusty Lavender #A18AA5 */}
                    <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0 C8 4.2 9 7 16 8 C9 9 8 11.8 8 16 C8 11.8 7 9 0 8 C7 7 8 4.2 8 0 Z" />
                    </svg>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* ZONE 3 (RIGHT): CLEAN LINE ACTION ICONS */}
          <div className="flex-1 flex items-center justify-end space-x-0.5 sm:space-x-1.5 md:space-x-3 text-[#292725]">
            
            {/* Search Icon */}
            <button
              onClick={onOpenSearch}
              className="p-1.5 sm:p-2 md:p-2.5 min-w-[38px] sm:min-w-[44px] min-h-[38px] sm:min-h-[44px] flex items-center justify-center text-[#292725] hover:text-[#A18AA5] hover:bg-[#FAF8F3] rounded-full transition-colors duration-200 focus:outline-none outline-none border-none ring-0 cursor-pointer"
              aria-label="Search handcrafted heirlooms"
              title="Search"
            >
              <Search className="w-5 h-5 stroke-[1.65]" />
            </button>

            {/* Account Icon (Desktop) */}
            <button
              onClick={onOpenAccount}
              className="hidden sm:flex p-1.5 sm:p-2 md:p-2.5 min-w-[38px] sm:min-w-[44px] min-h-[38px] sm:min-h-[44px] items-center justify-center text-[#292725] hover:text-[#A18AA5] hover:bg-[#FAF8F3] rounded-full transition-colors duration-200 focus:outline-none outline-none border-none ring-0 cursor-pointer"
              aria-label="Customer Account & Orders"
              title="Account"
            >
              <User className="w-5 h-5 stroke-[1.65]" />
            </button>

            {/* Wishlist Icon with subtle badge */}
            <button
              onClick={onOpenWishlist}
              className="p-1.5 sm:p-2 md:p-2.5 min-w-[38px] sm:min-w-[44px] min-h-[38px] sm:min-h-[44px] flex items-center justify-center text-[#292725] hover:text-[#A18AA5] hover:bg-[#FAF8F3] rounded-full transition-colors duration-200 focus:outline-none outline-none border-none ring-0 relative cursor-pointer"
              aria-label={`Wishlist, ${wishlistCount} saved items`}
              title="Wishlist"
            >
              <div className="relative">
                <Heart className="w-5 h-5 stroke-[1.65]" />
                {wishlistCount > 0 && (
                  <span 
                    key={wishlistCount}
                    className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#A18AA5] text-white text-[9px] font-semibold flex items-center justify-center ring-2 ring-[#FAF8F3] animate-badge-pop"
                  >
                    {wishlistCount}
                  </span>
                )}
              </div>
            </button>

            {/* Shopping Bag Icon with Dusty-Lavender Badge */}
            <button
              onClick={onOpenCart}
              className="p-1.5 sm:p-2 md:p-2.5 min-w-[38px] sm:min-w-[44px] min-h-[38px] sm:min-h-[44px] flex items-center justify-center text-[#292725] hover:text-[#A18AA5] hover:bg-[#FAF8F3] rounded-full transition-colors duration-200 focus:outline-none outline-none border-none ring-0 relative cursor-pointer"
              aria-label={`Shopping Bag, ${cartCount} items in cart`}
              title="Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[1.65]" />
                <span 
                  key={cartCount}
                  className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-[#A18AA5] text-white text-[9.5px] font-bold flex items-center justify-center leading-none ring-2 ring-[#FAF8F3] shadow-xs animate-badge-pop"
                >
                  {cartCount}
                </span>
              </div>
            </button>

            {/* Mobile Menu Trigger (Hamburger) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 sm:p-2 min-w-[38px] sm:min-w-[44px] min-h-[38px] sm:min-h-[44px] flex items-center justify-center text-[#292725] hover:text-[#A18AA5] focus:outline-none outline-none border-none ring-0 cursor-pointer ml-0.5"
              aria-label="Open mobile navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-6 h-6 stroke-[1.75]" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE / TABLET SLIDE-OVER DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-[#292725]/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#FAF8F3] shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-in-out border-l border-[#292725]/10">
            {/* Drawer Header */}
            <div className="h-16 px-5 flex items-center justify-between border-b border-[#292725]/10">
              <img
                src="/images/Rass by Ridhima Wordmark.png"
                alt="Rass by Riddhima"
                className="h-6 w-auto object-contain"
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#292725] hover:text-[#A18AA5] focus:outline-none outline-none rounded-full"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5 stroke-[1.8]" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-7">
              {/* Primary Navigation Links */}
              <nav aria-label="Mobile Navigation" className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#77736F] mb-2 px-2">
                  Navigation
                </p>
                {navItems.map((item) => {
                  const isCurrent = activePage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => handleNavClick(item.page)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-[15px] font-medium transition-all ${
                        isCurrent
                          ? 'text-[#A18AA5] bg-[#A18AA5]/10 font-semibold'
                          : 'text-[#292725] hover:bg-[#292725]/5'
                      }`}
                    >
                      <span className="flex items-center space-x-2.5">
                        {isCurrent && (
                          <svg width="8" height="8" viewBox="0 0 16 16" fill="#A18AA5" className="shrink-0">
                            <path d="M8 0 C8 4.2 9 7 16 8 C9 9 8 11.8 8 16 C8 11.8 7 9 0 8 C7 7 8 4.2 8 0 Z" />
                          </svg>
                        )}
                        <span>{item.label}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#77736F]/60" />
                    </button>
                  );
                })}
              </nav>

              {/* Jewellery Category Shortcuts */}
              <div className="space-y-1 border-t border-[#292725]/10 pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#77736F] mb-2 px-2">
                  Shop by Category
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategoryClick(cat.value)}
                      className="text-left px-3 py-2 text-[13.5px] text-[#292725] hover:text-[#A18AA5] hover:bg-[#292725]/5 rounded-md transition-colors"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Account & Care Links */}
              <div className="space-y-2 border-t border-[#292725]/10 pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#77736F] mb-2 px-2">
                  Account & Help
                </p>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAccount();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 text-[14px] text-[#292725] hover:text-[#A18AA5] hover:bg-[#292725]/5 rounded-lg transition-colors"
                >
                  <User className="w-4.5 h-4.5 stroke-[1.6]" />
                  <span>Account & Order History</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenWishlist();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-[14px] text-[#292725] hover:text-[#A18AA5] hover:bg-[#292725]/5 rounded-lg transition-colors"
                >
                  <span className="flex items-center space-x-3">
                    <Heart className="w-4.5 h-4.5 stroke-[1.6]" />
                    <span>Saved in Wishlist</span>
                  </span>
                  {wishlistCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#A18AA5] text-white text-[10px] font-semibold">
                      {wishlistCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCart();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-[14px] text-[#292725] hover:text-[#A18AA5] hover:bg-[#292725]/5 rounded-lg transition-colors"
                >
                  <span className="flex items-center space-x-3">
                    <ShoppingBag className="w-4.5 h-4.5 stroke-[1.6]" />
                    <span>Shopping Bag</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#A18AA5] text-white text-[10px] font-semibold">
                    {cartCount}
                  </span>
                </button>
              </div>
            </div>

            {/* Drawer Footer Tagline */}
            <div className="p-5 border-t border-[#292725]/10 bg-[#FAF8F3]">
              <p className="text-[11px] text-[#77736F] text-center tracking-wider flex items-center justify-center gap-1.5">
                <span>RASS BY RIDHIMA</span>
                <span className="text-[#A18AA5] text-[9px]">✦</span>
                <span>PREMIUM JEWELRY</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
