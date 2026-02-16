import ExcelJS from 'exceljs';
import dayjs from 'dayjs';
import type { ExpensesType } from '../../expenses/expenses.types';
import type { PurchaseType } from '../../purchase/purchase.types';

export const exportExpenseToExcel = async (
    filteredExpenses: ExpensesType[],
    filteredPurchases: PurchaseType[],
    bannerImage: string
) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Expense Report');

    // Convert image to base64
    const response = await fetch(bannerImage);
    const imageBlob = await response.blob();
    const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageBlob);
    });

    // Banner image
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
    titleCell.value = 'Expense Report';
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.addRow([]);

    // Calculate total
    const total_expenses = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
    const total_purchases = filteredPurchases.reduce((total, purchase) => total + purchase.total_amount, 0);
    const total_spend = total_expenses + total_purchases;

    // Summary section
    worksheet.addRow(['Summary']);
    const summaryHeaderRow = worksheet.getRow(worksheet.lastRow!.number);
    summaryHeaderRow.font = { bold: true, size: 12 };
    summaryHeaderRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6E6' }
    };

    worksheet.addRow(['Total Expenses:', `$${total_expenses.toFixed(2)}`]);
    worksheet.addRow(['Total Purchases:', `$${total_purchases.toFixed(2)}`]);
    worksheet.addRow(['Total Spend:', `$${total_spend.toFixed(2)}`]);
    const totalSpendRow = worksheet.getRow(worksheet.lastRow!.number);
    totalSpendRow.font = { bold: true };
    totalSpendRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
    };
    totalSpendRow.getCell(2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
    };

    worksheet.addRow([]);

    // Expenses section
    worksheet.addRow(['Expenses']);
    const expenseTitleRow = worksheet.getRow(worksheet.lastRow!.number);
    expenseTitleRow.font = { bold: true, size: 12 };
    expenseTitleRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF4D4F' }
    };

    const expenseHeaders = ['Expense ID', 'Description', 'Category', 'Date', 'Amount'];
    const expenseHeaderRow = worksheet.addRow(expenseHeaders);
    expenseHeaderRow.font = { bold: true };
    expenseHeaderRow.alignment = { horizontal: 'center', vertical: 'middle' };
    
    // Expense header 
    for (let i = 1; i <= expenseHeaders.length; i++) {
        expenseHeaderRow.getCell(i).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFD3D3' }
        };
    }

    //Expense data
    filteredExpenses.forEach(expense => {
        worksheet.addRow([
            expense.expenses_id,
            expense.description,
            expense.category,
            dayjs(expense.expenses_date).format('DD-MMMM-YYYY'),
            expense.amount
        ]);
    });

    worksheet.addRow([]);

    // Purchases section
    worksheet.addRow(['Purchases']);
    const purchaseTitleRow = worksheet.getRow(worksheet.lastRow!.number);
    purchaseTitleRow.font = { bold: true, size: 12 };
    purchaseTitleRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFAAD14' }
    };

    const purchaseHeaders = ['Purchase ID', 'Supplier ID', 'Item ID', 'Date', 'qty', 'Unit Price', 'Total Amount'];
    const purchaseHeaderRow = worksheet.addRow(purchaseHeaders);
    purchaseHeaderRow.font = { bold: true };
    purchaseHeaderRow.alignment = { horizontal: 'center', vertical: 'middle' };
    
    // Purchase header 
    for (let i = 1; i <= purchaseHeaders.length; i++) {
        purchaseHeaderRow.getCell(i).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFEDD3' }
        };
    }

    // Purchase data
    filteredPurchases.forEach(purchase => {
        worksheet.addRow([
            purchase.purchase_id,
            purchase.supplier_id,
            purchase.item_id,
            dayjs(purchase.purchase_date).format('DD-MMMM-YYYY'),
            purchase.qty,
            purchase.unit_price,
            purchase.total_amount
        ]);
    });

    // columns
    worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell?.({ includeEmpty: false }, (cell) => {
            const columnLength = cell.value ? String(cell.value).length : 0;
            if (columnLength > maxLength) {
                maxLength = columnLength;
            }
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    // Download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expense_report_${dayjs().format('YYYY-MM-DD')}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};