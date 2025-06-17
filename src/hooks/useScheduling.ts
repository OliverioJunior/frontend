import { useCallback, useEffect, useState } from "react";
import type { IStudent } from "./useStudents";
import type { ITeacher } from "./useTeacher";

type SchedulingStatus = "agendado" | "realizado" | "cancelado";

export interface IScheduling {
  id: string;
  dateTime: string;
  teacher: ITeacher;
  teacherId: string;
  studentId: string;
  student: IStudent;

  content: string;
  status: SchedulingStatus;
}
export const useScheduling = () => {
  const [scheduling, setScheduling] = useState<IScheduling[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScheduling = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    const url = import.meta.env.VITE_API_URL + "/scheduling";
    try {
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error("Erro ao buscar agendamentos");
      }
      const data = await response.json();
      setScheduling(data);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setError(error.message);
      } else if (
        error instanceof Error &&
        error.message === "Failed to fetch"
      ) {
        setError(
          "Erro ao buscar agendamentos, verifique sua conexão com a internet ou seu servidor está offline"
        );
      } else {
        setError("Erro desconhecido ao buscar agendamentos");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const reFetch = useCallback(() => {
    fetchScheduling();
  }, [fetchScheduling]);

  useEffect(() => {
    const controller = new AbortController();

    fetchScheduling(controller.signal);
    return () => controller.abort();
  }, [fetchScheduling]);

  return { scheduling, loading, error, reFetch };
};
