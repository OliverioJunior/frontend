import type { ITeacher } from "../../../../hooks/useTeacher";
import { Modal, type IModalProps } from "../../../../shared/components/Modal";
import { TeacherForm } from "../TeacherForm";
import { TeacherFormEdit } from "../TeacherFormEdit";

interface ITeacherFormModalBase extends IModalProps {
  type: "create" | "edit";
}

type TTeacherFormModalProps =
  | (ITeacherFormModalBase & { type: "create" })
  | (ITeacherFormModalBase & { type: "edit"; teacherData: ITeacher });

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
        if (!("teacherData" in props)) return null;
        return (
          <TeacherFormEdit onClose={onClose} teacherData={props.teacherData} />
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
