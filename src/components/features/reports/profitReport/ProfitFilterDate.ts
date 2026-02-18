import { useState, useEffect, useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import type { InvoiceType } from '../../invoice/invoice.types';
import type { ExpensesType } from '../../expenses/expenses.types';
import type { PurchaseType } from '../../purchase/purchase.types';
import type { FormInstance } from 'antd';
import { Grid } from 'antd';
import type { CommissionType } from '../../commision/commission.types';

const { useBreakpoint } = Grid;

export const useProfitDateFilter = (
    invoices: InvoiceType[],
    expenses: ExpensesType[],
    purchases: PurchaseType[],
    commissions: CommissionType[],
    form: FormInstance
) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [filteredInvoices, setFilteredInvoices] = useState(invoices);
    const [filteredExpenses, setFilteredExpenses] = useState(expenses);
    const [filteredPurchases, setFilteredPurchases] = useState(purchases);
    const [filteredCommissions, setFilteredCommissions] = useState(commissions);

    const getCurrentMonthRange = () => {
        const now = dayjs();
        return {
            startOfMonth: now.startOf('month'),
            endOfMonth: now.endOf('month'),
        };
    };

    const applyFilter = useCallback(
        (fromDate: Dayjs | null, toDate: Dayjs | null) => {
            if (fromDate && toDate) {
                setFilteredInvoices(
                    invoices.filter(i => {
                        const d = dayjs(i.invoice_date);
                        return d.isSameOrAfter(fromDate, 'day') && d.isSameOrBefore(toDate, 'day');
                    })
                );
                setFilteredExpenses(
                    expenses.filter(e => {
                        const d = dayjs(e.expenses_date);
                        return d.isSameOrAfter(fromDate, 'day') && d.isSameOrBefore(toDate, 'day');
                    })
                );
                setFilteredPurchases(
                    purchases.filter(p => {
                        const d = dayjs(p.purchase_date);
                        return d.isSameOrAfter(fromDate, 'day') && d.isSameOrBefore(toDate, 'day');
                    })
                );
                setFilteredCommissions(
                    commissions.filter(c => {
                        const d = dayjs(c.commission_date);
                        return d.isSameOrAfter(fromDate, 'day') && d.isSameOrBefore(toDate, 'day');
                    })
                );
            } else {
                setFilteredInvoices(invoices);
                setFilteredExpenses(expenses);
                setFilteredPurchases(purchases);
                setFilteredCommissions(commissions);
            }
        },
        [invoices, expenses, purchases, commissions]
    );

    useEffect(() => {
        const { startOfMonth, endOfMonth } = getCurrentMonthRange();
        if (isMobile) {
            form.setFieldsValue({ report_date_from: startOfMonth, report_date_to: endOfMonth });
        } else {
            form.setFieldsValue({ report_date_range: [startOfMonth, endOfMonth] });
        }
        applyFilter(startOfMonth, endOfMonth);
    }, []);
    useEffect(() => {
        const { startOfMonth, endOfMonth } = getCurrentMonthRange();
        const v = form.getFieldsValue();
        if (isMobile) {
            if (v.report_date_range?.length === 2) {
                form.setFieldsValue({
                    report_date_from: v.report_date_range[0],
                    report_date_to: v.report_date_range[1],
                    report_date_range: undefined,
                });
            } else if (!v.report_date_from || !v.report_date_to) {
                form.setFieldsValue({ report_date_from: startOfMonth, report_date_to: endOfMonth });
            }
        } else {
            if (v.report_date_from && v.report_date_to) {
                form.setFieldsValue({
                    report_date_range: [v.report_date_from, v.report_date_to],
                    report_date_from: undefined,
                    report_date_to: undefined,
                });
            } else if (!v.report_date_range || v.report_date_range.length !== 2) {
                form.setFieldsValue({ report_date_range: [startOfMonth, endOfMonth] });
            }
        }
    }, [isMobile, form]);

    const handleFilter = useCallback(() => {
        const v = form.getFieldsValue();
        let fromDate: Dayjs | null = null;
        let toDate: Dayjs | null = null;
        if (isMobile) {
            fromDate = v.report_date_from;
            toDate = v.report_date_to;
        } else if (v.report_date_range) {
            [fromDate, toDate] = v.report_date_range;
        }
        applyFilter(fromDate, toDate);
    }, [form, isMobile, applyFilter]);

    const handleShowAll = useCallback(() => {
        applyFilter(null, null);
        if (isMobile) {
            form.setFieldsValue({ report_date_from: null, report_date_to: null });
        } else {
            form.setFieldsValue({ report_date_range: null });
        }
    }, [applyFilter, form, isMobile]);

    const handleClearFilter = useCallback(() => {
        const { startOfMonth, endOfMonth } = getCurrentMonthRange();
        if (isMobile) {
            form.setFieldsValue({ report_date_from: startOfMonth, report_date_to: endOfMonth });
        } else {
            form.setFieldsValue({ report_date_range: [startOfMonth, endOfMonth] });
        }
        applyFilter(startOfMonth, endOfMonth);
    }, [form, isMobile, applyFilter]);

    return {
        filteredInvoices,
        filteredExpenses,
        filteredPurchases,
        filteredCommissions,
        handleFilter,
        handleShowAll,
        handleClearFilter,
        isMobile,
    };
};