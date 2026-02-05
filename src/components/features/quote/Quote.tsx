import { useState } from "react";
import type { ModalMode, QuoteType } from "./quote.types";
import { Card, Form, message } from "antd";
import dayjs from "dayjs";
import PageHeader from "../../layout/pageHeader/PageHeader";
import QuoteTable from "./QuoteTable";
import { FileTextOutlined } from "@ant-design/icons";
import QuoteModal from "./QuoteModal";

const Quote = () =>{
    const [form] = Form.useForm();
    const [modalMode,setModalMode] = useState<ModalMode>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuote,setSelectedQuote] = useState<QuoteType | null>(null)

    const quotes: QuoteType[] = [
        {key:"1",quote_id:1,item: "Machin Maintenance",quote_date: "02-02-2026",total_amount: 100,status:"Approved",notes:"First Approved"},
        {key:"2",quote_id:2,item: "Engine Service",quote_date: "12-02-2026",total_amount: 120,status:"Pendding"},
        {key:"1",quote_id:3,item: "Electric Maintenance",quote_date: "03-02-2026",total_amount: 200,status:"Denied"},
    ]

    const openAdd = () => {
    setModalMode("add");
    setSelectedQuote(null);
    form.resetFields();
    setIsModalOpen(true);
     form.setFieldsValue({
    quote_date: dayjs() 
  });
  };
   
  const openEdit = (quote: QuoteType) => {
    setModalMode("edit");
    setSelectedQuote(quote);
    form.setFieldsValue({
      ...quote,
      quote_date: quote.quote_date ? dayjs(quote.quote_date) : undefined
    });
    setIsModalOpen(true);
  };

  const openDelete = (quote: QuoteType) => {
    setModalMode("delete");
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await form.validateFields();
    if(modalMode === "edit"){
      message.success("Quote updated successfully  ");
    }else{
      message.success("Quote added successfully");
    }
    closeModal();
  };

  const handleDelete = () => {
    message.success("Quote deleted successfully");
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
    setSelectedQuote(null);
  };
    return (
       <>
        <div className="table-container">
        <PageHeader
                title="Quotations"
                count={quotes.length}
                countLabel="quotes"
                onAdd={openAdd}
                icon={<FileTextOutlined  />}
            />
        <Card>
            <QuoteTable
                data={quotes}
                onEdit={openEdit}
                onDelete={openDelete}
            />
                
        </Card>
          <QuoteModal
            open={isModalOpen}
            mode={modalMode}
            quote={selectedQuote}
            form={form}
            onCancel={closeModal}
            onSave={handleSave}
            onDelete={handleDelete}
        />
      </div>
    </>
    )
}

export default Quote;