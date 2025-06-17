import { useState, useEffect, useCallback } from "react";
import type { IScheduling } from "./useScheduling";

export interface ITeacher {
  id: string;
  cpf: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  status: "active" | "inactive";
  expertise: string;
  Scheduling: IScheduling[] | [];
}

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/teachers", {
        signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseInJsonh: {
        data: ITeacher[];
        status: string;
        message: string;
      } = await response.json();
      setTeachers(responseInJsonh.data);
    } catch (err) {
      if (err instanceof Error && err.message === "Failed to fetch") {
        setError(
          "Erro ao buscar professores, verifique sua conexão com a internet ou seu servidor está offline"
        );
      } else if (err instanceof Error && err.name === "AbortError") {
        setError(null);
      } else {
        setError("Erro desconhecido ao carregar Professores");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const reFetch = useCallback(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    const controller = new AbortController();
    fetchTeachers(controller.signal);

    return () => controller.abort();
  }, [fetchTeachers]);

  return {
    teachers,
    loading,
    error,
    setTeachers,
    reFetch,
  };
};
