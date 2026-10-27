/**
 * InvoicePrintModal Component
 * Formatted printable customer memo & PDF generator
 */

export function generateInvoiceHTML(order) {
  const dateFormatted = order.createdAt ? new Date(order.createdAt).toLocaleDateString('bn-BD') : new Date().toLocaleDateString('bn-BD');

  return `
    <div style="font-family: 'Hind Siliguri', sans-serif, system-ui; max-width: 600px; margin: auto; padding: 25px; border: 2px solid #e2e8f0; border-radius: 12px; background: #fff; color: #1e293b;">
      
      <!-- Invoice Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #FF4D6D; padding-bottom: 12px;">
        <div>
          <h1 style="font-size: 26px; font-weight: 900; margin: 0; color: #0f172a; letter-spacing: -0.5px;">RUAA<span style="color: #FF4D6D;">.</span></h1>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b; font-weight: 600;">PREMIUM MODEST FASHION</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #475569;">📞 হেল্পলাইন: 01988-863486</p>
        </div>
        <div style="text-align: right;">
          <span style="display: inline-block; background: #FF4D6D; color: #fff; font-size: 11px; font-weight: bold; padding: 3px 10px; border-radius: 20px; text-transform: uppercase;">ক্যাশ অন ডেলিভারি</span>
          <p style="margin: 6px 0 0 0; font-size: 14px; font-weight: 800; font-family: monospace;">#${order.id}</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">তারিখ: ${dateFormatted}</p>
        </div>
      </div>

      <!-- Customer Details Box -->
      <div style="margin: 18px 0; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 12px;">
        <h3 style="margin: 0 0 6px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; color: #475569;">প্রাপকের বিবরণ (Customer Details):</h3>
        <p style="margin: 3px 0;"><strong>নাম:</strong> ${order.name}</p>
        <p style="margin: 3px 0;"><strong>মোবাইল:</strong> <span style="font-family: monospace; font-size: 13px;">${order.phone}</span></p>
        <p style="margin: 3px 0;"><strong>ঠিকানা:</strong> ${order.address}</p>
        <p style="margin: 3px 0;"><strong>এলাকা:</strong> ${order.city === 'inside_dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}</p>
      </div>

      <!-- Item Table -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px;">
        <thead>
          <tr style="background: #0f172a; color: #fff; text-align: left;">
            <th style="padding: 8px 10px; border-radius: 6px 0 0 0;">আইটেম</th>
            <th style="padding: 8px 10px;">কালার / সাইজ</th>
            <th style="padding: 8px 10px; text-align: center;">পরিমাণ</th>
            <th style="padding: 8px 10px; text-align: right; border-radius: 0 6px 0 0;">মূল্য</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px; font-weight: 600;">${order.productTitle}</td>
            <td style="padding: 10px;">${order.color || '-'} / ${order.size || '-'}</td>
            <td style="padding: 10px; text-align: center;">${order.quantity || 1}</td>
            <td style="padding: 10px; text-align: right; font-weight: 700;">৳ ${(order.productPrice || order.total - order.deliveryFee).toLocaleString()}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 8px 10px; text-align: right; font-weight: 600; color: #64748b;">ডেলিভারি চার্জ:</td>
            <td style="padding: 8px 10px; text-align: right; font-weight: 700;">৳ ${(order.deliveryFee || 70).toLocaleString()}</td>
          </tr>
          <tr style="border-top: 2px solid #0f172a; background: #fff5f7;">
            <td colspan="3" style="padding: 10px; text-align: right; font-size: 14px; font-weight: 900; color: #0f172a;">মোট প্রদেয় বিল (COD):</td>
            <td style="padding: 10px; text-align: right; font-size: 16px; font-weight: 900; color: #FF4D6D;">৳ ${(order.total || 0).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <!-- Terms / Return note -->
      <div style="margin-top: 25px; border-top: 1px dashed #cbd5e1; padding-top: 12px; font-size: 10px; text-align: center; color: #64748b; line-height: 1.4;">
        <p style="margin: 0;">পার্সেলটি ডেলিভারিম্যানের সামনে চেক করে নেওয়ার জন্য অনুরোধ করা হচ্ছে।</p>
        <p style="margin: 2px 0 0 0;">RUAA Store-এর সাথে থাকার জন্য ধন্যবাদ!</p>
      </div>

    </div>
  `;
}
