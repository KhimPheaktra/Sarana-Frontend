import { Modal } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

export type ModalMode = "add" | "edit" | "delete" | "view";

interface AppModalProps<T extends ModalMode = ModalMode> {
  open: boolean;
  mode: T;
  titleMap: Partial<Record<T, string>>; 
  okTextMap?: Partial<Record<T, string>>;
  cancelText?: string;
  onCancel: () => void;
  onOk: () => void;
  children?: React.ReactNode;
  width?: number;
}

const AppModal = <T extends ModalMode = ModalMode>({
  open,
  mode,
  titleMap,
  okTextMap,
  cancelText,
  onCancel,
  onOk,
  children,
  width, 
}: AppModalProps<T>) => {
  const {t} = useTranslation();
  return (
    <Modal
  open={open}
  title={titleMap[mode] || "Modal"}
  onCancel={onCancel}
  onOk={onOk}
  okText={okTextMap?.[mode] || titleMap[mode] || "Ok"}
  cancelText={mode === "view" ? t("modal.cancelText") : cancelText}
  okButtonProps={{ 
    danger: mode === "delete",
    style: { display: mode === "view" ? "none" : "inline-flex" }
  }}
  maskClosable={false}
  destroyOnHidden={true}
  forceRender
  width={width ?? 600}
  zIndex={1100}
>
  {children}
</Modal>
  );
};

export default AppModal;
