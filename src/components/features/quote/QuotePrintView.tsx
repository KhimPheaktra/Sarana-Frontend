import React from 'react';
import { Button, Space } from 'antd';
import { PrinterOutlined, CloseOutlined } from '@ant-design/icons';
import type { QuoteType } from './quote.types';
import { PrintQuote } from './PrintQuote';
import Banner from './../../../assets/images/banner.png';
import dayjs from 'dayjs';
import './QuotePrintView.css';

interface Props {
  quote: QuoteType;
  onClose: () => void;
}

const QuotePrintView: React.FC<Props> = ({ quote, onClose }) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  const subTotal  = quote.total_amount;
  const discount  = quote.discount || 0;
  const vat       = quote.wth || 0;
  const totalPaid = subTotal - discount + vat;
  return (
    <>
      {/* Toolbar */}
      <div className="quote-actions">
        <Space>
          <Button type="primary" icon={<PrinterOutlined />} onClick={() => PrintQuote(quote)}>
            Print
          </Button>
          <Button icon={<CloseOutlined />} onClick={onClose}>
            Close
          </Button>
        </Space>
      </div>

      {/* Paper */}
      <div className="quote-paper">

        {/* Banner */}
        <div className="quote-banner">
          <img src={Banner} alt="Company Banner" />
        </div>

        {/* Workshop info + Quote title */}
        <div className="quote-header">
          <table className="quote-table quote-info-table">
            <tbody>
              {[
                ['INCHARGE', 'Senghun Workshop'],
                ['TEL :',    '070572830'],
                ['E-MAIL :', 'engineer@senghunworkshop.com'],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td className="label-col">{label}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="quote-title-block">
            <h1>Quotation</h1>
            <div><strong>Seller :</strong> {quote.created_by}</div>
            <div><strong>NO  :</strong> {quote.quote_id}</div>
            <div className="quote-date">
              <strong>Date :</strong> {dayjs(quote.quote_date).format('DD/MM/YYYY')}
            </div>
          </div>
        </div>

        {/* Customer info */}
        <table className="quote-table quote-customer-table">
          <tbody>
            <tr>
              <td className="label-col">ATTN TO :</td>
              <td>{quote.quote_to}</td>
            </tr>
            <tr>
              <td className="label-col">COMPANY :</td>
              <td></td>
            </tr>
            <tr>
              <td className="label-col">ADDRESS :</td>
              <td className="address-row"></td>
            </tr>
          </tbody>
        </table>

        {/* Items table */}
        <table className="quote-table quote-items-table">
          <thead>
            <tr>
              <th style={{ width: '8%'  }}>No</th>
              <th style={{ width: '42%' }}>Description</th>
              <th style={{ width: '10%' }}>Qty</th>
              <th style={{ width: '12%' }}>Unit</th>
              <th style={{ width: '14%' }}>Unit Price</th>
              <th style={{ width: '14%' }}>Amount (USD)</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((row, i) => (
              <tr key={i}>
                <td className="col-center">{i + 1}</td>
                <td>{row.item_name}</td>
                <td className="col-center">{row.qty}</td>
                <td className="col-center">{row.unit}</td>
                <td className="col-right">$ {formatCurrency(row.unit_price)}</td>
                <td className="col-right">$ {formatCurrency(row.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="quote-totals">
          <table className="quote-totals-table">
            <tbody>
              {[
                { label: 'Sub Total',  value: `$ ${formatCurrency(subTotal)}`,                bold: false },
                { label: 'Discount',   value: `$ ${formatCurrency(discount)}`,                bold: false },
                { label: 'VAT',        value: vat > 0 ? `$ ${formatCurrency(vat)}` : 'N/A',  bold: false },
                { label: 'Total Paid', value: `$ ${formatCurrency(totalPaid)}`,               bold: true  },
              ].map(({ label, value, bold }) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td className={`value-col${bold ? ' total-paid' : ''}`}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Remark */}
        <div className="quote-remark">
          <div className="remark-title">REMARK :</div>
          <div className="remark-content">{quote.notes || ''}</div>
        </div>

        {/* Signatures */}
        <div className="quote-signatures">
        
          {['Customer Name & Signature', 'Seller Name & Signature'].map((label) => (
            <div key={label} className="sig-block"> 
              <div className="sig-line" />
              <div>{label}</div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
};

export default QuotePrintView;