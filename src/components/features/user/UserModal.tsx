import { Modal } from "antd";
import type { ModalMode, UserType } from "./user.types";
import UserForm from "./UserForm";

interface Props {
  open: boolean;
  mode: ModalMode;
  user: UserType | null;
  form: any;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const titleMap = {
  add: "Add User",
  edit: "Edit User",
  delete: "Delete User",
};

const UserModal: React.FC<Props> = ({
  open,
  mode,
  user,
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
          Are you sure you want to delete <b>{user?.name}</b>?
        </p>
      ) : (
        <UserForm form={form} />
      )}
    </Modal>
  );
};

export default UserModal;
