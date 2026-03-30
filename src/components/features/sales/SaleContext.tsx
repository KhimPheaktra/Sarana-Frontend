import React, { createContext, useContext, useState, useMemo } from "react";
import type { QuoteType } from "../quote/quote.types";
import type { InvoiceType } from "../invoice/invoice.types";

import { invoiceData } from "../invoice/Invoice";
import { quotesData } from "../quote/Quote";
import type { PaymentType } from "../payement/payment.types";
import { paymentData } from "../payement/Payment";
import type { CommissionType } from "../commision/commission.types";
import type { ExpensesType } from "../expenses/expenses.types";
import type { PurchaseType } from "../purchase/purchase.types";
import { expensesData } from "../expenses/Expenses";
import { commissionsData } from "../commision/commissionDataTest";
import { purchasesData } from "../purchase/Purchase";

interface SalesContextType {
  quotes: QuoteType[];
  invoices: InvoiceType[];
  payments: PaymentType[];
  commissions: CommissionType[];
  expenses: ExpensesType[];
  purchases: PurchaseType[];
  setPurchase: React.Dispatch<React.SetStateAction<PurchaseType[]>>;
  setExpenses: React.Dispatch<React.SetStateAction<ExpensesType[]>>;
  setInvoices: React.Dispatch<React.SetStateAction<InvoiceType[]>>;
  setQuotes: React.Dispatch<React.SetStateAction<QuoteType[]>>;
  setPayments: React.Dispatch<React.SetStateAction<PaymentType[]>>;
  setCommissions: React.Dispatch<React.SetStateAction<CommissionType[]>>;
  addQuote: (quote: QuoteType) => void;
  addInvoice: (invoice: InvoiceType) => void;
  addPayment: (payment: PaymentType) => void;
  addCommission: (commission: CommissionType) => void;
  addExpense: (expense: ExpensesType) => void;
  addPurchase: (purchase: PurchaseType) => void;

}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quotes, setQuotes] = useState<QuoteType[]>(quotesData);
  const [invoices, setInvoices] = useState<InvoiceType[]>(invoiceData);
  const [payments, setPayments] = useState<PaymentType[]>(paymentData);
  const [commissions, setCommissions] = useState<CommissionType[]>(commissionsData);
  const [expenses, setExpenses] = useState<ExpensesType[]>(expensesData);
  const [purchases, setPurchase] = useState<PurchaseType[]>(purchasesData);
  const addExpense = (expense: ExpensesType) => setExpenses(prev => [...prev, expense]);
  const addQuote = (quote: QuoteType) => setQuotes(prev => [...prev, quote]);
  const addInvoice = (invoice: InvoiceType) => setInvoices(prev => [...prev, invoice]);
  const addPayment = (payment: PaymentType) => setPayments(prev => [...prev, payment]);
  const addCommission = (commission: CommissionType) => setCommissions(prev => [...prev, commission]);
  const addPurchase = (purchase: PurchaseType) => setPurchase(prev => [...prev, purchase]);

  const value = useMemo(
    () => ({
      quotes, addQuote, setQuotes,
      invoices, addInvoice, setInvoices,
      payments, addPayment, setPayments,
      commissions, addCommission, setCommissions,
      expenses, addExpense, setExpenses,
      purchases, addPurchase, setPurchase,
    }),
    [quotes, invoices, payments, commissions,expenses,purchases]
  );

  return <SalesContext.Provider value={value}>{children}</SalesContext.Provider>;
};

export const useSales = (): SalesContextType => {
  const context = useContext(SalesContext);
  if (!context) throw new Error("Something went wrong with SalesContext");
  return context;
};