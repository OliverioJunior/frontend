import React from "react";
import { AlertCircle, X } from "lucide-react";
import styles from "./styles.module.css";

interface ErrorMessageProps {
  message: string;
  size?: "small" | "medium" | "large";
  onDismiss?: () => void;
  className?: string;
  id?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  size = "medium",
  onDismiss,
  className = "",
  id,
}) => {
  const sizeClasses = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };

  return (
    <div
      className={`${styles.container} ${sizeClasses[size]} ${className}`}
      role="alert"
      aria-live="polite"
      id={id}
    >
      <div className={styles.content}>
        <AlertCircle className={styles.icon} />
        <span className={styles.message}>{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={styles.dismissButton}
          aria-label="Fechar mensagem de erro"
          type="button"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
