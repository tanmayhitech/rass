import React, { useState, useEffect, useMemo } from 'react';
import { getOptimizedImageUrl, handleImageError } from '../utils/imageOptimizer';
import { 
  ArrowLeft, 
  Package, 
  DollarSign, 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  Truck, 
  AlertTriangle, 
  TrendingUp, 
  FileSpreadsheet, 
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
  Barcode,
  Navigation,
  Eye,
  LogOut,
  Sliders,
  Layers,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Flame,
  Zap,
  Sparkles,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Menu,
  Database,
  Loader2,
  Copy,
  Smartphone,
  Monitor
} from 'lucide-react';
import { 
  Product, 
  Order, 
  ProductVariant, 
  InventoryMovement, 
  Coupon, 
  ProductCategory, 
  ProductStatus,
  ProductPerformance,
  AnalyticsSummary,
  AdminUser,
  FestiveCampaignConfig
} from '../types';
import { storeService } from '../services/storeService';
import { orderService } from '../services/orderService';
import { couponService } from '../services/couponService';
import { AnalyticsService } from '../services/analyticsService';
import { PDFService } from '../services/pdfService';
import { DatabaseDiagnosticsModal } from './DatabaseDiagnosticsModal';
import { AdminHomeMediaManager } from './AdminHomeMediaManager';
import { emailService } from '../services/emailService';
import { ImageService, ImageOptimizationResult } from '../services/imageService';
import { WelcomeOfferModal } from './WelcomeOfferModal';
import { uploadImageToCloud } from '../services/imageUploadService';
import confetti from 'canvas-confetti';

