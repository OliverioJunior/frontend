export interface IModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  content?: React.ReactNode;
}
import { useEffect, useRef } from "react";
import styles from "./module.module.css";
import { X } from "lucide-react";
import { Button } from "../Button";
export const Modal = ({ isOpen, title, onClose, content }: IModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div
      className={styles.modal}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>{title}</h2>
          <Button size="small" variant="ghost" onClick={onClose}>
            <X />
          </Button>
        </div>
        {content}
      </div>
    </div>
  );
};
