# Changelog — Rass by Riddhima Backend & Business Management System

All notable changes to the backend, admin management system, database, and operations will be documented in this file.

---

## [Phase 8: Security Testing, Concurrency & Production Readiness] — 2026-10-19
### Added
- Created `src/tests/backend-verification.ts` verifying all 6 key operational modules:
  - Product CRUD & unique SKU collisions.
  - Variant inventory movements, atomic reservation, and negative stock prevention.
  - Server-side coupon verification (min spend, expiry, max caps).
  - Order creation, immutable snapshots, atomic stock deduction, and cancellation restock.
  - Financial reporting formulas (Gross, Net, AOV) and CSV ledger generation.
  - PDF Invoices and Packing Slip document rendering.
- Added `npm test` script to `package.json`.
- Verified production build (`vite build`) and TypeScript typecheck (`tsc`) with 0 errors.

## [Phase 7: Analytics Dashboard & Order Ledger] — 2026-10-19
### Added
- Created `src/services/analyticsService.ts` codifying financial reporting formulas.
- Redesigned `AdminDashboard.tsx` with 7 dedicated luxury operational tabs:
  - Live Overview (8 KPI cards: Gross Sales, Net Sales, Paid Inflow, AOV, Refunds, Discounts, Pending, Low Stock alerts).
  - Product Sales Velocity & Rankings table.
  - Category Net Sales contribution analysis with visual progress bars.
  - Double-entry accounting Order Ledger table with one-click `.csv` export.

## [Phase 6: PDF Generation, Courier Integration & Coupons] — 2026-10-19
### Added
- Created `src/services/pdfService.ts` using `jspdf` to generate:
  - Luxury branded Retail/Tax Invoices (`INV-YYYY-XXXXX`) with full order details, customer info, price breakdowns, and authenticity certificates.
  - Atelier Packing Slips with logistics routing, AWB references, and master karigar QC inspection checklists.
- Created `src/services/couponService.ts` with server-validated promotions (`RASS20`, `WELCOME10`, `HEIRLOOM5000`), minimum order spend, discount caps, global limits, and per-customer usage counters.
- Integrated coupon validation and invoice download into `CheckoutModal.tsx` and `CartDrawer.tsx`.

## [Phase 5: Order Processing & Payment Verification] — 2026-10-19
### Added
- Created `src/services/orderService.ts` with full order lifecycle state transitions:
  - Payment statuses: `pending`, `authorized`, `captured`, `failed`, `refunded`.
  - Fulfilment statuses: `unfulfilled`, `processing`, `ready_to_ship`, `shipped`, `delivered`, `cancelled`.
  - Immutable historical snapshots (`OrderItemSnapshot`) capturing exact purchase prices and SKUs.
  - Courier partner assignment and Air Waybill (AWB) tracking updates.
  - Atomic stock deductions on payment capture and automatic restocking on cancellation.

## [Phase 4: Product & Inventory Management] — 2026-10-19
### Added
- Created `src/services/storeService.ts` implementing:
  - Complete product CRUD, slug generation, and SKU collision validation.
  - Variant-level inventory tracking (`quantity_on_hand`, `quantity_reserved`, `low_stock_threshold`).
  - Immutable double-entry `inventory_movements` ledger logging purchase receipts, order deductions, returns, and audited adjustments with mandatory reasons.
  - Retail and cost stock valuation metrics.
  - Safe product deletion guard preventing deletion of designs linked to historical orders.

## [Phase 3: Database Migrations & Access Policies] — 2026-10-19

### Added
- Created version-controlled Supabase SQL migrations in `supabase/migrations/`:
  - `20261019000001_initial_schema.sql`: Full normalized tables, constraints, foreign keys, and indexes.
  - `20261019000002_rls_policies.sql`: Row Level Security policies with admin role checks and public storefront boundaries.
  - `20261019000003_seed_data.sql`: Seed data for categories, products, variants, initial inventory, and coupons.
  - `20261019000004_atomic_functions.sql`: Stored procedures for atomic stock reservation, deduction, release, and server-side coupon validation.
- Created `src/lib/supabase.ts` with client initialization and environment detection.
- Expanded `src/types/index.ts` with comprehensive models for Products, Variants, Inventory, Orders, Snapshots, Coupons, Analytics, and Shipments.

## [Phase 2: Database Schema, Security Model & Reporting Formulas] — 2026-10-19

### Added
- Created `DATABASE_SCHEMA.md` with:
  - 14 normalized PostgreSQL tables: `categories`, `products`, `product_variants`, `product_images`, `inventory_items`, `inventory_movements`, `customers`, `customer_addresses`, `orders`, `order_items`, `payment_transactions`, `refunds`, `coupons`, `coupon_redemptions`, `shipments`, `webhook_events`, and `audit_logs`.
  - Comprehensive Row Level Security (RLS) policies defining access boundaries for anonymous shoppers, authenticated patrons, and store administrators.
  - Precise mathematical definitions for financial reporting: Gross Merchandise Sales, Applied Discounts, Returns/Refunds, Net Sales, Average Order Value (AOV), and Inflow.

## [Phase 1: Codebase Audit & Architectural Gap Analysis] — 2026-10-19

### Added
- Created `BACKEND_AUDIT.md` providing an in-depth audit across all 10 target business modules:
  - Product Catalog CRUD & safe archiving.
  - Variant-level inventory, stock movements, and concurrency protection.
  - Normalized order lifecycle, customer tracking, and address normalization.
  - Downloadable branded Invoices, Packing Slips, and Courier shipping manifests.
  - Server-validated Coupons & Discounts with usage limits and expiry tracking.
  - Product Performance analytics and Net Sales reporting metrics.
  - Double-entry Order Ledger with CSV export.
  - Supabase PostgreSQL schema, RLS policies, and serverless payment verification.
  - Cohesive luxury Admin Management UI matching the Rass design system.
- Initialized `CHANGELOG.md` to maintain traceability across all implementation phases.
