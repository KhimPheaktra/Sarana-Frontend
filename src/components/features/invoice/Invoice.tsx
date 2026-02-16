import React, { useState } from 'react';
import { Modal, Grid, Card, message } from 'antd';
import InvoiceTable from './InvoiceTable';
import type { InvoiceType } from './invoice.types';
import PageHeader from '../../../shared/action-header/ActionHeader';
import InvoicePrintForm from './InvoicePrintForm';
import { useSales } from '../sales/SaleContext';


const { useBreakpoint } = Grid;

 export const invoiceData: InvoiceType[] = [
    {
      key: '1',
      invoice_id: 1,
      customer_id: 101,
      invoice_date: '2026-02-07',
      item_name: "Item 1",
      unit_price: 358,
      qty: 1,
      total_amount: 358,
      status: 'Completed'
    },
    {
      key: '2',
      invoice_id: 2,
      customer_id: 102,
      quote_to: "",
      invoice_date: '2026-02-06',
      item_name: "Item 2",
      unit_price: 150,
      qty: 2,
      total_amount: 300,
      status: 'Pending'
    },
    {
      key: '3',
      invoice_id: 3,
      customer_id: 103,
      quote_to: "",
      invoice_date: '2025-02-06',
      item_name: "Item 2",
      unit_price: 150,
      qty: 2,
      total_amount: 300,
      status: 'Pending'
    }
  ];

const Invoice: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { invoices, setInvoices } = useSales();
  const screens = useBreakpoint();

  const handleView = (invoice: InvoiceType) => {
    setSelectedInvoice(invoice);
    setIsModalVisible(true);
  };

  const handleDelete = () => {
    message.info("No action on delete yet")
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedInvoice(null);
  };

  const getModalWidth = () => {
    if (!screens.md) return '100%'; 
    if (!screens.lg) return '80%';   
    return '60%';                    
  };
  React.useEffect(() => {
    if (invoices.length === 0) {
      setInvoices(invoiceData);
    }
  }, []);

  return (
    <div style={{ padding: '20px' }}>
        <PageHeader
            title="Invoices"
            count={invoices.length}
            countLabel="Invoices" icon={undefined}     
            />
        <Card>
            <InvoiceTable 
                data={invoices} 
                onView={handleView} 
                onDelete={handleDelete} 
            />
        </Card>
        <Modal
            title={!screens.md ? null : "Invoice Details"}
            open={isModalVisible}
            onCancel={handleCloseModal}
            footer={null}
            width={getModalWidth()}
            style={{ 
            top: !screens.md ? 0 : 20,
            margin: !screens.md ? 0 : undefined,
            maxWidth: !screens.md ? '100%' : undefined,
            paddingBottom: !screens.md ? 0 : undefined
            }}
            styles={{ body: {
            padding: !screens.md ? '10px' : '24px',
            maxHeight: !screens.md ? '100vh' : 'calc(100vh - 100px)',
            overflow: 'auto'
            }
            }}
            destroyOnHidden
        >
            {selectedInvoice && (
        <InvoicePrintForm 
                invoice={selectedInvoice} 
                onClose={handleCloseModal} 
        />
    )}
    </Modal>
    </div>
  );
};

export default Invoice;