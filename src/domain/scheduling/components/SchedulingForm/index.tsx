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
  editSchedulingSchema,
  type SchedulingEditFormData,
  type SchedulingFormData,
} from "./schedulingSchemas";
import styles from "./scheduling-form.module.css";
import { ErrorMessage } from "../../../../shared/components/ErrorMessage";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";
import { StatusCode } from "../../../../entidades/statusCode.enum";
import { Modal } from "../../../../shared/components/Modal";

interface ISchedulingForm {
  onClose: () => void;
  initialData?: Partial<SchedulingFormData>;
  type: "create" | "edit";
}

export const SchedulingForm: React.FC<ISchedulingForm> = ({
  onClose,
  initialData,
  type,
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
  const isCreating = type === "create";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // configurações para "create"
  const createForm = useForm<SchedulingFormData>({
    resolver: zodResolver(baseSchedulingSchema),
    defaultValues: {
      dateTime: initialData?.dateTime || "",
      teacherId: initialData?.teacherId || "",
      studentId: initialData?.studentId || "",
      content: initialData?.content || "",
    },
    mode: "onChange",
  });

  // configurações para "edit"
  const editForm = useForm<SchedulingEditFormData>({
    resolver: zodResolver(editSchedulingSchema),
    defaultValues: {
      dateTime: initialData?.dateTime || "",
      teacherId: initialData?.teacherId || "",
      studentId: initialData?.studentId || "",
      content: initialData?.content || "",
      status: (initialData as SchedulingEditFormData)?.status || "agendado",
    },
    mode: "onChange",
  });

  const selectedDateTime = isCreating
    ? createForm.watch("dateTime")
    : editForm.watch("dateTime");
  const selectedTeacher = isCreating
    ? createForm.watch("teacherId")
    : editForm.watch("teacherId");
  const [dateScheduled, setDateScheduled] = useState<Date[] | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (selectedTeacher) {
      const teacherSelected = teachers.find(
        (teacher) => teacher.id === selectedTeacher
      );
      setDateScheduled(
        teacherSelected?.Scheduling?.map(
          (scheduling) => new Date(scheduling.dateTime)
        ) || undefined
      );
    }
  }, [selectedTeacher]);
  const isLoading = teachersLoading || studentsLoading;
  const hasErrors = teachersError || studentsError;

  const onSubmit = async (
    data: SchedulingFormData | SchedulingEditFormData
  ) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const urlToCreate = `${import.meta.env.VITE_API_URL}/scheduling`;
      const urlToEdit = `${import.meta.env.VITE_API_URL}/scheduling/${
        initialData?.id
      }`;
      const url = isCreating ? urlToCreate : urlToEdit;
      const method = isCreating ? "POST" : "PATCH";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (json.status !== StatusCode.CREATED && json.status !== StatusCode.OK) {
        toast.error(json.message);
        return;
      }
      setSubmitSuccess(true);
      toast.success(
        isCreating
          ? "Agendamento criado com sucesso!"
          : "Agendamento atualizado com sucesso!"
      );
      reFetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";

      setSubmitError(errorMessage);
      toast.error(errorMessage, "Erro na operação");
    } finally {
      onClose();
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    const isDirty = isCreating
      ? createForm.formState.isDirty
      : editForm.formState.isDirty;

    if (isDirty && !submitSuccess) {
      const shouldClose = window.confirm(
        "Você tem alterações não salvas. Deseja realmente fechar?"
      );
      if (!shouldClose) return;
    }
    onClose();
  };

  const handleReset = () => {
    if (isCreating) {
      createForm.reset();
    } else {
      editForm.reset();
    }
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
          <Button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Fechar formulário"
          >
            <X size={20} />
          </Button>
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

  // Renderizar formulário de criação
  if (isCreating) {
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
              Novo Agendamento
            </h2>
            <Button
              onClick={handleClose}
              className={styles.closeButton}
              aria-label="Fechar formulário"
              disabled={isSubmitting}
            >
              <X size={20} />
            </Button>
          </div>

          {submitSuccess && <div>Agendamento criado com sucesso!</div>}

          {submitError && (
            <ErrorMessage
              message={submitError}
              onDismiss={() => setSubmitError(null)}
            />
          )}

          <form
            onSubmit={createForm.handleSubmit(onSubmit)}
            className={styles.form}
            noValidate
          >
            {/* Professor */}
            <div className={styles.fieldGroup}>
              <label htmlFor="teacher-select" className={styles.fieldLabel}>
                <GraduationCap size={16} />
                Professor *
              </label>
              <Controller
                name="teacherId"
                control={createForm.control}
                render={({ field }) => (
                  <Select
                    options={teachers}
                    onChange={(option) => field.onChange(option?.id)}
                    value={field.value}
                    placeholder="Selecione um professor"
                    aria-describedby={
                      createForm.formState.errors.teacherId
                        ? "teacher-error"
                        : undefined
                    }
                  />
                )}
              />
              {createForm.formState.errors.teacherId && (
                <ErrorMessage
                  id="teacher-error"
                  message={
                    createForm.formState.errors.teacherId.message as string
                  }
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
                control={createForm.control}
                render={({ field }) => (
                  <Select
                    options={students}
                    onChange={(option) => field.onChange(option?.id)}
                    value={field.value}
                    placeholder="Selecione um estudante"
                    aria-describedby={
                      createForm.formState.errors.studentId
                        ? "student-error"
                        : undefined
                    }
                  />
                )}
              />
              {createForm.formState.errors.studentId && (
                <ErrorMessage
                  id="student-error"
                  message={
                    createForm.formState.errors.studentId.message as string
                  }
                  size="small"
                />
              )}
            </div>
            {/* Data e Hora */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                <Calendar size={16} />
                Data e Horário *
              </label>
              <Controller
                name="dateTime"
                control={createForm.control}
                render={({ field }) => (
                  <div className={styles.calendarWrapper}>
                    {!isModalOpen && !selectedDateTime && (
                      <Button
                        variant="ghost"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Selecionar Data e Hora{" "}
                      </Button>
                    )}
                    <Modal
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      content={
                        <BusinessCalendar
                          onDateTimeSelect={(dateTime) => {
                            field.onChange(dateTime.toISOString());
                          }}
                          selectedDateTime={
                            field.value ? new Date(field.value) : null
                          }
                          excludedHours={dateScheduled}
                          minAdvanceHours={24}
                        />
                      }
                    />
                    {selectedDateTime && (
                      <div
                        className={styles.selectedDateTimeDisplay}
                        onClick={() => setIsModalOpen(true)}
                      >
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
              {createForm.formState.errors.dateTime && (
                <ErrorMessage
                  message={
                    createForm.formState.errors.dateTime.message as string
                  }
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
                control={createForm.control}
                render={({ field }) => (
                  <Input
                    id="content-input"
                    placeholder="Descreva o conteúdo que será abordado na aula"
                    type="text"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    variant={
                      createForm.formState.errors.content ? "error" : "terciary"
                    }
                    disabled={isSubmitting}
                    aria-describedby={
                      createForm.formState.errors.content
                        ? "content-error"
                        : "content-help"
                    }
                    maxLength={500}
                  />
                )}
              />
              <div id="content-help" className={styles.fieldHint}>
                Máximo 500 caracteres
              </div>
              {createForm.formState.errors.content && (
                <ErrorMessage
                  id="content-error"
                  message={
                    createForm.formState.errors.content.message as string
                  }
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
                disabled={isSubmitting || !createForm.formState.isDirty}
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
                disabled={isSubmitting || !createForm.formState.isValid}
                className={styles.submitButton}
              >
                <Save size={16} />
                Salvar
              </Button>
            </div>
          </form>

          {/* Informações de ajuda */}
          <div className={styles.helpInfo}>
            <AlertCircle size={16} />
            <span>
              Campos marcados com * são obrigatórios. O agendamento deve ser
              feito com pelo menos 24 horas de antecedência.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar formulário de edição
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
            Editar Agendamento
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

        {submitSuccess && <div>Agendamento editado com sucesso!</div>}

        {submitError && (
          <ErrorMessage
            message={submitError}
            onDismiss={() => setSubmitError(null)}
          />
        )}

        <form
          onSubmit={editForm.handleSubmit(onSubmit)}
          className={styles.form}
          noValidate
        >
          {/* Professor */}
          <div className={styles.fieldGroup}>
            <label htmlFor="teacher-select" className={styles.fieldLabel}>
              <GraduationCap size={16} />
              Professor *
            </label>
            <Controller
              name="teacherId"
              control={editForm.control}
              render={({ field }) => (
                <Select
                  options={teachers}
                  onChange={(option) => field.onChange(option?.id)}
                  value={field.value}
                  placeholder="Selecione um professor"
                  aria-describedby={
                    editForm.formState.errors.teacherId
                      ? "teacher-error"
                      : undefined
                  }
                />
              )}
            />
            {editForm.formState.errors.teacherId && (
              <ErrorMessage
                id="teacher-error"
                message={editForm.formState.errors.teacherId.message as string}
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
              control={editForm.control}
              render={({ field }) => (
                <Select
                  options={students}
                  onChange={(option) => field.onChange(option?.id)}
                  value={field.value}
                  placeholder="Selecione um estudante"
                  aria-describedby={
                    editForm.formState.errors.studentId
                      ? "student-error"
                      : undefined
                  }
                />
              )}
            />
            {editForm.formState.errors.studentId && (
              <ErrorMessage
                id="student-error"
                message={editForm.formState.errors.studentId.message as string}
                size="small"
              />
            )}
          </div>
          {/* Data e Hora */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              <Calendar size={16} />
              Data e Horário *
            </label>
            <Controller
              name="dateTime"
              control={editForm.control}
              render={({ field }) => (
                <div className={styles.calendarWrapper}>
                  {!isModalOpen && !selectedDateTime && (
                    <Button
                      variant="ghost"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Selecionar Data e Hora{" "}
                    </Button>
                  )}
                  <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    content={
                      <BusinessCalendar
                        onDateTimeSelect={(dateTime) => {
                          field.onChange(dateTime.toISOString());
                        }}
                        selectedDateTime={
                          field.value ? new Date(field.value) : null
                        }
                        excludedHours={dateScheduled}
                        minAdvanceHours={24}
                      />
                    }
                  />
                  {selectedDateTime && (
                    <div
                      className={styles.selectedDateTimeDisplay}
                      onClick={() => setIsModalOpen(true)}
                    >
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
            {editForm.formState.errors.dateTime && (
              <ErrorMessage
                message={editForm.formState.errors.dateTime.message as string}
                size="small"
              />
            )}
          </div>

          {/* Status */}
          <div className={styles.fieldGroup}>
            <label htmlFor="status-select" className={styles.fieldLabel}>
              <FileText size={16} />
              Status *
            </label>
            <Controller
              name="status"
              control={editForm.control}
              render={({ field }) => (
                <Select
                  placeholder="Selecione um status"
                  options={[
                    { id: "realizado", firstName: "Realizado", lastName: "" },
                    { id: "agendado", firstName: "Agendado", lastName: "" },
                    { id: "cancelado", firstName: "Cancelado", lastName: "" },
                  ]}
                  onChange={(option) => {
                    field.onChange(option?.id);
                  }}
                  value={field.value}
                />
              )}
            />
            {editForm.formState.errors.status && (
              <ErrorMessage
                message={editForm.formState.errors.status.message as string}
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
              control={editForm.control}
              render={({ field }) => (
                <Input
                  id="content-input"
                  placeholder="Descreva o conteúdo que será abordado na aula"
                  type="text"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  variant={
                    editForm.formState.errors.content ? "error" : "terciary"
                  }
                  disabled={isSubmitting}
                  aria-describedby={
                    editForm.formState.errors.content
                      ? "content-error"
                      : "content-help"
                  }
                  maxLength={500}
                />
              )}
            />
            <div id="content-help" className={styles.fieldHint}>
              Máximo 500 caracteres
            </div>
            {editForm.formState.errors.content && (
              <ErrorMessage
                id="content-error"
                message={editForm.formState.errors.content.message as string}
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
              disabled={isSubmitting || !editForm.formState.isDirty}
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
              disabled={isSubmitting || !editForm.formState.isValid}
              className={styles.submitButton}
            >
              <Save size={16} />
              Atualizar
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
