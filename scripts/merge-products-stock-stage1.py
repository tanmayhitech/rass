import re

with open('src/components/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add productSearch and productSortBy state
old_filters = "  const [productCategoryFilter, setProductCategoryFilter] = useState('all');\n  const [productStatusFilter, setProductStatusFilter] = useState('all');"
new_filters = """  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStatusFilter, setProductStatusFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [productSortBy, setProductSortBy] = useState<'default' | 'stock_asc' | 'stock_desc' | 'price_asc' | 'price_desc'>('default');"""

if old_filters in content:
    content = content.replace(old_filters, new_filters)
    print("Added productSearch and productSortBy state")
else:
    print("Warning: old_filters not found")

# 2. Update filteredProducts logic
old_filtered_products = """  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
      if (productStatusFilter !== 'all' && p.status !== productStatusFilter) return false;
      return true;
    });
  }, [products, productCategoryFilter, productStatusFilter]);"""

new_filtered_products = """  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      if (productSearch.trim()) {
        const query = productSearch.toLowerCase().trim();
        const matchName = (p.name || '').toLowerCase().includes(query);
        const matchSku = (p.sku || p.id || '').toLowerCase().includes(query);
        const matchCat = (p.categoryDisplay || p.category || '').toLowerCase().includes(query);
        if (!matchName && !matchSku && !matchCat) return false;
      }
      if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
      if (productStatusFilter !== 'all' && p.status !== productStatusFilter) return false;
      return true;
    });

    if (productSortBy === 'stock_asc') {
      return [...list].sort((a, b) => (a.stockCount ?? 0) - (b.stockCount ?? 0));
    }
    if (productSortBy === 'stock_desc') {
      return [...list].sort((a, b) => (b.stockCount ?? 0) - (a.stockCount ?? 0));
    }
    if (productSortBy === 'price_asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (productSortBy === 'price_desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, productSearch, productCategoryFilter, productStatusFilter, productSortBy]);"""

if old_filtered_products in content:
    content = content.replace(old_filtered_products, new_filtered_products)
    print("Updated filteredProducts logic")
else:
    print("Warning: old_filtered_products not found")

# 3. Update reset page effect
old_reset_page = """  // Reset page when filter changes
  useEffect(() => {
    setProductPage(1);
  }, [productCategoryFilter, productStatusFilter]);"""

new_reset_page = """  // Reset page when filter changes
  useEffect(() => {
    setProductPage(1);
  }, [productCategoryFilter, productStatusFilter, productSearch, productSortBy]);"""

if old_reset_page in content:
    content = content.replace(old_reset_page, new_reset_page)
    print("Updated reset page effect")

# 4. Update Overview quick links to inventory -> products with least stock first
content = content.replace(
    "onClick={() => setActiveTab('inventory')}",
    "onClick={() => { setActiveTab('products'); setProductSortBy('stock_asc'); }}"
)
print("Updated overview links to products with stock_asc")

# 5. Update navigation items: Remove separate inventory, rename products to 'Products & Stock'
# In mobile drawer:
old_mobile_nav = """            {[
              { id: 'overview', label: 'Overview', icon: DollarSign },
              { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: orders.length > 0 ? `${orders.length}` : undefined },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'inventory', label: 'Inventory', icon: Boxes, badge: stockValuation.lowStockSKUs > 0 ? `${stockValuation.lowStockSKUs}` : undefined },
              { id: 'performance', label: 'Best Sellers', icon: TrendingUp },
              { id: 'coupons', label: 'Coupons', icon: Tag },
              { id: 'ledger', label: 'Order Ledger', icon: FileSpreadsheet },
              { id: 'home_media', label: 'Home Media', icon: ImageIcon },
            ].map((item) => {"""

new_mobile_nav = """            {[
              { id: 'overview', label: 'Overview', icon: DollarSign },
              { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: orders.length > 0 ? `${orders.length}` : undefined },
              { id: 'products', label: 'Products & Stock', icon: Package, badge: stockValuation.lowStockSKUs > 0 ? `${stockValuation.lowStockSKUs} low` : undefined },
              { id: 'performance', label: 'Best Sellers', icon: TrendingUp },
              { id: 'coupons', label: 'Coupons', icon: Tag },
              { id: 'ledger', label: 'Order Ledger', icon: FileSpreadsheet },
              { id: 'home_media', label: 'Home Media', icon: ImageIcon },
            ].map((item) => {"""

if old_mobile_nav in content:
    content = content.replace(old_mobile_nav, new_mobile_nav)
    print("Updated mobile nav drawer")
else:
    print("Warning: old_mobile_nav not found")

# In desktop sidebar:
old_desktop_nav = """            {[
              { id: 'overview', label: 'Overview', icon: DollarSign },
              { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: orders.length > 0 ? `${orders.length}` : undefined },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'inventory', label: 'Inventory', icon: Boxes, badge: stockValuation.lowStockSKUs > 0 ? `${stockValuation.lowStockSKUs}` : undefined },
              { id: 'performance', label: 'Best Sellers', icon: TrendingUp },
              { id: 'coupons', label: 'Coupons', icon: Tag },
              { id: 'ledger', label: 'Order Ledger', icon: FileSpreadsheet },
              { id: 'home_media', label: 'Home Media', icon: ImageIcon },
            ].map((item) => {"""

new_desktop_nav = """            {[
              { id: 'overview', label: 'Overview', icon: DollarSign },
              { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: orders.length > 0 ? `${orders.length}` : undefined },
              { id: 'products', label: 'Products & Stock', icon: Package, badge: stockValuation.lowStockSKUs > 0 ? `${stockValuation.lowStockSKUs} low` : undefined },
              { id: 'performance', label: 'Best Sellers', icon: TrendingUp },
              { id: 'coupons', label: 'Coupons', icon: Tag },
              { id: 'ledger', label: 'Order Ledger', icon: FileSpreadsheet },
              { id: 'home_media', label: 'Home Media', icon: ImageIcon },
            ].map((item) => {"""

if old_desktop_nav in content:
    content = content.replace(old_desktop_nav, new_desktop_nav)
    print("Updated desktop sidebar nav")
else:
    print("Warning: old_desktop_nav not found")

# In bottom mobile dock:
old_bottom_nav = """          {[
            { id: 'overview', label: 'Pulse', icon: DollarSign },
            { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: orders.length > 0 ? `${orders.length}` : undefined },
            { id: 'products', label: 'Catalog', icon: Package },
            { id: 'inventory', label: 'Vault', icon: Boxes, badge: stockValuation.lowStockSKUs > 0 ? `${stockValuation.lowStockSKUs}` : undefined },
          ].map((item) => {"""

new_bottom_nav = """          {[
            { id: 'overview', label: 'Overview', icon: DollarSign },
            { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: orders.length > 0 ? `${orders.length}` : undefined },
            { id: 'products', label: 'Products & Stock', icon: Package, badge: stockValuation.lowStockSKUs > 0 ? `${stockValuation.lowStockSKUs}` : undefined },
            { id: 'coupons', label: 'Coupons', icon: Tag },
          ].map((item) => {"""

if old_bottom_nav in content:
    content = content.replace(old_bottom_nav, new_bottom_nav)
    print("Updated mobile bottom dock")
else:
    print("Warning: old_bottom_nav not found")

with open('src/components/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Stage 1 of Products & Stock merger complete!")
