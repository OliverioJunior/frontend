import React from "react";
import { Loader2 } from "lucide-react";
import styles from "./styles.module.css";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  message,
  className = "",
}) => {
  const sizeClasses = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };

  return (
    <div className={`${styles.container} ${sizeClasses[size]} ${className}`}>
      <Loader2
        className={styles.spinner}
        size={size === "small" ? 16 : size === "large" ? 32 : 24}
      />
      {message && <span className={styles.message}>{message}</span>}
    </div>
  );
};
