import { Modal, type IModalProps } from "../../../../shared/components/Modal";
import { StudentForm } from "../StudentForm";
import { StudentFormEdit } from "../StudentFormEdit";

interface IStudentFormModalBase extends IModalProps {
  type: "create" | "edit";
}

type TStudentFormModalProps =
  | (IStudentFormModalBase & { type: "create" })
  | (IStudentFormModalBase & { type: "edit"; studentId: string });

export const StudentFormModal = ({
  isOpen,
  onClose,
  title,
  type,
  ...props
}: TStudentFormModalProps) => {
  const renderFormComponent = () => {
    const conditionToRenderEditForm = type === "edit" && "studentId" in props;
    if (conditionToRenderEditForm) {
      return <StudentFormEdit onClose={onClose} studentId={props.studentId} />;
    }

    return <StudentForm onClose={onClose} />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      content={renderFormComponent()}
    />
  );
};
