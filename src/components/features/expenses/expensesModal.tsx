import { Modal } from "antd";
import type { ExpensesType, ModalMode } from "./expenses.types";
import ExpensesForm from "./ExpensesForm";




interface Props {
  open: boolean;
  mode: ModalMode;
  expenses: ExpensesType | null;
  form: any;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const titleMap = {
  add: "Add Expenses",
  edit: "Edit Expenses",
  delete: "Delete Expenses",
};
const ExpensesModal: React.FC<Props> = ({
  open,
  mode,
  expenses,
  form,
  onCancel,
  onSave,
  onDelete,
}) => {

  return (
    <Modal
      open={open}
      title={mode ? titleMap[mode] : ""}
      onCancel={onCancel}
      onOk={mode === "delete" ? onDelete : onSave}
      okText={
        mode === "delete"
          ? "Delete"
          : mode === "edit"
          ? "Edit"
          : "Add"
      }
      okButtonProps={{ danger: mode === "delete" }}
      destroyOnHidden={false}
      forceRender
      maskClosable={false}
    >
      {mode === "delete" ? (
        <p>
          Are you sure you want to delete <b>{expenses?.expenses_id}</b>?
        </p>
      ) : (
        <ExpensesForm form={form} />
      )}
    </Modal>
  );
};

export default ExpensesModal;