import dayjs from "dayjs";
import { useState } from "react";
import { Card, Form, Grid, Modal, message } from "antd";
import type { QuoteType } from "./quote.types";
import ActionHeader from "../../../shared/action-header/ActionHeader";
import { FileTextOutlined } from "@ant-design/icons";
import QuoteTable from "./QuoteTable";
import QuoteForm from "./QuoteForm";
import QuotePrintView from "./QuotePrintView";
import { useAppModal } from "../../../shared/modal/AppModalProvider";
import { useSales } from "../sales/SaleContext";
import { useTranslation } from "react-i18next";

const { useBreakpoint } = Grid;

export const quotesData: QuoteType[] = [
  {
    key: "1",
    quote_id: 1,
    quote_to: "Baktrang",
    quote_date: "2026-02-02",
    items: [
      { item_name: "Machine Maintenance", qty: 1, unit: "SET", unit_price: 100, amount: 100 },
      { item_name: "Service Engine", qty: 1, unit: "SET", unit_price: 120, amount: 120 },
    ],
    discount: 0,
    total_amount: 220,
    status: "Approved",
    engineer: "Tra",
    notes: "First Approved",
  },
  {
    key: "2",
    quote_id: 2,
    quote_to: "PP",
    quote_date: "2026-02-03",
    items: [{ item_name: "Engine Service", qty: 1, unit: "PCs", unit_price: 120, amount: 120 }],
    discount: 0,
    total_amount: 120,
    status: "Approved",
  },
  {
    key: "3",
    quote_id: 3,
    quote_to: "PP",
    quote_date: "2026-02-12",
    items: [{ item_name: "Engine Service", qty: 1, unit: "PCs", unit_price: 120, amount: 120 }],
    discount: 0,
    total_amount: 120,
    status: "Pending",
  },
  {
    key: "4",
    quote_id: 4,
    quote_to: "Koh Kong",
    quote_date: "2026-02-03",
    items: [{ item_name: "Electric Maintenance", qty: 1, unit: "PCs", unit_price: 200, amount: 200 }],
    discount: 0,
    total_amount: 200,
    status: "Denied",
  },
];

const Quote = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();
  const { quotes, setQuotes } = useSales();
  const screens = useBreakpoint();
  const { t } = useTranslation();
  const [selectedQuote, setSelectedQuote] = useState<QuoteType | null>(null);
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const username = sessionStorage.getItem('username') || 'User';
  const handleView = (quote: QuoteType) => {
    setSelectedQuote(quote);
    setIsPrintModalVisible(true);
  };

  const handleClosePrintModal = () => {
    setIsPrintModalVisible(false);
    setSelectedQuote(null);
  };

  const getModalWidth = () => {
    if (!screens.md) return "100%";
    if (!screens.lg) return "90%";
    return "800px";
  };
  const computeTotal = (values: any): number => {
    return (values.items || []).reduce(
      (sum: number, row: any) => sum + (row.amount || 0),
      0
    );
  };


  const sanitizeValues = (values: any) => ({
    ...values,
    quote_date: values.quote_date
      ? dayjs(values.quote_date).format("YYYY-MM-DD")
      : "",
    total_amount: computeTotal(values),
  });


  const titleMap = {
    add: t("modal.addTitle", { name: t("title.quotation") }),
    edit: t("modal.editTitle", { name: t("title.quotation") }),
    delete: t("modal.deleteTitle", { name: t("title.quotation") }),
  };
  const okTextMap = {
    add: t("modal.okText"),
    edit: t("modal.okText"),
    delete: t("modal.deleteOkText"),
  };

  const openAdd = () => {
    form.resetFields();
    form.setFieldsValue({ quote_date: dayjs() });
    openModal("add", {
      titleMap,
      okTextMap,
      content: <QuoteForm form={form} />,
      cancelText: t("modal.cancelText", { ns: "common" }),
      onOk: async () => {
        await form.validateFields();
        const newQuote: QuoteType = {
          key: `${quotes.length + 1}`,
          quote_id: quotes.length + 1,
          ...sanitizeValues(form.getFieldsValue()),
           created_by: username,
        };
        setQuotes(prev => [...prev, newQuote]);
        message.success("Quote added successfully");
        closeModal();
      },
    });
  };

  const openEdit = (quote: QuoteType) => {
    form.setFieldsValue({
      ...quote,
      quote_date: quote.quote_date ? dayjs(quote.quote_date) : undefined,
    });
    openModal("edit", {
      titleMap,
      okTextMap,
      content: <QuoteForm form={form} />,
      cancelText: t("modal.cancelText", { ns: "common" }),
      onOk: async () => {
        await form.validateFields();
        const updated = sanitizeValues(form.getFieldsValue());
        setQuotes(prev =>
          prev.map(q =>
            q.quote_id === quote.quote_id
              ? { ...q, ...updated }
              : q
          )
        );
        message.success("Quote updated successfully");
        closeModal();
      },
    });
  };

  const openDelete = (quote: QuoteType) => {
    openModal("delete", {
      titleMap,
      okTextMap,
      cancelText: t("modal.cancelText", { ns: "common" }),
      content: (
        <p>
          Are you sure you want to delete quote <b>#{quote.quote_id}</b>?
        </p>
      ),
      onOk: () => {
        setQuotes(prev => prev.filter(q => q.quote_id !== quote.quote_id));
        message.success("Quote deleted successfully");
        closeModal();
      },
    });
  };

  return (
    <div className="table-container">
      <ActionHeader
        title={t("title.quotation")}
        count={quotes.length}
        countLabel={t("title.quotation", { ns: "common" })}
        onAdd={openAdd}
        buttonText={t("button.add")}
        icon={<FileTextOutlined />}
      />
      <Card>
        <QuoteTable
          data={quotes}
          onEdit={openEdit}
          onDelete={openDelete}
          onView={handleView}
        />
      </Card>

      {/* Print view Modal */}
      <Modal
        title={!screens.md ? null : "Quotation Preview"}
        open={isPrintModalVisible}
        onCancel={handleClosePrintModal}
        footer={null}
        width={getModalWidth()}
        style={{
          top: !screens.md ? 0 : 20,
          margin: !screens.md ? 0 : undefined,
          maxWidth: !screens.md ? "100%" : undefined,
          paddingBottom: !screens.md ? 0 : undefined,
        }}
        styles={{
          body: {
            padding: !screens.md ? "10px" : "24px",
            maxHeight: !screens.md ? "100vh" : "calc(100vh - 100px)",
            overflow: "auto",
          },
        }}
        destroyOnHidden
      >
        {selectedQuote && (
          <QuotePrintView
            quote={selectedQuote}
            onClose={handleClosePrintModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default Quote;