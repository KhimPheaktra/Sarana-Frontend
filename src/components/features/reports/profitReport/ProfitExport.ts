import ExcelJS from 'exceljs';
import dayjs from 'dayjs';
import type { InvoiceType } from '../../invoice/invoice.types';
import type { ExpensesType } from '../../expenses/expenses.types';
import type { PurchaseType } from '../../purchase/purchase.types';
import type { CommissionType } from '../../commision/commission.types';


export const exportProfit = async (
    filteredInvoices: InvoiceType[],
    filteredExpenses: ExpensesType[],
    filteredPurchases: PurchaseType[],
    filteredCommissions: CommissionType[],
    bannerImage: string
) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Profit Report');

    // Convert banner to base64
    const response = await fetch(bannerImage);
    const imageBlob = await response.blob();
    const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageBlob);
    });

    const imageId = workbook.addImage({ base64, extension: 'png' });
    worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 500, height: 80 },
    });

    worksheet.mergeCells('A6:G6');
    const titleCell = worksheet.getCell('A6');
    titleCell.value = 'Profit Report';
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.addRow([]);
    const totalRevenue     = filteredInvoices.reduce((s, i) => s + i.total_amount, 0);
    const totalExpenses    = filteredExpenses.reduce((s, e) => s + e.amount, 0);
    const totalPurchases   = filteredPurchases.reduce((s, p) => s + p.total_amount, 0);
    const totalCommissions = filteredCommissions.reduce((s, c) => s + c.amount, 0);
    const totalSpend       = totalExpenses + totalPurchases + totalCommissions;
    const netProfit        = totalRevenue - totalSpend;

    const summaryTitleRow = worksheet.addRow(['Summary']);
    summaryTitleRow.font = { bold: true, size: 12 };
    summaryTitleRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6E6E6' } };

    const summaryItems: [string, number, string][] = [
        ['Total Revenue (Sales)',  totalRevenue,     'FFD9F7BE'],
        ['Total Expenses',         totalExpenses,    'FFFFCCC7'],
        ['Total Purchases',        totalPurchases,   'FFFFF1B8'],
        ['Total Commissions',      totalCommissions, 'FFF9F0FF'],
        ['Total Spend',            totalSpend,       'FFD3D3D3'],
        ['Net Profit / Loss',      netProfit,        netProfit >= 0 ? 'FFB7EB8F' : 'FFFF9C9C'],
    ];

    summaryItems.forEach(([label, value, argb]) => {
        const row = worksheet.addRow([label, `$${value.toFixed(2)}`]);
        row.font = { bold: label === 'Net Profit / Loss' || label === 'Total Spend' };
        row.eachCell((cell, colNum) => {
            if (colNum <= 2) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } };
                cell.border = {
                    top:    { style: 'thin' },
                    bottom: { style: 'thin' },
                    left:   { style: 'thin' },
                    right:  { style: 'thin' },
                };
            }
        });
    });

    worksheet.addRow([]);
    const addSection = (
        sectionTitle: string,
        titleArgb: string,
        headerArgb: string,
        headers: string[],
        dataRows: (string | number | null)[][]
    ) => {
        const titleRow = worksheet.addRow([sectionTitle]);
        titleRow.font = { bold: true, size: 12 };
        titleRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: titleArgb } };

        const hRow = worksheet.addRow(headers);
        hRow.font = { bold: true };
        hRow.alignment = { horizontal: 'center', vertical: 'middle' };
        for (let i = 1; i <= headers.length; i++) {
            hRow.getCell(i).fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerArgb } };
            hRow.getCell(i).border = {
                top: { style: 'thin' }, bottom: { style: 'thin' },
                left: { style: 'thin' }, right: { style: 'thin' },
            };
        }

        dataRows.forEach(rowData => {
            const r = worksheet.addRow(rowData);
            r.eachCell((cell, colNum) => {
                if (colNum <= headers.length) {
                    cell.border = {
                        bottom: { style: 'hair' },
                        left:   { style: 'thin' },
                        right:  { style: 'thin' },
                    };
                }
            });
        });

        worksheet.addRow([]);
    };

    addSection(
        'Sales (Revenue)',
        'FFB7EB8F',
        'FFD9F7BE',
        ['Invoice Date', 'Customer', 'Item', 'Quote To', 'Qty', 'Unit Price', 'Total Amount'],
        filteredInvoices.map(i => [
            dayjs(i.invoice_date).format('DD-MMMM-YYYY'),
            i.customer_id,
            i.item_name,
            i.quote_to || 'Instant Sale',
            i.qty,
            i.unit_price,
            i.total_amount,
        ])
    );

    addSection(
        'Expenses',
        'FFFF4D4F',
        'FFFFD3D3',
        ['Expense ID', 'Description', 'Category', 'Date', 'Amount'],
        filteredExpenses.map(e => [
            e.expenses_id,
            e.description,
            e.category,
            dayjs(e.expenses_date).format('DD-MMMM-YYYY'),
            e.amount,
        ])
    );

    addSection(
        'Purchases',
        'FFFAAD14',
        'FFFFEDD3',
        ['Purchase ID', 'Supplier ID', 'Item ID', 'Date', 'Qty', 'Unit Price', 'Total Amount'],
        filteredPurchases.map(p => [
            p.purchase_id,
            p.supplier_id,
            p.item_id,
            dayjs(p.purchase_date).format('DD-MMMM-YYYY'),
            p.qty,
            p.unit_price,
            p.total_amount,
        ])
    );

    addSection(
        'Commissions',
        'FFB37FEB',
        'FFF9F0FF',
        ['Commission ID', 'Staff', 'Description', 'Date', 'Amount'],
        filteredCommissions.map(c => [
            c.commission_id,
            c.engineer || '-',
            c.description || '-',
            dayjs(c.commission_date).format('DD-MMMM-YYYY'),
            c.amount,
        ])
    );

    worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell?.({ includeEmpty: false }, cell => {
            const len = cell.value ? String(cell.value).length : 0;
            if (len > maxLength) maxLength = len;
        });
        column.width = Math.max(maxLength + 2, 12);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `profit_report_${dayjs().format('YYYY-MM-DD')}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};