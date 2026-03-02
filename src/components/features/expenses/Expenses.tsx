import dayjs from "dayjs";
import { Card, Form, message } from "antd";
import type { ExpensesType } from "./expenses.types";
import PageHeader from "../../../shared/action-header/ActionHeader";
import { BookOutlined } from "@ant-design/icons";
import ExpensesTable from "./ExpensesTable";
import ExpensesForm from "./ExpensesForm";
import { useAppModal } from "../../../shared/modal/AppModalProvider";
import { useSales } from "../sales/SaleContext";

export const expensesData: ExpensesType[] = [
  {
    key: "1",
    expenses_id: 1,
    description: "Party",
    amount: 50,
    expenses_date: "2026-02-02",
    category: "Party",
  },
]

const Expenses = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();
  const { expenses, setExpenses } = useSales();

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
        try {
          const values = await form.validateFields();

          const newId = expenses.length
            ? Math.max(...expenses.map(e => e.expenses_id || 0)) + 1
            : 1;

          const newExpense: ExpensesType = {
            key: String(newId),
            expenses_id: newId,
            description: values.description,
            amount: Number(values.amount),
            expenses_date: dayjs(values.expenses_date).format("YYYY-MM-DD"),
            category: values.category,
          };

          setExpenses(prev => [...prev, newExpense]);
          message.success("Expense added successfully");
          closeModal();
        } catch (err) {
          console.error(err);
        }
      },
    });
  };

  const openEdit = (expense: ExpensesType) => {
    form.setFieldsValue({
      ...expense,
      expenses_date: expense.expenses_date ? dayjs(expense.expenses_date) : undefined,
    });

    openModal("edit", {
      titleMap,
      content: <ExpensesForm form={form} />,
      onOk: async () => {
        try {
          const values = await form.validateFields();

          setExpenses(prev =>
            prev.map(e =>
              e.expenses_id === expense.expenses_id
                ? {
                  ...e,
                  description: values.description,
                  amount: Number(values.amount),
                  expenses_date: dayjs(values.expenses_date).format("YYYY-MM-DD"),
                  category: values.category,
                }
                : e
            )
          );

          message.success("Expense updated successfully");
          closeModal();
        } catch (err) {
          console.error(err);
        }
      },
    });
  };

  const openDelete = (expense: ExpensesType) => {
    openModal("delete", {
      titleMap,
      content: (
        <p>
          Are you sure you want to delete expense <b>#{expense.expenses_id}</b>?
        </p>
      ),
      onOk: () => {
        setExpenses(prev => prev.filter(e => e.expenses_id !== expense.expenses_id));
        message.success("Expense deleted successfully");
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