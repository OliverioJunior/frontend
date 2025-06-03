import { Modal, type IModalProps } from "../../../../shared/components/Modal";
import { SchedulingForm } from "../SchedulingForm";
import { SchedulingFormEdit } from "../SchedulingFormEdit";

interface ISchedulingFormModalBase extends IModalProps {
  type: "create" | "edit";
}

type TSchedulingFormModalProps =
  | (ISchedulingFormModalBase & { type: "create" })
  | (ISchedulingFormModalBase & { type: "edit"; schedulingId: string });

export const SchedulingFormModal = ({
  isOpen,
  onClose,
  title,
  type,
  ...props
}: TSchedulingFormModalProps) => {
  const renderFormComponent = () => {
    const conditionToRenderEditForm =
      type === "edit" && "schedulingId" in props;
    if (conditionToRenderEditForm) {
      return (
        <SchedulingFormEdit onClose={onClose} studentId={props.schedulingId} />
      );
    }

    return <SchedulingForm onClose={onClose} />;
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
