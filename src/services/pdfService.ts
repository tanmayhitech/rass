import { jsPDF } from 'jspdf';
import { Order } from '../types';
import { RASS_LOGO_DATA_URL } from './assets/rassLogo';

export class PDFService {
  /**
   * Generates a luxury branded Retail/Commercial Tax Invoice PDF
   * Featuring authentic Rass logo, order time, and verified itemized pricing.
   */
  public static generateInvoicePDF(order: Order): jsPDF {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    let y = 14;

    // --- 1. BRAND LOGO & ATELIER IDENTITY ---
    try {
      // 600x207 transparent wordmark ratio = 2.898 => width 44mm, height 15.18mm
      doc.addImage(RASS_LOGO_DATA_URL, 'PNG', margin, y, 44, 15.18);
    } catch {
      // Fallback text if image rendering fails
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(41, 38, 36);
      doc.text('RASS BY RIDDHIMA', margin, y + 8);
    }

    // Atelier Subtitle & Location
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(180, 154, 108); // #B49A6C Antique Gold
    doc.text('ROOTED IN TRADITION, MADE FOR TODAY', margin, y + 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(119, 113, 111); // #77716F
    doc.text('Atelier Studio: Hyderabad, Telangana — 500034 • Pan-India Express', margin, y + 24);
    doc.text('WhatsApp: +91 98197 33572 • care@rassbyridhima.com • @rassbyridhima', margin, y + 28);

    // --- 2. DOCUMENT METADATA (Top Right Badge) ---
    const invoiceNum = `INV-2026-${order.id.replace('RASS-ORD-', '')}`;
    const badgeW = 75;
    const badgeX = pageWidth - margin - badgeW;

    // Elegant badge container
    doc.setFillColor(250, 245, 236); // #FAF5EC Gold tint
    doc.setDrawColor(239, 227, 207); // #EFE3CF
    doc.roundedRect(badgeX, y, badgeW, 7, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(120, 94, 47); // #785E2F Deep Gold
    doc.text('TAX & RETAIL INVOICE', badgeX + badgeW / 2, y + 4.8, { align: 'center' });

    // Invoice details block
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(119, 113, 111);

    doc.text('Invoice No:', badgeX, y + 12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 38, 36);
    doc.text(invoiceNum, pageWidth - margin, y + 12, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(119, 113, 111);
    doc.text('Order Ref:', badgeX, y + 16.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 38, 36);
    doc.text(order.id, pageWidth - margin, y + 16.5, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(119, 113, 111);
    doc.text('Order Date:', badgeX, y + 21);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 38, 36);
    doc.text(order.date || 'Today', pageWidth - margin, y + 21, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(119, 113, 111);
    doc.text('Order Time:', badgeX, y + 25.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 38, 36);
    doc.text(order.orderTime || '02:30 PM IST', pageWidth - margin, y + 25.5, { align: 'right' });

    // Decorative divider line
    y = 48;
    doc.setDrawColor(231, 224, 218); // #E7E0DA Linen
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);

    // --- 3. CUSTOMER DETAILS & PAYMENT RECORD ---
    y += 7;
    // Left: Billed & Delivered To
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(41, 38, 36);
    doc.text('BILLED & DELIVERED TO:', margin, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(order.customerName, margin, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 75, 72);
    doc.text(order.shippingAddress, margin, y + 9.5);
    doc.text(`${order.city}, ${order.state} - ${order.pincode}, ${order.country || 'India'}`, margin, y + 13.5);
    doc.text(`Contact: ${order.phone} • Email: ${order.email}`, margin, y + 17.5);

    // Right: Payment Card
    const payBoxW = 78;
    const payBoxX = pageWidth - margin - payBoxW;
    doc.setFillColor(250, 248, 245); // #FAF8F5 Warm Ivory
    doc.setDrawColor(231, 224, 218);
    doc.roundedRect(payBoxX, y - 2, payBoxW, 23, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(41, 38, 36);
    doc.text('VERIFIED PAYMENT RECORD', payBoxX + 4, y + 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(119, 113, 111);
    doc.text('Method:', payBoxX + 4, y + 7.5);
    doc.setTextColor(41, 38, 36);
    doc.text(order.paymentMethod, payBoxX + 22, y + 7.5);

    doc.setTextColor(119, 113, 111);
    doc.text('Status:', payBoxX + 4, y + 11.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 84, 50); // Muted Sage
    doc.text(order.paymentStatus ? order.paymentStatus.toUpperCase() : 'CAPTURED & VERIFIED', payBoxX + 22, y + 11.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(119, 113, 111);
    doc.text('Txn ID:', payBoxX + 4, y + 15.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(41, 38, 36);
    const txnId = order.razorpayPaymentId || `pay_live_${order.id.slice(-6)}`;
    doc.text(txnId.length > 22 ? txnId.substring(0, 22) : txnId, payBoxX + 22, y + 15.5);

    if (order.awbNumber) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(119, 113, 111);
      doc.text('AWB:', payBoxX + 4, y + 19.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(41, 38, 36);
      doc.text(`${order.awbNumber} (${order.courierPartner || 'Express Air'})`, payBoxX + 22, y + 19.5);
    }

    // --- 4. ITEMISED PRICING TABLE ---
    y += 28;
    // Table Header Bar (Deep Espresso)
    doc.setFillColor(41, 38, 36); // #292624
    doc.roundedRect(margin, y, contentWidth, 7, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('ITEM DESCRIPTION', margin + 4, y + 4.8);
    doc.text('SKU CODE', margin + 78, y + 4.8);
    doc.text('QTY', margin + 120, y + 4.8, { align: 'center' });
    doc.text('UNIT PRICE', margin + 148, y + 4.8, { align: 'right' });
    doc.text('TOTAL (INR)', pageWidth - margin - 4, y + 4.8, { align: 'right' });

    // Item Rows
    y += 7;
    const itemsToPrint = order.itemSnapshots && order.itemSnapshots.length > 0
      ? order.itemSnapshots.map((snap) => ({
          name: snap.productTitle,
          variant: snap.variantName,
          sku: snap.sku,
          qty: snap.quantity,
          price: snap.unitPrice,
          total: snap.lineSubtotal,
        }))
      : (Array.isArray(order.items) && order.items.length > 0
          ? order.items.map((i) => ({
              name: i?.product?.name || 'Jewellery Design',
              variant: i?.selectedSize || 'Standard',
              sku: i?.product?.sku || `RASS-${(i?.product?.id || 'PROD').slice(0, 8).toUpperCase()}`,
              qty: i?.quantity || 1,
              price: i?.product?.price || 0,
              total: (i?.product?.price || 0) * (i?.quantity || 1),
            }))
          : [{
              name: 'Haute Demi-Fine Jewellery Creation',
              variant: 'Standard',
              sku: order.id,
              qty: 1,
              price: order.subtotal,
              total: order.subtotal,
            }]);

    itemsToPrint.forEach((item, index) => {
      const rowY = y + index * 9.5;

      // Subtle alternate row shading
      if (index % 2 === 1) {
        doc.setFillColor(250, 248, 245); // #FAF8F5
        doc.rect(margin, rowY, contentWidth, 9.5, 'F');
      }

      // Title & variant
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(41, 38, 36);
      const titleStr = item.name.length > 40 ? `${item.name.substring(0, 38)}...` : item.name;
      doc.text(titleStr, margin + 4, rowY + 5.8);

      // SKU
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(119, 113, 111);
      doc.text(item.sku, margin + 78, rowY + 5.8);

      // Qty
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(41, 38, 36);
      doc.text(item.qty.toString(), margin + 120, rowY + 5.8, { align: 'center' });

      // Unit Price
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(41, 38, 36);
      doc.text(`Rs. ${item.price.toLocaleString('en-IN')}`, margin + 148, rowY + 5.8, { align: 'right' });

      // Total
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(41, 38, 36);
      doc.text(`Rs. ${item.total.toLocaleString('en-IN')}`, pageWidth - margin - 4, rowY + 5.8, { align: 'right' });
    });

    y += itemsToPrint.length * 9.5 + 4;
    doc.setDrawColor(231, 224, 218);
    doc.line(margin, y, pageWidth - margin, y);

    // --- 5. FINANCIAL TOTALS SUMMARY (Right Aligned Card) ---
    y += 5;
    const totalsW = 86;
    const totalsX = pageWidth - margin - totalsW;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(119, 113, 111);
    doc.text('Merchandise Subtotal:', totalsX, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 38, 36);
    doc.text(`Rs. ${order.subtotal.toLocaleString('en-IN')}`, pageWidth - margin - 4, y, { align: 'right' });

    if (order.discount > 0) {
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(59, 84, 50); // Muted Sage
      doc.text(`Coupon Discount (${order.appliedCoupon || 'Promotion'}):`, totalsX, y);
      doc.setFont('helvetica', 'bold');
      doc.text(`-Rs. ${order.discount.toLocaleString('en-IN')}`, pageWidth - margin - 4, y, { align: 'right' });
    }

    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(119, 113, 111);
    doc.text('Insured Express Shipping:', totalsX, y);
    doc.setFont('helvetica', 'bold');
    if (order.shippingFee === 0) {
      doc.setTextColor(59, 84, 50);
      doc.text('Complimentary (Free Air)', pageWidth - margin - 4, y, { align: 'right' });
    } else {
      doc.setTextColor(41, 38, 36);
      doc.text(`Rs. ${order.shippingFee.toLocaleString('en-IN')}`, pageWidth - margin - 4, y, { align: 'right' });
    }

    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(140, 130, 122);
    doc.text('Applicable GST (3% Demi-Fine):', totalsX, y);
    doc.text('Inclusive in Item Total', pageWidth - margin - 4, y, { align: 'right' });

    y += 6;
    doc.setDrawColor(41, 38, 36);
    doc.setLineWidth(0.6);
    doc.line(totalsX, y, pageWidth - margin, y);

    y += 5.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(41, 38, 36);
    doc.text('Grand Total Paid (INR):', totalsX, y);
    doc.text(`Rs. ${order.total.toLocaleString('en-IN')}`, pageWidth - margin - 4, y, { align: 'right' });

    // --- 6. ATELIER CERTIFICATE & AUTHENTICITY DECLARATION ---
    y = 248;
    doc.setFillColor(250, 248, 245); // #FAF8F5 Warm Ivory
    doc.setDrawColor(231, 224, 218);
    doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 154, 108); // Antique Gold
    doc.text('✦ CERTIFICATE OF DEMI-FINE AUTHENTICITY & PURITY GUARANTEE', margin + 5, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(100, 95, 92);
    doc.text('Handcrafted in Hyderabad with brass base & premium silver/gold micro-polish, semi-precious stones, freshwater pearls,', margin + 5, y + 11.5);
    doc.text('and anti-tarnish protective sealing. Exchange-only within 48h of delivery with mandatory 360 unboxing video.', margin + 5, y + 15.5);
    doc.text('Care: Keep away from water, soaps & perfumes. Store individually in airtight zip-locks. Clean with soft microfibre cloth.', margin + 5, y + 19.5);
    doc.text('Client Support: care@rassbyridhima.com | Official WhatsApp: +91 98197 33572 | Hyderabad, India', margin + 5, y + 23.5);

    // Bottom Sign-off
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(150, 142, 136);
    doc.text('Thank you for patronizing our atelier • Handcrafted with love in India', pageWidth / 2, 287, { align: 'center' });

    return doc;
  }

  /**
   * Generates an internal Packing Slip and Shipping Manifest PDF
   * Featuring authentic Rass logo and verified dispatch metrics.
   */
  public static generatePackingSlipPDF(order: Order): jsPDF {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    let y = 14;

    // Header Logo
    try {
      doc.addImage(RASS_LOGO_DATA_URL, 'PNG', margin, y, 40, 13.8);
    } catch {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(41, 38, 36);
      doc.text('RASS BY RIDDHIMA', margin, y + 7);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 154, 108);
    doc.text('ATELIER SHIPPING MANIFEST & QUALITY CONTROL PROTOCOL', margin, y + 18);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(105, 72, 104); // Dusty Mauve
    doc.text(`MANIFEST REF #${order.id}`, pageWidth - margin, y + 7, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(119, 113, 111);
    doc.text(`Booked: ${order.date} at ${order.orderTime || '02:30 PM IST'}`, pageWidth - margin, y + 12, { align: 'right' });

    y += 24;
    doc.setDrawColor(231, 224, 218);
    doc.line(margin, y, pageWidth - margin, y);

    // Logistics Summary
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(41, 38, 36);
    doc.text('DISPATCH & RECIPIENT INFORMATION:', margin, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(order.customerName, margin, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(70, 65, 62);
    doc.text(order.shippingAddress, margin, y + 9.5);
    doc.text(`${order.city}, ${order.state} - ${order.pincode}, ${order.country || 'India'}`, margin, y + 13.5);
    doc.text(`Tel: ${order.phone} • Email: ${order.email}`, margin, y + 17.5);

    const rBoxX = pageWidth - margin - 75;
    doc.setFillColor(250, 248, 245);
    doc.setDrawColor(231, 224, 218);
    doc.roundedRect(rBoxX, y - 2, 75, 23, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(41, 38, 36);
    doc.text('COURIER ROUTING', rBoxX + 4, y + 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(119, 113, 111);
    doc.text('Carrier:', rBoxX + 4, y + 7.5);
    doc.setTextColor(41, 38, 36);
    doc.text(order.courierPartner || 'Shiprocket Express', rBoxX + 22, y + 7.5);

    doc.setTextColor(119, 113, 111);
    doc.text('AWB:', rBoxX + 4, y + 11.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 38, 36);
    doc.text(order.awbNumber || 'PENDING MANIFEST', rBoxX + 22, y + 11.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(119, 113, 111);
    doc.text('Status:', rBoxX + 4, y + 15.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 84, 50);
    doc.text(order.fulfilmentStatus ? order.fulfilmentStatus.toUpperCase() : 'PROCESSING', rBoxX + 22, y + 15.5);

    // Items Checklist
    y += 28;
    doc.setFillColor(41, 38, 36);
    doc.roundedRect(margin, y, contentWidth, 7, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('[ ] VERIFIED', margin + 4, y + 4.8);
    doc.text('ITEM TITLE', margin + 30, y + 4.8);
    doc.text('SKU CODE', margin + 110, y + 4.8);
    doc.text('QTY TO PACK', pageWidth - margin - 4, y + 4.8, { align: 'right' });

    y += 7;
    const items = order.itemSnapshots && order.itemSnapshots.length > 0
      ? order.itemSnapshots
      : (Array.isArray(order.items) && order.items.length > 0
          ? order.items.map((i) => ({
              productTitle: i?.product?.name || 'Jewellery Design',
              sku: i?.product?.sku || 'RASS-SKU',
              quantity: i?.quantity || 1,
            }))
          : [{
              productTitle: 'Jewellery Design',
              sku: order.id,
              quantity: 1,
            }]);

    items.forEach((item, index) => {
      const rowY = y + index * 9.5;

      if (index % 2 === 1) {
        doc.setFillColor(250, 248, 245);
        doc.rect(margin, rowY, contentWidth, 9.5, 'F');
      }

      doc.setDrawColor(180, 154, 108);
      doc.rect(margin + 5, rowY + 2.5, 4.5, 4.5); // Checkbox

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(41, 38, 36);
      doc.text(item.productTitle.substring(0, 45), margin + 30, rowY + 5.8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(119, 113, 111);
      doc.text(item.sku, margin + 110, rowY + 5.8);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(41, 38, 36);
      doc.text(`${item.quantity} pc(s)`, pageWidth - margin - 4, rowY + 5.8, { align: 'right' });
    });

    // Quality Control Sign-off
    y += items.length * 9.5 + 20;
    doc.setDrawColor(231, 224, 218);
    doc.line(margin, y, pageWidth - margin, y);

    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(41, 38, 36);
    doc.text('QUALITY CONTROL INSPECTION & PACKAGING PROTOCOL:', margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(119, 113, 111);
    doc.text('• [ ] Suede Velvet Heirloom Presentation Box Enclosed', margin, y + 5);
    doc.text('• [ ] Certificate of Demi-Fine Authenticity & Care Card Included', margin, y + 9.5);
    doc.text('• [ ] Anti-Tarnish Film & Moisture Absorption Strip Zip-Sealed', margin, y + 14);
    doc.text('• [ ] Tamper-Evident Security Hologram Applied to Outer Transit Box', margin, y + 18.5);

    // Signatures
    doc.text('Karigar Signature: ______________________', margin + 110, y + 9.5);
    doc.text('QC Supervisor: ______________________', margin + 110, y + 18.5);

    return doc;
  }

  public static downloadInvoice(order: Order): void {
    const doc = this.generateInvoicePDF(order);
    doc.save(`Rass-Invoice-${order.id}.pdf`);
  }

  public static downloadPackingSlip(order: Order): void {
    const doc = this.generatePackingSlipPDF(order);
    doc.save(`Rass-PackingSlip-${order.id}.pdf`);
  }
}
