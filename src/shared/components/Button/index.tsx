import styles from "./button.module.css";
interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "error" | "ghost" | "outline";
  size?: "small" | "medium" | "large";
}

export const Button: React.FC<IButton> = ({
  variant = "primary",
  size = "small",
  className,
  ...rest
}) => {
  const buttonClass = `${styles.buttonBase} ${styles[variant]} ${
    styles[size]
  } ${className || ""}`;
  return <button className={buttonClass} {...rest} />;
};
