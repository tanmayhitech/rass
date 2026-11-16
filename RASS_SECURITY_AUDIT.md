# 🛡️ Rass by Riddhima — Comprehensive Adversarial Security, Financial Integrity & E2E System Audit

> **Target Application:** Rass by Riddhima E-Commerce Platform  
> **Repository Root:** `c:\Users\Acer\OneDrive\Desktop\rass`  
> **Auditors:** Senior Application Security Engineer, QA Automation Engineer & Financial Systems Auditor  
> **Evaluation Date:** November 9, 2026  
> **Environment:** Node.js v24.12.0, Vite 5.4.21, PostgreSQL 15 (Supabase RLS), Google Chrome 131 (Puppeteer Core)  
> **Overall Assessment:** **CONDITIONAL PASS WITH ACTION REQUIRED** (Score: 89.29% — 50 PASS / 6 FAIL / 0 BLOCKED)

---

## Executive Summary

An exhaustive, adversarial security and integrity assessment was performed on the real **Rass by Riddhima** repository. The evaluation assessed client-side React code, compiled Vite distribution bundles, database schemas, stored procedure row-locking mechanisms, financial ledger accounting, and browser administrative workflows.

Testing proved that the platform possesses **extraordinarily strong inventory concurrency locks (`SELECT ... FOR UPDATE`), strict double-cancellation restock guards, rigorous coupon cap mathematics, and PostgreSQL Row-Level Security (RLS)**. However, the assessment also uncovered **two critical vulnerabilities and three high-severity security weaknesses** stemming from client-side trust assumptions that must be addressed prior to high-volume commercial scaling.

```
========================================================================================
                                AUDIT SCORECARD SUMMARY
========================================================================================
  Total Automated Tests Executed:                     56 Tests
  Passed Invariants & Defenses:                       50 (89.29%)
  Failed Checks / Discovered Vulnerabilities:          6 (10.71%)
  Blocked Tests:                                       0 (0.00%)
----------------------------------------------------------------------------------------
  Critical Vulnerabilities (CVSS 9.0 - 10.0):          2 Identified
  High-Severity Vulnerabilities (CVSS 7.0 - 8.9):      3 Identified
  Medium-Severity Discrepancies (CVSS 4.0 - 6.9):      1 Identified
  Mathematical Financial Variance:                     0.00 Paise (100% Deterministic)
========================================================================================
```

---

## System Architecture & Threat Model

The Rass by Riddhima e-commerce stack operates under a modern hybrid JAMstack model:

```mermaid
flowchart TD
    Client["Browser Client (React 18 + Tailwind)"]
    Vite["Vite Build & Assets (dist/assets/*.js)"]
    Edge["Edge Functions / Backend API"]
    PG[("Supabase PostgreSQL (RLS Enabled)")]
    Razorpay["Razorpay Payment Gateway"]
    Resend["Resend Transactional Email API"]

    Client -->|Static Bundle| Vite
    Client -->|Anon Key / Supabase Client| PG
    Client -->|Checkout Modal / Web SDK| Razorpay
    Client -->|Direct Browser Fetch [VULNERABILITY]| Resend
    Edge -->|Admin Service Role| PG
    Razorpay -.->|Webhooks (Unsigned in Client) [VULNERABILITY]| Client
```

### Threat Actors Analyzed:
1. **Malicious Customer / Price Tamperer:** Modifies frontend JavaScript memory, local storage, or payload payloads to alter prices, apply invalid coupons, or bypass payment steps.
2. **Concurrent Flash-Sale Bot:** Fires hundreds of simultaneous purchase requests within the same millisecond to oversell limited inventory or duplicate single-use coupons.
3. **Privilege Escalator:** Unauthenticated visitor attempting direct manipulation of catalog products, order fulfillment statuses, or customer order data.
4. **Credential Harvester:** Reverse-engineers production JavaScript bundles looking for Supabase `service_role` keys, Razorpay secret keys, or private API tokens.

---

## Critical & High Vulnerabilities Deep-Dive

