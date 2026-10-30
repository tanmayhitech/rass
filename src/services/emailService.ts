import { Order } from '../types';

export interface EmailSendResult {
  success: boolean;
  id?: string;
  error?: string;
  recipient?: string;
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

class EmailService {
  private resendApiKey: string = 
    import.meta.env.VITE_RESEND_API_KEY || '';
  
  private defaultSender: string = 
    import.meta.env.VITE_RESEND_FROM_EMAIL || 
    'Rass by Riddhima <onboarding@resend.dev>';
  private supportEmail: string = 'contact@rassbyriddhima.com';
  private sandboxOwnerEmail: string = 'rassbyridhima1@gmail.com';

  /**
   * Dispatches email via local Vite proxy (/api/resend/emails) or direct Resend fallback.
   * In sandbox mode (onboarding@resend.dev), routes testing emails to the registered
   * account owner (rassbyridhima1@gmail.com).
   */
  public async sendEmail(params: SendEmailParams): Promise<EmailSendResult> {
    const rawRecipients = Array.isArray(params.to) ? params.to : [params.to];
    const sender = params.from || this.defaultSender;
    const isSandboxSender = sender.includes('onboarding@resend.dev');

    let targetRecipients = rawRecipients;
    let targetSubject = params.subject;

    if (isSandboxSender && !rawRecipients.every(r => r.toLowerCase() === this.sandboxOwnerEmail.toLowerCase())) {
      targetRecipients = [this.sandboxOwnerEmail];
      targetSubject = `[Test • For ${rawRecipients.join(', ')}] ${params.subject}`;
    }

    const payload = {
      from: sender,
      to: targetRecipients,
      subject: targetSubject,
      html: params.html,
    };

    // 1. Try local Vite proxy endpoint first
    try {
      const proxyRes = await fetch('/api/resend/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.resendApiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (proxyRes.ok) {
        const data = await proxyRes.json();
        console.log(`[EmailService] Email sent (ID: ${data.id}) to:`, targetRecipients);
        return { success: true, id: data.id, recipient: targetRecipients.join(', ') };
      }

      const errorData = await proxyRes.json().catch(() => ({}));
      const errorMsg = errorData.message || `HTTP ${proxyRes.status}`;
      console.warn(`[EmailService] Proxy warning (${errorMsg}). Trying direct fallback...`);
    } catch (err: any) {
      console.warn('[EmailService] Local proxy unreachable, trying direct fallback:', err.message);
    }

    // 2. Direct Resend API fallback
    try {
      const directRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.resendApiKey}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await directRes.json();
      if (!directRes.ok) {
        console.warn('[EmailService] Resend API error:', data);
        return { success: false, error: data.message || 'Failed to dispatch email' };
      }

      console.log(`[EmailService] Direct email sent (ID: ${data.id}) to:`, targetRecipients);
      return { success: true, id: data.id, recipient: targetRecipients.join(', ') };
    } catch (err: any) {
      console.error('[EmailService] Failed to send email via Resend:', err);
      return { success: false, error: err.message };
    }
  }

  // =========================================================================
  // 1. ORDER STATUS UPDATE NOTIFICATIONS
  // =========================================================================

