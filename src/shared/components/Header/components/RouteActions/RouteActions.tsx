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
          <Button variant="secondary" onClick={openModal}>
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
            Agendar
          </Button>
          <SchedulingFormModal
            isOpen={isOpen}
            onClose={onClosed}
            title={"Agendar"}
            type="create"
          />
        </>
      );

    case "teachers-management":
      return (
        <>
          <Button variant="secondary" onClick={openModal}>
            Criar professores
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
