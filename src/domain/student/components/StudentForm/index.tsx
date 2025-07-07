import { useEffect } from "react";
import { Input } from "../../../../shared/components/Input";
import { formatarCEP, formatarCPF } from "../../../../shared/utils/formatters";
import styles from "./student-form.module.css";
import { validarCEP } from "../../../../shared/utils";
import { Button } from "../../../../shared/components/Button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStudentsContext } from "../../../../hooks/useStudentsContext";
import { createStudentSchema, type StudentFormData } from "./studentSchemas";
import { useToastContext } from "../../../../hooks/useToastContext";

interface IStudentForm {
  onClose: () => void;
}

export const StudentForm: React.FC<IStudentForm> = ({ onClose }) => {
  const { reFetch } = useStudentsContext();
  const toast = useToastContext();
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(createStudentSchema),
  });
  const cepValue = watch("cep");
  const formatarInput = (
    valor: string,
    formatador: (value: string) => string
  ) => {
    return valor ? formatador(valor) : "";
  };
  useEffect(() => {
    async function buscarEndereco() {
      const cepLimpo = cepValue?.replace(/\D/g, "") || "";

      if (cepLimpo.length === 8 && validarCEP(cepValue)) {
        try {
          const response = await fetch(
            `https://brasilapi.com.br/api/cep/v1/${cepLimpo}`
          );
          const data = await response.json();
          if (data) {
            setValue("neighborhood", data.neighborhood || "");
            setValue("city", data.city || "");
            setValue("state", data.state || "");
            setValue("logradouro", data.street || "");
            setValue("street", data.street || "");
          }
        } catch (error) {
          if (error instanceof Error)
            toast.error(error.message, "Erro ao buscar endereço");
          console.error("Erro ao buscar endereço:", error);
          setError("cep", { message: "Falha ao buscar CEP" });
        }
      }
    }

    buscarEndereco();
  }, [cepValue, setValue, setError]);

  const onSubmit = async (data: StudentFormData) => {
    console.log(`${import.meta.env.VITE_API_URL}`);
    delete data.logradouro;
    data.lastName = data.lastName.trimEnd();
    try {
      const url = `${import.meta.env.VITE_API_URL}/students/create`;
      const method = "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.status !== 201) {
        toast.error(responseData.message, "Erro ao criar aluno");
        return;
      }

      toast.success("Aluno criado com sucesso", "Sucesso");
      reFetch();
      onClose();
    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message, "Comunicar error ao desenvolvedor");
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
            label="CPF"
            placeholder="CPF"
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

      <h3>Endereço Domiciliar</h3>
      <Controller
        name="cep"
        control={control}
        render={({ field }) => (
          <Input
            label="CEP"
            placeholder="CEP"
            value={formatarInput(field.value, formatarCEP)}
            onChange={(e) => {
              const valor = e.target.value.replace(/\D/g, "");
              field.onChange(valor);
            }}
            variant={errors.cep ? "error" : "primary"}
          />
        )}
      />
      {errors.cep && <span className={styles.error}>{errors.cep.message}</span>}
      <Controller
        name="number"
        control={control}
        render={({ field }) => (
          <Input
            label="Numero"
            placeholder="Numero"
            value={field.value || ""}
            onChange={(e) => {
              const valor = e.target.value.replace(/\D/g, "");
              field.onChange(valor);
            }}
            variant={errors.number ? "error" : "primary"}
          />
        )}
      />
      {errors.number && (
        <span className={styles.error}>{errors.number.message}</span>
      )}
      <Controller
        name="neighborhood"
        control={control}
        render={({ field }) => (
          <Input
            label="Bairro"
            placeholder="Bairro"
            value={field.value || ""}
            onChange={(e) => {
              const valor = e.target.value;
              field.onChange(valor);
            }}
            variant={errors.neighborhood ? "error" : "primary"}
            disabled
          />
        )}
      />
      <Controller
        name="logradouro"
        control={control}
        render={({ field }) => (
          <Input
            label="Logradouro"
            placeholder="Logradouro"
            value={field.value || ""}
            onChange={(e) => {
              const valor = e.target.value;
              field.onChange(valor);
            }}
            variant={errors.logradouro ? "error" : "primary"}
            disabled
          />
        )}
      />
      <Controller
        name="state"
        control={control}
        render={({ field }) => (
          <Input
            label="Estado"
            placeholder="Estado"
            value={field.value || ""}
            onChange={(e) => {
              const valor = e.target.value;
              field.onChange(valor);
            }}
            variant={errors.state ? "error" : "primary"}
            disabled
          />
        )}
      />
      <Controller
        name="city"
        control={control}
        render={({ field }) => (
          <Input
            label="Cidade"
            placeholder="Cidade"
            value={field.value || ""}
            onChange={(e) => {
              const valor = e.target.value;
              field.onChange(valor);
            }}
            variant={errors.city ? "error" : "primary"}
            disabled
          />
        )}
      />

      <h3>Contatos</h3>
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <Input
            label="Telefone"
            placeholder="Telefone"
            value={field.value || ""}
            onChange={(e) => {
              const valor = e.target.value.replace(/\D/g, "").trim();
              field.onChange(valor);
            }}
            variant={errors.phone ? "error" : "primary"}
          />
        )}
      />
      {errors.phone && (
        <span className={styles.error}>{errors.phone.message}</span>
      )}
      <Controller
        name="whatsapp"
        control={control}
        render={({ field }) => (
          <Input
            label="Whatsapp"
            placeholder="Whatsapp"
            value={field.value || ""}
            onChange={(e) => {
              const valor = e.target.value.replace(/\D/g, "").trim();
              field.onChange(valor);
            }}
            variant={errors.whatsapp ? "error" : "primary"}
          />
        )}
      />
      {errors.whatsapp && (
        <span className={styles.error}>{errors.whatsapp.message}</span>
      )}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Input
            label="Email"
            placeholder="Email"
            value={field.value || ""}
            onChange={(e) => {
              const valor = e.target.value.trim();
              field.onChange(valor);
            }}
            variant={errors.email ? "error" : "primary"}
          />
        )}
      />
      {errors.email && (
        <span className={styles.error}>{errors.email.message}</span>
      )}

      <Button type="submit" variant="primary">
        {"Salvar"}
      </Button>
    </form>
  );
};
