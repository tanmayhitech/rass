with open('src/components/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "{/* TAB: OVERVIEW — RASS STORE EXECUTIVE OPERATIONS PORTAL */}"
end_marker = "{/* ----------------------------------------------------------------- */}\n          {/* TAB: PRODUCTS & STOCK (UNIFIED MANAGEMENT WITH SORTING)           */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"Error: markers not found. start_idx: {start_idx}, end_idx: {end_idx}")
    exit(1)

clean_overview_block = '''{/* TAB: OVERVIEW — RASS STORE EXECUTIVE OPERATIONS PORTAL */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'overview' && metrics && (
            <div className="space-y-6">
              
              {/* 1. Serene Welcome Header */}
              <div className="bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#E7E0DA] flex items-center justify-center shrink-0 p-2 shadow-2xs">
                    <img
                      src={getOptimizedImageUrl('/images/Rass by Ridhima Wordmark.png')}
                      alt="Rass by Riddhima"
                      className="w-full h-auto object-contain select-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h2 className="text-base sm:text-lg font-serif font-bold text-[#292624]">
                        Store Overview
                      </h2>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span>Storefront Live</span>
                      </span>
                    </div>
                    <p className="text-xs text-[#77716F] mt-0.5">
                      Real-time snapshot of your jewellery sales, orders, and stock.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsManualOrderModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#292624] hover:bg-[#1C1A18] text-white text-xs font-semibold cursor-pointer transition-all shadow-xs active:scale-95 flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#B49A6C]" />
                    <span>Create Order</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewProductForm(getInitialProductForm());
                      setIsNewProductModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#292624] cursor-pointer transition-all shadow-2xs active:scale-95 flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#77716F]" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              {/* 2. Four Clean KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Today's Net Sales */}
                <div className="p-5 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between text-[#77716F]">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider">Today's Sales</span>
                    <div className="w-7 h-7 rounded-lg bg-[#FAF5EC] border border-[#EFE3CF] flex items-center justify-center">
                      <DollarSign className="w-3.5 h-3.5 text-[#B49A6C]" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-[#292624] tracking-tight block">
                      ₹{metrics.netSalesToday.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-[#77716F] mt-1 block">
                      Gross sales: ₹{metrics.grossSalesToday.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* 2. Total Captured Revenue */}
                <div className="p-5 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between text-[#77716F]">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider">Total Sales</span>
                    <div className="w-7 h-7 rounded-lg bg-[#EEF3EC] border border-[#D3E0CE] flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#3B5432]" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-[#292624] tracking-tight block">
                      ₹{metrics.paidRevenueTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-[#77716F] mt-1 block">
                      Across all {orders.length} orders
                    </span>
                  </div>
                </div>

                {/* 3. Total Orders */}
                <div className="p-5 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between text-[#77716F]">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider">Total Orders</span>
                    <div className="w-7 h-7 rounded-lg bg-[#FAF5F9] border border-[#E2D5E5] flex items-center justify-center">
                      <ShoppingCart className="w-3.5 h-3.5 text-[#8B5E86]" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-[#292624] tracking-tight block">
                      {metrics.totalOrdersCount} <span className="text-sm font-normal text-[#77716F] font-sans">orders</span>
                    </span>
                    <span className="text-[11px] text-[#77716F] mt-1 block">
                      Avg. order: ₹{metrics.averageOrderValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* 4. Ready Stock on Hand */}
                <div className="p-5 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between text-[#77716F]">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider">Stock on Hand</span>
                    <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E7E0DA] flex items-center justify-center">
                      <Package className="w-3.5 h-3.5 text-[#292624]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-2xl sm:text-3xl font-bold font-mono text-[#292624] tracking-tight">
                        {stockValuation.totalUnits}
                      </span>
                      <span className="text-xs text-[#77716F]">pieces</span>
                    </div>
                    <div className="text-[11px] text-[#77716F] mt-1 flex items-center justify-between">
                      <span>Val: ₹{stockValuation.retailValuation.toLocaleString('en-IN')}</span>
                      {stockValuation.lowStockSKUs > 0 ? (
                        <span className="text-[#8F3B30] font-semibold">
                          {stockValuation.lowStockSKUs} low
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">Healthy</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* 3. Single Action Required Notice Strip */}
              {(orders.filter(o => o.status === 'Processing').length > 0 || stockValuation.lowStockSKUs > 0) && (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E0DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-semibold text-[#292624] block">
                        Action Required Today
                      </span>
                      <p className="text-[11px] text-[#77716F]">
                        {orders.filter(o => o.status === 'Processing').length > 0 && (
                          <span>{orders.filter(o => o.status === 'Processing').length} order{orders.filter(o => o.status === 'Processing').length === 1 ? '' : 's'} waiting to be packed &amp; shipped. </span>
                        )}
                        {stockValuation.lowStockSKUs > 0 && (
                          <span>{stockValuation.lowStockSKUs} piece{stockValuation.lowStockSKUs === 1 ? '' : 's'} running low in stock.</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {orders.filter(o => o.status === 'Processing').length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('orders');
                          setOrderStatusFilter('Processing');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#292624] text-white text-[11px] font-semibold cursor-pointer hover:bg-black transition-all shadow-xs"
                      >
                        Pack Orders →
                      </button>
                    )}
                    {stockValuation.lowStockSKUs > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('products');
                          setProductSortBy('stock_asc');
                        }}
                        className="px-3.5 py-1.5 rounded-lg border border-[#E7E0DA] bg-white text-[#292624] text-[11px] font-semibold cursor-pointer hover:bg-[#FAF8F5] transition-all shadow-2xs"
                      >
                        View Low Stock →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 4. Two-Column Calm Split: Recent Orders (Left) + Top Creation & Quick Shortcuts (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT COLUMN (2 Cols): Recent Customer Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs p-5 sm:p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-3.5 border-b border-[#F2ECE5]">
                      <div>
                        <h3 className="font-semibold text-xs text-[#292624] uppercase tracking-wider">
                          Recent Customer Orders
                        </h3>
                        <p className="text-[11px] text-[#77716F] mt-0.5">
                          Latest purchases from website &amp; concierge
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-semibold text-[#B49A6C] hover:underline cursor-pointer"
                      >
                        View All Orders →
                      </button>
                    </div>

                    {/* Calm Orders List */}
                    <div className="divide-y divide-[#F2ECE5] text-xs mt-1">
                      {orders.slice(0, 4).map((o) => {
                        const snapshots = o.itemSnapshots && o.itemSnapshots.length > 0 ? o.itemSnapshots : [];
                        const safeItems = Array.isArray(o.items) ? o.items : [];
                        const pieceCount = snapshots.length > 0
                          ? snapshots.reduce((acc, s) => acc + (s.quantity || 1), 0)
                          : safeItems.reduce((acc, i) => acc + (i?.quantity || 1), 0);
                        const pieceTitles = snapshots.length > 0
                          ? snapshots.map(s => s.productTitle).filter(Boolean).join(', ')
                          : safeItems.map(i => i?.product?.name).filter(Boolean).join(', ');

                        return (
                          <div key={o.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#FAF8F5]/60 px-2 rounded-xl transition-colors">
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono font-bold text-[#292624]">{o.id}</span>
                                <span className="text-[#C2BCB6]">•</span>
                                <span className="font-medium text-[#292624]">{o.customerName}</span>
                                <span className="text-[#C2BCB6]">•</span>
                                <span className="text-[#77716F]">{o.city}</span>
                              </div>
                              <p className="text-[11px] text-[#77716F] truncate max-w-md">
                                {pieceCount} piece{pieceCount !== 1 ? 's' : ''} {pieceTitles ? `(${pieceTitles})` : ''} • {o.date}
                              </p>
                            </div>

                            <div className="flex items-center space-x-3 shrink-0">
                              <span className="font-bold text-sm font-mono text-[#292624]">
                                ₹{o.total.toLocaleString('en-IN')}
                              </span>
                              <span className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold uppercase ${
                                o.status === 'Delivered' ? 'bg-[#EEF3EC] text-[#3B5432] border border-[#D3E0CE]' :
                                o.status === 'Shipped' ? 'bg-[#F5F0F5] text-[#694868] border border-[#E5D7E5]' :
                                o.status === 'Cancelled' ? 'bg-[#FDF2F0] text-[#8F3B30] border border-[#F8D4CF]' :
                                'bg-[#FAF5EC] text-[#785E2F] border border-[#EFE3CF]'
                              }`}>
                                {o.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F2ECE5]">
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="w-full py-2.5 rounded-xl border border-[#E7E0DA] bg-[#FAF8F5] hover:bg-white text-xs font-semibold text-[#292624] text-center cursor-pointer transition-all shadow-2xs hover:shadow-xs"
                    >
                      Open Full Customer Orders Console ({orders.length} total orders) →
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN (1 Col): Top Creation & Quick Shortcuts */}
                <div className="space-y-5">
                  
                  {/* Top Selling Design Card */}
                  {performance && performance[0] && (
                    <div className="bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs p-5 space-y-3.5">
                      <div className="flex items-center justify-between pb-2.5 border-b border-[#F2ECE5]">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#B49A6C]">
                          #1 Customer Favorite
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('performance')}
                          className="text-[11px] font-semibold text-[#77716F] hover:text-[#292624] cursor-pointer"
                        >
                          Rankings →
                        </button>
                      </div>

                      <div className="flex items-center space-x-3.5">
                        <img
                          src={getOptimizedImageUrl(performance[0].imageUrl)}
                          alt={performance[0].productTitle}
                          className="w-14 h-14 rounded-xl object-cover bg-stone-100 border border-[#E7E0DA] shrink-0"
                        />
                        <div className="space-y-0.5 truncate">
                          <span className="font-semibold text-xs text-[#292624] block truncate">
                            {performance[0].productTitle}
                          </span>
                          <span className="text-[11px] text-[#77716F] capitalize block">
                            {performance[0].category.replace('-', ' ')}
                          </span>
                          <span className="font-mono font-bold text-xs text-[#292624] block">
                            ₹{performance[0].netRevenue.toLocaleString('en-IN')}
                            <span className="text-[10px] font-normal text-[#77716F] ml-1">
                              ({performance[0].unitsSold} sold)
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Shortcuts */}
                  <div className="bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs p-5 space-y-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#77716F] block pb-2 border-b border-[#F2ECE5]">
                      Quick Shortcuts
                    </span>
                    <div className="space-y-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('products');
                          setProductSortBy('stock_asc');
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-[#E7E0DA] bg-[#FAF8F5] hover:bg-white text-left text-[#292624] font-medium transition-all cursor-pointer flex items-center justify-between"
                      >
                        <span>Check Low Stock Pieces</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#77716F]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('coupons')}
                        className="w-full px-3 py-2 rounded-xl border border-[#E7E0DA] bg-[#FAF8F5] hover:bg-white text-left text-[#292624] font-medium transition-all cursor-pointer flex items-center justify-between"
                      >
                        <span>Manage Welcome Offer &amp; Popup</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#77716F]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onBackToStore()}
                        className="w-full px-3 py-2 rounded-xl border border-[#E7E0DA] bg-[#FAF8F5] hover:bg-white text-left text-[#292624] font-medium transition-all cursor-pointer flex items-center justify-between"
                      >
                        <span>View Live Storefront</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#77716F]" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}
'''

new_content = content[:start_idx] + clean_overview_block + content[end_idx:]

with open('src/components/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Overview section decluttered and modernized successfully!")
