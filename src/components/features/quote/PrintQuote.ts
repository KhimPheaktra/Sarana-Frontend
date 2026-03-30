import Banner from './../../../assets/images/banner.png';
import type { QuoteType } from './quote.types';
import dayjs from 'dayjs';

export const PrintQuote = (quote: QuoteType) => {
  const printWindow = window.open('', '', 'width=900,height=650');
  if (!printWindow) return;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateSubTotal = () => quote.total_amount;
  const calculateDiscount = () => quote.discount || 0;
  const calculateVAT = () => quote.wth || 0;
  const calculateTotalPaid = () => {
    const subTotal = calculateSubTotal();
    const discount = calculateDiscount();
    const vat = calculateVAT();
    return subTotal - discount + vat;
  };

  const bannerUrl = new URL(Banner, window.location.href).href;

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Quotation-${quote.quote_id}</title>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: Arial, sans-serif;
      background: white;
    }

    @page {
      size: A4;
      margin: 10mm;
    }

    .quotation-paper {
      width: 100%;
      background-color: #fff;
      padding: 10mm;
      font-family: Arial, sans-serif;
      font-size: 11pt;
      margin: 0 auto;
    }

    .banner-header {
      margin-bottom: 20px;
    }

    .banner-image {
      width: 100%;
      height: auto;
      display: block;
    }

    .company-quote-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      gap: 10px;
    }

    .info-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000;
    }

    .info-table td {
      padding: 6px 10px;
      border: 1px solid #000;
    }

    .info-label {
      font-weight: bold;
      width: 30%;
    }

    .quote-header-right {
      text-align: right;
      min-width: 180px;
    }

    .quote-title {
      font-size: 28pt;
      font-weight: bold;
      margin: 0 0 10px 0;
    }

    .quote-date {
      font-size: 11pt;
      color: #1e40af;
    }

    .customer-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000;
      margin-bottom: 15px;
    }

    .customer-table td {
      padding: 6px 10px;
      border: 1px solid #000;
    }

    .customer-label {
      font-weight: bold;
      width: 20%;
    }

    /*
     * ✅ FINAL FIX: Wrap the table in a div that provides all 4 outer borders.
     * The table itself only draws internal cell borders (top + right per cell).
     * This completely removes the dependency on the table element's own border,
     * which browsers frequently clip in print mode.
     */
    .items-table-wrapper {
      border: 2px solid #000;
      margin-bottom: 15px;
      /* overflow:hidden clips any 1px rounding gaps at corners */
      overflow: hidden;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      /* No outer border — the wrapper div handles it */
      border: none;
    }

    .items-table th {
      padding: 8px;
      border-right: 1px solid rgba(255,255,255,0.4);
      border-bottom: 2px solid #000;
      background-color: #1e5a8e !important;
      color: #fff !important;
      text-align: center;
    }

    .items-table th:last-child {
      border-right: none;
    }

    .items-table td {
      padding: 8px;
      /* Only top border needed — previous row's bottom = this row's top */
      border-top: 1px solid #000;
      border-right: 1px solid #000;
    }

    .items-table tbody tr:first-child td {
      border-top: none;
    }

    .items-table td:last-child {
      border-right: none;
    }

    .text-center { text-align: center; }
    .text-right  { text-align: right; }

    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
    }

    .totals-table-wrapper {
      border: 2px solid #000;
      overflow: hidden;
      width: 300px;
    }

    .totals-table {
      width: 100%;
      border-collapse: collapse;
      border: none;
    }

    .totals-table td {
      padding: 6px 10px;
      border-top: 1px solid rgba(255,255,255,0.25);
      border-right: 1px solid rgba(255,255,255,0.25);
      background-color: #1e5a8e !important;
      color: #fff !important;
    }

    .totals-table tbody tr:first-child td {
      border-top: none;
    }

    .totals-table td:last-child {
      border-right: none;
    }

    .totals-label { font-weight: bold; }
    .totals-value { text-align: right; }

    .remark-section {
      margin-bottom: 60px;
    }

    .remark-title {
      font-weight: bold;
      margin-bottom: 5px;
    }

    .remark-content {
      padding-left: 80px;
      line-height: 1.6;
    }

    .signatures-section {
      display: flex;
      justify-content: space-between;
      gap: 40px;
      margin-top: 60px;
    }

    .signature-block {
      flex: 1;
      text-align: left;
    }

    .signature-line {
      border-bottom: 1px solid #000;
      margin-bottom: 8px;
      height: 60px;
    }

    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      @page {
        size: A4;
        margin: 10mm;
      }

      body { margin: 0; padding: 0; }

      .quotation-paper {
        width: 100%;
        margin: 0 auto;
        padding: 0;
      }

      .items-table th {
        background-color: #1e5a8e !important;
        color: #fff !important;
      }

      .totals-table td {
        background-color: #1e5a8e !important;
        color: #fff !important;
      }
    }
  </style>
