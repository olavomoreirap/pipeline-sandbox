// Único entry point da lib: as quatro funções públicas (isValidCpf, formatCpf,
// isValidCnpj, formatCnpj).
// O módulo ./normalize.js é interno e não deve ser reexportado aqui.
export { formatCnpj, isValidCnpj } from "./cnpj.js";
export { formatCpf, isValidCpf } from "./cpf.js";
