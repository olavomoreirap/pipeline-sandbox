const MASK_CHARACTERS = /[.\-/]/g;
const NORMALIZED_FORM = /^[0-9A-Z]*$/;

/**
 * Devolve a Forma normalizada do Documento: sem espaços nas pontas, sem
 * `.`, `-` e `/`, com letras em maiúsculas. Retorna `null` quando sobra
 * qualquer outro caractere (o Documento é inválido).
 */
export function normalize(input: string): string | null {
  const normalized = input.trim().replace(MASK_CHARACTERS, "").toUpperCase();
  return NORMALIZED_FORM.test(normalized) ? normalized : null;
}
