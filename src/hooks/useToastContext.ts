import { useContext } from "react";
import { ToastContext, type ToastContextType } from "../context/ToastContext";

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext deve ser usado dentro de ToastProvider");
  }
  return context;
};
