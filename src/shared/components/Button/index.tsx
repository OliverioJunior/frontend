import styles from "./input.module.css";
interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "error";
}

export const Button: React.FC<IButton> = ({
  variant = "primary",
  className,
  ...rest
}) => {
  const buttonClass = `${styles.buttonBase} ${styles[variant]} ${
    className || ""
  }`;
  return <button className={buttonClass} {...rest} />;
};
