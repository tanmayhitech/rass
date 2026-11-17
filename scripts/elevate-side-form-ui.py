import re

with open('src/components/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Locate the Festive Campaign section
start_marker = "              {/* ============================================================= */}\n              {/* FESTIVE CAMPAIGN & STOREFRONT POPUP (SIDE-BY-SIDE LIVE PREVIEW) */}"
end_marker = "              <div>\n                <h4 className=\"font-semibold text-xs text-[#292624] uppercase tracking-wider mb-3\">\n                  All Promotional Coupons"

start_idx = code.find(start_marker)
end_idx = code.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"ERROR: Markers not found! start_idx={start_idx}, end_idx={end_idx}")
    exit(1)

print(f"Found Festive Campaign block from index {start_idx} to {end_idx}")

new_section = '''              {/* ============================================================= */}
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
                    badge: 'FESTIVE PRIVILEGE • SPECIAL CELEBRATION',
                    headline: 'A Little Magic for Your First Rass Creation',
                    desc: 'Enjoy an exclusive 20% discount across our handcrafted demi-fine jewelry collections.',
                    btn: 'Apply & Explore Collection',
                    code: 'FESTIVE20'
                  },
                  {
                    title: 'Diwali Heirloom Gala',
                    badge: 'DIWALI HEIRLOOM GALA • LIMITED PRIVILEGE',
                    headline: 'Celebrate the Festival of Lights in Solid Gold & Polki',
                    desc: 'Complimentary festive privilege applied automatically to your celebratory curation.',
                    btn: 'Unlock Festive Privilege',
                    code: 'FESTIVE20'
                  },
                  {
                    title: 'Bridal & Soirée Privileges',
                    badge: 'BRIDAL & SOIRÉE PRIVILEGE',
                    headline: 'Heirloom Karigari for Your Cherished Celebrations',
                    desc: 'Indulge in timeless hand-set Basra pearls and certified 925 hallmarked silver.',
                    btn: 'Explore Bridal Gallery',
                    code: 'WELCOME10'
                  },
                  {
                    title: 'VIP Patron Invitation',
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
                        <div className="w-11 h-11 rounded-2xl bg-[#FAF5F9] border border-[#E2D5E5] flex items-center justify-center text-[#8B5E86] shadow-2xs shrink-0">
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
                              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#F2EFEA] text-[#77716F] border border-[#E7E0DA]">
                                Paused
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
                          className="px-4 py-2 rounded-xl border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#292624] flex items-center space-x-1.5 cursor-pointer transition-all shadow-2xs active:scale-95"
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
                          className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide cursor-pointer transition-all shadow-xs active:scale-95 ${
                            festiveCampaign.isEnabled
                              ? 'bg-[#8F3B30] text-white hover:bg-[#783026]'
                              : 'bg-[#3B5432] text-white hover:bg-[#2C3F25]'
                          }`}
                        >
                          {festiveCampaign.isEnabled ? 'Turn OFF' : 'Turn ON'}
                        </button>
                      </div>
                    </div>

                    {/* Split View: Left Column (Elevated Form) + Right Column (Live Viewport Canvas) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">
                      
                      {/* ======================================================= */}
                      {/* LEFT COLUMN: HAUTE LUXURY STUDIO FORM (6 Cols)          */}
                      {/* ======================================================= */}
                      <div className="lg:col-span-6 space-y-5 text-xs">
                        
                        {/* 1-Click Creative Presets */}
                        <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#E7E0DA] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10.5px] uppercase font-bold tracking-[0.16em] text-[#B49A6C]">
                              Instant Inspiration Presets
                            </span>
                            <span className="text-[10px] text-[#77716F]">
                              Click to auto-fill high-converting luxury copy
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
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
                                  showNotification(`Applied preset: ${p.title}`);
                                }}
                                className="p-2.5 rounded-xl border border-[#E7E0DA] bg-white hover:border-[#B49A6C] hover:shadow-2xs text-left transition-all cursor-pointer group"
                              >
                                <span className="font-semibold text-xs text-[#292624] group-hover:text-[#B49A6C] block truncate">
                                  {p.title}
                                </span>
                                <span className="text-[10px] text-[#77716F] block truncate mt-0.5">
                                  {p.headline}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Card A: Editorial Copy & Branding */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E7E0DA] shadow-2xs space-y-3.5">
                          <span className="text-[10.5px] uppercase font-bold tracking-[0.16em] text-[#77716F] block pb-1 border-b border-[#E7E0DA]">
                            Editorial Copy &amp; Messaging
                          </span>

                          {/* Upper Pill Badge Tag */}
                          <div>
                            <label className="block font-semibold text-[#292624] mb-1">
                              Festive Ribbon / Upper Badge Tag
                            </label>
                            <input
                              type="text"
                              value={festiveCampaign.badgeText}
                              onChange={(e) => setFestiveCampaign(prev => ({ ...prev, badgeText: e.target.value }))}
                              placeholder="e.g. FESTIVE PRIVILEGE • SPECIAL CELEBRATION"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E0DA] bg-[#FCFBF9] text-xs text-[#292624] focus:outline-none focus:bg-white focus:border-[#B49A6C] focus:ring-2 focus:ring-[#B49A6C]/10 transition-all font-medium"
                            />
                            <span className="text-[10px] text-[#77716F] mt-1 block">
                              Small pill badge displayed above the main headline.
                            </span>
                          </div>

                          {/* Headline Title */}
                          <div>
                            <label className="block font-semibold text-[#292624] mb-1">
                              Headline Title
                            </label>
                            <input
                              type="text"
                              value={festiveCampaign.headline}
                              onChange={(e) => setFestiveCampaign(prev => ({ ...prev, headline: e.target.value }))}
                              placeholder="e.g. A Little Magic for Your First Rass Creation"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E0DA] bg-[#FCFBF9] text-xs font-serif font-medium text-[#292624] focus:outline-none focus:bg-white focus:border-[#B49A6C] focus:ring-2 focus:ring-[#B49A6C]/10 transition-all"
                            />
                            <span className="text-[10px] text-[#77716F] mt-1 block">
                              Main luxury serif title greeting your visitors.
                            </span>
                          </div>

                          {/* Festive Description */}
                          <div>
                            <label className="block font-semibold text-[#292624] mb-1">
                              Festive Narrative / Subtitle
                            </label>
                            <textarea
                              rows={2}
                              value={festiveCampaign.description}
                              onChange={(e) => setFestiveCampaign(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="e.g. Enjoy an exclusive 20% discount across our handcrafted demi-fine jewelry collections."
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E0DA] bg-[#FCFBF9] text-xs text-[#292624] focus:outline-none focus:bg-white focus:border-[#B49A6C] focus:ring-2 focus:ring-[#B49A6C]/10 transition-all leading-relaxed"
                            />
                            <span className="text-[10px] text-[#77716F] mt-1 block">
                              Atmospheric invitation text describing the celebration.
                            </span>
                          </div>
                        </div>

                        {/* Card B: Commercial Terms & Automation */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E7E0DA] shadow-2xs space-y-3.5">
                          <span className="text-[10.5px] uppercase font-bold tracking-[0.16em] text-[#77716F] block pb-1 border-b border-[#E7E0DA]">
                            Commercial Privilege &amp; Trigger Automation
                          </span>

                          {/* Linked Coupon Offer */}
                          <div>
                            <label className="block font-semibold text-[#292624] mb-1">
                              Link Coupon Offer
                            </label>
                            <select
                              value={festiveCampaign.linkedCouponCode}
                              onChange={(e) => {
                                const code = e.target.value;
                                setFestiveCampaign(prev => ({ ...prev, linkedCouponCode: code }));
                              }}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E0DA] bg-[#FCFBF9] text-xs text-[#292624] focus:outline-none focus:bg-white focus:border-[#B49A6C] cursor-pointer font-medium"
                            >
                              {coupons.map((c) => (
                                <option key={c.id} value={c.code}>
                                  {c.code} — {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue.toLocaleString('en-IN')} FLAT`} (Min cart ₹{c.minOrderValue.toLocaleString('en-IN')})
                                </option>
                              ))}
                            </select>
                            <div className="mt-1.5 p-2 rounded-lg bg-[#FAF5F9] border border-[#E2D5E5] flex items-center justify-between text-[11px]">
                              <span className="text-[#8B5E86] font-medium">Auto-apply formula:</span>
                              <span className="font-semibold text-[#292624]">{previewDiscountFormula}</span>
                            </div>
                          </div>

                          {/* Button Text & Delay */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label className="block font-semibold text-[#292624] mb-1">
                                Call to Action Button Text
                              </label>
                              <input
                                type="text"
                                value={festiveCampaign.buttonText}
                                onChange={(e) => setFestiveCampaign(prev => ({ ...prev, buttonText: e.target.value }))}
                                placeholder="e.g. Apply &amp; Explore Collection"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E0DA] bg-[#FCFBF9] text-xs text-[#292624] focus:outline-none focus:bg-white focus:border-[#B49A6C] transition-all font-medium"
                              />
                            </div>

                            <div>
                              <label className="block font-semibold text-[#292624] mb-1">
                                Trigger Delay on Site (Seconds)
                              </label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  min={0.5}
                                  max={15}
                                  step={0.5}
                                  value={festiveCampaign.delaySeconds}
                                  onChange={(e) => setFestiveCampaign(prev => ({ ...prev, delaySeconds: Number(e.target.value) || 2.5 }))}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E0DA] bg-[#FCFBF9] text-xs font-bold text-[#292624] focus:outline-none focus:bg-white focus:border-[#B49A6C] transition-all"
                                />
                                <span className="text-xs font-mono text-[#77716F] shrink-0 font-medium">sec</span>
                              </div>
                            </div>
                          </div>

                          {/* Confetti Animation Switch */}
                          <div className="flex items-center justify-between p-3 rounded-xl border border-[#E7E0DA] bg-[#FCFBF9]">
                            <div>
                              <span className="font-semibold text-xs text-[#292624] block">
                                Celebratory Confetti Animation
                              </span>
                              <span className="text-[10px] text-[#77716F]">
                                Fires celebratory particles when visitor copies code or clicks CTA.
                              </span>
                            </div>
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

                        {/* Sticky Action Footer */}
                        <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#E7E0DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                          <span className="text-[11px] text-[#77716F]">
                            Changes take effect immediately on the live storefront.
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              couponService.saveFestiveCampaign(festiveCampaign);
                              showNotification('Festive campaign configuration saved and live on storefront!');
                            }}
                            className="px-6 py-2.5 rounded-xl bg-[#292624] hover:bg-[#1C1A18] text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-sm active:scale-95"
                          >
                            Save Festive Settings
                          </button>
                        </div>

                      </div>

                      {/* ======================================================= */}
                      {/* RIGHT COLUMN: HAUTE LUXURY STOREFRONT CANVAS (6 Cols)   */}
                      {/* ======================================================= */}
                      <div className="lg:col-span-6 bg-[#F6F3EE] p-5 sm:p-6 rounded-3xl border border-[#E5DDD5] shadow-xs space-y-4">
                        
                        {/* Realistic Browser Header Bar */}
                        <div className="flex items-center justify-between pb-3 border-b border-[#E5DDD5] text-xs">
                          <div className="flex items-center space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                          </div>

                          <div className="px-3.5 py-1 rounded-full bg-white/80 border border-[#E5DDD5] text-[10.5px] font-mono text-[#77716F] flex items-center space-x-1.5 shadow-2xs">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>rassbyriddhima.com/welcome-offer</span>
                          </div>

                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            <span>Active Canvas</span>
                          </span>
                        </div>

                        {/* In-Situ Replica of the Welcome Offer Modal */}
                        <div className="relative w-full bg-[#FAF8F5] rounded-[28px] border border-[#A783A2]/40 shadow-[0_16px_45px_rgba(41,38,36,0.14)] overflow-hidden p-6 sm:p-8 text-center text-[#292624] transition-all">
                          
                          {/* Decorative Botanical Sprigs in Background */}
                          <div className="absolute top-0 left-0 pointer-events-none opacity-20 select-none">
                            <img
                              src={getOptimizedImageUrl('/elements/Mauve Botanical Sprig Line Art.png')}
                              alt=""
                              className="w-24 sm:w-28 h-auto object-contain"
                            />
                          </div>
                          <div className="absolute top-0 right-0 pointer-events-none opacity-20 select-none -scale-x-100">
                            <img
                              src={getOptimizedImageUrl('/elements/Mauve Botanical Sprig Line Art.png')}
                              alt=""
                              className="w-24 sm:w-28 h-auto object-contain"
                            />
                          </div>

                          {/* Top Privilege Badge */}
                          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF5F9] border border-[#A783A2]/30 text-[#8B5E86] text-[9.5px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold mb-3.5 shadow-2xs">
                            <Sparkles className="w-3 h-3 text-[#A783A2]" />
                            <span>{festiveCampaign.badgeText || 'FESTIVE PRIVILEGE • SPECIAL CELEBRATION'}</span>
                          </div>

                          {/* Headline with Luxury Serif Font */}
                          <h2
                            className="text-2xl sm:text-[28px] font-serif text-[#292624] tracking-tight leading-[1.25] mb-2 font-normal"
                            style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif' }}
                          >
                            {festiveCampaign.headline || 'A Little Magic for Your First Rass Creation'}
                          </h2>

                          {/* Description */}
                          <p className="font-sans text-xs sm:text-[13px] text-[#77716F] leading-relaxed max-w-sm mx-auto mb-5">
                            {festiveCampaign.description || 'Enjoy an exclusive festive discount across our handcrafted demi-fine jewelry collections.'}
                          </p>

                          {/* Coupon Ticket Voucher Box */}
                          <div className="bg-[#FAF5F9] rounded-2xl border-2 border-dashed border-[#A783A2]/50 p-4 relative mb-5 shadow-2xs group hover:border-[#A783A2] transition-colors">
                            {/* Ticket Cutouts */}
                            <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FAF8F5] border-r-2 border-dashed border-[#A783A2]/50" />
                            <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FAF8F5] border-l-2 border-dashed border-[#A783A2]/50" />

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 text-left">
                              <div>
                                <span className="text-[9px] uppercase tracking-[0.16em] text-[#8B5E86] font-semibold block mb-0.5">
                                  Exclusive Coupon Code
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
                                className="px-4 py-2.5 rounded-xl bg-[#292624] hover:bg-[#1C1A18] text-white text-[10.5px] font-semibold tracking-wider uppercase flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
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

                        {/* Interactive Footer Status */}
                        <div className="p-3 bg-white/90 rounded-2xl border border-[#E5DDD5] flex items-center justify-between text-[11px] text-[#77716F]">
                          <span>Trigger timing: <strong>{festiveCampaign.delaySeconds || 2.5}s</strong> after visitor arrival</span>
                          <span className="font-semibold text-[#292624]">
                            {festiveCampaign.isEnabled ? 'Live on Storefront' : 'Currently Paused'}
                          </span>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })()}
'''

code = code[:start_idx] + new_section + "\n" + code[end_idx:]

with open('src/components/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully updated AdminDashboard.tsx with elevated side form and browser viewport canvas!")
