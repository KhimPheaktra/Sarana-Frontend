import dayjs from "dayjs";
import { Card, Form, message } from "antd";
import type { QuoteType } from "./quote.types";
import PageHeader from "../../../shared/action-header/ActionHeader";
import { FileTextOutlined } from "@ant-design/icons";
import QuoteTable from "./QuoteTable";
import QuoteForm from "./QuoteForm";
import { useAppModal } from "../../../shared/modal/AppModalProvider";
const Quote = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();
  const quotes: QuoteType[] = [
    { key: "1", quote_id: 1, quote_to: "Baktrang", item: "Machin Maintenance", quote_date: "2026-02-02",unit:"SET", qty: 1, discount: 0, total_amount: 100, status: "Approved", notes: "First Approved" },
    { key: "2", quote_id: 2, quote_to: "PP", item: "Engine Service", quote_date: "2026-02-12",unit:"PCs", qty: 1, discount: 0, total_amount: 120, status: "Pending" },
    { key: "3", quote_id: 3, quote_to: "Koh Kong", item: "Electric Maintenance", quote_date: "2026-02-03",unit:"PCs", qty: 1, discount: 0, total_amount: 200, status: "Denied" },
  ];

  const titleMap = {
    add: "Add Quote",
    edit: "Edit Quote",
    delete: "Delete Quote",
  };

  const openAdd = () => {
    form.resetFields();
    form.setFieldsValue({ quote_date: dayjs() });

    openModal("add", {
      titleMap,
      content: <QuoteForm form={form} />,
      onOk: async () => {
        await form.validateFields();
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
      content: <QuoteForm form={form} />,
      onOk: async () => {
        await form.validateFields();
        message.success("Quote updated successfully");
        closeModal();
      },
    });
  };

  const openDelete = (quote: QuoteType) => {
    openModal("delete", {
      titleMap,
      content: (
        <p>
          Are you sure you want to delete quote <b>#{quote.quote_id}</b>?
        </p>
      ),
      onOk: () => {
        message.success("Quote deleted successfully");
        closeModal();
      },
    });
  };



  return (
    <div className="table-container">
      <PageHeader
        title="Quotations"
        count={quotes.length}
        countLabel="quotes"
        onAdd={openAdd}
        buttonText="Add Quote"
        icon={<FileTextOutlined />}
      />

      <Card>
        <QuoteTable
          data={quotes}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </Card>

    </div>
  );
};

export default Quote;