import React from "react";
import "./StudentScheduleTable.css";
import type { IScheduling } from "../../../hooks/useScheduling";
import { Button } from "../Button";
import { formatarDateTime } from "../../utils";

interface StudentScheduleTableProps {
  schedulings?: IScheduling[];
  onEdit?: (data: IScheduling) => void;
  onCancel?: (id: string) => void;
  message?: string;
  className?: string;
  loading: boolean;
  error: string | null;
  teacherView?: boolean;
}

export const StudentScheduleTable: React.FC<StudentScheduleTableProps> = ({
  schedulings,
  onEdit,
  onCancel,
  message,
  className = "",
  error,
  loading,
  teacherView,
}) => {
  const getStatusBadge = (status: string): React.ReactElement => {
    const statusClass = `status-badge status-${status
      ?.toLowerCase()
      .replace(/\s+/g, "-")}`;
    return <span className={statusClass}>{status}</span>;
  };

  return (
    <div className={`table-container ${className}`}>
      <table className="student-table">
        <thead>
          <tr>
            <th>Aulas</th>
            <th>Status</th>
            <th>Aluno</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={4}>Carregando...</td>
            </tr>
          )}
          {!loading &&
            error &&
            error !== "signal is aborted without reason" && (
              <tr>
                <td colSpan={4}>{error}</td>
              </tr>
            )}
          {schedulings &&
            schedulings.length > 0 &&
            !loading &&
            schedulings.map((scheduling) => (
              <tr
                key={scheduling.id || scheduling.dateTime}
                className="table-row"
              >
                <td className="content-cell">
                  <div className="content-info">
                    <div className="content-title">{scheduling.content}</div>
                    {scheduling.dateTime && (
                      <div className="content-date">
                        {formatarDateTime(scheduling.dateTime)}
                      </div>
                    )}
                  </div>
                </td>
                <td>{getStatusBadge(scheduling.status)}</td>
                <td className="student-cell">
                  <div className="student-info">
                    <div className="student-name">
                      {scheduling.student?.firstName}{" "}
                      {scheduling.student?.lastName}
                    </div>
                    {scheduling.student?.email && (
                      <div className="student-email">
                        {scheduling.student.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="actions-cell">
                  {!teacherView && (
                    <Button
                      className="btn btn-edit"
                      onClick={() => onEdit?.(scheduling)}
                      type="button"
                      disabled={
                        scheduling.status === "cancelado" ||
                        scheduling.status === "realizado"
                      }
                    >
                      Editar
                    </Button>
                  )}

                  <Button
                    className="btn btn-cancel"
                    onClick={() => onCancel?.(scheduling.id)}
                    type="button"
                    disabled={
                      scheduling.status === "cancelado" ||
                      scheduling.status === "realizado"
                    }
                  >
                    Cancelar
                  </Button>
                </td>
              </tr>
            ))}
          {schedulings &&
            schedulings.length === 0 &&
            !loading &&
            error === null && (
              <tr>
                <td colSpan={4}>{message || "Nenhum estudante encontrado"}</td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  );
};

export type { StudentScheduleTableProps };
