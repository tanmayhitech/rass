with open('src/components/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "{/* ----------------------------------------------------------------- */}\n          {/* TAB: INVENTORY & STOCK MANAGEMENT (FULLY WORKING UPDATES) */}"
end_marker = "{/* ----------------------------------------------------------------- */}\n          {/* TAB: CUSTOMER ORDERS (WITH INVOICE & COURIER SLIP MODALS) */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"Error: markers not found. start_idx: {start_idx}, end_idx: {end_idx}")
    exit(1)

unified_products_block = '''{/* ----------------------------------------------------------------- */}
          {/* TAB: PRODUCTS & STOCK (UNIFIED MANAGEMENT WITH SORTING)           */}
          {/* ----------------------------------------------------------------- */}
          {(activeTab === 'products' || (activeTab as string) === 'inventory') && (
            <div className="space-y-6">
              
              {/* Top Stock Valuation & Health Summary Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs text-xs">
                <div>
                  <span className="text-[#77716F] block font-semibold uppercase text-[10.5px] tracking-wider">
                    Total Pieces in Stock
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-[#292624] mt-0.5 block font-mono">
                    {stockValuation.totalUnits} pcs
                  </span>
                  <span className="text-[11px] text-[#77716F] mt-0.5 block">
                    Across all {products.length} live catalog designs
                  </span>
                </div>

                <div>
                  <span className="text-[#77716F] block font-semibold uppercase text-[10.5px] tracking-wider">
                    Total Stock Value
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-[#292624] mt-0.5 block font-mono">
                    ₹{stockValuation.retailValuation.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-[#77716F] mt-0.5 block">
                    Current retail value of available jewellery
                  </span>
                </div>

                <div>
                  <span className="text-[#77716F] block font-semibold uppercase text-[10.5px] tracking-wider">
                    Low Stock Alerts
                  </span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className={`text-xl sm:text-2xl font-bold font-mono ${
                      stockValuation.lowStockSKUs > 0 ? 'text-[#8F3B30]' : 'text-emerald-700'
                    }`}>
                      {stockValuation.lowStockSKUs} {stockValuation.lowStockSKUs === 1 ? 'piece' : 'pieces'}
                    </span>
                    {stockValuation.lowStockSKUs > 0 && (
                      <button
                        type="button"
                        onClick={() => setProductSortBy('stock_asc')}
                        className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border transition-all cursor-pointer ${
                          productSortBy === 'stock_asc'
                            ? 'bg-[#8F3B30] text-white border-[#8F3B30]'
                            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {productSortBy === 'stock_asc' ? 'Sorting: Least Stock First' : 'Show Low Stock First'}
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] text-[#77716F] mt-0.5 block">
                    {stockValuation.lowStockSKUs > 0
                      ? 'Designs with 3 or fewer units remaining'
                      : 'All jewellery pieces are well-stocked'}
                  </span>
                </div>
              </div>

              {/* Product Filters & Sorting Bar */}
              <div className="p-4 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
                
                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#77716F]" />
                  <input
                    type="text"
                    placeholder="Search by name, SKU or code..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#B49A6C] transition-colors"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#77716F] hover:text-[#292624]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter & Sort Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Category Filter */}
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#77716F] font-semibold uppercase text-[10.5px] tracking-wider">Category:</span>
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="border border-[#E7E0DA] rounded-xl px-3 py-1.5 bg-white text-[#292624] focus:outline-none focus:border-[#B49A6C] font-medium cursor-pointer"
                    >
                      <option value="all">All Categories</option>
                      <option value="rings">Rings</option>
                      <option value="earrings">Earrings</option>
                      <option value="jhumka">Dome Jhumka</option>
                      <option value="kangan-sets">Kangan Sets</option>
                      <option value="kangna">Kangna</option>
                      <option value="necklaces">Necklaces</option>
                      <option value="bracelets">Bracelets</option>
                      <option value="western">Western Jewellery</option>
                      <option value="tribal">Tribal Jewellery</option>
                      <option value="kadas">Kadas</option>
                      <option value="accessories">Earpins &amp; Bugadi</option>
                      <option value="toran">Toran</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#77716F] font-semibold uppercase text-[10.5px] tracking-wider">Status:</span>
                    <select
                      value={productStatusFilter}
                      onChange={(e) => setProductStatusFilter(e.target.value)}
                      className="border border-[#E7E0DA] rounded-xl px-3 py-1.5 bg-white text-[#292624] focus:outline-none focus:border-[#B49A6C] font-medium cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="published">Published</option>
                      <option value="inactive">Inactive</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* Sort By Filter (USER REQUEST: sort by least unit and max) */}
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#77716F] font-semibold uppercase text-[10.5px] tracking-wider">Sort:</span>
                    <select
                      value={productSortBy}
                      onChange={(e) => setProductSortBy(e.target.value as any)}
                      className="border border-[#E7E0DA] rounded-xl px-3 py-1.5 bg-white text-[#292624] focus:outline-none focus:border-[#B49A6C] font-semibold cursor-pointer"
                    >
                      <option value="default">Default (Newest)</option>
                      <option value="stock_asc">Least Units First (Low Stock)</option>
                      <option value="stock_desc">Most Units First (High Stock)</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-[#E7E0DA] shadow-subtle overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead className="bg-[#FAF8F5] text-[#77716F] uppercase font-semibold text-[11px] tracking-wider border-b border-[#E7E0DA]">
                      <tr>
                        <th className="py-3 px-4">Design &amp; SKU</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => setProductSortBy(prev => prev === 'price_asc' ? 'price_desc' : 'price_asc')}
                            className="flex items-center space-x-1 uppercase hover:text-[#292624] cursor-pointer"
                          >
                            <span>Selling Price</span>
                            {productSortBy === 'price_asc' && <span>↑</span>}
                            {productSortBy === 'price_desc' && <span>↓</span>}
                          </button>
                        </th>
                        <th className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => setProductSortBy(prev => prev === 'stock_asc' ? 'stock_desc' : 'stock_asc')}
                            className="flex items-center space-x-1 uppercase hover:text-[#292624] cursor-pointer"
                            title="Click to sort by stock units"
                          >
                            <span>Stock on Hand</span>
                            {productSortBy === 'stock_asc' && <span className="text-[#8F3B30] font-bold">↑ (Least First)</span>}
                            {productSortBy === 'stock_desc' && <span className="text-emerald-700 font-bold">↓ (Most First)</span>}
                          </button>
                        </th>
                        <th className="py-3 px-4">Website Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E0DA]">
                      {paginatedProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-[#77716F]">
                            No designs found matching your search or filters.
                          </td>
                        </tr>
                      ) : (
                        paginatedProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                            <td className="py-3.5 px-4 flex items-center space-x-3">
                              <img
                                src={getOptimizedImageUrl(p.cleanImage || p.image)}
                                alt={p.name}
                                loading="lazy"
                                decoding="async"
                                onError={(e) => handleImageError(e, p.cleanImage || p.image)}
                                className="w-11 h-11 rounded-xl object-cover bg-stone-100 border border-[#E7E0DA] shrink-0"
                              />
                              <div>
                                <span className="font-semibold text-[#292624] block">{p.name}</span>
                                <span className="text-[10px] text-[#77716F] font-mono">{p.sku || p.id}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 uppercase text-[#77716F] font-medium">{p.categoryDisplay}</td>
                            <td className="py-3.5 px-4 font-bold text-[#292624]">₹{p.price.toLocaleString('en-IN')}</td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const v = variants.find(vr => vr.productId === p.id);
                                    if (v) handleQuickStockStep(v, -1);
                                  }}
                                  disabled={(p.stockCount ?? 0) <= 0}
                                  title="Deduct 1 piece"
                                  className="w-7 h-7 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] disabled:opacity-30 text-[#292624] flex items-center justify-center font-bold text-xs cursor-pointer transition-colors active:scale-95 shadow-2xs"
                                >
                                  -
                                </button>
                                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold font-mono ${
                                  (p.stockCount ?? 0) === 0
                                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                    : (p.stockCount ?? 0) <= 3
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                }`}>
                                  {p.stockCount ?? 0} {p.stockCount === 1 ? 'unit' : 'units'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const v = variants.find(vr => vr.productId === p.id);
                                    if (v) handleQuickStockStep(v, 1);
                                  }}
                                  title="Add 1 piece"
                                  className="w-7 h-7 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[#292624] flex items-center justify-center font-bold text-xs cursor-pointer transition-colors active:scale-95 shadow-2xs"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase ${
                                p.status === 'published' ? 'bg-[#EEF3EC] text-[#3B5432] border border-[#D3E0CE]' :
                                p.status === 'archived' ? 'bg-[#F2EFEA] text-[#6E6761] border border-[#E4DFD8]' : 'bg-[#FAF5EC] text-[#785E2F] border border-[#EFE3CF]'
                              }`}>
                                {p.status || 'published'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleProductStatus(p)}
                                  className="px-2.5 py-1 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[11px] font-medium text-[#292624] transition-colors cursor-pointer"
                                >
                                  {p.status === 'published' ? 'Deactivate' : 'Publish'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleArchiveProduct(p)}
                                  title="Archive product"
                                  className="p-1.5 rounded-lg hover:bg-[#FAF8F5] text-[#77716F] hover:text-[#B49A6C] transition-colors cursor-pointer"
                                >
                                  <Archive className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProductSafely(p)}
                                  title="Safe delete"
                                  className="p-1.5 rounded-lg hover:bg-[#FDF2F0] text-[#8F3B30] transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {filteredProducts.length > PRODUCTS_PER_PAGE && (
                  <div className="p-4 border-t border-[#E7E0DA] flex items-center justify-between text-xs text-[#77716F]">
                    <span>
                      Showing {Math.min((productPage - 1) * PRODUCTS_PER_PAGE + 1, filteredProducts.length)} to{' '}
                      {Math.min(productPage * PRODUCTS_PER_PAGE, filteredProducts.length)} of{' '}
                      <span className="font-semibold text-[#292624]">{filteredProducts.length}</span> designs
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => setProductPage(prev => Math.max(1, prev - 1))}
                        disabled={productPage === 1}
                        className="px-3 py-1 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed font-medium text-[#292624] transition-colors cursor-pointer"
                      >
                        Previous
                      </button>
                      <span className="px-2 font-mono text-[11px]">
                        Page {productPage} of {totalProductPages}
                      </span>
                      <button
                        onClick={() => setProductPage(prev => Math.min(totalProductPages, prev + 1))}
                        disabled={productPage === totalProductPages}
                        className="px-3 py-1 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed font-medium text-[#292624] transition-colors cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
'''

new_content = content[:start_idx] + unified_products_block + content[end_idx:]

# Also update title header line 1071: activeTab === 'products' ? 'Products & Stock'
new_content = new_content.replace(
    "activeTab === 'performance' ? 'Best Sellers' : activeTab === 'home_media' ? 'Home Media Manager' : activeTab.replace('_', ' ')",
    "activeTab === 'performance' ? 'Best Sellers' : activeTab === 'home_media' ? 'Home Media Manager' : activeTab === 'products' ? 'Products & Stock' : activeTab.replace('_', ' ')"
)

with open('src/components/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Stage 2 Unified Products & Stock applied successfully!")
