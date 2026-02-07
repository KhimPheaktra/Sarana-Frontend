import React, { useState } from 'react';
import { Modal, Grid, Card, message } from 'antd';
import InvoiceTable from './InvoiceTable';
import InvoiceForm from './InvoiceForm';
import type { InvoiceType } from './invoice.types';
import PageHeader from '../../layout/pageHeader/PageHeader';

const { useBreakpoint } = Grid;

const Invoice: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const screens = useBreakpoint();

  const invoiceData: InvoiceType[] = [
    {
      key: '1',
      invoice_id: 1,
      customer_id: 101,
      quote_id: 201,
      invoice_date: '2024-02-07',
      item_id: 1,
      unit_price: 358,
      quantity: 1,
      total_amount: 358,
      status: 'Completed'
    },
    {
      key: '2',
      invoice_id: 2,
      customer_id: 102,
      quote_id: 202,
      invoice_date: '2024-02-06',
      item_id: 2,
      unit_price: 150,
      quantity: 2,
      total_amount: 300,
      status: 'Pending'
    }
  ];

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

  return (
    <div style={{ padding: '20px' }}>
        <PageHeader
            title="Invoices"
            count={invoiceData.length}
            countLabel="Invoices" icon={undefined}     
            />
        <Card>
            <InvoiceTable 
                data={invoiceData} 
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
        <InvoiceForm 
                selectedInvoice={selectedInvoice} 
                onClose={handleCloseModal} 
        />
    )}
    </Modal>
    </div>
  );
};

export default Invoice;