import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import kmCommon from "./locales/km/common.json";
import enInvoice from "./locales/en/invoice.json";
import kmInvoice from "./locales/km/invoice.json";
import enCatalogItem from "./locales/en/catalogItem.json";
import kmCatalogItem from "./locales/km/catalogItem.json";
import enCustomer from "./locales/en/customer.json";
import kmCustomer from "./locales/km/customer.json";
import enExpenses from "./locales/en/expenses.json";
import kmExpenses from "./locales/km/expenses.json";
import enPayment from "./locales/en/payment.json";
import kmPayment from "./locales/km/payment.json";
import enPurchase from "./locales/en/purchase.json";
import kmPurchase from "./locales/km/purchase.json";
import enQuote from "./locales/en/quote.json";
import kmQuote from "./locales/km/quote.json";
import enSupplier from "./locales/en/supplier.json";
import kmSupplier from "./locales/km/supplier.json";
import enUser from "./locales/en/user.json";
import kmUser from "./locales/km/user.json";
import enCommission from "./locales/en/commission.json";
import kmCommission from "./locales/km/commission.json";
import enSaleReport from "./locales/en/saleReport.json";
import kmSaleReport from "./locales/km/saleReport.json";
import enExpensesReport from "./locales/en/expensesReport.json";
import kmExpensesReport from "./locales/km/expensesReport.json";
import enProfitReport from "./locales/en/profitReport.json";
import kmProfitReport from "./locales/km/profitReport.json";
import enDashboard from "./locales/en/dashboard.json";
import kmDashboard from "./locales/km/dashboard.json";



i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        dashboard: enDashboard,
        invoice: enInvoice,
        catalogItem: enCatalogItem,
        customer: enCustomer,
        expenses: enExpenses,
        payment: enPayment,
        purchase: enPurchase,
        quote: enQuote,
        supplier: enSupplier,
        user: enUser,
        commission: enCommission,
        saleReport: enSaleReport,
        expenseReport: enExpensesReport,
        profitReport: enProfitReport,
      },
      km: {
        common: kmCommon,
        dashboard: kmDashboard,
        invoice: kmInvoice,
        catalogItem: kmCatalogItem,
        customer: kmCustomer,
        expenses: kmExpenses,
        payment: kmPayment,
        purchase: kmPurchase,
        quote: kmQuote,
        supplier: kmSupplier,
        user: kmUser,
        commission: kmCommission,
        saleReport: kmSaleReport,
        expenseReport: kmExpensesReport,
        profitReport: kmProfitReport,
      },
    },
    fallbackLng: "en",
    ns: ["common", "invoice","catalogItem"],  
    defaultNS: "common",        
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (format === 'number') {
          return lng === 'km'
            ? Number(value).toLocaleString('km-KH')
            : Number(value).toLocaleString();
        }
        if (format === 'total') {
          const { count, label } = value;
          const formattedCount = lng === 'km'
            ? Number(count).toLocaleString('km-KH')
            : Number(count).toLocaleString();
          return lng === 'km'
            ? `សរុប ${formattedCount} ${label}`  
            : `${formattedCount} ${label}`;      
        }
          return value;
      },
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;