import Banner from './../../../assets/images/banner.png';

interface InvoiceItem {
  no: number;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  amount: number;
}

interface PrintInvoiceParams {
  invoiceId: string | number;
  invoiceDate: string;
  lineItems: InvoiceItem[];
  grandTotal: number;
}

export const printInvoice = ({
  invoiceId,
  invoiceDate,
  lineItems,
  grandTotal,
}: PrintInvoiceParams) => {
  const printWindow = window.open('', '', 'width=900,height=650');
  if (!printWindow) return;

  const invoiceNo = String(invoiceId).padStart(6, '0');
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(grandTotal);

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${invoiceNo}</title>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: white;
    }

    @page {
      size: A4 portrait;
      margin: 15mm;
    }

    .invoice-paper {
      width: 100%;
      max-width: 210mm;
      margin: 0 auto;
      padding: 30px;
      background: white;
    }
    
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      gap: 16px;
      width: 100%;
    }

    .company-banner {
      flex: 36;
      min-width: 0;
    }

    .banner-image {
      width: 100%;
      height: auto;
      object-fit: contain;
      display: block;
    }

    .invoice-title-section {
      flex: 8;
      min-width: 0;
      text-align: right;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      padding: 10px;
    }

    .invoice-title {
      font-size: 24px;
      font-weight: bold;
      color: #4a4de6;
      margin: 0 0 8px 0;
    }

    .invoice-meta p {
      font-size: 12px;
      margin: 4px 0;
      color: #333;
    }

    .invoice-meta strong {
      color: #1a1a2e;
      font-weight: 600;
    }

    .divider {
      border: none;
      border-top: 1.5px solid #1a1a2e;
      margin: 15px 0;
    }
    
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-bottom: 30px;
    }

    .invoice-table th,
    .invoice-table td {
      border: 1.5px solid #1a1a2e;
      padding: 10px 8px;
    }

    .invoice-table th {
      background: #f5f5f5;
      text-align: center;
      font-weight: 600;
      color: #1a1a2e;
    }

    .invoice-table tbody tr:nth-child(odd) {
      background: #fafafa;
    }

    .text-center {
      text-align: center;
    }

    .text-right {
      text-align: right;
      padding-right: 10px;
    }
    
    .invoice-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 20px;
      margin-top: 20px;
      padding-top: 10px;
      page-break-inside: avoid;
    }

    .footer-signatures {
      display: flex;
      flex: 1;
    }

    .signature-section {
      flex: 1;
      text-align: center;
      padding: 10px;
    }

    .signature-label {
      font-size: 13px;
      font-weight: 600;
      margin: 0 0 50px 0;
      color: #1a1a2e;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .signature-line {
      width: 85%;
      margin: 0 auto;
      border-bottom: 1.5px solid #1a1a2e;
    }

    .footer-total {
      min-width: 240px;
      padding: 16px;
      text-align: right;
    }

    .total-label {
      font-size: 16px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 8px 0;
    }

    .grand-total-amount {
      font-size: 20px;
      font-weight: bold;
      color: #1a1a2e;
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
       
      @page {
        margin: 0;
      }
      
      body {
        margin: 1.6cm;
      }
      
      .invoice-table tr {
        page-break-inside: avoid;
      }
    }
  </style>
</head>

<body>
  <div class="invoice-paper">

    <div class="invoice-header">
      <div class="company-banner">
        <img src="${Banner}" class="banner-image" />
      </div>
      <div class="invoice-title-section">
        <div class="invoice-title">INVOICE</div>
        <div class="invoice-meta">
          <p><strong>No:</strong> ${invoiceNo}</p>
          <p><strong>Date:</strong> ${invoiceDate}</p>
        </div>
      </div>
    </div>

    <hr class="divider" />

    <table class="invoice-table">
      <thead>
        <tr>
          <th width="60">No</th>
          <th width="40%">Item</th>
          <th width="15%">Qty</th>
          <th width="20%">Unit Price</th>
          <th width="15%">Discount</th>
          <th width="20%">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${lineItems.map(item => `
          <tr>
            <td class="text-center">${item.no}</td>
            <td>${item.description}</td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-right">$${item.unitPrice.toFixed(2)}</td>
            <td class="text-center">${item.discount}%</td>
            <td class="text-right">$${item.amount.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="invoice-footer">
      <div class="footer-signatures">
        <div class="signature-section">
          <div class="signature-label">Buyer</div>
          <div class="signature-line"></div>
        </div>
        <div class="signature-section">
          <div class="signature-label">Engineer</div>
          <div class="signature-line"></div>
        </div>
        <div class="signature-section">
          <div class="signature-label">Seller</div>
          <div class="signature-line"></div>
        </div>
      </div>

      <div class="footer-total">
        <div class="total-label">Grand Total</div>
        <div class="grand-total-amount">${formattedTotal}</div>
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