import React, { useState } from 'react';
import { Modal, Grid, Card, Form, message } from 'antd';
import dayjs from 'dayjs';
import InvoiceTable from './InvoiceTable';
import type { InvoiceType } from './invoice.types';
import type { CommissionType } from '../commision/commission.types';
import ActionHeader from '../../../shared/action-header/ActionHeader';
import InvoicePrintForm from './InvoicePrintForm';
import ProjectCommissionForm from '../commision/project-commission/ProjectCommissionForm';
import { useSales } from '../sales/SaleContext';
import { useAppModal } from '../../../shared/modal/AppModalProvider';
import InvoiceForm from './InvoiceForm';
import { paymentFromInvoice } from '../payement/Autogeneratepayment';
import { useTranslation } from 'react-i18next';


const { useBreakpoint } = Grid;

export const invoiceData: InvoiceType[] = [
  {
    key: '1', invoice_id: 1, customer_id: 101, customer_name: "Tra", type: "invoice",
    invoice_date: '2026-02-07', payment_id: 0, quote_to: '', engineer: 'Long',
    items: [{ item_name: 'Fire Service', qty: 1, unit_price: 250, discount: 0, amount: 250 }],
    total_amount: 250, status: 'Completed',
  },
  {
    key: '2', invoice_id: 2, customer_id: 102, customer_name: "Long",type: "invoice",
    invoice_date: '2026-02-06', quote_to: '', payment_id: 0, engineer: 'Som',
    items: [{ item_name: 'Machin Service', qty: 2, unit_price: 150, discount: 0, amount: 300 }],
    total_amount: 300, status: 'Pending',
  },
  {
    key: '3', invoice_id: 3, customer_id: 103, customer_name: "Som",type: "invoice",
    invoice_date: '2025-02-06', quote_to: '', payment_id: 0, engineer: 'Tra',
    items: [{ item_name: 'Electric Service', qty: 2, unit_price: 150, discount: 0, amount: 300 }],
    total_amount: 300, status: 'Pending',
  },
];

const Invoice: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [commissionForm] = Form.useForm();
  const { openModal, closeModal } = useAppModal();
  const { invoices, setInvoices, commissions, setCommissions, payments, setPayments } = useSales();
  const screens = useBreakpoint();
  const { t } = useTranslation();
  const handleView = (invoice: InvoiceType) => {
    setSelectedInvoice(invoice);
    setIsModalVisible(true);
  };

  const handleDelete = () => message.info("No action on delete yet");

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedInvoice(null);
  };

  const handleAddCommission = (invoice: InvoiceType) => {
    const alreadyExists = commissions.some(c => c.invoice_id === invoice.invoice_id);
    if (alreadyExists) {
      message.warning(`A commission for INV-${invoice.invoice_id} already exists. Edit it from Project Commissions.`);
      return;
    }

    const rate = 30;
    const prefilledValues = {
      invoice_id: invoice.invoice_id,
      project: invoice.items.map(i => i.item_name).join(', '),
      engineer: invoice.engineer ?? '',
      invoice_total: invoice.total_amount,
      commission_rate: rate,
      amount: parseFloat(((invoice.total_amount * rate) / 100).toFixed(2)),
      commission_date: dayjs(),
      status: 'Pending',
    };

    commissionForm.resetFields();
    commissionForm.setFieldsValue(prefilledValues);

    openModal('add', {
      titleMap: { add: `Add Commission For: ${invoice.engineer}` },
      content: <ProjectCommissionForm form={commissionForm} lockedFields={['invoice_id', 'project', 'invoice_total']} />,
      onOk: async () => {
        const v = await commissionForm.validateFields();

        const newId = commissions.length
          ? Math.max(...commissions.map(c => c.commission_id)) + 1
          : 1;

        const newCommission: CommissionType = {
          key: String(newId),
          commission_id: newId,
          invoice_id: v.invoice_id ?? invoice.invoice_id,
          project: v.project ?? prefilledValues.project,
          engineer: v.engineer,
          invoice_total: Number(v.invoice_total ?? invoice.total_amount),
          commission_rate: Number(v.commission_rate),
          amount: Number(v.amount),
          commission_date: dayjs(v.commission_date).format('YYYY-MM-DD'),
          description: v.description ?? '',
          status: v.status,
        };

        setCommissions(prev => [...prev, newCommission]);
        message.success(`Commission $${newCommission.amount.toFixed(2)} added for ${newCommission.engineer || 'engineer'}`);
        closeModal();
      },

    });

    setTimeout(() => {
      commissionForm.resetFields();
      commissionForm.setFieldsValue(prefilledValues);
    }, 0);


  };

  const getModalWidth = () => {
    if (!screens.md) return '100%';
    if (!screens.lg) return '80%';
    return '60%';
  };
  const titleMap = {
    add: t("modal.addTitle", { name: t("title.invoice") }),
    edit: t("modal.editTitle", { name: t("title.invoice") }),
    delete: t("modal.deleteTitle", { name: t("title.invoice") }),
    view: t("title.invoice"),
  };
  const okTextMap = {
    add: t("modal.okText"),
    edit: t("modal.okText"),
    delete: t("modal.deleteOkText"),
  };

  const openAdd = () => {
    form.resetFields();
    form.setFieldsValue({ invoice_date: dayjs() });
    openModal("add", {
      titleMap,
      okTextMap,
      content: <InvoiceForm form={form} />,
      cancelText: t("modal.cancelText", { ns: "common" }),
      width: 800,
      onOk: async () => {
        const values = await form.validateFields();
        const newId = invoices.length > 0 ? Math.max(...invoices.map((inv) => inv.invoice_id)) + 1 : 1;

        const newInvoice: InvoiceType = {
          key: String(newId),
          invoice_id: newId,
          customer_id: values.customer_id ?? 0,
          customer_name: values.customer_name,
          reference_id: values.reference_id,
          engineer: values.engineer,
          invoice_date: values.invoice_date?.format("YYYY-MM-DD") ?? dayjs().format("YYYY-MM-DD"),
          type: "invoice",
          items: (values.invoices ?? []).map((item: any) => ({
            item_name: item.item_name,
            qty: Number(item.qty),
            unit_price: Number(item.unit_price),
            discount: Number(item.discount ?? 0),
            amount: Number(item.amount),

          })),
          total_amount: Number(values.total_amount),
          status: values.status,
          payment_id: 0,
          quote_to: "",
        };
        setInvoices((prev) => [...prev, newInvoice]);
        const autoPayment = paymentFromInvoice(newInvoice, payments);
        setPayments((prev) => [...prev, autoPayment]);
        message.success("Invoice added successfully");
        closeModal();
      }
    })
  }

  React.useEffect(() => {
    if (invoices.length === 0) setInvoices(invoiceData);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <ActionHeader
        title={t("title.invoice")}
        count={invoices.length}
        countLabel={t("title.invoice", { ns: "common" })}
        onAdd={openAdd}
        buttonText={t("button.add")}
        icon={undefined} />

      <Card>
        <InvoiceTable
          data={invoices}
          onView={handleView}
          onDelete={handleDelete}
          onAddCommission={handleAddCommission}
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
          paddingBottom: !screens.md ? 0 : undefined,
        }}
        styles={{
          body: {
            padding: !screens.md ? '10px' : '24px',
            maxHeight: !screens.md ? '100vh' : 'calc(100vh - 100px)',
            overflow: 'auto',
          },
        }}
        destroyOnHidden
      >
        {selectedInvoice && (
          <InvoicePrintForm invoice={selectedInvoice} onClose={handleCloseModal} />
        )}
      </Modal>
    </div>
  );
};

export default Invoice;