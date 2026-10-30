import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { SiteHeader } from './components/SiteHeader';
import { ToranDecoration } from './components/ToranDecoration';
import { CategoryGallery } from './components/CategoryGallery';
import { EditorialCraftsmanship } from './components/EditorialCraftsmanship';
import { EditorialEveryday } from './components/EditorialEveryday';
import { NewsletterSection } from './components/NewsletterSection';
import { SiteFooter } from './components/SiteFooter';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ShopView } from './components/ShopView';
import { AboutModal } from './components/AboutModal';
import { AboutView } from './components/AboutView';
import { HelpView, HelpTab } from './components/HelpView';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminErrorBoundary } from './components/AdminErrorBoundary';
import { AdminLogin } from './components/AdminLogin';
import { CartView } from './components/CartView';
import { EntrySplash } from './components/EntrySplash';
import { WelcomeOfferModal } from './components/WelcomeOfferModal';
import { PRODUCTS } from './data/products';
import { Product, CartItem, Order, ActivePage, ProductCategory, InfoSection, AdminUser } from './types';
import { storeService } from './services/storeService';
import { orderService } from './services/orderService';
import { authService } from './services/authService';

export const App: React.FC = () => {
  // Navigation State
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');

  // Admin Authentication State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => authService.getCurrentUser());
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => authService.isAuthenticated());

  useEffect(() => {
    const unsubscribe = authService.subscribe((user) => {
      setAdminUser(user);
      setIsAdminAuthenticated(Boolean(user));
    });
    return unsubscribe;
  }, []);

  // Products & Inventory State
  const [products, setProducts] = useState<Product[]>(() => storeService.getProducts());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart State (Initialized with 1 item for immediate delight)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rass_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      { product: PRODUCTS[0], quantity: 1 }
    ];
  });

  // Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('rass_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [PRODUCTS[1].id];
  });

  // Orders State (Stored in localStorage)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('rass_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: 'RASS-ORD-841920',
        customerName: 'Meera Singhania',
        email: 'meera.s@example.com',
        phone: '+91 98201 11223',
        shippingAddress: '42, Vasant Vihar, Poorvi Marg',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110057',
        items: [{ product: PRODUCTS[5], quantity: 1 }],
        subtotal: 38000,
        discount: 3800,
        shippingFee: 0,
        total: 34200,
        date: '14 Oct 2026',
        status: 'Shipped',
        paymentMethod: 'Razorpay UPI',
      }
    ];
  });

  // Modals & Drawers Visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isWelcomeOfferOpen, setIsWelcomeOfferOpen] = useState(false);
  const [infoSection, setInfoSection] = useState<InfoSection>('story');
  const [helpTab, setHelpTab] = useState<HelpTab>('shipping');

  // Automatic Welcome Coupon Offer Popup on Starting/Entry
  useEffect(() => {
    const hasSeenOffer = sessionStorage.getItem('rass_welcome_offer_seen');
    if (!hasSeenOffer) {
      // Reveal popup at 2.6s right as entry splash completes
      const timer = setTimeout(() => {
        setIsWelcomeOfferOpen(true);
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseWelcomeOffer = () => {
    setIsWelcomeOfferOpen(false);
    sessionStorage.setItem('rass_welcome_offer_seen', 'true');
  };

  const handleApplyWelcomeOfferAndShop = (code: string) => {
    setIsWelcomeOfferOpen(false);
    sessionStorage.setItem('rass_welcome_offer_seen', 'true');
    localStorage.setItem('rass_applied_coupon', code);
    setSelectedCategory('all');
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Entry Splash Animation State
  const [splashKey, setSplashKey] = useState(0);

  const handleReplayIntro = () => {
    sessionStorage.removeItem('rass_intro_shown');
    setSplashKey((prev) => prev + 1);
  };

  useEffect(() => {
    (window as any).replayIntro = handleReplayIntro;
  }, []);

  const handleOpenInfo = (section: InfoSection = 'story') => {
    setInfoSection(section);
    setIsAboutOpen(true);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('rass_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('rass_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('rass_orders', JSON.stringify(orders));
  }, [orders]);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  // Category Selection
  const handleSelectCategory = (category: ProductCategory | 'all') => {
    setSelectedCategory(category);
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order Handlers
  const handleOrderComplete = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setProducts(storeService.getProducts());
    setCart([]);
  };

  const handleToggleStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: 'Processing' | 'Shipped' | 'Delivered'
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  const isAnyModalOpen = Boolean(selectedProduct || isCartOpen || isWishlistOpen || isSearchOpen || isCheckoutOpen || isAboutOpen || isWelcomeOfferOpen);

  // Dedicated full-screen Admin Operations Portal (Protected with Authentication)
  if (activePage === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={(user) => {
            setAdminUser(user);
            setIsAdminAuthenticated(true);
          }}
          onBackToStore={() => {
            setActivePage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      );
    }

    return (
      <AdminErrorBoundary
        onBackToStore={() => {
          setActivePage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <AdminDashboard
          currentUser={adminUser}
          onLogout={() => {
            authService.signOut();
            setIsAdminAuthenticated(false);
            setAdminUser(null);
            setActivePage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToStore={() => {
            setActivePage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onRefreshStorefront={() => {
            setProducts(storeService.getProducts());
          }}
        />
      </AdminErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#292624] overflow-x-hidden w-full">
      
      {/* 1. Slim Announcement Bar */}
      <AnnouncementBar
        onPromoClick={() => {
          setIsWelcomeOfferOpen(true);
        }}
      />

      {/* 2. Site Header with Brand Logo, Navigation & Badges */}
      <SiteHeader
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => {
          setActivePage('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={handleSelectCategory}
      />

      {/* 3. Exquisite Mauve Lotus Toran (Directly under Header) */}
      <ToranDecoration />

      {/* Main View Switcher */}
      <main className="flex-1">
        {activePage === 'home' && (
          <>
            {/* 4. Asymmetric Jewellery Category Gallery */}
            <CategoryGallery onSelectCategory={handleSelectCategory} />

            {/* 5. Editorial Section A: Craftsmanship */}
            <EditorialCraftsmanship
              onStoryClick={() => {
                setActivePage('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 6. Editorial Section B: Everyday Moments */}
            <EditorialEveryday
              onExploreClick={() => {
                setSelectedCategory('earrings');
                setActivePage('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 7. Sage Green Organic Curved Newsletter Band */}
            <NewsletterSection />
          </>
        )}

        {activePage === 'shop' && (
          <>
            <ShopView
              products={products}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onSelectProduct={setSelectedProduct}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              onBackToHome={() => {
                setActivePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <NewsletterSection />
          </>
        )}

        {activePage === 'about' && (
          <AboutView
            onBackToHome={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreShop={() => {
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'help' && (
          <HelpView
            initialTab={helpTab}
            onBackToHome={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreShop={() => {
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'cart' && (
          <CartView
            items={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={() => setIsCheckoutOpen(true)}
            onContinueShopping={() => {
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* 8. Multi-Column Footer with Brand Details and Botanical Motifs */}
      <SiteFooter
        onNavClick={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onCategoryClick={handleSelectCategory}
        onPolicyClick={(section) => {
          if (['story', 'materials', 'care', 'sizing'].includes(section)) {
            setActivePage('about');
          } else {
            const mappedTab: HelpTab = section === 'privacy' ? 'terms' : (section as HelpTab);
            setHelpTab(mappedTab);
            setActivePage('help');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onReplayIntro={handleReplayIntro}
      />

      {/* 9. Luxury Entry Welcome Animation (First Visit per Session or Replayed) */}
      <EntrySplash key={splashKey} />

      {/* Interactive Modals and Drawers */}
      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={Boolean(selectedProduct && wishlistIds.includes(selectedProduct.id))}
        onToggleWishlist={handleToggleWishlist}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistedProducts}
        onRemove={handleRemoveFromWishlist}
        onMoveToCart={(product) => handleAddToCart(product, 1)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={setSelectedProduct}
        onSelectCategory={handleSelectCategory}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderComplete={handleOrderComplete}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        initialSection={infoSection}
      />

      {/* 10. Welcome Privilege Offer Modal (First Visit Coupon Popup) */}
      <WelcomeOfferModal
        isOpen={isWelcomeOfferOpen}
        onClose={handleCloseWelcomeOffer}
        onApplyAndShop={handleApplyWelcomeOfferAndShop}
      />



    </div>
  );
};

export default App;
