import { Management } from "../../../shared/components/Management/Management";
import styles from "./Dashboard.module.css";
export function Dashboard() {
  return (
    <div className={styles.container}>
      <Management
        title="Gestão de estudantes"
        description="Gerencie registros e informações dos estudantes"
        to="/dashboard/students-management"
      />
      <Management
        title="Gestão de agendamentos do estudante"
        description="Visualize os horários dos estudantes"
        to="/dashboard/students-scheduling"
      />
      <Management
        title="Gestão de professores"
        description="Visualize e gerencie os professores"
        to="/dashboard/teachers-management"
      />
    </div>
  );
}
