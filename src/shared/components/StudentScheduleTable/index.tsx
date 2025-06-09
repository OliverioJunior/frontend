import React from "react";
import "./StudentScheduleTable.css";
import type { IScheduling } from "../../../hooks/useScheduling";

interface StudentScheduleTableProps {
  schedulings?: IScheduling[];
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
  className?: string;
  loading: boolean;
  error: string | null;
}

export const StudentScheduleTable: React.FC<StudentScheduleTableProps> = ({
  schedulings = [],
  onEdit,
  onCancel,
  className = "",
  error,
  loading,
}) => {
  const getStatusBadge = (status: string): React.ReactElement => {
    const statusClass = `status-badge status-${status
      ?.toLowerCase()
      .replace(/\s+/g, "-")}`;
    return <span className={statusClass}>{status}</span>;
  };

  const formatDateTime = (dateTime: string): string => {
    try {
      return new Date(dateTime).toLocaleString("pt-BR");
    } catch {
      return dateTime;
    }
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
          {!loading && error && (
            <tr>
              <td colSpan={4}>Ocorreu um erro: {error}</td>
            </tr>
          )}
          {schedulings.length > 0 &&
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
                        {formatDateTime(scheduling.dateTime)}
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
                  <button
                    className="btn btn-edit"
                    onClick={() => onEdit?.(scheduling.id)}
                    type="button"
                    disabled={
                      scheduling.status === "cancelado" ||
                      scheduling.status === "realizado"
                    }
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-cancel"
                    onClick={() => onCancel?.(scheduling.id)}
                    type="button"
                    disabled={
                      scheduling.status === "cancelado" ||
                      scheduling.status === "realizado"
                    }
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          {schedulings.length === 0 && !loading && !error && (
            <tr>
              <td colSpan={4}>Nenhum agendamento encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export type { StudentScheduleTableProps };
