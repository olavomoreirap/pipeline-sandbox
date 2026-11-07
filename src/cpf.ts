import { normalize } from "./normalize.js";

const CPF_LENGTH = 11;
const DIGITS_ONLY = /^[0-9]+$/;
const REPEATED_SEQUENCE = /^(.)\1*$/;

function checkDigit(digits: string, length: number): number {
  let sum = 0;
  for (let i = 0; i < length; i++) {
    sum += Number(digits[i]) * (length + 1 - i);
  }
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

function normalizeCpf(input: string): string | null {
  // A normalização compartilhada também remove "/" (Máscara de CNPJ); no CPF ele é inválido.
  if (input.includes("/")) return null;
  const normalized = normalize(input);
  if (normalized === null) return null;
  if (normalized.length !== CPF_LENGTH || !DIGITS_ONLY.test(normalized)) return null;
  if (REPEATED_SEQUENCE.test(normalized)) return null;

  const hasValidCheckDigits =
    checkDigit(normalized, 9) === Number(normalized[9]) &&
    checkDigit(normalized, 10) === Number(normalized[10]);
  return hasValidCheckDigits ? normalized : null;
}

export function isValidCpf(input: string): boolean {
  return normalizeCpf(input) !== null;
}

export function formatCpf(input: string): string | null {
  const cpf = normalizeCpf(input);
  if (cpf === null) return null;
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
}
