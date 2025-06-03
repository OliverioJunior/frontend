import React, { useState, useEffect } from "react";
import styles from "./toast.module.css";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastData {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  autoClose?: boolean;
}

interface ToastProps {
  toast: ToastData;
  onClose: (id: string) => void;
}

interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: string) => void;
}

// Hook para gerenciar toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      id,
      duration: 5000,
      autoClose: true,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  // Métodos de conveniência
  const success = (
    message: string,
    title?: string,
    options?: Partial<ToastData>
  ) => addToast({ type: "success", message, title, ...options });

  const error = (
    message: string,
    title?: string,
    options?: Partial<ToastData>
  ) => addToast({ type: "error", message, title, ...options });

  const warning = (
    message: string,
    title?: string,
    options?: Partial<ToastData>
  ) => addToast({ type: "warning", message, title, ...options });

  const info = (
    message: string,
    title?: string,
    options?: Partial<ToastData>
  ) => addToast({ type: "info", message, title, ...options });

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  };
};

// Componente Toast individual
const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Animação de entrada
    const enterTimer = setTimeout(() => setIsVisible(true), 50);

    return () => clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    if (!toast.autoClose || !toast.duration) return;

    const startTime = Date.now();
    const duration = toast.duration;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      const progressPercent = (remaining / duration) * 100;

      setProgress(progressPercent);

      if (remaining <= 0) {
        handleClose();
      }
    };

    const progressInterval = setInterval(updateProgress, 100);

    return () => clearInterval(progressInterval);
  }, [toast.autoClose, toast.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 300);
  };

  const getToastTypeClass = () => {
    switch (toast.type) {
      case "success":
        return styles.toastSuccess;
      case "error":
        return styles.toastError;
      case "warning":
        return styles.toastWarning;
      case "info":
        return styles.toastInfo;
      default:
        return styles.toastInfo;
    }
  };

  const getAnimationClass = () => {
    if (isExiting) return styles.toastExiting;
    if (isVisible) return styles.toastVisible;
    return styles.toastEntering;
  };

  return (
    <div
      className={`${
        styles.toast
      } ${getToastTypeClass()} ${getAnimationClass()} relative overflow-hidden`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.toastContent}>
        {toast.title && <div className={styles.toastTitle}>{toast.title}</div>}
        <div className={styles.toastMessage}>{toast.message}</div>
      </div>

      <button
        onClick={handleClose}
        className={styles.closeButton}
        aria-label="Fechar notificação"
      >
        X
      </button>

      {toast.autoClose && (
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      )}
    </div>
  );
};

// Container de Toasts
export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className={`${styles.toastContainer} sm:right-4 sm:left-auto right-4 left-4`}
      aria-live="polite"
      aria-label="Notificações"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};
