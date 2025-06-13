import { z } from "zod";

const requiredString = (message: string, minMessage?: string) =>
  z.string({ message }).min(1, { message: minMessage });

export const baseSchedulingSchema = z.object({
  id: z.string().optional(),
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
  .refine(
    (data) => {
      return Object.values(data).some(
        (value) => value !== undefined && value !== ""
      );
    },
    {
      message: "Pelo menos um campo deve ser preenchido para edição",
    }
  );

export type SchedulingFormData = z.infer<typeof baseSchedulingSchema>;
export type SchedulingEditFormData = z.infer<typeof editSchedulingSchema>;
