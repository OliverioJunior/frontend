/**
 * Formata um CPF adicionando pontos e traço conforme o padrão brasileiro
 * @param cpf String contendo os números do CPF
 * @returns CPF formatado
 */
export function formatarCPF(cpf: string) {
  const numeros = cpf.replace(/\D/g, "").substring(0, 11);
  const length = numeros.length;
  const formatacoes: Record<string, () => string> = {
    low: () => numeros, // 1-3 dígitos
    first: () => `${numeros.slice(0, 3)}.${numeros.slice(3)}`, // 4-6 dígitos
    second: () =>
      `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`, // 7-9 dígitos
    full: () =>
      `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(
        6,
        9
      )}-${numeros.slice(9)}`, // 10-11 dígitos
  };
  if (length <= 3) return formatacoes.low();
  if (length <= 6) return formatacoes.first();
  if (length <= 9) return formatacoes.second();
  return formatacoes.full();
}
/**
 * Formata um CEP adicionando pontos e traço conforme o padrão brasileiro
 * @param cep String contendo os números do CEP
 * @returns CEP formatado
 */
export function formatarCEP(cep: string): string {
  const numeros = cep.replace(/\D/g, "").substring(0, 8);
  const length = numeros.length;
  if (length <= 5) return numeros;
  return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
}

/**
 * Formata uma data/hora para o padrão brasileiro
 * @param dateTime String contendo a data/hora a ser formatada
 * @returns Data/hora formatada no padrão brasileiro
 */
export function formatarDateTime(dateTime: string): string {
  if (!dateTime) return "";

  try {
    const date = new Date(dateTime);

    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return dateTime;
    }

    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Sao_Paulo",
    });
  } catch {
    return dateTime;
  }
}
