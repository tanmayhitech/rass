import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Package,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order } from '../types';

import { orderService } from '../services/orderService';
import { couponService } from '../services/couponService';
import { PDFService } from '../services/pdfService';
import { Download, Tag } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: (order: Order) => void;
  initialCoupon?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderComplete,
  initialCoupon,
}) => {
  const [formData, setFormData] = useState({
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Lotus Heritage, Linking Road, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    paymentMethod: 'razorpay',
  });

  const [couponInput, setCouponInput] = useState(initialCoupon || '');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(initialCoupon || null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showItemSummary, setShowItemSummary] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  // Apply initial coupon if provided
  useEffect(() => {
    if (initialCoupon) {
      handleApplyCoupon(initialCoupon);
    }
  }, [initialCoupon, subtotal]);

  const handleApplyCoupon = (codeToApply: string) => {
    if (!codeToApply.trim()) return;
    const res = couponService.validateCoupon({
      code: codeToApply,
      subtotal,
      customerEmail: formData.email,
    });

    if (res.valid) {
      setAppliedCouponCode(res.coupon?.code || codeToApply.toUpperCase());
      setCouponDiscount(res.discountAmount);
      setCouponMessage({ text: res.message, isError: false });
    } else {
      setAppliedCouponCode(null);
      setCouponDiscount(0);
      setCouponMessage({ text: res.message, isError: true });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCouponCode(null);
    setCouponDiscount(0);
    setCouponInput('');
    setCouponMessage(null);
  };

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const defaultDiscount = subtotal > 30000 ? Math.round(subtotal * 0.1) : 0;
  const discount = appliedCouponCode ? couponDiscount : defaultDiscount;
  const shipping = subtotal >= 2999 ? 0 : 250;
  const total = Math.max(0, subtotal - discount + shipping);
  const totalItemsCount = items.reduce((s, i) => s + i.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newOrder = await orderService.createOrder({
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        shippingAddress: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: 'India',
        items: [...items],
        subtotal,
        discount,
        shippingFee: shipping,
        tax: 0,
        total,
        paymentMethod: 'Razorpay Secure (UPI, Cards, NetBanking)',
        appliedCoupon: appliedCouponCode || undefined,
        razorpayOrderId: `order_live_${Math.random().toString(36).slice(2, 10)}`,
        razorpayPaymentId: `pay_live_${Math.random().toString(36).slice(2, 10)}`,
      });

      if (appliedCouponCode && couponService.getCouponByCode(appliedCouponCode)) {
        couponService.recordRedemption({
          couponId: couponService.getCouponByCode(appliedCouponCode)!.id,
          orderId: newOrder.id,
          customerEmail: formData.email,
          discountApplied: discount,
        });
      }

      setCompletedOrder(newOrder);
      onOrderComplete(newOrder);
      setIsSubmitting(false);

      confetti({
        particleCount: 130,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#A783A2', '#C8D4C1', '#B49A6C', '#FAF8F5'],
      });
    } catch (err: any) {
      alert(`Order creation error: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#292624]/60 backdrop-blur-xs transition-opacity duration-300" 
        onClick={onClose} 
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <div className="relative bg-[#FAF8F5] rounded-[16px] max-w-3xl w-full overflow-hidden shadow-[0_25px_60px_rgba(41,38,36,0.3)] border border-[#E7E0DA] my-4 sm:my-8 animate-fadeIn">
          
          {/* Header */}
          <div className="px-5 py-4 sm:px-6 sm:py-5 bg-white border-b border-[#E7E0DA] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E7E0DA] flex items-center justify-center text-[#A783A2]">
                <Lock className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h2 className="font-sans text-[17px] sm:text-[20px] text-[#292624] font-semibold tracking-tight leading-none">
                  {completedOrder ? 'Order Confirmed' : 'Secure Checkout'}
                </h2>
                <p className="text-[11px] text-[#8C827A] mt-1 font-normal">
                  256-bit Encrypted SSL • 100% Insured Delivery
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-[#E7E0DA] hover:border-[#A783A2] hover:bg-[#FAF8F5] text-[#77716F] hover:text-[#292624] flex items-center justify-center transition-all"
              aria-label="Close checkout"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {completedOrder ? (
            /* Order Success State (All font-sans) */
            <div className="p-6 sm:p-10 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A783A2] block mb-1">
                  Thank You For Your Patronage
                </span>
                <h3 className="font-sans text-[24px] sm:text-[30px] text-[#292624] mb-2 font-semibold tracking-tight">
                  Heirloom in the making.
                </h3>
                <p className="text-[13px] text-[#77716F] max-w-md mx-auto leading-relaxed font-normal">
                  Your order <strong className="font-semibold text-[#292624]">{completedOrder.id}</strong> has been confirmed. Our master karigars are preparing your piece with hallmarked packaging.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="bg-white p-5 sm:p-6 rounded-[12px] border border-[#E7E0DA] text-left text-xs space-y-3 max-w-lg mx-auto shadow-xs font-sans">
                <div className="flex justify-between items-center border-b border-[#E7E0DA] pb-2.5">
                  <span className="text-[#8C827A]">Order Reference:</span>
                  <span className="font-semibold text-[#292624] bg-[#FAF8F5] px-2.5 py-0.5 rounded border border-[#E7E0DA]">
                    {completedOrder.id}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-[#E7E0DA] pb-2.5">
                  <span className="text-[#8C827A]">Estimated Dispatch:</span>
                  <span className="font-semibold text-emerald-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Within 24–48 Business Hours</span>
                  </span>
                </div>

                <div className="flex justify-between items-start border-b border-[#E7E0DA] pb-2.5">
                  <span className="text-[#8C827A]">Deliver To:</span>
                  <span className="font-medium text-[#292624] text-right max-w-[240px]">
                    {completedOrder.customerName}, {completedOrder.shippingAddress}, {completedOrder.city} - {completedOrder.pincode}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-[#8C827A]">Total Amount Paid:</span>
                  <span className="font-sans text-[16px] font-bold text-[#292624]">
                    ₹{completedOrder.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Reassurance */}
              <div className="text-[11.5px] text-[#8C827A] flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#A783A2]" />
                <span>Invoice and Certificate of Authenticity sent to {completedOrder.email}</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => PDFService.downloadInvoice(completedOrder)}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white border border-[#E7E0DA] hover:bg-[#FAF8F5] text-[#292624] text-[12px] font-semibold tracking-[0.1em] uppercase transition-all shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#A783A2]" />
                  <span>Download Tax Invoice (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 rounded-full bg-[#A783A2] hover:bg-[#966F91] text-white text-[12px] font-semibold tracking-[0.14em] uppercase transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form (Pure font-sans) */
            <form onSubmit={handleSubmit} className="p-4 sm:p-7 space-y-6">
              
              {/* Order Items Preview (Collapsible on Mobile, Visible on Desktop) */}
              <div className="bg-white rounded-[12px] border border-[#E7E0DA] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowItemSummary(!showItemSummary)}
                  className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <Package className="w-4 h-4 text-[#A783A2]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#292624]">
                      Order Summary ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-sans text-[14.5px] font-semibold text-[#292624]">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                    {showItemSummary ? (
                      <ChevronUp className="w-4 h-4 text-[#8C827A]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8C827A]" />
                    )}
                  </div>
                </button>

                {showItemSummary && (
                  <div className="p-4 border-t border-[#E7E0DA] bg-[#FAF8F5]/60 space-y-3 max-h-48 overflow-y-auto divide-y divide-[#E7E0DA]/70">
                    {items.map((item) => (
                      <div key={item.product.id} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.product.cleanImage || item.product.image}
                            alt={item.product.name}
                            className="w-10 h-12 rounded-[6px] object-cover bg-white border border-[#E7E0DA]"
                          />
                          <div>
                            <span className="font-sans font-medium text-[#292624] block truncate max-w-[180px] sm:max-w-[280px]">
                              {item.product.name}
                            </span>
                            <span className="text-[10.5px] text-[#8C827A]">
                              Qty: {item.quantity} • {item.product.categoryDisplay}
                            </span>
                          </div>
                        </div>
                        <span className="font-sans font-semibold text-[#292624]">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 1. Shipping Details */}
              <div>
                <h3 className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#8C827A] mb-3 flex items-center space-x-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#A783A2] text-white text-[9px] flex items-center justify-center font-bold">1</span>
                  <span>Shipping & Delivery Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <div>
                    <label className="block text-[11px] font-medium text-[#292624] mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full h-11 sm:h-10 px-3.5 rounded-[8px] border border-[#E7E0DA] bg-white text-xs sm:text-[13px] text-[#292624] focus:outline-none focus:border-[#A783A2]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#292624] mb-1">Email for Invoice & Tracking</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full h-11 sm:h-10 px-3.5 rounded-[8px] border border-[#E7E0DA] bg-white text-xs sm:text-[13px] text-[#292624] focus:outline-none focus:border-[#A783A2]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#292624] mb-1">Mobile (for Delivery OTP & SMS)</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full h-11 sm:h-10 px-3.5 rounded-[8px] border border-[#E7E0DA] bg-white text-xs sm:text-[13px] text-[#292624] focus:outline-none focus:border-[#A783A2]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#292624] mb-1">PIN Code</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full h-11 sm:h-10 px-3.5 rounded-[8px] border border-[#E7E0DA] bg-white text-xs sm:text-[13px] text-[#292624] focus:outline-none focus:border-[#A783A2]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-[#292624] mb-1">Street Address, Flat / Villa No.</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full h-11 sm:h-10 px-3.5 rounded-[8px] border border-[#E7E0DA] bg-white text-xs sm:text-[13px] text-[#292624] focus:outline-none focus:border-[#A783A2]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#292624] mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full h-11 sm:h-10 px-3.5 rounded-[8px] border border-[#E7E0DA] bg-white text-xs sm:text-[13px] text-[#292624] focus:outline-none focus:border-[#A783A2]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#292624] mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full h-11 sm:h-10 px-3.5 rounded-[8px] border border-[#E7E0DA] bg-white text-xs sm:text-[13px] text-[#292624] focus:outline-none focus:border-[#A783A2]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Payment Method (ONLY SECURE PREPAID, COD REMOVED) */}
              <div>
                <h3 className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#8C827A] mb-3 flex items-center space-x-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#A783A2] text-white text-[9px] flex items-center justify-center font-bold">2</span>
                  <span>Payment Method</span>
                </h3>

                <div className="p-4 rounded-[12px] border border-[#A783A2] bg-[#E2D5E5]/20 ring-1 ring-[#A783A2]/50 flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#E7E0DA] flex items-center justify-center text-[#A783A2] shrink-0 mt-0.5">
                    <Smartphone className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#292624]">
                        Razorpay Secure Online Payment
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Prepaid Only
                      </span>
                    </div>
                    <p className="text-[11px] text-[#77716F] mt-0.5">
                      Pay instantly with UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, or NetBanking.
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-[#8C827A]">
                      <span className="px-1.5 py-0.5 rounded bg-white border border-[#E7E0DA]">UPI</span>
                      <span className="px-1.5 py-0.5 rounded bg-white border border-[#E7E0DA]">Cards</span>
                      <span className="px-1.5 py-0.5 rounded bg-white border border-[#E7E0DA]">NetBanking</span>
                      <span className="px-1.5 py-0.5 rounded bg-white border border-[#E7E0DA]">EMI</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Privilege / Promotional Coupon */}
              <div className="bg-white p-3.5 rounded-[12px] border border-[#E7E0DA]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#77716F] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#A783A2]" />
                    <span>Have a Promotional Code?</span>
                  </span>
                  {appliedCouponCode && (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[11px] text-rose-600 hover:underline font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {appliedCouponCode ? (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-emerald-800">{appliedCouponCode}</span>
                      <span className="text-emerald-700">Applied</span>
                    </div>
                    <span className="font-bold text-emerald-800">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="e.g. RASS20, WELCOME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 rounded-lg border border-[#E7E0DA] bg-[#FAF8F5] text-xs font-mono uppercase focus:outline-none focus:border-[#A783A2]"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon(couponInput)}
                      className="px-4 py-2 rounded-lg bg-[#292624] text-white text-xs font-semibold hover:bg-black uppercase tracking-wider cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {couponMessage && (
                  <p className={`text-[11px] mt-1.5 ${couponMessage.isError ? 'text-rose-600' : 'text-emerald-700 font-medium'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Price Calculation Card (All font-sans) */}
              <div className="p-4 rounded-[12px] bg-white border border-[#E7E0DA] text-xs space-y-2">
                <div className="flex justify-between text-[#77716F]">
                  <span>Items Subtotal ({totalItemsCount} items)</span>
                  <span className="font-sans font-medium text-[#292624]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Discount {appliedCouponCode ? `(${appliedCouponCode})` : '(VIP Tier)'}</span>
                    <span className="font-sans">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#77716F]">
                  <span>Insured Express Shipping</span>
                  <span className="text-emerald-800 font-semibold">
                    {shipping === 0 ? 'Complimentary' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-[15px] font-sans font-bold text-[#292624] pt-2 border-t border-[#E7E0DA]">
                  <span>Total Payable</span>
                  <span className="font-sans text-[17px]">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Pay Now Button (Simple, High Trust, Minimal Text) */}
              <div className="pt-2 space-y-2 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 sm:h-13 rounded-full bg-[#24211E] hover:bg-black text-white text-[13px] sm:text-[14px] font-sans font-medium tracking-[0.08em] uppercase transition-all shadow-md active:scale-98 disabled:opacity-75 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-white/80" />
                      <span>Pay ₹{total.toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-[#8C827A] font-sans flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>256-bit encrypted secure checkout</span>
                </p>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
