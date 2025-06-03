import { z } from "zod";
import { validarCPF } from "../../../../shared/utils";

const requiredString = (message: string) =>
  z.string({ message }).min(1, message);

const cpfSchema = requiredString("Preencha o CPF")
  .min(11, "CPF incompleto")
  .refine(validarCPF, "CPF inválido");

const baseTeacherSchema = z.object({
  firstName: z
    .string({ message: "Preencha o Nome" })
    .min(3, { message: "Nome precisa de pelo menos 3 caracteres" }),
  lastName: z
    .string({ message: "Preencha o Sobrenome" })
    .min(3, { message: "Nome precisa de pelo menos 3 caracteres" }),
  birthDate: z.string({ message: "Selecione a data" }),
  expertise: z.string().optional(),
  status: z.enum(["active", "inactive"], { message: "Status inválido" }),
});

export const createTeacherSchema = baseTeacherSchema.extend({
  cpf: cpfSchema,
});

export const editTeacherSchema = baseTeacherSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Envie pelo menos um campo para edição",
  });

export type TeacherFormData = z.infer<typeof createTeacherSchema>;
export type TeacherEditFormData = Partial<TeacherFormData>;
