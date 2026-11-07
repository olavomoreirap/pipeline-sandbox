// Único entry point da lib. As funções públicas de CNPJ (isValidCnpj,
// formatCnpj) entram na wave 2 (#5).
// O módulo ./normalize.js é interno e não deve ser reexportado aqui.
export { formatCpf, isValidCpf } from "./cpf.js";
