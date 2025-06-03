/**
 * Valida se um CPF é válido.
 ** @param cpf String contendo os números do CPF
 * @returns true se o CPF for válido, false caso contrário
 */

export function validarCPF(cpf: string): boolean {
  // Remove todos os caracteres não numéricos
  const cpfLimpo = cpf.replace(/\D/g, "");

  // Verifica se o CPF tem 11 dígitos
  if (cpfLimpo.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    return false;
  }

  // Converte os dígitos para números
  const digitos = cpfLimpo.split("").map(Number);

  // Cálculo do primeiro dígito verificador (DV1)
  let somaPrimeiroDígitoVerificador = 0;
  for (let i = 0; i < 9; i++) {
    somaPrimeiroDígitoVerificador += digitos[i] * (10 - i);
  }
  const restoPrimeiroDigitoVerificador = somaPrimeiroDígitoVerificador % 11;
  const dv1 =
    restoPrimeiroDigitoVerificador < 2
      ? 0
      : 11 - restoPrimeiroDigitoVerificador;

  if (dv1 !== digitos[9]) {
    return false;
  }

  // Cálculo do segundo dígito verificador (DV2)
  let somaSegundoDígitoVerificador = 0;
  for (let i = 0; i < 10; i++) {
    somaSegundoDígitoVerificador += digitos[i] * (11 - i);
  }
  const restoSegundoDigitoVerificador = somaSegundoDígitoVerificador % 11;
  const dv2 =
    restoSegundoDigitoVerificador < 2 ? 0 : 11 - restoSegundoDigitoVerificador;

  if (dv2 !== digitos[10]) {
    return false;
  }

  // Se passou por todas as verificações, é válido
  return true;
}

/**
 * Valida se um CEP é válido.
 * @param cep: string contendo o CEP
 * @return true se o CEP for válido, false caso contrário
 */

export function validarCEP(cep: string): boolean {
  const regexCEP = /^[0-9]{8}$/;
  return regexCEP.test(cep.replace(/\D/g, ""));
}

// Verifica se a data está dentro do horário comercial (seg-sex, 09:00-18:00)
export const isBusinessHours = (date: Date) => {
  const day = date.getDay(); // 0 (dom) a 6 (sáb)
  const hours = date.getHours();

  // Verifica se é dia útil (seg a sex)
  if (day >= 1 && day <= 5) {
    // Verifica se está entre 09:00 e 18:00
    return (
      hours >= 9 && (hours < 18 || (hours === 18 && date.getMinutes() === 0))
    );
  }
  return false;
};

// Calcula a data mínima permitida (agora + 24h)
export const getMinDateTime = () => {
  const now = new Date();
  const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 horas

  // Ajusta para o próximo horário comercial válido se necessário
  if (minDate.getHours() < 9) {
    minDate.setHours(9, 0, 0, 0); // Início do expediente
  } else if (minDate.getHours() >= 18) {
    minDate.setDate(minDate.getDate() + 1); // Próximo dia
    minDate.setHours(9, 0, 0, 0);
  }

  // Formato YYYY-MM-DDTHH:MM para datetime-local
  return minDate.toISOString().slice(0, 16);
};
