with open('src/components/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """              {/* Category Filter Pills */}
              <div className=\"flex flex-wrap items-center gap-1.5\">"""

chart_snippet = """              {/* Visual Sales & Revenue Performance Chart Panel */}
              {(() => {
                const topChartItems = performance
                  .filter(p => perfCategoryFilter === 'all' || p.category === perfCategoryFilter)
                  .slice(0, 5);

                const totalPerfRevenue = performance.reduce((s, p) => s + p.netRevenue, 0);

                const categoryMap = performance.reduce((acc, p) => {
                  acc[p.category] = (acc[p.category] || 0) + p.netRevenue;
                  return acc;
                }, {} as Record<string, number>);

                const categoryBreakdown = Object.entries(categoryMap)
                  .filter(([_, rev]) => rev > 0)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, rev]) => ({
                    category: cat,
                    label: cat.replace('-', ' '),
                    revenue: rev,
                    percentage: totalPerfRevenue > 0 ? Math.max(1, Math.round((rev / totalPerfRevenue) * 100)) : 0,
                  }));

                return (
                  <div className="bg-white rounded-2xl border border-[#E7E0DA] shadow-2xs p-5 sm:p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#F2ECE5]">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#B49A6C] block">
                          Visual Leaderboard Chart
                        </span>
                        <h4 className="font-serif text-base sm:text-lg font-bold text-[#292624] mt-0.5">
                          Top Performing Creations ({perfSortBy === 'netRevenue' ? 'By Revenue' : 'By Units Sold'})
                        </h4>
                      </div>
                      <div className="text-[11px] text-[#77716F]">
                        Ranked by {perfSortBy === 'netRevenue' ? 'net captured revenue' : 'sales volume'}
                      </div>
                    </div>

                    {/* Top Comparative Bar Chart */}
                    <div className="space-y-3.5">
                      {topChartItems.length === 0 ? (
                        <p className="text-xs text-[#77716F] py-4 text-center">No sales data for selected category.</p>
                      ) : (
                        topChartItems.map((item, idx) => {
                          const maxVal = topChartItems[0]
                            ? (perfSortBy === 'netRevenue' ? topChartItems[0].netRevenue : topChartItems[0].unitsSold)
                            : 1;
                          const currentVal = perfSortBy === 'netRevenue' ? item.netRevenue : item.unitsSold;
                          const pct = maxVal > 0 ? Math.max(10, Math.round((currentVal / maxVal) * 100)) : 10;

                          return (
                            <div key={item.productId} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-2.5 truncate pr-2">
                                  <span className="w-5 text-center font-mono font-bold text-[#B49A6C] text-[11px]">
                                    0{idx + 1}
                                  </span>
                                  <img
                                    src={getOptimizedImageUrl(item.imageUrl)}
                                    alt={item.productTitle}
                                    className="w-7 h-7 rounded-lg object-cover bg-stone-100 border border-[#E7E0DA] shrink-0"
                                  />
                                  <span className="font-semibold text-[#292624] truncate">
                                    {item.productTitle}
                                  </span>
                                  <span className="text-[10.5px] text-[#77716F] uppercase hidden md:inline font-mono">
                                    ({item.category.replace('-', ' ')})
                                  </span>
                                </div>
                                
                                <div className="text-right shrink-0 flex items-center space-x-2 font-mono">
                                  <span className="text-xs font-bold text-[#292624]">
                                    {perfSortBy === 'netRevenue' ? `₹${item.netRevenue.toLocaleString('en-IN')}` : `${item.unitsSold} pcs`}
                                  </span>
                                  <span className="text-[10px] text-[#77716F] hidden sm:inline">
                                    {perfSortBy === 'netRevenue' ? `(${item.unitsSold} sold)` : `(₹${item.netRevenue.toLocaleString('en-IN')})`}
                                  </span>
                                </div>
                              </div>

                              {/* Luxury Bar Track */}
                              <div className="w-full h-3 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E7E0DA]/70 p-0.5">
                                <div
                                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#B49A6C] to-[#8F3B30]"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Category Sales Share Multi-Segment Bar */}
                    {categoryBreakdown.length > 0 && (
                      <div className="pt-4 border-t border-[#F2ECE5] space-y-2.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-[#77716F] uppercase tracking-wider text-[10px]">
                            Category Revenue Distribution
                          </span>
                          <span className="text-[#77716F] font-mono font-medium">
                            Total: ₹{totalPerfRevenue.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Segment Bar */}
                        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-stone-200 shadow-2xs">
                          {categoryBreakdown.map((cat, idx) => {
                            const colors = [
                              'bg-[#B49A6C]', // Gold
                              'bg-[#292624]', // Charcoal
                              'bg-[#A783A2]', // Mauve
                              'bg-[#3B5432]', // Forest
                              'bg-[#8F3B30]', // Rust
                            ];
                            const colorClass = colors[idx % colors.length];
                            return (
                              <div
                                key={cat.category}
                                className={`${colorClass} transition-all duration-300`}
                                style={{ width: `${cat.percentage}%` }}
                                title={`${cat.label}: ₹${cat.revenue.toLocaleString('en-IN')} (${cat.percentage}%)`}
                              />
                            );
                          })}
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#77716F]">
                          {categoryBreakdown.map((cat, idx) => {
                            const dotColors = [
                              'bg-[#B49A6C]',
                              'bg-[#292624]',
                              'bg-[#A783A2]',
                              'bg-[#3B5432]',
                              'bg-[#8F3B30]',
                            ];
                            return (
                              <div key={cat.category} className="flex items-center space-x-1.5">
                                <span className={`w-2 h-2 rounded-full ${dotColors[idx % dotColors.length]}`} />
                                <span className="font-medium text-[#292624] capitalize">{cat.label}</span>
                                <span className="font-mono text-[10.5px]">({cat.percentage}%)</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })()}

              {/* Category Filter Pills */}
              <div className=\"flex flex-wrap items-center gap-1.5\">"""

if target in content:
    content = content.replace(target, chart_snippet, 1)
    with open('src/components/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added Visual Sales Chart Panel to Best Sellers successfully!")
else:
    print("Error: target not found")
