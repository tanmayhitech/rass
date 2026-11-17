import re

with open('src/components/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Smartphone and Monitor to imports
if 'Smartphone,' not in content:
    content = content.replace("  Copy\n} from 'lucide-react';", "  Copy,\n  Smartphone,\n  Monitor\n} from 'lucide-react';")

# 2. Add festivePreviewDevice state
if 'festivePreviewDevice' not in content:
    content = content.replace(
        "const [isPreviewFestiveOpen, setIsPreviewFestiveOpen] = useState(false);",
        "const [isPreviewFestiveOpen, setIsPreviewFestiveOpen] = useState(false);\n  const [festivePreviewDevice, setFestivePreviewDevice] = useState<'desktop' | 'mobile'>('desktop');"
    )

# 3. Locate Festive Campaign block
start_marker = "{/* ============================================================= */}\n              {/* FESTIVE CAMPAIGN & STOREFRONT POPUP (HAUTE LUXURY STUDIO EDITOR) */}"
if start_marker not in content:
    start_marker = "{/* Festive Campaign & Storefront Popup Controller */}"

# Find end marker
end_marker = "              <div>\n                <h4 className=\"font-semibold text-xs text-[#292624] uppercase tracking-wider mb-3\">\n                  All Promotional Coupons ({coupons.length})"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"Error: markers not found. start_idx: {start_idx}, end_idx: {end_idx}")
    exit(1)

