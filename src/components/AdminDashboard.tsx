import React, { useState, useEffect } from 'react';
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
  ArrowUpRight,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Menu,
  Database
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
  AdminUser
} from '../types';
import { storeService } from '../services/storeService';
import { orderService } from '../services/orderService';
import { couponService } from '../services/couponService';
import { AnalyticsService } from '../services/analyticsService';
import { PDFService } from '../services/pdfService';
import { DatabaseDiagnosticsModal } from './DatabaseDiagnosticsModal';
import { AdminHomeMediaManager } from './AdminHomeMediaManager';
import { emailService } from '../services/emailService';

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
  const [inventorySearch, setInventorySearch] = useState('');
  const [perfSortBy, setPerfSortBy] = useState<'netRevenue' | 'units'>('units');
  const [perfCategoryFilter, setPerfCategoryFilter] = useState('all');
  const [perfSearch, setPerfSearch] = useState('');

  // Modals & Slips
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isNewCouponModalOpen, setIsNewCouponModalOpen] = useState(false);
  const [previewInvoiceOrder, setPreviewInvoiceOrder] = useState<Order | null>(null);
  const [previewCourierSlipOrder, setPreviewCourierSlipOrder] = useState<Order | null>(null);

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

  const refreshAllData = () => {
    try {
      setProducts(storeService.getProducts(true));
      setVariants(storeService.getVariants());
      setOrders(orderService.getOrders());
      setCoupons(couponService.getCoupons(true));
      setMovements(storeService.getInventoryMovements());
      setMetrics(AnalyticsService.getDashboardMetrics());
      setPerformance(AnalyticsService.getProductPerformance(perfSortBy));
      setCategoryPerf(AnalyticsService.getCategoryPerformance());
    } catch (e) {
      console.error('Error refreshing admin dashboard data:', e);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [perfSortBy]);

  // Category default studio photography mappings
  const categoryDefaultImages: Record<ProductCategory, { image: string; cleanImage: string }> = {
    rings: { image: '/images/cat_rings.png', cleanImage: '/images/clean_cat_rings.png' },
    earrings: { image: '/images/cat_earrings.png', cleanImage: '/images/clean_cat_earrings.png' },
    jhumka: { image: '/images/cat_jhumka.png', cleanImage: '/images/clean_cat_jhumka.png' },
    'kangan-sets': { image: '/images/cat_kangan_sets.png', cleanImage: '/images/clean_cat_kangan_sets.png' },
    kangna: { image: '/images/cat_kangna_1.png', cleanImage: '/images/clean_cat_kangna_1.png' },
    necklaces: { image: '/images/cat_necklaces.png', cleanImage: '/images/clean_cat_necklaces.png' },
    bracelets: { image: '/images/cat_bracelets.png', cleanImage: '/images/clean_cat_bracelets.png' },
  };

  const getInitialProductForm = () => ({
    name: '',
    category: 'rings' as ProductCategory,
    categoryDisplay: 'Rings',
    price: 16500,
    costPrice: 7500,
    sku: `RASS-SKU-${Date.now().toString(36).slice(-4).toUpperCase()}`,
    description: 'Sculpted in 18k gold vermeil with authentic natural gemstones.',
    metal: '18k Gold Vermeil',
    gemstones: 'Natural Zambian Emerald & Basra Pearls',
    dimensions: '20mm crest',
    weight: '9.2g',
    initialStock: 8,
    lowStockThreshold: 3,
    image: '/images/cat_rings.png',
    cleanImage: '/images/clean_cat_rings.png',
    imageUploadMode: 'upload' as 'upload' | 'gallery' | 'url',
  });

  // Form State for NEW Product
  const [newProductForm, setNewProductForm] = useState(getInitialProductForm);

  const handleProductImageUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotification('Please upload an image file (PNG, JPG, WEBP).', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image size is larger than 5MB. Please choose a smaller image.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Optimize image size via canvas to keep localStorage responsive
        try {
          const img = new Image();
          img.onload = () => {
            const maxDim = 1000;
            let width = img.width;
            let height = img.height;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const optimized = canvas.toDataURL('image/jpeg', 0.86);
              setNewProductForm(prev => ({
                ...prev,
                image: optimized,
                cleanImage: optimized,
              }));
              showNotification('Product photo uploaded and optimized');
              return;
            }
            setNewProductForm(prev => ({
              ...prev,
              image: result,
              cleanImage: result,
            }));
            showNotification('Product photo uploaded');
          };
          img.src = result;
        } catch {
          setNewProductForm(prev => ({
            ...prev,
            image: result,
            cleanImage: result,
          }));
          showNotification('Product photo uploaded');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const defaultImg = categoryDefaultImages[newProductForm.category]?.image || '/images/cat_rings.png';
      const defaultClean = categoryDefaultImages[newProductForm.category]?.cleanImage || '/images/clean_cat_rings.png';

      storeService.createProduct({
        name: newProductForm.name,
        category: newProductForm.category,
        categoryDisplay: newProductForm.categoryDisplay,
        price: Number(newProductForm.price),
        costPrice: Number(newProductForm.costPrice),
        image: newProductForm.image || defaultImg,
        cleanImage: newProductForm.cleanImage || newProductForm.image || defaultClean,
        description: newProductForm.description,
        details: [
          `Handcrafted in ${newProductForm.metal}`,
          `Adorned with genuine ${newProductForm.gemstones}`,
          'Hallmarked 925 authenticity stamp',
          'Accompanied by suede presentation box',
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

  // Filtered Lists
  const filteredProducts = products.filter((p) => {
    if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
    if (productStatusFilter !== 'all' && p.status !== productStatusFilter) return false;
    return true;
  });

  const filteredVariants = variants.filter((v) => {
    if (!inventorySearch.trim()) return true;
    const q = inventorySearch.toLowerCase();
    const prod = products.find((p) => p.id === v.productId);
    return v.sku.toLowerCase().includes(q) || (prod && prod.name.toLowerCase().includes(q));
  });

  const filteredOrders = orderService.getOrders({
    status: orderStatusFilter,
    search: orderSearch,
  });

  const stockValuation = storeService.getStockValuation();

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
                src="/images/Rass by Ridhima Wordmark.png"
                alt="Rass by Riddhima"
                className="h-6 w-auto object-contain brightness-0 invert opacity-95 select-none"
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
              { id: 'products', label: 'Products', icon: Package },
              { id: 'inventory', label: 'Inventory', icon: Boxes, badge: stockValuation.lowStockSKUs > 0 ? `${stockValuation.lowStockSKUs}` : undefined },
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
              <span className="font-medium text-[#FAF8F5] block">Atelier Console</span>
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
      {/* 1B. DESKTOP MINIMAL ATELIER SIDEBAR */}
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
                  src="/images/Rass by Ridhima Wordmark.png"
                  alt="Rass by Riddhima"
                  className="h-6 w-auto object-contain brightness-0 invert opacity-95 select-none"
                />
              </div>
            ) : (
              <div className="w-full flex justify-center py-1">
                <span className="text-[#B49A6C] font-bold text-sm">✦</span>
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
              { id: 'products', label: 'Products', icon: Package },
              { id: 'inventory', label: 'Inventory', icon: Boxes, badge: stockValuation.lowStockSKUs > 0 ? `${stockValuation.lowStockSKUs}` : undefined },
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
                <span className="font-medium text-[#FAF8F5] block">Atelier Console</span>
                <span className="text-[10px] text-[#B49A6C]">Live & Secure</span>
              </div>
              <button
                onClick={refreshAllData}
                title="Refresh Data"
                className="p-1 text-[#9E9793] hover:text-[#FAF8F5] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
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
                src="/images/Rass by Ridhima Wordmark.png"
                alt="Rass"
                className="h-4 sm:h-5 w-auto object-contain"
              />
            </div>

            <h2 className="text-xs sm:text-sm font-semibold text-[#292624] capitalize tracking-wide truncate max-w-[130px] sm:max-w-none">
              {activeTab === 'performance' ? 'Best Sellers' : activeTab === 'home_media' ? 'Home Media Manager' : activeTab.replace('_', ' ')}
            </h2>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
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

            {/* Supabase Database Diagnostics Trigger */}
            <button
              onClick={() => setIsDiagnosticsOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-xs font-medium text-emerald-800 cursor-pointer transition-colors shadow-xs"
              title="Inspect live PostgreSQL database, Row Level Security, and stored procedures"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="hidden md:inline font-medium">Database Health</span>
              <span className="md:hidden">DB</span>
              <Database className="w-3.5 h-3.5 text-emerald-700" />
            </button>

            {/* Resend Email Integration Trigger */}
            <button
              onClick={handleSendTestEmail}
              disabled={isSendingTestMail}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-xs font-medium text-purple-800 cursor-pointer transition-colors shadow-xs disabled:opacity-50"
              title="Send a live test order status update email via Resend to verify configuration"
            >
              <Mail className="w-3.5 h-3.5 text-purple-700" />
              <span className="hidden md:inline font-medium">
                {isSendingTestMail ? 'Sending...' : 'Test Resend Mail'}
              </span>
              <span className="md:hidden">Mail</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            </button>

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
          {/* TAB: OVERVIEW — RASS ATELIER EXECUTIVE OPERATIONS PORTAL */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'overview' && metrics && (
            <div className="space-y-6">
              
              {/* 1. ATELIER EXECUTIVE BANNER WITH RASS WORDMARK LOGO & LIVE PULSE */}
              <div className="bg-white rounded-xl border border-[#E7E0DA] shadow-subtle p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
                {/* Subtle decorative motif sprig in background */}
                <div className="absolute right-0 top-0 bottom-0 pointer-events-none opacity-[0.06] select-none overflow-hidden">
                  <img
                    src="/elements/Mauve Botanical Sprig Line Art.png"
                    alt=""
                    className="h-full w-auto object-cover object-right"
                  />
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 z-10">
                  <div className="p-2 sm:p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E7E0DA] shrink-0 shadow-2xs">
                    <img
                      src="/images/Rass by Ridhima Wordmark.png"
                      alt="Rass by Riddhima"
                      className="h-7 sm:h-9 w-auto object-contain select-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-sm sm:text-lg font-bold tracking-tight text-[#292624]">
                        Atelier Commercial Pulse
                      </h1>
                      <span className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF3EC] text-[#3B5432] border border-[#D3E0CE]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3B5432] animate-pulse"></span>
                        <span>Storefront Live</span>
                      </span>
                    </div>
                    <p className="text-xs text-[#77716F] mt-0.5">
                      Haute demi-fine jewellery operations, real-time inventory balances & courier fulfillment console.
                    </p>
                  </div>
                </div>

                {/* Quick Action Toolbar on right */}
                <div className="flex items-center flex-wrap gap-2.5 z-10 shrink-0">
                  <button
                    onClick={() => {
                      setNewProductForm(getInitialProductForm());
                      setIsNewProductModalOpen(true);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#292624] hover:bg-[#1C1A18] text-white text-xs font-medium cursor-pointer transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#B49A6C]" />
                    <span>Add Design</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#292624] cursor-pointer transition-colors shadow-xs"
                  >
                    <Boxes className="w-3.5 h-3.5 text-[#B49A6C]" />
                    <span>Restock Vault</span>
                  </button>

                  <button
                    onClick={() => AnalyticsService.downloadLedgerCSV(orders)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#292624] cursor-pointer transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-[#77716F]" />
                    <span>Ledger CSV</span>
                  </button>
                </div>
              </div>

              {/* 2. OPERATIONAL STATUS STRIP (DISPATCH & VAULT GUARDS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fulfillment Dispatch Notice */}
                <div className="p-3.5 rounded-xl border border-[#E7E0DA] bg-white shadow-2xs flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F0F5] border border-[#E5D7E5] flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4 text-[#694868]" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#292624]">
                        {orders.filter(o => o.status === 'Processing').length} Orders Awaiting Dispatch
                      </div>
                      <div className="text-[11px] text-[#77716F]">
                        Insured courier packaging ready for express air routing
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('orders');
                      setOrderStatusFilter('Processing');
                    }}
                    className="text-xs font-semibold text-[#B49A6C] hover:underline cursor-pointer shrink-0 ml-3"
                  >
                    Review Queue →
                  </button>
                </div>

                {/* Stock Vault Health Notice */}
                <div className="p-3.5 rounded-xl border border-[#E7E0DA] bg-white shadow-2xs flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                      stockValuation.lowStockSKUs > 0
                        ? 'bg-[#FDF2F0] border-[#F8D4CF] text-[#8F3B30]'
                        : 'bg-[#EEF3EC] border-[#D3E0CE] text-[#3B5432]'
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#292624]">
                        {stockValuation.lowStockSKUs > 0
                          ? `${stockValuation.lowStockSKUs} Pieces Below Safety Threshold`
                          : 'Inventory Vault Fully Stocked'}
                      </div>
                      <div className="text-[11px] text-[#77716F]">
                        {stockValuation.lowStockSKUs > 0
                          ? 'Restock recommended to prevent checkout stockouts'
                          : 'All designs healthy above buffer threshold'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="text-xs font-semibold text-[#B49A6C] hover:underline cursor-pointer shrink-0 ml-3"
                  >
                    Manage Stock →
                  </button>
                </div>
              </div>

              {/* 3. ELEVATED RASS KPI CARDS WITH BRAND PALETTE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Today's Net Sales */}
                <div className="p-5 bg-white rounded-xl border border-[#E7E0DA] shadow-subtle flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] uppercase tracking-wider text-[#77716F] font-bold">
                        Today's Net Sales
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-[#FAF5EC] border border-[#EFE3CF] flex items-center justify-center">
                        <DollarSign className="w-3.5 h-3.5 text-[#B49A6C]" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#292624] tracking-tight">
                      ₹{metrics.netSalesToday.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#E7E0DA]/60 flex items-center justify-between text-[11px]">
                    <span className="text-[#77716F]">Gross: ₹{metrics.grossSalesToday.toLocaleString('en-IN')}</span>
                    <span className="font-semibold text-[#3B5432] bg-[#EEF3EC] px-1.5 py-0.5 rounded text-[10px]">
                      Live Pulse
                    </span>
                  </div>
                </div>

                {/* 2. Total Captured Revenue */}
                <div className="p-5 bg-white rounded-xl border border-[#E7E0DA] shadow-subtle flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] uppercase tracking-wider text-[#77716F] font-bold">
                        Total Captured
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-[#EEF3EC] border border-[#D3E0CE] flex items-center justify-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#3B5432]" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#292624] tracking-tight">
                      ₹{metrics.paidRevenueTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#E7E0DA]/60 flex items-center justify-between text-[11px]">
                    <span className="text-[#77716F]">
                      {orders.filter(o => o.paymentStatus === 'captured').length} captured orders
                    </span>
                    <span className="font-semibold text-[#694868] bg-[#F5F0F5] px-1.5 py-0.5 rounded text-[10px]">
                      100% Verified
                    </span>
                  </div>
                </div>

                {/* 3. Total Orders & Basket Size */}
                <div className="p-5 bg-white rounded-xl border border-[#E7E0DA] shadow-subtle flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] uppercase tracking-wider text-[#77716F] font-bold">
                        Orders & Basket
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-[#F5F0F5] border border-[#E5D7E5] flex items-center justify-center">
                        <ShoppingCart className="w-3.5 h-3.5 text-[#694868]" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#292624] tracking-tight">
                      {metrics.totalOrdersCount} <span className="text-sm font-normal text-[#77716F]">orders</span>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#E7E0DA]/60 flex items-center justify-between text-[11px]">
                    <span className="text-[#77716F]">
                      AOV: ₹{metrics.averageOrderValue.toLocaleString('en-IN')}
                    </span>
                    <span className="font-semibold text-[#B49A6C]">
                      {orders.filter(o => o.status === 'Delivered').length} Delivered
                    </span>
                  </div>
                </div>

                {/* 4. Vault Stock & Valuation */}
                <div className="p-5 bg-white rounded-xl border border-[#E7E0DA] shadow-subtle flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] uppercase tracking-wider text-[#77716F] font-bold">
                        Jewellery in Vault
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E7E0DA] flex items-center justify-center">
                        <Boxes className="w-3.5 h-3.5 text-[#292624]" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#292624] tracking-tight">
                      {stockValuation.totalUnits} <span className="text-sm font-normal text-[#77716F]">pieces</span>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#E7E0DA]/60 flex items-center justify-between text-[11px]">
                    <span className="text-[#77716F]">
                      Val: ₹{stockValuation.retailValuation.toLocaleString('en-IN')}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      stockValuation.lowStockSKUs > 0 ? 'bg-[#FDF2F0] text-[#8F3B30]' : 'bg-[#EEF3EC] text-[#3B5432]'
                    }`}>
                      {stockValuation.lowStockSKUs > 0 ? `${stockValuation.lowStockSKUs} Low` : 'Healthy'}
                    </span>
                  </div>
                </div>

              </div>

              {/* 4. TWO-COLUMN ATELIER OPERATIONS CONTROL CENTER */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT COLUMN (2 of 3 spans): Recent Orders & Live Fulfillment Stream */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-[#E7E0DA] shadow-subtle p-5 flex flex-col justify-between">
                  <div>
                    {/* Header with Title & Filter Tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7E0DA] mb-3">
                      <div>
                        <h3 className="font-semibold text-sm text-[#292624] flex items-center space-x-2">
                          <span>Fulfillment Stream</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#FAF8F5] border border-[#E7E0DA] text-[#77716F]">
                            {orders.length} total
                          </span>
                        </h3>
                        <p className="text-xs text-[#77716F]">Live customer orders and courier dispatches</p>
                      </div>

                      {/* Filter Pills */}
                      <div className="flex items-center space-x-1 bg-[#FAF8F5] p-1 rounded-lg border border-[#E7E0DA] text-[11px]">
                        {(['all', 'Processing', 'Shipped', 'Delivered'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => setOverviewOrderFilter(st)}
                            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                              overviewOrderFilter === st
                                ? 'bg-[#292624] text-white shadow-xs'
                                : 'text-[#77716F] hover:text-[#292624]'
                            }`}
                          >
                            {st === 'all' ? 'All' : st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Orders List */}
                    <div className="divide-y divide-[#E7E0DA] text-xs">
                      {orders
                        .filter(o => overviewOrderFilter === 'all' || o.status === overviewOrderFilter)
                        .slice(0, 6)
                        .map((o) => {
                          const snapshots = o.itemSnapshots && o.itemSnapshots.length > 0 ? o.itemSnapshots : [];
                          const safeItems = Array.isArray(o.items) ? o.items : [];
                          const pieceCount = snapshots.length > 0
                            ? snapshots.reduce((acc, s) => acc + (s.quantity || 1), 0)
                            : safeItems.reduce((acc, i) => acc + (i?.quantity || 1), 0);
                          const pieceTitles = snapshots.length > 0
                            ? snapshots.map(s => s.productTitle).filter(Boolean).join(', ')
                            : safeItems.map(i => i?.product?.name).filter(Boolean).join(', ');

                          return (
                            <div key={o.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F5]/60 px-2 rounded-lg transition-colors">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono font-bold text-[#292624]">{o.id}</span>
                                  <span className="text-[#C2BCB6]">•</span>
                                  <span className="font-medium text-[#292624]">{o.customerName}</span>
                                  <span className="text-[#C2BCB6]">•</span>
                                  <span className="text-[#77716F]">{o.city}</span>
                                </div>
                                <div className="text-[11px] text-[#77716F] mt-0.5">
                                  {o.date} at {o.orderTime || '02:30 PM'} • {pieceCount} piece{pieceCount !== 1 ? 's' : ''} {pieceTitles ? `(${pieceTitles})` : ''}
                                </div>
                              </div>

                            <div className="flex items-center flex-wrap gap-2 shrink-0 justify-between sm:justify-end w-full sm:w-auto">
                              <span className="font-bold text-sm text-[#292624] font-mono mr-1">
                                ₹{o.total.toLocaleString('en-IN')}
                              </span>

                              <select
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                                className={`px-2 py-0.5 rounded text-[11px] font-medium border focus:outline-none cursor-pointer ${
                                  o.status === 'Delivered' ? 'bg-[#EEF3EC] text-[#3B5432] border-[#D3E0CE]' :
                                  o.status === 'Shipped' ? 'bg-[#F5F0F5] text-[#694868] border-[#E5D7E5]' :
                                  o.status === 'Cancelled' ? 'bg-[#FDF2F0] text-[#8F3B30] border-[#F8D4CF]' :
                                  'bg-[#FAF5EC] text-[#785E2F] border-[#EFE3CF]'
                                }`}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>

                              <button
                                onClick={() => setPreviewInvoiceOrder(o)}
                                title="Tax Invoice"
                                className="px-2 py-1 rounded border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[11px] font-medium text-[#292624] flex items-center space-x-1 cursor-pointer transition-colors"
                              >
                                <Printer className="w-3 h-3 text-[#77716F]" />
                                <span>Invoice</span>
                              </button>

                              <button
                                onClick={() => setPreviewCourierSlipOrder(o)}
                                title="Courier Shipping Slip"
                                className="px-2 py-1 rounded border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[11px] font-medium text-[#292624] flex items-center space-x-1 cursor-pointer transition-colors"
                              >
                                <Truck className="w-3 h-3 text-[#77716F]" />
                                <span>Slip</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#E7E0DA] flex items-center justify-between text-xs">
                    <span className="text-[#77716F]">
                      Showing recent orders • Instant printable tax invoices & courier slips
                    </span>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="font-medium text-[#B49A6C] hover:underline cursor-pointer"
                    >
                      View Complete Order Stream ({orders.length}) →
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN (1 of 3 spans): Atelier Highlights & Quick Controls */}
                <div className="space-y-5">
                  
                  {/* 1. Best Seller Design Spotlight */}
                  {performance.length > 0 && (
                    <div className="bg-white rounded-xl border border-[#E7E0DA] shadow-subtle p-5">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E7E0DA] mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-[#B49A6C]">✦</span>
                          <span className="font-semibold text-xs tracking-wider uppercase text-[#292624]">
                            Top Selling Piece
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF5EC] text-[#785E2F] border border-[#EFE3CF]">
                          #1 Demand
                        </span>
                      </div>

                      <div className="flex items-center space-x-3.5">
                        <img
                          src={performance[0].imageUrl}
                          alt={performance[0].productTitle}
                          className="w-16 h-16 rounded-lg object-cover border border-[#E7E0DA] bg-[#FAF8F5] shrink-0"
                        />
                        <div>
                          <h4 className="font-semibold text-xs text-[#292624] line-clamp-1">
                            {performance[0].productTitle}
                          </h4>
                          <div className="text-[11px] text-[#77716F] font-mono mt-0.5">
                            {performance[0].sku}
                          </div>
                          <div className="text-xs font-bold text-[#292624] mt-1">
                            ₹{performance[0].netRevenue.toLocaleString('en-IN')}{' '}
                            <span className="text-[11px] font-normal text-[#77716F]">
                              ({performance[0].unitsSold} sold)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-[#E7E0DA] flex items-center justify-between text-xs">
                        <span className="text-[#77716F]">
                          In Vault: <strong className="text-[#292624]">{performance[0].stockAvailable} units</strong>
                        </span>
                        <button
                          onClick={() => setActiveTab('performance')}
                          className="text-xs font-medium text-[#B49A6C] hover:underline cursor-pointer"
                        >
                          Rankings →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 2. Category Performance Bars */}
                  <div className="bg-white rounded-xl border border-[#E7E0DA] shadow-subtle p-5">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E7E0DA] mb-3">
                      <span className="font-semibold text-xs tracking-wider uppercase text-[#292624]">
                        Category Sales Share
                      </span>
                      <span className="text-[10px] text-[#77716F]">By Volume</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      {categoryPerf.slice(0, 4).map((cat, idx) => {
                        const barColors = [
                          'bg-[#B49A6C]', // Antique Gold
                          'bg-[#A783A2]', // Dusty Mauve
                          'bg-[#C8D4C1]', // Muted Sage
                          'bg-[#292624]', // Deep Espresso
                        ];
                        const colorClass = barColors[idx % barColors.length];

                        return (
                          <div key={cat.category}>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="font-medium text-[#292624]">{cat.label}</span>
                              <span className="text-[#77716F] font-mono">
                                ₹{(cat.revenue ?? cat.netRevenue ?? 0).toLocaleString('en-IN')} ({cat.percentage ?? 0}%)
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E7E0DA]/50">
                              <div
                                className={`h-full ${colorClass} rounded-full transition-all duration-500`}
                                style={{ width: `${Math.max(cat.percentage ?? 0, 8)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Low Stock Attention Box (if any items low) */}
                  {variants.filter(v => (v.stockQuantity - v.reservedQuantity) <= v.lowStockThreshold).length > 0 && (
                    <div className="bg-white rounded-xl border border-[#F8D4CF] shadow-subtle p-4 bg-gradient-to-br from-white to-[#FDF2F0]/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#8F3B30]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Vault Restock Needed</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#8F3B30] bg-[#FDF2F0] px-1.5 py-0.5 rounded border border-[#F8D4CF]">
                          {variants.filter(v => (v.stockQuantity - v.reservedQuantity) <= v.lowStockThreshold).length} SKUs
                        </span>
                      </div>

                      <div className="divide-y divide-[#E7E0DA]/50 text-xs">
                        {variants
                          .filter(v => (v.stockQuantity - v.reservedQuantity) <= v.lowStockThreshold)
                          .slice(0, 3)
                          .map((v) => {
                            const prod = products.find(p => p.id === v.productId);
                            return (
                              <div key={v.id} className="py-2 flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-[#292624] block text-[11px] line-clamp-1">{prod?.name || v.sku}</span>
                                  <span className="text-[10px] font-mono text-[#77716F]">{v.sku}</span>
                                </div>
                                <div className="flex items-center space-x-2 shrink-0">
                                  <span className="font-bold text-[#8F3B30] text-[11px]">{v.stockQuantity} left</span>
                                  <button
                                    onClick={() => handleQuickStockStep(v, 5)}
                                    className="px-2 py-0.5 rounded bg-[#292624] hover:bg-[#1C1A18] text-white text-[10px] font-medium cursor-pointer transition-colors"
                                    title="Add 5 units immediately"
                                  >
                                    +5
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB: INVENTORY & STOCK MANAGEMENT (FULLY WORKING UPDATES) */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white rounded-lg border border-[#E7E0DA] shadow-subtle text-xs">
                <div>
                  <span className="text-[#77716F] block font-semibold uppercase text-[11px] tracking-wider">Total Available Units</span>
                  <span className="text-xl font-bold text-[#292624]">{stockValuation.totalUnits} pcs</span>
                </div>
                <div>
                  <span className="text-[#77716F] block font-semibold uppercase text-[11px] tracking-wider">Retail Stock Value</span>
                  <span className="text-xl font-bold text-[#292624]">₹{stockValuation.retailValuation.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[#77716F] block font-semibold uppercase text-[11px] tracking-wider">Cost Inventory Value</span>
                  <span className="text-xl font-bold text-[#292624]">₹{stockValuation.costValuation.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[#77716F] block font-semibold uppercase text-[11px] tracking-wider">Low Stock SKUs</span>
                  <span className={`text-xl font-bold ${stockValuation.lowStockSKUs > 0 ? 'text-[#8F3B30]' : 'text-[#3B5432]'}`}>
                    {stockValuation.lowStockSKUs}
                  </span>
                </div>
              </div>

              {/* Search & Filter */}
              <div className="p-3 bg-white rounded-lg border border-[#E7E0DA] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#77716F]" />
                  <input
                    type="text"
                    placeholder="Search by SKU or product name..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  />
                </div>
                <span className="text-xs text-[#77716F]">
                  Click +/- to step stock or "Batch Adjust" for restock
                </span>
              </div>

              {/* Inventory Balances Table */}
              <div className="bg-white rounded-lg border border-[#E7E0DA] shadow-subtle overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[760px]">
                    <thead className="bg-[#FAF8F5] text-[#77716F] uppercase font-semibold text-[11px] tracking-wider border-b border-[#E7E0DA]">
                      <tr>
                        <th className="py-2.5 px-4">SKU</th>
                        <th className="py-2.5 px-4">Design Name</th>
                        <th className="py-2.5 px-4">Option</th>
                        <th className="py-2.5 px-4">Stock on Hand</th>
                        <th className="py-2.5 px-4">Reserved</th>
                        <th className="py-2.5 px-4">Available</th>
                        <th className="py-2.5 px-4">Safety Status</th>
                        <th className="py-2.5 px-4 text-right">Quick Stock Update</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E0DA]">
                      {filteredVariants.map((v) => {
                        const prod = products.find((p) => p.id === v.productId);
                        const available = v.stockQuantity - v.reservedQuantity;
                        const isLow = available <= v.lowStockThreshold;
                        const isOut = available <= 0;

                        return (
                          <tr key={v.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                            <td className="py-3 px-4 font-mono font-semibold text-[#292624]">{v.sku}</td>
                            <td className="py-3 px-4 font-medium text-[#292624]">{prod?.name || 'Design'}</td>
                            <td className="py-3 px-4 text-[#77716F]">{v.variantName}</td>
                            <td className="py-3 px-4 font-bold text-[#292624]">{v.stockQuantity}</td>
                            <td className="py-3 px-4 text-[#77716F]">{v.reservedQuantity}</td>
                            <td className="py-3 px-4 font-semibold text-[#292624]">{available}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                isOut ? 'bg-[#FDF2F0] text-[#8F3B30] border border-[#F8D4CF]' :
                                isLow ? 'bg-[#FAF5EC] text-[#785E2F] border border-[#EFE3CF]' : 'bg-[#EEF3EC] text-[#3B5432] border border-[#D3E0CE]'
                              }`}>
                                {isOut ? 'Out of Stock' : isLow ? `Low Stock (${available} <= ${v.lowStockThreshold})` : 'In Stock'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                {/* Direct Steppers */}
                                <button
                                  onClick={() => handleQuickStockStep(v, -1)}
                                  disabled={v.stockQuantity <= 0}
                                  title="Deduct 1 unit"
                                  className="w-7 h-7 rounded border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] disabled:opacity-30 text-[#292624] flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
                                >
                                  -
                                </button>
                                <span className="font-mono text-xs font-bold w-6 text-center text-[#292624]">{v.stockQuantity}</span>
                                <button
                                  onClick={() => handleQuickStockStep(v, 1)}
                                  title="Add 1 unit"
                                  className="w-7 h-7 rounded border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[#292624] flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
                                >
                                  +
                                </button>

                                <button
                                  onClick={() => {
                                    setQuickAdjustVariant(v);
                                    setQuickAdjustUnits(5);
                                    setQuickAdjustReason('Batch Restock');
                                  }}
                                  className="ml-2 px-2.5 py-1 rounded border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[11px] font-medium text-[#292624] cursor-pointer transition-colors"
                                >
                                  Batch Adjust
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Movement Ledger View */}
              <div className="bg-white rounded-lg border border-[#E7E0DA] shadow-subtle p-4">
                <h3 className="font-semibold text-sm text-[#292624] mb-3">Inventory Movement History</h3>
                <div className="overflow-x-auto max-h-64 divide-y divide-[#E7E0DA] text-xs">
                  {movements.slice(0, 15).map((m) => (
                    <div key={m.id} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-semibold text-[#292624]">{m.sku}</span>
                        <span className="text-[#77716F] ml-2">{m.movementType.replace('_', ' ')}: {m.notes}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${m.quantityChange > 0 ? 'text-[#3B5432]' : 'text-[#8F3B30]'}`}>
                          {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange}
                        </span>
                        <span className="text-[10px] text-[#77716F] ml-3">Bal: {m.quantityAfter}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB: PRODUCTS (EDIT PRODUCT INFO REMOVED AS REQUESTED!) */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Product Filters Bar */}
              <div className="p-3 bg-white rounded-lg border border-[#E7E0DA] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="text-[#77716F] font-semibold uppercase text-[11px] tracking-wider">Category:</span>
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="border border-[#E7E0DA] rounded px-2.5 py-1.5 bg-white text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  >
                    <option value="all">All Categories</option>
                    <option value="rings">Rings</option>
                    <option value="earrings">Earrings</option>
                    <option value="jhumka">Dome Jhumka</option>
                    <option value="kangan-sets">Kangan Sets</option>
                    <option value="kangna">Kangna</option>
                    <option value="necklaces">Necklaces</option>
                    <option value="bracelets">Bracelets</option>
                  </select>

                  <span className="text-[#77716F] font-semibold uppercase text-[11px] tracking-wider ml-2">Status:</span>
                  <select
                    value={productStatusFilter}
                    onChange={(e) => setProductStatusFilter(e.target.value)}
                    className="border border-[#E7E0DA] rounded px-2.5 py-1.5 bg-white text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="text-[11px] text-[#77716F]">
                  Editing existing product prices/titles is disabled to protect Razorpay order reconciliation.
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-lg border border-[#E7E0DA] shadow-subtle overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[660px]">
                    <thead className="bg-[#FAF8F5] text-[#77716F] uppercase font-semibold text-[11px] tracking-wider border-b border-[#E7E0DA]">
                      <tr>
                        <th className="py-2.5 px-4">Design & SKU</th>
                        <th className="py-2.5 px-4">Category</th>
                        <th className="py-2.5 px-4">Retail Price</th>
                        <th className="py-2.5 px-4">Stock Count</th>
                        <th className="py-2.5 px-4">Storefront Status</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E0DA]">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          <td className="py-3 px-4 flex items-center space-x-3">
                            <img
                              src={p.cleanImage || p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded object-cover bg-stone-100 border border-[#E7E0DA]"
                            />
                            <div>
                              <span className="font-semibold text-[#292624] block">{p.name}</span>
                              <span className="text-[10px] text-[#77716F] font-mono">{p.sku || p.id}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 uppercase text-[#77716F] font-medium">{p.categoryDisplay}</td>
                          <td className="py-3 px-4 font-bold text-[#292624]">₹{p.price.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              (p.stockCount ?? 0) <= 3 ? 'bg-[#FAF5EC] text-[#785E2F] border border-[#EFE3CF]' : 'bg-[#EEF3EC] text-[#3B5432] border border-[#D3E0CE]'
                            }`}>
                              {p.stockCount ?? 0} units
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              p.status === 'published' ? 'bg-[#EEF3EC] text-[#3B5432] border border-[#D3E0CE]' :
                              p.status === 'archived' ? 'bg-[#F2EFEA] text-[#6E6761] border border-[#E4DFD8]' : 'bg-[#FAF5EC] text-[#785E2F] border border-[#EFE3CF]'
                            }`}>
                              {p.status || 'published'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => handleToggleProductStatus(p)}
                                className="px-2.5 py-1 rounded border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[11px] font-medium text-[#292624] transition-colors cursor-pointer"
                              >
                                {p.status === 'published' ? 'Deactivate' : 'Publish'}
                              </button>
                              <button
                                onClick={() => handleArchiveProduct(p)}
                                title="Archive product"
                                className="p-1 rounded hover:bg-[#FAF8F5] text-[#77716F] hover:text-[#B49A6C] transition-colors cursor-pointer"
                              >
                                <Archive className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProductSafely(p)}
                                title="Safe delete"
                                className="p-1 rounded hover:bg-[#FDF2F0] text-[#8F3B30] transition-colors cursor-pointer"
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
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB: CUSTOMER ORDERS (WITH INVOICE & COURIER SLIP MODALS) */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Order Controls */}
              <div className="p-3 bg-white rounded-lg border border-[#E7E0DA] flex flex-wrap items-center justify-between gap-3 text-xs">
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
                  <table className="w-full text-left text-xs min-w-[780px]">
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
                      {filteredOrders.map((o) => (
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

                              {o.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleCancelOrderWithRestock(o.id)}
                                  title="Cancel order & restock"
                                  className="p-1 rounded hover:bg-[#FDF2F0] text-[#8F3B30] transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
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



          {/* ----------------------------------------------------------------- */}
          {/* TAB: COUPONS & DISCOUNTS */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
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
                        <th className="py-2.5 px-4">Net Revenue</th>
                        <th className="py-2.5 px-4 text-center">Stock</th>
                        <th className="py-2.5 px-4 text-right">Action</th>
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
                                    src={item.imageUrl}
                                    alt={item.productTitle}
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
                              <td className="py-3 px-4 font-semibold text-[#292624] font-mono">
                                ₹{item.netRevenue.toLocaleString('en-IN')}
                              </td>

                              {/* Stock */}
                              <td className="py-3 px-4 text-center">
                                <span className={`font-medium ${isLowStock ? 'text-[#8F3B30] font-semibold' : 'text-[#292624]'}`}>
                                  {item.stockAvailable} {isLowStock && <span className="text-[10px] block text-[#8F3B30]">(Low)</span>}
                                </span>
                              </td>

                              {/* Action */}
                              <td className="py-3 px-4 text-right">
                                {variant ? (
                                  <button
                                    onClick={() => {
                                      setQuickAdjustVariant(variant);
                                      setQuickAdjustUnits(5);
                                      setQuickAdjustReason('Restock');
                                    }}
                                    className="px-2.5 py-1 rounded border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[11px] font-medium text-[#292624] cursor-pointer transition-colors"
                                  >
                                    + Restock
                                  </button>
                                ) : (
                                  <span className="text-[#C2BCB6]">—</span>
                                )}
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
            { id: 'overview', label: 'Pulse', icon: DollarSign },
            { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: orders.length > 0 ? `${orders.length}` : undefined },
            { id: 'products', label: 'Catalog', icon: Package },
            { id: 'inventory', label: 'Vault', icon: Boxes, badge: stockValuation.lowStockSKUs > 0 ? `${stockValuation.lowStockSKUs}` : undefined },
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
                      src="/images/Rass by Ridhima Wordmark.png"
                      alt="Rass by Ridhima"
                      className="h-10 sm:h-12 w-auto object-contain select-none"
                    />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#B49A6C] font-semibold tracking-wider uppercase">
                    Rooted in Tradition, Made for Today • Demi-Fine Karigari
                  </p>
                  <p className="text-[11px] text-[#77716F] leading-relaxed">
                    Atelier Studio: Hyderabad, Telangana — 500034, India<br />
                    Pan-India Insured Dispatch • www.rassbyriddhima.com<br />
                    Official WhatsApp: +91 98197 33572 | Email: care@rassbyridhima.com<br />
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
                  ✦ Authenticity Guarantee & Jewellery Care Guide
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
                    src="/images/Rass by Ridhima Wordmark.png"
                    alt="Rass by Riddhima"
                    className="h-4.5 w-auto object-contain mb-1"
                  />
                  <div className="font-bold text-[#292624] text-[11px]">Rass by Ridhima</div>
                  <div className="text-[#77716F] text-[10px] leading-tight">
                    Hyderabad Atelier, Telangana — 500034<br />
                    WhatsApp: +91 98197 33572
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
      {/* 5. MODAL: ADD PRODUCT (EDITING REMOVED AS REQUESTED) */}
      {/* ===================================================================== */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-white rounded-xl max-w-lg w-full border border-[#E7E0DA] shadow-modal p-4 sm:p-6 max-h-[92vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E0DA] mb-3 shrink-0">
              <h3 className="font-semibold text-sm text-[#292624]">Add New Product Design</h3>
              <button onClick={() => setIsNewProductModalOpen(false)} className="p-1 text-[#77716F] hover:text-[#292624] cursor-pointer transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewProduct} className="space-y-3.5 text-xs overflow-y-auto pr-1 flex-1">
              <div>
                <label className="block font-medium text-[#292624] mb-1">Design Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Noor Emerald Dome Ring"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#292624] mb-1">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => {
                      const cat = e.target.value as ProductCategory;
                      const displayNames: Record<ProductCategory, string> = {
                        rings: 'Rings',
                        earrings: 'Earrings',
                        jhumka: 'Dome Jhumka',
                        'kangan-sets': 'Kangan Sets',
                        kangna: 'Kangna',
                        necklaces: 'Necklaces',
                        bracelets: 'Bracelets',
                      };
                      const defaults = categoryDefaultImages[cat];
                      setNewProductForm(prev => ({
                        ...prev,
                        category: cat,
                        categoryDisplay: displayNames[cat],
                        image: prev.image.startsWith('data:') ? prev.image : (defaults?.image || prev.image),
                        cleanImage: prev.cleanImage.startsWith('data:') ? prev.cleanImage : (defaults?.cleanImage || prev.cleanImage),
                      }));
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  >
                    <option value="rings">Rings</option>
                    <option value="earrings">Earrings</option>
                    <option value="jhumka">Dome Jhumka</option>
                    <option value="kangan-sets">Kangan Sets</option>
                    <option value="kangna">Kangna</option>
                    <option value="necklaces">Necklaces</option>
                    <option value="bracelets">Bracelets</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#292624] mb-1">Unique SKU Code</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs font-mono uppercase text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  />
                </div>
              </div>

              {/* Product Photography & Image Selector */}
              <div className="space-y-2 p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E0DA]">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-xs text-[#292624]">
                    Product Photography
                  </label>
                  
                  {/* Mode Selector Tabs */}
                  <div className="flex items-center space-x-1 bg-white p-0.5 rounded-lg border border-[#E7E0DA] text-[10px]">
                    <button
                      type="button"
                      onClick={() => setNewProductForm(prev => ({ ...prev, imageUploadMode: 'upload' }))}
                      className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                        newProductForm.imageUploadMode === 'upload' ? 'bg-[#292624] text-white' : 'text-[#77716F] hover:text-[#292624]'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProductForm(prev => ({ ...prev, imageUploadMode: 'gallery' }))}
                      className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                        newProductForm.imageUploadMode === 'gallery' ? 'bg-[#292624] text-white' : 'text-[#77716F] hover:text-[#292624]'
                      }`}
                    >
                      Studio Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProductForm(prev => ({ ...prev, imageUploadMode: 'url' }))}
                      className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                        newProductForm.imageUploadMode === 'url' ? 'bg-[#292624] text-white' : 'text-[#77716F] hover:text-[#292624]'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-1">
                  {/* Image Thumbnail Preview */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#E7E0DA] bg-white shrink-0 shadow-2xs group">
                    <img
                      src={newProductForm.image || '/images/cat_rings.png'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[9px] text-white font-medium">Preview</span>
                    </div>
                  </div>

                  {/* Mode Controls */}
                  <div className="flex-1 min-w-0">
                    {newProductForm.imageUploadMode === 'upload' && (
                      <div>
                        <label className="border-2 border-dashed border-[#D5CEC7] hover:border-[#B49A6C] rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white group">
                          <Upload className="w-4 h-4 text-[#B49A6C] mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-[11px] font-medium text-[#292624]">Choose Photo to Upload</span>
                          <span className="text-[9px] text-[#77716F]">PNG, JPG, WEBP • Max 5MB</span>
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
                      </div>
                    )}

                    {newProductForm.imageUploadMode === 'gallery' && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#77716F] block">Select from Rass Jewellery Studio Library:</span>
                        <div className="grid grid-cols-4 gap-1.5 max-h-24 overflow-y-auto p-1 bg-white rounded-lg border border-[#E7E0DA]">
                          {Object.entries(categoryDefaultImages).map(([catKey, imgs]) => (
                            <button
                              key={catKey}
                              type="button"
                              onClick={() => {
                                setNewProductForm(prev => ({
                                  ...prev,
                                  image: imgs.image,
                                  cleanImage: imgs.cleanImage,
                                }));
                              }}
                              className={`relative rounded-md overflow-hidden border p-0.5 text-center transition-all cursor-pointer ${
                                newProductForm.image === imgs.image ? 'border-[#B49A6C] ring-1 ring-[#B49A6C] bg-[#FAF5EC]' : 'border-[#E7E0DA] hover:border-[#C2BCB6]'
                              }`}
                            >
                              <img src={imgs.image} alt={catKey} className="w-full h-8 object-cover rounded" />
                              <span className="text-[8px] font-medium capitalize text-[#292624] block truncate mt-0.5">{catKey}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {newProductForm.imageUploadMode === 'url' && (
                      <div className="space-y-1">
                        <label className="text-[10px] text-[#77716F] block">Direct Image or CDN URL:</label>
                        <input
                          type="url"
                          placeholder="https://images.example.com/item.jpg or /images/..."
                          value={newProductForm.image}
                          onChange={(e) => {
                            const url = e.target.value;
                            setNewProductForm(prev => ({
                              ...prev,
                              image: url,
                              cleanImage: url,
                            }));
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#292624] mb-1">Retail Price (₹)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#292624] mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newProductForm.costPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#292624] mb-1">Initial Stock (Units)</label>
                  <input
                    type="number"
                    min={0}
                    value={newProductForm.initialStock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, initialStock: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#292624] mb-1">Safety Threshold</label>
                  <input
                    type="number"
                    min={1}
                    value={newProductForm.lowStockThreshold}
                    onChange={(e) => setNewProductForm({ ...newProductForm, lowStockThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#292624] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                />
              </div>

              <div className="pt-3 border-t border-[#E7E0DA] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[#E7E0DA] text-xs font-medium hover:bg-[#FAF8F5] text-[#292624] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#292624] text-white text-xs font-medium hover:bg-[#1C1A18] cursor-pointer transition-colors"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. MODAL: QUICK BATCH INVENTORY ADJUSTMENT */}
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
                  <option value="Atelier Personal Delivery">Atelier Personal Delivery</option>
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
      {/* 8. MODAL: CREATE COUPON */}
      {/* ===================================================================== */}
      {isNewCouponModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-white rounded-xl max-w-sm w-full border border-[#E7E0DA] shadow-modal p-4 sm:p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E0DA] mb-3">
              <h3 className="font-semibold text-sm text-[#292624]">Create Coupon</h3>
              <button onClick={() => setIsNewCouponModalOpen(false)} className="p-1 text-[#77716F] hover:text-[#292624] cursor-pointer transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#292624] mb-1">Promo Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE20"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs font-mono uppercase text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#292624] mb-1">Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as any })}
                    className="w-full px-2 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#292624] mb-1">Value</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#292624] mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={couponForm.minOrderValue}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#292624] mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={couponForm.maxDiscountCap}
                    onChange={(e) => setCouponForm({ ...couponForm, maxDiscountCap: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#E7E0DA] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewCouponModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[#E7E0DA] text-xs font-medium hover:bg-[#FAF8F5] text-[#292624] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#292624] text-white text-xs font-medium hover:bg-[#1C1A18] cursor-pointer transition-colors"
                >
                  Activate
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

    </div>
  );
};
