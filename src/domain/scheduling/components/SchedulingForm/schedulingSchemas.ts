import { z } from "zod";

const requiredString = (message: string, minMessage?: string) =>
  z.string({ message }).min(1, { message: minMessage });

export const baseSchedulingSchema = z.object({
  dateTime: requiredString("Preencha a Data"),
  teacherId: requiredString("Selecione o Professor"),
  studentId: requiredString("Selecione o Estudante"),
  content: requiredString("Preencha o Conteúdo"),
});
const statusEnum = z.enum(["realizado", "agendado", "cancelado"], {
  message: "Selecione o Status",
});

export const editSchedulingSchema = baseSchedulingSchema
  .partial()
  .extend({
    status: statusEnum,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Envie pelo menos um campo para edição",
  });

export type SchedulingFormData = z.infer<typeof baseSchedulingSchema>;
export type SchedulingEditFormData = z.infer<typeof editSchedulingSchema>;
