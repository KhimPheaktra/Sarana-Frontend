import { useState, useEffect, useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import type { ExpensesType } from '../../expenses/expenses.types';
import type { PurchaseType } from '../../purchase/purchase.types';
import type { FormInstance } from 'antd';
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

export const useExpenseDateFilter = (
    expenses: ExpensesType[],
    purchases: PurchaseType[],
    form: FormInstance
) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [filteredExpenses, setFilteredExpenses] = useState(expenses);
    const [filteredPurchases, setFilteredPurchases] = useState(purchases);

    const getCurrentMonthRange = () => {
        const now = dayjs();
        return {
            startOfMonth: now.startOf('month'),
            endOfMonth: now.endOf('month')
        };
    };
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

        const filteredExp = expenses.filter(expense => {
            const expenseDate = dayjs(expense.expenses_date);
            return expenseDate.isSameOrAfter(startOfMonth, 'day') &&
                expenseDate.isSameOrBefore(endOfMonth, 'day');
        });

        const filteredPur = purchases.filter(purchase => {
            const purchaseDate = dayjs(purchase.purchase_date);
            return purchaseDate.isSameOrAfter(startOfMonth, 'day') &&
                purchaseDate.isSameOrBefore(endOfMonth, 'day');
        });

        setFilteredExpenses(filteredExp);
        setFilteredPurchases(filteredPur);
    }, []);
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

    const handleFilter = useCallback(() => {
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
            const filteredExp = expenses.filter(expense => {
                const expenseDate = dayjs(expense.expenses_date);
                return expenseDate.isSameOrAfter(fromDate, 'day') &&
                    expenseDate.isSameOrBefore(toDate, 'day');
            });

            const filteredPur = purchases.filter(purchase => {
                const purchaseDate = dayjs(purchase.purchase_date);
                return purchaseDate.isSameOrAfter(fromDate, 'day') &&
                    purchaseDate.isSameOrBefore(toDate, 'day');
            });

            setFilteredExpenses(filteredExp);
            setFilteredPurchases(filteredPur);
        } else {
            setFilteredExpenses(expenses);
            setFilteredPurchases(purchases);
        }
    }, [form, isMobile, expenses, purchases]);

    const handleShowAll = useCallback(() => {
        setFilteredExpenses(expenses);
        setFilteredPurchases(purchases);

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
    }, [expenses, purchases, form, isMobile]);

    const handleClearFilter = useCallback(() => {
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

        const filteredExp = expenses.filter(expense => {
            const expenseDate = dayjs(expense.expenses_date);
            return expenseDate.isSameOrAfter(startOfMonth, 'day') &&
                expenseDate.isSameOrBefore(endOfMonth, 'day');
        });

        const filteredPur = purchases.filter(purchase => {
            const purchaseDate = dayjs(purchase.purchase_date);
            return purchaseDate.isSameOrAfter(startOfMonth, 'day') &&
                purchaseDate.isSameOrBefore(endOfMonth, 'day');
        });

        setFilteredExpenses(filteredExp);
        setFilteredPurchases(filteredPur);
    }, [form, isMobile, expenses, purchases]);

    return {
        filteredExpenses,
        filteredPurchases,
        handleFilter,
        handleShowAll,
        handleClearFilter,
        isMobile
    };
};