// Supabase Edge Function: send-transactional-email
// Authoritative backend transactional email dispatcher for Rass by Riddhima
// Secrets required: RESEND_API_KEY (stored securely in Supabase backend secrets)

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Rate limiter storage: IP -> Array of timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (rateLimitMap.get(clientIp) || []).filter((t) => t > windowStart);
  
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  timestamps.push(now);
  rateLimitMap.set(clientIp, timestamps);
  return true;
}

export type EmailEventType =
  | 'order_confirmation'
  | 'order_status_update'
  | 'order_tracking_update'
  | 'order_cancellation'
  | 'newsletter_welcome'
  | 'contact_inquiry'
  | 'admin_alert';

export interface EmailPayload {
  eventType: EmailEventType;
  to: string;
  customerName?: string;
  orderId?: string;
  order?: any;
  reason?: string;
  inquiry?: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  };
  adminToken?: string;
}

function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatCurrency(amount: number): string {
  return '₹' + (amount || 0).toLocaleString('en-IN');
}

function wrapTemplate(contentHtml: string, supportEmail = 'Rassbyridhima@gmail.com'): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rass by Riddhima</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F6F4EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #22201E; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F6F4EE; padding: 36px 16px;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #EAE5DC; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
              <tr>
                <td align="center" style="padding: 38px 24px 28px; border-bottom: 1px solid #F0ECE4; text-align: center; background-color: #FFFFFF;">
                  <div style="font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 32px; font-weight: 500; letter-spacing: 0.32em; color: #1F1D1B; text-transform: uppercase; line-height: 1; margin: 0 0 8px 0;">
                    R A S S
                  </div>
                  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.36em; color: #8C867E; text-transform: uppercase; line-height: 1; margin: 0;">
                    BY RIDDHIMA
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 34px 30px; background-color: #FFFFFF;">
                  ${contentHtml}
                </td>
              </tr>
              <tr>
                <td style="background-color: #FAF9F6; border-top: 1px solid #F0ECE4; padding: 24px 30px; text-align: center;">
                  <p style="margin: 0 0 6px 0; font-size: 12px; color: #6B655D;">
                    Need help? Reach us at <a href="mailto:${supportEmail}" style="color: #22201E; text-decoration: underline;">${supportEmail}</a>
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #9E978E;">
                    &copy; ${new Date().getFullYear()} Rass by Riddhima &bull; Handcrafted Fine Jewellery
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function buildOrderSummaryTable(order: any): string {
  const items = order.itemSnapshots || [];
  if (!items.length) {
    return `
      <div style="border-top: 1px solid #F0ECE4; padding-top: 14px; margin-top: 20px;">
        <table style="width: 100%;">
          <tr>
            <td style="font-size: 14px; color: #22201E; font-weight: 600;">Total</td>
            <td style="font-size: 15px; color: #22201E; font-weight: 700; text-align: right;">${formatCurrency(order.total)}</td>
          </tr>
        </table>
      </div>
    `;
  }

  const itemRows = items.map((item: any) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #F4F1EA; vertical-align: top;">
        <div style="font-weight: 600; font-size: 13.5px; color: #22201E;">${escapeHtml(item.productTitle)}</div>
        <div style="font-size: 12px; color: #78736B; margin-top: 3px;">Qty: ${item.quantity} ${item.variantName ? `&bull; ${escapeHtml(item.variantName)}` : ''}</div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #F4F1EA; text-align: right; vertical-align: top; font-size: 13.5px; font-weight: 600; color: #22201E;">
        ${formatCurrency(item.lineSubtotal || item.unitPrice * item.quantity)}
      </td>
    </tr>
  `).join('');

  return `
    <div style="border-top: 1px solid #F0ECE4; margin-top: 24px; padding-top: 18px;">
      <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #8A847C; margin-bottom: 10px;">
        Order Summary
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        ${itemRows}
      </table>
      <table style="width: 100%; margin-top: 14px; font-size: 13px;">
        <tr>
          <td style="color: #6B655D; padding: 3px 0;">Subtotal:</td>
          <td style="color: #22201E; text-align: right;">${formatCurrency(order.subtotal)}</td>
        </tr>
        ${order.discount ? `
          <tr>
            <td style="color: #2E683E; padding: 3px 0;">Discount (${escapeHtml(order.appliedCoupon || 'Applied')}):</td>
            <td style="color: #2E683E; text-align: right;">-${formatCurrency(order.discount)}</td>
          </tr>
        ` : ''}
        <tr>
          <td style="color: #6B655D; padding: 3px 0;">Shipping:</td>
          <td style="color: #22201E; text-align: right;">${order.shippingFee === 0 ? 'Complimentary' : formatCurrency(order.shippingFee)}</td>
        </tr>
        <tr style="border-top: 1px solid #22201E;">
          <td style="font-size: 14px; font-weight: 700; color: #22201E; padding-top: 10px;">Total:</td>
          <td style="font-size: 16px; font-weight: 700; color: #22201E; text-align: right; padding-top: 10px;">${formatCurrency(order.total)}</td>
        </tr>
      </table>
    </div>
  `;
}

export async function handleTransactionalEmail(req: Request): Promise<Response> {
  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 2. Rate Limiting Check
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-client';
  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Too many email requests. Please try again later.' }),
      {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  // 3. Parse and Validate Request Payload
  let body: EmailPayload;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Malformed JSON payload' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { eventType, to, customerName, orderId, order, reason, inquiry, adminToken } = body;

  const ALLOWED_EVENTS: EmailEventType[] = [
    'order_confirmation',
    'order_status_update',
    'order_tracking_update',
    'order_cancellation',
    'newsletter_welcome',
    'contact_inquiry',
    'admin_alert',
  ];

  if (!eventType || !ALLOWED_EVENTS.includes(eventType)) {
    return new Response(
      JSON.stringify({ success: false, error: `Invalid or unsupported eventType: "${eventType}"` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (!to || !isValidEmail(to)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Valid recipient email address is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // 4. Validate Specific Event Authorizations & Payloads
  if (eventType === 'order_status_update' || eventType === 'order_tracking_update') {
    // Admin or system triggered status change
    if (adminToken !== undefined && adminToken !== 'RassAdmin2026!') {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: Invalid admin credentials for order status update' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  if (eventType === 'order_confirmation' || eventType === 'order_cancellation') {
    if (!orderId && (!order || !order.id)) {
      return new Response(
        JSON.stringify({ success: false, error: 'orderId or order details required for order events' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  // 5. Build Email Content Based on Validated Event
  let subject = '';
  let html = '';
  const supportEmail = 'Rassbyridhima@gmail.com';
  const sandboxOwnerEmail = 'rassbyridhima1@gmail.com';

  switch (eventType) {
    case 'order_confirmation': {
      const activeOrder = order || { id: orderId, total: 0, customerName: customerName || 'Valued Customer' };
      subject = `Order Confirmation #${activeOrder.id} — Rass by Riddhima`;
      html = wrapTemplate(`
        <div style="text-align: center; margin-bottom: 22px;">
          <span style="display: inline-block; background-color: #EFF5F0; color: #2E683E; font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px;">
            ORDER CONFIRMED
          </span>
        </div>
        <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: 500; color: #22201E; margin: 0 0 14px 0; text-align: center;">
          Thank You for Your Order
        </h2>
        <p style="font-size: 14px; line-height: 1.65; color: #55504A; margin: 0 0 20px 0;">
          Hi ${escapeHtml(activeOrder.customerName || customerName)}, we have received your order <strong>#${escapeHtml(activeOrder.id)}</strong>. Our team is now preparing it with care, and we will email you once it ships.
        </p>
        ${buildOrderSummaryTable(activeOrder)}
      `, supportEmail);
      break;
    }

    case 'order_status_update':
    case 'order_tracking_update': {
      const activeOrder = order || { id: orderId, status: 'Processing', customerName: customerName || 'Valued Customer' };
      const statusTitle = activeOrder.status === 'Shipped' ? 'Your Order Has Shipped' : `Order Update: ${activeOrder.status}`;
      subject = `${statusTitle} (#${activeOrder.id}) — Rass by Riddhima`;
      html = wrapTemplate(`
        <div style="text-align: center; margin-bottom: 22px;">
          <span style="display: inline-block; background-color: #FAF4EA; color: #8C6D34; font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px;">
            ORDER ${escapeHtml((activeOrder.status || 'UPDATE').toUpperCase())}
          </span>
        </div>
        <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: 500; color: #22201E; margin: 0 0 14px 0; text-align: center;">
          ${statusTitle}
        </h2>
        <p style="font-size: 14px; line-height: 1.65; color: #55504A; margin: 0 0 20px 0;">
          Hi ${escapeHtml(activeOrder.customerName || customerName)}, your order <strong>#${escapeHtml(activeOrder.id)}</strong> is currently <strong>${escapeHtml(activeOrder.status)}</strong>.
        </p>
        ${activeOrder.awbNumber ? `
          <div style="background-color: #FAF9F6; border: 1px solid #ECE7DE; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Courier:</strong> ${escapeHtml(activeOrder.courierPartner || 'Express')}</p>
            <p style="margin: 0; font-size: 13px;"><strong>AWB:</strong> ${escapeHtml(activeOrder.awbNumber)}</p>
          </div>
        ` : ''}
        ${buildOrderSummaryTable(activeOrder)}
      `, supportEmail);
      break;
    }

    case 'order_cancellation': {
      const activeOrder = order || { id: orderId, total: 0, customerName: customerName || 'Valued Customer' };
      subject = `Order #${activeOrder.id} Cancelled — Rass by Riddhima`;
      html = wrapTemplate(`
        <div style="text-align: center; margin-bottom: 22px;">
          <span style="display: inline-block; background-color: #FDF2F2; color: #9B2C2C; font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px;">
            ORDER CANCELLED
          </span>
        </div>
        <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: 500; color: #22201E; margin: 0 0 14px 0; text-align: center;">
          Order Cancellation
        </h2>
        <p style="font-size: 14px; line-height: 1.65; color: #55504A; margin: 0 0 18px 0;">
          Hi ${escapeHtml(activeOrder.customerName || customerName)}, your order <strong>#${escapeHtml(activeOrder.id)}</strong> has been cancelled.
        </p>
        <div style="background-color: #FDF2F2; border: 1px solid #F8D7DA; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
          <p style="margin: 0 0 6px 0; font-size: 13px; color: #9B2C2C;"><strong>Reason:</strong> ${escapeHtml(reason || 'Cancelled upon customer request')}</p>
          <p style="margin: 0; font-size: 13px; color: #721C24;"><strong>Refund:</strong> ${formatCurrency(activeOrder.total)} has been initiated to your original payment method.</p>
        </div>
        ${buildOrderSummaryTable(activeOrder)}
      `, supportEmail);
      break;
    }

    case 'newsletter_welcome': {
      subject = 'Welcome! Here is 10% off your first order — Rass by Riddhima';
      html = wrapTemplate(`
        <div style="text-align: center; margin-bottom: 22px;">
          <span style="display: inline-block; background-color: #FAF4EA; color: #8C6D34; font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px;">
            WELCOME OFFER
          </span>
        </div>
        <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: 500; color: #22201E; margin: 0 0 14px 0; text-align: center;">
          Welcome to Rass by Riddhima
        </h2>
        <p style="font-size: 14px; line-height: 1.65; color: #55504A; margin: 0 0 20px 0; text-align: center;">
          Thank you for joining our community. As a welcome gift, enjoy 10% off your first jewellery order:
        </p>
        <div style="background-color: #FAF9F6; border: 1px dashed #D6D0C5; border-radius: 8px; padding: 22px; text-align: center; margin: 20px 0;">
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #8A847C; margin-bottom: 8px;">Discount Code</div>
          <div style="display: inline-block; background-color: #22201E; color: #FAF9F6; font-size: 17px; letter-spacing: 0.22em; font-family: monospace; font-weight: 700; padding: 10px 24px; border-radius: 4px;">
            WELCOME10
          </div>
          <div style="font-size: 12px; color: #78736B; margin-top: 10px;">Apply at checkout on any order above ₹15,000</div>
        </div>
      `, supportEmail);
      break;
    }

    case 'contact_inquiry': {
      const inq = inquiry || { name: customerName || 'Customer', email: to, message: '' };
      subject = 'We received your message — Rass by Riddhima';
      html = wrapTemplate(`
        <div style="text-align: center; margin-bottom: 22px;">
          <span style="display: inline-block; background-color: #FAF4EA; color: #8C6D34; font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px;">
            MESSAGE RECEIVED
          </span>
        </div>
        <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: 500; color: #22201E; margin: 0 0 14px 0; text-align: center;">
          We Received Your Message
        </h2>
        <p style="font-size: 14px; line-height: 1.65; color: #55504A; margin: 0 0 20px 0;">
          Hi ${escapeHtml(inq.name)}, thank you for contacting us. A member of our team will review your inquiry and get back to you within 24 working hours.
        </p>
        <div style="background-color: #FAF9F6; border: 1px solid #ECE7DE; border-radius: 8px; padding: 18px 20px; margin: 20px 0;">
          <p style="margin: 0 0 6px 0; font-size: 12px; color: #8A847C;"><strong>Subject:</strong> ${escapeHtml(inq.subject || 'General Inquiry')}</p>
          <p style="margin: 0; font-size: 13px; color: #332F2B; line-height: 1.5; font-style: italic;">"${escapeHtml(inq.message)}"</p>
        </div>
      `, supportEmail);
      break;
    }

    default:
      return new Response(JSON.stringify({ success: false, error: 'Unhandled event' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
  }

  // 6. Resend Dispatch (Secure Backend Only)
  const g = globalThis as any;
  const resendApiKey =
    (typeof Deno !== 'undefined' && Deno.env?.get('RESEND_API_KEY')) ||
    (typeof g.process !== 'undefined' && g.process.env?.RESEND_API_KEY) ||
    '';

  if (!resendApiKey) {
    // In environments without configured secrets, fail safely without crashing
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Email service configuration incomplete: backend secret is missing.',
      }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Sender configuration
  const defaultSender = 'Rass by Riddhima <onboarding@resend.dev>';
  let targetRecipients = [to];
  let targetSubject = subject;

  // Sandbox routing protection
  if (defaultSender.includes('onboarding@resend.dev') && to.toLowerCase() !== sandboxOwnerEmail.toLowerCase()) {
    targetRecipients = [sandboxOwnerEmail];
    targetSubject = `[Test • For ${to}] ${subject}`;
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: defaultSender,
        to: targetRecipients,
        subject: targetSubject,
        html,
      }),
    });

    const resData = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      // Sanitize external provider error to ensure zero API keys or secrets leak
      return new Response(
        JSON.stringify({
          success: false,
          error: 'External email gateway rejection',
          details: resData.message || 'Transmission failed',
        }),
        {
          status: resendResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: resData.id,
        recipient: targetRecipients.join(', '),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Network failure communicating with email service provider',
      }),
      {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

// Deno Runtime entrypoint
if (typeof Deno !== 'undefined' && (Deno as any).serve) {
  (Deno as any).serve(handleTransactionalEmail);
}
