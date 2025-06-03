// src/domains/student/components/StudentManagement.tsx
import styles from "./Management.module.css";
import { Link } from "react-router";

type TManagement = {
  title: string;
  description: string;
  to: string;
  className?: string;
};

export const Management = ({
  title,
  description,
  to,
  className,
}: TManagement) => {
  return (
    <div className={styles.card + ` ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>

      <button className={styles.button}>
        <Link to={to}>Acessar</Link>
      </button>
    </div>
  );
};