  public async sendOrderStatusUpdateEmail(order: Order): Promise<EmailSendResult> {
    if (!order.email) {
      return { success: false, error: 'No customer email provided' };
    }

    let statusBadgeText = `ORDER ${order.status.toUpperCase()}`;
    let statusBadgeBg = '#FAF4EA';
    let statusBadgeColor = '#8C6D34';
    let statusHeadline = 'Order Update';
    let statusMessage = `Hi ${this.escapeHtml(order.customerName)}, your order <strong>#${order.id}</strong> status has been updated to <strong>${order.status}</strong>.`;

    if (order.status === 'Processing') {
      statusBadgeText = 'ORDER CONFIRMED & PREPARING';
      statusBadgeBg = '#FAF4EA';
      statusBadgeColor = '#8C6D34';
      statusHeadline = 'We’re Preparing Your Order';
      statusMessage = `Hi ${this.escapeHtml(order.customerName)}, thank you for shopping with us! We have received order <strong>#${order.id}</strong> and are carefully preparing your pieces. We will notify you as soon as your package ships.`;
    } else if (order.status === 'Shipped') {
      statusBadgeText = 'ORDER SHIPPED';
      statusBadgeBg = '#EFF5F0';
      statusBadgeColor = '#2E683E';
      statusHeadline = 'Your Order Has Shipped';
      statusMessage = `Hi ${this.escapeHtml(order.customerName)}, your order <strong>#${order.id}</strong> is on the way!`;
    } else if (order.status === 'Delivered') {
      statusBadgeText = 'DELIVERED';
      statusBadgeBg = '#EFF5F0';
      statusBadgeColor = '#2E683E';
      statusHeadline = 'Your Order Has Been Delivered';
      statusMessage = `Hi ${this.escapeHtml(order.customerName)}, your order <strong>#${order.id}</strong> has been delivered. We hope you love your new jewellery!`;
    }

    const trackingCard = order.awbNumber ? `
      <div style="background-color: #FAF9F6; border: 1px solid #ECE7DE; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #8A847C; margin-bottom: 12px;">
          Shipment Details
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: ${order.trackingUrl ? '16px' : '0'};">
          <tr>
            <td style="color: #6B655D; padding: 4px 0;">Courier Partner:</td>
            <td style="color: #22201E; font-weight: 600; text-align: right;">${this.escapeHtml(order.courierPartner || 'Express Delivery')}</td>
          </tr>
          <tr>
            <td style="color: #6B655D; padding: 4px 0;">Tracking Number:</td>
            <td style="color: #22201E; font-family: monospace; font-weight: 600; text-align: right;">${this.escapeHtml(order.awbNumber)}</td>
          </tr>
        </table>
        ${order.trackingUrl ? `
          <div style="text-align: center; margin-top: 14px;">
            <a href="${order.trackingUrl}" target="_blank" style="display: block; background-color: #22201E; color: #FAF9F6; font-size: 13px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 6px; text-align: center; letter-spacing: 0.03em;">
              Track Package &rarr;
            </a>
          </div>
        ` : ''}
      </div>
    ` : '';

    const html = this.wrapTemplate(`
      <div style="text-align: center; margin-bottom: 22px;">
        <span style="display: inline-block; background-color: ${statusBadgeBg}; color: ${statusBadgeColor}; font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px;">
          ${statusBadgeText}
        </span>
      </div>

      <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: 500; color: #22201E; margin: 0 0 14px 0; text-align: center;">
        ${statusHeadline}
      </h2>
      <p style="font-size: 14px; line-height: 1.65; color: #55504A; margin: 0 0 20px 0;">
        ${statusMessage}
      </p>

      ${trackingCard}

      ${this.buildOrderSummaryTable(order)}

      <!-- Delivery Address Card -->
      <div style="background-color: #FAF9F6; border: 1px solid #ECE7DE; border-radius: 8px; padding: 16px 20px; margin-top: 20px;">
        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #8A847C; margin-bottom: 8px;">
          Shipping Address
        </div>
        <div style="font-size: 13px; line-height: 1.5; color: #332F2B;">
          <strong>${this.escapeHtml(order.customerName)}</strong><br>
          ${this.escapeHtml(order.shippingAddress)}<br>
          ${this.escapeHtml(order.city)}, ${this.escapeHtml(order.state)} ${order.pincode}<br>
          ${this.escapeHtml(order.country || 'India')}
        </div>
      </div>
    `);

    return this.sendEmail({
      to: order.email,
      subject: `${statusHeadline} (#${order.id}) — Rass by Riddhima`,
      html,
    });
  }

  // =========================================================================
  // 2. TRACKING DETAILS UPDATE
  // =========================================================================

  public async sendOrderTrackingUpdateEmail(order: Order): Promise<EmailSendResult> {
    return this.sendOrderStatusUpdateEmail(order);
  }

  // =========================================================================
  // 3. ORDER CANCELLATION & REFUND
  // =========================================================================

