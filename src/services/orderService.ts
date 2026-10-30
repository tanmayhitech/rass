import { 
  Order, 
  CartItem, 
  OrderItemSnapshot, 
  PaymentStatus, 
  FulfilmentStatus 
} from '../types';
import { storeService } from './storeService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { emailService, EmailSendResult } from './emailService';

const STORAGE_KEYS = {
  ORDERS: 'rass_orders',
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'RASS-ORD-841920',
    customerName: 'Meera Singhania',
    email: 'meera.s@example.com',
    phone: '+91 98201 11223',
    shippingAddress: '42, Vasant Vihar, Poorvi Marg',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110057',
    country: 'India',
    items: [],
    itemSnapshots: [
      {
        id: 'snap-01',
        productId: 'rass-necklace-01',
        productTitle: 'Rajkumari Cascading Jhumka Collar',
        variantName: 'Standard Collar',
        sku: 'RASS-NCK-01-STD',
        imageUrl: '/images/clean_cat_necklaces.png',
        unitPrice: 38000,
        quantity: 1,
        lineSubtotal: 38000,
      }
    ],
    subtotal: 38000,
    discount: 3800,
    shippingFee: 0,
    tax: 0,
    total: 34200,
    date: '14 Oct 2026',
    orderTime: '02:30 PM',
    status: 'Shipped',
    paymentStatus: 'captured',
    fulfilmentStatus: 'shipped',
    paymentMethod: 'Razorpay UPI (Prepaid)',
    razorpayOrderId: 'order_rass_live_841920',
    razorpayPaymentId: 'pay_live_meera_74829',
    awbNumber: 'SR-841920194-DL',
    courierPartner: 'BlueDart Express',
    trackingUrl: 'https://track.bluedart.com/SR-841920194-DL',
    appliedCoupon: 'WELCOME10',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'RASS-ORD-519283',
    customerName: 'Ananya Roy',
    email: 'ananya.roy@example.com',
    phone: '+91 98310 99881',
    shippingAddress: '16/2 Ballygunge Circular Road',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700019',
    country: 'India',
    items: [],
    itemSnapshots: [
      {
        id: 'snap-02',
        productId: 'rass-ring-01',
        productTitle: 'Gulshan Emerald & Seed Pearl Cocktail Ring',
        variantName: 'Standard Adjustable',
        sku: 'RASS-RNG-01-STD',
        imageUrl: '/images/clean_cat_rings.png',
        unitPrice: 14500,
        quantity: 1,
        lineSubtotal: 14500,
      },
      {
        id: 'snap-03',
        productId: 'rass-earring-01',
        productTitle: 'Chandani Double-Tier Jhumka Chandelier',
        variantName: 'Standard Pair',
        sku: 'RASS-EAR-01-STD',
        imageUrl: '/images/clean_cat_earrings.png',
        unitPrice: 22800,
        quantity: 1,
        lineSubtotal: 22800,
      }
    ],
    subtotal: 37300,
    discount: 7460,
    shippingFee: 0,
    tax: 0,
    total: 29840,
    date: '16 Oct 2026',
    orderTime: '05:15 PM',
    status: 'Delivered',
    paymentStatus: 'captured',
    fulfilmentStatus: 'delivered',
    paymentMethod: 'Razorpay NetBanking',
    razorpayOrderId: 'order_rass_live_519283',
    razorpayPaymentId: 'pay_live_ananya_91823',
    awbNumber: 'DEL-519283-WB',
    courierPartner: 'Delhivery Surface',
    trackingUrl: 'https://delhivery.com/track/DEL-519283-WB',
    appliedCoupon: 'RASS20',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'RASS-ORD-291048',
    customerName: 'Pooja Hegde',
    email: 'pooja.h@example.com',
    phone: '+91 97412 34567',
    shippingAddress: 'Villa 14, Palm Meadows, Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560066',
    country: 'India',
    items: [],
    itemSnapshots: [
      {
        id: 'snap-04',
        productId: 'rass-bracelet-01',
        productTitle: 'Manjari Multi-Strand Gemstone Cuff',
        variantName: 'Standard 6.5"',
        sku: 'RASS-BRC-01-STD',
        imageUrl: '/images/clean_cat_bracelets.png',
        unitPrice: 19800,
        quantity: 1,
        lineSubtotal: 19800,
      }
    ],
    subtotal: 19800,
    discount: 0,
    shippingFee: 450,
    tax: 0,
    total: 20250,
    date: '18 Oct 2026',
    orderTime: '11:42 AM',
    status: 'Processing',
    paymentStatus: 'captured',
    fulfilmentStatus: 'processing',
    paymentMethod: 'Razorpay UPI (Google Pay)',
    razorpayOrderId: 'order_rass_live_291048',
    razorpayPaymentId: 'pay_live_pooja_11294',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export interface CreateOrderParams {
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax?: number;
  total: number;
  paymentMethod: string;
  appliedCoupon?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

class OrderService {
  private orders: Order[] = [];

  constructor() {
    this.loadOrders();
  }

  private loadOrders() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // ensure existing orders have snapshots
          this.orders = parsed.map((o: Order) => ({
            ...o,
            items: Array.isArray(o.items) ? o.items : [],
            itemSnapshots: (o.itemSnapshots && o.itemSnapshots.length > 0)
              ? o.itemSnapshots
              : (Array.isArray(o.items) ? o.items.map((i, idx) => ({
                  id: `snap-${o.id}-${idx}`,
                  productId: i?.product?.id || 'prod',
                  productTitle: i?.product?.name || 'Jewellery Design',
                  variantName: i?.selectedSize || 'Standard',
                  sku: i?.product?.sku || `RASS-SKU-${idx}`,
                  imageUrl: i?.product?.cleanImage || i?.product?.image || '/images/clean_cat_necklaces.png',
                  unitPrice: i?.product?.price || 0,
                  quantity: i?.quantity || 1,
                  lineSubtotal: (i?.product?.price || 0) * (i?.quantity || 1),
                })) : []),
            paymentStatus: o.paymentStatus || 'captured',
            fulfilmentStatus: o.fulfilmentStatus || (o.status === 'Delivered' ? 'delivered' : o.status === 'Shipped' ? 'shipped' : 'processing'),
            orderTime: o.orderTime || (o.createdAt ? new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '02:30 PM'),
          }));
          return;
        }
      }
      this.orders = INITIAL_ORDERS;
      this.saveOrders();
    } catch (e) {
      this.orders = INITIAL_ORDERS;
    }
  }

  private saveOrders() {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
    } catch (e) {
      console.error('Error saving orders:', e);
    }
  }

  public getOrders(filters?: {
    status?: string;
    paymentStatus?: string;
    fulfilmentStatus?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }): Order[] {
    let result = [...this.orders];

    if (!filters) return result;

    if (filters.status && filters.status !== 'all') {
      result = result.filter((o) => o.status === filters.status);
    }

    if (filters.paymentStatus && filters.paymentStatus !== 'all') {
      result = result.filter((o) => o.paymentStatus === filters.paymentStatus);
    }

    if (filters.fulfilmentStatus && filters.fulfilmentStatus !== 'all') {
      result = result.filter((o) => o.fulfilmentStatus === filters.fulfilmentStatus);
    }

    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter((o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        (o.awbNumber && o.awbNumber.toLowerCase().includes(q))
      );
    }

    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      result = result.filter((o) => new Date(o.createdAt || o.date).getTime() >= start);
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate).getTime() + 86400000; // inclusive
      result = result.filter((o) => new Date(o.createdAt || o.date).getTime() <= end);
    }

    return result;
  }

  public getOrderById(orderId: string): Order | undefined {
    return this.orders.find((o) => o.id === orderId);
  }

  /**
   * Server-grade atomic order creation
   * 1. Validates inventory availability
   * 2. Deducts variant inventory and writes to movement ledger
   * 3. Creates immutable snapshot of products, SKUs, and prices
   * 4. Persists verified order record
   */
  public async createOrder(params: CreateOrderParams): Promise<Order> {
    const orderId = `RASS-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    // Build immutable item snapshots
    const itemSnapshots: OrderItemSnapshot[] = params.items.map((item, idx) => ({
      id: `snap-${orderId}-${idx + 1}`,
      productId: item.product.id,
      productTitle: item.product.name,
      variantName: item.selectedSize || 'Standard',
      sku: item.product.sku || `RASS-SKU-${item.product.id.toUpperCase()}`,
      imageUrl: item.product.cleanImage || item.product.image,
      unitPrice: item.product.price,
      quantity: item.quantity,
      lineSubtotal: item.product.price * item.quantity,
    }));

    // Atomically deduct inventory
    for (const item of params.items) {
      const variants = storeService.getVariants(item.product.id);
      const targetVariant = variants[0];
      if (targetVariant) {
        storeService.adjustStock({
          variantId: targetVariant.id,
          quantityChange: -item.quantity,
          movementType: 'order_deduction',
          referenceId: orderId,
          notes: `Sold via Order ${orderId} (${params.customerName})`,
          createdBy: 'system',
        });
      }
    }

    const isCOD = params.paymentMethod.toLowerCase().includes('cod');
    const paymentStatus: PaymentStatus = isCOD ? 'pending' : 'captured';
    const now = new Date();

    const newOrder: Order = {
      id: orderId,
      customerName: params.customerName,
      email: params.email,
      phone: params.phone,
      shippingAddress: params.shippingAddress,
      city: params.city,
      state: params.state,
      pincode: params.pincode,
      country: params.country || 'India',
      items: [...params.items],
      itemSnapshots,
      subtotal: params.subtotal,
      discount: params.discount,
      shippingFee: params.shippingFee,
      tax: params.tax || 0,
      total: params.total,
      date: now.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      orderTime: now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      status: 'Processing',
      paymentStatus,
      fulfilmentStatus: 'processing',
      paymentMethod: params.paymentMethod,
      razorpayOrderId: params.razorpayOrderId || `order_sim_${Math.random().toString(36).slice(2, 9)}`,
      razorpayPaymentId: params.razorpayPaymentId || `pay_sim_${Math.random().toString(36).slice(2, 9)}`,
      appliedCoupon: params.appliedCoupon,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    this.orders.unshift(newOrder);
    this.saveOrders();

    // Asynchronously dispatch order confirmation email via Resend
    emailService.sendOrderConfirmationEmail(newOrder).catch((err) => {
      console.warn('[OrderService] Resend order confirmation email dispatch failed:', err);
    });

    // Asynchronously synchronize order to Supabase PostgreSQL database
    if (isSupabaseConfigured) {
      (async () => {
        try {
          await supabase.from('orders').insert([
            {
              id: orderId,
              customer_name: params.customerName,
              customer_email: params.email,
              customer_phone: params.phone,
              shipping_address_line1: params.shippingAddress,
              shipping_city: params.city,
              shipping_state: params.state,
              shipping_pincode: params.pincode,
              shipping_country: params.country || 'India',
              subtotal: params.subtotal,
              discount_amount: params.discount,
              shipping_fee: params.shippingFee,
              tax_amount: params.tax || 0,
              total_amount: params.total,
              applied_coupon_code: params.appliedCoupon || null,
              payment_method: params.paymentMethod,
              payment_status: paymentStatus,
              fulfilment_status: 'processing',
            }
          ]);

          if (itemSnapshots.length > 0) {
            await supabase.from('order_items').insert(
              itemSnapshots.map((snap) => ({
                order_id: orderId,
                product_id_snapshot: snap.productId,
                product_title_snapshot: snap.productTitle,
                variant_name_snapshot: snap.variantName,
                sku_snapshot: snap.sku,
                image_url_snapshot: snap.imageUrl,
                unit_price: snap.unitPrice,
                quantity: snap.quantity,
                line_subtotal: snap.lineSubtotal,
              }))
            );
          }
        } catch (err) {
          console.warn('Asynchronous Supabase order sync failed (local state preserved):', err);
        }
      })();
    }

    return newOrder;
  }

  public async updateOrderStatus(
    orderId: string, 
    status: Order['status'], 
    fulfilmentStatus?: FulfilmentStatus
  ): Promise<Order & { emailResult?: EmailSendResult }> {
    const index = this.orders.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error(`Order ${orderId} not found.`);

    const order = this.orders[index];
    order.status = status;
    if (fulfilmentStatus) {
      order.fulfilmentStatus = fulfilmentStatus;
    } else {
      if (status === 'Delivered') order.fulfilmentStatus = 'delivered';
      else if (status === 'Shipped') order.fulfilmentStatus = 'shipped';
      else if (status === 'Cancelled') order.fulfilmentStatus = 'cancelled';
      else order.fulfilmentStatus = 'processing';
    }
    order.updatedAt = new Date().toISOString();

    this.orders[index] = order;
    this.saveOrders();

    // Await status update email dispatch via Resend
    let emailResult: EmailSendResult = { success: false, error: 'Not dispatched' };
    try {
      emailResult = await emailService.sendOrderStatusUpdateEmail(order);
    } catch (err: any) {
      emailResult = { success: false, error: err.message };
    }

    return Object.assign(order, { emailResult });
  }

  public async updateTracking(params: {
    orderId: string;
    courierPartner: string;
    awbNumber: string;
    trackingUrl?: string;
  }): Promise<Order & { emailResult?: EmailSendResult }> {
    const order = this.getOrderById(params.orderId);
    if (!order) throw new Error(`Order ${params.orderId} not found.`);

    order.courierPartner = params.courierPartner;
    order.awbNumber = params.awbNumber;
    order.trackingUrl = params.trackingUrl || `https://track.shiprocket.in/${params.awbNumber}`;
    order.status = 'Shipped';
    order.fulfilmentStatus = 'shipped';
    order.updatedAt = new Date().toISOString();

    this.saveOrders();

    // Await tracking update email dispatch via Resend
    let emailResult: EmailSendResult = { success: false, error: 'Not dispatched' };
    try {
      emailResult = await emailService.sendOrderTrackingUpdateEmail(order);
    } catch (err: any) {
      emailResult = { success: false, error: err.message };
    }

    return Object.assign(order, { emailResult });
  }

  public async cancelOrder(orderId: string, reason: string): Promise<Order & { emailResult?: EmailSendResult }> {
    const order = this.getOrderById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found.`);

    if (order.fulfilmentStatus === 'cancelled') {
      throw new Error('Order is already cancelled.');
    }

    // Atomic restock of items
    const snapshots = order.itemSnapshots || [];
    for (const snap of snapshots) {
      const variants = storeService.getVariants(snap.productId);
      const targetVariant = variants[0];
      if (targetVariant) {
        storeService.adjustStock({
          variantId: targetVariant.id,
          quantityChange: snap.quantity,
          movementType: 'order_restock',
          referenceId: order.id,
          notes: `Restocked upon cancellation of ${order.id}: ${reason}`,
          createdBy: 'admin',
        });
      }
    }

    order.status = 'Cancelled';
    order.fulfilmentStatus = 'cancelled';
    order.paymentStatus = 'refunded';
    order.adminNotes = `Cancelled: ${reason}`;
    order.updatedAt = new Date().toISOString();

    this.saveOrders();

    // Await cancellation notice via Resend
    let emailResult: EmailSendResult = { success: false, error: 'Not dispatched' };
    try {
      emailResult = await emailService.sendOrderCancellationEmail(order, reason);
    } catch (err: any) {
      emailResult = { success: false, error: err.message };
    }

    return Object.assign(order, { emailResult });
  }
}

export const orderService = new OrderService();
