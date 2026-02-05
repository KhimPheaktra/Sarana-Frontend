import { Modal } from "antd";
import type { ModalMode, QuoteType } from "./quote.types";
import QuoteForm from "./QuoteForm";



interface Props {
  open: boolean;
  mode: ModalMode;
  quote: QuoteType | null;
  form: any;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const titleMap = {
  add: "Add Quote",
  edit: "Edit Quote",
  delete: "Delete Quote",
};

const QuoteModal: React.FC<Props> = ({
  open,
  mode,
  quote,
  form,
  onCancel,
  onSave,
  onDelete,
}) => {
  if (!mode) return null;

  return (
    <Modal
      open={open}
      title={titleMap[mode]}
      onCancel={onCancel}
      onOk={mode === "delete" ? onDelete : onSave}
      okText={
        mode === "delete" ? "Delete"
        : mode === "edit" ? "Edit"
        : "Add"
      }
      okButtonProps={{ danger: mode === "delete" }}
    >
      {mode === "delete" ? (
        <p>
          Are you sure you want to delete <b>{quote?.quote_id}</b>?
        </p>
      ) : (
        <QuoteForm form={form} />
      )}
    </Modal>
  );
};

export default QuoteModal;