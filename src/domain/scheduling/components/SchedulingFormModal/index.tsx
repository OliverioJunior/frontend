import type { IScheduling } from "../../../../hooks/useScheduling";
import { Modal, type IModalProps } from "../../../../shared/components/Modal";
import { SchedulingForm } from "../SchedulingForm";

interface ISchedulingFormModalBase extends IModalProps {
  type: "create" | "edit";
  initialData?: Partial<IScheduling>;
}

type TSchedulingFormModalProps = ISchedulingFormModalBase;

export const SchedulingFormModal = ({
  isOpen,
  onClose,
  type,
  initialData,
}: TSchedulingFormModalProps) => {
  const renderFormComponent = () => {
    return (
      <SchedulingForm onClose={onClose} initialData={initialData} type={type} />
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} content={renderFormComponent()} />
  );
};
