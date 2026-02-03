import { useState } from "react";
import type { ExpensesType, ModalMode } from "./expenses.types";
import dayjs from "dayjs";
import { Card, Form, message } from "antd";
import PageHeader from "../../layout/page_header/pageHeader";
import { BookOutlined } from "@ant-design/icons";
import ExpensesTable from "./expensesTable";
import ExpensesModal from "./expensesModal";
const Expenses = () => {
    const [form] = Form.useForm();
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectExpenses, setSelectedExpenses] = useState<ExpensesType | null>(null);

    const expenses: ExpensesType[] = [
        {key: "1",expenses_id: 1, description: "Party",amount:50,expenses_date:"2026-02-02",category:"Party"},
    ]


    const openAdd = () => {
    setModalMode("add");
    setSelectedExpenses(null);
    form.resetFields();
    setIsModalOpen(true);
     form.setFieldsValue({
    expenses_date: dayjs() 
  });
  };
   
  const openEdit = (expenses: ExpensesType) => {
    setModalMode("edit");
    setSelectedExpenses(expenses);
    form.setFieldsValue({
      ...expenses,
      expenses_date: expenses.expenses_date ? dayjs(expenses.expenses_date) : undefined
    });
    setIsModalOpen(true);
  };

  const openDelete = (expenses: ExpensesType) => {
    setModalMode("delete");
    setSelectedExpenses(expenses);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await form.validateFields();
    if(modalMode === "edit"){
      message.success("Expenses updated successfully  ");
    }else{
      message.success("Expenses added successfully");
    }
    closeModal();
  };

  const handleDelete = () => {
    message.success("Expenses deleted successfully");
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
    setSelectedExpenses(null);
  };

  return(
     <>
        <div className="table-container">
        <PageHeader
                title="Expenses Management"
                count={expenses.length}
                countLabel="expenses"
                onAdd={openAdd}
                icon={<BookOutlined />}
            />
        <Card>
            <ExpensesTable
                data={expenses}
                onEdit={openEdit}
                onDelete={openDelete}
            />
                
        </Card>
          <ExpensesModal
            open={isModalOpen}
            mode={modalMode}
            expenses={selectExpenses}
            form={form}
            onCancel={closeModal}
            onSave={handleSave}
            onDelete={handleDelete}
        />
      </div>
    </>
  )

}

export default Expenses;