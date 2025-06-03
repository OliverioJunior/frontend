import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  Calendar,
  User,
  GraduationCap,
  FileText,
  Save,
  AlertCircle,
} from "lucide-react";
import { Input } from "../../../../shared/components/Input";
import { Button } from "../../../../shared/components/Button";
import { Select } from "../../../../shared/components/Select";
import { BusinessCalendar } from "../../../../shared/components/BusinessCalendar";

import { useSchedulingContext } from "../../../../hooks/useScheduingContext";
import { useTeachers } from "../../../../hooks/useTeacher";
import { useStudents } from "../../../../hooks/useStudents";
import { useToastContext } from "../../../../hooks/useToastContext";
import {
  baseSchedulingSchema,
  type SchedulingFormData,
} from "./schedulingSchemas";
import styles from "./scheduling-form.module.css";
import { ErrorMessage } from "../../../../shared/components/ErrorMessage";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";

interface ISchedulingForm {
  onClose: () => void;
  initialData?: Partial<SchedulingFormData>;
}

export const SchedulingForm: React.FC<ISchedulingForm> = ({
  onClose,
  initialData,
}) => {
  const { reFetch } = useSchedulingContext();
  const toast = useToastContext();
  const {
    teachers,
    loading: teachersLoading,
    error: teachersError,
  } = useTeachers();
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useStudents();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<SchedulingFormData>({
    resolver: zodResolver(baseSchedulingSchema),
    defaultValues: initialData || {},
    mode: "onChange",
  });

  const selectedDateTime = watch("dateTime");
  const isLoading = teachersLoading || studentsLoading;
  const hasErrors = teachersError || studentsError;

  const onSubmit = async (data: SchedulingFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const url = `${import.meta.env.VITE_API_URL}/scheduling"`;
      const method = "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (json.status !== 201) {
        throw new Error(json.message || "Erro na operação");
      }
      setSubmitSuccess(true);
      toast.success("Agendamento criado com sucesso");

      reFetch();

      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";

      setSubmitError(errorMessage);
      toast.error(errorMessage, "Erro na operação");
      console.error("Scheduling error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isDirty && !submitSuccess) {
      const shouldClose = window.confirm(
        "Você tem alterações não salvas. Deseja realmente fechar?"
      );
      if (!shouldClose) return;
    }
    onClose();
  };

  const handleReset = () => {
    reset();
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  if (isLoading) {
    return (
      <div
        className={styles.container}
        role="dialog"
        aria-label="Carregando formulário"
      >
        <LoadingSpinner message="Carregando dados necessários..." />
      </div>
    );
  }

  if (hasErrors) {
    return (
      <div
        className={styles.container}
        role="dialog"
        aria-label="Erro no formulário"
      >
        <div className={styles.header}>
          <h2>Erro ao Carregar</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Fechar formulário"
          >
            <X size={20} />
          </button>
        </div>
        <ErrorMessage message="Não foi possível carregar os dados necessários. Tente novamente." />
        <div className={styles.actions}>
          <Button onClick={onClose} variant="secondary">
            Fechar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="form-title" className={styles.title}>
            <Calendar size={24} />
            {"Novo Agendamento"}
          </h2>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Fechar formulário"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {submitSuccess && <div>{`Agendamento ${"criado"} com sucesso!`}</div>}

        {submitError && (
          <ErrorMessage
            message={submitError}
            onDismiss={() => setSubmitError(null)}
          />
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          noValidate
        >
          {/* Data e Hora */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              <Calendar size={16} />
              Data e Horário *
            </label>
            <Controller
              name="dateTime"
              control={control}
              render={({ field }) => (
                <div className={styles.calendarWrapper}>
                  <BusinessCalendar
                    onDateTimeSelect={(dateTime) => {
                      field.onChange(dateTime.toISOString());
                    }}
                    selectedDateTime={
                      field.value ? new Date(field.value) : null
                    }
                    minAdvanceHours={24} // Mínimo 24 horas de antecedência
                  />
                  {selectedDateTime && (
                    <div className={styles.selectedDateTimeDisplay}>
                      <strong>Selecionado:</strong>{" "}
                      {new Date(selectedDateTime).toLocaleString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              )}
            />
            {errors.dateTime && (
              <ErrorMessage
                message={errors.dateTime.message as string}
                size="small"
              />
            )}
          </div>

          {/* Professor */}
          <div className={styles.fieldGroup}>
            <label htmlFor="teacher-select" className={styles.fieldLabel}>
              <GraduationCap size={16} />
              Professor *
            </label>
            <Controller
              name="teacherId"
              control={control}
              render={({ field }) => (
                <Select
                  options={teachers}
                  onChange={(option) => field.onChange(option?.id)}
                  value={field.value}
                  placeholder="Selecione um professor"
                  aria-describedby={
                    errors.teacherId ? "teacher-error" : undefined
                  }
                />
              )}
            />
            {errors.teacherId && (
              <ErrorMessage
                id="teacher-error"
                message={errors.teacherId.message as string}
                size="small"
              />
            )}
          </div>

          {/* Estudante */}
          <div className={styles.fieldGroup}>
            <label htmlFor="student-select" className={styles.fieldLabel}>
              <User size={16} />
              Estudante *
            </label>
            <Controller
              name="studentId"
              control={control}
              render={({ field }) => (
                <Select
                  options={students}
                  onChange={(option) => field.onChange(option?.id)}
                  value={field.value}
                  placeholder="Selecione um estudante"
                  aria-describedby={
                    errors.studentId ? "student-error" : undefined
                  }
                />
              )}
            />
            {errors.studentId && (
              <ErrorMessage
                id="student-error"
                message={errors.studentId.message as string}
                size="small"
              />
            )}
          </div>

          {/* Conteúdo */}
          <div className={styles.fieldGroup}>
            <label htmlFor="content-input" className={styles.fieldLabel}>
              <FileText size={16} />
              Conteúdo da Aula *
            </label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <Input
                  id="content-input"
                  placeholder="Descreva o conteúdo que será abordado na aula"
                  type="text"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  variant={errors.content ? "error" : "terciary"}
                  disabled={isSubmitting}
                  aria-describedby={
                    errors.content ? "content-error" : "content-help"
                  }
                  maxLength={500}
                />
              )}
            />
            <div id="content-help" className={styles.fieldHint}>
              Máximo 500 caracteres
            </div>
            {errors.content && (
              <ErrorMessage
                id="content-error"
                message={errors.content.message as string}
                size="small"
              />
            )}
          </div>

          {/* Ações */}
          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              disabled={isSubmitting || !isDirty}
            >
              Limpar
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !isValid}
              className={styles.submitButton}
            >
              (
              <Save size={16} />
              {"Salvar"})
            </Button>
          </div>
        </form>

        {/* Informações de ajuda */}
        <div className={styles.helpInfo}>
          <AlertCircle size={16} />
          <span>
            Campos marcados com * são obrigatórios. O agendamento deve ser feito
            com pelo menos 24 horas de antecedência.
          </span>
        </div>
      </div>
    </div>
  );
};
