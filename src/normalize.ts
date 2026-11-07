const MASK_CHARACTERS = /[.\-/]/g;
// Valida antes do toUpperCase: letras como ſ, ı, ß e ﬁ viram ASCII (S, I, SS, FI)
// ao serem maiusculizadas e passariam por letras A–Z legítimas.
const ASCII_ALPHANUMERIC = /^[0-9A-Za-z]*$/;

/**
 * Devolve a Forma normalizada do Documento: sem espaços nas pontas, sem
 * `.`, `-` e `/`, com letras em maiúsculas. Retorna `null` quando sobra
 * qualquer caractere fora de [0-9A-Za-z] (o Documento é inválido).
 */
export function normalize(input: string): string | null {
  const stripped = input.trim().replace(MASK_CHARACTERS, "");
  return ASCII_ALPHANUMERIC.test(stripped) ? stripped.toUpperCase() : null;
}
