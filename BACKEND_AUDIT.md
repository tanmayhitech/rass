# Backend & Business Management System Audit — Rass by Riddhima

**Audit Date:** October 19, 2026  
**Auditor:** Antigravity AI Engineering  
**Target Repository:** `c:\Users\Acer\OneDrive\Desktop\rass`  
**Current Tech Stack:** React 18, Vite 5.4, TypeScript 5.5, Tailwind CSS 3.4, Lucide React, Canvas-Confetti.

---

## 1. Executive Summary

Rass by Riddhima is a luxury demi-fine and heirloom jewellery e-commerce boutique. The client-side storefront showcases high visual fidelity, custom branding (warm ivory `#FAF8F5`, dusty mauve `#A783A2`, muted sage `#C8D4C1`, antique gold `#B49A6C`), interactive catalog browsing, and cart/checkout drawers.

However, all backend, catalog, inventory, order, coupon, and financial operations are currently **mocked on the client side**:
- Products are statically embedded in `src/data/products.ts`.
- Cart and orders are written to browser `localStorage`.
- Payment is simulated via `setTimeout` in `CheckoutModal.tsx` without cryptographic signature verification.
- Coupons are hardcoded in `CartDrawer.tsx` without server-side validation or redemption tracking.
- Admin dashboard (`AdminDashboard.tsx`) provides only rudimentary read/write capabilities (simple stock boolean toggle and status dropdown) with no inventory movement logs, no order ledger, no PDF generation, and no analytics.

This audit establishes the baseline gaps and specifies the production architecture required to turn the boutique into a secure, scalable e-commerce business management system.

---

## 2. Codebase & Architectural Gaps Analysis

| Domain | Current Implementation | Production Requirement | Priority |
| :--- | :--- | :--- | :--- |
| **Database & Schema** | In-memory JS array (`PRODUCTS`) & browser `localStorage` (`rass_orders`). | Normalized PostgreSQL on Supabase with migrations, foreign keys, indexes, and immutable snapshots. | Critical |
| **Authentication & RLS** | Unprotected client-side view switch (`activePage === 'admin'`). | Supabase Auth with Row Level Security (RLS), admin role verification, and audit logging. | Critical |
| **Product Management** | 8 static products in `products.ts`. No CRUD or image upload. | Full Product CRUD, slug generation, SKU validation, multi-variant pricing, image ordering/optimization, and safe archiving. | High |
| **Inventory & Stock** | Binary `inStock: boolean` field with no quantities or thresholds. | Variant-level available/reserved stock, low-stock threshold, atomic stock deductions, and ledger of movements (receipt, sale, return, adjustment). | Critical |
| **Order Management** | Flat client object created with random ID and client-declared status. | Documented order lifecycle (`pending_payment` → `paid` → `processing` → `shipped` → `delivered`), customer records, and address normalization. | Critical |
| **Payment Verification** | Client-only simulation with `setTimeout`. No gateway integration. | Server-side Razorpay order creation, HMAC-SHA256 signature verification, webhook handler, and idempotent transaction ledger. | Critical |
| **PDF Documents** | None. | Client-side/serverless generation of branded GST/Retail Invoices, Packing Slips, and Courier Shipping Labels. | High |
| **Coupons & Discounts** | Hardcoded client string comparisons (`RASS20`, `WELCOME10`). | Dynamic database-backed coupon rules, start/expiry dates, min spend, max discount, per-customer & global usage limits, and atomic redemption. | High |
| **Product Analytics** | Flat sum of order totals. No historical metrics. | Performance dashboard: units sold, gross/net revenue per product, slow-moving items, and category revenue ranking. | Medium |
| **Live Revenue & Ledger** | 3 simple summary cards. No ledger or export. | Realtime KPI cards (Gross Sales, Net Sales, Refunds, AOV, Low Stock alerts), double-entry order ledger, and CSV export. | High |

---

## 3. Module-by-Module Technical Audit

### Module 1: Product Management
- **Current State:** `src/types/index.ts` defines `Product` with 17 fields. Images point to static files in `public/images/`.
- **Gaps:**
  - No slug field or URL routing support.
  - No SKU (Stock Keeping Unit) uniqueness enforcement.
  - Missing variant structure (e.g. Ring size 10/12/14, Kangna size 2.4/2.6/2.8, Metal vermeil vs solid).
  - No publish lifecycle (`draft`, `published`, `archived`, `deactivated`).
  - Archiving does not safeguard historical orders; if a product were deleted, previous orders would break.
- **Remediation:**
  - Create Supabase `products`, `product_variants`, and `product_images` tables.
  - Implement soft delete / archiving (`archived_at`, `status = 'archived'`).
  - Foreign key on order items must store immutable product snapshots (`product_title_at_purchase`, `sku_at_purchase`, `unit_price_at_purchase`).

### Module 2: Inventory & Stock Management
- **Current State:** Only `inStock: boolean`.
- **Gaps:**
  - Overselling cannot be prevented.
  - Concurrent checkout requests can deplete stock without race protection.
  - No visibility into reserved stock during pending checkout sessions.
  - No record of who adjusted stock or why (damaged, restocked, audit variance).
- **Remediation:**
  - Add `inventory_items` tracking `quantity_on_hand`, `quantity_reserved`, `low_stock_threshold`.
  - Add `inventory_movements` ledger with `movement_type` (`purchase_receipt`, `order_reservation`, `order_deduction`, `order_cancellation_restock`, `manual_adjustment`), delta quantities, reference IDs, and user audit stamps.
  - Atomic database transactions with row-locking (`SELECT ... FOR UPDATE`) or PostgreSQL stored procedures (`reserve_inventory_atomic`).

