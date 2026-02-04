import { Modal } from "antd";
import type { ModalMode,WorkerType } from "./worker.types";
import WorkerForm from "./WorkerForm";

interface Props {
  open: boolean;
  mode: ModalMode;
  worker: WorkerType | null;
  form: any;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const titleMap = {
  add: "Add Worker",
  edit: "Edit Worker",
  delete: "Delete Worker",
};

const WorkerModal: React.FC<Props> = ({
  open,
  mode,
  worker,
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
          Are you sure you want to delete <b>{worker?.name}</b>?
        </p>
      ) : (
        <WorkerForm form={form} />
      )}
    </Modal>
  );
};

export default WorkerModal;
