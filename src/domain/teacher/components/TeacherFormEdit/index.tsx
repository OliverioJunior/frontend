import { Input } from "../../../../shared/components/Input";
import styles from "./teacher-form.module.css";

import { Button } from "../../../../shared/components/Button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  editTeacherSchema,
  type TeacherEditFormData,
} from "../TeacherForm/teacherSchemas";
import { useTeacherContext } from "../../../../hooks/useTeacherContext";
import { Select } from "../../../../shared/components/Select";
import { useToastContext } from "../../../../hooks/useToastContext";
import type { ITeacher } from "../../../../hooks/useTeacher";

interface ITeacherForm {
  onClose: () => void;
  teacherData: ITeacher;
}

export const TeacherFormEdit: React.FC<ITeacherForm> = ({
  onClose,
  teacherData,
}) => {
  const { reFetch } = useTeacherContext();
  const toast = useToastContext();
  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<TeacherEditFormData>({
    resolver: zodResolver(editTeacherSchema),
    defaultValues: {
      firstName: teacherData.firstName || "",
      lastName: teacherData.lastName || "",
      expertise: teacherData.expertise || "",
      status: teacherData.status || "",
    },
  });

  const onSubmit = async (data: TeacherEditFormData) => {
    data.lastName = data.lastName?.trimEnd();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/teachers/update/${teacherData.id}`,
        {
          method: "PATCH",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const json = await response.json();
      if (json.status !== 200) {
        toast.error(json.message, "Erro ao atualizar professor");
        return;
      }
      toast.success(json.message, "Professor atualizado com sucesso");

      reFetch();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
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
        name="expertise"
        control={control}
        render={({ field }) => (
          <Input
            label="Especialidade"
            placeholder="Especialidade"
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
          <Select
            placeholder="Status"
            value={field.value || ""}
            options={[
              { id: "active", firstName: "Ativo", lastName: "" },
              { id: "inactive", firstName: "Inativo", lastName: "" },
            ]}
            onChange={(e) => {
              const valor = e.id;
              field.onChange(valor);
            }}
          />
        )}
      />
      {errors.status && (
        <span className={styles.error}>{errors.status.message}</span>
      )}

      <Button type="submit" variant="primary">
        Salvar
      </Button>
    </form>
  );
};
