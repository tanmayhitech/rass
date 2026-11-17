with open('src/components/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Welcome Header buttons to not duplicate + Create Order
old_banner_buttons = """                <div className="flex items-center space-x-2.5 shrink-0">
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
                </div>"""

new_banner_buttons = """                <div className="flex items-center space-x-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setNewProductForm(getInitialProductForm());
                      setIsNewProductModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#292624] hover:bg-[#1C1A18] text-white text-xs font-semibold cursor-pointer transition-all shadow-xs active:scale-95 flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#B49A6C]" />
                    <span>Add Product</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onBackToStore()}
                    className="px-4 py-2 rounded-xl border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#292624] cursor-pointer transition-all shadow-2xs active:scale-95 flex items-center space-x-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#77716F]" />
                    <span>View Storefront</span>
                  </button>
                </div>"""

if old_banner_buttons in content:
    content = content.replace(old_banner_buttons, new_banner_buttons)
    print("Updated Welcome Header buttons")
else:
    print("Warning: old_banner_buttons not found")

# 2. Make recent orders row interactive and clickable
old_row = """                          <div key={o.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#FAF8F5]/60 px-2 rounded-xl transition-colors">"""
new_row = """                          <div
                            key={o.id}
                            onClick={() => {
                              setActiveTab('orders');
                              setOrderSearch(o.id);
                            }}
                            className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#FAF8F5] px-3 rounded-xl transition-all cursor-pointer group"
                            title="Click to view full order details in Orders tab"
                          >"""

if old_row in content:
    content = content.replace(old_row, new_row)
    print("Made Recent Orders rows clickable to jump to order")
else:
    print("Warning: old_row not found")

# 3. Add hover lifts to the 4 KPI cards
content = content.replace(
    'p-5 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs flex flex-col justify-between space-y-3',
    'p-5 bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs hover:border-[#B49A6C]/40 hover:shadow-subtle transition-all duration-300 flex flex-col justify-between space-y-3'
)
print("Added luxury hover effects to KPI cards")

with open('src/components/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Polish script complete!")
