import { normalize } from "./normalize.js";

const CNPJ_LENGTH = 14;
const BODY_LENGTH = 12;
const CNPJ_FORM = /^[0-9A-Z]{12}[0-9]{2}$/;
const FIRST_DV_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const SECOND_DV_WEIGHTS = [6, ...FIRST_DV_WEIGHTS];
const ASCII_ZERO = 48;

function normalizeCnpj(input: string): string | null {
  const normalized = normalize(input);
  if (normalized === null || !CNPJ_FORM.test(normalized)) return null;
  if (new Set(normalized).size === 1) return null;
  return normalized;
}

function checkDigit(characters: string, weights: number[]): number {
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += (characters.charCodeAt(i) - ASCII_ZERO) * (weights[i] ?? 0);
  }
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

function hasValidCheckDigits(normalized: string): boolean {
  const first = checkDigit(normalized.slice(0, BODY_LENGTH), FIRST_DV_WEIGHTS);
  const second = checkDigit(
    normalized.slice(0, BODY_LENGTH + 1),
    SECOND_DV_WEIGHTS,
  );
  return normalized.slice(BODY_LENGTH) === `${first}${second}`;
}

function toValidCnpj(input: string): string | null {
  const normalized = normalizeCnpj(input);
  return normalized !== null && hasValidCheckDigits(normalized)
    ? normalized
    : null;
}

export function isValidCnpj(input: string): boolean {
  return toValidCnpj(input) !== null;
}

export function formatCnpj(input: string): string | null {
  const cnpj = toValidCnpj(input);
  if (cnpj === null) return null;
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, CNPJ_LENGTH - 2)}-${cnpj.slice(CNPJ_LENGTH - 2)}`;
}
