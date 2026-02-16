import ExcelJS from 'exceljs';
import dayjs from 'dayjs';
import type { InvoiceType } from '../../invoice/invoice.types';

export const exportSaleToExcel = async (
  filteredInvoices: InvoiceType[],
  bannerImage: string
) => {
  const dataToExport = filteredInvoices;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sales Report');

  // Convert image to base64
  const response = await fetch(bannerImage);
  const imageBlob = await response.blob();
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(imageBlob);
  });

  // banner image
  const imageId = workbook.addImage({
    base64: base64,
    extension: 'png',
  });

  worksheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 500, height: 80 }
  });

  // Title
  worksheet.mergeCells('A6:G6');
  const titleCell = worksheet.getCell('A6');
  titleCell.value = 'Sale Report';
  titleCell.font = { bold: true, size: 16 };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.addRow([]);

// headers
  const headers = ['Customer', 'Item', 'Quote To', 'Date', 'Qty', 'Unit Price', 'Total'];
  const headerRow = worksheet.addRow(headers);
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
  for (let i = 1; i <= headers.length; i++) {
    headerRow.getCell(i).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
  }

  // data rows
  dataToExport.forEach(invoice => {
    worksheet.addRow([
      invoice.customer_id,
      invoice.item_name,
      invoice.quote_to || 'Instant Sale',
      dayjs(invoice.invoice_date).format('DD-MMMM-YYYY'),
      invoice.qty,
      invoice.unit_price,
      invoice.total_amount
    ]);
  });

  // Calculate total sales
  const totalSales = dataToExport.reduce((sum, invoice) => sum + invoice.total_amount, 0);

  // Add empty row for spacing
  worksheet.addRow([]);

  // Add total row
  const totalRow = worksheet.addRow(['', '', '', '', '', 'Total Sales:', totalSales]);
  totalRow.font = { bold: true };
  totalRow.getCell(7).numFmt = '#,##0.00'; 

  // columns
  worksheet.columns.forEach((column, index) => {
    let maxLength = 0;
    if (headers[index]) {
      maxLength = headers[index].length;
    }
    column.eachCell?.({ includeEmpty: false }, (cell) => {
      const columnLength = cell.value ? String(cell.value).length : 0;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength < 10 ? 10 : maxLength + 2;
  });

  // download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `sales_report_${dayjs().format('YYYY-MM-DD')}.xlsx`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};