import { describe, expect, it } from "vitest";
import { formatCpf, isValidCpf } from "../src/index.js";

const VALID_CPFS = [
  ["com Máscara", "529.982.247-25"],
  ["sem Máscara", "52998224725"],
  ["espaços nas pontas", "  52998224725 "],
  ["Máscara com espaços nas pontas", "\t529.982.247-25\n"],
  ["Máscara em posições não padrão", "529982.247-25"],
  ["outro CPF válido", "111.444.777-35"],
  ["1º DV 0 (resto < 2)", "100.000.001-08"],
  ["2º DV 0 (resto < 2)", "100.000.002-80"],
] as const;

const INVALID_CPFS = [
  ["1º DV errado", "529.982.247-35"],
  ["2º DV errado", "529.982.247-26"],
  ["ambos os DVs errados", "529.982.247-00"],
  ["menos de 11 dígitos", "5299822472"],
  ["mais de 11 dígitos", "529982247250"],
  ["vazio", ""],
  ["só espaços", "   "],
  ["só Máscara", "..-"],
  ["letra no meio", "529a982247-25"],
  ["letra no lugar de DV", "5299822472A"],
  ["espaço no meio", "529 982 247 25"],
  ["barra de CNPJ", "529/982.247-25"],
  ["sequência repetida com Máscara", "111.111.111-11"],
  ["sequência repetida de zeros", "00000000000"],
  ["sequência repetida de noves", "99999999999"],
  ["string longa", "5".repeat(10_000)],
  ["unicode", "５２９.９８２.２４７-２５"],
  ["emoji", "529.982.247-2\u{1F600}"],
] as const;

describe("isValidCpf", () => {
  it.each(VALID_CPFS)("aceita CPF válido: %s", (_caso, input) => {
    expect(isValidCpf(input)).toBe(true);
  });

  it.each(INVALID_CPFS)("rejeita CPF inválido: %s", (_caso, input) => {
    expect(isValidCpf(input)).toBe(false);
  });

  it.each([
    ["vazio", ""],
    ["só espaços", "   "],
    ["string longa", "9".repeat(100_000)],
    ["unicode", "\u0000\uD800ñ漢字\u{1F600}"],
  ])("nunca lança exceção: %s", (_caso, input) => {
    expect(() => isValidCpf(input)).not.toThrow();
  });
});

describe("formatCpf", () => {
  it.each(VALID_CPFS.slice(0, 5))(
    "devolve 529.982.247-25 para qualquer forma válida: %s",
    (_caso, input) => {
      expect(formatCpf(input)).toBe("529.982.247-25");
    },
  );

  it.each([
    ["111.444.777-35", "111.444.777-35"],
    ["11144477735", "111.444.777-35"],
    ["100.000.001-08", "100.000.001-08"],
    ["10000000108", "100.000.001-08"],
    ["10000000280", "100.000.002-80"],
  ])("formata %s como %s", (input, esperado) => {
    expect(formatCpf(input)).toBe(esperado);
  });

  it.each(INVALID_CPFS)("devolve null para CPF inválido: %s", (_caso, input) => {
    expect(formatCpf(input)).toBeNull();
  });
});

describe("formatCpf e isValidCpf concordam", () => {
  it.each([...VALID_CPFS, ...INVALID_CPFS])(
    "formatCpf !== null ⇔ isValidCpf: %s",
    (_caso, input) => {
      expect(formatCpf(input) !== null).toBe(isValidCpf(input));
    },
  );
});
