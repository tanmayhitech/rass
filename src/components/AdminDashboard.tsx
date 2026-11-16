import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  Truck, 
  AlertTriangle, 
  Tag, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  Archive, 
  Trash2, 
  Printer, 
  Boxes, 
  RefreshCw,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Minus,
  Check,
  FileText,
  LogOut,
  Sparkles,
  Activity,
  Upload,
  Image as ImageIcon,
  Menu,
  Database,
  Loader2,
  Copy,
  MessageCircle,
  Phone,
  Eye,
  Sliders,
  Store,
  Gem,
  Award,
  HelpCircle,
  Gift
} from 'lucide-react';
import { 
  Product, 
  Order, 
  ProductVariant, 
  Coupon, 
  ProductCategory, 
  ProductStatus,
  AdminUser,
  FestiveCampaignConfig
} from '../types';
import { storeService } from '../services/storeService';
import { orderService } from '../services/orderService';
import { couponService } from '../services/couponService';
import { PDFService } from '../services/pdfService';
import { DatabaseDiagnosticsModal } from './DatabaseDiagnosticsModal';
import { AdminHomeMediaManager } from './AdminHomeMediaManager';
import { ImageService, ImageOptimizationResult } from '../services/imageService';
import { WelcomeOfferModal } from './WelcomeOfferModal';
import { getOptimizedImageUrl, handleImageError } from '../utils/imageOptimizer';

// 4 Intuitive, Everyday Sections for Boutique Shop Owners
export type AdminTab = 
  | 'products'    // 📦 Products & Stock
  | 'orders'      // 🛍️ Customer Orders
  | 'discounts'   // 🎁 Offers & Discounts (Coupons + Festive Popup)
  | 'photos';     // 🖼️ Website Photos

