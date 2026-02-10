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
      width: 210mm;
      min-height: 297mm;
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

    .items-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000;
      margin-bottom: 15px;
    }

    .items-table th {
      padding: 8px;
      border: 1px solid #000;
      background-color: #1e5a8e;
      color: #fff;
      text-align: center;
    }

    .items-table td {
      padding: 8px;
      border: 1px solid #000;
    }

    .text-center {
      text-align: center;
    }

    .text-right {
      text-align: right;
    }

    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
    }

    .totals-table {
      width: 300px;
      border-collapse: collapse;
      border: 1px solid #000;
    }

    .totals-table td {
      padding: 6px 10px;
      border: 1px solid #000;
      background-color: #1e5a8e;
      color: #fff;
    }

    .totals-label {
      font-weight: bold;
    }

    .totals-value {
      text-align: right;
    }

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
    }
  </style>
</head>

<body>
  <div class="quotation-paper">
    <div class="banner-header">
      <img src="${Banner}" alt="Company Banner" class="banner-image" />
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
        <h1 class="quote-title">Qoutation</h1>
        <strong>NO :</strong> ${(quote.quote_id)}
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
        <tr>
          <td class="text-center">1</td>
          <td>${quote.item}</td>
          <td class="text-center">${quote.qty}</td>
          <td class="text-center">${quote.unit}</td>
          <td class="text-right">$ ${formatCurrency(quote.total_amount)}</td>
          <td class="text-right">$ ${formatCurrency(quote.total_amount)}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals-section">
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

    <div class="remark-section">
      <div class="remark-title">REMARK :</div>
      <div class="remark-content">
        ${quote.notes || ""}<br />
      </div>
    </div>

    <div class="signatures-section">
      <div class="signature-block">
        <div class="signature-line"></div>
        <div>Customer Name & Signature</div>
      </div>
      <div class="signature-block">
        <div class="signature-line"></div>
        <div>Seller Name & Signature</div>
      </div>
    </div>

  </div>
</body>
</html>
`);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
  
};