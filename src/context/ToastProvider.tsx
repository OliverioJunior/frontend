import React, { type ReactNode } from "react";
import { ToastContext, type ToastContextType } from "./ToastContext";
import { ToastContainer, useToast } from "../shared/components/Toast";

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toast = useToast();

  const contextValue: ToastContextType = {
    success: (message: string, title?: string) => toast.success(message, title),
    error: (message: string, title?: string) => toast.error(message, title),
    warning: (message: string, title?: string) => toast.warning(message, title),
    info: (message: string, title?: string) => toast.info(message, title),
    clearAll: toast.clearAllToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </ToastContext.Provider>
  );
};
