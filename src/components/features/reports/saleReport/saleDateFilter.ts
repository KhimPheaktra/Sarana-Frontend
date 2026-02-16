import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import type { InvoiceType } from '../../invoice/invoice.types';
import type { FormInstance } from 'antd';


export const useSaleDateFilter = (
    invoices: InvoiceType[],
    form: FormInstance,
    isMobile: boolean
) => {
    const [filteredInvoices, setFilteredInvoices] = useState(invoices);
    const [isShowingAll, setIsShowingAll] = useState(false);

    const getCurrentMonthRange = () => {
        const now = dayjs();
        return {
            startOfMonth: now.startOf('month'),
            endOfMonth: now.endOf('month')
        };
    };

    // current month filter
    useEffect(() => {
        const { startOfMonth, endOfMonth } = getCurrentMonthRange();

        if (isMobile) {
            form.setFieldsValue({
                report_date_from: startOfMonth,
                report_date_to: endOfMonth,
            });
        } else {
            form.setFieldsValue({
                report_date_range: [startOfMonth, endOfMonth],
            });
        }

        const filtered = invoices.filter(invoice => {
            const invoiceDate = dayjs(invoice.invoice_date);
            return invoiceDate.isSameOrAfter(startOfMonth, 'day') &&
                invoiceDate.isSameOrBefore(endOfMonth, 'day');
        });
        setFilteredInvoices(filtered);
        setIsShowingAll(false);
    }, []);

    // Handle screen size when change
    useEffect(() => {
        const { startOfMonth, endOfMonth } = getCurrentMonthRange();
        const currentValues = form.getFieldsValue();

        if (isMobile) {
            if (currentValues.report_date_range && currentValues.report_date_range.length === 2) {
                form.setFieldsValue({
                    report_date_from: currentValues.report_date_range[0],
                    report_date_to: currentValues.report_date_range[1],
                    report_date_range: undefined,
                });
            } else if (!currentValues.report_date_from || !currentValues.report_date_to) {
                form.setFieldsValue({
                    report_date_from: startOfMonth,
                    report_date_to: endOfMonth,
                });
            }
        } else {
            if (currentValues.report_date_from && currentValues.report_date_to) {
                form.setFieldsValue({
                    report_date_range: [currentValues.report_date_from, currentValues.report_date_to],
                    report_date_from: undefined,
                    report_date_to: undefined,
                });
            } else if (!currentValues.report_date_range || currentValues.report_date_range.length !== 2) {
                form.setFieldsValue({
                    report_date_range: [startOfMonth, endOfMonth],
                });
            }
        }
    }, [isMobile, form]);

    // Update filtered data when invoices change
    useEffect(() => {
        if (isShowingAll) {
            setFilteredInvoices(invoices);
        } else {
            handleFilter();
        }
    }, [invoices]);

    const handleFilter = () => {
        const values = form.getFieldsValue();
        let fromDate: Dayjs | null = null;
        let toDate: Dayjs | null = null;

        if (isMobile) {
            fromDate = values.report_date_from;
            toDate = values.report_date_to;
        } else {
            if (values.report_date_range) {
                [fromDate, toDate] = values.report_date_range;
            }
        }

        if (fromDate && toDate) {
            const filtered = invoices.filter(invoice => {
                const invoiceDate = dayjs(invoice.invoice_date);
                return invoiceDate.isSameOrAfter(fromDate, 'day') &&
                    invoiceDate.isSameOrBefore(toDate, 'day');
            });
            setFilteredInvoices(filtered);
            setIsShowingAll(false);
        } else {
            setFilteredInvoices(invoices);
            setIsShowingAll(true);
        }
    };

    const handleShowAll = () => {
        setFilteredInvoices(invoices);
        setIsShowingAll(true);

        if (isMobile) {
            form.setFieldsValue({
                report_date_from: null,
                report_date_to: null,
            });
        } else {
            form.setFieldsValue({
                report_date_range: null,
            });
        }
    };

    const handleClearFilter = () => {
        const { startOfMonth, endOfMonth } = getCurrentMonthRange();

        if (isMobile) {
            form.setFieldsValue({
                report_date_from: startOfMonth,
                report_date_to: endOfMonth,
            });
        } else {
            form.setFieldsValue({
                report_date_range: [startOfMonth, endOfMonth],
            });
        }

        const filtered = invoices.filter(invoice => {
            const invoiceDate = dayjs(invoice.invoice_date);
            return invoiceDate.isSameOrAfter(startOfMonth, 'day') &&
                invoiceDate.isSameOrBefore(endOfMonth, 'day');
        });
        setFilteredInvoices(filtered);
        setIsShowingAll(false);
    };

    return {
        filteredInvoices,
        handleFilter,
        handleShowAll,
        handleClearFilter
    };
};