import { Modal } from "antd";
import React from "react";

export type ModalMode = "add" | "edit" | "delete" | "view";

interface AppModalProps<T extends ModalMode = ModalMode> {
  open: boolean;
  mode: T;
  titleMap: Partial<Record<T, string>>; 
  okTextMap?: Partial<Record<T, string>>;
  onCancel: () => void;
  onOk: () => void;
  children?: React.ReactNode;
}

const AppModal = <T extends ModalMode = ModalMode>({
  open,
  mode,
  titleMap,
  okTextMap,
  onCancel,
  onOk,
  children,
}: AppModalProps<T>) => {
  return (
    <Modal
      open={open}
      title={titleMap[mode] || "Modal"}       
      onCancel={onCancel}
      onOk={onOk}
      okText={okTextMap?.[mode] || titleMap[mode] || "Ok"} 
      okButtonProps={{ danger: mode === "delete" }}
      maskClosable={false}
      destroyOnHidden={false}
      forceRender
    >
      {children}
    </Modal>
  );
};

export default AppModal;
