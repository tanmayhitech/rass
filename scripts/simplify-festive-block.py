with open('src/components/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "{/* ============================================================= */}\n              {/* FESTIVE CAMPAIGN & STOREFRONT POPUP (HAUTE LUXURY STUDIO EDITOR) */}"
end_marker = "              <div>\n                <h4 className=\"font-semibold text-xs text-[#292624] uppercase tracking-wider mb-3\">\n                  All Promotional Coupons ({coupons.length})"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"Error: markers not found. start_idx: {start_idx}, end_idx: {end_idx}")
    exit(1)

simple_festive_block = '''{/* ============================================================= */}
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

'''

new_content = content[:start_idx] + simple_festive_block + content[end_idx:]

with open('src/components/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Simplified festive block applied successfully!")