new_festive_block = '''{/* ============================================================= */}
              {/* FESTIVE CAMPAIGN & STOREFRONT POPUP (HAUTE LUXURY STUDIO EDITOR) */}
              {/* ============================================================= */}
              {(() => {
                const previewLinkedCoupon = coupons.find(c => c.code === festiveCampaign.linkedCouponCode) || couponService.getCouponByCode(festiveCampaign.linkedCouponCode);
                const previewDiscountFormula = previewLinkedCoupon
                  ? `${previewLinkedCoupon.discountType === 'percentage' ? `Flat ${previewLinkedCoupon.discountValue}% OFF` : `Flat ₹${previewLinkedCoupon.discountValue.toLocaleString('en-IN')} OFF`} • ${previewLinkedCoupon.minOrderValue > 0 ? `Min. cart ₹${previewLinkedCoupon.minOrderValue.toLocaleString('en-IN')}` : 'No minimum spend'}`
                  : 'Flat 20% OFF • Min. cart ₹2,999';

                const presets = [
                  {
                    title: 'First Creation Magic',
                    tag: '20% OFF Welcome',
                    badge: 'FESTIVE PRIVILEGE • SPECIAL CELEBRATION',
                    headline: 'A Little Magic for Your First Rass Creation',
                    desc: 'Enjoy an exclusive 20% discount across our handcrafted demi-fine jewelry collections.',
                    btn: 'Apply & Explore Collection',
                    code: 'FESTIVE20'
                  },
                  {
                    title: 'Diwali Royal Gala',
                    tag: 'Festival Special',
                    badge: 'DIWALI HEIRLOOM GALA • LIMITED PRIVILEGE',
                    headline: 'Celebrate the Festival of Lights in Solid Gold & Polki',
                    desc: 'Complimentary festive privilege applied automatically to your celebratory curation.',
                    btn: 'Unlock Festive Privilege',
                    code: 'FESTIVE20'
                  },
                  {
                    title: 'Bridal Soirée',
                    tag: 'Wedding Season',
                    badge: 'BRIDAL & SOIRÉE PRIVILEGE',
                    headline: 'Heirloom Karigari for Your Cherished Celebrations',
                    desc: 'Indulge in timeless hand-set Basra pearls and certified 925 hallmarked silver.',
                    btn: 'Explore Bridal Gallery',
                    code: 'WELCOME10'
                  },
                  {
                    title: 'VIP Heritage',
                    tag: '₹5,000 Flat Voucher',
                    badge: 'CONCIERGE INVITATION • EXCLUSIVE BENEFIT',
                    headline: 'Complimentary Heritage Privilege on Your Order',
                    desc: 'Curated exclusively for patrons of authentic artisanal Indian jewellery.',
                    btn: 'Claim Privilege & Curate',
                    code: 'HEIRLOOM5000'
                  }
                ];

                return (
                  <div className="bg-white rounded-3xl border border-[#E7E0DA] shadow-subtle p-6 sm:p-8 space-y-7">
                    
                    {/* Top Bar Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E0DA]">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FAF5F9] to-[#F5EEF4] border border-[#E2D5E5] flex items-center justify-center text-[#8B5E86] shadow-2xs shrink-0">
                          <Sparkles className="w-5 h-5 text-[#A783A2]" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#292624]">
                              Festive Storefront Campaign &amp; Entry Popup
                            </h3>
                            {festiveCampaign.isEnabled ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                                <span>Live on Storefront</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#F2EFEA] text-[#77716F] border border-[#E7E0DA]">
                                <span className="w-2 h-2 rounded-full bg-stone-400" />
                                <span>Paused</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#77716F] mt-1 leading-relaxed">
                            Control the celebratory welcome privilege that greets your website visitors. Edit parameters on the left and see the active replica on the right in real time.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsPreviewFestiveOpen(true)}
                          className="px-4 py-2.5 rounded-xl border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#292624] flex items-center space-x-1.5 cursor-pointer transition-all shadow-2xs active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#77716F]" />
                          <span>Fullscreen Modal</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const next = !festiveCampaign.isEnabled;
                            const updated = couponService.saveFestiveCampaign({ isEnabled: next });
                            setFestiveCampaign(updated);
                            showNotification(next ? 'Festive storefront popup is now LIVE' : 'Festive storefront popup paused');
                          }}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide cursor-pointer transition-all shadow-xs active:scale-95 ${
                            festiveCampaign.isEnabled
                              ? 'bg-[#8F3B30] text-white hover:bg-[#783026]'
                              : 'bg-[#3B5432] text-white hover:bg-[#2C3F25]'
                          }`}
                        >
                          {festiveCampaign.isEnabled ? 'Turn OFF' : 'Turn ON'}
                        </button>
                      </div>
                    </div>

                    {/* Split View: Left Column (Elevated Luxury Studio Form) + Right Column (Live Viewport Canvas) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">
                      
                      {/* ======================================================= */}
                      {/* LEFT COLUMN: HAUTE LUXURY STUDIO FORM (6 Cols)          */}
                      {/* ======================================================= */}
                      <div className="lg:col-span-6 space-y-4 text-xs">
                        
                        {/* 1-Click Creative Theme Presets */}
                        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] shadow-2xs space-y-2">
                          <div className="flex items-center justify-between px-0.5">
                            <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#B49A6C] flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-[#B49A6C]" />
                              <span>1-Click Campaign Themes</span>
                            </span>
                            <span className="text-[10px] text-[#77716F]">
                              Tap to auto-fill high-converting luxury copy
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {presets.map((p, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setFestiveCampaign(prev => ({
                                    ...prev,
                                    badgeText: p.badge,
                                    headline: p.headline,
                                    description: p.desc,
                                    buttonText: p.btn,
                                    linkedCouponCode: p.code,
                                  }));
                                  showNotification(`Applied theme: ${p.title}`);
                                }}
                                className="p-2.5 rounded-xl border border-[#E7E0DA] bg-white hover:border-[#B49A6C] hover:bg-[#FAF5F9] text-left transition-all cursor-pointer group shadow-2xs active:scale-95"
                              >
                                <span className="font-semibold text-[11px] text-[#292624] group-hover:text-[#8B5E86] block truncate">
                                  {p.title}
                                </span>
                                <span className="text-[9.5px] text-[#A783A2] block truncate mt-0.5 font-medium">
                                  {p.tag}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Unified Luxury Studio Form Panel */}
                        <div className="bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs overflow-hidden">
                          
                          {/* Section 01: Visual Branding & Narrative */}
                          <div className="p-5 sm:p-6 space-y-4">
                            <div className="flex items-center justify-between pb-2.5 border-b border-[#F2ECE5]">
                              <div className="flex items-center space-x-2">
                                <span className="w-5 h-5 rounded-full bg-[#FAF5F9] border border-[#E2D5E5] text-[#8B5E86] text-[10px] font-bold flex items-center justify-center font-mono">
                                  01
                                </span>
                                <span className="text-[11px] uppercase font-bold tracking-[0.16em] text-[#292624]">
                                  Visual Branding &amp; Narrative
                                </span>
                              </div>
                              <span className="text-[10px] text-[#77716F]">Storefront greetings</span>
                            </div>

                            {/* Upper Ribbon Pill Badge */}
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="font-semibold text-xs text-[#292624]">
                                  Festive Ribbon / Upper Pill Badge
                                </label>
                                <span className="text-[10px] text-[#77716F] font-mono">
                                  {(festiveCampaign.badgeText || '').length} chars
                                </span>
                              </div>
                              <input
                                type="text"
                                value={festiveCampaign.badgeText}
                                onChange={(e) => setFestiveCampaign(prev => ({ ...prev, badgeText: e.target.value }))}
                                placeholder="e.g. FESTIVE PRIVILEGE • SPECIAL CELEBRATION"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E0DA] bg-[#FCFBF9] text-xs font-semibold text-[#292624] tracking-wider uppercase placeholder-[#A8A29E] focus:outline-none focus:bg-white focus:border-[#B49A6C] focus:ring-2 focus:ring-[#B49A6C]/10 transition-all shadow-2xs"
                              />
                              <p className="text-[10px] text-[#77716F] mt-1">
                                Upper pill badge displayed gracefully above the headline title.
                              </p>
                            </div>

                            {/* Headline Title */}
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="font-semibold text-xs text-[#292624]">
                                  Headline Title
                                </label>
                                <span className="text-[10px] text-[#B49A6C] font-serif italic">
                                  Cormorant Garamond Serif
                                </span>
                              </div>
                              <input
                                type="text"
                                value={festiveCampaign.headline}
                                onChange={(e) => setFestiveCampaign(prev => ({ ...prev, headline: e.target.value }))}
                                placeholder="e.g. A Little Magic for Your First Rass Creation"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E0DA] bg-[#FCFBF9] text-sm font-serif font-medium text-[#292624] placeholder-[#A8A29E] focus:outline-none focus:bg-white focus:border-[#B49A6C] focus:ring-2 focus:ring-[#B49A6C]/10 transition-all shadow-2xs"
                              />
                              <p className="text-[10px] text-[#77716F] mt-1">
                                Primary luxury serif title greeting your visitors upon arrival.
                              </p>
                            </div>

                            {/* Festive Description / Subtitle */}
                            <div>
                              <label className="block font-semibold text-xs text-[#292624] mb-1.5">
                                Festive Description / Subtitle
                              </label>
                              <textarea
                                rows={2}
                                value={festiveCampaign.description}
                                onChange={(e) => setFestiveCampaign(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="e.g. Enjoy an exclusive 20% discount across our handcrafted demi-fine jewelry collections."
                                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E0DA] bg-[#FCFBF9] text-xs text-[#292624] placeholder-[#A8A29E] focus:outline-none focus:bg-white focus:border-[#B49A6C] focus:ring-2 focus:ring-[#B49A6C]/10 transition-all leading-relaxed resize-none shadow-2xs"
                              />
                              <p className="text-[10px] text-[#77716F] mt-1">
                                Atmospheric invitation narrative explaining the privilege.
                              </p>
                            </div>
                          </div>

                          {/* Section 02: Linked Offer & Call-to-Action */}
                          <div className="p-5 sm:p-6 bg-[#FAF9F6]/50 space-y-4 border-t border-[#F2ECE5]">
                            <div className="flex items-center justify-between pb-2.5 border-b border-[#F2ECE5]">
                              <div className="flex items-center space-x-2">
                                <span className="w-5 h-5 rounded-full bg-[#FAF5F9] border border-[#E2D5E5] text-[#8B5E86] text-[10px] font-bold flex items-center justify-center font-mono">
                                  02
                                </span>
                                <span className="text-[11px] uppercase font-bold tracking-[0.16em] text-[#292624]">
                                  Linked Offer &amp; Call-to-Action
                                </span>
                              </div>
                              <span className="text-[10px] text-[#77716F]">Checkout synchronization</span>
                            </div>

                            {/* Link Coupon Offer */}
                            <div>
                              <label className="block font-semibold text-xs text-[#292624] mb-1.5">
                                Link Coupon Offer
                              </label>
                              <select
                                value={festiveCampaign.linkedCouponCode}
                                onChange={(e) => setFestiveCampaign(prev => ({ ...prev, linkedCouponCode: e.target.value }))}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E0DA] bg-white text-xs font-semibold text-[#292624] focus:outline-none focus:border-[#B49A6C] focus:ring-2 focus:ring-[#B49A6C]/10 transition-all cursor-pointer shadow-2xs"
                              >
                                {coupons.filter(c => c.status === 'active').map(c => (
                                  <option key={c.id} value={c.code}>
                                    {c.code} — {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue.toLocaleString('en-IN')} OFF`} (Min cart ₹{c.minOrderValue.toLocaleString('en-IN')})
                                  </option>
                                ))}
                              </select>
                              
                              {/* Visual Live Formula Tag */}
                              <div className="mt-2 p-2.5 rounded-xl bg-[#FAF5F9] border border-[#E2D5E5] flex items-center justify-between text-[11px] shadow-2xs">
                                <div className="flex items-center space-x-1.5 text-[#8B5E86]">
                                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                  <span>Auto-apply formula:</span>
                                </div>
                                <span className="font-mono font-bold text-[#292624]">
                                  {previewDiscountFormula}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#77716F] mt-1">
                                When visitors click "Apply", this coupon code is auto-copied &amp; applied to cart.
                              </p>
                            </div>

                            {/* 2-Column Row: CTA Button Text & Popup Delay */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              <div>
                                <label className="block font-semibold text-xs text-[#292624] mb-1.5">
                                  Call to Action Button Text
                                </label>
                                <input
                                  type="text"
                                  value={festiveCampaign.buttonText}
                                  onChange={(e) => setFestiveCampaign(prev => ({ ...prev, buttonText: e.target.value }))}
                                  placeholder="e.g. Apply &amp; Explore Collection"
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E0DA] bg-white text-xs font-medium text-[#292624] focus:outline-none focus:border-[#B49A6C] focus:ring-2 focus:ring-[#B49A6C]/10 transition-all shadow-2xs"
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <label className="font-semibold text-xs text-[#292624]">
                                    Popup Delay on Site
                                  </label>
                                  <div className="flex items-center space-x-1">
                                    {[1.0, 2.5, 5.0].map((sec) => (
                                      <button
                                        key={sec}
                                        type="button"
                                        onClick={() => setFestiveCampaign(prev => ({ ...prev, delaySeconds: sec }))}
                                        className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-medium transition-colors cursor-pointer ${
                                          (festiveCampaign.delaySeconds || 2.5) === sec
                                            ? 'bg-[#292624] text-white'
                                            : 'bg-white border border-[#E7E0DA] text-[#77716F] hover:text-[#292624]'
                                        }`}
                                      >
                                        {sec}s
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setFestiveCampaign(prev => ({ ...prev, delaySeconds: Math.max(0.5, Number(((prev.delaySeconds || 2.5) - 0.5).toFixed(1))) }))}
                                    className="w-9 h-9 rounded-xl border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-xs font-bold text-[#292624] flex items-center justify-center cursor-pointer shadow-2xs active:scale-95"
                                  >
                                    -
                                  </button>
                                  <div className="flex-1 px-3 py-2 rounded-xl border border-[#E7E0DA] bg-white text-center shadow-2xs">
                                    <span className="font-mono text-xs font-bold text-[#292624]">
                                      {festiveCampaign.delaySeconds || 2.5}
                                    </span>
                                    <span className="text-[10px] text-[#77716F] ml-1">sec</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setFestiveCampaign(prev => ({ ...prev, delaySeconds: Math.min(15, Number(((prev.delaySeconds || 2.5) + 0.5).toFixed(1))) }))}
                                    className="w-9 h-9 rounded-xl border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-xs font-bold text-[#292624] flex items-center justify-center cursor-pointer shadow-2xs active:scale-95"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Section 03: Customer Delight & Effects */}
                          <div className="p-5 sm:p-6 space-y-3.5 border-t border-[#F2ECE5]">
                            <div className="flex items-center justify-between pb-2.5 border-b border-[#F2ECE5]">
                              <div className="flex items-center space-x-2">
                                <span className="w-5 h-5 rounded-full bg-[#FAF5F9] border border-[#E2D5E5] text-[#8B5E86] text-[10px] font-bold flex items-center justify-center font-mono">
                                  03
                                </span>
                                <span className="text-[11px] uppercase font-bold tracking-[0.16em] text-[#292624]">
                                  Customer Delight &amp; Effects
                                </span>
                              </div>
                              <span className="text-[10px] text-[#77716F]">Micro-interactions</span>
                            </div>

                            {/* Confetti Animation Switch & Test Button */}
                            <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-[#E7E0DA] bg-[#FCFBF9]">
                              <div className="pr-3">
                                <span className="font-semibold text-xs text-[#292624] block">
                                  Celebratory Confetti Animation
                                </span>
                                <span className="text-[10px] text-[#77716F] leading-tight block mt-0.5">
                                  Fires luxury particles when visitor copies code or clicks CTA button.
                                </span>
                              </div>
                              <div className="flex items-center space-x-2.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    try {
                                      confetti({
                                        particleCount: 40,
                                        spread: 60,
                                        origin: { y: 0.6 },
                                        colors: ['#A783A2', '#B49A6C', '#FAF8F5', '#E2D5E5'],
                                      });
                                    } catch (e) {}
                                    showNotification('Confetti test burst fired!');
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[10.5px] font-semibold text-[#77716F] hover:text-[#292624] cursor-pointer shadow-2xs active:scale-95"
                                >
                                  Test Burst
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = festiveCampaign.showConfetti === false ? true : false;
                                    setFestiveCampaign(prev => ({ ...prev, showConfetti: next }));
                                  }}
                                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                                    festiveCampaign.showConfetti !== false ? 'bg-[#A783A2]' : 'bg-stone-300'
                                  }`}
                                >
                                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                                    festiveCampaign.showConfetti !== false ? 'right-1' : 'left-1'
                                  }`} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Section 04: Anchored Luxury Action Footer */}
                          <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-[#E7E0DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                            <div className="flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                              <span className="text-[11px] text-[#77716F]">
                                Changes synchronize immediately on live storefront.
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                couponService.saveFestiveCampaign(festiveCampaign);
                                showNotification('Festive campaign configuration saved and live on storefront!');
                              }}
                              className="px-6 py-2.5 rounded-xl bg-[#292624] hover:bg-[#1C1A18] text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-sm active:scale-95 flex items-center justify-center space-x-2"
                            >
                              <Check className="w-3.5 h-3.5 text-[#B49A6C]" />
                              <span>Save Festive Settings</span>
                            </button>
                          </div>

                        </div>

                      </div>

                      {/* ======================================================= */}
                      {/* RIGHT COLUMN: HAUTE LUXURY STOREFRONT CANVAS (6 Cols)   */}
                      {/* ======================================================= */}
                      <div className="lg:col-span-6 bg-[#F6F3EE] p-5 sm:p-6 rounded-3xl border border-[#E5DDD5] shadow-xs space-y-4 sticky top-6 self-start">
                        
                        {/* Realistic Browser Header Bar with Device Switcher */}
                        <div className="flex items-center justify-between pb-3 border-b border-[#E5DDD5] text-xs">
                          <div className="flex items-center space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                          </div>

                          {/* Device Viewport Toggle */}
                          <div className="flex items-center bg-white/90 p-0.5 rounded-xl border border-[#E5DDD5] shadow-2xs">
                            <button
                              type="button"
                              onClick={() => setFestivePreviewDevice('desktop')}
                              className={`px-3 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                                festivePreviewDevice === 'desktop'
                                  ? 'bg-[#292624] text-white shadow-xs'
                                  : 'text-[#77716F] hover:text-[#292624]'
                              }`}
                            >
                              <Monitor className="w-3 h-3" />
                              <span>Desktop</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setFestivePreviewDevice('mobile')}
                              className={`px-3 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                                festivePreviewDevice === 'mobile'
                                  ? 'bg-[#292624] text-white shadow-xs'
                                  : 'text-[#77716F] hover:text-[#292624]'
                              }`}
                            >
                              <Smartphone className="w-3 h-3" />
                              <span>Mobile</span>
                            </button>
                          </div>

                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            <span>Live Canvas</span>
                          </span>
                        </div>

                        {/* Storefront Replica Frame */}
                        <div className={`transition-all duration-300 ${festivePreviewDevice === 'mobile' ? 'max-w-[340px] mx-auto' : 'w-full'}`}>
                          <div className={`relative bg-[#FAF8F5] border border-[#A783A2]/40 text-[#292624] text-center overflow-hidden transition-all shadow-[0_15px_40px_rgba(41,38,36,0.12)] ${
                            festivePreviewDevice === 'mobile'
                              ? 'rounded-[32px] border-4 border-[#292624] p-5 pt-7'
                              : 'rounded-3xl p-6 sm:p-8 pt-7 sm:pt-9'
                          }`}>
                            
                            {/* Decorative Mobile Speaker Notch if Mobile */}
                            {festivePreviewDevice === 'mobile' && (
                              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-stone-300" />
                            )}

                            {/* Decorative Botanical Sprigs in Background */}
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

                            {/* Top Privilege Badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5F9] border border-[#A783A2]/30 text-[#8B5E86] text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold mb-3 shadow-2xs">
                              <Sparkles className="w-3 h-3 text-[#A783A2]" />
                              <span>{festiveCampaign.badgeText || 'FESTIVE PRIVILEGE • SPECIAL CELEBRATION'}</span>
                            </div>

                            {/* Headline with Luxury Serif Font */}
                            <h2
                              className={`font-serif text-[#292624] tracking-tight leading-[1.25] mb-2 font-normal ${
                                festivePreviewDevice === 'mobile'
                                  ? 'text-xl sm:text-2xl'
                                  : 'text-2xl sm:text-[28px]'
                              }`}
                              style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif' }}
                            >
                              {festiveCampaign.headline || 'A Little Magic for Your First Rass Creation'}
                            </h2>

                            {/* Description */}
                            <p className="font-sans text-xs sm:text-[13px] text-[#77716F] leading-relaxed max-w-sm mx-auto mb-4">
                              {festiveCampaign.description || 'Enjoy an exclusive festive discount across our handcrafted demi-fine jewelry collections.'}
                            </p>

                            {/* Coupon Ticket Voucher Box */}
                            <div className="bg-[#FAF5F9] rounded-2xl border-2 border-dashed border-[#A783A2]/50 p-3.5 sm:p-4 relative mb-4 shadow-2xs group hover:border-[#A783A2] transition-colors">
                              {/* Ticket Cutouts */}
                              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FAF8F5] border-r-2 border-dashed border-[#A783A2]/50" />
                              <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FAF8F5] border-l-2 border-dashed border-[#A783A2]/50" />

                              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 px-1 text-left">
                                <div>
                                  <span className="text-[9px] uppercase tracking-[0.16em] text-[#8B5E86] font-semibold block mb-0.5">
                                    Exclusive Coupon Code
                                  </span>
                                  <span className="font-mono text-lg sm:text-2xl font-bold tracking-widest text-[#292624]">
                                    {festiveCampaign.linkedCouponCode || 'FESTIVE20'}
                                  </span>
                                  <p className="text-[10.5px] sm:text-[11px] text-[#77716F] mt-0.5">
                                    {previewDiscountFormula}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (festiveCampaign.showConfetti !== false) {
                                      try {
                                        confetti({
                                          particleCount: 40,
                                          spread: 60,
                                          origin: { y: 0.6 },
                                          colors: ['#A783A2', '#B49A6C', '#FAF8F5', '#E2D5E5'],
                                        });
                                      } catch (e) {}
                                    }
                                    showNotification(`Copied code: ${festiveCampaign.linkedCouponCode}`);
                                  }}
                                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#292624] hover:bg-[#1C1A18] text-white text-[10.5px] font-semibold tracking-wider uppercase flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                                >
                                  <Copy className="w-3.5 h-3.5 text-[#B49A6C]" />
                                  <span>Copy Code</span>
                                </button>
                              </div>
                            </div>

                            {/* Call to Action Button */}
                            <button
                              type="button"
                              onClick={() => {
                                if (festiveCampaign.showConfetti !== false) {
                                  try {
                                    confetti({
                                      particleCount: 50,
                                      spread: 70,
                                      origin: { y: 0.6 },
                                      colors: ['#A783A2', '#B49A6C', '#FAF8F5', '#E2D5E5'],
                                    });
                                  } catch (e) {}
                                }
                                showNotification('Interactive preview! Visitors will have this discount auto-applied.');
                              }}
                              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#A783A2] to-[#8E6389] hover:from-[#956E90] hover:to-[#7E5279] text-white font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                            >
                              <span>{festiveCampaign.buttonText || 'Apply & Explore Collection'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            {/* Trust Badges */}
                            <div className="flex items-center justify-center space-x-4 sm:space-x-5 pt-3.5 text-[9.5px] sm:text-[10px] text-[#77716F]">
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

                        {/* Interactive Footer Status */}
                        <div className="p-3 bg-white/90 rounded-2xl border border-[#E5DDD5] flex items-center justify-between text-[11px] text-[#77716F]">
                          <span>Trigger timing: <strong>{festiveCampaign.delaySeconds || 2.5}s</strong> delay</span>
                          <span className="font-semibold text-[#292624]">
                            {festiveCampaign.isEnabled ? 'Active on Storefront' : 'Currently Paused'}
                          </span>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })()}

'''

new_content = content[:start_idx] + new_festive_block + content[end_idx:]

with open('src/components/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated Festive Studio in AdminDashboard.tsx successfully!")