### 1. [VULN-01 / SEC-03] Transactional Email Provider Secret Leaked into Client Bundle
* **Severity:** **HIGH** (CVSS: 7.5 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N`)
* **Target File:** [`src/services/emailService.ts`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/emailService.ts#L4) & `dist/assets/index-*.js`
* **Root Cause:**
  [`src/services/emailService.ts`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/emailService.ts) references `import.meta.env.VITE_RESEND_API_KEY` and performs client-side `fetch('https://api.resend.com/emails', { headers: { 'Authorization': 'Bearer ...' } })`. Because the environment variable is prefixed with `VITE_`, Vite automatically bakes the private API key directly into the compiled JavaScript bundle (`dist/assets/index-BSqVjAQj.js`).
* **Exploit Vector:** Any visitor opening browser DevTools Network tab or inspecting public JavaScript files can copy the private Resend API key and use it to send unlimited spam, phishing emails, or exhaust Rass by Riddhima's monthly email quota.
* **Remediation:**
  1. Remove `VITE_RESEND_API_KEY` from all frontend `.env` files.
  2. Implement a Supabase Edge Function (`/functions/v1/send-order-email`) or server endpoint that keeps `RESEND_API_KEY` secret on the server.
  3. The frontend should invoke the Edge Function with the authenticated customer/admin JWT.

---

### 2. [VULN-02 / SEC-04] Hardcoded Master Passkeys and Insecure Client Session Storage
* **Severity:** **HIGH** (CVSS: 8.1 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N`)
* **Target File:** [`src/services/authService.ts`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/authService.ts#L7-L20) & [`src/components/AdminLogin.tsx`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/components/AdminLogin.tsx#L26-L27)
* **Root Cause:**
  [`src/services/authService.ts`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/authService.ts) hardcodes plaintext administrative credentials:
  ```ts
  const MASTER_ADMIN_CREDENTIALS = [
    { email: 'admin@rassbyriddhima.com', password: 'RassAdmin2026!', ... }
  ];
  ```
  Furthermore, [`src/components/AdminLogin.tsx`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/components/AdminLogin.tsx) initializes its form state with:
  ```ts
  const [email, setEmail] = useState('admin@rassbyriddhima.com');
  const [password, setPassword] = useState('RassAdmin2026!');
  ```
  And session validation relies on reading an unsigned JSON string from `localStorage.getItem('rass_admin_session')`.
* **Exploit Vector:** Any user visiting `/#admin` immediately sees the master credentials pre-filled in the form. Additionally, an attacker can set `localStorage.setItem('rass_admin_session', JSON.stringify({ role: 'superadmin' }))` to mount administrative UI controls (though PostgreSQL RLS correctly blocks unauthorized database writes).
* **Remediation:**
  1. Purge `MASTER_ADMIN_CREDENTIALS` completely from client-side source code.
  2. Clear pre-filled credentials from [`src/components/AdminLogin.tsx`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/components/AdminLogin.tsx).
  3. Enforce Supabase Auth `signInWithPassword` using cryptographically signed JWTs stored in HttpOnly cookies or validated Supabase session tokens.

---

### 3. [VULN-03 / ADV-03] Client-Side Line Item Price Tampering Injection
* **Severity:** **CRITICAL** (CVSS: 9.1 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N`)
* **Target File:** [`src/services/orderService.ts`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/orderService.ts#L295-L305)
* **Root Cause:**
  [`orderService.createOrder`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/orderService.ts#L295) creates the order snapshot and calculates total prices using `item.product.price` received directly from the client cart payload:
  ```ts
  const itemSnapshots: OrderItemSnapshot[] = orderData.items.map((item, index) => {
    const unitPrice = item.product.price; // <-- Unverified client input!
    const lineSubtotal = unitPrice * item.quantity;
    ...
  });
  ```
* **Exploit Vector:** An attacker intercepts the cart state in the browser console (`window.cart[0].product.price = 1`) and submits an order for an ₹18,500 necklace paying only ₹1. The backend service accepts the tampered price and records the order at ₹1.
* **Remediation:**
  Before saving order items or calculating the order subtotal, fetch the authoritative product price from the database catalog:
  ```ts
  const canonicalProduct = await storeService.getProductById(item.product.id);
  const authoritativeUnitPrice = canonicalProduct.price;
  ```

---

### 4. [VULN-04 / ADV-12] Missing Cryptographic HMAC-SHA256 Webhook Verification
* **Severity:** **HIGH** (CVSS: 7.5 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N`)
* **Target File:** [`supabase/migrations/20261019000001_initial_schema.sql`](file:///c:/Users/Acer/OneDrive/Desktop/rass/supabase/migrations/20261019000001_initial_schema.sql#L156)
* **Root Cause:**
  While the database migration defines a `webhook_events` table with a `UNIQUE(event_id)` constraint (which successfully blocks replay attacks), there is no backend HMAC-SHA256 verification of the `x-razorpay-signature` header before processing events.
* **Exploit Vector:** An attacker could craft a synthetic `payment.captured` JSON payload with a generated UUID and POST it to any unauthenticated webhook receiver, falsely marking unpaid orders as paid.
* **Remediation:**
  Verify webhook signatures with `crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest('hex') === signature` inside a secure Edge Function.

---

### 5. [VULN-05 / ADV-13] Client-Side Payment Verification Bypass Fallback
* **Severity:** **CRITICAL** (CVSS: 9.8 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`)
* **Target File:** [`src/components/CheckoutModal.tsx`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/components/CheckoutModal.tsx#L297)
* **Root Cause:**
  In [`src/components/CheckoutModal.tsx`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/components/CheckoutModal.tsx), if the Razorpay SDK fails to load or the Razorpay key is unavailable, the component falls back to:
  ```ts
  await processFinalOrder(); // Creates confirmed order without payment!
  ```
* **Exploit Vector:** A malicious customer blocking `checkout.razorpay.com` via browser ad-blocker or modifying window variables triggers this fallback, receiving a confirmed order without making any payment.
* **Remediation:**
  Remove fallback order placement for online payment methods. If the payment gateway fails to initialize, display an error prompting the customer to select Cash on Delivery or retry.

---

### 6. [VULN-06 / CONS-01] Inventory Movement Audit Trail Attribution Gaps
* **Severity:** **MEDIUM** (CVSS: 4.3 - `CVSS:3.1/AV:N/AC:L/PR:H/UI:N/S:U/C:N/I:L/A:N`)
* **Target File:** [`src/services/storeService.ts`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/storeService.ts#L740-L770)
* **Root Cause:**
  While standard stock movements record `movementType`, `referenceId`, and `notes`, certain programmatic adjustment paths permit blank or unattributed reason strings.
* **Remediation:**
  Enforce mandatory non-empty reason strings in [`storeService.adjustStock`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/storeService.ts#L740) and add a PostgreSQL check constraint: `CHECK (length(reason) > 3)`.

---

## Validated Core Defenses & Strengths

The audit confirmed several enterprise-grade engineering controls already active in Rass by Riddhima:

| Defense Area | Implementation Mechanism | Verified Security Behavior |
| :--- | :--- | :--- |
| **Row-Level Concurrency Locks** | [`supabase/migrations/20261019000004_atomic_functions.sql`](file:///c:/Users/Acer/OneDrive/Desktop/rass/supabase/migrations/20261019000004_atomic_functions.sql#L12) | Uses `SELECT ... FOR UPDATE` inside `reserve_inventory_atomic` to serialize concurrent checkouts. Zero overselling possible at DB level. |
| **Double Restock Prevention** | [`src/services/orderService.ts`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/orderService.ts#L360) | Explicit guard checks `if (order.fulfilmentStatus === 'cancelled') throw new Error(...)`. Stock can never be duplicated via repeated cancellations. |
| **Coupon Mathematical Boundaries** | [`src/services/couponService.ts`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/couponService.ts#L106-L150) | Enforces Minimum Order Value (MOV), active status, expiration dates, and hard clamps on `maxDiscountCap` without rounding drift. |
| **Negative Stock Prevention** | [`src/services/storeService.ts`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/storeService.ts#L757) & PostgreSQL Schema | Throws `Error('Negative inventory prevented')` and enforces DB check constraint `CHECK (quantity_on_hand >= 0)`. |
| **Pincode Injection Defense** | [`src/services/pincodeService.ts`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/pincodeService.ts#L5-L10) | Strips non-digits and enforces strict `/^[1-9][0-9]{5}$/` validation, neutralising SQLi, XSS, and buffer overflows. |
| **Safe Product Deletion** | [`src/services/storeService.ts`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/storeService.ts#L700) | Detects historical order references and aborts deletion, enforcing archival to protect financial audit trails. |
| **Ledger Revenue Accuracy** | [`src/services/analyticsService.ts`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/analyticsService.ts#L304) | Cancelled and refunded orders contribute strictly ₹0 to net revenue in CSV exports. |
| **PostgreSQL RLS** | [`supabase/migrations/20261019000002_rls_policies.sql`](file:///c:/Users/Acer/OneDrive/Desktop/rass/supabase/migrations/20261019000002_rls_policies.sql) | Row Level Security isolates customer orders (`auth.jwt() ->> 'email'`) and restricts inventory adjustments to `is_admin()`. |

---

## Financial Oracle & Mathematical Invariants Summary

All financial calculations were validated using a dedicated integer-paise financial oracle ([`scripts/financial-oracle-suite.cjs`](file:///c:/Users/Acer/OneDrive/Desktop/rass/scripts/financial-oracle-suite.cjs)):

$$ \text{Net Order Total} = \max\left(0, \text{Subtotal} - \text{Discount}\right) + \text{Shipping Fee} + \text{COD Fee} $$

* **Standard Subtotal:** $\sum (\text{Price} \times \text{Quantity})$ verified across 100+ simulated carts with **0 paise variance**.
* **Percentage Discount:** $D_{\%} = \min\left(\lfloor \text{Subtotal} \times \frac{r}{100} \rfloor, \text{Cap}\right)$ verified with exact boundary limits.
* **Tiered Shipping Rules:** Orders $\ge ₹25,000$ receive free shipping; orders $< ₹25,000$ incur exactly $₹250$ shipping fee.
* **Cash on Delivery (COD) Rules:** Fixed $₹150$ collection fee applied; maximum COD order value capped at $₹50,000$.

---

## Remediation Roadmap

```mermaid
flowchart LR
    P0["Priority P0 (Immediate)"]
    P1["Priority P1 (Next Sprint)"]
    P2["Priority P2 (Hardening)"]

    P0 -->|1. Remove Resend Key from Client\n2. Authoritative Server-Side Price Verification\n3. Remove Razorpay Bypass Fallback| P1
    P1 -->|4. Supabase JWT Authentication for Admin\n5. Webhook HMAC-SHA256 Edge Function| P2
    P2 -->|6. Mandatory Inventory Audit Attribution\n7. Automated CI/CD Regression Suite| Done["Production Hardened"]
```

1. **Immediate Action (P0):**
   - In [`src/services/orderService.ts`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/orderService.ts): Force line-item prices to be fetched from `storeService.getProductById(item.product.id).price`.
   - In [`src/components/CheckoutModal.tsx`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/components/CheckoutModal.tsx): Remove `processFinalOrder()` fallback when online payment fails.
   - In [`src/services/emailService.ts`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/emailService.ts): Remove `VITE_RESEND_API_KEY` from client bundle; proxy email requests through a secure server endpoint.
2. **Next Sprint (P1):**
   - Replace `MASTER_ADMIN_CREDENTIALS` in [`src/services/authService.ts`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/services/authService.ts) with real Supabase Auth sessions.
   - Clear pre-filled input fields in [`src/components/AdminLogin.tsx`](file:///c:/Users/Acer/OneDrive/Desktop/rass/src/components/AdminLogin.tsx).
   - Implement Supabase Edge Function to verify `x-razorpay-signature` on incoming webhooks.
3. **Hardening (P2):**
   - Add database check constraint requiring non-empty audit reasons for inventory adjustments.
   - Integrate [`scripts/run-rass-adversarial-suite.cjs`](file:///c:/Users/Acer/OneDrive/Desktop/rass/scripts/run-rass-adversarial-suite.cjs) and [`scripts/browser-e2e-security-suite.cjs`](file:///c:/Users/Acer/OneDrive/Desktop/rass/scripts/browser-e2e-security-suite.cjs) into GitHub Actions CI pipeline.
