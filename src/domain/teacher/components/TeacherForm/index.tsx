import { Input } from "../../../../shared/components/Input";
import { formatarCPF } from "../../../../shared/utils/formatters";
import styles from "./teacher-form.module.css";

import { Button } from "../../../../shared/components/Button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createTeacherSchema, type TeacherFormData } from "./teacherSchemas";
import { useTeacherContext } from "../../../../hooks/useTeacherContext";
import { useToastContext } from "../../../../hooks/useToastContext";

interface ITeacherForm {
  onClose: () => void;
}

export const TeacherForm: React.FC<ITeacherForm> = ({ onClose }) => {
  const { reFetch } = useTeacherContext();
  const toast = useToastContext();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(createTeacherSchema),
    defaultValues: {
      status: "inactive",
    },
  });

  const formatarInput = (
    valor: string,
    formatador: (value: string) => string
  ) => {
    return valor ? formatador(valor) : "";
  };

  const onSubmit = async (data: TeacherFormData) => {
    data.lastName = data.lastName.trimEnd();
    try {
      const url = `${import.meta.env.VITE_API_URL}/teachers/create`;
      const method = "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (!response.ok) {
        toast.error(responseData.message);
      }
      toast.success(responseData.message);
      reFetch();
      onClose();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <Controller
        name="cpf"
        control={control}
        render={({ field }) => (
          <Input
            placeholder="CPF"
            label="Cpf do professor"
            value={formatarInput(field.value, formatarCPF)}
            onChange={(e) => {
              const valor = e.target.value.replace(/\D/g, "");
              field.onChange(valor);
            }}
            variant={errors.cpf ? "error" : "primary"}
          />
        )}
      />
      {errors.cpf && <span className={styles.error}>{errors.cpf.message}</span>}

      <Controller
        name="firstName"
        control={control}
        render={({ field }) => (
          <Input
            label="Nome"
            placeholder="Nome"
            value={field.value || ""}
            onChange={(e) => {
              const valor = e.target.value.trim();
              field.onChange(valor);
            }}
            variant={errors.firstName ? "error" : "primary"}
          />
        )}
      />
      {errors.firstName && (
        <span className={styles.error}>{errors.firstName.message}</span>
      )}
      <Controller
        name="lastName"
        control={control}
        render={({ field }) => (
          <Input
            label="Sobrenome"
            placeholder="Sobrenome"
            value={field.value || ""}
            onChange={(e) => {
              const valor = e.target.value;
              field.onChange(valor);
            }}
            variant={errors.lastName ? "error" : "primary"}
          />
        )}
      />
      {errors.lastName && (
        <span className={styles.error}>{errors.lastName.message}</span>
      )}
      <Controller
        name="birthDate"
        control={control}
        render={({ field }) => (
          <Input
            label="Data de Nascimento"
            placeholder="Data de Nascimento"
            type="date"
            value={field.value || ""}
            onChange={(e) => {
              const valor = e.target.value;
              field.onChange(valor);
            }}
            variant={errors.birthDate ? "error" : "primary"}
          />
        )}
      />
      {errors.birthDate && (
        <span className={styles.error}>{errors.birthDate.message}</span>
      )}
      <Controller
        name="expertise"
        control={control}
        render={({ field }) => (
          <Input
            placeholder="Especialidade"
            type="text"
            value={field.value || ""}
            onChange={(e) => {
              const valor = e.target.value;
              field.onChange(valor);
            }}
            variant={errors.expertise ? "error" : "primary"}
          />
        )}
      />
      {errors.expertise && (
        <span className={styles.error}>{errors.expertise.message}</span>
      )}

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Input
            label="Status"
            placeholder="Status"
            type="checkbox"
            value={field.value || "inactive"}
            onChange={(e) => {
              const valor = e.target.checked;

              field.onChange(valor ? "active" : "inactive");
            }}
            variant={errors.status ? "error" : "primary"}
          />
        )}
      />
      {errors.status && (
        <span className={styles.error}>{errors.status.message}</span>
      )}

      <Button type="submit" variant="primary">
        {"Salvar"}
      </Button>
    </form>
  );
};
