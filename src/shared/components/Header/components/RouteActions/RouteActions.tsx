import { StudentFormModal } from "../../../../../domain/student/components/StudentFormModal";
import { Button } from "../../../Button";
import { TeacherFormModal } from "../../../../../domain/teacher/components/TeacherFormModal";
import { SchedulingFormModal } from "../../../../../domain/scheduling/components/SchedulingFormModal";

export type TRoutes =
  | "students-management"
  | "students-scheduling"
  | "teachers-management"
  | "/";

type TRouteActionsProps = {
  routeKey: TRoutes;
  openModal: () => void;
  onClosed: () => void;
  isOpen: boolean;
};

export const RouteActions = ({
  routeKey,
  openModal,
  isOpen,
  onClosed,
}: TRouteActionsProps) => {
  switch (routeKey) {
    case "students-management":
      return (
        <>
          <Button size="small" variant="secondary" onClick={openModal}>
            Criar Estudante
          </Button>
          <StudentFormModal
            isOpen={isOpen}
            onClose={onClosed}
            title={"Novo Estudante"}
            type="create"
          />
        </>
      );

    case "students-scheduling":
      return (
        <>
          <Button variant="secondary" onClick={openModal}>
            Criar Agendamento
          </Button>
          <SchedulingFormModal
            isOpen={isOpen}
            onClose={onClosed}
            title={"Novo Agendamento"}
            type="create"
          />
        </>
      );

    case "teachers-management":
      return (
        <>
          <Button variant="secondary" onClick={openModal}>
            Criar Professor
          </Button>
          <TeacherFormModal
            isOpen={isOpen}
            onClose={onClosed}
            title={"Novo Professor"}
            type="create"
          />
        </>
      );

    default:
      return null;
  }
};
