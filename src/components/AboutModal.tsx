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
    { id: 'contact', label: 'Contact & Atelier', shortLabel: 'Contact', icon: <Mail className="w-4 h-4" />, group: 'about' },
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
      q: 'How long will it take to deliver my jewellery order?',
      a: 'All orders are dispatched from our Hyderabad atelier within 24 to 48 business hours. Standard Pan-India delivery takes approximately 5 to 7 business days via reliable express logistics. Live tracking updates are shared via WhatsApp and email upon dispatch.'
    },
    {
      q: 'What materials and craftsmanship does Rass use?',
      a: 'Our jewellery is meticulously handcrafted on a premium brass base finished with micro-polished antique gold and silver, dual-tone oxidised silver, Kundan, Polki, Onyx, and freshwater pearls. Each piece is sealed with an anti-tarnish protective coating for enduring lustre.'
    },
    {
      q: 'Can I request custom sizing or bespoke pieces?',
      a: 'To preserve artisanal precision and guarantee swift delivery, only our official website catalogue pieces are available. While custom sizing is not offered, our WhatsApp Concierge (+91 98197 33572) is happy to assist with standard sizing recommendations.'
    },
    {
      q: 'Are Rass creations anti-tarnish and water resistant?',
      a: 'Yes, every creation features a protective anti-tarnish seal. To keep pieces looking brand-new, follow our 4 Golden Rules: avoid water, soaps, and perfumes; store individually in airtight zip-locks (not velvet boxes); and wipe gently with a microfibre cloth.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit and debit cards (Visa, MasterCard, RuPay), UPI (Google Pay, PhonePe, Paytm), and Net Banking across all Indian banks through Razorpay. All orders are Prepaid Only (no COD) to avoid transit damage and high RTO rates.'
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'We offer an Exchange-Only policy for sizing issues or defects within 48 hours of delivery (no cash refunds). A mandatory continuous 360° unboxing video showing the opening of the sealed parcel is required. The customer covers nominal reverse shipping (approx. ₹100–₹150).'
    },
    {
      q: 'How should I store my Rass jewellery?',
      a: 'Store each piece individually in an airtight zip-lock bag or soft pouch in a cool, dry place. Do not store pieces in velvet boxes, as velvet can trap moisture and accelerate oxidation.'
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
              <span className="text-[11px] font-medium text-[#77716F] block">Need instant guidance?</span>
              <a 
                href="https://wa.me/919819733572" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[12px] font-semibold text-[#A783A2] hover:underline flex items-center justify-center space-x-1 mt-1"
              >
                <Phone className="w-3 h-3" />
                <span>WhatsApp Concierge</span>
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
                    HERITAGE & CRAFTSMANSHIP
                  </span>
                  <h2 className="font-editorial text-[25px] sm:text-[34px] lg:text-[38px] text-[#292624] font-normal leading-tight mt-1">
                    Rooted in Tradition, Made for Today.
                  </h2>
                </div>

                <div className="space-y-3.5 text-[13.5px] sm:text-[14px] text-[#5C5855] leading-relaxed">
                  <p>
                    Founded by Ridhima, <strong>Rass</strong> curates premium oxidized and fashion jewelry for the modern muse. Based in Hyderabad and shipping Pan-India, we craft and curate pieces that effortlessly fit into life's celebrations and everyday elegance.
                  </p>
                  <p>
                    Every design is thoughtfully selected and crafted—celebrating timeless artisanal aesthetics, anti-tarnish durability, and versatile modern styling.
                  </p>
                </div>

                {/* 3 Pillar Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 sm:my-6">
                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] text-center space-y-1.5 sm:space-y-2 shadow-xs">
                    <HeartHandshake className="w-5 h-5 text-[#A783A2] mx-auto" />
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">Artisanal Roots</h4>
                    <p className="text-[11.5px] sm:text-xs text-[#77716F] leading-snug">
                      Preserving traditional craftsmanship with dual-tone oxidised silver and antique polish.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] text-center space-y-1.5 sm:space-y-2 shadow-xs">
                    <Award className="w-5 h-5 text-[#B49A6C] mx-auto" />
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">Premium Micro-Polish</h4>
                    <p className="text-[11.5px] sm:text-xs text-[#77716F] leading-snug">
                      Durable brass core with antique gold and silver plating sealed with an anti-tarnish barrier.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] text-center space-y-1.5 sm:space-y-2 shadow-xs">
                    <Sparkles className="w-5 h-5 text-[#A783A2] mx-auto" />
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">Semi-Precious Stones</h4>
                    <p className="text-[11.5px] sm:text-xs text-[#77716F] leading-snug">
                      Curated Kundan, Polki, Onyx, sparkling Zircons, and freshwater pearls.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 bg-[#C8D4C1]/30 rounded-xl border border-[#C8D4C1]/60 text-xs text-[#292624] flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 text-[#4E6148] shrink-0" />
                  <span>
                    Each piece undergoes rigorous quality assessment in our Hyderabad atelier before dispatch.
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
                      <h4 className="font-editorial text-[16px] sm:text-lg text-[#292624] font-medium">Premium Brass Core & Micro-Polish</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5C5855] leading-relaxed">
                      Forged on a solid, hypoallergenic brass foundation treated with multi-step antique gold, silver, and dual-tone micro-polishing. A transparent anti-tarnish barrier seals every contour to resist environmental oxidation.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#A783A2] shrink-0" />
                      <h4 className="font-editorial text-[16px] sm:text-lg text-[#292624] font-medium">Dual-Tone Oxidised Silver</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5C5855] leading-relaxed">
                      Our signature tribal and festive collections feature handcrafted oxidised finishes with contrasting high-polish highlights, evoking royal heritage aesthetics with modern lightweight comfort.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#4E6148] shrink-0" />
                      <h4 className="font-editorial text-[16px] sm:text-lg text-[#292624] font-medium">Kundan, Polki & Natural Pearls</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5C5855] leading-relaxed">
                      Embellished with precision glass-foil Kundan, faceted Onyx, micro-pave Zircons, and real freshwater and shell pearls strung securely by master artisans.
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
                    JEWELLERY CARE
                  </span>
                  <h2 className="font-editorial text-[25px] sm:text-[34px] lg:text-[38px] text-[#292624] font-normal leading-tight mt-1">
                    Preserving Your Everyday Heirlooms
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-[#5C5855] leading-relaxed">
                  With mindful care, your Rass jewellery will retain its brilliance and anti-tarnish finish. Follow these four golden rules:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1">
                    <span className="text-[10.5px] font-bold text-[#A783A2] uppercase tracking-wider">Rule 01</span>
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">Keep Away from Water & Chemicals</h4>
                    <p className="text-[11.5px] sm:text-xs text-[#77716F] leading-relaxed">
                      Avoid contact with water, soaps, lotions, perfumes, and chemical sprays. Always apply cosmetics and fragrances before wearing your jewellery.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1">
                    <span className="text-[10.5px] font-bold text-[#A783A2] uppercase tracking-wider">Rule 02</span>
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">Store in Airtight Zip-Locks</h4>
                    <p className="text-[11.5px] sm:text-xs text-[#77716F] leading-relaxed">
                      Store each piece individually in sealed airtight zip-lock bags or soft pouches. Do NOT store pieces in velvet boxes to prevent moisture retention.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1">
                    <span className="text-[10.5px] font-bold text-[#A783A2] uppercase tracking-wider">Rule 03</span>
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">Gentle Microfibre Cleaning</h4>
                    <p className="text-[11.5px] sm:text-xs text-[#77716F] leading-relaxed">
                      Wipe your jewellery gently with a soft microfibre cloth after each wear to remove residual skin oils and airborne dust.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1">
                    <span className="text-[10.5px] font-bold text-[#A783A2] uppercase tracking-wider">Rule 04</span>
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">Dry & Friction-Free</h4>
                    <p className="text-[11.5px] sm:text-xs text-[#77716F] leading-relaxed">
                      Remove before bathing, swimming, or sleeping. Separate each item to prevent stones and chains from scratching against one another.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 bg-[#FAF8F5] border border-[#A783A2]/40 rounded-xl flex items-center space-x-3 text-xs text-[#292624]">
                  <Sparkles className="w-5 h-5 text-[#A783A2] shrink-0" />
                  <span>
                    <strong>Complimentary Spa Service:</strong> Rass patrons enjoy one complimentary professional re-polishing per year. Contact our concierge to arrange your complimentary service.
                  </span>
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

            {/* 6. CONTACT & ATELIER */}
            {activeTab === 'contact' && (
              <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                <div className="border-b border-[#E7E0DA] pb-3 sm:pb-4">
                  <span className="font-sans font-medium text-[10px] sm:text-[10.5px] tracking-[0.25em] text-[#77716F] uppercase">
                    CLIENT CONCIERGE
                  </span>
                  <h2 className="font-editorial text-[25px] sm:text-[34px] lg:text-[38px] text-[#292624] font-normal leading-tight mt-1">
                    Get in Touch with Our Atelier
                  </h2>
                </div>

                {/* Atelier Information Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1.5">
                    <div className="flex items-center space-x-2 text-[#A783A2]">
                      <Mail className="w-4 h-4" />
                      <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#292624]">Direct Inquiries</h4>
                    </div>
                    <p className="text-xs text-[#5C5855]">
                      <span className="font-medium text-[#292624]">Email:</span> concierge@rassbyriddhima.com<br />
                      <span className="font-medium text-[#292624]">VIP WhatsApp:</span> +91 98201 11223
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1.5">
                    <div className="flex items-center space-x-2 text-[#B49A6C]">
                      <Clock className="w-4 h-4" />
                      <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#292624]">Atelier Hours</h4>
                    </div>
                    <p className="text-xs text-[#5C5855]">
                      Monday – Saturday: 10:00 AM – 7:30 PM IST<br />
                      Sunday: Private appointments by request
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
                      <p className="text-xs text-[#5C5855]">Our jewellery concierge will respond to your inquiry within 4 working hours.</p>
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
                          <option value="Bespoke Order / Custom Sizing">Bespoke Order / Custom Sizing</option>
                          <option value="Order Tracking">Order Tracking</option>
                          <option value="Bridal / Trousseau Styling">Bridal / Trousseau Styling</option>
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
                    Shipping & Delivery Policy
                  </h2>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-[#5C5855] leading-relaxed">
                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-2">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-[#A783A2]" />
                      <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">Domestic Shipping Across India</h4>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-[#5C5855]">
                      <li><strong>Free Shipping:</strong> Complimentary standard shipping on all orders above ₹2,999.</li>
                      <li><strong>Below ₹2,999:</strong> Standard courier is ₹250; Urgent / Express shipping is ₹350.</li>
                      <li><strong>Dispatch Time:</strong> Orders are dispatched from our Hyderabad atelier within 24 to 48 business hours.</li>
                      <li><strong>Delivery Timeline:</strong> Pan-India transit takes 5 to 7 business days with end-to-end tracking updates.</li>
                      <li><strong>Prepaid Only:</strong> All orders are prepaid to prevent transit damage and high RTO return rates.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-[#B49A6C]" />
                      <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">100% Transit Insurance</h4>
                    </div>
                    <p className="text-xs text-[#5C5855]">
                      Every parcel is sealed in a heavy-duty tamper-proof security envelope and fully insured until safely delivered and signed for at your doorstep.
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
                    48-Hour Exchange-Only Policy
                  </h2>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-[#5C5855] leading-relaxed">
                  <p>
                    We want you to be delighted with your jewellery piece. We offer an <strong>Exchange-Only</strong> policy for size issues or defects within 48 hours of delivery (no cash refunds).
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    <div className="p-3 bg-white rounded-xl border border-[#E7E0DA] text-center space-y-1">
                      <span className="w-5 h-5 rounded-full bg-[#A783A2]/20 text-[#A783A2] font-bold text-xs flex items-center justify-center mx-auto">1</span>
                      <h5 className="font-editorial text-xs sm:text-sm text-[#292624] font-medium">Report in 48 Hours</h5>
                      <p className="text-[11px] text-[#77716F]">WhatsApp +91 98197 33572 or email care@rassbyridhima.com.</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#E7E0DA] text-center space-y-1">
                      <span className="w-5 h-5 rounded-full bg-[#A783A2]/20 text-[#A783A2] font-bold text-xs flex items-center justify-center mx-auto">2</span>
                      <h5 className="font-editorial text-xs sm:text-sm text-[#292624] font-medium">360° Unboxing Video</h5>
                      <p className="text-[11px] text-[#77716F]">Clear video showing unopened sealed parcel opening is mandatory.</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#E7E0DA] text-center space-y-1">
                      <span className="w-5 h-5 rounded-full bg-[#A783A2]/20 text-[#A783A2] font-bold text-xs flex items-center justify-center mx-auto">3</span>
                      <h5 className="font-editorial text-xs sm:text-sm text-[#292624] font-medium">Prompt Exchange</h5>
                      <p className="text-[11px] text-[#77716F]">Replacement dispatched upon return receipt (reverse shipping ₹100–₹150).</p>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E7E0DA] space-y-1.5">
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">Conditions for Exchange</h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-[#5C5855]">
                      <li>Items must be unworn, undamaged, and returned with the original security tag intact.</li>
                      <li>A mandatory, continuous 360° unboxing video must be submitted with your claim.</li>
                      <li>Customer covers nominal reverse shipping charges (approx. ₹100–₹150).</li>
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
                      You may at any time request a copy of your stored customer records or request total deletion by emailing <span className="font-medium text-[#292624]">privacy@rassbyriddhima.com</span>.
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
                    <h4 className="font-editorial text-[15px] sm:text-base text-[#292624] font-medium">1. Authenticity & Hallmarking</h4>
                    <p className="text-xs text-[#5C5855]">
                      All creations sold under Rass by Riddhima conform strictly to stated specifications of 925 sterling silver purity and 18k yellow gold vermeil thickness. Every piece carries our registered hallmark.
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