### Module 3: Order Management
- **Current State:** Client generates an order with `id: RASS-ORD-XXXXXX` and commits directly to `localStorage`.
- **Gaps:**
  - Orders can be fabricated by any client request.
  - No separate fulfilment status vs payment status.
  - Customer contact records are denormalized and duplicated on every order.
  - No search or date-range filtering.
- **Remediation:**
  - Create `orders`, `order_items`, and `customers` tables.
  - Strict order state machine:
    - Payment Status: `pending`, `authorized`, `captured`, `failed`, `refunded`, `partially_refunded`.
    - Fulfilment Status: `unfulfilled`, `partially_fulfilled`, `fulfilled`, `cancelled`, `returned`.
  - Normalized customer relationship linking guest checkouts by verified phone/email.

### Module 4: Receipts, Invoices and Courier Documents
- **Current State:** Simple on-screen confirmation card; no downloadable documents.
- **Gaps:**
  - Inability for business owner or customer to download official PDF invoices.
  - No packing slip generation for warehouse/artisan packaging.
  - No courier AWB/tracking integration.
- **Remediation:**
  - Build automated PDF generation using `jspdf` and `jspdf-autotable` (or headless serverless rendering) styled with the Rass luxury brand header, order summary, item breakdown, and compliance disclaimer.
  - Packing slip generator optimized for thermal/standard printing.
  - Structured Shiprocket/courier metadata schema (AWB, courier partner, tracking URL, label generation).

### Module 5: Coupons and Discounts
- **Current State:** Static `if (formatted === 'RASS20')` inside `CartDrawer.tsx`.
- **Gaps:**
  - No limit on redemptions.
  - No expiry date check.
  - Any user can reuse coupons infinitely.
  - Coupons cannot be targeted to specific categories or minimum cart values safely.
- **Remediation:**
  - Create `coupons` table with `code`, `discount_type` (`percentage` | `fixed`), `discount_value`, `min_order_value`, `max_discount_cap`, `start_date`, `expiry_date`, `max_uses`, `max_uses_per_customer`, `is_active`.
  - Create `coupon_redemptions` table tracking `coupon_id`, `order_id`, `customer_id`, `redeemed_at`.
  - Server-side validation endpoint/function.

### Module 6 & 7: Product Performance & Live Revenue Analytics
- **Current State:** 3 flat metrics in `AdminDashboard.tsx` (`totalRevenue`, `orders.length`, `products.length`).
- **Gaps:**
  - Gross sales vs Net sales confusion.
  - Discounts and refunds are not subtracted from net sales.
  - No time-series aggregation (daily, weekly, monthly).
  - No category performance or best-selling SKU ranking.
- **Remediation:**
  - Mathematical formulas codified in database views / RPC functions:
    - $\text{Gross Sales} = \sum (\text{item\_price} \times \text{quantity})$
    - $\text{Net Sales} = \text{Gross Sales} - \text{Discounts} - \text{Refunds} + \text{Taxes}$ (excluding shipping where treated as pass-through).
    - $\text{Average Order Value (AOV)} = \frac{\text{Net Sales}}{\text{Total Completed Orders}}$
  - Real-time KPI queries with configurable date filters (Today, Last 7 Days, Last 30 Days, All Time).

### Module 8: Order Ledger
- **Current State:** Simple HTML table with 8 columns.
- **Gaps:**
  - No financial ledger breakdown (Subtotal, Discount, Shipping, Tax, Total, Net).
  - No export to CSV/Excel for accounting.
  - No audit log of order edits or status updates.
- **Remediation:**
  - Dedicated Order Ledger view with granular financial columns, search by customer/order, date filters, and one-click CSV export.

### Module 9: Database & Security
- **Current State:** No backend API or database connection.
- **Gaps:**
  - Missing environment configuration and Supabase integration.
  - No RLS policies or role controls.
  - Secrets safety must be guaranteed (Razorpay Key Secret and Resend API keys must never be exposed to the browser).
- **Remediation:**
  - Supabase client initialization with graceful offline mock fallback for local dev.
  - Strict RLS policies restricting write access to `admin` role.
  - Serverless function architecture (`/api/razorpay/create-order`, `/api/razorpay/verify-payment`, `/api/orders/create`) keeping private secrets secure.

### Module 10: Admin Interface
- **Current State:** Basic 2-section view.
- **Gaps:**
  - Lacks dedicated navigation for Catalog, Inventory, Orders, Invoices, Coupons, Analytics, and Ledger.
  - Missing modal editors for creating/updating products, adjusting stock, generating PDFs, and managing coupons.
- **Remediation:**
  - Build a comprehensive, cohesive, luxury Admin Dashboard matching the Rass design system (`#FAF8F5`, `#A783A2`, `#C8D4C1`, `#292624`, `#E7E0DA`).

---

## 4. Immediate Action Plan

1. **Phase 1 Output:** Finalize this `BACKEND_AUDIT.md`.
2. **Phase 2:** Produce comprehensive Database Schema, Security Model, and Financial Reporting Formulas document (`DATABASE_SCHEMA.md`).
3. **Phase 3:** Author version-controlled SQL migrations in `supabase/migrations/` and set up the Supabase client service with local fallback.
4. **Phase 4:** Build Product & Inventory Management services and UI controllers.
5. **Phase 5:** Build Order Management, Razorpay checkout verification, and order lifecycle engine.
6. **Phase 6:** Implement PDF generator (Invoices, Packing Slips, Courier Documents) and Coupon engine.
7. **Phase 7:** Implement Analytics Dashboard, Live Revenue KPIs, and Order Ledger with CSV export.
8. **Phase 8:** Test build, lint, edge cases, and end-to-end flows.
