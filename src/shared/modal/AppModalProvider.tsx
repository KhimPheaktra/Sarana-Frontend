import React, { createContext, useContext, useState } from "react";
import AppModal, { type ModalMode } from "./AppModal";

export interface ModalConfig<T extends ModalMode = ModalMode> {
  titleMap: Partial<Record<T, string>>; 
  okTextMap?: Partial<Record<T, string>>;
  content: React.ReactNode;
  onOk: () => void;
}

interface AppModalContextType {
  openModal: <T extends ModalMode>(
    mode: T,
    config: ModalConfig<T>
  ) => void;
  closeModal: () => void;
}

const AppModalContext = createContext<AppModalContextType | null>(null);

export const AppModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("add");
  const [config, setConfig] = useState<ModalConfig<any> | null>(null);

  const closeModal = () => setOpen(false);

  const openModal = <T extends ModalMode>(mode: T, config: ModalConfig<T>) => {
    setMode(mode);
    setConfig(config);
    setOpen(true);
  };

  return (
    <AppModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {config && (
        <AppModal
          open={open}
          mode={mode}
          titleMap={config.titleMap}
          okTextMap={config.okTextMap}
          onCancel={closeModal}
          onOk={config.onOk}
        >
          {config.content}
        </AppModal>
      )}
    </AppModalContext.Provider>
  );
};

export const useAppModal = () => {
  const ctx = useContext(AppModalContext);
  if (!ctx) throw new Error("useAppModal must be used inside AppModalProvider");
  return ctx;
};
