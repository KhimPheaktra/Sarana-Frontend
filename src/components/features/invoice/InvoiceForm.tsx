import React, { useState } from 'react';
import type { InvoiceType } from './invoice.types';
import InvoiceView from './InvoiceView';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Props {
  selectedInvoice?: InvoiceType;
  items?: InvoiceItem[]; 
  onClose?: () => void;
}

const InvoiceForm: React.FC<Props> = ({ selectedInvoice, items, onClose }) => {
  const [showInvoiceView, setShowInvoiceView] = useState(false);

  if (selectedInvoice) {
    return (
      <InvoiceView 
        invoice={selectedInvoice}
        items={items} 
        onClose={() => {
          setShowInvoiceView(false);
          if (onClose) {
            onClose();
          }
        }} 
      />
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Invoice Form</h2>
      <p>Select an invoice from the table to view details</p>
    </div>
  );
};

export default InvoiceForm;