</head>

<body>
  <div class="quotation-paper">

    <div class="banner-header">
      <img src="${bannerUrl}" alt="Company Banner" class="banner-image" />
    </div>

    <div class="company-quote-info">
      <div style="flex: 1;">
        <table class="info-table">
          <tbody>
            <tr>
              <td class="info-label">INCHARGE</td>
              <td>Senghun Workshop</td>
            </tr>
            <tr>
              <td class="info-label">TEL :</td>
              <td>070572830</td>
            </tr>
            <tr>
              <td class="info-label">E-MAIL :</td>
              <td>engineer@senghunworkshop.com</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="quote-header-right">
        <h1 class="quote-title">Quotation</h1>
        <strong>NO :</strong> ${quote.quote_id}
        <div class="quote-date">
          <strong>Date :</strong> ${dayjs(quote.quote_date).format('DD/MM/YYYY')}
        </div>
      </div>
    </div>

    <table class="customer-table">
      <tbody>
        <tr>
          <td class="customer-label">ATTN TO :</td>
          <td>${quote.quote_to}</td>
        </tr>
        <tr>
          <td class="customer-label">COMPANY :</td>
          <td></td>
        </tr>
        <tr>
          <td class="customer-label">ADDRESS :</td>
          <td style="height: 60px;"></td>
        </tr>
      </tbody>
    </table>

    <!-- Wrapper div provides the 4 outer borders; table draws only internal lines -->
    <div class="items-table-wrapper">
      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 8%;">No</th>
            <th style="width: 42%;">Description</th>
            <th style="width: 10%;">Qty</th>
            <th style="width: 12%;">Unit</th>
            <th style="width: 14%;">Unit Price</th>
            <th style="width: 14%;">Amount (USD)</th>
          </tr>
        </thead>
        <tbody>
          ${quote.items.map((row, i) => `
            <tr>
              <td class="text-center">${i + 1}</td>
              <td>${row.item_name}</td>
              <td class="text-center">${row.qty}</td>
              <td class="text-center">${row.unit}</td>
              <td class="text-right">$ ${formatCurrency(row.unit_price)}</td>
              <td class="text-right">$ ${formatCurrency(row.amount)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="totals-section">
      <div class="totals-table-wrapper">
        <table class="totals-table">
          <tbody>
            <tr>
              <td class="totals-label">Sub Total</td>
              <td class="totals-value">$ ${formatCurrency(calculateSubTotal())}</td>
            </tr>
            <tr>
              <td class="totals-label">Discount</td>
              <td class="totals-value">$ ${formatCurrency(calculateDiscount())}</td>
            </tr>
            <tr>
              <td class="totals-label">VAT</td>
              <td class="totals-value">${calculateVAT() > 0 ? `$ ${formatCurrency(calculateVAT())}` : 'N/A'}</td>
            </tr>
            <tr>
              <td class="totals-label">Total Paid</td>
              <td class="totals-value" style="font-weight: bold;">$ ${formatCurrency(calculateTotalPaid())}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="remark-section">
      <div class="remark-title">REMARK :</div>
      <div class="remark-content">
        ${quote.notes || ''}<br />
      </div>
    </div>

    <div class="signatures-section">
      <div class="signature-block">
        <div class="signature-line"></div>
        <div>Customer Name &amp; Signature</div>
      </div>
      <div class="signature-block">
        <div class="signature-line"></div>
        <div>Seller Name &amp; Signature</div>
      </div>
    </div>

  </div>
</body>
</html>
`);

  printWindow.document.close();
  printWindow.focus();

  const img = printWindow.document.querySelector('img');
  if (img) {
    img.onload = () => {
      setTimeout(() => { printWindow.print(); printWindow.close(); }, 100);
    };
    img.onerror = () => {
      setTimeout(() => { printWindow.print(); printWindow.close(); }, 300);
    };
  } else {
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 300);
  }
};