import { Button } from "../Button";
import { Modal } from "../Modal";
import styles from "./alert.module.css";

interface IAlert {
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  action: () => void;
}

export const Alert: React.FC<IAlert> = ({
  isOpen,
  onClose,
  message,
  title,
  action,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      content={
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={action}>
              Sim
            </Button>
            <Button onClick={onClose}>Não</Button>
          </div>
        </div>
      }
    />
  );
};
