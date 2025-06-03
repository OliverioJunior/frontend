import styles from "./input.module.css";
interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "primary" | "secondary" | "error" | "terciary";
  label?: string;
}

export const Input: React.FC<IInput> = ({
  variant = "primary",
  label,
  className,
  ...rest
}) => {
  const inputClass = `${styles.inputBase} ${styles[variant]} ${
    className || ""
  }`;
  return (
    <div className={styles.content}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={inputClass} {...rest} />
    </div>
  );
};
