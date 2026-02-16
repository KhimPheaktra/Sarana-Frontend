import React, { useRef, useEffect } from 'react';
import { Button, Space, Row, Col, Divider } from 'antd';
import { PrinterOutlined, CloseOutlined } from '@ant-design/icons';
import type { InvoiceType } from './invoice.types';
import './InvoicePrintForm.css';
import Banner from './../../../assets/images/banner.png'
import { printInvoice } from './PrintInvoice';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  amount: number;
}

interface Props {
  invoice: InvoiceType;
  items?: InvoiceItem[]; 
  onClose: () => void;
}

const InvoiceView: React.FC<Props> = ({ invoice, items, onClose }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add('invoice-print-mode');
    
    return () => {
      document.body.classList.remove('invoice-print-mode');
    };
  }, []);

  const lineItems = items && items.length > 0 
    ? items.map((item, index) => ({
        no: index + 1,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        amount: item.amount
      }))
    : [
        {
          no: 1,
          description: 'Item 1',
          quantity: 1,
          unitPrice: 100,
          discount: 0,
          amount: 100
        },
        {
          no: 2,
          description: 'Item 2',
          quantity: 2,
          unitPrice: 50,
          discount: 0,
          amount: 100
        },
        {
          no: 3,
          description: 'Item 3',
          quantity: 1,
          unitPrice: 158,
          discount: 0,
          amount: 158
        }
      ];

  const grandTotal = lineItems.reduce((sum, item) => sum + item.amount, 0);

  const handlePrint = () => {
    printInvoice({
      invoiceId: invoice.invoice_id,
      invoiceDate: invoice.invoice_date,
      lineItems,
      grandTotal,
    });
  };

  return (
    <div className="invoice-view-container">
      <div className="invoice-actions no-print">
        <Space>
          <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
            Print Invoice
          </Button>
          <Button icon={<CloseOutlined />} onClick={onClose}>
            Close
          </Button>
        </Space>
      </div>

      <div ref={componentRef} className="invoice-print-area">
        <div className="invoice-paper">
          <div className="invoice-header">
            <Row align="middle" justify="space-between" gutter={16}>
              <Col xs={24} sm={14} md={16}>
                <div className="company-banner">
                  <img src={Banner} alt="Company Banner" className="banner-image" />
                </div>
              </Col>
              <Col xs={24} sm={10} md={8}>
                <div className="invoice-title-section">
                  <h2 className="invoice-title">INVOICE</h2>
                  <div className="invoice-meta">
                    <p><strong>No:</strong> {String(invoice.invoice_id).padStart(6, '0')}</p>
                    <p><strong>Date:</strong> {invoice.invoice_date}</p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <Divider style={{ margin: '15px 0', borderColor: '#1a1a2e' }} />

          <table className="invoice-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>No</th>
                <th style={{ width: '40%' }}>Item</th>
                <th style={{ width: '15%' }}>Qty</th>
                <th style={{ width: '20%' }}>Unit Price</th>
                <th style={{ width: '20%' }}>Discount</th>
                <th style={{ width: '25%' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <tr key={item.no}>
                  <td className="text-center">{item.no}</td>
                  <td>{item.description}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">${item.unitPrice.toFixed(2)}</td>
                  <td className="text-center">{item.discount}%</td>
                  <td className="text-right">${item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Grand Total + Signature Row */}
            <div className="invoice-footer combined-footer">
              <Row align="bottom" justify="space-between">
                {/* Signatures */}
                <Col xs={24} md={16}>
                  <Row>
                    <Col xs={8}>
                      <div className="signature-section">
                        <p className="signature-label">Buyer</p>
                        <div className="signature-line"></div>
                      </div>
                    </Col>
                    <Col xs={8}>
                      <div className="signature-section">
                        <p className="signature-label">Engineer</p>
                        <div className="signature-line"></div>
                      </div>
                    </Col>
                    <Col xs={8}>
                      <div className="signature-section">
                        <p className="signature-label">Seller</p>
                        <div className="signature-line"></div>
                      </div>
                    </Col>
                  </Row>
                </Col>

                {/* Grand Total */}
                <Col xs={24} md={8}>
                  <div className="total-box right-total">
                    <p className="total-label">Grand Total</p>
                    <p className="grand-total-amount">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(grandTotal)}
                    </p>
                  </div>
                </Col>
              </Row>
            </div>

        </div>
      </div>
    </div>
  );
};

export default InvoiceView;