  public async sendOrderCancellationEmail(order: Order, reason: string): Promise<EmailSendResult> {
    if (!order.email) return { success: false, error: 'No customer email provided' };

    const formattedTotal = this.formatCurrency(order.total);
    const html = this.wrapTemplate(`
      <div style="text-align: center; margin-bottom: 22px;">
        <span style="display: inline-block; background-color: #FDF2F2; color: #9B2C2C; font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px;">
          ORDER CANCELLED
        </span>
      </div>

      <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: 500; color: #22201E; margin: 0 0 14px 0; text-align: center;">
        Order Cancellation
      </h2>
      <p style="font-size: 14px; line-height: 1.65; color: #55504A; margin: 0 0 18px 0;">
        Hi ${this.escapeHtml(order.customerName)}, your order <strong>#${order.id}</strong> has been cancelled.
      </p>

      <div style="background-color: #FDF2F2; border: 1px solid #F8D7DA; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 13px; color: #9B2C2C;"><strong>Reason:</strong> ${this.escapeHtml(reason)}</p>
        <p style="margin: 0; font-size: 13px; color: #721C24;"><strong>Refund:</strong> ${formattedTotal} has been initiated to your original payment method (usually reflects in 3–5 business days).</p>
      </div>

      ${this.buildOrderSummaryTable(order)}
    `);

    return this.sendEmail({
      to: order.email,
      subject: `Order #${order.id} Cancelled — Rass by Riddhima`,
      html,
    });
  }

  // =========================================================================
  // 4. ORDER CREATION / CHECKOUT CONFIRMATION
  // =========================================================================

  public async sendOrderConfirmationEmail(order: Order): Promise<EmailSendResult> {
    if (!order.email) return { success: false, error: 'No customer email' };

    const html = this.wrapTemplate(`
      <div style="text-align: center; margin-bottom: 22px;">
        <span style="display: inline-block; background-color: #EFF5F0; color: #2E683E; font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px;">
          ORDER CONFIRMED
        </span>
      </div>

      <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: 500; color: #22201E; margin: 0 0 14px 0; text-align: center;">
        Thank You for Your Order
      </h2>
      <p style="font-size: 14px; line-height: 1.65; color: #55504A; margin: 0 0 20px 0;">
        Hi ${this.escapeHtml(order.customerName)}, we have received your order <strong>#${order.id}</strong>. Our team is now preparing it with care, and we will email you once it ships.
      </p>

      ${this.buildOrderSummaryTable(order)}

      <!-- Details Summary Card -->
      <div style="background-color: #FAF9F6; border: 1px solid #ECE7DE; border-radius: 8px; padding: 18px 20px; margin-top: 20px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="color: #6B655D; padding: 4px 0; vertical-align: top; width: 35%;">Payment Method:</td>
            <td style="color: #22201E; font-weight: 600; text-align: right;">${this.escapeHtml(order.paymentMethod)}</td>
          </tr>
          <tr>
            <td style="color: #6B655D; padding: 4px 0; vertical-align: top;">Shipping To:</td>
            <td style="color: #22201E; text-align: right;">${this.escapeHtml(order.shippingAddress)}, ${this.escapeHtml(order.city)}, ${this.escapeHtml(order.state)} ${order.pincode}</td>
          </tr>
        </table>
      </div>
    `);

    return this.sendEmail({
      to: order.email,
      subject: `Order Confirmation #${order.id} — Rass by Riddhima`,
      html,
    });
  }

  // =========================================================================
  // 5. NEWSLETTER WELCOME
  // =========================================================================

  public async sendNewsletterWelcomeEmail(email: string): Promise<EmailSendResult> {
    const html = this.wrapTemplate(`
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

      <div style="text-align: center; margin-top: 24px;">
        <a href="https://rassbyriddhima.com" target="_blank" style="display: inline-block; background-color: #22201E; color: #FAF9F6; font-size: 13px; font-weight: 500; text-decoration: none; padding: 12px 28px; border-radius: 6px; letter-spacing: 0.03em;">
          Explore Collections &rarr;
        </a>
      </div>
    `);

    return this.sendEmail({
      to: email,
      subject: `Welcome! Here is 10% off your first order — Rass by Riddhima`,
      html,
    });
  }

  // =========================================================================
  // 6. CONTACT / INQUIRY ACKNOWLEDGMENT
  // =========================================================================

