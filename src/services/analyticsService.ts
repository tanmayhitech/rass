import { 
  Order, 
  Product, 
  ProductPerformance, 
  AnalyticsSummary, 
  ProductCategory 
} from '../types';
import { orderService } from './orderService';
import { storeService } from './storeService';

export class AnalyticsService {
  /**
   * Calculates KPI Cards strictly following documented financial formulas
   */
  public static getDashboardMetrics(): AnalyticsSummary {
    const orders = orderService.getOrders();
    const lowStockAlerts = storeService.getLowStockAlerts();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    let grossSalesToday = 0;
    let netSalesToday = 0;
    let paidRevenueTotal = 0;
    let codOrdersCount = 0;
    let codCollectionsTotal = 0;
    let totalRefunds = 0;
    let totalDiscounts = 0;
    let pendingPayments = 0;

    // Filter out cancelled or failed orders from recognized sales
    const validOrders = orders.filter((o) => o.status !== 'Cancelled' && o.paymentStatus !== 'failed');

    for (const order of validOrders) {
      const orderDate = new Date(order.createdAt || order.date);
      const isToday = orderDate >= todayStart;
      const isPaid = order.paymentStatus === 'captured';
      const isCOD = order.paymentMethod.toLowerCase().includes('cod');

      const merchandiseGross = order.subtotal;
      const orderDiscounts = order.discount;
      const orderNet = merchandiseGross - orderDiscounts;

      if (isToday) {
        grossSalesToday += merchandiseGross;
        netSalesToday += orderNet;
      }

      if (isPaid) {
        paidRevenueTotal += order.total;
      } else {
        pendingPayments += order.total;
      }

      if (isCOD) {
        codOrdersCount += 1;
        if (order.status === 'Delivered') {
          codCollectionsTotal += order.total;
        }
      }

      totalDiscounts += orderDiscounts;
    }

    // Process refunds
    const cancelledOrders = orders.filter((o) => o.status === 'Cancelled' || o.paymentStatus === 'refunded');
    for (const c of cancelledOrders) {
      totalRefunds += c.total;
    }

    const recognizedPaidOrdersCount = validOrders.filter((o) => o.paymentStatus === 'captured').length;
    const recognizedNetSalesTotal = validOrders
      .filter((o) => o.paymentStatus === 'captured')
      .reduce((sum, o) => sum + (o.subtotal - o.discount), 0);

    const averageOrderValue = recognizedPaidOrdersCount > 0
      ? Math.round(recognizedNetSalesTotal / recognizedPaidOrdersCount)
      : 0;

    return {
      grossSalesToday,
      netSalesToday,
      paidRevenueTotal,
      codOrdersCount,
      codCollectionsTotal,
      totalOrdersCount: orders.length,
      averageOrderValue,
      totalRefunds,
      totalDiscounts,
      pendingPayments,
      lowStockVariantsCount: lowStockAlerts.length,
    };
  }

  /**
   * Computes per-product performance rankings and metrics
   */
  public static getProductPerformance(sortBy: 'units' | 'netRevenue' | 'velocity' | 'stockoutRisk' = 'velocity'): ProductPerformance[] {
    const products = storeService.getProducts(true);
    const orders = orderService.getOrders();
    const validOrders = orders.filter((o) => o.status !== 'Cancelled' && o.paymentStatus !== 'failed');

    const performanceMap = new Map<string, ProductPerformance>();

    // Initialize all products
    for (const p of products) {
      performanceMap.set(p.id, {
        productId: p.id,
        productTitle: p.name,
        sku: p.sku || `RASS-SKU-${p.id.toUpperCase()}`,
        category: p.category,
        unitsSold: 0,
        grossRevenue: 0,
        discounts: 0,
        refunds: 0,
        netRevenue: 0,
        stockAvailable: p.stockCount ?? 0,
        imageUrl: p.cleanImage || p.image,
      });
    }

    // Accumulate from orders
    for (const o of validOrders) {
      const snapshots = (o.itemSnapshots && o.itemSnapshots.length > 0)
        ? o.itemSnapshots
        : (Array.isArray(o.items) ? o.items.map((i) => ({
            productId: i?.product?.id || 'prod',
            productTitle: i?.product?.name || 'Jewellery Design',
            sku: i?.product?.sku || 'RASS-SKU',
            unitPrice: i?.product?.price || 0,
            quantity: i?.quantity || 1,
            lineSubtotal: (i?.product?.price || 0) * (i?.quantity || 1),
          })) : []);

      // Approximate item-level discount proportion
      const discountRatio = (o.subtotal && o.subtotal > 0) ? (o.discount || 0) / o.subtotal : 0;

      for (const item of snapshots) {
        let perf = performanceMap.get(item.productId);
        if (!perf) {
          perf = {
            productId: item.productId,
            productTitle: item.productTitle,
            sku: item.sku,
            category: 'necklaces',
            unitsSold: 0,
            grossRevenue: 0,
            discounts: 0,
            refunds: 0,
            netRevenue: 0,
            stockAvailable: 0,
            imageUrl: '/images/cat_necklaces.png',
          };
          performanceMap.set(item.productId, perf);
        }

        const lineGross = item.lineSubtotal;
        const lineDiscount = Math.round(lineGross * discountRatio);

        perf.unitsSold += item.quantity;
        perf.grossRevenue += lineGross;
        perf.discounts += lineDiscount;
        perf.netRevenue += (lineGross - lineDiscount);
      }
    }

    const result = Array.from(performanceMap.values());
    const totalStoreNet = result.reduce((sum, p) => sum + p.netRevenue, 0);

    // Compute velocity intelligence for each product
    for (const p of result) {
      const unitsRate = p.unitsSold > 0 ? p.unitsSold : 0;
      p.unitsPerWeek = Number((unitsRate * 1.75).toFixed(1));
      
      // Revenue Contribution %
      p.revenueContributionPct = totalStoreNet > 0 
        ? Math.round((p.netRevenue / totalStoreNet) * 100) 
        : 0;

      // Estimated days of inventory remaining
      if (p.unitsSold > 0) {
        const burnRatePerDay = Math.max(0.25, p.unitsSold / 7);
        p.daysOfInventoryLeft = Math.max(1, Math.round(p.stockAvailable / burnRatePerDay));
      } else {
        p.daysOfInventoryLeft = 120; // healthy shelf life
      }

      // Stockout Risk Assessment
      if (p.stockAvailable <= 2 || (p.unitsSold > 0 && (p.daysOfInventoryLeft ?? 99) <= 7)) {
        p.stockoutRisk = 'critical';
        p.velocityTier = 'hot';
        p.restockRecommendation = Math.max(8, 15 - p.stockAvailable);
      } else if (p.stockAvailable <= 4 || (p.unitsSold > 0 && (p.daysOfInventoryLeft ?? 99) <= 14)) {
        p.stockoutRisk = 'moderate';
        p.velocityTier = p.unitsSold >= 2 ? 'hot' : 'trending';
        p.restockRecommendation = Math.max(5, 10 - p.stockAvailable);
      } else if (p.unitsSold > 0) {
        p.stockoutRisk = 'healthy';
        p.velocityTier = 'steady';
        p.restockRecommendation = 0;
      } else {
        p.stockoutRisk = p.stockAvailable > 10 ? 'excess' : 'healthy';
        p.velocityTier = 'slow';
        p.restockRecommendation = 0;
      }

      p.velocityScore = Math.min(100, Math.round((p.unitsSold * 30) + (p.revenueContributionPct * 0.7)));
    }

    if (sortBy === 'units') {
      result.sort((a, b) => b.unitsSold - a.unitsSold);
    } else if (sortBy === 'velocity') {
      result.sort((a, b) => (b.velocityScore ?? 0) - (a.velocityScore ?? 0));
    } else if (sortBy === 'stockoutRisk') {
      const riskWeight = { critical: 4, moderate: 3, healthy: 2, excess: 1 };
      result.sort((a, b) => (riskWeight[b.stockoutRisk || 'healthy'] - riskWeight[a.stockoutRisk || 'healthy']));
    } else {
      result.sort((a, b) => b.netRevenue - a.netRevenue);
    }

    return result;
  }

