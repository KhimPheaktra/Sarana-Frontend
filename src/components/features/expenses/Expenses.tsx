import dayjs from "dayjs";
import { Card, Form, message } from "antd";
import type { ExpensesType } from "./expenses.types";
import PageHeader from "../../../shared/action-header/ActionHeader";
import { BookOutlined } from "@ant-design/icons";
import ExpensesTable from "./ExpensesTable";
import ExpensesForm from "./ExpensesForm";
import { useAppModal } from "../../../shared/modal/AppModalProvider";


 export const expenses: ExpensesType[] = [
    {
      key: "1",
      expenses_id: 1,
      description: "Party",
      amount: 50,
      expenses_date: "2026-02-02",
      category: "Party",
    },
  ];

const Expenses = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();


  const titleMap = {
    add: "Add Expense",
    edit: "Edit Expense",
    delete: "Delete Expense",
  };

  const openAdd = () => {
    form.resetFields();
    form.setFieldsValue({
      expenses_date: dayjs(),
    });

    openModal("add", {
      titleMap,
      content: <ExpensesForm form={form} />,
      onOk: async () => {
        await form.validateFields();
        message.success("Expenses added successfully");
        closeModal();
      },
    });
  };

  const openEdit = (expense: ExpensesType) => {
    form.setFieldsValue({
      ...expense,
      expenses_date: expense.expenses_date
        ? dayjs(expense.expenses_date)
        : undefined,
    });

    openModal("edit", {
      titleMap,
      content: <ExpensesForm form={form} />,
      onOk: async () => {
        await form.validateFields();
        message.success("Expenses updated successfully");
        closeModal();
      },
    });
  };

  const openDelete = (expense: ExpensesType) => {
    openModal("delete", {
      titleMap,
      content: (
        <p>
          Are you sure you want to delete expense{" "}
          <b>#{expense.expenses_id}</b>?
        </p>
      ),
      onOk: () => {
        message.success("Expenses deleted successfully");
        closeModal();
      },
    });
  };

  return (
    <div className="table-container">
      <PageHeader
        title="Expenses"
        count={expenses.length}
        countLabel="expenses"
        onAdd={openAdd}
        buttonText="Add Expense"
        icon={<BookOutlined />}
      />

      <Card>
        <ExpensesTable
          data={expenses}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </Card>
    </div>
  );
};

export default Expenses;