type AdminNavTab = 
  | 'overview' 
  | 'inventory' 
  | 'products' 
  | 'orders' 
  | 'coupons' 
  | 'performance' 
  | 'ledger'
  | 'home_media';

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
  // Navigation State
  const [activeTab, setActiveTab] = useState<AdminNavTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isSendingTestMail, setIsSendingTestMail] = useState(false);

  // Core Data safely initialized on first mount
  const [products, setProducts] = useState<Product[]>(() => storeService.getProducts(true));
  const [variants, setVariants] = useState<ProductVariant[]>(() => storeService.getVariants());
  const [orders, setOrders] = useState<Order[]>(() => orderService.getOrders());
  const [coupons, setCoupons] = useState<Coupon[]>(() => couponService.getCoupons(true));
  const [movements, setMovements] = useState<InventoryMovement[]>(() => storeService.getInventoryMovements());
  const [metrics, setMetrics] = useState<AnalyticsSummary | null>(() => {
    try {
      return AnalyticsService.getDashboardMetrics();
    } catch (e) {
      console.error('Failed to initialize dashboard metrics:', e);
      return null;
    }
  });
  const [performance, setPerformance] = useState<ProductPerformance[]>(() => {
    try {
      return AnalyticsService.getProductPerformance('units');
    } catch (e) {
      console.error('Failed to initialize performance metrics:', e);
      return [];
    }
  });
  const [categoryPerf, setCategoryPerf] = useState<any[]>(() => {
    try {
      return AnalyticsService.getCategoryPerformance();
    } catch (e) {
      console.error('Failed to initialize category performance:', e);
      return [];
    }
  });

  // Search & Filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [overviewOrderFilter, setOverviewOrderFilter] = useState<'all' | 'Processing' | 'Shipped' | 'Delivered'>('all');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStatusFilter, setProductStatusFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [productSortBy, setProductSortBy] = useState<'default' | 'stock_asc' | 'stock_desc' | 'price_asc' | 'price_desc'>('default');
  const [inventorySearch, setInventorySearch] = useState('');
  const [perfSortBy, setPerfSortBy] = useState<'netRevenue' | 'units'>('units');
  const [perfCategoryFilter, setPerfCategoryFilter] = useState('all');
  const [perfSearch, setPerfSearch] = useState('');

  // Modals & Slips
  // Manual Order Creation State (Private Concierge / WhatsApp Client Orders)
  const [isManualOrderModalOpen, setIsManualOrderModalOpen] = useState(false);
  const [manualOrderForm, setManualOrderForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    shippingAddress: '',
    city: '',
    state: 'Telangana',
    pincode: '',
    productId: '',
    quantity: 1,
    discountAmount: 0,
    paymentMethod: 'Prepaid UPI / Bank Transfer',
    paymentStatus: 'captured' as 'captured' | 'pending',
  });

  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isNewCouponModalOpen, setIsNewCouponModalOpen] = useState(false);
  const [previewInvoiceOrder, setPreviewInvoiceOrder] = useState<Order | null>(null);
  const [previewCourierSlipOrder, setPreviewCourierSlipOrder] = useState<Order | null>(null);
  const [festiveCampaign, setFestiveCampaign] = useState<FestiveCampaignConfig>(() => couponService.getFestiveCampaign());
  const [isPreviewFestiveOpen, setIsPreviewFestiveOpen] = useState(false);
  const [festivePreviewDevice, setFestivePreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [bestsellerChartMode, setBestsellerChartMode] = useState<'revenue' | 'units'>('revenue');

  // Direct Inventory Editing State
  const [quickAdjustVariant, setQuickAdjustVariant] = useState<ProductVariant | null>(null);
  const [quickAdjustUnits, setQuickAdjustUnits] = useState(5);
  const [quickAdjustReason, setQuickAdjustReason] = useState('Artisan Restock');

  // Tracking Assign Modal State
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [courierPartner, setCourierPartner] = useState('Shiprocket Express');
  const [awbNumber, setAwbNumber] = useState('');

  // Toast feedback
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  const loadLocalData = () => {
    setProducts(storeService.getProducts(true));
    setVariants(storeService.getVariants());
    setOrders(orderService.getOrders());
    setCoupons(couponService.getCoupons(true));
    setFestiveCampaign(couponService.getFestiveCampaign());
    setMovements(storeService.getInventoryMovements());
    setMetrics(AnalyticsService.getDashboardMetrics());
    setPerformance(AnalyticsService.getProductPerformance(perfSortBy));
    setCategoryPerf(AnalyticsService.getCategoryPerformance());
  };

  const refreshAllData = async (forceCloud = true) => {
    loadLocalData();
    if (forceCloud) {
      setIsSyncingCloud(true);
      try {
        await Promise.allSettled([
          storeService.syncWithSupabase(),
          orderService.syncWithSupabase(),
          couponService.syncWithSupabase(),
        ]);
        loadLocalData();
      } catch (e) {
        console.error('Error syncing cloud data:', e);
      } finally {
        setIsSyncingCloud(false);
      }
    }
  };

  // Initial Mount: Instant 0ms memory render + non-blocking background cloud sync
  useEffect(() => {
    loadLocalData();
    refreshAllData(true);
  }, []);

  // Update rankings instantly in-memory without firing network requests
  useEffect(() => {
    setPerformance(AnalyticsService.getProductPerformance(perfSortBy));
  }, [perfSortBy]);

  // Category default studio photography mappings
  const categoryDefaultImages: Record<ProductCategory, { image: string; cleanImage: string }> = {
    rings: { image: '/images/cat_rings.png', cleanImage: '/images/clean_cat_rings.png' },
    earrings: { image: '/images/Pastel Tribal Silver Jhumka Earrings.png', cleanImage: '/images/Pastel Tribal Silver Jhumka Earrings.png' },
    jhumka: { image: '/images/cat_jhumka.png', cleanImage: '/images/clean_cat_jhumka.png' },
    'kangan-sets': { image: '/images/cat_kangan_sets.png', cleanImage: '/images/clean_cat_kangan_sets.png' },
    kangna: { image: '/images/cat_kangna_1.png', cleanImage: '/images/clean_cat_kangna_1.png' },
    necklaces: { image: '/images/cat_necklaces.png', cleanImage: '/images/clean_cat_necklaces.png' },
    bracelets: { image: '/images/cat_bracelets.png', cleanImage: '/images/clean_cat_bracelets.png' },
    tribal: { image: '/images/cat_silver_choker.png', cleanImage: '/images/cat_silver_choker.png' },
    western: { image: '/images/cat_western.png', cleanImage: '/images/cat_western.png' },
    kadas: { image: '/images/card_bg_kadas.png', cleanImage: '/images/card_bg_kadas.png' },
    accessories: { image: '/images/cat_earpins_bugadi.png', cleanImage: '/images/cat_earpins_bugadi.png' },
    toran: { image: '/images/cat_toran.png', cleanImage: '/images/clean_cat_toran.png' },
  };

  const categoryCodes: Record<ProductCategory, string> = {
    rings: 'RNG',
    earrings: 'EAR',
    jhumka: 'JHM',
    'kangan-sets': 'KNG',
    kangna: 'KGA',
    necklaces: 'NCK',
    bracelets: 'BRC',
    tribal: 'TRB',
    western: 'WST',
    kadas: 'KAD',
    accessories: 'ACC',
    toran: 'TRN',
  };

  const categoryDisplayNames: Record<ProductCategory, string> = {
    rings: 'Rings',
    earrings: 'Earrings',
    jhumka: 'Dome Jhumka',
    'kangan-sets': 'Kangan Sets',
    kangna: 'Kangna',
    necklaces: 'Necklaces',
    bracelets: 'Bracelets',
    tribal: 'Tribal Jewellery',
    western: 'Western Jewellery',
    kadas: 'Kadas & Bangles',
    accessories: 'Earpins & Bugadi',
    toran: 'Home Decor & Toran',
  };

  const generateCategorySku = (cat: ProductCategory) => {
    const code = categoryCodes[cat] || 'JEW';
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `RASS-${code}-${rand}`;
  };

  const getInitialProductForm = () => ({
    name: '',
    category: 'western' as ProductCategory,
    categoryDisplay: 'Western Jewellery',
    price: 1450,
    costPrice: 650,
    sku: generateCategorySku('western'),
    description: 'Handcrafted contemporary jewellery sculpted with artisan precision, anti-tarnish protective coating and skin-safe finish.',
    metal: 'Solid Brass with 18k Micro Gold Polish',
    gemstones: 'Cubic Zirconia & Crystal',
    dimensions: '42cm length + 5cm extender',
    weight: '7.5g',
    details: [
      '100% Hypoallergenic & Skin-safe (Lead & Nickel Free)',
      'Triple micro-plated for enduring high-luster shine',
      'Artisan crafted with protective anti-tarnish seal'
    ],
    initialStock: 5,
    lowStockThreshold: 1,
    image: '/images/cat_western.png',
    cleanImage: '/images/cat_western.png',
    imageUploadMode: 'upload' as 'upload' | 'gallery' | 'url',
  });

  // Form State for NEW Product
  const [newProductForm, setNewProductForm] = useState(getInitialProductForm);
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);
  const [imageOptimizationInfo, setImageOptimizationInfo] = useState<ImageOptimizationResult | null>(null);

  const handleProductImageUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotification('Please upload an image file (PNG, JPG, WEBP).', 'error');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showNotification('Image size is larger than 15MB. Please choose a smaller image.', 'error');
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
      showNotification(
        res.isCloudUrl
          ? `Image optimized & uploaded to Cloud CDN (${res.savedPercentage}% saved, ${Math.round(res.optimizedSize / 1024)} KB)`
          : `Image optimized locally (${res.savedPercentage}% space saved)`
      );
    } catch (err: any) {
      showNotification(err.message || 'Image processing failed', 'error');
    } finally {
      setIsOptimizingImage(false);
    }
  };

  const handleSaveNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const defaultImg = categoryDefaultImages[newProductForm.category]?.image || '/images/cat_western.png';
      const defaultClean = categoryDefaultImages[newProductForm.category]?.cleanImage || '/images/clean_cat_western.png';

      let finalImg = newProductForm.image || defaultImg;
      let finalClean = newProductForm.cleanImage || newProductForm.image || defaultClean;

      // If user uploaded a local image (data: URL), upload directly to Supabase Cloud Storage (CDN)
      if (finalImg.startsWith('data:')) {
        showNotification('Uploading image to Supabase Cloud Storage...', 'success');
        const uploadRes = await uploadImageToCloud(finalImg, newProductForm.sku || 'product', 'products');
        if (uploadRes.success && uploadRes.publicUrl) {
          finalImg = uploadRes.publicUrl;
          finalClean = uploadRes.publicUrl;
        }
      }

      storeService.createProduct({
        name: newProductForm.name,
        category: newProductForm.category,
        categoryDisplay: newProductForm.categoryDisplay,
        price: Number(newProductForm.price),
        costPrice: Number(newProductForm.costPrice),
        image: finalImg,
        cleanImage: finalClean,
        description: newProductForm.description,
        details: Array.isArray(newProductForm.details) && newProductForm.details.length > 0
          ? newProductForm.details
          : [
              `Handcrafted in ${newProductForm.metal}`,
              `Adorned with genuine ${newProductForm.gemstones}`,
              '100% Hypoallergenic & Skin-safe (Lead & Nickel Free)',
              'Accompanied by suede presentation box & certificate of authenticity',
            ],
        metal: newProductForm.metal,
        gemstones: newProductForm.gemstones,
        dimensions: newProductForm.dimensions,
        weight: newProductForm.weight,
        sku: newProductForm.sku,
        initialStock: Number(newProductForm.initialStock),
        lowStockThreshold: Number(newProductForm.lowStockThreshold),
        status: 'published',
      });
      showNotification(`Product "${newProductForm.name}" created with SKU ${newProductForm.sku}`);
      setNewProductForm(getInitialProductForm());
      setImageOptimizationInfo(null);
      setIsNewProductModalOpen(false);
      refreshAllData();
      if (onRefreshStorefront) onRefreshStorefront();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // Safe Deletion & Status Toggles
  const handleToggleProductStatus = (prod: Product) => {
    try {
      const next: ProductStatus = prod.status === 'published' ? 'inactive' : 'published';
      storeService.setProductStatus(prod.id, next);
      showNotification(`"${prod.name}" status updated to ${next.toUpperCase()}`);
      refreshAllData();
      if (onRefreshStorefront) onRefreshStorefront();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleArchiveProduct = (prod: Product) => {
    try {
      storeService.archiveProduct(prod.id);
      showNotification(`"${prod.name}" archived successfully`);
      refreshAllData();
      if (onRefreshStorefront) onRefreshStorefront();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteProductSafely = (prod: Product) => {
    if (!window.confirm(`Permanently delete "${prod.name}"? If it has historical orders, deletion is strictly blocked.`)) {
      return;
    }
    try {
      const res = storeService.deleteProductSafely(prod.id);
      showNotification(res.message);
      refreshAllData();
      if (onRefreshStorefront) onRefreshStorefront();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // FULLY WORKING INVENTORY UPDATES (MODULE 2)
  // --------------------------------------------------------------------------
  const handleQuickStockStep = (variant: ProductVariant, step: number) => {
    try {
      storeService.adjustStock({
        variantId: variant.id,
        quantityChange: step,
        movementType: step > 0 ? 'purchase_receipt' : 'manual_adjustment',
        notes: step > 0 ? 'Quick stock increment (+1)' : 'Quick stock decrement (-1)',
        createdBy: 'admin@rassbyriddhima.com',
      });
      showNotification(`Stock for ${variant.sku}: ${variant.stockQuantity + step} units`);
      refreshAllData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleApplyQuickRestockModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAdjustVariant) return;
    try {
      storeService.adjustStock({
        variantId: quickAdjustVariant.id,
        quantityChange: quickAdjustUnits,
        movementType: quickAdjustUnits >= 0 ? 'purchase_receipt' : 'manual_adjustment',
        notes: quickAdjustReason || 'Batch restock',
        createdBy: 'admin@rassbyriddhima.com',
      });
      showNotification(`Updated ${quickAdjustVariant.sku}: ${quickAdjustVariant.stockQuantity + quickAdjustUnits} units`);
      setQuickAdjustVariant(null);
      refreshAllData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // Order Lifecycle
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      showNotification(`Updating order ${orderId} to ${status}...`);
      const updated = await orderService.updateOrderStatus(orderId, status);
      if (updated.emailResult?.success) {
        showNotification(`Order ${orderId} set to ${status} • Resend email sent to ${updated.emailResult.recipient} (ID: ${updated.emailResult.id?.slice(0, 8)}...)`);
      } else {
        showNotification(`Order ${orderId} set to ${status} (Email notice: ${updated.emailResult?.error || 'Failed'})`, 'error');
      }
      refreshAllData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleCancelOrderWithRestock = async (orderId: string) => {
    const reason = window.prompt('Reason for order cancellation (items will be automatically returned to stock):', 'Customer cancellation request');
    if (!reason) return;
    try {
      showNotification(`Cancelling order ${orderId}...`);
      const updated = await orderService.cancelOrder(orderId, reason);
      if (updated.emailResult?.success) {
        showNotification(`Order ${orderId} cancelled & restocked • Resend email sent (ID: ${updated.emailResult.id?.slice(0, 8)}...)`);
      } else {
        showNotification(`Order ${orderId} cancelled (Email notice: ${updated.emailResult?.error || 'Failed'})`, 'error');
      }
      refreshAllData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handlePermanentlyDeleteOrder = async (orderId: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to PERMANENTLY delete order #${orderId}?\n\nThis will remove it completely from all order lists and records. This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      showNotification(`Permanently deleting order ${orderId}...`);
      const res = await orderService.deleteOrder(orderId);
      if (res.success) {
        showNotification(`Order ${orderId} permanently deleted.`);
      } else {
        showNotification(res.message, 'error');
      }
      refreshAllData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingOrder || !awbNumber.trim()) return;
    try {
      showNotification(`Assigning tracking to ${trackingOrder.id}...`);
      const updated = await orderService.updateTracking({
        orderId: trackingOrder.id,
        courierPartner,
        awbNumber: awbNumber.trim(),
      });
      if (updated.emailResult?.success) {
        showNotification(`AWB ${awbNumber} assigned (${courierPartner}) • Resend email sent (ID: ${updated.emailResult.id?.slice(0, 8)}...)`);
      } else {
        showNotification(`AWB ${awbNumber} assigned (Email notice: ${updated.emailResult?.error || 'Failed'})`, 'error');
      }
      setTrackingOrder(null);
      setAwbNumber('');
      refreshAllData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingTestMail(true);
    try {
      const result = await emailService.sendOrderStatusUpdateEmail({
        id: 'RASS-TEST-SAMPLE',
        customerName: 'Verified Administrator',
        email: 'rassbyridhima1@gmail.com',
        phone: '+91 98201 11223',
        shippingAddress: '42, Vasant Vihar, Poorvi Marg',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110057',
        country: 'India',
        items: [],
        itemSnapshots: [
          {
            id: 'sample-snap',
            productId: 'sample-1',
            productTitle: 'Gulshan Emerald & Seed Pearl Cocktail Ring',
            variantName: 'Custom Size 12',
            sku: 'RASS-RNG-01',
            imageUrl: '',
            unitPrice: 18500,
            quantity: 1,
            lineSubtotal: 18500,
          }
        ],
        subtotal: 18500,
        discount: 1850,
        shippingFee: 0,
        tax: 0,
        total: 16650,
        date: new Date().toLocaleDateString('en-IN'),
        orderTime: '12:00 PM',
        status: 'Shipped',
        paymentStatus: 'captured',
        fulfilmentStatus: 'shipped',
        paymentMethod: 'Razorpay UPI (Prepaid)',
        awbNumber: 'SR-TEST-849102-DL',
        courierPartner: 'BlueDart Express',
        trackingUrl: 'https://track.bluedart.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (result.success) {
        showNotification(`Resend test email dispatched successfully (ID: ${result.id})`);
      } else {
        showNotification(`Resend response: ${result.error}`, 'error');
      }
    } catch (err: any) {
      showNotification(`Failed to send test email: ${err.message}`, 'error');
    } finally {
      setIsSendingTestMail(false);
    }
  };

  // Coupon Creation
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed_amount',
    discountValue: 15,
    minOrderValue: 25000,
    maxDiscountCap: 5000,
    maxRedemptions: 100,
    maxPerCustomer: 1,
  });

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedProduct = products.find(p => p.id === manualOrderForm.productId) || products[0];
      if (!selectedProduct) {
        showNotification('Please select a jewellery piece for this order.', 'error');
        return;
      }
      if (!manualOrderForm.customerName.trim() || !manualOrderForm.phone.trim()) {
        showNotification('Client name and contact phone are required.', 'error');
        return;
      }

      const qty = Math.max(1, Number(manualOrderForm.quantity) || 1);
      const lineTotal = selectedProduct.price * qty;
      const discount = Math.min(lineTotal, Math.max(0, Number(manualOrderForm.discountAmount) || 0));
      const grandTotal = Math.max(0, lineTotal - discount);

      showNotification('Generating verified order token and reserving vault inventory...');

      const newOrder = await orderService.createOrder({
        customerName: manualOrderForm.customerName.trim(),
        email: manualOrderForm.email.trim() || 'concierge@rassbyriddhima.com',
        phone: manualOrderForm.phone.trim(),
        shippingAddress: manualOrderForm.shippingAddress.trim() || 'Private Client Studio Delivery',
        city: manualOrderForm.city.trim() || 'Hyderabad',
        state: manualOrderForm.state.trim() || 'Telangana',
        pincode: manualOrderForm.pincode.trim() || '500034',
        country: 'India',
        items: [{ product: selectedProduct, quantity: qty } as any],
        subtotal: lineTotal,
        discount,
        shippingFee: 0,
        total: grandTotal,
        paymentMethod: manualOrderForm.paymentMethod,
        paymentStatus: manualOrderForm.paymentStatus,
        appliedCoupon: discount > 0 ? 'CONCIERGE-PRIVILEGE' : undefined,
      });

      showNotification(`Order #${newOrder.id} successfully created for ${newOrder.customerName}`);
      setIsManualOrderModalOpen(false);
      setManualOrderForm({
        customerName: '',
        phone: '',
        email: '',
        shippingAddress: '',
        city: '',
        state: 'Telangana',
        pincode: '',
        productId: '',
        quantity: 1,
        discountAmount: 0,
        paymentMethod: 'Prepaid UPI / Bank Transfer',
        paymentStatus: 'captured',
      });
      refreshAllData();
      if (onRefreshStorefront) onRefreshStorefront();
      setPreviewInvoiceOrder(newOrder);
    } catch (err: any) {
      showNotification(err.message || 'Failed to create manual order.', 'error');
    }
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      couponService.createCoupon({
        code: couponForm.code,
        discountType: couponForm.discountType,
        discountValue: Number(couponForm.discountValue),
        minOrderValue: Number(couponForm.minOrderValue),
        maxDiscountCap: Number(couponForm.maxDiscountCap),
        maxRedemptions: Number(couponForm.maxRedemptions),
        maxPerCustomer: Number(couponForm.maxPerCustomer),
      });
      showNotification(`Coupon ${couponForm.code.toUpperCase()} activated`);
      setIsNewCouponModalOpen(false);
      refreshAllData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // Filtered Lists & Analytics (Optimized with useMemo to prevent main-thread lag)
  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      if (productSearch.trim()) {
        const query = productSearch.toLowerCase().trim();
        const matchName = (p.name || '').toLowerCase().includes(query);
        const matchSku = (p.sku || p.id || '').toLowerCase().includes(query);
        const matchCat = (p.categoryDisplay || p.category || '').toLowerCase().includes(query);
        if (!matchName && !matchSku && !matchCat) return false;
      }
      if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
      if (productStatusFilter !== 'all' && p.status !== productStatusFilter) return false;
      return true;
    });

    if (productSortBy === 'stock_asc') {
      return [...list].sort((a, b) => (a.stockCount ?? 0) - (b.stockCount ?? 0));
    }
    if (productSortBy === 'stock_desc') {
      return [...list].sort((a, b) => (b.stockCount ?? 0) - (a.stockCount ?? 0));
    }
    if (productSortBy === 'price_asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (productSortBy === 'price_desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, productSearch, productCategoryFilter, productStatusFilter, productSortBy]);

  // Fast Product Table Pagination (12 designs per page)
  const [productPage, setProductPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;
  const totalProductPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (productPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, productPage]);

  // Reset page when filter changes
  useEffect(() => {
    setProductPage(1);
  }, [productCategoryFilter, productStatusFilter, productSearch, productSortBy]);

  const filteredVariants = useMemo(() => {
    if (!inventorySearch.trim()) return variants;
    const q = inventorySearch.toLowerCase();
    return variants.filter((v) => {
      const prod = products.find((p) => p.id === v.productId);
      return v.sku.toLowerCase().includes(q) || (prod && prod.name.toLowerCase().includes(q));
    });
  }, [variants, products, inventorySearch]);

  const filteredOrders = useMemo(() => {
    return orderService.getOrders({
      status: orderStatusFilter,
      search: orderSearch,
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Fast Order Table Pagination (15 orders per page to prevent DOM bloat & lag)
  const [orderPage, setOrderPage] = useState(1);
  const ORDERS_PER_PAGE = 15;
  const totalOrderPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * ORDERS_PER_PAGE;
    return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
  }, [filteredOrders, orderPage]);

  // Reset order page when filter changes
  useEffect(() => {
    setOrderPage(1);
  }, [orderStatusFilter, orderSearch]);

  const stockValuation = useMemo(() => {
    return storeService.getStockValuation();
  }, [variants, products]);

  // Enhanced Print Handlers for Invoices & Courier Slips
  const handleTriggerPrint = (targetType: 'invoice' | 'slip' = 'invoice') => {
    const selector = targetType === 'slip' ? '.printable-courier-slip' : '.printable-invoice';
    const printEl = document.querySelector(selector) as HTMLElement | null;

    if (printEl) {
      try {
        const printWindow = window.open('', '_blank', 'width=880,height=960');
        if (printWindow) {
          const title = targetType === 'slip'
            ? `Courier Shipping Slip — ${previewCourierSlipOrder?.id || 'Rass by Ridhima'}`
            : `Tax Invoice — ${previewInvoiceOrder?.id || 'Rass by Ridhima'}`;

          printWindow.document.open();
          printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      @page {
        size: A4 portrait;
        margin: 10mm 12mm;
      }
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      body {
        margin: 0;
        padding: 16px;
        background: #ffffff !important;
        color: #292624 !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 12px;
        line-height: 1.5;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        padding: 8px 10px;
        border-bottom: 1px solid #E7E0DA;
      }
      th {
        border-bottom: 2px solid #292624;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 10px;
        color: #292624;
      }
      .printable-invoice, .printable-courier-slip {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 auto !important;
        padding: 0 !important;
        background: #ffffff !important;
        box-shadow: none !important;
        border: none !important;
      }
      @media print {
        body { padding: 0 !important; }
      }
    </style>
    <link rel="stylesheet" href="/src/index.css" />
  </head>
  <body>
    ${printEl.outerHTML}
    <script>
      window.onload = function() {
        setTimeout(function() {
          window.focus();
          window.print();
        }, 250);
      };
    </script>
  </body>
</html>`);
          printWindow.document.close();
          return;
        }
      } catch (err) {
        console.warn('Popup print exception, falling back to window.print():', err);
      }
    }
    window.print();
  };

  return (
    <div className="flex h-screen bg-[#FAF8F5] text-[#292624] font-sans antialiased overflow-hidden selection:bg-[#E2D5E5] selection:text-[#292624]">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-subtle border text-xs font-medium flex items-center space-x-2.5 animate-slideDown ${
          notification.type === 'error'
            ? 'bg-[#FDF2F0] border-[#F8D4CF] text-[#8F3B30]'
            : 'bg-[#EEF3EC] border-[#D3E0CE] text-[#3B5432]'
        }`}>
          {notification.type === 'error' ? <AlertTriangle className="w-4 h-4 shrink-0 text-[#8F3B30]" /> : <CheckCircle className="w-4 h-4 shrink-0 text-[#3B5432]" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 1A. MOBILE DRAWER BACKDROP & OFF-CANVAS SLIDE-OVER */}
      {/* ===================================================================== */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-xs transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Mobile Off-Canvas Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1F1D1B] text-[#E7E0DA] flex flex-col justify-between transform transition-transform duration-250 ease-in-out md:hidden shadow-2xl border-r border-[#2D2926] ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Mobile Drawer Header */}
          <div className="h-14 px-4 border-b border-[#2D2926] flex items-center justify-between">
            <div className="flex items-center space-x-2 py-1">
              <img
                src={getOptimizedImageUrl('/images/Rass by Ridhima Wordmark.png')}
                alt="Rass by Riddhima"
                className="h-6 w-auto object-contain brightness-0 invert opacity-95 select-none"
                loading="eager"
                {...({ fetchpriority: "high" } as any)}
                decoding="async"
              />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-md text-[#9E9793] hover:text-[#FAF8F5] hover:bg-[#2B2724] transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items in Drawer */}
          <nav className="p-3 space-y-1.5 text-xs">
            {[
              { id: 'overview', label: 'Overview', icon: DollarSign },
              { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: orders.length > 0 ? `${orders.length}` : undefined },
              { id: 'products', label: 'Products & Stock', icon: Package, badge: stockValuation.lowStockSKUs > 0 ? `${stockValuation.lowStockSKUs} low` : undefined },
              { id: 'performance', label: 'Best Sellers', icon: TrendingUp },
              { id: 'coupons', label: 'Coupons', icon: Tag },
              { id: 'ledger', label: 'Order Ledger', icon: FileSpreadsheet },
              { id: 'home_media', label: 'Home Media', icon: ImageIcon },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as AdminNavTab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#2B2724] text-[#FAF8F5] font-semibold border-l-2 border-[#B49A6C]'
                      : 'text-[#9E9793] hover:bg-[#272320] hover:text-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#B49A6C]' : 'text-[#77716F]'}`} />
                    <span className="text-xs">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] rounded bg-[#2D2825] text-[#D8CFBC] border border-[#3D3733] font-medium">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-[#2D2926] space-y-2">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onBackToStore();
            }}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-[#C2BCB6] hover:text-[#FAF8F5] hover:bg-[#2B2724] text-xs font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Back to Storefront</span>
          </button>

          <div className="px-3 py-2 rounded-lg bg-[#161413] border border-[#2D2926] text-xs text-[#9E9793] flex items-center justify-between">
            <div>
              <span className="font-medium text-[#FAF8F5] block">Store Console</span>
              <span className="text-[10px] text-[#B49A6C]">Live & Secure</span>
            </div>
            <button
              onClick={() => {
                refreshAllData();
                showNotification('Store data refreshed');
              }}
              title="Refresh Data"
              className="p-1.5 rounded text-[#9E9793] hover:text-[#FAF8F5] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1B. DESKTOP MINIMAL STORE SIDEBAR */}
      {/* ===================================================================== */}
      <aside className={`hidden md:flex bg-[#1F1D1B] text-[#E7E0DA] flex-col justify-between shrink-0 transition-all duration-200 z-30 select-none border-r border-[#2D2926] ${
        isSidebarCollapsed ? 'w-16' : 'w-60'
      }`}>
        <div>
          {/* Brand & Portal Header */}
          <div className="h-14 px-4 border-b border-[#2D2926] flex items-center justify-between">
            {!isSidebarCollapsed ? (
              <div className="flex items-center space-x-2 py-1">
                <img
                  src={getOptimizedImageUrl('/images/Rass by Ridhima Wordmark.png')}
                  alt="Rass by Riddhima"
                  className="h-6 w-auto object-contain brightness-0 invert opacity-95 select-none"
                  loading="eager"
                  {...({ fetchpriority: "high" } as any)}
                  decoding="async"
                />
              </div>
            ) : (
              <div className="w-full flex justify-center py-1">
                <Sparkles className="w-4 h-4 text-[#B49A6C]" />
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 rounded text-[#9E9793] hover:text-[#FAF8F5] transition-colors cursor-pointer"
              title="Toggle sidebar"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-2 space-y-1 text-xs">
            {[
              { id: 'overview', label: 'Overview', icon: DollarSign },
              { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: orders.length > 0 ? `${orders.length}` : undefined },
              { id: 'products', label: 'Products & Stock', icon: Package, badge: stockValuation.lowStockSKUs > 0 ? `${stockValuation.lowStockSKUs} low` : undefined },
              { id: 'performance', label: 'Best Sellers', icon: TrendingUp },
              { id: 'coupons', label: 'Coupons', icon: Tag },
              { id: 'ledger', label: 'Order Ledger', icon: FileSpreadsheet },
              { id: 'home_media', label: 'Home Media', icon: ImageIcon },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminNavTab)}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2 rounded-md transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#2B2724] text-[#FAF8F5] font-medium border-l-2 border-[#B49A6C]'
                      : 'text-[#9E9793] hover:bg-[#272320] hover:text-[#FAF8F5]'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#B49A6C]' : 'text-[#77716F]'}`} />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isSidebarCollapsed && item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-[#2D2825] text-[#D8CFBC] border border-[#3D3733] font-medium">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-2.5 border-t border-[#2D2926] space-y-2">
          <button
            onClick={onBackToStore}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-1' : 'space-x-2 px-3'} py-1.5 rounded-md text-[#C2BCB6] hover:text-[#FAF8F5] hover:bg-[#2B2724] text-xs transition-colors cursor-pointer`}
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            {!isSidebarCollapsed && <span>Back to Store</span>}
          </button>

          {!isSidebarCollapsed && (
            <div className="px-3 py-2 rounded-md bg-[#161413] border border-[#2D2926] text-[11px] text-[#9E9793] flex items-center justify-between">
              <div>
                <span className="font-medium text-[#FAF8F5] block">Store Console</span>
                <span className="text-[10px] text-[#B49A6C]">Live & Secure</span>
              </div>
              <button
                type="button"
                onClick={() => refreshAllData(true)}
                title="Refresh Live Data"
                className="p-1 text-[#9E9793] hover:text-[#FAF8F5] transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncingCloud ? 'animate-spin text-[#B49A6C]' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* 2. MAIN ADMIN CONTENT CONTAINER */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Minimal Clean Top Toolbar */}
        <header className="h-14 bg-white border-b border-[#E7E0DA] px-3 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 -ml-1 rounded-lg text-[#292624] hover:bg-[#FAF8F5] cursor-pointer transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 text-[#292624]" />
            </button>

            {/* Mobile Wordmark Pill */}
            <div className="md:hidden flex items-center pr-2 border-r border-[#E7E0DA]">
              <img
                src={getOptimizedImageUrl('/images/Rass by Ridhima Wordmark.png')}
                alt="Rass"
                className="h-4 sm:h-5 w-auto object-contain"
                loading="eager"
                {...({ fetchpriority: "high" } as any)}
                decoding="async"
              />
            </div>

            <h2 className="text-xs sm:text-sm font-semibold text-[#292624] capitalize tracking-wide truncate max-w-[130px] sm:max-w-none">
              {activeTab === 'performance' ? 'Best Sellers' : activeTab === 'home_media' ? 'Home Media Manager' : activeTab === 'products' ? 'Products & Stock' : activeTab.replace('_', ' ')}
            </h2>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {(activeTab === 'orders' || activeTab === 'overview') && (
              <button
                onClick={() => {
                  setManualOrderForm(prev => ({ ...prev, productId: products[0]?.id || '' }));
                  setIsManualOrderModalOpen(true);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#292624] hover:bg-[#1C1A18] text-white text-xs font-medium cursor-pointer transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#B49A6C]" />
                <span className="hidden sm:inline">Create Order</span>
                <span className="sm:hidden text-xs">Order</span>
              </button>
            )}

            {activeTab === 'products' && (
              <button
                onClick={() => {
                  setNewProductForm(getInitialProductForm());
                  setIsNewProductModalOpen(true);
                }}
                className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-md bg-[#292624] hover:bg-[#1C1A18] text-white text-xs font-medium cursor-pointer transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#B49A6C]" />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden text-xs">Add</span>
              </button>
            )}

            {activeTab === 'coupons' && (
              <button
                onClick={() => setIsNewCouponModalOpen(true)}
                className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-md bg-[#292624] hover:bg-[#1C1A18] text-white text-xs font-medium cursor-pointer transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#B49A6C]" />
                <span className="hidden sm:inline">Create Coupon</span>
                <span className="sm:hidden text-xs">New</span>
              </button>
            )}

            <button
              onClick={() => AnalyticsService.downloadLedgerCSV(orders)}
              className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-md border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#292624] cursor-pointer transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#77716F]" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden text-xs">CSV</span>
            </button>

            {/* Sleek System Health & Diagnostic Quick Triggers */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#E7E0DA]">
              <button
                onClick={() => setIsDiagnosticsOpen(true)}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg hover:bg-white text-[11px] font-medium text-[#77716F] hover:text-[#292624] cursor-pointer transition-all shadow-2xs"
                title="PostgreSQL database diagnostics & RLS status"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>DB Online</span>
              </button>

              <button
                onClick={handleSendTestEmail}
                disabled={isSendingTestMail}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg hover:bg-white text-[11px] font-medium text-[#77716F] hover:text-[#292624] cursor-pointer transition-all shadow-2xs disabled:opacity-40"
                title="Send test status email via Resend"
              >
                <Mail className="w-3 h-3 text-[#A783A2]" />
                <span>{isSendingTestMail ? 'Sending...' : 'Mail Test'}</span>
              </button>
            </div>

            {/* Admin User Pill */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-[#FAF8F5] rounded-md border border-[#E7E0DA] text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B49A6C]" />
              <span className="font-medium text-[#292624] truncate max-w-[130px]" title={currentUser?.email || 'admin@rassbyriddhima.com'}>
                {currentUser?.email ? currentUser.email.split('@')[0] : 'admin'}
              </span>
            </div>

            {/* Log Out Button */}
            {onLogout && (
              <button
                onClick={() => {
                  if (window.confirm('Log out of administrative session and return to storefront?')) {
                    onLogout();
                  }
                }}
                className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-md border border-[#E7E0DA] bg-white hover:bg-red-50 hover:border-red-200 text-xs font-medium text-[#77716F] hover:text-red-700 cursor-pointer transition-colors shadow-xs"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Content Body (With safe bottom spacing for mobile navigation dock) */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 pb-24 md:pb-6 space-y-5 sm:space-y-6">

          {/* ----------------------------------------------------------------- */}
          {/* ----------------------------------------------------------------- */}
          {/* ----------------------------------------------------------------- */}
          {/* TAB: OVERVIEW — RASS STORE EXECUTIVE OPERATIONS PORTAL */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'overview' && metrics && (
            <div className="space-y-6">
              
              {/* 1. Serene Executive Greeting Banner */}
              <div className="bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E7E0DA] flex items-center justify-center shrink-0 p-2 shadow-2xs">
                    <img
                      src={getOptimizedImageUrl('/images/Rass by Ridhima Wordmark.png')}
                      alt="Rass by Riddhima"
                      className="w-full h-auto object-contain select-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h2 className="text-base sm:text-lg font-serif font-bold text-[#292624]">
                        Store Overview
                      </h2>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span>Storefront Live</span>
                      </span>
                    </div>
                    <p className="text-xs text-[#77716F] mt-0.5">
                      Real-time snapshot of your jewellery sales, orders, and stock.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setNewProductForm(getInitialProductForm());
                      setIsNewProductModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#292624] hover:bg-[#1C1A18] text-white text-xs font-semibold cursor-pointer transition-all shadow-xs active:scale-95 flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#B49A6C]" />
                    <span>Add Product</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onBackToStore()}
                    className="px-4 py-2 rounded-xl border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#292624] cursor-pointer transition-all shadow-2xs active:scale-95 flex items-center space-x-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#77716F]" />
                    <span>View Storefront</span>
                  </button>
                </div>
              </div>

              {/* 2. Four Clean KPI Metric Cards (Uniform Warm Champagne Luxury Tone) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Today's Net Sales */}
                <div className="p-5 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs hover:border-[#B49A6C]/40 hover:shadow-subtle transition-all duration-300 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between text-[#77716F]">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider">Today's Sales</span>
                    <div className="w-8 h-8 rounded-xl bg-[#FAF5EC] border border-[#EFE3CF] flex items-center justify-center text-[#B49A6C]">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-[#292624] tracking-tight block">
                      ₹{metrics.netSalesToday.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-[#77716F] mt-1 block">
                      Gross sales: ₹{metrics.grossSalesToday.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* 2. Total Captured Revenue */}
                <div className="p-5 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs hover:border-[#B49A6C]/40 hover:shadow-subtle transition-all duration-300 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between text-[#77716F]">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider">Total Sales</span>
                    <div className="w-8 h-8 rounded-xl bg-[#FAF5EC] border border-[#EFE3CF] flex items-center justify-center text-[#B49A6C]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-[#292624] tracking-tight block">
                      ₹{metrics.paidRevenueTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-[#77716F] mt-1 block">
                      Across all {orders.length} orders
                    </span>
                  </div>
                </div>

                {/* 3. Total Orders */}
                <div className="p-5 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs hover:border-[#B49A6C]/40 hover:shadow-subtle transition-all duration-300 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between text-[#77716F]">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider">Total Orders</span>
                    <div className="w-8 h-8 rounded-xl bg-[#FAF5EC] border border-[#EFE3CF] flex items-center justify-center text-[#B49A6C]">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-[#292624] tracking-tight block">
                      {metrics.totalOrdersCount} <span className="text-sm font-normal text-[#77716F] font-sans">orders</span>
                    </span>
                    <span className="text-[11px] text-[#77716F] mt-1 block">
                      Avg. order: ₹{metrics.averageOrderValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* 4. Ready Stock on Hand */}
                <div className="p-5 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs hover:border-[#B49A6C]/40 hover:shadow-subtle transition-all duration-300 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between text-[#77716F]">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider">Stock on Hand</span>
                    <div className="w-8 h-8 rounded-xl bg-[#FAF5EC] border border-[#EFE3CF] flex items-center justify-center text-[#B49A6C]">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-2xl sm:text-3xl font-bold font-mono text-[#292624] tracking-tight">
                        {stockValuation.totalUnits}
                      </span>
                      <span className="text-xs text-[#77716F]">pieces</span>
                    </div>
                    <div className="text-[11px] text-[#77716F] mt-1 flex items-center justify-between">
                      <span>Val: ₹{stockValuation.retailValuation.toLocaleString('en-IN')}</span>
                      {stockValuation.lowStockSKUs > 0 ? (
                        <span className="text-[#8F3B30] font-semibold">
                          {stockValuation.lowStockSKUs} low
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">Healthy</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* 3. Action Required Notice Strip (Atelier Attention) */}
              {(orders.filter(o => o.status === 'Processing').length > 0 || stockValuation.lowStockSKUs > 0) && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FDFBF7] border border-[#E9DFD1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs text-xs">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#F6EFE6] border border-[#E5DACB] text-[#9E6D28] flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-semibold text-xs text-[#292624] uppercase tracking-wider block">
                        Action Required Today
                      </span>
                      <p className="text-[11px] text-[#77716F]">
                        {orders.filter(o => o.status === 'Processing').length > 0 && (
                          <span>{orders.filter(o => o.status === 'Processing').length} order{orders.filter(o => o.status === 'Processing').length === 1 ? '' : 's'} waiting to be packed &amp; shipped. </span>
                        )}
                        {stockValuation.lowStockSKUs > 0 && (
                          <span>{stockValuation.lowStockSKUs} piece{stockValuation.lowStockSKUs === 1 ? '' : 's'} running low in stock.</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {orders.filter(o => o.status === 'Processing').length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('orders');
                          setOrderStatusFilter('Processing');
                        }}
                        className="px-4 py-2 rounded-xl bg-[#292624] text-white text-xs font-semibold cursor-pointer hover:bg-black transition-all shadow-xs"
                      >
                        Pack Orders →
                      </button>
                    )}
                    {stockValuation.lowStockSKUs > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('products');
                          setProductSortBy('stock_asc');
                        }}
                        className="px-4 py-2 rounded-xl border border-[#DCD5CB] bg-white text-[#292624] text-xs font-semibold cursor-pointer hover:bg-[#FAF8F5] transition-all shadow-2xs"
                      >
                        View Low Stock →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 4. Two-Column Calm Split: Recent Orders (Left) + Top Creation & Quick Shortcuts (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT COLUMN (2 Cols): Recent Customer Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs p-5 sm:p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-3.5 border-b border-[#F2ECE5]">
                      <div>
                        <h3 className="font-semibold text-xs text-[#292624] uppercase tracking-wider">
                          Recent Customer Orders
                        </h3>
                        <p className="text-[11px] text-[#77716F] mt-0.5">
                          Latest purchases from website &amp; concierge
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-semibold text-[#B49A6C] hover:underline cursor-pointer"
                      >
                        View All Orders →
                      </button>
                    </div>

                    {/* Calm Orders List */}
                    <div className="divide-y divide-[#F2ECE5] text-xs mt-1">
                      {orders.slice(0, 4).map((o) => {
                        const snapshots = o.itemSnapshots && o.itemSnapshots.length > 0 ? o.itemSnapshots : [];
                        const safeItems = Array.isArray(o.items) ? o.items : [];
                        const pieceCount = snapshots.length > 0
                          ? snapshots.reduce((acc, s) => acc + (s.quantity || 1), 0)
                          : safeItems.reduce((acc, i) => acc + (i?.quantity || 1), 0);
                        const pieceTitles = snapshots.length > 0
                          ? snapshots.map(s => s.productTitle).filter(Boolean).join(', ')
                          : safeItems.map(i => i?.product?.name).filter(Boolean).join(', ');

                        return (
                          <div
                            key={o.id}
                            onClick={() => {
                              setActiveTab('orders');
                              setOrderSearch(o.id);
                            }}
                            className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#FAF8F5] px-3 rounded-xl transition-all cursor-pointer group"
                            title="Click to view full order details in Orders tab"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-sm text-[#292624] group-hover:text-[#B49A6C] transition-colors">{o.customerName}</span>
                                <span className="text-[#C2BCB6]">•</span>
                                <span className="text-[#77716F]">{o.city}</span>
                                <span className="text-[#C2BCB6]">•</span>
                                <span className="font-mono text-xs text-[#9E9792]">{o.id}</span>
                              </div>
                              <p className="text-[11px] text-[#77716F] truncate max-w-md">
                                {pieceCount} piece{pieceCount !== 1 ? 's' : ''} {pieceTitles ? `(${pieceTitles})` : ''} • {o.date}
                              </p>
                            </div>

                            <div className="flex items-center space-x-3 shrink-0">
                              <span className="font-bold text-sm font-mono text-[#292624]">
                                ₹{o.total.toLocaleString('en-IN')}
                              </span>
                              <span className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold uppercase ${
                                o.status === 'Delivered' ? 'bg-[#EEF3EC] text-[#3B5432] border border-[#D3E0CE]' :
                                o.status === 'Shipped' ? 'bg-[#F5F0F5] text-[#694868] border border-[#E5D7E5]' :
                                o.status === 'Cancelled' ? 'bg-[#FDF2F0] text-[#8F3B30] border border-[#F8D4CF]' :
                                'bg-[#FAF5EC] text-[#785E2F] border border-[#EFE3CF]'
                              }`}>
                                {o.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F2ECE5]">
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="w-full py-2.5 rounded-xl border border-[#E7E0DA] bg-[#FAF8F5] hover:bg-white text-xs font-semibold text-[#292624] text-center cursor-pointer transition-all shadow-2xs hover:shadow-xs"
                    >
                      Open Full Customer Orders Console ({orders.length} total orders) →
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN (1 Col): Dynamic Operations Pulse & Atelier Command */}
                <div className="space-y-4">
                  
                  {/* 1. ACTION REQUIRED: Real-Time Order Operations */}
                  {(() => {
                    const pendingDispatch = orders.filter(
                      o => o.status === 'Processing' || (o.paymentStatus === 'captured' && o.fulfilmentStatus !== 'delivered' && o.fulfilmentStatus !== 'cancelled')
                    );
                    const pendingPayment = orders.filter(o => o.paymentStatus === 'pending');
                    const hasAction = pendingDispatch.length > 0 || pendingPayment.length > 0;

                    return (
                      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs p-4.5 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                          <div className="flex items-center space-x-1.5">
                            <span className={`w-2 h-2 rounded-full ${hasAction ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                            <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#18181B]">
                              Action Required
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('orders');
                              setOrderStatusFilter('Processing');
                            }}
                            className="text-[11px] font-semibold text-[#64748B] hover:text-[#18181B] cursor-pointer"
                          >
                            Orders Console →
                          </button>
                        </div>

                        {hasAction ? (
                          <div className="space-y-2">
                            {pendingDispatch.length > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab('orders');
                                  setOrderStatusFilter('Processing');
                                }}
                                className="w-full p-2.5 rounded-xl border border-amber-200/80 bg-amber-50/60 hover:bg-amber-50 text-left transition-all cursor-pointer flex items-center justify-between group"
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                                  <div className="truncate">
                                    <span className="font-semibold text-xs text-[#18181B] block">
                                      {pendingDispatch.length} Orders Need Dispatch
                                    </span>
                                    <span className="text-[10.5px] text-[#64748B] block truncate">
                                      Payment confirmed • Package & ship
                                    </span>
                                  </div>
                                </div>
                                <span className="text-[10.5px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                                  Ship Now
                                </span>
                              </button>
                            )}
                            {pendingPayment.length > 0 && (
                              <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
                                <span>{pendingPayment.length} Orders pending payment</span>
                                <span className="font-mono font-medium text-[#18181B]">Awaiting patron</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center space-x-2.5 text-xs text-emerald-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div>
                              <span className="font-semibold block text-[11.5px]">All Dispatches Clear</span>
                              <span className="text-[10.5px] text-emerald-700">All customer orders have been fulfilled.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* 2. LOWEST STOCK: Restock Radar */}
                  {(() => {
                    const sortedByStock = [...products].sort((a, b) => (a.stockCount ?? 0) - (b.stockCount ?? 0));
                    const lowestPiece = sortedByStock[0];
                    const criticalCount = products.filter(p => (p.stockCount ?? 0) <= (p.lowStockThreshold ?? 1)).length;
                    const stockRemaining = lowestPiece ? (lowestPiece.stockCount ?? 0) : 0;

                    return (
                      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs p-4.5 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                          <div className="flex items-center space-x-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#18181B]">
                              Lowest Stock Radar
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('products');
                              setProductSortBy('stock_asc');
                            }}
                            className="text-[11px] font-semibold text-[#64748B] hover:text-[#18181B] cursor-pointer"
                          >
                            Manage Stock →
                          </button>
                        </div>

                        {lowestPiece ? (
                          <div className="space-y-2.5">
                            <div className="flex items-center space-x-3 p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                              <div className="w-12 h-12 max-w-[48px] max-h-[48px] rounded-lg overflow-hidden bg-white border border-[#E2E8F0] shrink-0">
                                <img
                                  src={getOptimizedImageUrl(lowestPiece.image)}
                                  alt={lowestPiece.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="font-semibold text-xs text-[#18181B] block truncate">
                                  {lowestPiece.name}
                                </span>
                                <span className="text-[10.5px] text-[#64748B] block truncate">
                                  {lowestPiece.categoryDisplay} • ₹{lowestPiece.price.toLocaleString('en-IN')}
                                </span>
                                <div className="flex items-center space-x-2 pt-0.5">
                                  <span className={`text-[10.5px] font-bold font-mono px-1.5 py-0.5 rounded ${stockRemaining <= 1 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'}`}>
                                    {stockRemaining === 0 ? 'Out of Stock' : `Only ${stockRemaining} left`}
                                  </span>
                                  <span className="text-[10px] text-[#64748B]">
                                    (Threshold: {lowestPiece.lowStockThreshold ?? 1})
                                  </span>
                                </div>
                              </div>
                            </div>
                            {criticalCount > 1 && (
                              <p className="text-[10.5px] text-[#64748B] text-center">
                                <span className="font-semibold text-[#18181B]">{criticalCount - 1} other pieces</span> nearing depletion threshold.
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-[#64748B]">Inventory balances healthy across catalog.</p>
                        )}
                      </div>
                    );
                  })()}

                  {/* 3. MOST SOLD: Velocity Leader */}
                  {performance && performance[0] && (
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs p-4.5 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                        <div className="flex items-center space-x-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-[#B49A6C]" />
                          <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#18181B]">
                            #1 Most Sold Creation
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab('performance')}
                          className="text-[11px] font-semibold text-[#64748B] hover:text-[#18181B] cursor-pointer"
                        >
                          Rankings →
                        </button>
                      </div>

                      <div className="flex items-center space-x-3.5">
                        <div className="w-14 h-14 max-w-[56px] max-h-[56px] rounded-xl overflow-hidden bg-stone-100 border border-[#E2E8F0] shrink-0">
                          <img
                            src={getOptimizedImageUrl(performance[0].imageUrl)}
                            alt={performance[0].productTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-0.5 truncate flex-1 min-w-0">
                          <span className="font-semibold text-xs text-[#18181B] block truncate">
                            {performance[0].productTitle}
                          </span>
                          <span className="text-[11px] text-[#64748B] capitalize block truncate">
                            {performance[0].category.replace('-', ' ')}
                          </span>
                          <div className="flex items-center justify-between pt-0.5">
                            <span className="font-mono font-bold text-xs text-[#18181B]">
                              ₹{performance[0].netRevenue.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 font-mono">
                              {performance[0].unitsSold} sold
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. ATELIER QUICK ACTIONS: Charcoal & White Clean Shortcuts */}
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs p-4.5 space-y-3">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#18181B] block pb-2 border-b border-[#F1F5F9]">
                      Atelier Quick Shortcuts
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      
                      {/* Shortcut 1: + Add New Creation */}
                      <button
                        type="button"
                        onClick={() => {
                          setNewProductForm(getInitialProductForm());
                          setIsNewProductModalOpen(true);
                        }}
                        className="p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 group hover:border-[#18181B] hover:shadow-2xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-semibold text-[#18181B] block text-[11.5px] group-hover:text-black">
                            + Add Creation
                          </span>
                          <span className="text-[10px] text-[#64748B] block truncate">
                            Publish new piece
                          </span>
                        </div>
                      </button>

                      {/* Shortcut 2: + Create Client Order */}
                      <button
                        type="button"
                        onClick={() => {
                          setManualOrderForm(prev => ({ ...prev, productId: products[0]?.id || '' }));
                          setIsManualOrderModalOpen(true);
                        }}
                        className="p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 group hover:border-[#18181B] hover:shadow-2xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0">
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-semibold text-[#18181B] block text-[11.5px] group-hover:text-black">
                            + Client Order
                          </span>
                          <span className="text-[10px] text-[#64748B] block truncate">
                            WhatsApp concierge
                          </span>
                        </div>
                      </button>

                      {/* Shortcut 3: Products & Stock */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('products');
                          setProductSortBy('stock_asc');
                        }}
                        className="p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 group hover:border-[#18181B] hover:shadow-2xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#E2E8F0] text-[#18181B] flex items-center justify-center shrink-0">
                          <Package className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-semibold text-[#18181B] block text-[11.5px] group-hover:text-black">
                            Stock Balances
                          </span>
                          <span className="text-[10px] text-[#64748B] block truncate">
                            {stockValuation.totalUnits} pieces
                          </span>
                        </div>
                      </button>

                      {/* Shortcut 4: Export Ledger CSV */}
                      <button
                        type="button"
                        onClick={() => AnalyticsService.downloadLedgerCSV(orders)}
                        className="p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 group hover:border-[#18181B] hover:shadow-2xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#E2E8F0] text-[#18181B] flex items-center justify-center shrink-0">
                          <Download className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-semibold text-[#18181B] block text-[11.5px] group-hover:text-black">
                            Export Ledger
                          </span>
                          <span className="text-[10px] text-[#64748B] block truncate">
                            Instant tax Excel/CSV
                          </span>
                        </div>
                      </button>

                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}
{/* TAB: PRODUCTS & STOCK (UNIFIED MANAGEMENT WITH SORTING)           */}
          {/* ----------------------------------------------------------------- */}
          {(activeTab === 'products' || (activeTab as string) === 'inventory') && (
            <div className="space-y-6">
              
              {/* Top Stock Valuation & Health Summary Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs text-xs">
                <div>
                  <span className="text-[#77716F] block font-semibold uppercase text-[10.5px] tracking-wider">
                    Total Pieces in Stock
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-[#292624] mt-0.5 block font-mono">
                    {stockValuation.totalUnits} pcs
                  </span>
                  <span className="text-[11px] text-[#77716F] mt-0.5 block">
                    Across all {products.length} live catalog designs
                  </span>
                </div>

                <div>
                  <span className="text-[#77716F] block font-semibold uppercase text-[10.5px] tracking-wider">
                    Total Stock Value
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-[#292624] mt-0.5 block font-mono">
                    ₹{stockValuation.retailValuation.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-[#77716F] mt-0.5 block">
                    Current retail value of available jewellery
                  </span>
                </div>

                <div>
                  <span className="text-[#77716F] block font-semibold uppercase text-[10.5px] tracking-wider">
                    Low Stock Alerts
                  </span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className={`text-xl sm:text-2xl font-bold font-mono ${
                      stockValuation.lowStockSKUs > 0 ? 'text-[#8F3B30]' : 'text-emerald-700'
                    }`}>
                      {stockValuation.lowStockSKUs} {stockValuation.lowStockSKUs === 1 ? 'piece' : 'pieces'}
                    </span>
                    {stockValuation.lowStockSKUs > 0 && (
                      <button
                        type="button"
                        onClick={() => setProductSortBy('stock_asc')}
                        className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border transition-all cursor-pointer ${
                          productSortBy === 'stock_asc'
                            ? 'bg-[#8F3B30] text-white border-[#8F3B30]'
                            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {productSortBy === 'stock_asc' ? 'Sorting: Least Stock First' : 'Show Low Stock First'}
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] text-[#77716F] mt-0.5 block">
                    {stockValuation.lowStockSKUs > 0
                      ? 'Designs with 3 or fewer units remaining'
                      : 'All jewellery pieces are well-stocked'}
                  </span>
                </div>
              </div>

              {/* Product Filters & Sorting Bar */}
              <div className="p-4 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
                
                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#77716F]" />
                  <input
                    type="text"
                    placeholder="Search by name, SKU or code..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C] transition-colors"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#77716F] hover:text-[#292624]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter & Sort Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Category Filter */}
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#77716F] font-semibold uppercase text-[10.5px] tracking-wider">Category:</span>
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="border border-[#E7E0DA] rounded-xl px-3 py-1.5 bg-white text-[#292624] focus:outline-none focus:border-[#B49A6C] font-medium cursor-pointer"
                    >
                      <option value="all">All Categories</option>
                      <option value="rings">Rings</option>
                      <option value="earrings">Earrings</option>
                      <option value="jhumka">Dome Jhumka</option>
                      <option value="kangan-sets">Kangan Sets</option>
                      <option value="kangna">Kangna</option>
                      <option value="necklaces">Necklaces</option>
                      <option value="bracelets">Bracelets</option>
                      <option value="western">Western Jewellery</option>
                      <option value="tribal">Tribal Jewellery</option>
                      <option value="kadas">Kadas</option>
                      <option value="accessories">Earpins &amp; Bugadi</option>
                      <option value="toran">Toran</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#77716F] font-semibold uppercase text-[10.5px] tracking-wider">Status:</span>
                    <select
                      value={productStatusFilter}
                      onChange={(e) => setProductStatusFilter(e.target.value)}
                      className="border border-[#E7E0DA] rounded-xl px-3 py-1.5 bg-white text-[#292624] focus:outline-none focus:border-[#B49A6C] font-medium cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="published">Published</option>
                      <option value="inactive">Inactive</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* Sort By Filter (USER REQUEST: sort by least unit and max) */}
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#77716F] font-semibold uppercase text-[10.5px] tracking-wider">Sort:</span>
                    <select
                      value={productSortBy}
                      onChange={(e) => setProductSortBy(e.target.value as any)}
                      className="border border-[#E7E0DA] rounded-xl px-3 py-1.5 bg-white text-[#292624] focus:outline-none focus:border-[#B49A6C] font-semibold cursor-pointer"
                    >
                      <option value="default">Default (Newest)</option>
                      <option value="stock_asc">Least Units First (Low Stock)</option>
                      <option value="stock_desc">Most Units First (High Stock)</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-[#E7E0DA] shadow-subtle overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead className="bg-[#FAF8F5] text-[#77716F] uppercase font-semibold text-[11px] tracking-wider border-b border-[#E7E0DA]">
                      <tr>
                        <th className="py-3 px-4">Design &amp; SKU</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => setProductSortBy(prev => prev === 'price_asc' ? 'price_desc' : 'price_asc')}
                            className="flex items-center space-x-1 uppercase hover:text-[#292624] cursor-pointer"
                          >
                            <span>Selling Price</span>
                            {productSortBy === 'price_asc' && <span>↑</span>}
                            {productSortBy === 'price_desc' && <span>↓</span>}
                          </button>
                        </th>
                        <th className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => setProductSortBy(prev => prev === 'stock_asc' ? 'stock_desc' : 'stock_asc')}
                            className="flex items-center space-x-1 uppercase hover:text-[#292624] cursor-pointer"
                            title="Click to sort by stock units"
                          >
                            <span>Stock on Hand</span>
                            {productSortBy === 'stock_asc' && <span className="text-[#8F3B30] font-bold">↑ (Least First)</span>}
                            {productSortBy === 'stock_desc' && <span className="text-emerald-700 font-bold">↓ (Most First)</span>}
                          </button>
                        </th>
                        <th className="py-3 px-4">Website Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E0DA]">
                      {paginatedProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-[#77716F]">
                            No designs found matching your search or filters.
                          </td>
                        </tr>
                      ) : (
                        paginatedProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                            <td className="py-3.5 px-4 flex items-center space-x-3">
                              <img
                                src={getOptimizedImageUrl(p.cleanImage || p.image)}
                                alt={p.name}
                                loading="lazy"
                                decoding="async"
                                onError={(e) => handleImageError(e, p.cleanImage || p.image)}
                                className="w-11 h-11 rounded-xl object-cover bg-stone-100 border border-[#E7E0DA] shrink-0"
                              />
                              <div>
                                <span className="font-semibold text-[#292624] block">{p.name}</span>
                                <span className="text-[10px] text-[#77716F] font-mono">{p.sku || p.id}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 uppercase text-[#77716F] font-medium">{p.categoryDisplay}</td>
                            <td className="py-3.5 px-4 font-bold text-[#292624]">₹{p.price.toLocaleString('en-IN')}</td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const v = variants.find(vr => vr.productId === p.id);
                                    if (v) handleQuickStockStep(v, -1);
                                  }}
                                  disabled={(p.stockCount ?? 0) <= 0}
                                  title="Deduct 1 piece"
                                  className="w-7 h-7 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] disabled:opacity-30 text-[#292624] flex items-center justify-center font-bold text-xs cursor-pointer transition-colors active:scale-95 shadow-2xs"
                                >
                                  -
                                </button>
                                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold font-mono ${
                                  (p.stockCount ?? 0) === 0
                                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                    : (p.stockCount ?? 0) <= 3
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                }`}>
                                  {p.stockCount ?? 0} {p.stockCount === 1 ? 'unit' : 'units'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const v = variants.find(vr => vr.productId === p.id);
                                    if (v) handleQuickStockStep(v, 1);
                                  }}
                                  title="Add 1 piece"
                                  className="w-7 h-7 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[#292624] flex items-center justify-center font-bold text-xs cursor-pointer transition-colors active:scale-95 shadow-2xs"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase ${
                                p.status === 'published' ? 'bg-[#EEF3EC] text-[#3B5432] border border-[#D3E0CE]' :
                                p.status === 'archived' ? 'bg-[#F2EFEA] text-[#6E6761] border border-[#E4DFD8]' : 'bg-[#FAF5EC] text-[#785E2F] border border-[#EFE3CF]'
                              }`}>
                                {p.status || 'published'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleProductStatus(p)}
                                  className="px-2.5 py-1 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[11px] font-medium text-[#292624] transition-colors cursor-pointer"
                                >
                                  {p.status === 'published' ? 'Deactivate' : 'Publish'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleArchiveProduct(p)}
                                  title="Archive product"
                                  className="p-1.5 rounded-lg hover:bg-[#FAF8F5] text-[#77716F] hover:text-[#B49A6C] transition-colors cursor-pointer"
                                >
                                  <Archive className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProductSafely(p)}
                                  title="Safe delete"
                                  className="p-1.5 rounded-lg hover:bg-[#FDF2F0] text-[#8F3B30] transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {filteredProducts.length > PRODUCTS_PER_PAGE && (
                  <div className="p-4 border-t border-[#E7E0DA] flex items-center justify-between text-xs text-[#77716F]">
                    <span>
                      Showing {Math.min((productPage - 1) * PRODUCTS_PER_PAGE + 1, filteredProducts.length)} to{' '}
                      {Math.min(productPage * PRODUCTS_PER_PAGE, filteredProducts.length)} of{' '}
                      <span className="font-semibold text-[#292624]">{filteredProducts.length}</span> designs
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => setProductPage(prev => Math.max(1, prev - 1))}
                        disabled={productPage === 1}
                        className="px-3 py-1 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed font-medium text-[#292624] transition-colors cursor-pointer"
                      >
                        Previous
                      </button>
                      <span className="px-2 font-mono text-[11px]">
                        Page {productPage} of {totalProductPages}
                      </span>
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
{/* ----------------------------------------------------------------- */}
          {/* TAB: CUSTOMER ORDERS (WITH INVOICE & COURIER SLIP MODALS) */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Order Controls */}
              <div className="p-4 bg-white rounded-xl border border-[#E7E0DA] shadow-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setManualOrderForm(prev => ({ ...prev, productId: products[0]?.id || '' }));
                      setIsManualOrderModalOpen(true);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#292624] hover:bg-[#1C1A18] text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#B49A6C]" />
                    <span>Create Client Order</span>
                  </button>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#77716F]" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, customer, phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[#77716F] font-semibold uppercase text-[11px] tracking-wider">Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="border border-[#E7E0DA] rounded px-2.5 py-1.5 bg-white text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  >
                    <option value="all">All Orders</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-lg border border-[#E7E0DA] shadow-subtle overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[820px]">
                    <thead className="bg-[#FAF8F5] text-[#77716F] uppercase font-semibold text-[11px] tracking-wider border-b border-[#E7E0DA]">
                      <tr>
                        <th className="py-2.5 px-4">Order ID & Date</th>
                        <th className="py-2.5 px-4">Customer</th>
                        <th className="py-2.5 px-4">Items</th>
                        <th className="py-2.5 px-4">Paid Total</th>
                        <th className="py-2.5 px-4">Payment</th>
                        <th className="py-2.5 px-4">Fulfilment Status</th>
                        <th className="py-2.5 px-4">Courier & AWB</th>
                        <th className="py-2.5 px-4 text-right">Documents</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E0DA]">
                      {paginatedOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          <td className="py-3 px-4 font-mono font-medium text-[#292624]">
                            {o.id}
                            <div className="text-[10px] text-[#77716F] font-sans flex items-center space-x-1.5 mt-0.5">
                              <span>{o.date}</span>
                              <span className="text-[#C2BCB6]">•</span>
                              <span className="font-semibold text-[#292624]">{o.orderTime || '02:30 PM'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-[#292624] block">{o.customerName}</span>
                            <span className="text-[11px] text-[#77716F]">{o.city}, {o.state}</span>
                          </td>
                          <td className="py-3 px-4 text-[#77716F] max-w-[200px] truncate">
                            {o.itemSnapshots?.map((s) => `${s.productTitle} (x${s.quantity})`).join(', ') ||
                             (o.items || []).map((i) => `${i?.product?.name || 'Jewellery Design'} (x${i?.quantity || 1})`).join(', ') ||
                             'Jewellery Order'}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#292624]">₹{o.total.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              o.paymentStatus === 'captured' ? 'bg-[#EEF3EC] text-[#3B5432] border border-[#D3E0CE]' :
                              o.paymentStatus === 'refunded' ? 'bg-[#FDF2F0] text-[#8F3B30] border border-[#F8D4CF]' : 'bg-[#FAF5EC] text-[#785E2F] border border-[#EFE3CF]'
                            }`}>
                              {o.paymentStatus || 'CAPTURED'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={o.status}
                              disabled={o.status === 'Cancelled'}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                              className="border border-[#E7E0DA] rounded px-2 py-1 bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            {o.awbNumber ? (
                              <div>
                                <span className="font-mono text-[11px] font-semibold text-[#292624] block">{o.awbNumber}</span>
                                <span className="text-[10px] text-[#77716F]">{o.courierPartner}</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setTrackingOrder(o);
                                  setCourierPartner('Shiprocket Express');
                                  setAwbNumber(`SR-${o.id.replace('RASS-ORD-', '')}-IN`);
                                }}
                                className="text-[11px] font-semibold text-[#B49A6C] hover:underline cursor-pointer"
                              >
                                + Assign AWB
                              </button>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              {/* Open Invoice Preview Modal first */}
                              <button
                                onClick={() => setPreviewInvoiceOrder(o)}
                                title="View & Print Tax Invoice"
                                className="px-2.5 py-1 rounded border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[11px] font-medium text-[#292624] flex items-center space-x-1 cursor-pointer transition-colors"
                              >
                                <Printer className="w-3 h-3 text-[#77716F]" />
                                <span>Invoice</span>
                              </button>

                              {/* Open Courier Slip Preview Modal */}
                              <button
                                onClick={() => setPreviewCourierSlipOrder(o)}
                                title="View & Print Courier Shipping Slip"
                                className="px-2.5 py-1 rounded border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[11px] font-medium text-[#292624] flex items-center space-x-1 cursor-pointer transition-colors"
                              >
                                <Truck className="w-3 h-3 text-[#77716F]" />
                                <span>Slip</span>
                              </button>
                              {/* 1-Click WhatsApp Customer Contact */}
                              <button
                                onClick={() => {
                                  const phoneClean = (o.phone || '').replace(/[^0-9]/g, '');
                                  const message = `Namaste ${o.customerName},\n\nThank you for choosing Rass by Riddhima.\nYour order *#${o.id}* is currently ${o.status}.\n\nItems:\n` +
                                    (o.itemSnapshots?.map(i => `• ${i.productTitle} (Qty: ${i.quantity})`).join('\n') || 'Demi-fine handcrafted jewellery') +
                                    (o.awbNumber ? `\n\nCourier Partner: ${o.courierPartner || 'Express'}\nTracking Number: ${o.awbNumber}` : '') +
                                    `\n\nWith love,\nTeam Rass by Riddhima`;
                                  const url = `https://wa.me/${phoneClean.startsWith('91') ? phoneClean : '91' + phoneClean}?text=${encodeURIComponent(message)}`;
                                  window.open(url, '_blank');
                                }}
                                title="Chat with Customer on WhatsApp"
                                className="px-2 py-1 rounded border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-[11px] font-semibold text-emerald-800 flex items-center space-x-1 cursor-pointer transition-colors"
                              >
                                <Phone className="w-3 h-3 text-emerald-600" />
                                <span className="hidden sm:inline">WhatsApp</span>
                              </button>


                              {o.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleCancelOrderWithRestock(o.id)}
                                  title="Cancel order & restock"
                                  className="p-1 rounded hover:bg-[#FDF2F0] text-[#8F3B30] transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Permanently Delete Order */}
                              <button
                                onClick={() => handlePermanentlyDeleteOrder(o.id)}
                                title="Permanently delete order"
                                className="p-1 rounded hover:bg-red-50 text-[#8F3B30] hover:text-red-700 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Orders Pagination Controls */}
                {filteredOrders.length > ORDERS_PER_PAGE && (
                  <div className="p-4 border-t border-[#E7E0DA] flex items-center justify-between text-xs text-[#77716F]">
                    <span>
                      Showing {Math.min((orderPage - 1) * ORDERS_PER_PAGE + 1, filteredOrders.length)} to{' '}
                      {Math.min(orderPage * ORDERS_PER_PAGE, filteredOrders.length)} of{' '}
                      <span className="font-semibold text-[#292624]">{filteredOrders.length}</span> orders
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setOrderPage(prev => Math.max(1, prev - 1))}
                        disabled={orderPage === 1}
                        className="px-3 py-1 rounded border border-[#E7E0DA] bg-white text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF8F5] cursor-pointer"
                      >
                        Previous
                      </button>
                      <span className="px-2 text-xs font-medium text-[#292624]">
                        Page {orderPage} of {totalOrderPages}
                      </span>
                      <button
                        type="button"
                        onClick={() => setOrderPage(prev => Math.min(totalOrderPages, prev + 1))}
                        disabled={orderPage === totalOrderPages}
                        className="px-3 py-1 rounded border border-[#E7E0DA] bg-white text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF8F5] cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}



          {/* ----------------------------------------------------------------- */}
          {/* TAB: COUPONS & DISCOUNTS */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">

              {/* ============================================================= */}
              {/* FESTIVE CAMPAIGN & STOREFRONT POPUP (SIMPLE & CLEAN)         */}
              {/* ============================================================= */}
              {(() => {
                const previewLinkedCoupon = coupons.find(c => c.code === festiveCampaign.linkedCouponCode) || couponService.getCouponByCode(festiveCampaign.linkedCouponCode);
                const previewDiscountFormula = previewLinkedCoupon
                  ? `${previewLinkedCoupon.discountType === 'percentage' ? `Flat ${previewLinkedCoupon.discountValue}% OFF` : `Flat ₹${previewLinkedCoupon.discountValue.toLocaleString('en-IN')} OFF`} • ${previewLinkedCoupon.minOrderValue > 0 ? `Min. cart ₹${previewLinkedCoupon.minOrderValue.toLocaleString('en-IN')}` : 'No minimum spend'}`
                  : 'Flat 20% OFF • Min. cart ₹2,999';

                return (
                  <div className="bg-white rounded-3xl border border-[#E7E0DA] p-6 sm:p-8 space-y-6">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E0DA]">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#FAF5F9] border border-[#E2D5E5] flex items-center justify-center text-[#8B5E86] shrink-0">
                          <Sparkles className="w-5 h-5 text-[#A783A2]" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#292624]">
                              Welcome Offer Popup
                            </h3>
                            {festiveCampaign.isEnabled ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                                <span>Live on Website</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2EFEA] text-[#77716F] border border-[#E7E0DA]">
                                Paused
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#77716F] mt-0.5">
                            The welcome offer shown to new visitors when they arrive on your site.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsPreviewFestiveOpen(true)}
                          className="px-4 py-2 rounded-xl border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#292624] flex items-center space-x-1.5 cursor-pointer transition-all active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#77716F]" />
                          <span>Fullscreen View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const next = !festiveCampaign.isEnabled;
                            const updated = couponService.saveFestiveCampaign({ isEnabled: next });
                            setFestiveCampaign(updated);
                            showNotification(next ? 'Welcome popup is now LIVE on website' : 'Welcome popup paused');
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 ${
                            festiveCampaign.isEnabled
                              ? 'bg-[#8F3B30] text-white hover:bg-[#783026]'
                              : 'bg-[#3B5432] text-white hover:bg-[#2C3F25]'
                          }`}
                        >
                          {festiveCampaign.isEnabled ? 'Turn OFF' : 'Turn ON'}
                        </button>
                      </div>
                    </div>

                    {/* Side-by-Side: Simple Form (Left) & Live Preview (Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: Simple Form */}
                      <div className="lg:col-span-5 space-y-4">
                        
                        {/* Coupon Offer */}
                        <div>
                          <label className="block text-xs font-semibold text-[#292624] mb-1.5">
                            Coupon Offer
                          </label>
                          <select
                            value={festiveCampaign.linkedCouponCode}
                            onChange={(e) => setFestiveCampaign(prev => ({ ...prev, linkedCouponCode: e.target.value }))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E0DA] bg-white text-xs font-medium text-[#292624] focus:outline-none focus:border-[#B49A6C] transition-all cursor-pointer"
                          >
                            {coupons.filter(c => c.isActive !== false).map(c => (
                              <option key={c.id} value={c.code}>
                                {c.code} — {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue.toLocaleString('en-IN')} OFF`} (Min cart ₹{c.minOrderValue.toLocaleString('en-IN')})
                              </option>
                            ))}
                          </select>
                          <p className="text-[11px] text-[#77716F] mt-1">
                            When visitors click "Apply", this code is copied &amp; applied to their order.
                          </p>
                        </div>

                        {/* Top Badge */}
                        <div>
                          <label className="block text-xs font-semibold text-[#292624] mb-1.5">
                            Top Badge
                          </label>
                          <input
                            type="text"
                            value={festiveCampaign.badgeText}
                            onChange={(e) => setFestiveCampaign(prev => ({ ...prev, badgeText: e.target.value }))}
                            placeholder="e.g. FESTIVE PRIVILEGE • SPECIAL CELEBRATION"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C] transition-all"
                          />
                          <p className="text-[11px] text-[#77716F] mt-1">
                            Small tag shown above the main heading.
                          </p>
                        </div>

                        {/* Heading */}
                        <div>
                          <label className="block text-xs font-semibold text-[#292624] mb-1.5">
                            Heading
                          </label>
                          <input
                            type="text"
                            value={festiveCampaign.headline}
                            onChange={(e) => setFestiveCampaign(prev => ({ ...prev, headline: e.target.value }))}
                            placeholder="e.g. A Little Magic for Your First Rass Creation"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E0DA] bg-white text-xs font-serif text-sm text-[#292624] focus:outline-none focus:border-[#B49A6C] transition-all"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-xs font-semibold text-[#292624] mb-1.5">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={festiveCampaign.description}
                            onChange={(e) => setFestiveCampaign(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="e.g. Enjoy an exclusive 20% discount across our handcrafted demi-fine jewelry collections."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C] transition-all leading-relaxed resize-none"
                          />
                        </div>

                        {/* Button Text */}
                        <div>
                          <label className="block text-xs font-semibold text-[#292624] mb-1.5">
                            Button Text
                          </label>
                          <input
                            type="text"
                            value={festiveCampaign.buttonText}
                            onChange={(e) => setFestiveCampaign(prev => ({ ...prev, buttonText: e.target.value }))}
                            placeholder="e.g. Apply &amp; Explore Collection"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C] transition-all"
                          />
                        </div>

                        {/* Save Button */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              couponService.saveFestiveCampaign(festiveCampaign);
                              showNotification('Popup settings saved successfully!');
                            }}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#292624] hover:bg-[#1C1A18] text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-xs active:scale-95"
                          >
                            Save Settings
                          </button>
                        </div>

                      </div>

                      {/* Right: Live Preview */}
                      <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-7 rounded-3xl border border-[#E7E0DA]">
                        <div className="flex items-center justify-between pb-3.5 border-b border-[#E7E0DA] mb-5">
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                            <span className="text-xs font-semibold text-[#292624]">
                              Live Preview
                            </span>
                          </div>
                          <span className="text-[11px] text-[#77716F]">
                            What visitors see on the site
                          </span>
                        </div>

                        {/* Modal Replica */}
                        <div className="relative bg-white rounded-3xl border border-[#E7E0DA] p-6 sm:p-8 text-center text-[#292624] overflow-hidden shadow-xs">
                          
                          {/* Botanical Sprigs Background */}
                          <div className="absolute top-0 left-0 pointer-events-none opacity-20 select-none">
                            <img
                              src={getOptimizedImageUrl('/elements/Mauve Botanical Sprig Line Art.png')}
                              alt=""
                              className="w-20 sm:w-28 h-auto object-contain"
                            />
                          </div>
                          <div className="absolute top-0 right-0 pointer-events-none opacity-20 select-none -scale-x-100">
                            <img
                              src={getOptimizedImageUrl('/elements/Mauve Botanical Sprig Line Art.png')}
                              alt=""
                              className="w-20 sm:w-28 h-auto object-contain"
                            />
                          </div>

                          {/* Top Badge */}
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5F9] border border-[#A783A2]/30 text-[#8B5E86] text-[10px] uppercase tracking-wider font-semibold mb-3">
                            <Sparkles className="w-3 h-3 text-[#A783A2]" />
                            <span>{festiveCampaign.badgeText || 'FESTIVE PRIVILEGE • SPECIAL CELEBRATION'}</span>
                          </div>

                          {/* Heading */}
                          <h2
                            className="text-2xl sm:text-[28px] font-serif text-[#292624] tracking-tight leading-snug mb-2 font-normal"
                            style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif' }}
                          >
                            {festiveCampaign.headline || 'A Little Magic for Your First Rass Creation'}
                          </h2>

                          {/* Description */}
                          <p className="text-xs sm:text-[13px] text-[#77716F] leading-relaxed max-w-sm mx-auto mb-5">
                            {festiveCampaign.description || 'Enjoy an exclusive 20% discount across our handcrafted demi-fine jewelry collections.'}
                          </p>

                          {/* Coupon Box */}
                          <div className="bg-[#FAF5F9] rounded-2xl border-2 border-dashed border-[#A783A2]/50 p-4 relative mb-5">
                            {/* Cutout notches */}
                            <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-r-2 border-dashed border-[#A783A2]/50" />
                            <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-l-2 border-dashed border-[#A783A2]/50" />

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-[#8B5E86] font-semibold block mb-0.5">
                                  Coupon Code
                                </span>
                                <span className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-[#292624]">
                                  {festiveCampaign.linkedCouponCode || 'FESTIVE20'}
                                </span>
                                <p className="text-[11px] text-[#77716F] mt-0.5">
                                  {previewDiscountFormula}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  try {
                                    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
                                  } catch (e) {}
                                  showNotification(`Copied: ${festiveCampaign.linkedCouponCode}`);
                                }}
                                className="px-4 py-2 rounded-xl bg-[#292624] text-white text-[11px] font-semibold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer hover:bg-black transition-all shrink-0 active:scale-95"
                              >
                                <Copy className="w-3.5 h-3.5 text-[#B49A6C]" />
                                <span>Copy Code</span>
                              </button>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <button
                            type="button"
                            onClick={() => {
                              try {
                                confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
                              } catch (e) {}
                              showNotification('Preview: Coupon applied to cart!');
                            }}
                            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#A783A2] to-[#8E6389] hover:from-[#956E90] hover:to-[#7E5279] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                          >
                            <span>{festiveCampaign.buttonText || 'Apply & Explore Collection'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          {/* Trust Badges */}
                          <div className="flex items-center justify-center space-x-5 pt-4 text-[10px] text-[#77716F]">
                            <div className="flex items-center space-x-1.5">
                              <Truck className="w-3 h-3 text-[#B49A6C]" />
                              <span>Complimentary Delivery</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <ShieldCheck className="w-3 h-3 text-[#A783A2]" />
                              <span>925 Hallmarked Purity</span>
                            </div>
                          </div>

                        </div>

                      </div>

                    </div>
                  </div>
                );
              })()}

              <div>
                <h4 className="font-semibold text-xs text-[#292624] uppercase tracking-wider mb-3">
                  All Promotional Coupons ({coupons.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="p-4 bg-white rounded-lg border border-[#E7E0DA] shadow-subtle flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold text-sm bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E7E0DA] text-[#292624]">
                          {c.code}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          c.isActive ? 'bg-[#EEF3EC] text-[#3B5432] border border-[#D3E0CE]' : 'bg-[#F2EFEA] text-[#6E6761] border border-[#E4DFD8]'
                        }`}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-[#77716F]">
                        <div><strong className="text-[#292624]">Value: </strong>{c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}</div>
                        <div><strong className="text-[#292624]">Min Spend: </strong>₹{c.minOrderValue.toLocaleString('en-IN')}</div>
                        <div><strong className="text-[#292624]">Redemptions: </strong>{c.redemptionCount} / {c.maxRedemptions || '∞'}</div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#E7E0DA] flex justify-between text-xs">
                      <button
                        onClick={() => {
                          couponService.toggleCouponActive(c.id);
                          showNotification(`Coupon ${c.code} toggled`);
                          refreshAllData();
                        }}
                        className="font-medium text-[#B49A6C] hover:text-[#9B8153] transition-colors cursor-pointer"
                      >
                        {c.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => {
                          couponService.deleteCoupon(c.id);
                          showNotification(`Coupon ${c.code} deleted`);
                          refreshAllData();
                        }}
                        className="font-medium text-[#8F3B30] hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB: BEST SELLERS / PRODUCT PERFORMANCE (CLEAN & MINIMAL) */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              
              {/* Header & Controls */}
              <div className="p-4 bg-white rounded-lg border border-[#E7E0DA] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-[#292624]">Best Sellers</h3>
                  <p className="text-xs text-[#77716F]">Product rankings by sales volume and net revenue</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search */}
                  <div className="relative w-full sm:w-48">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#77716F]" />
                    <input
                      type="text"
                      placeholder="Search design or SKU..."
                      value={perfSearch}
                      onChange={(e) => setPerfSearch(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                    />
                  </div>

                  {/* Sort */}
                  <div className="flex items-center space-x-1 border border-[#E7E0DA] rounded p-0.5 text-xs bg-[#FAF8F5]">
                    <button
                      onClick={() => setPerfSortBy('units')}
                      className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                        perfSortBy === 'units' ? 'bg-[#292624] text-white shadow-xs' : 'text-[#77716F] hover:text-[#292624]'
                      }`}
                    >
                      Units Sold
                    </button>
                    <button
                      onClick={() => setPerfSortBy('netRevenue')}
                      className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                        perfSortBy === 'netRevenue' ? 'bg-[#292624] text-white shadow-xs' : 'text-[#77716F] hover:text-[#292624]'
                      }`}
                    >
                      Revenue
                    </button>
                  </div>
                </div>
              </div>

              {/* Visual Sales & Revenue Performance Chart Suite */}
              {(() => {
                const topChartItems = performance
                  .filter(p => perfCategoryFilter === 'all' || p.category === perfCategoryFilter)
                  .slice(0, 5);

                const totalPerfRevenue = performance.reduce((s, p) => s + p.netRevenue, 0);
                const totalPerfUnits = performance.reduce((s, p) => s + p.unitsSold, 0);

                const catRevenueMap: Record<string, number> = {};
                const catUnitsMap: Record<string, number> = {};

                for (const p of performance) {
                  catRevenueMap[p.category] = (catRevenueMap[p.category] || 0) + p.netRevenue;
                  catUnitsMap[p.category] = (catUnitsMap[p.category] || 0) + p.unitsSold;
                }

                const isRevenueMode = bestsellerChartMode === 'revenue';
                const totalMetric = isRevenueMode ? totalPerfRevenue : totalPerfUnits;
                const activeMap = isRevenueMode ? catRevenueMap : catUnitsMap;

                const categoryBreakdown = Object.entries(activeMap)
                  .filter(([_, val]) => val > 0)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, val]) => ({
                    category: cat,
                    label: categoryDisplayNames[cat as ProductCategory] || cat.replace('-', ' '),
                    value: val,
                    percentage: totalMetric > 0 ? (val / totalMetric) * 100 : 0,
                  }));

                const sliceColors = [
                  '#B49A6C', // Gold
                  '#18181B', // Charcoal
                  '#A783A2', // Mauve
                  '#869E7B', // Sage Forest
                  '#8F3B30', // Rust
                  '#475569', // Slate
                  '#D97706', // Amber
                  '#0D9488', // Teal
                ];

                const radius = 38;
                const circumference = 2 * Math.PI * radius;
                let accumulatedPercent = 0;

                const donutSegments = categoryBreakdown.map((item, idx) => {
                  const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                  accumulatedPercent += item.percentage;
                  const color = sliceColors[idx % sliceColors.length];
                  return {
                    ...item,
                    strokeDasharray,
                    strokeDashoffset,
                    color,
                  };
                });

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* LEFT CARD (6 cols): Modern Interactive Donut / Pie Chart */}
                    <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs p-5 sm:p-6 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                          <div className="flex items-center space-x-2">
                            <PieChart className="w-4 h-4 text-[#B49A6C]" />
                            <h4 className="font-semibold text-xs sm:text-sm text-[#18181B]">
                              Category Distribution
                            </h4>
                          </div>
                          
                          {/* Revenue vs Units Mode Switcher */}
                          <div className="flex items-center space-x-1 border border-[#E2E8F0] rounded-lg p-0.5 text-xs bg-[#F8FAFC]">
                            <button
                              type="button"
                              onClick={() => setBestsellerChartMode('revenue')}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                                isRevenueMode ? 'bg-[#18181B] text-white shadow-2xs' : 'text-[#64748B] hover:text-[#18181B]'
                              }`}
                            >
                              Revenue (₹)
                            </button>
                            <button
                              type="button"
                              onClick={() => setBestsellerChartMode('units')}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                                !isRevenueMode ? 'bg-[#18181B] text-white shadow-2xs' : 'text-[#64748B] hover:text-[#18181B]'
                              }`}
                            >
                              Units (Pcs)
                            </button>
                          </div>
                        </div>

                        {/* Donut Chart & Legend Visual Suite */}
                        {categoryBreakdown.length === 0 ? (
                          <p className="text-xs text-[#64748B] py-8 text-center">No category sales recorded yet.</p>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-5">
                            {/* SVG Donut Circle */}
                            <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                              <svg viewBox="0 0 100 100" className="w-44 h-44 -rotate-90 transform shrink-0">
                                <circle cx="50" cy="50" r={radius} className="stroke-[#F1F5F9]" strokeWidth="11" fill="transparent" />
                                {donutSegments.map((seg) => (
                                  <circle
                                    key={seg.category}
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    stroke={seg.color}
                                    strokeWidth="11"
                                    fill="transparent"
                                    strokeDasharray={seg.strokeDasharray}
                                    strokeDashoffset={seg.strokeDashoffset}
                                    strokeLinecap="butt"
                                    className="transition-all duration-500 hover:opacity-85 cursor-pointer"
                                  />
                                ))}
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
                                <span className="font-mono font-bold text-sm sm:text-base text-[#18181B]">
                                  {isRevenueMode ? `₹${totalMetric.toLocaleString('en-IN')}` : `${totalMetric} pcs`}
                                </span>
                                <span className="text-[9px] uppercase tracking-wider text-[#64748B] font-semibold">
                                  {isRevenueMode ? 'Total Revenue' : 'Total Units'}
                                </span>
                              </div>
                            </div>

                            {/* Crisp Luxury Legend */}
                            <div className="flex-1 w-full space-y-1.5 max-h-48 overflow-y-auto pr-1">
                              {donutSegments.map((seg) => (
                                <div
                                  key={seg.category}
                                  className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-[#F8FAFC] transition-colors"
                                >
                                  <div className="flex items-center space-x-2 truncate pr-2">
                                    <span
                                      className="w-2.5 h-2.5 rounded-full shrink-0"
                                      style={{ backgroundColor: seg.color }}
                                    />
                                    <span className="font-medium text-[#18181B] truncate text-[11.5px]">
                                      {seg.label}
                                    </span>
                                  </div>
                                  <div className="text-right shrink-0 font-mono text-[11px]">
                                    <span className="font-bold text-[#18181B]">
                                      {isRevenueMode ? `₹${seg.value.toLocaleString('en-IN')}` : `${seg.value} pcs`}
                                    </span>
                                    <span className="text-[10px] text-[#64748B] ml-1.5">
                                      ({Math.round(seg.percentage)}%)
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-2.5 border-t border-[#F1F5F9] text-[10.5px] text-[#64748B] flex items-center justify-between">
                        <span>{categoryBreakdown.length} Active Categories</span>
                        <span className="font-mono">Rass Atelier Analytics</span>
                      </div>
                    </div>

                    {/* RIGHT CARD (6 cols): Leaderboard Rankings */}
                    <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs p-5 sm:p-6 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4 text-[#B49A6C]" />
                            <h4 className="font-semibold text-xs sm:text-sm text-[#18181B]">
                              Top Performing Creations ({perfSortBy === 'netRevenue' ? 'By Revenue' : 'By Units Sold'})
                            </h4>
                          </div>
                          <span className="text-[10.5px] text-[#64748B]">
                            {perfSortBy === 'netRevenue' ? 'Net Captured' : 'Sales Volume'}
                          </span>
                        </div>

                        {/* Top Comparative Bar Chart */}
                        <div className="space-y-3 pt-3">
                          {topChartItems.length === 0 ? (
                            <p className="text-xs text-[#64748B] py-6 text-center">No sales data recorded yet.</p>
                          ) : (
                            topChartItems.map((item, idx) => {
                              const maxVal = topChartItems[0]
                                ? (perfSortBy === 'netRevenue' ? topChartItems[0].netRevenue : topChartItems[0].unitsSold)
                                : 1;
                              const currentVal = perfSortBy === 'netRevenue' ? item.netRevenue : item.unitsSold;
                              const pct = maxVal > 0 ? Math.max(8, Math.round((currentVal / maxVal) * 100)) : 8;

                              return (
                                <div key={item.productId} className="space-y-1">
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center space-x-2.5 truncate pr-2">
                                      <span className="w-5 text-center font-mono font-bold text-[#18181B] text-[11px]">
                                        0{idx + 1}
                                      </span>
                                      <img
                                        src={getOptimizedImageUrl(item.imageUrl)}
                                        alt={item.productTitle}
                                        className="w-7 h-7 rounded-lg object-cover bg-stone-100 border border-[#E2E8F0] shrink-0"
                                      />
                                      <span className="font-semibold text-[#18181B] truncate text-[11.5px]">
                                        {item.productTitle}
                                      </span>
                                    </div>
                                    
                                    <div className="text-right shrink-0 flex items-center space-x-2 font-mono">
                                      <span className="text-xs font-bold text-[#18181B]">
                                        {perfSortBy === 'netRevenue' ? `₹${item.netRevenue.toLocaleString('en-IN')}` : `${item.unitsSold} pcs`}
                                      </span>
                                      <span className="text-[10px] text-[#64748B] hidden sm:inline">
                                        {perfSortBy === 'netRevenue' ? `(${item.unitsSold} sold)` : `(₹${item.netRevenue.toLocaleString('en-IN')})`}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Charcoal & Gold Track */}
                                  <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden p-0.5">
                                    <div
                                      className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#18181B] to-[#B49A6C]"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-[#F1F5F9] text-[10.5px] text-[#64748B] flex items-center justify-between">
                        <span>Ranked by verified checkout capture</span>
                        <span className="font-mono">Top 5 Leaders</span>
                      </div>
                    </div>

                  </div>
                );
              })()}

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'rings', label: 'Rings' },
                  { id: 'earrings', label: 'Earrings' },
                  { id: 'jhumka', label: 'Dome Jhumka' },
                  { id: 'kangan-sets', label: 'Kangan Sets' },
                  { id: 'kangna', label: 'Kangna' },
                  { id: 'necklaces', label: 'Necklaces' },
                  { id: 'bracelets', label: 'Bracelets' },
                  { id: 'western', label: 'Western Jewellery' },
                  { id: 'tribal', label: 'Tribal' },
                  { id: 'accessories', label: 'Earpins & Bugadi' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setPerfCategoryFilter(cat.id)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      perfCategoryFilter === cat.id
                        ? 'bg-[#292624] text-white'
                        : 'bg-white hover:bg-[#FAF8F5] text-[#77716F] border border-[#E7E0DA]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Minimal Best Sellers Table */}
              <div className="bg-white rounded-lg border border-[#E7E0DA] shadow-subtle overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead className="bg-[#FAF8F5] text-[#77716F] uppercase font-semibold text-[11px] tracking-wider border-b border-[#E7E0DA]">
                      <tr>
                        <th className="py-2.5 px-4 w-12 text-center">#</th>
                        <th className="py-2.5 px-4">Design</th>
                        <th className="py-2.5 px-4">SKU</th>
                        <th className="py-2.5 px-4">Category</th>
                        <th className="py-2.5 px-4 text-center">Units Sold</th>
                        <th className="py-2.5 px-4 text-center">Net Revenue</th>
                        <th className="py-2.5 px-4 text-right">Current Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E0DA]">
                      {performance
                        .filter((p) => {
                          if (perfCategoryFilter !== 'all' && p.category !== perfCategoryFilter) return false;
                          if (perfSearch.trim()) {
                            const q = perfSearch.toLowerCase();
                            return p.productTitle.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
                          }
                          return true;
                        })
                        .map((item, idx) => {
                          const variant = variants.find((v) => v.productId === item.productId);
                          const isLowStock = item.stockAvailable <= 3;

                          return (
                            <tr key={item.productId} className="hover:bg-[#FAF8F5]/60 transition-colors">
                              
                              {/* Rank */}
                              <td className="py-3 px-4 text-center font-medium text-[#B49A6C]">
                                {idx + 1}
                              </td>

                              {/* Design Thumbnail & Title */}
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={getOptimizedImageUrl(item.imageUrl)}
                                    alt={item.productTitle}
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => handleImageError(e, item.imageUrl)}
                                    className="w-9 h-9 object-cover rounded border border-[#E7E0DA] bg-stone-100 shrink-0"
                                  />
                                  <span className="font-medium text-[#292624]">{item.productTitle}</span>
                                </div>
                              </td>

                              {/* SKU */}
                              <td className="py-3 px-4 font-mono text-[#77716F] text-[11px]">
                                {item.sku}
                              </td>

                              {/* Category */}
                              <td className="py-3 px-4 text-[#77716F] capitalize">
                                {item.category.replace('-', ' ')}
                              </td>

                              {/* Units Sold */}
                              <td className="py-3 px-4 text-center font-semibold text-[#292624]">
                                {item.unitsSold}
                              </td>

                              {/* Net Revenue */}
                              <td className="py-3 px-4 font-semibold text-[#292624] font-mono text-center">
                                ₹{item.netRevenue.toLocaleString('en-IN')}
                              </td>

                              {/* Current Stock */}
                              <td className="py-3 px-4 text-right">
                                <span className={`font-mono text-xs ${isLowStock ? 'text-[#8F3B30] font-bold' : 'text-[#292624] font-semibold'}`}>
                                  {item.stockAvailable} units
                                  {isLowStock && <span className="text-[10px] block text-[#8F3B30] font-sans font-medium">(Low Stock)</span>}
                                </span>
                              </td>

                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB: FINANCIAL ORDER LEDGER */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'ledger' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-[#E7E0DA] shadow-subtle overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[820px]">
                    <thead className="bg-[#FAF8F5] text-[#77716F] uppercase font-semibold text-[11px] tracking-wider border-b border-[#E7E0DA]">
                      <tr>
                        <th className="py-2.5 px-4">Order Ref</th>
                        <th className="py-2.5 px-4">Date</th>
                        <th className="py-2.5 px-4">Patron</th>
                        <th className="py-2.5 px-4">Subtotal</th>
                        <th className="py-2.5 px-4">Discounts</th>
                        <th className="py-2.5 px-4">Shipping</th>
                        <th className="py-2.5 px-4">Total Paid</th>
                        <th className="py-2.5 px-4">Net Contribution</th>
                        <th className="py-2.5 px-4 text-right">Documents</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E0DA] font-mono text-[11px]">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-[#292624]">{o.id}</td>
                          <td className="py-2.5 px-4 text-[#77716F]">
                            <div>{o.date}</div>
                            <div className="text-[10px] text-[#9E9793] font-sans">{o.orderTime || '02:30 PM'}</div>
                          </td>
                          <td className="py-2.5 px-4 font-sans font-medium text-[#292624]">{o.customerName}</td>
                          <td className="py-2.5 px-4 text-[#292624]">₹{o.subtotal.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-4 text-[#3B5432]">{o.discount > 0 ? `-₹${o.discount.toLocaleString('en-IN')}` : '₹0'}</td>
                          <td className="py-2.5 px-4 text-[#292624]">₹{o.shippingFee}</td>
                          <td className="py-2.5 px-4 font-bold text-[#292624]">₹{o.total.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-4 font-bold text-[#292624]">
                            ₹{(o.status === 'Cancelled' ? 0 : o.subtotal - o.discount).toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-4 text-right font-sans">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => setPreviewInvoiceOrder(o)}
                                title="Print / View Invoice"
                                className="px-2 py-1 rounded border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[10px] font-semibold text-[#292624] flex items-center space-x-1 cursor-pointer transition-colors"
                              >
                                <Printer className="w-3 h-3 text-[#77716F]" />
                                <span>Invoice</span>
                              </button>
                              <button
                                onClick={() => setPreviewCourierSlipOrder(o)}
                                title="Print / View Courier Slip"
                                className="px-2 py-1 rounded border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[10px] font-semibold text-[#292624] flex items-center space-x-1 cursor-pointer transition-colors"
                              >
                                <Truck className="w-3 h-3 text-[#77716F]" />
                                <span>Slip</span>
                              </button>
                              <button
                                onClick={() => handlePermanentlyDeleteOrder(o.id)}
                                title="Permanently Delete Order"
                                className="p-1 rounded hover:bg-red-50 text-[#8F3B30] hover:text-red-700 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HOME SECTION MEDIA MANAGER */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'home_media' && (
            <AdminHomeMediaManager onPreviewStorefront={onBackToStore} />
          )}

        </main>

        {/* ===================================================================== */}
        {/* MOBILE BOTTOM NAVIGATION DOCK (Native mobile feel, 1-tap switching) */}
        {/* ===================================================================== */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7E0DA] px-2 py-1.5 flex items-center justify-around shadow-lg">
          {[
            { id: 'overview', label: 'Overview', icon: DollarSign },
            { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: orders.length > 0 ? `${orders.length}` : undefined },
            { id: 'products', label: 'Products & Stock', icon: Package, badge: stockValuation.lowStockSKUs > 0 ? `${stockValuation.lowStockSKUs}` : undefined },
            { id: 'coupons', label: 'Coupons', icon: Tag },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminNavTab)}
                className={`relative flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                  isActive ? 'text-[#292624] font-bold' : 'text-[#77716F] hover:text-[#292624]'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[#B49A6C]' : 'text-[#77716F]'}`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 px-1 py-0.2 bg-[#B49A6C] text-white text-[8px] font-bold rounded-full leading-tight">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* More Drawer Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium text-[#77716F] hover:text-[#292624] cursor-pointer"
          >
            <Sliders className="w-4 h-4 mb-0.5 text-[#77716F]" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. MODAL: INVOICE PREVIEW & PRINT DIALOG (IMPROVED DESIGN) */}
      {/* ===================================================================== */}
      {previewInvoiceOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-white rounded-xl max-w-3xl w-full border border-[#E7E0DA] shadow-modal overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Controls Header */}
            <div className="px-4 sm:px-6 py-3 bg-[#1F1D1B] border-b border-[#2D2926] text-white flex items-center justify-between shrink-0 gap-2">
              <div className="flex items-center space-x-2 truncate">
                <FileText className="w-4 h-4 text-[#B49A6C] shrink-0" />
                <span className="font-semibold text-xs tracking-wider uppercase truncate">
                  Invoice {previewInvoiceOrder.id}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
                <button
                  onClick={() => handleTriggerPrint('invoice')}
                  className="px-2.5 sm:px-3 py-1.5 rounded bg-[#FAF8F5] text-[#292624] hover:bg-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print Invoice</span>
                  <span className="sm:hidden text-xs">Print</span>
                </button>
                <button
                  onClick={() => PDFService.downloadInvoice(previewInvoiceOrder)}
                  className="px-2.5 sm:px-3 py-1.5 rounded bg-[#2D2926] hover:bg-[#38332F] text-white text-xs font-medium flex items-center space-x-1.5 cursor-pointer border border-[#3D3733] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sm:hidden text-xs">PDF</span>
                </button>
                <button
                  onClick={() => setPreviewInvoiceOrder(null)}
                  className="p-1 rounded text-[#9E9793] hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Paper Container */}
            <div className="p-4 sm:p-8 overflow-y-auto bg-[#FCFBF9] text-[#292624] font-sans printable-invoice">
              
              {/* Invoice Top Branding */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-start pb-6 border-b border-[#E7E0DA] gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src={getOptimizedImageUrl('/images/Rass by Ridhima Wordmark.png')}
                      alt="Rass by Ridhima"
                      className="h-10 sm:h-12 w-auto object-contain select-none"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#B49A6C] font-semibold tracking-wider uppercase">
                    Rooted in Tradition, Made for Today • Demi-Fine Karigari
                  </p>
                  <p className="text-[11px] text-[#77716F] leading-relaxed">
                    Studio: Hyderabad, Telangana — 500034, India<br />
                    Pan-India Insured Dispatch • www.rassbyriddhima.com<br />
                    Official Support Email: Rassbyridhima@gmail.com<br />
                    Instagram: @rassbyridhima | Mon–Sat: 10:00 AM – 7:00 PM IST
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-2">
                  <span className="inline-block px-3 py-1 rounded bg-[#FAF5EC] text-[#785E2F] border border-[#EFE3CF] font-bold text-xs uppercase tracking-wider">
                    Tax & Retail Invoice
                  </span>
                  <div className="text-xs space-y-1">
                    <div><strong className="text-[#77716F]">Invoice No: </strong><span className="font-mono font-bold text-[#292624]">INV-2026-{previewInvoiceOrder.id.replace('RASS-ORD-', '')}</span></div>
                    <div><strong className="text-[#77716F]">Order Ref: </strong><span className="font-mono font-bold text-[#292624]">{previewInvoiceOrder.id}</span></div>
                    <div><strong className="text-[#77716F]">Order Date: </strong><span className="text-[#292624] font-medium">{previewInvoiceOrder.date}</span></div>
                    <div><strong className="text-[#77716F]">Order Time: </strong><span className="text-[#292624] font-semibold">{previewInvoiceOrder.orderTime || '02:30 PM IST'}</span></div>
                    <div><strong className="text-[#77716F]">Document: </strong><span className="text-[#3B5432] font-medium">Original for Recipient</span></div>
                  </div>
                </div>
              </div>

              {/* Bill To & Ship To Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 py-5 border-b border-[#E7E0DA] text-xs">
                <div>
                  <span className="font-bold text-[10px] uppercase text-[#77716F] block mb-1">Delivered & Billed To:</span>
                  <div className="font-bold text-sm text-[#292624]">{previewInvoiceOrder.customerName}</div>
                  <div className="text-[#77716F] mt-0.5 leading-relaxed">
                    {previewInvoiceOrder.shippingAddress}<br />
                    {previewInvoiceOrder.city}, {previewInvoiceOrder.state} - {previewInvoiceOrder.pincode}<br />
                    India
                  </div>
                  <div className="text-[#77716F] mt-1">Phone: {previewInvoiceOrder.phone}</div>
                  <div className="text-[#77716F]">Email: {previewInvoiceOrder.email}</div>
                </div>

                <div className="p-3.5 rounded bg-[#FAF8F5] border border-[#E7E0DA] space-y-1.5">
                  <span className="font-bold text-[10px] uppercase text-[#77716F] block">Verified Payment Record</span>
                  <div className="flex justify-between">
                    <span className="text-[#77716F]">Payment Mode:</span>
                    <span className="font-semibold text-[#292624]">{previewInvoiceOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77716F]">Payment Status:</span>
                    <span className="font-bold text-[#3B5432] bg-[#EEF3EC] px-2 py-0.5 rounded border border-[#D3E0CE] text-[10px]">
                      {previewInvoiceOrder.paymentStatus ? previewInvoiceOrder.paymentStatus.toUpperCase() : 'PAID & CAPTURED'}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-[#77716F]">Transaction ID:</span>
                    <span className="text-[#292624]">{previewInvoiceOrder.razorpayPaymentId || `pay_live_${previewInvoiceOrder.id.slice(-6)}`}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#77716F]">Captured At:</span>
                    <span className="text-[#292624]">{previewInvoiceOrder.date} • {previewInvoiceOrder.orderTime || '02:30 PM'}</span>
                  </div>
                  {previewInvoiceOrder.awbNumber && (
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-[#77716F]">AWB Routing:</span>
                      <span className="text-[#292624]">{previewInvoiceOrder.awbNumber} ({previewInvoiceOrder.courierPartner || 'Express Air'})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="py-4 overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead>
                    <tr className="border-b-2 border-[#292624] text-[#292624] font-bold uppercase text-[10px]">
                      <th className="py-2.5">Item Description</th>
                      <th className="py-2.5">SKU Code</th>
                      <th className="py-2.5 text-center">Qty</th>
                      <th className="py-2.5 text-right">Unit Price</th>
                      <th className="py-2.5 text-right">Total (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E0DA]">
                    {((previewInvoiceOrder.itemSnapshots && previewInvoiceOrder.itemSnapshots.length > 0)
                      ? previewInvoiceOrder.itemSnapshots
                      : (Array.isArray(previewInvoiceOrder.items) && previewInvoiceOrder.items.length > 0 ? previewInvoiceOrder.items.map(i => ({
                          productTitle: i?.product?.name || 'Jewellery Design',
                          sku: i?.product?.sku || 'RASS-SKU',
                          quantity: i?.quantity || 1,
                          unitPrice: i?.product?.price || 0,
                          lineSubtotal: (i?.product?.price || 0) * (i?.quantity || 1),
                        })) : [{
                          productTitle: 'Haute Demi-Fine Jewellery Creation',
                          sku: previewInvoiceOrder.id,
                          quantity: 1,
                          unitPrice: previewInvoiceOrder.subtotal,
                          lineSubtotal: previewInvoiceOrder.subtotal,
                        }])
                    ).map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/60">
                        <td className="py-3 font-semibold text-[#292624]">{item.productTitle}</td>
                        <td className="py-3 font-mono text-[#77716F]">{item.sku}</td>
                        <td className="py-3 text-center font-bold text-[#292624]">{item.quantity}</td>
                        <td className="py-3 text-right font-mono text-[#292624]">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="py-3 text-right font-mono font-bold text-[#292624]">₹{item.lineSubtotal.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Summary */}
              <div className="flex justify-end pt-3 pb-6 border-t border-[#E7E0DA]">
                <div className="w-72 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#77716F]">
                    <span>Merchandise Subtotal:</span>
                    <span className="font-mono text-[#292624] font-medium">₹{previewInvoiceOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {previewInvoiceOrder.discount > 0 && (
                    <div className="flex justify-between text-[#3B5432] font-medium">
                      <span>Discount ({previewInvoiceOrder.appliedCoupon || 'Promotion'}):</span>
                      <span className="font-mono font-bold">-₹{previewInvoiceOrder.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#77716F]">
                    <span>Insured Express Shipping:</span>
                    <span className="font-semibold text-[#3B5432] font-mono">
                      {previewInvoiceOrder.shippingFee === 0 ? 'COMPLIMENTARY' : `₹${previewInvoiceOrder.shippingFee.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#9E9793]">
                    <span>Applicable GST (3% Demi-Fine):</span>
                    <span>Included in Total</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#292624] pt-2 border-t-2 border-[#292624]">
                    <span>Grand Total Paid:</span>
                    <span className="font-mono">₹{previewInvoiceOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Certificate & Compliance Footer */}
              <div className="pt-4 border-t border-[#E7E0DA] bg-[#FAF8F5] p-3.5 rounded-lg border text-[10px] text-[#77716F] leading-relaxed">
                <p className="font-semibold text-[#B49A6C] uppercase tracking-wide mb-1">
                  Authenticity Guarantee & Jewellery Care Guide
                </p>
                <p>
                  Handcrafted with heirloom Karigari featuring brass base with premium silver / antique gold micro-polish, dual-tone oxidised silver, semi-precious stones (Kundan, Polki, Onyx, Zircon), and real freshwater & shell pearls. Anti-tarnish protective sealing coated for lasting brilliance.
                </p>
                <p className="mt-1">
                  <strong>Care:</strong> Keep away from water, soaps, perfumes, and chemical sprays. Store each piece individually in airtight zip-lock pouches. Clean with soft microfibre cloth (do not store in velvet boxes).
                </p>
                <p className="mt-1">
                  <strong>Store Policy:</strong> Exchange-only for sizing issues or defects within 48 hours of delivery. A mandatory 360° unboxing video showing sealed parcel opening is required for all claims.
                </p>
                <p className="mt-1 text-[#292624] font-medium">
                  Support & Concierge: WhatsApp +91 98197 33572 | care@rassbyridhima.com | Hyderabad, India
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. MODAL: COURIER SLIP & SHIPPING LABEL (NEW FEATURE REQUESTED!) */}
      {/* ===================================================================== */}
      {previewCourierSlipOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-white rounded-xl max-w-md w-full border border-[#E7E0DA] shadow-modal overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header Controls */}
            <div className="px-4 sm:px-5 py-3 bg-[#1F1D1B] border-b border-[#2D2926] text-white flex items-center justify-between shrink-0 gap-2">
              <span className="font-semibold text-xs tracking-wider uppercase truncate">
                Courier Shipping Slip (4x6 Label)
              </span>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => handleTriggerPrint('slip')}
                  className="px-2.5 sm:px-3 py-1 rounded bg-[#FAF8F5] text-[#292624] hover:bg-white text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print Slip</span>
                  <span className="sm:hidden text-xs">Print</span>
                </button>
                <button
                  onClick={() => setPreviewCourierSlipOrder(null)}
                  className="p-1 rounded text-[#9E9793] hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Courier Label Paper Container */}
            <div className="p-4 sm:p-6 bg-white font-sans text-[#292624] printable-courier-slip overflow-y-auto">
              
              {/* Carrier Header */}
              <div className="border-2 border-[#292624] p-3 text-center space-y-1">
                <div className="text-base font-extrabold uppercase tracking-widest text-[#292624]">
                  {previewCourierSlipOrder.courierPartner || 'SHIPROCKET AIR EXPRESS'}
                </div>
                <div className="text-[10px] font-bold text-[#77716F] tracking-wider">
                  PREMIUM LOGISTICS ROUTING • INSURED AIR CARGO
                </div>
              </div>

              {/* Simulated High-Res Barcode & AWB */}
              <div className="border-x-2 border-b-2 border-[#292624] p-3 text-center space-y-1">
                {/* SVG Vector Barcode Simulation */}
                <div className="flex justify-center items-center h-12 space-x-1 px-4 overflow-hidden">
                  {[3,1,2,4,1,3,2,1,4,2,1,3,1,2,4,1,3,2,1,4,2,3,1,2,4,1,3].map((w, idx) => (
                    <div
                      key={idx}
                      className="bg-[#292624] h-10"
                      style={{ width: `${w * 2.5}px` }}
                    />
                  ))}
                </div>
                <div className="font-mono text-sm font-bold tracking-widest text-[#292624]">
                  AWB: {previewCourierSlipOrder.awbNumber || `SR-${previewCourierSlipOrder.id.replace('RASS-ORD-', '')}-DL`}
                </div>
              </div>

              {/* Consignee (Deliver To) */}
              <div className="border-x-2 border-b-2 border-[#292624] p-3.5 text-xs">
                <span className="font-extrabold text-[10px] uppercase text-[#77716F] block mb-1">SHIP TO (CONSIGNEE):</span>
                <div className="text-sm font-bold text-[#292624]">{previewCourierSlipOrder.customerName}</div>
                <div className="font-medium text-[#292624] mt-1 leading-snug">
                  {previewCourierSlipOrder.shippingAddress}<br />
                  {previewCourierSlipOrder.city}, {previewCourierSlipOrder.state}<br />
                  <span className="font-extrabold text-sm text-[#292624]">PIN: {previewCourierSlipOrder.pincode}</span>
                </div>
                <div className="font-bold text-xs mt-1.5 text-[#292624]">Mobile: {previewCourierSlipOrder.phone}</div>
              </div>

              {/* Shipper (From) & Security Notice */}
              <div className="border-x-2 border-b-2 border-[#292624] p-3 text-[11px] grid grid-cols-2 gap-2">
                <div>
                  <span className="font-extrabold text-[9px] uppercase text-[#77716F] block mb-1">RETURN / FROM:</span>
                  <img
                    src={getOptimizedImageUrl('/images/Rass by Ridhima Wordmark.png')}
                    alt="Rass by Riddhima"
                    className="h-4.5 w-auto object-contain mb-1"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="font-bold text-[#292624] text-[11px]">Rass by Ridhima</div>
                  <div className="text-[#77716F] text-[10px] leading-tight">
                    Hyderabad Studio, Telangana — 500034<br />
                    Email: Rassbyridhima@gmail.com
                  </div>
                </div>

                <div className="border-l border-[#E7E0DA] pl-2">
                  <span className="font-extrabold text-[9px] uppercase text-[#77716F] block mb-1">PACKAGE INFO:</span>
                  <div className="text-[10px] space-y-0.5 text-[#77716F]">
                    <div><strong className="text-[#292624]">Order: </strong>{previewCourierSlipOrder.id}</div>
                    <div><strong className="text-[#292624]">Booked: </strong>{previewCourierSlipOrder.date} {previewCourierSlipOrder.orderTime ? `• ${previewCourierSlipOrder.orderTime}` : ''}</div>
                    <div><strong className="text-[#292624]">Weight: </strong>0.45 KG (Insured)</div>
                    <div><strong className="text-[#292624]">Content: </strong>Demi-Fine Jewellery</div>
                  </div>
                </div>
              </div>

              {/* Payment Condition Strip */}
              <div className="border-2 border-t-0 border-[#292624] p-2.5 bg-[#292624] text-white text-center font-bold text-xs tracking-wider uppercase">
                PREPAID ORDER — DO NOT COLLECT CASH
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. MODAL: SPLIT-SCREEN ADD PRODUCT WITH LIVE STOREFRONT PREVIEW      */}
      {/* CHARCOAL, BLACK & WHITE EYE-FRIENDLY LUXURY SUITE                   */}
      {/* ===================================================================== */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="relative bg-white rounded-2xl max-w-5xl w-full border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header: Crisp Charcoal & White */}
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#18181B] text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#B49A6C]" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-[#18181B]">
                    Publish New Creation to Storefront
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Input core details and artisan specifications. Preview updates live on the right.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewProductModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#18181B] hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Split Screen Grid: Form (7 cols) + Live Preview (5 cols) */}
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
              
              {/* LEFT COLUMN: GUIDED CHARCOAL & WHITE SPECIFICATIONS FORM */}
              <form onSubmit={handleSaveNewProduct} className="p-6 md:col-span-7 space-y-4 text-xs border-r border-[#E2E8F0] bg-white">
                
                {/* 1. Photo Dropzone */}
                <div>
                  <label className="font-semibold text-[#18181B] block mb-1">
                    1. Creation Photography *
                  </label>
                  {isOptimizingImage ? (
                    <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center space-x-2 text-[#18181B]">
                      <Loader2 className="w-4 h-4 animate-spin text-[#B49A6C]" />
                      <span className="font-medium text-[11px]">Auto-compressing to lightweight WebP...</span>
                    </div>
                  ) : (
                    <label className="flex items-center space-x-3 p-3 rounded-xl border-2 border-dashed border-[#CBD5E1] hover:border-[#18181B] bg-[#F8FAFC] hover:bg-white transition-all cursor-pointer group">
                      <img
                        src={getOptimizedImageUrl(newProductForm.image)}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover bg-white border border-[#E2E8F0] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-[#18181B] block text-xs group-hover:text-black transition-colors">
                          Choose Photo from Device
                        </span>
                        <span className="text-[10.5px] text-[#64748B] block mt-0.5">
                          High resolution • Auto-optimized to lightweight WebP
                        </span>
                      </div>
                      <Upload className="w-4 h-4 text-[#18181B] shrink-0 mr-1" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProductImageUpload(file);
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* 2. Design Title */}
                <div>
                  <label className="font-semibold text-[#18181B] block mb-1">
                    2. Jewellery Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Kundan Meenakari Dome Jhumka"
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#18181B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10"
                  />
                </div>

                {/* 3. Category Selector */}
                <div>
                  <label className="font-semibold text-[#18181B] block mb-1">
                    3. Collection Category *
                  </label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => {
                      const cat = e.target.value as ProductCategory;
                      const defaults = categoryDefaultImages[cat];
                      const isCustomUploaded = newProductForm.image.startsWith('http') && newProductForm.image.includes('storage/v1/object/public');
                      setNewProductForm(prev => ({
                        ...prev,
                        category: cat,
                        categoryDisplay: categoryDisplayNames[cat] || cat,
                        sku: generateCategorySku(cat),
                        image: isCustomUploaded ? prev.image : (defaults?.image || prev.image),
                        cleanImage: isCustomUploaded ? prev.cleanImage : (defaults?.cleanImage || prev.cleanImage),
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10 cursor-pointer"
                  >
                    <option value="jhumka">Jhumka (Bell Domes)</option>
                    <option value="rings">Rings (Anguthi)</option>
                    <option value="necklaces">Necklaces &amp; Chokers (Haar)</option>
                    <option value="western">Western &amp; Contemporary</option>
                    <option value="kadas">Kadas &amp; Solid Bangles</option>
                    <option value="kangan-sets">Kangan Sets (Pairs)</option>
                    <option value="kangna">Kangna (Single)</option>
                    <option value="earrings">Earrings &amp; Drops</option>
                    <option value="accessories">Earpins &amp; Bugadi Clips</option>
                    <option value="bracelets">Bracelets &amp; Chains</option>
                    <option value="tribal">Tribal &amp; Oxidised Silver</option>
                    <option value="toran">Doorway Toran &amp; Decor</option>
                  </select>
                </div>

                {/* 4. Commercial Pricing */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="font-semibold text-[#18181B] block mb-1">
                      4. Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="e.g. 2490"
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold font-mono text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10"
                    />
                    <span className="text-[10px] text-[#64748B] block mt-0.5">Authoritative patron checkout price</span>
                  </div>

                  <div>
                    <label className="font-semibold text-[#18181B] block mb-1">
                      Cut Price / Struck MRP (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 3490"
                      value={newProductForm.costPrice ? Math.round(newProductForm.price * 1.35) : ''}
                      onChange={(e) => {
                        const mrp = Number(e.target.value);
                        if (mrp > newProductForm.price) {
                          setNewProductForm(prev => ({ ...prev, costPrice: Math.round(newProductForm.price * 0.45) }));
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-mono text-[#64748B] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10"
                    />
                    <span className="text-[10px] text-[#64748B] block mt-0.5">
                      Optional struck-through display price
                    </span>
                  </div>
                </div>

                {/* 5. Inventory & SKU */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="font-semibold text-[#18181B] block mb-1">
                      5. Initial Available Stock *
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={newProductForm.initialStock}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, initialStock: Number(e.target.value) }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold font-mono text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#18181B] block mb-1">
                      System SKU Code
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={newProductForm.sku}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-mono text-[#64748B]"
                    />
                  </div>
                </div>

                {/* 6. ARTISAN SPECIFICATIONS & CRAFTSMANSHIP (EXPANDED SUITE) */}
                <div className="pt-3 border-t border-[#E2E8F0] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#18181B] uppercase tracking-wider block">
                      6. Artisan Specifications &amp; Materials
                    </span>
                    <span className="text-[10px] text-[#64748B] font-medium">Surfaces on Product Page</span>
                  </div>

                  {/* Metal Purity & Plating */}
                  <div>
                    <label className="font-semibold text-[#18181B] block mb-1">
                      Base Metal &amp; Plating
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {[
                        'Solid Brass with 18k Micro Gold Polish',
                        'Anti-Tarnish Stainless Steel',
                        'Oxidised 925 Silver Finish',
                        'Dual-Tone Gold & Silver',
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setNewProductForm(prev => ({ ...prev, metal: preset }))}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                            newProductForm.metal === preset
                              ? 'bg-[#18181B] text-white border-[#18181B] font-semibold'
                              : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#18181B]'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={newProductForm.metal}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, metal: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10"
                    />
                  </div>

                  {/* Gemstones & Embellishments */}
                  <div>
                    <label className="font-semibold text-[#18181B] block mb-1">
                      Gemstones &amp; Embellishments
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {[
                        'Kundan & Pearls',
                        'AAA Cubic Zirconia',
                        'Uncut Polki & Hydro Beads',
                        'Meenakari Enamel',
                        'Pure Metal (No Stone)',
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setNewProductForm(prev => ({ ...prev, gemstones: preset }))}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                            newProductForm.gemstones === preset
                              ? 'bg-[#18181B] text-white border-[#18181B] font-semibold'
                              : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#18181B]'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={newProductForm.gemstones}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, gemstones: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10"
                    />
                  </div>

                  {/* Dimensions & Weight Grid */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="font-semibold text-[#18181B] block mb-1">
                        Dimensions &amp; Fit
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 42cm length + 5cm extender"
                        value={newProductForm.dimensions}
                        onChange={(e) => setNewProductForm(prev => ({ ...prev, dimensions: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10"
                      />
                      <div className="flex flex-wrap gap-1 mt-1">
                        {['45cm + 5cm Extender', 'Drop: 5cm', 'Adjustable Free Size'].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setNewProductForm(prev => ({ ...prev, dimensions: d }))}
                            className="text-[9.5px] px-1.5 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#18181B] cursor-pointer"
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-[#18181B] block mb-1">
                        Net Weight (grams)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 7.5g"
                        value={newProductForm.weight}
                        onChange={(e) => setNewProductForm(prev => ({ ...prev, weight: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10"
                      />
                      <div className="flex flex-wrap gap-1 mt-1">
                        {['5.0g (Light)', '8.5g', '15.0g', '28.0g'].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setNewProductForm(prev => ({ ...prev, weight: w }))}
                            className="text-[9.5px] px-1.5 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#18181B] cursor-pointer"
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Editorial Description */}
                  <div>
                    <label className="font-semibold text-[#18181B] block mb-1">
                      Artisan Story &amp; Description
                    </label>
                    <textarea
                      rows={2}
                      value={newProductForm.description}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10 resize-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsNewProductModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#18181B] hover:bg-neutral-50 font-medium cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#18181B] hover:bg-black text-white font-bold tracking-wide shadow-sm flex items-center space-x-2 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#B49A6C]" />
                    <span>Publish Creation to Storefront</span>
                  </button>
                </div>
              </form>

              {/* RIGHT COLUMN: LIVE STOREFRONT CARD PREVIEW (CHARCOAL & WHITE) */}
              <div className="p-6 md:col-span-5 bg-[#F8FAFC] flex flex-col items-center justify-center border-t md:border-t-0 border-[#E2E8F0]">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#18181B] block mb-3">
                  Live Storefront Preview
                </span>

                {/* Replica Product Card */}
                <div className="w-full max-w-[250px] bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden">
                  <div className="relative aspect-[4/5] bg-[#F1F5F9] overflow-hidden">
                    <img
                      src={getOptimizedImageUrl(newProductForm.image)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-[#18181B] text-white text-[8.5px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      NEW PIECE
                    </span>
                  </div>
                  <div className="p-3.5 space-y-1.5">
                    <span className="text-[9.5px] uppercase tracking-wider text-[#B49A6C] font-bold block">
                      {categoryDisplayNames[newProductForm.category] || 'Jewellery'}
                    </span>
                    <h4 className="font-semibold text-[#18181B] text-xs truncate">
                      {newProductForm.name || 'Your Jewellery Title Here'}
                    </h4>

                    {/* Specifications Chip in Live Card */}
                    <div className="pt-0.5 pb-1">
                      <span className="text-[9.5px] font-medium text-[#64748B] bg-[#F8FAFC] px-1.5 py-0.5 rounded border border-[#E2E8F0] block truncate">
                        ✦ {newProductForm.metal} • {newProductForm.gemstones}
                      </span>
                    </div>

                    <div className="flex items-baseline space-x-1.5 pt-0.5">
                      <span className="font-bold font-mono text-sm text-[#18181B]">
                        ₹{Number(newProductForm.price || 0).toLocaleString('en-IN')}
                      </span>
                      {newProductForm.costPrice ? (
                        <span className="text-[10.5px] font-mono text-[#94A3B8] line-through">
                          ₹{Math.round(newProductForm.price * 1.35).toLocaleString('en-IN')}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <p className="text-[10.5px] text-[#64748B] text-center mt-3 max-w-[220px]">
                  Exact replica seen by patrons upon publication.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {quickAdjustVariant && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-white rounded-xl max-w-sm w-full border border-[#E7E0DA] shadow-modal p-4 sm:p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E0DA] mb-3">
              <h3 className="font-semibold text-sm text-[#292624]">Batch Adjust Stock</h3>
              <button onClick={() => setQuickAdjustVariant(null)} className="p-1 text-[#77716F] hover:text-[#292624] cursor-pointer transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#77716F] mb-3">
              SKU: <strong className="font-mono text-[#292624]">{quickAdjustVariant.sku}</strong> (Current: {quickAdjustVariant.stockQuantity} units)
            </p>

            <form onSubmit={handleApplyQuickRestockModal} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#292624] mb-1">Units Delta (+ / -)</label>
                <div className="flex items-center space-x-2">
                  {[-5, -1, 1, 5, 10, 25].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setQuickAdjustUnits(preset)}
                      className={`px-2 py-1 rounded text-xs font-medium border cursor-pointer transition-colors ${
                        quickAdjustUnits === preset ? 'bg-[#292624] text-white border-[#292624]' : 'bg-white border-[#E7E0DA] hover:bg-[#FAF8F5] text-[#292624]'
                      }`}
                    >
                      {preset > 0 ? `+${preset}` : preset}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={quickAdjustUnits}
                  onChange={(e) => setQuickAdjustUnits(Number(e.target.value))}
                  className="w-full mt-2 px-3 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs font-bold text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#292624] mb-1">Reason / Reference</label>
                <input
                  type="text"
                  required
                  value={quickAdjustReason}
                  onChange={(e) => setQuickAdjustReason(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                />
              </div>

              <div className="pt-2 border-t border-[#E7E0DA] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setQuickAdjustVariant(null)}
                  className="px-3 py-1.5 rounded border border-[#E7E0DA] text-xs font-medium hover:bg-[#FAF8F5] text-[#292624] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#292624] text-white text-xs font-medium hover:bg-[#1C1A18] cursor-pointer transition-colors"
                >
                  Apply Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 7. MODAL: ASSIGN TRACKING / COURIER AWB */}
      {/* ===================================================================== */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-white rounded-xl max-w-sm w-full border border-[#E7E0DA] shadow-modal p-4 sm:p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E0DA] mb-3">
              <h3 className="font-semibold text-sm text-[#292624]">Assign Courier & Manifest</h3>
              <button onClick={() => setTrackingOrder(null)} className="p-1 text-[#77716F] hover:text-[#292624] cursor-pointer transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#292624] mb-1">Courier Partner</label>
                <select
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                >
                  <option value="Shiprocket Express">Shiprocket Express</option>
                  <option value="Delhivery Surface">Delhivery Surface</option>
                  <option value="BlueDart Air Insured">BlueDart Air Insured</option>
                  <option value="Direct Hand Delivery">Direct Hand Delivery</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#292624] mb-1">AWB Number</label>
                <input
                  type="text"
                  required
                  value={awbNumber}
                  onChange={(e) => setAwbNumber(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs font-mono uppercase text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                />
              </div>

              <div className="pt-2 border-t border-[#E7E0DA] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setTrackingOrder(null)}
                  className="px-3 py-1.5 rounded border border-[#E7E0DA] text-xs font-medium hover:bg-[#FAF8F5] text-[#292624] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#292624] text-white text-xs font-medium hover:bg-[#1C1A18] cursor-pointer transition-colors"
                >
                  Save & Mark Shipped
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 8. MODAL: INTUITIVE PROMOTIONAL COUPON CREATION                      */}
      {/* ===================================================================== */}
      {isNewCouponModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative bg-white rounded-2xl max-w-lg w-full border border-[#E7E0DA] shadow-modal p-6 sm:p-7 max-h-[92vh] overflow-y-auto space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E0DA]">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-[#FAF5F9] border border-[#E2D5E5] flex items-center justify-center text-[#A783A2]">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#292624]">
                    Create Promotional Privilege
                  </h3>
                  <p className="text-[11px] text-[#77716F]">
                    Define storewide discount codes or client-specific celebrations.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsNewCouponModalOpen(false)} 
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#77716F] hover:text-[#292624] hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets for Instant 1-Click Setup */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-[#77716F] uppercase tracking-wider block">
                Quick Presets
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Festive 20%', code: 'FESTIVE20', type: 'percentage', val: 20, min: 2999, cap: 10000 },
                  { label: 'Welcome 10%', code: 'WELCOME10', type: 'percentage', val: 10, min: 1999, cap: 3000 },
                  { label: 'Flat ₹500', code: 'RASS500', type: 'fixed_amount', val: 500, min: 2500, cap: 500 },
                  { label: 'VIP ₹5,000', code: 'HEIRLOOM5000', type: 'fixed_amount', val: 5000, min: 50000, cap: 5000 },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setCouponForm({
                        code: p.code,
                        discountType: p.type as any,
                        discountValue: p.val,
                        minOrderValue: p.min,
                        maxDiscountCap: p.cap,
                        maxRedemptions: 250,
                        maxPerCustomer: 1,
                      });
                    }}
                    className="p-2 rounded-lg border border-[#E7E0DA] hover:border-[#B49A6C] bg-[#FAF8F5] hover:bg-white text-center transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-semibold text-[#292624] group-hover:text-[#B49A6C] block">{p.label}</span>
                    <span className="text-[10px] text-[#77716F] block mt-0.5">Min ₹{p.min.toLocaleString('en-IN')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#292624] mb-1">
                  Promotional Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE20"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E7E0DA] bg-white text-xs font-mono font-bold tracking-wider uppercase text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#292624] mb-1">Discount Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C] cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Flat Amount (INR)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#292624] mb-1">
                    {couponForm.discountType === 'percentage' ? 'Rate (%)' : 'Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={couponForm.discountType === 'percentage' ? 100 : undefined}
                    required
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E7E0DA] bg-white text-xs font-bold text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#292624] mb-1">
                    Minimum Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={couponForm.minOrderValue}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  />
                  <span className="text-[10px] text-[#77716F] block mt-0.5">0 for no minimum</span>
                </div>

                <div>
                  <label className="block font-semibold text-[#292624] mb-1">
                    Maximum Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={couponForm.maxDiscountCap}
                    onChange={(e) => setCouponForm({ ...couponForm, maxDiscountCap: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  />
                  <span className="text-[10px] text-[#77716F] block mt-0.5">Maximum deduction limit</span>
                </div>
              </div>

              {/* Live Commercial Rule Explanation Box */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E0DA] space-y-1">
                <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#B49A6C] block">
                  Rule Summary
                </span>
                <p className="text-xs text-[#292624]">
                  Patrons receive{' '}
                  <strong>
                    {couponForm.discountType === 'percentage'
                      ? `${couponForm.discountValue}% OFF`
                      : `₹${Number(couponForm.discountValue).toLocaleString('en-IN')} OFF`}
                  </strong>
                  {couponForm.minOrderValue > 0 ? (
                    <> whenever their cart reaches at least <strong>₹{Number(couponForm.minOrderValue).toLocaleString('en-IN')}</strong>.</>
                  ) : (
                    <> on all order totals.</>
                  )}
                  {couponForm.maxDiscountCap > 0 && couponForm.discountType === 'percentage' && (
                    <> Maximum benefit is capped at ₹{Number(couponForm.maxDiscountCap).toLocaleString('en-IN')}.</>
                  )}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E7E0DA] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewCouponModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E7E0DA] text-[#77716F] hover:bg-stone-50 font-medium cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#292624] text-white font-semibold hover:bg-[#1C1A18] cursor-pointer transition-colors shadow-xs"
                >
                  Create &amp; Activate Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 9. MODAL: EFFORTLESS MANUAL ORDER CREATION (CONCIERGE / WHATSAPP)   */}
      {/* CHARCOAL, BLACK & WHITE EYE-FRIENDLY LUXURY SUITE                   */}
      {/* ===================================================================== */}
      {isManualOrderModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full border border-[#E2E8F0] shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto space-y-6">
            
            {/* Header: Crisp Charcoal & White */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#18181B] text-white flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-[#B49A6C]" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-[#18181B]">
                    Create Client Order
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    For WhatsApp, Instagram, or phone concierge clients. Issues official tax bill &amp; reserves stock.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsManualOrderModalOpen(false)} 
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#18181B] hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-5 text-xs">
              
              {/* Section 1: Client Information */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-[#18181B] uppercase tracking-wider block">
                  1. Client Details &amp; Destination
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-[#18181B] mb-1">Client Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhika Goenka"
                      value={manualOrderForm.customerName}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, customerName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#18181B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#18181B] mb-1">Contact Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98201 54321"
                      value={manualOrderForm.phone}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#18181B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#18181B] mb-1">Shipping Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 14 Jubilee Hills, Road No 36"
                      value={manualOrderForm.shippingAddress}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, shippingAddress: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#18181B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#18181B] mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad"
                      value={manualOrderForm.city}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#18181B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Jewellery Piece Selection */}
              <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
                <span className="text-[11px] font-bold text-[#18181B] uppercase tracking-wider block">
                  2. Select Jewellery Piece
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                  <div className="sm:col-span-8">
                    <label className="block font-semibold text-[#18181B] mb-1">Piece Selection</label>
                    <select
                      value={manualOrderForm.productId}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, productId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10 cursor-pointer"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ₹{p.price.toLocaleString('en-IN')} ({p.categoryDisplay})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block font-semibold text-[#18181B] mb-1">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={manualOrderForm.quantity}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, quantity: Math.max(1, Number(e.target.value)) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold font-mono text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                </div>

                {/* Visual Confirmation Card for Selected Piece */}
                {(() => {
                  const selectedPiece = products.find(p => p.id === manualOrderForm.productId) || products[0];
                  if (!selectedPiece) return null;
                  return (
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <img
                        src={getOptimizedImageUrl(selectedPiece.image)}
                        alt={selectedPiece.name}
                        className="w-12 h-12 rounded-lg object-cover bg-white border border-[#E2E8F0] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-xs text-[#18181B] block truncate">
                          {selectedPiece.name}
                        </span>
                        <span className="text-[10.5px] text-[#64748B] block truncate">
                          {selectedPiece.categoryDisplay} • SKU: {selectedPiece.sku}
                        </span>
                        <div className="flex items-center space-x-2 pt-0.5">
                          <span className="font-mono font-bold text-xs text-[#18181B]">
                            ₹{selectedPiece.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-[#64748B]">
                            (Stock: {selectedPiece.stockCount} units available)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Commercial Terms */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  <div>
                    <label className="block font-semibold text-[#18181B] mb-1">Privilege Discount (₹)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={manualOrderForm.discountAmount}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, discountAmount: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold font-mono text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#18181B] mb-1">Payment Method</label>
                    <select
                      value={manualOrderForm.paymentMethod}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, paymentMethod: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10 cursor-pointer"
                    >
                      <option value="Prepaid UPI / Bank Transfer">Prepaid UPI / Bank Transfer</option>
                      <option value="Cash on Delivery (Air Express)">Cash on Delivery (COD)</option>
                      <option value="Credit / Debit Card (Razorpay)">Credit / Debit Card</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#18181B] mb-1">Payment Status</label>
                    <select
                      value={manualOrderForm.paymentStatus}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, paymentStatus: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] focus:ring-2 focus:ring-black/10 cursor-pointer"
                    >
                      <option value="captured">Captured / Paid</option>
                      <option value="pending">Pending Payment</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Matte Charcoal Summary Box */}
              {(() => {
                const prod = products.find(p => p.id === manualOrderForm.productId) || products[0];
                const price = prod?.price || 0;
                const sub = price * (manualOrderForm.quantity || 1);
                const disc = Math.min(sub, Number(manualOrderForm.discountAmount || 0));
                const total = Math.max(0, sub - disc);
                return (
                  <div className="p-4.5 rounded-2xl bg-[#18181B] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#B49A6C] block">
                        Commercial Total Breakdown
                      </span>
                      <span className="font-medium text-xs text-stone-200">
                        {prod?.name || 'Selected Piece'} (x{manualOrderForm.quantity || 1})
                      </span>
                    </div>
                    <div className="text-right">
                      {disc > 0 && (
                        <span className="text-[11px] text-emerald-400 block font-mono">
                          Discount: -₹{disc.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="text-xl font-bold font-mono text-white">
                        Total: ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsManualOrderModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#18181B] hover:bg-neutral-50 font-medium cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#18181B] hover:bg-black text-white font-semibold cursor-pointer transition-colors shadow-sm"
                >
                  Confirm Order &amp; Open Invoice
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Supabase Database Diagnostics Modal */}
      <DatabaseDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />

      {/* Festive Campaign Storefront Popup Preview Dialog */}
      <WelcomeOfferModal
        isOpen={isPreviewFestiveOpen}
        onClose={() => setIsPreviewFestiveOpen(false)}
        onApplyAndShop={() => setIsPreviewFestiveOpen(false)}
        campaign={festiveCampaign}
      />

    </div>
  );
};
