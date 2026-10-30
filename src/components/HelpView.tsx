import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Truck, 
  RotateCcw, 
  HelpCircle, 
  ShieldCheck, 
  MessageCircle, 
  Mail, 
  Instagram, 
  ChevronDown, 
  Send, 
  CheckCircle2, 
  Clock,
  Sparkles,
  Phone,
  FileText,
  AlertCircle,
  Package,
  Layers,
  Video
} from 'lucide-react';
import { SectionDivider } from './SectionDivider';

export type HelpTab = 'shipping' | 'returns' | 'faqs' | 'payment' | 'terms';

interface HelpViewProps {
  onBackToHome: () => void;
  onExploreShop: () => void;
  initialTab?: HelpTab;
}

export const HelpView: React.FC<HelpViewProps> = ({ onBackToHome, onExploreShop, initialTab = 'shipping' }) => {
  const [activeTab, setActiveTab] = useState<HelpTab>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState<'all' | 'shipping' | 'exchange' | 'care'>('all');

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order & Shipping Query',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: 'Order & Shipping Query',
        message: ''
      });
      setIsSubmitted(false);
    }, 4000);
  };

  const faqs = [
    {
      category: 'shipping',
      q: 'How long will it take to deliver my order?',
      a: 'All orders are processed from our Hyderabad atelier within 24 to 48 business hours. Standard Pan-India delivery takes approximately 5 to 7 business days via reliable express logistics. Live tracking updates are sent to your WhatsApp and email upon dispatch.'
    },
    {
      category: 'exchange',
      q: 'What is your return and exchange policy?',
      a: 'We offer an Exchange-Only policy for sizing issues or defects within 48 hours of delivery (no cash refunds). A mandatory continuous 360° unboxing video showing the opening of the sealed parcel is required. The customer covers nominal reverse shipping (approx. ₹100–₹150).'
    },
    {
      category: 'shipping',
      q: 'Is Cash on Delivery (COD) available?',
      a: 'To prevent high RTO return rates and transit damage for delicate handcrafted demi-fine jewelry, all orders are Prepaid Only. We accept all UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, and NetBanking through secure Razorpay.'
    },
    {
      category: 'care',
      q: 'Are Rass pieces anti-tarnish and water resistant?',
      a: 'Yes. Every creation is crafted on a premium brass base with silver/gold micro-polish and sealed with an anti-tarnish protective coating. To preserve their shine, keep pieces away from water, soaps, perfumes, and chemical sprays, and store in airtight zip-locks (not velvet boxes).'
    },
    {
      category: 'care',
      q: 'Do you accept custom sizing or custom orders?',
      a: 'To maintain artisanal perfection and prompt delivery, only our official website catalogue pieces are available. We do not accept custom orders or custom sizing, but our WhatsApp Concierge (+91 98197 33572) is happy to assist with standard sizing recommendations.'
    },
    {
      category: 'shipping',
      q: 'What are the shipping charges?',
      a: 'Shipping is completely FREE on orders above ₹2,999. For orders below ₹2,999, flat standard shipping is ₹250, and urgent/express priority shipping is ₹350.'
    }
  ];

  const filteredFaqs = faqs.filter(f => faqCategory === 'all' || f.category === faqCategory);

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen text-[#292624] animate-fadeIn pb-16 relative overflow-hidden">
      
      {/* Decorative Botanical Sprigs in Background */}
      <div className="absolute top-12 left-0 pointer-events-none opacity-20 sm:opacity-35 select-none" aria-hidden="true">
        <img
          src="/elements/Mauve Botanical Sprig Line Art.png"
          alt=""
          className="w-24 sm:w-36 lg:w-44 h-auto object-contain object-top-left"
        />
      </div>
      <div className="absolute top-12 right-0 pointer-events-none opacity-20 sm:opacity-35 select-none -scale-x-100" aria-hidden="true">
        <img
          src="/elements/Mauve Botanical Sprig Line Art.png"
          alt=""
          className="w-24 sm:w-36 lg:w-44 h-auto object-contain object-top-right"
        />
      </div>

      {/* 1. EDITORIAL HEADER & BREADCRUMB */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-10 relative z-10">
        
        {/* Breadcrumb with Diamond Symbol */}
        <div className="flex items-center justify-center gap-2 text-[10.5px] sm:text-xs text-[#8C827A] uppercase tracking-[0.2em] mb-3 font-medium">
          <button 
            onClick={onBackToHome}
            className="hover:text-[#A783A2] transition-colors flex items-center gap-1 group cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
            <span>Home</span>
          </button>
          <span className="text-[#A783A2] text-[10px]">✦</span>
          <span className="text-[#292624] font-semibold">Client Care & Help</span>
        </div>

        {/* Headline */}
        <div className="text-center max-w-2xl mx-auto mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF5F9] border border-[#A783A2]/30 text-[#8B5E86] text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-semibold mb-3">
            <Sparkles className="w-3 h-3 text-[#A783A2]" />
            <span>CLIENT CONCIERGE & CARE</span>
          </span>

          <h1 className="font-playfair text-[32px] sm:text-[48px] lg:text-[54px] font-medium text-[#292624] tracking-tight leading-[1.08] mb-3">
            We are here to assist you.
          </h1>
          <p className="font-sans text-[13.5px] sm:text-[15.5px] text-[#77716F] leading-relaxed max-w-xl mx-auto">
            From sizing consultations and care rituals to order tracking and 48-hour exchanges.
          </p>

          <div className="flex justify-center mt-4">
            <img 
              src="/elements/Elegant Mauve Lotus Ornamental Divider.png" 
              alt="" 
              className="w-44 sm:w-56 h-auto object-contain opacity-80 select-none pointer-events-none"
            />
          </div>
        </div>

      </div>

      {/* 2. DIRECT ASSISTANCE QUICK CHANNELS */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Channel 1: WhatsApp */}
          <a
            href="https://wa.me/919819733572?text=Hello%20Rass,%20I%20have%20an%20inquiry%20regarding%20my%20order"
            target="_blank"
            rel="noreferrer"
            className="p-5 sm:p-6 bg-white rounded-2xl border border-[#E7E0DA] hover:border-[#A783A2] transition-all shadow-2xs hover:shadow-md flex items-center space-x-4 group cursor-pointer relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF5F9] border border-[#E7E0DA] flex items-center justify-center text-[#A783A2] group-hover:bg-[#A783A2] group-hover:text-white transition-colors shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold">Fastest Response</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h3 className="font-playfair text-[16px] text-[#292624] font-medium">WhatsApp Concierge</h3>
              <p className="text-[12px] text-[#77716F] mt-0.5">+91 98197 33572</p>
            </div>
          </a>

          {/* Channel 2: Instagram DM */}
          <a
            href="https://instagram.com/rassbyridhima"
            target="_blank"
            rel="noreferrer"
            className="p-5 sm:p-6 bg-white rounded-2xl border border-[#E7E0DA] hover:border-[#A783A2] transition-all shadow-2xs hover:shadow-md flex items-center space-x-4 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF5F9] border border-[#E7E0DA] flex items-center justify-center text-[#A783A2] group-hover:bg-[#A783A2] group-hover:text-white transition-colors shrink-0">
              <Instagram className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold block mb-0.5">Social Atelier</span>
              <h3 className="font-playfair text-[16px] text-[#292624] font-medium">Direct Message</h3>
              <p className="text-[12px] text-[#77716F] mt-0.5">@rassbyridhima</p>
            </div>
          </a>

          {/* Channel 3: Email Concierge */}
          <a
            href="mailto:care@rassbyridhima.com"
            className="p-5 sm:p-6 bg-white rounded-2xl border border-[#E7E0DA] hover:border-[#A783A2] transition-all shadow-2xs hover:shadow-md flex items-center space-x-4 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF5F9] border border-[#E7E0DA] flex items-center justify-center text-[#A783A2] group-hover:bg-[#A783A2] group-hover:text-white transition-colors shrink-0">
              <Mail className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold block mb-0.5">Official Mailbox</span>
              <h3 className="font-playfair text-[16px] text-[#292624] font-medium">Client Support</h3>
              <p className="text-[12px] text-[#77716F] mt-0.5">care@rassbyridhima.com</p>
            </div>
          </a>

        </div>

        {/* Concierge Working Hours Banner */}
        <div className="mt-4 p-3.5 sm:p-4 bg-white/90 rounded-2xl border border-[#E7E0DA] flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-2 text-xs text-[#77716F] shadow-2xs">
          <div className="flex items-center gap-2 text-[#292624] font-medium">
            <Clock className="w-4 h-4 text-[#A783A2] shrink-0" />
            <span>Support Desk: Monday – Saturday, 10:00 AM – 7:00 PM IST</span>
          </div>
          <span className="text-[11px] text-[#8C827A] bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#E7E0DA]">
            Closed on Sundays & National Holidays
          </span>
        </div>
      </div>

      {/* 3. POLICY & HELP TABS VIEWER */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 relative z-10">
        
        {/* Navigation Pills */}
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-3 mb-6 no-scrollbar border-b border-[#E7E0DA]">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'shipping'
                ? 'bg-[#292624] text-white shadow-xs'
                : 'bg-white border border-[#E7E0DA] text-[#5C5855] hover:border-[#A783A2]'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Shipping & Delivery</span>
          </button>

          <button
            onClick={() => setActiveTab('returns')}
            className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'returns'
                ? 'bg-[#292624] text-white shadow-xs'
                : 'bg-white border border-[#E7E0DA] text-[#5C5855] hover:border-[#A783A2]'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>48-Hour Exchange Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'faqs'
                ? 'bg-[#292624] text-white shadow-xs'
                : 'bg-white border border-[#E7E0DA] text-[#5C5855] hover:border-[#A783A2]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'payment'
                ? 'bg-[#292624] text-white shadow-xs'
                : 'bg-white border border-[#E7E0DA] text-[#5C5855] hover:border-[#A783A2]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Payment & Security</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#292624] text-white shadow-xs'
                : 'bg-white border border-[#E7E0DA] text-[#5C5855] hover:border-[#A783A2]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms & Governance</span>
          </button>
        </div>

        {/* Tab 1: Shipping & Delivery */}
        {activeTab === 'shipping' && (
          <div className="bg-white rounded-3xl border border-[#E7E0DA] p-6 sm:p-10 space-y-6 shadow-2xs animate-fadeIn">
            <div className="border-b border-[#E7E0DA] pb-4">
              <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold block mb-1">Pan-India Logistics</span>
              <h2 className="font-playfair text-[24px] sm:text-[28px] text-[#292624] font-medium">Shipping & Delivery Policy</h2>
            </div>

            {/* 3-Step Logistics Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A783A2] block">Step 01 • Dispatch</span>
                <p className="font-sans text-sm font-semibold text-[#292624]">Within 24–48 Business Hours</p>
                <p className="text-xs text-[#77716F]">Dispatched directly from our Hyderabad atelier</p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A783A2] block">Step 02 • Transit</span>
                <p className="font-sans text-sm font-semibold text-[#292624]">5–7 Business Days</p>
                <p className="text-xs text-[#77716F]">Pan-India air & surface express delivery</p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A783A2] block">Step 03 • Rates</span>
                <p className="font-sans text-sm font-semibold text-emerald-800">Free Above ₹2,999</p>
                <p className="text-xs text-[#77716F]">Standard: ₹250 | Urgent / Express: ₹350</p>
              </div>
            </div>

            <div className="space-y-3 text-[13.5px] text-[#5C5855] leading-relaxed pt-2">
              <p>
                Every parcel is sealed in a heavy-duty tamper-proof security bag with dual authentication serials. The contents are 100% insured until signed for at your doorstep.
              </p>
              <p>
                All orders are <strong>Prepaid Only</strong> via Razorpay (UPI, Cards, NetBanking). Cash on Delivery is strictly unavailable to prevent transit damage and high RTO return rates for delicate handcrafted ornaments.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Returns & Exchanges */}
        {activeTab === 'returns' && (
          <div className="bg-white rounded-3xl border border-[#E7E0DA] p-6 sm:p-10 space-y-6 shadow-2xs animate-fadeIn">
            <div className="border-b border-[#E7E0DA] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold block mb-1">Exchange Policy</span>
                <h2 className="font-playfair text-[24px] sm:text-[28px] text-[#292624] font-medium">48-Hour Exchange-Only Policy</h2>
              </div>
              <span className="text-[11px] text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 font-medium">
                Exchange Only • No Cash Refunds
              </span>
            </div>

            {/* 3 Step Visual Exchange Workflow */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#A783A2]">
                  <Video className="w-4 h-4" />
                  <span className="text-[10.5px] font-semibold uppercase tracking-wider">Step 1 • Unboxing Video</span>
                </div>
                <h4 className="font-semibold text-sm text-[#292624]">Mandatory 360° Video</h4>
                <p className="text-xs text-[#77716F] leading-relaxed">
                  A clear, continuous unboxing video showing the outer sealed bag being opened is mandatory for all claims.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#A783A2]">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10.5px] font-semibold uppercase tracking-wider">Step 2 • 48h Window</span>
                </div>
                <h4 className="font-semibold text-sm text-[#292624]">Report Within 48 Hours</h4>
                <p className="text-xs text-[#77716F] leading-relaxed">
                  Send a WhatsApp message to +91 98197 33572 with Order ID, reason, and the unboxing video within 48h of receipt.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#A783A2]">
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-[10.5px] font-semibold uppercase tracking-wider">Step 3 • Replacement</span>
                </div>
                <h4 className="font-semibold text-sm text-[#292624]">Reverse Courier Transit</h4>
                <p className="text-xs text-[#77716F] leading-relaxed">
                  Customer covers nominal reverse shipping (approx. ₹100–₹150). Replacement dispatched once return parcel arrives.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#FAF5F9] rounded-2xl border border-[#A783A2]/30 text-xs text-[#5C5855] leading-relaxed flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-[#A783A2] shrink-0 mt-0.5" />
              <span>
                <strong>Important Note:</strong> Items must be in unworn, brand-new condition with original tags intact. We do not provide cash refunds; we offer direct replacements for sizing issues or transit defects.
              </span>
            </div>
          </div>
        )}

        {/* Tab 3: FAQs */}
        {activeTab === 'faqs' && (
          <div className="bg-white rounded-3xl border border-[#E7E0DA] p-6 sm:p-10 space-y-6 shadow-2xs animate-fadeIn">
            <div className="border-b border-[#E7E0DA] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold block mb-1">Common Questions</span>
                <h2 className="font-playfair text-[24px] sm:text-[28px] text-[#292624] font-medium">Frequently Asked Questions</h2>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {(['all', 'shipping', 'exchange', 'care'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFaqCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      faqCategory === cat
                        ? 'bg-[#292624] text-white shadow-2xs'
                        : 'bg-[#FAF8F5] text-[#77716F] border border-[#E7E0DA] hover:text-[#292624]'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-[#E7E0DA]">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="py-3.5">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between text-left group focus:outline-none cursor-pointer"
                    >
                      <span className="font-sans font-medium text-[14px] sm:text-[15px] text-[#292624] group-hover:text-[#A783A2] transition-colors pr-4">
                        {faq.q}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#8C827A] transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-[#A783A2]' : ''}`} />
                    </button>
                    {isOpen && (
                      <p className="pt-2 text-[13px] sm:text-[13.5px] text-[#5C5855] leading-relaxed animate-fadeIn">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Payment & Security */}
        {activeTab === 'payment' && (
          <div className="bg-white rounded-3xl border border-[#E7E0DA] p-6 sm:p-10 space-y-6 shadow-2xs animate-fadeIn">
            <div className="border-b border-[#E7E0DA] pb-4">
              <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold block mb-1">100% Secure Checkout</span>
              <h2 className="font-playfair text-[24px] sm:text-[28px] text-[#292624] font-medium">Payment & Security Infrastructure</h2>
            </div>

            <div className="space-y-4 text-[13.5px] text-[#5C5855] leading-relaxed">
              <p>
                All transactions on <strong>Rass by Ridhima</strong> are encrypted with banking-grade 256-bit SSL protocol via Razorpay. We never store credit or debit card numbers on our servers.
              </p>
              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E7E0DA] space-y-2">
                <h4 className="font-semibold text-sm text-[#292624]">Prepaid Orders Only</h4>
                <p className="text-xs text-[#77716F] leading-relaxed">
                  To guarantee verified contactless logistics and prevent high transit breakage and returns, we process orders exclusively via UPI (Google Pay, PhonePe, Paytm), NetBanking, and Debit/Credit Cards. Cash on Delivery (COD) is strictly unavailable.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Terms & Conditions */}
        {activeTab === 'terms' && (
          <div className="bg-white rounded-3xl border border-[#E7E0DA] p-6 sm:p-10 space-y-4 shadow-2xs animate-fadeIn text-[13px] text-[#5C5855] leading-relaxed">
            <div className="border-b border-[#E7E0DA] pb-4">
              <span className="text-[10px] uppercase tracking-wider text-[#A783A2] font-semibold block mb-1">Legal Policies</span>
              <h2 className="font-playfair text-[24px] text-[#292624] font-medium">Terms & Governance</h2>
            </div>
            <p>
              By accessing and placing an order on Rass by Ridhima, you confirm agreement with our shipping, exchange, and privacy policies. All product dimensions and weights are approximate due to handmade artisanal variance.
            </p>
            <p>
              <strong>Governing Law:</strong> Any dispute or claim arising out of orders placed on this website shall be governed by the laws of India, subject to the exclusive jurisdiction of the competent courts in Hyderabad, Telangana.
            </p>
          </div>
        )}

      </div>

      {/* 4. SEND CONCIERGE A DIRECT MESSAGE FORM */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 relative z-10">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-[#E7E0DA] p-6 sm:p-10 shadow-2xs">
          
          <div className="text-center mb-6">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#A783A2] block mb-1">Send an Inquiry</span>
            <h3 className="font-playfair text-[22px] sm:text-[26px] text-[#292624] font-medium">Contact Atelier Support</h3>
            <p className="text-xs text-[#77716F] mt-1">Our client care specialists respond within 24 business hours.</p>
          </div>

          {isSubmitted ? (
            <div className="p-6 bg-[#FAF5F9] rounded-2xl border border-[#A783A2]/30 text-center space-y-2 animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 text-[#A783A2] mx-auto" />
              <h4 className="font-playfair text-lg text-[#292624] font-medium">Inquiry Received</h4>
              <p className="text-xs text-[#77716F]">Thank you! A member of our concierge team will reach out shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#77716F] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Radhika Verma"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E7E0DA] bg-[#FAF8F5] text-xs text-[#292624] focus:bg-white focus:outline-none focus:border-[#A783A2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#77716F] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="radhika@example.com"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E7E0DA] bg-[#FAF8F5] text-xs text-[#292624] focus:bg-white focus:outline-none focus:border-[#A783A2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#77716F] mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E7E0DA] bg-[#FAF8F5] text-xs text-[#292624] focus:bg-white focus:outline-none focus:border-[#A783A2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#77716F] mb-1">Subject</label>
                  <select
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E7E0DA] bg-[#FAF8F5] text-xs text-[#292624] focus:bg-white focus:outline-none focus:border-[#A783A2]"
                  >
                    <option value="Order & Shipping Query">Order & Shipping Query</option>
                    <option value="Sizing Consultation">Sizing Consultation</option>
                    <option value="Return / Exchange Request">Return / Exchange Request</option>
                    <option value="Jewellery Care & Cleaning">Jewellery Care & Cleaning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#77716F] mb-1">Your Message</label>
                <textarea
                  rows={4}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="How can our concierge assist you?"
                  className="w-full p-3.5 rounded-xl border border-[#E7E0DA] bg-[#FAF8F5] text-xs text-[#292624] focus:bg-white focus:outline-none focus:border-[#A783A2]"
                />
              </div>

              <div className="pt-2 text-center">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-8 py-3 rounded-full bg-[#A783A2] hover:bg-[#936E8F] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm active:scale-98 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

    </div>
  );
};
