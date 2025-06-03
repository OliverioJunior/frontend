import { useState, useRef, useEffect } from "react";
import styles from "./select.module.css";

// Definindo os tipos TypeScript
interface Option {
  id: string;
  firstName: string;
  lastName: string;
}

interface SelectProps {
  options?: Array<Option>;
  placeholder?: string;
  value?: string | number;
  onChange?: (option: Option) => void;
  disabled?: boolean;
  className?: string;
}

// Componente ChevronDown simples
const ChevronDown = ({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

export const Select = ({
  options = [],
  placeholder = "Selecione uma opção",
  value,
  onChange,
  disabled = false,
  className = "",
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option: Option) => {
    onChange?.(option);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div className={`${styles.select} ${className}`} ref={selectRef}>
      <button
        type="button"
        className={`${styles.selectButton} ${
          isOpen ? styles.selectButtonFocused : ""
        } ${disabled ? styles.selectButtonDisabled : ""}`}
        onClick={handleToggle}
        disabled={disabled}
      >
        <span
          className={selectedOption ? styles.selectedValue : styles.placeholder}
        >
          {selectedOption
            ? `${selectedOption.firstName} ${selectedOption.lastName}`
            : placeholder}
        </span>
        <ChevronDown
          size={20}
          className={`${styles.chevron} ${isOpen ? styles.chevronRotated : ""}`}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <div
              key={option.id}
              className={`${styles.option} ${
                value === option.id ? styles.optionSelected : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option.firstName + " " + option.lastName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
