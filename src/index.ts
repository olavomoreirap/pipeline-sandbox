// Único entry point da lib. As funções públicas (isValidCpf, formatCpf,
// isValidCnpj, formatCnpj) entram nas waves seguintes.
// O módulo ./normalize.js é interno e não deve ser reexportado aqui.
export { formatCnpj, isValidCnpj } from "./cnpj.js";
