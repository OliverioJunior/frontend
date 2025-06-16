import { useState, useCallback, useEffect } from "react";

export interface IStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cep: string;
  number: string;
  birthDate: string;
  address: string;
  phone: string;
  whatsapp: string;
  birthdate: string;
}

export const useStudents = () => {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    const url = import.meta.env.VITE_API_URL + "/students";
    try {
      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseInJson: {
        status: number;
        message: string;
        data: IStudent[];
      } = await response.json();

      setStudents(responseInJson.data);
      setLoading(false);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message);
      } else if (err instanceof Error && err.name === "AbortError") {
        setError(null);
      } else {
        setError("Erro desconhecido ao carregar estudantes");
      }
      setLoading(false);
    }
  }, []);

  const reFetch = useCallback(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    const controller = new AbortController();
    fetchStudents(controller.signal);
    return () => controller.abort();
  }, [fetchStudents]);

  return { students, loading, error, reFetch, setStudents };
};