  /**
   * Computes category sales contribution
   */
  public static getCategoryPerformance(): Array<{
    category: ProductCategory;
    label: string;
    unitsSold: number;
    netRevenue: number;
    revenue: number;
    percentage: number;
  }> {
    const perf = this.getProductPerformance();
    const catMap = new Map<ProductCategory, { units: number; revenue: number }>();

    let totalRevenue = 0;
    for (const p of perf) {
      const current = catMap.get(p.category) || { units: 0, revenue: 0 };
      current.units += p.unitsSold;
      current.revenue += p.netRevenue;
      catMap.set(p.category, current);
      totalRevenue += p.netRevenue;
    }

    const categoryNames: Record<ProductCategory, string> = {
      'rings': 'Rings',
      'earrings': 'Earrings',
      'jhumka': 'Dome Jhumka',
      'kangan-sets': 'Kangan Sets',
      'kangna': 'Kangna',
      'necklaces': 'Necklaces',
      'bracelets': 'Bracelets',
    };

    return Object.keys(categoryNames).map((key) => {
      const cat = key as ProductCategory;
      const data = catMap.get(cat) || { units: 0, revenue: 0 };
      const pct = totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0;
      return {
        category: cat,
        label: categoryNames[cat],
        unitsSold: data.units,
        netRevenue: data.revenue,
        revenue: data.revenue,
        percentage: pct,
      };
    }).sort((a, b) => b.netRevenue - a.netRevenue);
  }

  /**
   * Generates sanitized CSV string of the Order Ledger
   */
  public static generateOrderLedgerCSV(orders: Order[]): string {
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Email',
      'Phone',
      'City',
      'State',
      'Items Count',
      'Merchandise Subtotal (INR)',
      'Discount (INR)',
      'Shipping Fee (INR)',
      'Total Amount (INR)',
      'Payment Method',
      'Payment Status',
      'Fulfilment Status',
      'Courier Partner',
      'AWB Number',
      'Net Sales Contribution (INR)',
    ];

    const rows = orders.map((o) => {
      const itemsCount = (o.itemSnapshots?.reduce((sum, s) => sum + s.quantity, 0)) ?? o.items.reduce((s, i) => s + i.quantity, 0);
      const isCancelled = o.status === 'Cancelled' || o.paymentStatus === 'refunded';
      const netContribution = isCancelled ? 0 : (o.subtotal - o.discount);

      return [
        `"${o.id}"`,
        `"${o.date || o.createdAt}"`,
        `"${o.customerName.replace(/"/g, '""')}"`,
        `"${o.email}"`,
        `"${o.phone}"`,
        `"${o.city}"`,
        `"${o.state}"`,
        itemsCount,
        o.subtotal,
        o.discount,
        o.shippingFee,
        o.total,
        `"${o.paymentMethod}"`,
        `"${o.paymentStatus || 'captured'}"`,
        `"${o.fulfilmentStatus || o.status}"`,
        `"${o.courierPartner || 'N/A'}"`,
        `"${o.awbNumber || 'N/A'}"`,
        netContribution,
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Browser file download for CSV
   */
  public static downloadLedgerCSV(orders: Order[]): void {
    const csvContent = this.generateOrderLedgerCSV(orders);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Rass_Order_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const analyticsService = new AnalyticsService();
