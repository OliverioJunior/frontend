import React from "react";
import { Link } from "react-router";
import styles from "./Management.module.css";
import { ChevronRight } from "lucide-react";
interface ManagementProps {
  title: string;
  description: string;
  to: string;
  className?: string;
  variant?: "default" | "primary" | "secondary" | "outlined";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const Management: React.FC<ManagementProps> = ({
  title,
  description,
  to,
  className = "",
  variant = "default",
  size = "medium",
  disabled = false,
  icon = null,
  onClick,
}) => {
  // Construção das classes CSS
  const cardClasses = [
    styles.card,
    styles[`card${size.charAt(0).toUpperCase() + size.slice(1)}`],
    styles[`card${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    disabled && styles.cardDisabled,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const buttonClasses = [
    styles.button,
    styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    disabled && styles.buttonDisabled,
  ]
    .filter(Boolean)
    .join(" ");

  // Handler para clique
  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  return (
    <article className={cardClasses} onClick={handleClick}>
      {/* Header do card */}
      <header className={styles.header}>
        <div className={styles.titleSection}>
          {icon && <div className={styles.iconContainer}>{icon}</div>}
          <h2 className={styles.title}>{title}</h2>
        </div>
        <p className={styles.description}>{description}</p>
      </header>

      {/* Footer com botão */}
      <footer className={styles.footer}>
        <Link
          to={to}
          className={buttonClasses}
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onClick={(e) => {
            if (disabled) {
              e.preventDefault();
            }
          }}
        >
          <span>Acessar</span>
          <ChevronRight className={styles.buttonIcon} />
        </Link>
      </footer>
    </article>
  );
};
