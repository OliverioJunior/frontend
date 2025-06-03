import { Modal, type IModalProps } from "../../../../shared/components/Modal";
import { TeacherForm } from "../TeacherForm";
import { TeacherFormEdit } from "../TeacherFormEdit";

interface ITeacherFormModalBase extends IModalProps {
  type: "create" | "edit";
}

type TTeacherFormModalProps =
  | (ITeacherFormModalBase & { type: "create" })
  | (ITeacherFormModalBase & { type: "edit"; teacherId: string });

export const TeacherFormModal = ({
  isOpen,
  onClose,
  title,
  type,
  ...props
}: TTeacherFormModalProps) => {
  const renderFormComponent = () => {
    switch (type) {
      case "create":
        return <TeacherForm onClose={onClose} />;
      case "edit":
        if (!("teacherId" in props)) return null;
        return (
          <TeacherFormEdit onClose={onClose} teacherId={props.teacherId} />
        );
      default:
        return null;
    }
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