  public async sendInquiryNotificationEmail(params: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }): Promise<EmailSendResult> {
    const html = this.wrapTemplate(`
      <div style="text-align: center; margin-bottom: 22px;">
        <span style="display: inline-block; background-color: #FAF4EA; color: #8C6D34; font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px;">
          MESSAGE RECEIVED
        </span>
      </div>

      <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: 500; color: #22201E; margin: 0 0 14px 0; text-align: center;">
        We Received Your Message
      </h2>
      <p style="font-size: 14px; line-height: 1.65; color: #55504A; margin: 0 0 20px 0;">
        Hi ${this.escapeHtml(params.name)}, thank you for contacting us. A member of our team will review your inquiry and get back to you within 24 hours.
      </p>

      <div style="background-color: #FAF9F6; border: 1px solid #ECE7DE; border-radius: 8px; padding: 18px 20px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 12px; color: #8A847C;"><strong>Subject:</strong> ${this.escapeHtml(params.subject || 'General Inquiry')}</p>
        <p style="margin: 0; font-size: 13px; color: #332F2B; line-height: 1.5; font-style: italic;">"${this.escapeHtml(params.message)}"</p>
      </div>
    `);

    return this.sendEmail({
      to: params.email,
      subject: `We received your message — Rass by Riddhima`,
      html,
    });
  }

  // =========================================================================
  // LUXURY MASTER TEMPLATE (100% BULLETPROOF TYPOGRAPHIC WORDMARK)
  // =========================================================================

  private wrapTemplate(contentHtml: string): string {
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
                
                <!-- Pure Typographic Luxury Brand Header (Never blocked, 100% visible everywhere) -->
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

                <!-- Content Body -->
                <tr>
                  <td style="padding: 34px 30px; background-color: #FFFFFF;">
                    ${contentHtml}
                  </td>
                </tr>

                <!-- Clean Refined Footer -->
                <tr>
                  <td style="background-color: #FAF9F6; border-top: 1px solid #F0ECE4; padding: 24px 30px; text-align: center;">
                    <p style="margin: 0 0 6px 0; font-size: 12px; color: #6B655D;">
                      Need help? Reach us at <a href="mailto:${this.supportEmail}" style="color: #22201E; text-decoration: underline;">${this.supportEmail}</a>
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

  private buildOrderSummaryTable(order: Order): string {
    const items = order.itemSnapshots || [];
    if (items.length === 0) {
      return `
        <div style="border-top: 1px solid #F0ECE4; padding-top: 14px; margin-top: 20px;">
          <table style="width: 100%;">
            <tr>
              <td style="font-size: 14px; color: #22201E; font-weight: 600;">Total</td>
              <td style="font-size: 15px; color: #22201E; font-weight: 700; text-align: right;">${this.formatCurrency(order.total)}</td>
            </tr>
          </table>
        </div>
      `;
    }

    const itemRows = items.map((item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #F4F1EA; vertical-align: top;">
          <div style="font-weight: 600; font-size: 13.5px; color: #22201E;">${this.escapeHtml(item.productTitle)}</div>
          <div style="font-size: 12px; color: #78736B; margin-top: 3px;">Qty: ${item.quantity} ${item.variantName ? `&bull; ${this.escapeHtml(item.variantName)}` : ''}</div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #F4F1EA; text-align: right; vertical-align: top; font-size: 13.5px; font-weight: 600; color: #22201E;">
          ${this.formatCurrency(item.lineSubtotal || item.unitPrice * item.quantity)}
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
            <td style="color: #22201E; text-align: right;">${this.formatCurrency(order.subtotal)}</td>
          </tr>
          ${order.discount ? `
            <tr>
              <td style="color: #2E683E; padding: 3px 0;">Discount (${this.escapeHtml(order.appliedCoupon || 'Applied')}):</td>
              <td style="color: #2E683E; text-align: right;">-${this.formatCurrency(order.discount)}</td>
            </tr>
          ` : ''}
          <tr>
            <td style="color: #6B655D; padding: 3px 0;">Shipping:</td>
            <td style="color: #22201E; text-align: right;">${order.shippingFee === 0 ? 'Complimentary' : this.formatCurrency(order.shippingFee)}</td>
          </tr>
          <tr style="border-top: 1px solid #22201E;">
            <td style="font-size: 14px; font-weight: 700; color: #22201E; padding-top: 10px;">Total:</td>
            <td style="font-size: 16px; font-weight: 700; color: #22201E; text-align: right; padding-top: 10px;">${this.formatCurrency(order.total)}</td>
          </tr>
        </table>
      </div>
    `;
  }

  private formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }

  private escapeHtml(str: string): string {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

export const emailService = new EmailService();
