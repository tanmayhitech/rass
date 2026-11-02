import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Award, 
  HeartHandshake, 
  BookOpen, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Ruler, 
  HelpCircle, 
  Mail, 
  FileText, 
  CheckCircle2, 
  Phone, 
  Clock, 
  Send, 
  ChevronDown, 
  ChevronUp,
  ArrowRight
} from 'lucide-react';
import { InfoSection } from '../types';
import { emailService } from '../services/emailService';
import { inquiryService } from '../services/inquiryService';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: InfoSection;
}

export const AboutModal: React.FC<AboutModalProps> = ({ 
  isOpen, 
  onClose, 
  initialSection = 'story' 
}) => {
  const [activeTab, setActiveTab] = useState<InfoSection>(initialSection);
  const [activeGroup, setActiveGroup] = useState<'about' | 'help'>('about');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Sync active tab and group whenever modal opens with a new initialSection
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialSection);
      setActiveGroup(['shipping', 'returns', 'privacy', 'terms'].includes(initialSection) ? 'help' : 'about');
      setContactSubmitted(false);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  }, [isOpen, initialSection]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Scroll content to top whenever active tab changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  if (!isOpen) return null;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);

    const submission = { ...contactForm };
    inquiryService.saveInquiry({
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      subject: submission.subject,
      message: submission.message,
      source: 'about_modal'
    });

    emailService.sendInquiryNotificationEmail({
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      subject: submission.subject,
      message: submission.message,
    }).catch((err) => {
      console.warn('[AboutModal] Failed to dispatch inquiry notification via Resend:', err);
    });

    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
    }, 4000);
  };

  const navItems: { id: InfoSection; label: string; shortLabel: string; icon: React.ReactNode; group: 'about' | 'help' }[] = [
    { id: 'story', label: 'Our Story', shortLabel: 'Story', icon: <BookOpen className="w-4 h-4" />, group: 'about' },
    { id: 'materials', label: 'Materials & Craft', shortLabel: 'Materials', icon: <Award className="w-4 h-4" />, group: 'about' },
    { id: 'care', label: 'Care Guide', shortLabel: 'Care', icon: <Sparkles className="w-4 h-4" />, group: 'about' },
    { id: 'sizing', label: 'Size Guide', shortLabel: 'Sizes', icon: <Ruler className="w-4 h-4" />, group: 'about' },
    { id: 'faqs', label: 'FAQs', shortLabel: 'FAQs', icon: <HelpCircle className="w-4 h-4" />, group: 'about' },
    { id: 'contact', label: 'Contact Us', shortLabel: 'Contact', icon: <Mail className="w-4 h-4" />, group: 'about' },
    { id: 'shipping', label: 'Shipping Policy', shortLabel: 'Shipping', icon: <Truck className="w-4 h-4" />, group: 'help' },
    { id: 'returns', label: 'Return & Exchange', shortLabel: 'Returns', icon: <RotateCcw className="w-4 h-4" />, group: 'help' },
    { id: 'privacy', label: 'Privacy Policy', shortLabel: 'Privacy', icon: <ShieldCheck className="w-4 h-4" />, group: 'help' },
    { id: 'terms', label: 'Terms & Conditions', shortLabel: 'Terms', icon: <FileText className="w-4 h-4" />, group: 'help' },
  ];

  const handleSelectTab = (id: InfoSection) => {
    setActiveTab(id);
    setActiveGroup(['shipping', 'returns', 'privacy', 'terms'].includes(id) ? 'help' : 'about');
  };

  const faqs = [
    {
      q: 'How long will it take to dispatch and deliver my order?',
      a: 'All orders are dispatched from Hyderabad within 24 to 48 business hours (2 to 4 business days). Standard Pan-India delivery takes approximately 5 to 7 business days with live tracking updates. We ship Pan-India only for now.'
    },
    {
      q: 'What materials, base metals, and plating does Rass use?',
      a: 'Our pieces are handcrafted by generational artisans (karigars), designed in-house, and curated from master clusters across Jaipur, Rajkot, and Bengal. We use solid brass with 18k/24k micro gold polish with anti-tarnish e-coating, 925 sterling silver (hallmarked), 18k gold vermeil, and everyday waterproof stainless steel. 100% skin-safe & hypoallergenic (nickel-free and lead-free).'
    },
    {
      q: 'What are your shipping charges and free shipping threshold?',
      a: 'Free shipping on orders above ₹3,999. For orders below ₹3,999, flat standard courier shipping is ₹250. Pan-India shipping only for now.'
    },
    {
      q: 'Can I choose my size for rings and kadas?',
      a: 'Rings are mostly adjustable / free-size comfort bands, standard Indian sizes (10 to 20), or a mix of both. Bangles and kadas are available in standard Indian sizes (2.4, 2.6, 2.8), openable screw/hinge mechanism (fits most wrists), and adjustable pull-cord/chain.'
    },
    {
      q: 'What are the key care rules for Rass jewellery?',
      a: 'Keep away from water, perfumes and lotions. Store each piece separately in a jewellery pouch or airtight box to prevent scratches and tangling. Keep away from direct sunlight, moisture and humidity. Clean gently with a soft, dry cloth after every use. Handle delicate pieces with love and care.'
    },
    {
      q: 'What payment options do you support? Is COD available?',
      a: 'Prepaid Only (UPI, GPay, PhonePe, Cards, NetBanking via Razorpay) — to avoid RTO transit damage and protect delicate handcrafted ornaments. COD is unavailable.'
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'Exchange / Store Credit Only within 48 hours of delivery (no cash refunds). A continuous 360° unboxing video showing the opening of the sealed outer box is MANDATORY for damage/missing claims. Pierced earrings are strictly non-exchangeable for hygiene reasons.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#1A1817]/65 backdrop-blur-xs transition-opacity duration-300" 
        onClick={onClose} 
      />

      {/* Responsive Modal Wrapper: Bottom Sheet on Mobile, Centered on Desktop */}
      <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8 pointer-events-none">
        <div 
          className="relative bg-[#FAF8F5] rounded-t-[26px] sm:rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border-t sm:border border-[#E7E0DA] flex flex-col md:flex-row h-[92vh] sm:h-auto sm:max-h-[86vh] pointer-events-auto animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Mobile Top Header Bar with Drag Handle & Close */}
          <div className="md:hidden bg-[#F4EFEA] border-b border-[#E7E0DA] px-4 pt-2.5 pb-2 shrink-0">
            {/* Soft Grab Handle Indicator */}
            <div className="w-10 h-1 rounded-full bg-[#292624]/20 mx-auto mb-2" />
            
            <div className="flex items-center justify-between">
              <div>
                <span className="font-sans font-medium text-[9.5px] tracking-[0.25em] text-[#77716F] uppercase block">
                  RASS BY RIDDHIMA
                </span>
                <h3 className="font-editorial text-[18px] text-[#292624] font-medium leading-tight">
                  {navItems.find(i => i.id === activeTab)?.label}
                </h3>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white text-[#292624] flex items-center justify-center shadow-xs border border-[#E7E0DA] active:scale-90 transition-transform cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Segmented Group Switcher (About vs Help) */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FAF8F5] rounded-xl border border-[#E7E0DA] mt-2 mb-1.5">
              <button
                onClick={() => {
                  setActiveGroup('about');
                  if (!navItems.filter(i => i.group === 'about').some(i => i.id === activeTab)) {
                    setActiveTab('story');
                  }
                }}
                className={`py-1.5 text-center text-xs font-semibold rounded-lg transition-all ${
                  activeGroup === 'about'
                    ? 'bg-[#A783A2] text-white shadow-xs'
                    : 'text-[#77716F] hover:text-[#292624]'
                }`}
              >
                About Rass
              </button>
              <button
                onClick={() => {
                  setActiveGroup('help');
                  if (!navItems.filter(i => i.group === 'help').some(i => i.id === activeTab)) {
                    setActiveTab('shipping');
                  }
                }}
                className={`py-1.5 text-center text-xs font-semibold rounded-lg transition-all ${
                  activeGroup === 'help'
                    ? 'bg-[#A783A2] text-white shadow-xs'
                    : 'text-[#77716F] hover:text-[#292624]'
                }`}
              >
                Help & Policies
              </button>
            </div>

            {/* Mobile Horizontal Sub-Pills for Active Group */}
            <div className="flex space-x-1.5 overflow-x-auto py-1 scrollbar-none">
              {navItems
                .filter(item => item.group === activeGroup)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-medium whitespace-nowrap transition-all shrink-0 ${
                      activeTab === item.id
                        ? 'bg-[#292624] text-white shadow-xs'
                        : 'bg-white border border-[#E7E0DA] text-[#5C5855]'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.shortLabel}</span>
                  </button>
                ))}
            </div>
          </div>

          {/* Desktop Left Navigation Sidebar */}
          <div className="hidden md:flex w-64 shrink-0 bg-[#F4EFEA] border-r border-[#E7E0DA] p-5 flex-col justify-between overflow-y-auto">
            <div>
              {/* Brand Header in Sidebar */}
              <div className="mb-6 pt-1">
                <span className="font-sans font-medium text-[10px] tracking-[0.25em] text-[#77716F] uppercase block">
                  INFORMATION & HELP
                </span>
                <h3 className="font-editorial text-[22px] text-[#292624] font-normal leading-tight mt-0.5">
                  Rass by Riddhima
                </h3>
              </div>

              {/* Desktop Sidebar Links */}
              <div className="space-y-5">
                {/* Group 1: About */}
                <div>
                  <span className="font-sans font-bold text-[10px] tracking-[0.16em] text-[#77716F] uppercase px-3 block mb-2">
                    ABOUT RASS
                  </span>
                  <div className="space-y-1">
                    {navItems.filter(i => i.group === 'about').map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all text-left ${
                          activeTab === item.id
                            ? 'bg-[#A783A2] text-white shadow-sm font-semibold'
                            : 'text-[#5C5855] hover:text-[#292624] hover:bg-white/60'
                        }`}
                      >
                        <span className={activeTab === item.id ? 'text-white' : 'text-[#77716F]'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Group 2: Help & Policies */}
                <div>
                  <span className="font-sans font-bold text-[10px] tracking-[0.16em] text-[#77716F] uppercase px-3 block mb-2">
                    HELP & POLICIES
                  </span>
                  <div className="space-y-1">
                    {navItems.filter(i => i.group === 'help').map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all text-left ${
                          activeTab === item.id
                            ? 'bg-[#A783A2] text-white shadow-sm font-semibold'
                            : 'text-[#5C5855] hover:text-[#292624] hover:bg-white/60'
                        }`}
                      >
                        <span className={activeTab === item.id ? 'text-white' : 'text-[#77716F]'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Concierge Badge in Desktop Sidebar */}
            <div className="mt-6 p-3 bg-white/70 rounded-xl border border-[#E7E0DA]/80 text-center">
              <span className="text-[11px] font-medium text-[#77716F] block">Need assistance?</span>
              <a 
                href="mailto:Rassbyridhima@gmail.com" 
                className="text-[12px] font-semibold text-[#A783A2] hover:underline flex items-center justify-center space-x-1 mt-1"
              >
                <Mail className="w-3 h-3" />
                <span>Rassbyridhima@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Desktop Close Button (Floating in top right) */}
          <button
            onClick={onClose}
            className="hidden md:flex absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#292624] items-center justify-center shadow-xs border border-[#E7E0DA] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Right Main Content Panel (Scrollable) */}
          <div 
            ref={contentRef}
            className="flex-1 overflow-y-auto p-4 sm:p-7 lg:p-9 pb-10"
          >
            
            {/* 1. OUR STORY */}
            {activeTab === 'story' && (
              <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                <div className="border-b border-[#E7E0DA] pb-3 sm:pb-4">
                  <span className="font-sans font-medium text-[10px] sm:text-[10.5px] tracking-[0.25em] text-[#77716F] uppercase">
                    RASS BY RIDHIMA
                  </span>
                  <h2 className="font-editorial text-[25px] sm:text-[34px] lg:text-[38px] text-[#292624] font-normal leading-tight mt-1">
                    The Brand Story &amp; Founder
                  </h2>
                </div>

                <div className="space-y-3 text-[13.5px] sm:text-[14px] text-[#5C5855] leading-relaxed font-sans">
                  <p>
                    Rass was born out of my love for jewellery, fashion and the richness of Indian culture.
                  </p>
                  <p>
                    Inspired by the beauty of traditions, timeless artistry and the little details that make every piece special, I wanted to create a space where culture meets contemporary expression.
                  </p>
                  <p>
                    To me, jewellery is more than just an accessory. It's an emotion, a form of self-expression and a beautiful way of celebrating individuality.
                  </p>
                  <p>
                    Through Rass, I hope to bring together the charm of tradition and the beauty of modern aesthetics, creating pieces that tell a story and make every moment feel special.
                  </p>
                  <p className="font-medium text-[#292624]">
                    A reflection of my passion, my creativity and my love for all things beautiful.
                  </p>
                  <p className="font-cormorant text-[18px] sm:text-[20px] text-[#8E6789] italic font-semibold pt-0.5">
                    RASS — An expression of culture, crafted with love.
                  </p>
                </div>

                {/* The Founder Note Box */}
                <div className="p-4 sm:p-5 bg-[#FAF5F9] rounded-xl border border-[#A783A2]/25 space-y-2">
                  <span className="font-sans font-bold text-[10px] tracking-[0.2em] text-[#A783A2] uppercase block">
                    The Founder Note –
                  </span>
                  <p className="text-xs sm:text-[13px] text-[#5C5855] leading-relaxed">
                    Rass by Ridhima was born out of Ridhima’s love for jewellery and her belief that the right piece can make a woman feel beautiful, confident and effortlessly elegant. She wanted to create a brand that brings together traditional Indian craftsmanship, contemporary designs and everyday wearability.
                  </p>
                  <p className="text-xs sm:text-[13px] text-[#5C5855] leading-relaxed">
                    Her personal philosophy is simple: Jewellery is not just an accessory; it is an expression of who you are. It should make you feel confident, special and connected to your personal style. Through Rass by Ridhima, she hopes to make every woman feel that a little piece of jewellery can carry a lot of beauty, personality and emotion.
                  </p>
                </div>

                {/* 3 Pillar Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 sm:my-6">
                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] text-center space-y-1.5 sm:space-y-2 shadow-xs">
                    <HeartHandshake className="w-5 h-5 text-[#A783A2] mx-auto" />
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">Artisan Karigari</h4>
                    <p className="text-[11.5px] sm:text-xs text-[#77716F] leading-snug">
                      Handcrafted by generational artisans (karigars) across Jaipur, Rajkot, and Bengal.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] text-center space-y-1.5 sm:space-y-2 shadow-xs">
                    <Award className="w-5 h-5 text-[#B49A6C] mx-auto" />
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">Noble Metallurgy</h4>
                    <p className="text-[11.5px] sm:text-xs text-[#77716F] leading-snug">
                      Solid brass with micro gold plating, 925 silver, 18k vermeil, and anti-tarnish e-coating.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] text-center space-y-1.5 sm:space-y-2 shadow-xs">
                    <ShieldCheck className="w-5 h-5 text-[#4E6148] mx-auto" />
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">100% Skin-Safe</h4>
                    <p className="text-[11.5px] sm:text-xs text-[#77716F] leading-snug">
                      100% skin-safe &amp; hypoallergenic (nickel-free and lead-free comfort).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 bg-[#C8D4C1]/30 rounded-xl border border-[#C8D4C1]/60 text-xs text-[#292624] flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-[#4E6148] shrink-0" />
                  <span>
                    Headquartered in Hyderabad. Dispatched in 24 to 48 business hours (2 to 4 business days). Pan-India delivery only for now.
                  </span>
                </div>
              </div>
            )}

            {/* 2. MATERIALS & CRAFT */}
            {activeTab === 'materials' && (
              <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                <div className="border-b border-[#E7E0DA] pb-3 sm:pb-4">
                  <span className="font-sans font-medium text-[10px] sm:text-[10.5px] tracking-[0.25em] text-[#77716F] uppercase">
                    OUR CRAFT & MATERIALS
                  </span>
                  <h2 className="font-editorial text-[25px] sm:text-[34px] lg:text-[38px] text-[#292624] font-normal leading-tight mt-1">
                    Authentic Craftsmanship & Durable Polish
                  </h2>
                </div>

                <div className="space-y-3.5">
                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B49A6C] shrink-0" />
                      <h4 className="font-editorial text-[16px] sm:text-lg text-[#292624] font-medium">Solid Brass with 18k/24k Micro Gold Polish</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5C5855] leading-relaxed">
                      Forged on a solid brass base finished with brilliant 18k/24k micro gold polish and anti-tarnish e-coating to resist environmental oxidation and preserve radiant lustre.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#A783A2] shrink-0" />
                      <h4 className="font-editorial text-[16px] sm:text-lg text-[#292624] font-medium">Everyday Waterproof Stainless Steel</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5C5855] leading-relaxed">
                      Our modern daily wear collections utilize anti-tarnish stainless steel engineered for sweat resistance, water contact, and active lifestyle durability.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#4E6148] shrink-0" />
                      <h4 className="font-editorial text-[16px] sm:text-lg text-[#292624] font-medium">Curated from Master Clusters (Jaipur / Rajkot / Bengal)</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5C5855] leading-relaxed">
                      Every piece is curated from iconic jewellery clusters carrying heritage karigar traditions, 100% skin-safe & hypoallergenic (lead-free and nickel-free).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CARE GUIDE */}
            {activeTab === 'care' && (
              <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                <div className="border-b border-[#E7E0DA] pb-3 sm:pb-4">
                  <span className="font-sans font-medium text-[10px] sm:text-[10.5px] tracking-[0.25em] text-[#77716F] uppercase">
                    RASS BY RIDHIMA
                  </span>
                  <h2 className="font-editorial text-[25px] sm:text-[34px] lg:text-[38px] text-[#292624] font-normal leading-tight mt-1">
                    A Little Love &amp; Care for Your Jewellery ♡
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-[#5C5855] leading-relaxed">
                  Your jewellery is special, and with a little care, you can keep it beautiful for longer:
                </p>

                <div className="space-y-2.5">
                  <div className="p-3 bg-white rounded-xl border border-[#E7E0DA] flex items-center gap-2.5">
                    <span className="text-sm select-none shrink-0">✨</span>
                    <span className="text-xs sm:text-[13px] text-[#292624] font-medium">Keep away from water, perfumes and lotions .</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#E7E0DA] flex items-center gap-2.5">
                    <span className="text-sm select-none shrink-0">✨</span>
                    <span className="text-xs sm:text-[13px] text-[#292624] font-medium">Store each piece separately in a jewellery pouch or airtight box to prevent scratches and tangling.</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#E7E0DA] flex items-center gap-2.5">
                    <span className="text-sm select-none shrink-0">✨</span>
                    <span className="text-xs sm:text-[13px] text-[#292624] font-medium">Keep away from direct sunlight, moisture and humidity.</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#E7E0DA] flex items-center gap-2.5">
                    <span className="text-sm select-none shrink-0">✨</span>
                    <span className="text-xs sm:text-[13px] text-[#292624] font-medium">Clean gently with a soft, dry cloth after every use.</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#E7E0DA] flex items-center gap-2.5">
                    <span className="text-sm select-none shrink-0">✨</span>
                    <span className="text-xs sm:text-[13px] text-[#292624] font-medium">Handle delicate pieces with love and care.</span>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF5F9] border border-[#A783A2]/30 rounded-xl text-center space-y-1">
                  <p className="font-editorial text-[15px] sm:text-[17px] text-[#8B5E86] italic leading-relaxed">
                    “A little reminder: Jewellery is made to make you shine. Treat every piece with love, and it will remain a beautiful part of your story.”
                  </p>
                  <p className="text-xs font-sans text-[#A783A2] font-semibold pt-1">
                    With love,<br />
                    Team Rass by Ridhima ♡
                  </p>
                </div>
              </div>
            )}

            {/* 4. SIZE GUIDE */}
            {activeTab === 'sizing' && (
              <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                <div className="border-b border-[#E7E0DA] pb-3 sm:pb-4">
                  <span className="font-sans font-medium text-[10.5px] tracking-[0.25em] text-[#77716F] uppercase">
                    MEASUREMENT & FIT
                  </span>
                  <h2 className="font-editorial text-[25px] sm:text-[34px] lg:text-[38px] text-[#292624] font-normal leading-tight mt-1">
                    Finding Your Perfect Size
                  </h2>
                </div>

                {/* Ring Sizing Chart */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-editorial text-[16px] sm:text-lg text-[#292624] font-medium">Ring Sizing Chart</h3>
                    <span className="text-[11px] text-[#77716F] sm:hidden">Swipe table →</span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-[#E7E0DA] bg-white">
                    <table className="w-full min-w-[320px] text-left text-xs">
                      <thead className="bg-[#FAF8F5] border-b border-[#E7E0DA] text-[#77716F] font-semibold">
                        <tr>
                          <th className="py-2.5 px-3">India Size</th>
                          <th className="py-2.5 px-3">US Size</th>
                          <th className="py-2.5 px-3">Diameter</th>
                          <th className="py-2.5 px-3">Circumference</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E7E0DA]/60 text-[#292624]">
                        <tr>
                          <td className="py-2 px-3 font-medium">10</td>
                          <td className="py-2 px-3">5</td>
                          <td className="py-2 px-3">15.7 mm</td>
                          <td className="py-2 px-3">49.3 mm</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-medium">12</td>
                          <td className="py-2 px-3">6</td>
                          <td className="py-2 px-3">16.5 mm</td>
                          <td className="py-2 px-3">51.9 mm</td>
                        </tr>
                        <tr className="bg-[#FAF8F5]/60">
                          <td className="py-2 px-3 font-medium text-[#A783A2]">14 (Standard)</td>
                          <td className="py-2 px-3">7</td>
                          <td className="py-2 px-3">17.3 mm</td>
                          <td className="py-2 px-3">54.4 mm</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-medium">16</td>
                          <td className="py-2 px-3">8</td>
                          <td className="py-2 px-3">18.1 mm</td>
                          <td className="py-2 px-3">57.0 mm</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-medium">18</td>
                          <td className="py-2 px-3">9</td>
                          <td className="py-2 px-3">19.0 mm</td>
                          <td className="py-2 px-3">59.5 mm</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Kangna / Bangle Sizing Chart */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-editorial text-[16px] sm:text-lg text-[#292624] font-medium">Kangna & Bangle Sizing</h3>
                    <span className="text-[11px] text-[#77716F] sm:hidden">Swipe table →</span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-[#E7E0DA] bg-white">
                    <table className="w-full min-w-[320px] text-left text-xs">
                      <thead className="bg-[#FAF8F5] border-b border-[#E7E0DA] text-[#77716F] font-semibold">
                        <tr>
                          <th className="py-2.5 px-3">Indian Size</th>
                          <th className="py-2.5 px-3">Inner Diameter</th>
                          <th className="py-2.5 px-3">Wrist Fit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E7E0DA]/60 text-[#292624]">
                        <tr>
                          <td className="py-2 px-3 font-medium">2.2</td>
                          <td className="py-2 px-3">2.125 inches (54 mm)</td>
                          <td className="py-2 px-3 text-[#77716F]">Petite wrists</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-medium">2.4</td>
                          <td className="py-2 px-3">2.25 inches (57.2 mm)</td>
                          <td className="py-2 px-3 text-[#77716F]">Small</td>
                        </tr>
                        <tr className="bg-[#FAF8F5]/60">
                          <td className="py-2 px-3 font-medium text-[#A783A2]">2.6 (Most Popular)</td>
                          <td className="py-2 px-3">2.375 inches (60.3 mm)</td>
                          <td className="py-2 px-3 text-[#77716F]">Standard / Medium</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-medium">2.8</td>
                          <td className="py-2 px-3">2.50 inches (63.5 mm)</td>
                          <td className="py-2 px-3 text-[#77716F]">Broad / Relaxed fit</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. FAQS */}
            {activeTab === 'faqs' && (
              <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                <div className="border-b border-[#E7E0DA] pb-3 sm:pb-4">
                  <span className="font-sans font-medium text-[10px] sm:text-[10.5px] tracking-[0.25em] text-[#77716F] uppercase">
                    COMMON INQUIRIES
                  </span>
                  <h2 className="font-editorial text-[25px] sm:text-[34px] lg:text-[38px] text-[#292624] font-normal leading-tight mt-1">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {faqs.map((faq, idx) => (
                    <div 
                      key={idx}
                      className="border border-[#E7E0DA] rounded-xl bg-white overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full py-3.5 px-3.5 sm:px-4 text-left flex items-center justify-between space-x-3 hover:bg-[#FAF8F5]/60 transition-colors cursor-pointer"
                      >
                        <span className="font-editorial text-[14.5px] sm:text-[16px] text-[#292624] font-medium leading-snug">
                          {faq.q}
                        </span>
                        {expandedFaq === idx ? (
                          <ChevronUp className="w-4 h-4 text-[#A783A2] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#77716F] shrink-0" />
                        )}
                      </button>
                      {expandedFaq === idx && (
                        <div className="px-3.5 sm:px-4 pb-4 pt-1 text-xs sm:text-sm text-[#5C5855] leading-relaxed border-t border-[#E7E0DA]/50 bg-[#FAF8F5]/40 animate-fadeIn">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. CONTACT US */}
            {activeTab === 'contact' && (
              <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                <div className="border-b border-[#E7E0DA] pb-3 sm:pb-4">
                  <span className="font-sans font-medium text-[10px] sm:text-[10.5px] tracking-[0.25em] text-[#77716F] uppercase">
                    GET IN TOUCH
                  </span>
                  <h2 className="font-editorial text-[25px] sm:text-[34px] lg:text-[38px] text-[#292624] font-normal leading-tight mt-1">
                    Get in Touch with Our Team
                  </h2>
                </div>

                {/* Contact Information Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1.5">
                    <div className="flex items-center space-x-2 text-[#A783A2]">
                      <Mail className="w-4 h-4" />
                      <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#292624]">Direct Inquiries</h4>
                    </div>
                    <p className="text-xs text-[#5C5855]">
                      <span className="font-medium text-[#292624]">Official Email:</span> Rassbyridhima@gmail.com<br />
                      <span className="font-medium text-[#292624]">Instagram DM:</span> @rassbyridhima
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1.5">
                    <div className="flex items-center space-x-2 text-[#B49A6C]">
                      <Clock className="w-4 h-4" />
                      <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#292624]">Support Hours</h4>
                    </div>
                    <p className="text-xs text-[#5C5855]">
                      Monday – Saturday: 10:00 AM – 7:00 PM IST<br />
                      Sunday & National Holidays: Closed
                    </p>
                  </div>
                </div>

                {/* Interactive Message Form */}
                <div className="p-4 sm:p-5 bg-white rounded-xl border border-[#E7E0DA] space-y-3.5">
                  <h4 className="font-editorial text-[16px] sm:text-lg text-[#292624] font-medium">Send a Message to Riddhima's Team</h4>
                  
                  {contactSubmitted ? (
                    <div className="p-4 bg-[#C8D4C1]/30 border border-[#C8D4C1] rounded-xl text-center space-y-1.5 animate-fadeIn">
                      <CheckCircle2 className="w-6 h-6 text-[#4E6148] mx-auto" />
                      <p className="text-sm font-medium text-[#292624]">Message Received with Grace</p>
                      <p className="text-xs text-[#5C5855]">Our client care team will respond to your inquiry via Rassbyridhima@gmail.com within 24 working hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Your Full Name"
                          className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E7E0DA] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#A783A2]"
                        />
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="Your Email Address"
                          className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E7E0DA] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#A783A2]"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                        <input
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          placeholder="Phone / WhatsApp Number (optional)"
                          className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E7E0DA] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#A783A2]"
                        />
                        <select
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E7E0DA] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#A783A2]"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Sizing Consultation">Sizing Consultation</option>
                          <option value="Order Tracking">Order Tracking</option>
                          <option value="Exchange Request">Exchange Request</option>
                        </select>
                      </div>
                      <textarea
                        required
                        rows={3}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Tell us about the piece you love or how we may assist you..."
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E7E0DA] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#A783A2]"
                      />
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#A783A2] hover:bg-[#936E8F] text-white text-xs font-medium tracking-wider uppercase transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                      >
                        <span>Send Message</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* 7. SHIPPING POLICY */}
            {activeTab === 'shipping' && (
              <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                <div className="border-b border-[#E7E0DA] pb-3 sm:pb-4">
                  <span className="font-sans font-medium text-[10px] sm:text-[10.5px] tracking-[0.25em] text-[#77716F] uppercase">
                    LOGISTICS & DELIVERY
                  </span>
                  <h2 className="font-editorial text-[25px] sm:text-[34px] lg:text-[38px] text-[#292624] font-normal leading-tight mt-1">
                    Shipping &amp; Delivery Policy
                  </h2>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-[#5C5855] leading-relaxed">
                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-2">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-[#A783A2]" />
                      <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">Domestic Shipping (Pan-India)</h4>
                    </div>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5C5855]">
                      <li><strong>Free Shipping:</strong> Free shipping above ₹3,999 (below that ₹250 for orders).</li>
                      <li><strong>Dispatch Time:</strong> Orders are dispatched within 24 to 48 business hours (2 to 4 business days).</li>
                      <li><strong>Delivery Timeline:</strong> Domestic Pan-India transit takes 5 to 7 business days with live tracking updates.</li>
                      <li><strong>International Shipping:</strong> No, Pan-India only for now.</li>
                      <li><strong>Payment Mode:</strong> Prepaid Only (UPI, GPay, PhonePe, Cards, NetBanking via Razorpay) — recommended to avoid RTO transit damage.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-[#B49A6C]" />
                      <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">100% Insured Delivery</h4>
                    </div>
                    <p className="text-xs text-[#5C5855]">
                      Every parcel is sealed in a tamper-proof security envelope and fully insured until delivered safely to your doorstep.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 8. RETURN & EXCHANGE */}
            {activeTab === 'returns' && (
              <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                <div className="border-b border-[#E7E0DA] pb-3 sm:pb-4">
                  <span className="font-sans font-medium text-[10px] sm:text-[10.5px] tracking-[0.25em] text-[#77716F] uppercase">
                    PEACE OF MIND POLICY
                  </span>
                  <h2 className="font-editorial text-[25px] sm:text-[34px] lg:text-[38px] text-[#292624] font-normal leading-tight mt-1">
                    48-Hour Exchange / Store Credit Policy
                  </h2>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-[#5C5855] leading-relaxed">
                  <p>
                    We offer <strong>Exchange / Store Credit Only within 48 hours</strong> of delivery (no cash refunds).
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    <div className="p-3 bg-white rounded-xl border border-[#E7E0DA] text-center space-y-1">
                      <span className="w-5 h-5 rounded-full bg-[#A783A2]/20 text-[#A783A2] font-bold text-xs flex items-center justify-center mx-auto">1</span>
                      <h5 className="font-editorial text-xs sm:text-sm text-[#292624] font-medium">Report in 48 Hours</h5>
                      <p className="text-[11px] text-[#77716F]">Email Rassbyridhima@gmail.com with your Order ID.</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#E7E0DA] text-center space-y-1">
                      <span className="w-5 h-5 rounded-full bg-[#A783A2]/20 text-[#A783A2] font-bold text-xs flex items-center justify-center mx-auto">2</span>
                      <h5 className="font-editorial text-xs sm:text-sm text-[#292624] font-medium">Mandatory 360° Video</h5>
                      <p className="text-[11px] text-[#77716F]">Continuous 360° unboxing video showing opening of sealed outer box is mandatory.</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#E7E0DA] text-center space-y-1">
                      <span className="w-5 h-5 rounded-full bg-[#A783A2]/20 text-[#A783A2] font-bold text-xs flex items-center justify-center mx-auto">3</span>
                      <h5 className="font-editorial text-xs sm:text-sm text-[#292624] font-medium">Prompt Exchange</h5>
                      <p className="text-[11px] text-[#77716F]">Store credit or replacement issued once returned item is inspected.</p>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1.5">
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">Conditions for Exchange</h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-[#5C5855]">
                      <li>A continuous 360° unboxing video showing the opening of the sealed outer box is strictly mandatory for any damage or missing claims.</li>
                      <li>Items must be unworn, undamaged, and returned with all original packaging.</li>
                      <li><strong>Pierced Earrings Hygiene Policy:</strong> Strictly non-exchangeable for hygiene reasons.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 9. PRIVACY POLICY */}
            {activeTab === 'privacy' && (
              <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                <div className="border-b border-[#E7E0DA] pb-3 sm:pb-4">
                  <span className="font-sans font-medium text-[10px] sm:text-[10.5px] tracking-[0.25em] text-[#77716F] uppercase">
                    DATA PRIVACY
                  </span>
                  <h2 className="font-editorial text-[25px] sm:text-[34px] lg:text-[38px] text-[#292624] font-normal leading-tight mt-1">
                    Your Privacy is Held Sacred
                  </h2>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-[#5C5855] leading-relaxed">
                  <p>
                    At Rass by Riddhima, we honour the trust you place in us. This privacy policy describes how we collect, store, and protect your information when visiting our website or ordering our creations.
                  </p>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1.5">
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">1. Absolute Zero-Selling Policy</h4>
                    <p className="text-xs text-[#5C5855]">
                      We do not sell, rent, or trade your personal email, phone number, or address to any third parties or data brokers under any circumstances.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1.5">
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">2. Bank-Grade Payment Security</h4>
                    <p className="text-xs text-[#5C5855]">
                      We never store your credit card numbers, CVVs, or UPI PINs. All payments are securely processed through Razorpay's PCI-DSS Level 1 compliant gateway with 256-bit SSL encryption.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1.5">
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">3. Your Data Rights</h4>
                    <p className="text-xs text-[#5C5855]">
                      You may at any time request a copy of your stored customer records or request total deletion by emailing <span className="font-medium text-[#292624]">Rassbyridhima@gmail.com</span>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 10. TERMS & CONDITIONS */}
            {activeTab === 'terms' && (
              <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                <div className="border-b border-[#E7E0DA] pb-3 sm:pb-4">
                  <span className="font-sans font-medium text-[10px] sm:text-[10.5px] tracking-[0.25em] text-[#77716F] uppercase">
                    LEGAL GOVERNANCE
                  </span>
                  <h2 className="font-editorial text-[25px] sm:text-[34px] lg:text-[38px] text-[#292624] font-normal leading-tight mt-1">
                    Terms & Conditions of Service
                  </h2>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-[#5C5855] leading-relaxed">
                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1">
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">1. Material Integrity & Craftsmanship</h4>
                    <p className="text-xs text-[#5C5855]">
                      All creations sold under Rass by Riddhima conform strictly to stated specifications of solid brass with 18k/24k micro gold polish, anti-tarnish e-coating, and anti-tarnish stainless steel. Every piece is 100% skin-safe & hypoallergenic (nickel-free and lead-free).
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1">
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">2. Transparent Pricing & Taxes</h4>
                    <p className="text-xs text-[#5C5855]">
                      All prices listed on the website are in Indian Rupees (INR) and are fully inclusive of the statutory 3% Goods and Services Tax (GST). Official GST tax invoices accompany every shipment.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1">
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">3. Intellectual Property Rights</h4>
                    <p className="text-xs text-[#5C5855]">
                      All jewellery designs, photographs, brand copy, logos, and motifs are exclusive intellectual property of Rass by Riddhima. Any unauthorized reproduction, imitation, or commercial use is strictly prohibited.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1">
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">4. Governing Law & Jurisdiction</h4>
                    <p className="text-xs text-[#5C5855]">
                      These terms and all orders placed through the website shall be governed by the laws of India, subject to the exclusive jurisdiction of the competent courts in Hyderabad, Telangana.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Footer Action inside Modal */}
            <div className="mt-8 pt-4 border-t border-[#E7E0DA] flex flex-col sm:flex-row items-center justify-between text-xs text-[#77716F] gap-3">
              <span className="text-center sm:text-left">Rass by Ridhima • Based in Hyderabad • Shipping Pan-India</span>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#A783A2] text-white hover:bg-[#936E8F] transition-all font-medium uppercase tracking-wider text-[11px] flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <span>Back to Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
