with open('src/components/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Clean up top header: Consolidate Database Health & Test Mail to be sleek and professional
old_header_tools = """            {/* Supabase Database Diagnostics Trigger */}
            <button
              onClick={() => setIsDiagnosticsOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-xs font-medium text-emerald-800 cursor-pointer transition-colors shadow-xs"
              title="Inspect live PostgreSQL database, Row Level Security, and stored procedures"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="hidden md:inline font-medium">Database Health</span>
              <span className="md:hidden">DB</span>
              <Database className="w-3.5 h-3.5 text-emerald-700" />
            </button>

            {/* Resend Email Integration Trigger */}
            <button
              onClick={handleSendTestEmail}
              disabled={isSendingTestMail}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-xs font-medium text-purple-800 cursor-pointer transition-colors shadow-xs disabled:opacity-50"
              title="Send a live test order status update email via Resend to verify configuration"
            >
              <Mail className="w-3.5 h-3.5 text-purple-700" />
              <span className="hidden md:inline font-medium">
                {isSendingTestMail ? 'Sending...' : 'Test Resend Mail'}
              </span>
              <span className="md:hidden">Mail</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            </button>"""

new_header_tools = """            {/* Sleek System Health & Diagnostic Quick Triggers */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#E7E0DA]">
              <button
                onClick={() => setIsDiagnosticsOpen(true)}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg hover:bg-white text-[11px] font-medium text-[#77716F] hover:text-[#292624] cursor-pointer transition-all shadow-2xs"
                title="PostgreSQL database diagnostics & RLS status"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>DB Online</span>
              </button>

              <button
                onClick={handleSendTestEmail}
                disabled={isSendingTestMail}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg hover:bg-white text-[11px] font-medium text-[#77716F] hover:text-[#292624] cursor-pointer transition-all shadow-2xs disabled:opacity-40"
                title="Send test status email via Resend"
              >
                <Mail className="w-3 h-3 text-[#A783A2]" />
                <span>{isSendingTestMail ? 'Sending...' : 'Mail Test'}</span>
              </button>
            </div>"""

if old_header_tools in content:
    content = content.replace(old_header_tools, new_header_tools)
    print("Cleaned up top header tools")
else:
    print("Warning: old_header_tools not found")

with open('src/components/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied top header cleanup!")
