import React, { useRef } from 'react';
import { Button, Space, Row, Col, Divider } from 'antd';
import { PrinterOutlined, CloseOutlined } from '@ant-design/icons';
import type { InvoiceType } from './invoice.types';
import './InvoiceView.css';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Props {
  invoice: InvoiceType;
  items?: InvoiceItem[]; 
  onClose: () => void;
}

const companyInfo = {
  name: "Senghun Workshop",
  subtitle: "Creative Pricing Precision",
  services: "Latching and Repairing all machine spare parts",
  address: "Google maps: (10.6272700, 103.5660414)",
  website: "https://senghunworkshop.com",
  phones: "081555282 / 070572830 / 098236788",
  email: "senghun672@gmail.com",
  engineerEmail: "engineer@senghunworkshop.com"
};

const InvoiceView: React.FC<Props> = ({ invoice, items, onClose }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const lineItems = items && items.length > 0 
    ? items.map((item, index) => ({
        no: index + 1,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.amount
      }))
    : [
        {
          no: 1,
          description: 'Item 1',
          quantity: 1,
          unitPrice: 100,
          amount: 100
        },
        {
          no: 2,
          description: 'Item 2',
          quantity: 2,
          unitPrice: 50,
          amount: 100
        },
        {
          no: 3,
          description: 'Item 3',
          quantity: 1,
          unitPrice: 158,
          amount: 158
        }
      ];

  const grandTotal = lineItems.reduce((sum, item) => sum + item.amount, 0);

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
            <Row gutter={16}>
              <Col span={14}>
                <div className="company-info">
                  <h1 className="company-name">{companyInfo.name}</h1>
                  <p className="company-subtitle">{companyInfo.subtitle}</p>
                  <p className="company-services">{companyInfo.services}</p>
                  <div className="contact-info">
                    <p>{companyInfo.address}</p>
                    <p>Website: {companyInfo.website}</p>
                    <p>📞 {companyInfo.phones}</p>
                    <p>✉ {companyInfo.email}</p>
                    <p>✉ {companyInfo.engineerEmail}</p>
                  </div>
                </div>
              </Col>
              <Col span={10}>
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
                <th style={{ width: '40%' }}>Description</th>
                <th style={{ width: '15%' }}>Quantity</th>
                <th style={{ width: '20%' }}>Unit Price</th>
                <th style={{ width: '25%' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <tr key={item.no}>
                  <td className="text-center">{item.no}</td>
                  <td>{item.description}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">{item.unitPrice}</td>
                  <td className="text-right">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div className="invoice-footer">
            <Row gutter={16}>
              <Col span={8}>
                <div className="signature-section">
                  <p className="signature-label">The Buyer</p>
                  <div className="signature-line"></div>
                </div>
              </Col>
              <Col span={8}>
                <div className="signature-section">
                  <p className="signature-label">Engineer/The Seller</p>
                  <div className="signature-line"></div>
                </div>
              </Col>
              <Col span={8}>
                <div className="total-section">
                  <p className="total-label">Grand Total </p>
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