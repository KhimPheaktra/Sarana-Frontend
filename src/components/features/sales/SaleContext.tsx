import React, { createContext, useContext, useState, useMemo } from "react";
import type { QuoteType } from "../quote/quote.types";
import type { InvoiceType } from "../invoice/invoice.types";
import { invoiceData } from "../invoice/Invoice";
import { quotesData } from "../quote/Quote";

interface SalesContextType {
  quotes: QuoteType[];
  invoices: InvoiceType[];
  setInvoices: React.Dispatch<React.SetStateAction<InvoiceType[]>>;
  setQuotes: React.Dispatch<React.SetStateAction<QuoteType[]>>;
  addQuote: (quote: QuoteType) => void;
  addInvoice: (invoice: InvoiceType) => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);
export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quotes, setQuotes] = useState<QuoteType[]>(quotesData);
  const [invoices, setInvoices] = useState<InvoiceType[]>(invoiceData);

  const addQuote = (quote: QuoteType) => setQuotes(prev => [...prev, quote]);
  const addInvoice = (invoice: InvoiceType) => setInvoices(prev => [...prev, invoice]);

  const value = useMemo(() => ({ quotes, invoices, addQuote, addInvoice, setInvoices, setQuotes }), [quotes, invoices]);

  return <SalesContext.Provider value={value}>{children}</SalesContext.Provider>;
};


export const useSales = (): SalesContextType => {
  const context = useContext(SalesContext);
  if (!context) throw new Error("Something went wrong with SalesContext");
  return context;
};
