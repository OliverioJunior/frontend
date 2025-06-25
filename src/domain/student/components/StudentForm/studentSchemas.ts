import { z } from "zod";
import { validarCEP, validarCPF } from "../../../../shared/utils";

const requiredString = (message: string) => z.string().min(1, message);
const optionalString = () => z.string().optional();

const cpfSchema = requiredString("Preencha o CPF")
  .min(11, "CPF incompleto")
  .refine(validarCPF, "CPF inválido");

const cepSchema = requiredString("Preencha o CEP")
  .min(8, "CEP incompleto")
  .refine(validarCEP, "CEP inválido");

const emailSchema = requiredString("Preencha o Email").email("E-mail inválido");

const phoneSchema = requiredString("Preencha o Telefone")
  .min(10, "Telefone inválido (mín. 10 dígitos)")
  .max(11, "Telefone inválido (máx. 11 dígitos)");
const whatsappSchema = requiredString("Preencha o Whatsapp")
  .min(
    12,
    "Telefone whatsapp inválido confira o formato 5(99) 99999-9999 ou 55(99) 99999-9999"
  )
  .max(
    13,
    "Telefone whatsapp inválido confira o formato 5(99) 99999-9999 ou 55(99) 99999-9999"
  );

const baseStudentSchema = z.object({
  firstName: requiredString("Preencha o Nome").min(3, "Nome obrigatório"),
  lastName: requiredString("Preencha o Sobrenome").min(
    3,
    "Sobrenome obrigatório"
  ),
  birthDate: requiredString("Selecione a data"),
  street: requiredString("Endereço obrigatório"),
  cep: cepSchema,
  neighborhood: optionalString(),
  state: optionalString(),
  city: optionalString(),
  logradouro: optionalString(),
  number: requiredString("Preencha o Número"),
  phone: phoneSchema,
  whatsapp: whatsappSchema,
  email: emailSchema,
});

export const createStudentSchema = baseStudentSchema.extend({
  cpf: cpfSchema,
});

export const editStudentSchema = baseStudentSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Envie pelo menos um campo para edição",
  });

export type StudentFormData = z.infer<typeof createStudentSchema>;
export type StudentEditFormData = Partial<StudentFormData>;