interface AdminDashboardProps {
  onBackToStore: () => void;
  onRefreshStorefront?: () => void;
  currentUser?: AdminUser | null;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStore,
  onRefreshStorefront,
  currentUser,
  onLogout,
}) => {
  // Navigation State — 4 Clear Layman Sections
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  // Core Data
  const [products, setProducts] = useState<Product[]>(() => storeService.getProducts(true));
  const [variants, setVariants] = useState<ProductVariant[]>(() => storeService.getVariants());
  const [orders, setOrders] = useState<Order[]>(() => orderService.getOrders());
  const [coupons, setCoupons] = useState<Coupon[]>(() => couponService.getCoupons(true));
  const [festiveCampaign, setFestiveCampaign] = useState<FestiveCampaignConfig>(() => couponService.getFestiveCampaign());

  // Search & Filters (Plain English)
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStatusFilter, setProductStatusFilter] = useState('all');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Modals & Action Drawers
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isNewCouponModalOpen, setIsNewCouponModalOpen] = useState(false);
  const [isPreviewFestiveOpen, setIsPreviewFestiveOpen] = useState(false);
  const [previewInvoiceOrder, setPreviewInvoiceOrder] = useState<Order | null>(null);
  const [previewCourierSlipOrder, setPreviewCourierSlipOrder] = useState<Order | null>(null);

  // Shipping & Tracking Modal State
  const [shippingOrder, setShippingOrder] = useState<Order | null>(null);
  const [courierName, setCourierName] = useState('Blue Dart Express');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const reloadData = async () => {
    try {
      await storeService.syncWithSupabase();
      setProducts(storeService.getProducts(true));
      setVariants(storeService.getVariants());
      setOrders(orderService.getOrders());
      setCoupons(couponService.getCoupons(true));
      setFestiveCampaign(couponService.getFestiveCampaign());
    } catch (e) {
      console.error('Error refreshing admin data:', e);
    }
  };

  // --------------------------------------------------------------------------
  // CATEGORIES DICTIONARY (Indian Jewellery Terminology)
  // --------------------------------------------------------------------------
  const CATEGORIES: Array<{ key: ProductCategory; name: string; icon: string }> = [
    { key: 'jhumka', name: 'Jhumka (Bell Domes)', icon: '🪷' },
    { key: 'rings', name: 'Rings (Anguthi)', icon: '💍' },
    { key: 'necklaces', name: 'Necklaces & Chokers (Haar)', icon: '📿' },
    { key: 'western', name: 'Western & Daily Wear', icon: '✨' },
    { key: 'kadas', name: 'Kadas & Solid Bangles', icon: '👑' },
    { key: 'kangan-sets', name: 'Kangan Sets (Pairs)', icon: '🌸' },
    { key: 'kangna', name: 'Kangna (Single)', icon: '🪞' },
    { key: 'earrings', name: 'Earrings & Drops (Jhumki)', icon: '💎' },
    { key: 'accessories', name: 'Earpins & Bugadi Clips', icon: '🌿' },
    { key: 'bracelets', name: 'Bracelets & Chains', icon: '💫' },
    { key: 'tribal', name: 'Tribal & Oxidised Silver', icon: '🌙' },
    { key: 'toran', name: 'Doorway Toran & Decor', icon: '🏡' },
  ];

  const categoryDisplayNames: Record<ProductCategory, string> = {
    jhumka: 'Jhumka',
    rings: 'Rings',
    necklaces: 'Necklaces & Chokers',
    western: 'Western Jewellery',
    kadas: 'Kadas',
    'kangan-sets': 'Kangan Sets',
    kangna: 'Kangna',
    earrings: 'Earrings',
    accessories: 'Earpins & Bugadi',
    bracelets: 'Bracelets',
    tribal: 'Tribal Jewellery',
    toran: 'Home Decor & Toran',
  };

  const generateCategorySku = (cat: ProductCategory) => {
    const map: Record<string, string> = {
      jhumka: 'JHM', rings: 'RNG', necklaces: 'NCK', western: 'WST',
      kadas: 'KAD', 'kangan-sets': 'KNG', kangna: 'KGA', earrings: 'EAR',
      accessories: 'ACC', bracelets: 'BRC', tribal: 'TRB', toran: 'TRN',
    };
    const code = map[cat] || 'JEW';
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `RASS-${code}-${rand}`;
  };

  // --------------------------------------------------------------------------
  // RE-IMAGINED 5-FIELD "ADD PRODUCT" FORM STATE
  // --------------------------------------------------------------------------
  const getInitialProductForm = () => ({
    name: '',
    category: 'jhumka' as ProductCategory,
    price: 2490,
    originalPrice: 3490,
    stockCount: 5,
    showOriginalPrice: true,
    image: '/images/Pastel Tribal Silver Jhumka Earrings.webp',
    cleanImage: '/images/Pastel Tribal Silver Jhumka Earrings.webp',
    isBestseller: true,
    isNew: true,
    // Optional details auto-filled with high-end defaults
    metal: 'Solid Brass with 18k Micro Gold Polish & Anti-Tarnish Seal',
    gemstones: 'Handcrafted Enamel Drops & Micro Zirconia',
    dimensions: 'Standard boutique sizing',
    weight: '12g',
    description: 'Artisan handcrafted piece sculpted with delicate karigari, skin-safe metallurgy, and 925 authenticity hallmarks.',
  });

  const [newProductForm, setNewProductForm] = useState(getInitialProductForm);
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);
  const [imageOptimizationInfo, setImageOptimizationInfo] = useState<ImageOptimizationResult | null>(null);
  const [showAdvancedCraftFields, setShowAdvancedCraftFields] = useState(false);

  // Auto-compress and upload photo to Supabase CDN WebP
  const handlePhotoSelect = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a photo (PNG, JPG, WEBP).', 'error');
      return;
    }

    setIsOptimizingImage(true);
    try {
      const res = await ImageService.optimizeAndUploadProductImage(file, {
        maxDimension: 1000,
        quality: 0.82,
        folder: 'products',
      });

      setNewProductForm(prev => ({
        ...prev,
        image: res.url,
        cleanImage: res.url,
      }));
      setImageOptimizationInfo(res);
      showToast(
        res.isCloudUrl 
          ? `✓ Photo optimized for web (${res.savedPercentage}% saved, ${Math.round(res.optimizedSize / 1024)} KB)`
          : `✓ Photo optimized (${res.savedPercentage}% saved)`
      );
    } catch (err: any) {
      showToast(err.message || 'Image processing failed', 'error');
    } finally {
      setIsOptimizingImage(false);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) {
      showToast('Please enter the jewellery design name.', 'error');
      return;
    }
    if (newProductForm.price <= 0) {
      showToast('Please enter a valid selling price.', 'error');
      return;
    }

    try {
      const sku = generateCategorySku(newProductForm.category);
      const catDisplay = categoryDisplayNames[newProductForm.category] || 'Jewellery';

      storeService.createProduct({
        name: newProductForm.name.trim(),
        category: newProductForm.category,
        categoryDisplay: catDisplay,
        price: Number(newProductForm.price),
        originalPrice: newProductForm.showOriginalPrice && newProductForm.originalPrice > newProductForm.price 
          ? Number(newProductForm.originalPrice) 
          : undefined,
        costPrice: Math.round(Number(newProductForm.price) * 0.45),
        image: newProductForm.image,
        cleanImage: newProductForm.cleanImage || newProductForm.image,
        description: newProductForm.description,
        details: [
          `Handcrafted in ${newProductForm.metal}`,
          `Adorned with genuine ${newProductForm.gemstones}`,
          '100% skin-safe & hypoallergenic (nickel-free and lead-free)',
          '925 authenticity stamp with anti-tarnish protective finish',
          'Accompanied by suede presentation box & certificate of authenticity',
        ],
        metal: newProductForm.metal,
        gemstones: newProductForm.gemstones,
        dimensions: newProductForm.dimensions,
        weight: newProductForm.weight,
        sku,
        initialStock: Math.max(1, Number(newProductForm.stockCount) || 5),
        lowStockThreshold: 2,
        status: 'published',
        isBestseller: newProductForm.isBestseller,
        isNew: newProductForm.isNew,
      });

      showToast(`✨ "${newProductForm.name}" is now live on the website!`);
      setNewProductForm(getInitialProductForm());
      setImageOptimizationInfo(null);
      setIsNewProductModalOpen(false);
      reloadData();
      if (onRefreshStorefront) onRefreshStorefront();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // PRODUCTS FILTERING & INSTANT STOCK STEPPERS
  // --------------------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
      if (productStatusFilter !== 'all' && p.status !== productStatusFilter) return false;
      if (lowStockOnly && (p.stockCount ?? 0) > 3) return false;
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q));
      }
      return true;
    });
  }, [products, productCategoryFilter, productStatusFilter, lowStockOnly, productSearch]);

  // Snappy 12-Item Pagination
  const [productPage, setProductPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;
  const totalProductPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (productPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, productPage]);

  useEffect(() => {
    setProductPage(1);
  }, [productCategoryFilter, productStatusFilter, lowStockOnly, productSearch]);

  // 1-Click Stock Stepper (+ / -)
  const handleStockStep = (prod: Product, change: number) => {
    const variant = variants.find((v) => v.productId === prod.id) || prod.variants?.[0];
    if (!variant) return;

    try {
      const current = variant.stockQuantity;
      if (current + change < 0) {
        showToast('Stock cannot be less than zero.', 'error');
        return;
      }
      storeService.adjustStock({
        variantId: variant.id,
        quantityChange: change,
        movementType: change > 0 ? 'purchase_receipt' : 'manual_adjustment',
        notes: change > 0 ? 'Stock added by boutique manager' : 'Piece removed by boutique manager',
        createdBy: currentUser?.name || 'Boutique Manager',
      });
      showToast(`${prod.name}: ${current + change} in stock`);
      reloadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // 1-Click Storefront Visibility Toggle (Live / Hidden)
  const handleToggleProductStatus = (prod: Product) => {
    try {
      const next: ProductStatus = prod.status === 'published' ? 'inactive' : 'published';
      storeService.setProductStatus(prod.id, next);
      showToast(
        next === 'published' 
          ? `✓ "${prod.name}" is now visible on the website.` 
          : `"${prod.name}" is now hidden from the website.`
      );
      reloadData();
      if (onRefreshStorefront) onRefreshStorefront();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // 1-Click Badge Toggle (Bestseller)
  const handleToggleBestseller = (prod: Product) => {
    try {
      storeService.updateProduct(prod.id, { isBestseller: !prod.isBestseller });
      showToast(`Updated Bestseller badge for "${prod.name}"`);
      reloadData();
      if (onRefreshStorefront) onRefreshStorefront();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Safe Deletion
  const handleDeleteProduct = (prod: Product) => {
    if (!window.confirm(`Remove "${prod.name}"? (If it has customer orders in the past, it will be safely hidden instead of breaking records).`)) {
      return;
    }
    try {
      const res = storeService.deleteProductSafely(prod.id);
      showToast(res.message);
      reloadData();
      if (onRefreshStorefront) onRefreshStorefront();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // ORDERS FILTERING & 1-CLICK WHATSAPP / SHIPPING ACTIONS
  // --------------------------------------------------------------------------
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // WhatsApp Update Trigger
  const handleWhatsAppCustomer = (order: Order) => {
    const phoneClean = order.phone.replace(/[^0-9]/g, '');
    const firstItem = order.itemSnapshots?.[0]?.productTitle || order.items?.[0]?.product?.name || 'Jewellery';
    const totalItems = order.itemSnapshots?.length || order.items?.length || 1;
    const itemText = totalItems > 1 ? `${firstItem} (+${totalItems - 1} more pieces)` : firstItem;

    const message = 
      `Hi ${order.customerName}! ✨\n\n` +
      `Thank you for shopping with Rass by Riddhima!\n` +
      `Your order #${order.id} for "${itemText}" (Total: ₹${order.total.toLocaleString('en-IN')}) is ${order.status.toLowerCase()}.\n\n` +
      (order.awbNumber ? `📦 Courier: ${order.courierPartner || 'Express'}\nTracking Number: ${order.awbNumber}\n\n` : '') +
      `We hope you love wearing your handcrafted creations! Handcrafted with love in India. 🌸`;

    const url = `https://wa.me/${phoneClean.startsWith('91') ? phoneClean : '91' + phoneClean}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Dispatch / Mark as Shipped
  const handleDispatchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingOrder) return;

    try {
      showToast(`Marking order ${shippingOrder.id} as shipped...`);
      await orderService.updateOrderStatus(shippingOrder.id, 'Shipped');
      if (trackingNumber.trim()) {
        await orderService.updateTracking({
          orderId: shippingOrder.id,
          courierPartner: courierName,
          awbNumber: trackingNumber.trim(),
        });
      }
      showToast(`✓ Order #${shippingOrder.id} marked as Shipped!`);
      setShippingOrder(null);
      setTrackingNumber('');
      reloadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // OFFERS & COUPONS MANAGEMENT (Plain English 3-Step)
  // --------------------------------------------------------------------------
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'percentage' | 'fixed_amount'>('fixed_amount');
  const [newDiscountAmount, setNewDiscountAmount] = useState(500);
  const [newMinOrder, setNewMinOrder] = useState(2500);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newCouponCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!cleanCode) {
      showToast('Please enter a coupon code (e.g. DIWALI500).', 'error');
      return;
    }
    if (newDiscountAmount <= 0) {
      showToast('Please enter a discount amount.', 'error');
      return;
    }
    if (newDiscountType === 'fixed_amount' && newDiscountAmount >= newMinOrder) {
      showToast('Discount amount should be less than the minimum order amount.', 'error');
      return;
    }

    try {
      couponService.createCoupon({
        code: cleanCode,
        discountType: newDiscountType,
        discountValue: Number(newDiscountAmount),
        minOrderValue: Number(newMinOrder),
        expiryDate: new Date(Date.now() + 180 * 86400000).toISOString(),
      });
      showToast(`✓ Discount Code "${cleanCode}" created successfully!`);
      setNewCouponCode('');
      setIsNewCouponModalOpen(false);
      reloadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleSaveFestiveCampaign = () => {
    try {
      couponService.saveFestiveCampaign(festiveCampaign);
      showToast('✓ Welcome Popup settings saved and live!');
      reloadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // PRINT BILL / PACKING SLIP HELPER
  // --------------------------------------------------------------------------
  const handlePrintModal = (type: 'invoice' | 'slip') => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-[#FAF8F5] text-[#292624] font-sans antialiased overflow-hidden selection:bg-[#E2D5E5] selection:text-[#292624]">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-medium flex items-center space-x-2.5 animate-slideDown ${
          toast.type === 'error'
            ? 'bg-[#FDF2F0] border-[#F8D4CF] text-[#8F3B30]'
            : 'bg-[#EEF3EC] border-[#D3E0CE] text-[#3B5432]'
        }`}>
          {toast.type === 'error' ? <AlertTriangle className="w-4 h-4 shrink-0 text-[#8F3B30]" /> : <CheckCircle className="w-4 h-4 shrink-0 text-[#3B5432]" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 1. SIDEBAR (DESKTOP & TABLET)                                         */}
      {/* ===================================================================== */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E7E0DA] shrink-0 justify-between select-none">
        <div>
          {/* Brand Header */}
          <div className="h-18 px-5 border-b border-[#E7E0DA] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={getOptimizedImageUrl('/images/Rass by Ridhima Wordmark.png')}
                alt="Rass by Riddhima"
                className="h-7 w-auto object-contain select-none"
                loading="eager"
              />
            </div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#B49A6C] px-2 py-0.5 rounded-full bg-[#FAF5EC] border border-[#EFE3CF]">
              Manager
            </span>
          </div>

          {/* 4 Simple Layman Tabs */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#A783A2] text-white shadow-sm font-semibold'
                  : 'text-[#5C5855] hover:bg-[#FAF8F5] hover:text-[#292624]'
              }`}
            >
              <Package className={`w-4 h-4 ${activeTab === 'products' ? 'text-white' : 'text-[#A783A2]'}`} />
              <div className="flex-1">
                <span className="block leading-tight">My Products & Stock</span>
                <span className={`text-[10px] block opacity-80 ${activeTab === 'products' ? 'text-white/90' : 'text-[#77716F]'}`}>
                  Add pieces & update counts
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#A783A2] text-white shadow-sm font-semibold'
                  : 'text-[#5C5855] hover:bg-[#FAF8F5] hover:text-[#292624]'
              }`}
            >
              <ShoppingCart className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-[#A783A2]'}`} />
              <div className="flex-1">
                <span className="block leading-tight">Customer Orders</span>
                <span className={`text-[10px] block opacity-80 ${activeTab === 'orders' ? 'text-white/90' : 'text-[#77716F]'}`}>
                  Shipping, bills & WhatsApp
                </span>
              </div>
              {orders.filter(o => o.status === 'Processing').length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'orders' ? 'bg-white text-[#A783A2]' : 'bg-[#FAF5EC] text-[#B49A6C] border border-[#EFE3CF]'
                }`}>
                  {orders.filter(o => o.status === 'Processing').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('discounts')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'discounts'
                  ? 'bg-[#A783A2] text-white shadow-sm font-semibold'
                  : 'text-[#5C5855] hover:bg-[#FAF8F5] hover:text-[#292624]'
              }`}
            >
              <Gift className={`w-4 h-4 ${activeTab === 'discounts' ? 'text-white' : 'text-[#A783A2]'}`} />
              <div className="flex-1">
                <span className="block leading-tight">Offers & Discounts</span>
                <span className={`text-[10px] block opacity-80 ${activeTab === 'discounts' ? 'text-white/90' : 'text-[#77716F]'}`}>
                  Coupon codes & festive popup
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-[#A783A2] text-white shadow-sm font-semibold'
                  : 'text-[#5C5855] hover:bg-[#FAF8F5] hover:text-[#292624]'
              }`}
            >
              <ImageIcon className={`w-4 h-4 ${activeTab === 'photos' ? 'text-white' : 'text-[#A783A2]'}`} />
              <div className="flex-1">
                <span className="block leading-tight">Website Photos</span>
                <span className={`text-[10px] block opacity-80 ${activeTab === 'photos' ? 'text-white/90' : 'text-[#77716F]'}`}>
                  Swap homepage category images
                </span>
              </div>
            </button>
          </nav>
        </div>

        {/* Footer: Status Pill, Storefront Link, and Logout */}
        <div className="p-4 border-t border-[#E7E0DA] space-y-3 bg-[#FAF8F5]/60">
          {/* Supabase Green Dot Indicator (Quiet & Reassuring) */}
          <button
            onClick={() => setIsDiagnosticsOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-[#E7E0DA] text-[11px] text-[#5C5855] hover:border-[#B49A6C] transition-all cursor-pointer shadow-2xs group"
            title="Click to view database connection status"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-[#292624]">Store Database Active</span>
            </div>
            <ExternalLink className="w-3 h-3 text-[#A783A2] group-hover:scale-110 transition-transform" />
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onBackToStore}
              className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-white border border-[#E7E0DA] hover:bg-[#FAF8F5] text-xs font-medium text-[#292624] transition-colors cursor-pointer shadow-2xs"
            >
              <Store className="w-3.5 h-3.5 text-[#A783A2]" />
              <span>View Storefront</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-white border border-[#E7E0DA] hover:bg-red-50 hover:border-red-200 text-[#77716F] hover:text-red-700 transition-colors cursor-pointer shadow-2xs"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* 2. MAIN CONTENT AREA                                                  */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-18 bg-white border-b border-[#E7E0DA] px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#FAF8F5] text-[#292624]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-serif font-bold text-[#292624] tracking-tight">
                {activeTab === 'products' && 'My Products & Stock'}
                {activeTab === 'orders' && 'Customer Orders'}
                {activeTab === 'discounts' && 'Offers, Coupons & Festive Popup'}
                {activeTab === 'photos' && 'Homepage Category Photos'}
              </h1>
              <p className="text-[11px] text-[#77716F]">
                {activeTab === 'products' && 'Manage your designs, prices, and available pieces in store.'}
                {activeTab === 'orders' && 'View customer purchases, send WhatsApp updates, and print bills.'}
                {activeTab === 'discounts' && 'Create discount codes and control the festive welcome banner.'}
                {activeTab === 'photos' && 'Tap any photo to replace it with your own photography.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* BIG PROMINENT ACTION: ADD NEW JEWELLERY PIECE */}
            {activeTab === 'products' && (
              <button
                onClick={() => setIsNewProductModalOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-[#A783A2] hover:bg-[#936E8F] text-white text-xs font-semibold tracking-wide shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Add New Jewellery Piece</span>
                <span className="sm:hidden">Add Piece</span>
              </button>
            )}

            {activeTab === 'discounts' && (
              <button
                onClick={() => setIsNewCouponModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-[#A783A2] hover:bg-[#936E8F] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Discount Code</span>
              </button>
            )}

            <button
              onClick={reloadData}
              className="p-2 rounded-full border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[#77716F] hover:text-[#292624] transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Scrollable Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* ================================================================= */}
          {/* TAB 1: PRODUCTS & STOCK                                           */}
          {/* ================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Quick Summary Cards (Human Retail Numbers) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#E7E0DA] shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-[#77716F] mb-1 font-medium">
                    <span>Live Designs on Website</span>
                    <Sparkles className="w-4 h-4 text-[#A783A2]" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#292624]">
                    {products.filter(p => p.status === 'published').length}
                  </div>
                  <p className="text-[11px] text-[#77716F] mt-1">Ready for customers to view & purchase</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E7E0DA] shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-[#77716F] mb-1 font-medium">
                    <span>Almost Sold Out (≤ 3 pieces)</span>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-amber-600">
                    {products.filter(p => (p.stockCount ?? 0) <= 3 && p.status === 'published').length}
                  </div>
                  <p className="text-[11px] text-[#77716F] mt-1">Time to re-order from your karigar</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E7E0DA] shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-[#77716F] mb-1 font-medium">
                    <span>Total Jewellery Units in Studio</span>
                    <Boxes className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-emerald-700">
                    {products.reduce((acc, p) => acc + (p.stockCount ?? 0), 0)}
                  </div>
                  <p className="text-[11px] text-[#77716F] mt-1">Total physical stock across all collections</p>
                </div>
              </div>

              {/* Search & Filter Bar (Everyday Language) */}
              <div className="p-4 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                  {/* Search Input */}
                  <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#77716F]" />
                    <input
                      type="text"
                      placeholder="Search by jewellery name or code..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E7E0DA] bg-[#FAF8F5]/60 text-xs text-[#292624] focus:outline-none focus:border-[#A783A2]"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="border border-[#E7E0DA] rounded-xl px-3 py-2 bg-white text-[#292624] focus:outline-none focus:border-[#A783A2] cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => (
                      <option key={c.key} value={c.key}>{c.icon} {c.name}</option>
                    ))}
                  </select>

                  {/* Status Dropdown */}
                  <select
                    value={productStatusFilter}
                    onChange={(e) => setProductStatusFilter(e.target.value)}
                    className="border border-[#E7E0DA] rounded-xl px-3 py-2 bg-white text-[#292624] focus:outline-none focus:border-[#A783A2] cursor-pointer"
                  >
                    <option value="all">All Items</option>
                    <option value="published">Showing on Website</option>
                    <option value="inactive">Hidden from Website</option>
                  </select>

                  {/* Low Stock Quick Filter */}
                  <button
                    onClick={() => setLowStockOnly(!lowStockOnly)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
                      lowStockOnly 
                        ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold' 
                        : 'border-[#E7E0DA] text-[#77716F] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    ⚠️ Low Stock Only
                  </button>
                </div>

                <div className="text-[11px] text-[#77716F]">
                  Showing <strong className="text-[#292624]">{filteredProducts.length}</strong> designs
                </div>
              </div>

              {/* Products Table (Lag-Free 12-Item Pagination & 1-Click Steppers) */}
              <div className="bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[720px]">
                    <thead className="bg-[#FAF8F5] text-[#77716F] uppercase font-semibold text-[10.5px] tracking-wider border-b border-[#E7E0DA]">
                      <tr>
                        <th className="py-3 px-4">Jewellery Design</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Pieces Available (In Stock)</th>
                        <th className="py-3 px-4">Website Status</th>
                        <th className="py-3 px-4">Badges</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E0DA]/70">
                      {paginatedProducts.map((p) => {
                        const isLow = (p.stockCount ?? 0) <= 3;
                        return (
                          <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                            {/* Photo & Name */}
                            <td className="py-3 px-4 flex items-center space-x-3">
                              <img
                                src={getOptimizedImageUrl(p.cleanImage || p.image)}
                                alt={p.name}
                                loading="lazy"
                                decoding="async"
                                onError={(e) => handleImageError(e, p.cleanImage || p.image)}
                                className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-[#E7E0DA] shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="font-semibold text-[#292624] block truncate max-w-[220px]">
                                  {p.name}
                                </span>
                                <span className="text-[10.5px] text-[#77716F] font-mono">
                                  {p.sku || p.id}
                                </span>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3 px-4 font-medium text-[#5C5855]">
                              {p.categoryDisplay || p.category}
                            </td>

                            {/* Price (Showing MRP Cut-price if any) */}
                            <td className="py-3 px-4">
                              <div className="font-bold text-[#292624]">
                                ₹{p.price.toLocaleString('en-IN')}
                              </div>
                              {p.originalPrice && p.originalPrice > p.price && (
                                <div className="text-[10px] text-[#77716F] line-through">
                                  ₹{p.originalPrice.toLocaleString('en-IN')}
                                </div>
                              )}
                            </td>

                            {/* STOCK: BIG THUMB-FRIENDLY + / - STEPPER */}
                            <td className="py-3 px-4">
                              <div className="inline-flex items-center space-x-1.5 p-1 rounded-xl bg-[#FAF8F5] border border-[#E7E0DA]">
                                <button
                                  onClick={() => handleStockStep(p, -1)}
                                  className="w-6 h-6 rounded-lg bg-white hover:bg-stone-100 flex items-center justify-center text-[#292624] font-bold border border-[#E7E0DA] transition-colors cursor-pointer"
                                  title="Remove 1 piece"
                                >
                                  -
                                </button>
                                <span className={`px-2 font-bold font-mono text-xs ${isLow ? 'text-amber-600' : 'text-[#292624]'}`}>
                                  {p.stockCount ?? 0}
                                </span>
                                <button
                                  onClick={() => handleStockStep(p, +1)}
                                  className="w-6 h-6 rounded-lg bg-white hover:bg-stone-100 flex items-center justify-center text-[#292624] font-bold border border-[#E7E0DA] transition-colors cursor-pointer"
                                  title="Add 1 piece"
                                >
                                  +
                                </button>
                              </div>
                              {isLow && (
                                <span className="block text-[9.5px] text-amber-600 font-semibold mt-0.5">
                                  Only {p.stockCount ?? 0} left!
                                </span>
                              )}
                            </td>

                            {/* Live Website Status Toggle */}
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleToggleProductStatus(p)}
                                className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition-colors cursor-pointer ${
                                  p.status === 'published'
                                    ? 'bg-[#EEF3EC] text-[#3B5432] border border-[#D3E0CE] hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                                    : 'bg-[#FAF5EC] text-[#785E2F] border border-[#EFE3CF] hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                                }`}
                                title="Click to change live status"
                              >
                                <span>{p.status === 'published' ? '● Live on Store' : '○ Hidden'}</span>
                              </button>
                            </td>

                            {/* 1-Click Badges */}
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleToggleBestseller(p)}
                                className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
                                  p.isBestseller 
                                    ? 'bg-[#FAF5EC] text-[#B49A6C] border border-[#EFE3CF] font-bold' 
                                    : 'text-[#77716F] hover:bg-stone-100'
                                }`}
                                title="Toggle Bestseller Badge"
                              >
                                <span>✦ Bestseller</span>
                              </button>
                            </td>

                            {/* Safe Delete */}
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleDeleteProduct(p)}
                                className="p-1.5 rounded-lg text-[#77716F] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Remove piece"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Snappy Pagination Bar */}
                {totalProductPages > 1 && (
                  <div className="px-4 py-3 bg-[#FAF8F5] border-t border-[#E7E0DA] flex items-center justify-between text-xs text-[#77716F]">
                    <div>
                      Showing page <strong className="text-[#292624]">{productPage}</strong> of{' '}
                      <strong className="text-[#292624]">{totalProductPages}</strong> ({filteredProducts.length} total pieces)
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setProductPage(prev => Math.max(1, prev - 1))}
                        disabled={productPage === 1}
                        className="px-3 py-1 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed font-medium text-[#292624] transition-colors cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setProductPage(prev => Math.min(totalProductPages, prev + 1))}
                        disabled={productPage === totalProductPages}
                        className="px-3 py-1 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed font-medium text-[#292624] transition-colors cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: CUSTOMER ORDERS (WITH WHATSAPP & EASY PRINTING)             */}
          {/* ================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Order Search & Filters */}
              <div className="p-4 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="relative flex-1 min-w-[240px] max-w-sm">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#77716F]" />
                  <input
                    type="text"
                    placeholder="Search by customer name, phone, or token (RASS-ORD)..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E7E0DA] bg-[#FAF8F5]/60 text-xs text-[#292624] focus:outline-none focus:border-[#A783A2]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[#77716F] font-medium">Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="border border-[#E7E0DA] rounded-xl px-3 py-2 bg-white text-[#292624] focus:outline-none focus:border-[#A783A2] cursor-pointer"
                  >
                    <option value="all">All Orders</option>
                    <option value="Processing">🟡 Needs Packing (Processing)</option>
                    <option value="Shipped">🔵 Packed & Shipped</option>
                    <option value="Delivered">🟢 Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Order Cards Stream */}
              <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const isNew = order.status === 'Processing';
                    return (
                      <div key={order.id} className="p-5 rounded-2xl bg-white border border-[#E7E0DA] shadow-2xs space-y-4 hover:border-[#B49A6C]/50 transition-all">
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E7E0DA]">
                          <div className="flex items-center space-x-3">
                            <span className="font-mono font-bold text-sm text-[#292624]">
                              {order.id}
                            </span>
                            <span className="text-[11px] text-[#77716F]">
                              {order.date}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${
                              order.status === 'Delivered' ? 'bg-[#EEF3EC] text-[#3B5432]' :
                              order.status === 'Shipped' ? 'bg-sky-50 text-sky-800 border border-sky-200' :
                              order.status === 'Processing' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                              'bg-stone-100 text-stone-600'
                            }`}>
                              {order.status === 'Processing' ? '🟡 Needs Packing' : order.status === 'Shipped' ? '🔵 On The Way' : '🟢 ' + order.status}
                            </span>
                          </div>

                          {/* 1-Click WhatsApp & PDF Action Buttons */}
                          <div className="flex items-center space-x-2">
                            {/* WhatsApp Button */}
                            <button
                              onClick={() => handleWhatsAppCustomer(order)}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
                              title="Send WhatsApp update to customer"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp</span>
                            </button>

                            {/* Mark as Shipped Button */}
                            {isNew && (
                              <button
                                onClick={() => {
                                  setShippingOrder(order);
                                  setTrackingNumber('');
                                }}
                                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <Truck className="w-3.5 h-3.5 text-sky-600" />
                                <span>Mark Shipped</span>
                              </button>
                            )}

                            {/* Print Bill PDF */}
                            <button
                              onClick={() => PDFService.downloadInvoice(order)}
                              className="p-1.5 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[#292624] transition-colors cursor-pointer"
                              title="Download Tax Bill (PDF)"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#A783A2]" />
                            </button>

                            {/* Print Courier Label */}
                            <button
                              onClick={() => PDFService.downloadPackingSlip(order)}
                              className="p-1.5 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[#292624] transition-colors cursor-pointer"
                              title="Download Courier Packing Slip (PDF)"
                            >
                              <Printer className="w-3.5 h-3.5 text-[#B49A6C]" />
                            </button>
                          </div>
                        </div>

                        {/* Customer & Address Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#77716F] tracking-wider block mb-1">
                              Customer Details
                            </span>
                            <p className="font-semibold text-[#292624] text-sm">{order.customerName}</p>
                            <p className="text-[#5C5855]">{order.phone}</p>
                            <p className="text-[#77716F]">{order.email}</p>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#77716F] tracking-wider block mb-1">
                              Shipping Address
                            </span>
                            <p className="text-[#292624] leading-relaxed">
                              {order.shippingAddress}, {order.city}, {order.state} — {order.pincode}
                            </p>
                            {order.awbNumber && (
                              <p className="mt-1 text-[11px] font-mono font-medium text-sky-700">
                                Tracking: {order.courierPartner} ({order.awbNumber})
                              </p>
                            )}
                          </div>

                          <div className="text-right flex flex-col justify-between">
                            <span className="text-[10px] uppercase font-bold text-[#77716F] tracking-wider block mb-1">
                              Amount Paid
                            </span>
                            <div>
                              <div className="font-serif text-xl font-bold text-[#292624]">
                                ₹{order.total.toLocaleString('en-IN')}
                              </div>
                              <span className="text-[10px] text-emerald-700 font-medium">
                                ✓ Paid via {order.paymentMethod}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Itemized Snapshot Thumbnails */}
                        <div className="pt-2 border-t border-[#E7E0DA]/60 flex flex-wrap gap-2">
                          {(order.itemSnapshots || []).map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E7E0DA] text-xs">
                              <img
                                src={getOptimizedImageUrl(item.imageUrl)}
                                alt={item.productTitle}
                                loading="lazy"
                                className="w-7 h-7 rounded-lg object-cover bg-white"
                              />
                              <span className="font-medium text-[#292624] truncate max-w-[160px]">{item.productTitle}</span>
                              <span className="text-[10.5px] text-[#77716F]">×{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center bg-white rounded-2xl border border-[#E7E0DA]">
                    <ShoppingCart className="w-10 h-10 text-[#A783A2] mx-auto mb-2 opacity-50" />
                    <p className="font-serif text-base font-semibold text-[#292624]">No orders match your filter</p>
                    <p className="text-xs text-[#77716F] mt-1">Try resetting the status filter to "All Orders".</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: OFFERS, COUPONS & FESTIVE POPUP                            */}
          {/* ================================================================= */}
          {activeTab === 'discounts' && (
            <div className="space-y-6">
              
              {/* Card 1: Festive Storefront Welcome Popup Controller */}
              <div className="p-6 rounded-2xl bg-white border border-[#E7E0DA] shadow-2xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E7E0DA]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF5EC] border border-[#EFE3CF] flex items-center justify-center text-[#B49A6C]">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#292624]">
                        Festive Storefront Welcome Popup
                      </h3>
                      <p className="text-xs text-[#77716F]">
                        Welcomes first-time visitors with a luxury celebration offer on site entry.
                      </p>
                    </div>
                  </div>

                  {/* One Big Toggle Switch */}
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-semibold text-[#292624]">
                      {festiveCampaign.isEnabled ? '🟢 Popup is ON (Showing on Site)' : '⚪ Popup is OFF'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFestiveCampaign(prev => ({ ...prev, isEnabled: !prev.isEnabled }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        festiveCampaign.isEnabled ? 'bg-[#A783A2]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          festiveCampaign.isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Popup Settings Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-[#292624] block mb-1">
                      Give which discount code in the popup?
                    </label>
                    <select
                      value={festiveCampaign.linkedCouponCode}
                      onChange={(e) => setFestiveCampaign(prev => ({ ...prev, linkedCouponCode: e.target.value }))}
                      className="w-full border border-[#E7E0DA] rounded-xl px-3 py-2 bg-white text-xs text-[#292624] focus:outline-none focus:border-[#A783A2]"
                    >
                      {coupons.filter(c => c.isActive).map(c => (
                        <option key={c.id} value={c.code}>
                          {c.code} ({c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`} • Min ₹{c.minOrderValue})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-[#292624] block mb-1">
                      Top Badge Text
                    </label>
                    <input
                      type="text"
                      value={festiveCampaign.badgeText}
                      onChange={(e) => setFestiveCampaign(prev => ({ ...prev, badgeText: e.target.value }))}
                      className="w-full border border-[#E7E0DA] rounded-xl px-3 py-2 bg-white text-xs text-[#292624] focus:outline-none focus:border-[#A783A2]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-[#292624] block mb-1">
                      Headline (Greeting)
                    </label>
                    <input
                      type="text"
                      value={festiveCampaign.headline}
                      onChange={(e) => setFestiveCampaign(prev => ({ ...prev, headline: e.target.value }))}
                      className="w-full border border-[#E7E0DA] rounded-xl px-3 py-2 bg-white text-xs text-[#292624] focus:outline-none focus:border-[#A783A2]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-[#292624] block mb-1">
                      Offer Description (Subtitle)
                    </label>
                    <input
                      type="text"
                      value={festiveCampaign.description}
                      onChange={(e) => setFestiveCampaign(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full border border-[#E7E0DA] rounded-xl px-3 py-2 bg-white text-xs text-[#292624] focus:outline-none focus:border-[#A783A2]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    onClick={() => setIsPreviewFestiveOpen(true)}
                    className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#292624] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#A783A2]" />
                    <span>Live Preview Popup</span>
                  </button>

                  <button
                    onClick={handleSaveFestiveCampaign}
                    className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-[#A783A2] hover:bg-[#936E8F] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Popup Settings</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Coupon Codes Manager */}
              <div className="p-6 rounded-2xl bg-white border border-[#E7E0DA] shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E7E0DA]">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#292624]">
                      Active Discount Codes
                    </h3>
                    <p className="text-xs text-[#77716F]">
                      Codes customers can type at checkout to receive discounts.
                    </p>
                  </div>
                </div>

                {/* Coupons Table */}
                <div className="divide-y divide-[#E7E0DA]">
                  {coupons.map((c) => (
                    <div key={c.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-sm text-[#A783A2] px-3 py-1 rounded-lg bg-[#FAF5F9] border border-[#E2D5E5]">
                          {c.code}
                        </span>
                        <div>
                          <p className="font-semibold text-[#292624]">
                            {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue.toLocaleString('en-IN')} OFF`}
                          </p>
                          <p className="text-[11px] text-[#77716F]">
                            Valid on orders above ₹{c.minOrderValue.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-[11px] text-[#77716F]">
                          Used: <strong className="text-[#292624]">{c.redemptionCount || 0} times</strong>
                        </span>
                        <button
                          onClick={() => {
                            couponService.toggleCouponActive(c.id);
                            reloadData();
                            showToast(`Updated status for coupon ${c.code}`);
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold cursor-pointer ${
                            c.isActive ? 'bg-[#EEF3EC] text-[#3B5432]' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {c.isActive ? 'Active' : 'Paused'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: WEBSITE PHOTOS (HOMEPAGE CATEGORY CARDS)                    */}
          {/* ================================================================= */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              <AdminHomeMediaManager onPreviewStorefront={onBackToStore} />
            </div>
          )}

        </main>
      </div>

      {/* ===================================================================== */}
      {/* 3. RE-IMAGINED 5-FIELD "ADD PRODUCT" MODAL WITH LIVE CARD PREVIEW      */}
      {/* ===================================================================== */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E7E0DA] my-auto">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E7E0DA] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FAF5F9] border border-[#E2D5E5] flex items-center justify-center text-[#A783A2]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#292624]">
                    Add New Jewellery Piece to Store
                  </h3>
                  <p className="text-[11px] text-[#77716F]">
                    Fill the 4 quick boxes below and tap "Put on Website".
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewProductModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#77716F] hover:text-[#292624] hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Split Screen Layout: Form on Left + Live Storefront Preview on Right */}
            <div className="grid grid-cols-1 md:grid-cols-12 max-h-[80vh] overflow-y-auto">
              
              {/* LEFT COLUMN: GUIDED 5-FIELD FORM (7 Spans) */}
              <form onSubmit={handleSaveProduct} className="p-6 md:col-span-7 space-y-4 text-xs border-r border-[#E7E0DA]">
                
                {/* 1. Photo Dropzone */}
                <div>
                  <label className="font-semibold text-[#292624] block mb-1">
                    1. Jewellery Photo
                  </label>
                  {isOptimizingImage ? (
                    <div className="p-4 rounded-xl border border-[#E7E0DA] bg-[#FAF8F5] flex items-center justify-center space-x-2 text-[#A783A2]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="font-medium text-[11px]">Auto-compressing to lightweight WebP...</span>
                    </div>
                  ) : (
                    <label className="flex items-center space-x-3 p-3 rounded-2xl border-2 border-dashed border-[#D5CEC7] hover:border-[#A783A2] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-all cursor-pointer group">
                      <img
                        src={getOptimizedImageUrl(newProductForm.image)}
                        alt="Preview"
                        className="w-14 h-14 rounded-xl object-cover bg-white border border-[#E7E0DA] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-[#292624] block text-xs group-hover:text-[#A783A2] transition-colors">
                          Tap to Choose Photo from Phone/Computer
                        </span>
                        <span className="text-[10.5px] text-[#77716F] block mt-0.5">
                          Any phone photo works • Auto-compressed to ~35 KB
                        </span>
                      </div>
                      <Upload className="w-4 h-4 text-[#A783A2] shrink-0 mr-1" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoSelect(file);
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* 2. Design Title */}
                <div>
                  <label className="font-semibold text-[#292624] block mb-1">
                    2. Jewellery Name / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Kundan Jhumka with Pearl Drops"
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#A783A2]"
                  />
                </div>

                {/* 3. Category Selector */}
                <div>
                  <label className="font-semibold text-[#292624] block mb-1">
                    3. Category
                  </label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#A783A2] cursor-pointer"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.key} value={c.key}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Pricing (Selling Price vs Cut-Price MRP) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#292624] block mb-1">
                      4. Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="e.g. 2490"
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E7E0DA] bg-white text-xs font-bold text-[#292624] focus:outline-none focus:border-[#A783A2]"
                    />
                    <span className="text-[10px] text-[#77716F] block mt-0.5">What the customer pays</span>
                  </div>

                  <div>
                    <label className="font-semibold text-[#292624] block mb-1">
                      Cut Price / MRP (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 3490"
                      value={newProductForm.originalPrice}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E7E0DA] bg-white text-xs text-[#77716F] focus:outline-none focus:border-[#A783A2]"
                    />
                    <span className="text-[10px] text-[#77716F] block mt-0.5">
                      {newProductForm.originalPrice > newProductForm.price 
                        ? `Shows ${Math.round(((newProductForm.originalPrice - newProductForm.price) / newProductForm.originalPrice) * 100)}% OFF on card` 
                        : 'Optional struck-through price'}
                    </span>
                  </div>
                </div>

                {/* 5. Stock Count */}
                <div>
                  <label className="font-semibold text-[#292624] block mb-1">
                    5. How many pieces do you have? (Stock)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newProductForm.stockCount}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, stockCount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7E0DA] bg-white text-xs font-bold text-[#292624] focus:outline-none focus:border-[#A783A2]"
                  />
                </div>

                {/* Optional Expandable: Luxury Materials Details */}
                <div className="pt-2 border-t border-[#E7E0DA]">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedCraftFields(!showAdvancedCraftFields)}
                    className="text-xs font-semibold text-[#A783A2] hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{showAdvancedCraftFields ? '▼ Hide Material Details' : '▶ Optional: Edit Material & Purity Details'}</span>
                  </button>

                  {showAdvancedCraftFields && (
                    <div className="mt-3 space-y-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7E0DA]">
                      <div>
                        <label className="text-[11px] font-semibold text-[#292624] block mb-0.5">Metal & Polish</label>
                        <input
                          type="text"
                          value={newProductForm.metal}
                          onChange={(e) => setNewProductForm(prev => ({ ...prev, metal: e.target.value }))}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E7E0DA] bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#292624] block mb-0.5">Gemstones & Pearls</label>
                        <input
                          type="text"
                          value={newProductForm.gemstones}
                          onChange={(e) => setNewProductForm(prev => ({ ...prev, gemstones: e.target.value }))}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E7E0DA] bg-white text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Big Action Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[#A783A2] hover:bg-[#936E8F] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>✨ Put on Website (Publish Live)</span>
                  </button>
                </div>
              </form>

              {/* RIGHT COLUMN: LIVE STOREFRONT CARD PREVIEW (5 Spans) */}
              <div className="p-6 md:col-span-5 bg-[#FAF8F5] flex flex-col items-center justify-center">
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#A783A2] block mb-3">
                  Live Preview on Your Website
                </span>

                {/* Replica Product Card */}
                <div className="w-full max-w-[260px] bg-white rounded-2xl border border-[#E7E0DA] shadow-card overflow-hidden">
                  <div className="relative aspect-[4/5] bg-[#F4F1EC] overflow-hidden">
                    <img
                      src={getOptimizedImageUrl(newProductForm.image)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {newProductForm.originalPrice > newProductForm.price && (
                      <span className="absolute top-2.5 left-2.5 bg-[#292624] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        {Math.round(((newProductForm.originalPrice - newProductForm.price) / newProductForm.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 space-y-1">
                    <span className="text-[9.5px] uppercase tracking-wider text-[#A783A2] font-semibold block">
                      {categoryDisplayNames[newProductForm.category] || 'Jewellery'}
                    </span>
                    <h4 className="font-medium text-[#292624] text-xs truncate">
                      {newProductForm.name || 'Your Jewellery Title Here'}
                    </h4>
                    <div className="flex items-baseline space-x-2 pt-1">
                      <span className="font-bold text-sm text-[#292624]">
                        ₹{newProductForm.price.toLocaleString('en-IN')}
                      </span>
                      {newProductForm.originalPrice > newProductForm.price && (
                        <span className="text-[11px] text-[#77716F] line-through">
                          ₹{newProductForm.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[#77716F] text-center mt-4 max-w-[240px]">
                  ✓ This is exactly how customers will see your design on the shop page.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. DISPATCH / MARK AS SHIPPED MODAL                                   */}
      {/* ===================================================================== */}
      {shippingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E7E0DA] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E0DA]">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-sky-600" />
                <h3 className="font-serif text-base font-bold text-[#292624]">
                  Dispatch Order #{shippingOrder.id}
                </h3>
              </div>
              <button onClick={() => setShippingOrder(null)} className="p-1 rounded-full text-[#77716F] hover:bg-stone-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDispatchOrder} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#292624] block mb-1">Select Courier Partner</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full border border-[#E7E0DA] rounded-xl px-3 py-2 bg-white text-[#292624]"
                >
                  <option value="Blue Dart Express">Blue Dart Express</option>
                  <option value="Delhivery Express">Delhivery Express</option>
                  <option value="India Post Speed Post">India Post (Speed Post)</option>
                  <option value="DTDC Express">DTDC Express</option>
                  <option value="Shiprocket">Shiprocket</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#292624] block mb-1">Tracking Number (from postal slip)</label>
                <input
                  type="text"
                  placeholder="e.g. BLU982148201IN"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full border border-[#E7E0DA] rounded-xl px-3 py-2 bg-white text-[#292624] font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShippingOrder(null)}
                  className="px-4 py-2 rounded-xl border border-[#E7E0DA] text-[#77716F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-sm"
                >
                  ✓ Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. CREATE COUPON MODAL (3 SIMPLE STEPS)                               */}
      {/* ===================================================================== */}
      {isNewCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E7E0DA] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E0DA]">
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-[#A783A2]" />
                <h3 className="font-serif text-base font-bold text-[#292624]">Create Discount Code</h3>
              </div>
              <button onClick={() => setIsNewCouponModalOpen(false)} className="p-1 rounded-full text-[#77716F] hover:bg-stone-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#292624] block mb-1">Coupon Code Name</label>
                <input
                  type="text"
                  placeholder="e.g. DIWALI500"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full border border-[#E7E0DA] rounded-xl px-3 py-2 bg-white font-mono font-bold text-[#292624]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#292624] block mb-1">Discount Type</label>
                  <select
                    value={newDiscountType}
                    onChange={(e) => setNewDiscountType(e.target.value as any)}
                    className="w-full border border-[#E7E0DA] rounded-xl px-3 py-2 bg-white text-[#292624]"
                  >
                    <option value="fixed_amount">₹ Flat Rupee OFF</option>
                    <option value="percentage">% Percentage OFF</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#292624] block mb-1">Discount Amount</label>
                  <input
                    type="number"
                    min={1}
                    value={newDiscountAmount}
                    onChange={(e) => setNewDiscountAmount(Number(e.target.value))}
                    className="w-full border border-[#E7E0DA] rounded-xl px-3 py-2 bg-white font-bold text-[#292624]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#292624] block mb-1">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  min={1}
                  value={newMinOrder}
                  onChange={(e) => setNewMinOrder(Number(e.target.value))}
                  className="w-full border border-[#E7E0DA] rounded-xl px-3 py-2 bg-white text-[#292624]"
                />
              </div>

              {/* Plain English Translation of Coupon */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11.5px]">
                👉 <strong>Customer receives:</strong>{' '}
                {newDiscountType === 'percentage' ? `${newDiscountAmount}% OFF` : `₹${newDiscountAmount} OFF`}{' '}
                whenever they spend at least ₹{newMinOrder.toLocaleString('en-IN')}.
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewCouponModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E7E0DA] text-[#77716F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A783A2] hover:bg-[#936E8F] text-white font-semibold shadow-sm"
                >
                  ✓ Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. POPUP LIVE PREVIEW MODAL                                           */}
      {/* ===================================================================== */}
      {isPreviewFestiveOpen && (
        <WelcomeOfferModal
          isOpen={true}
          onClose={() => setIsPreviewFestiveOpen(false)}
          onApplyAndShop={() => setIsPreviewFestiveOpen(false)}
        />
      )}

      {/* ===================================================================== */}
      {/* 7. DATABASE DIAGNOSTICS MODAL (Quietly available if ever needed)      */}
      {/* ===================================================================== */}
      {isDiagnosticsOpen && (
        <DatabaseDiagnosticsModal
          isOpen={true}
          onClose={() => setIsDiagnosticsOpen(false)}
        />
      )}

    </div>
  );
};
