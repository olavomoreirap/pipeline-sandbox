import { describe, expect, it } from "vitest";
import { formatCnpj, isValidCnpj } from "../src/index.js";

const NUMERIC = "11.222.333/0001-81";
const ALPHANUMERIC = "12.ABC.345/01DE-35";

// Documentos válidos gerados fora da implementação: a letra varia na 1ª posição
// e o DV é o que decide a validade.
const DVS_BY_LETTER = "09 62 16 70 23 87 30 94 48 00 55 09 62 16 70 23 87 30 94 48 00 55 09 62 16 70".split(" ");

const LETTER_CASES = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map(
  (letter, index) => ({
    letter,
    documento: `${letter}23456789012${DVS_BY_LETTER[index]}`,
  }),
);

const VALID: ReadonlyArray<readonly [string, string, string]> = [
  ["numérico com Máscara", NUMERIC, "11.222.333/0001-81"],
  ["numérico sem Máscara", "11222333000181", "11.222.333/0001-81"],
  ["outro numérico com Máscara", "11.444.777/0001-61", "11.444.777/0001-61"],
  ["outro numérico sem Máscara", "11444777000161", "11.444.777/0001-61"],
  ["exemplo oficial alfanumérico com Máscara", ALPHANUMERIC, ALPHANUMERIC],
  ["exemplo oficial alfanumérico sem Máscara", "12ABC34501DE35", ALPHANUMERIC],
  ["alfanumérico em minúsculas com Máscara", "12.abc.345/01de-35", ALPHANUMERIC],
  ["alfanumérico em minúsculas sem Máscara", "12abc34501de35", ALPHANUMERIC],
  ["alfanumérico com maiúsculas e minúsculas", "12AbC34501dE35", ALPHANUMERIC],
  ["espaços nas pontas", `  ${ALPHANUMERIC}  `, ALPHANUMERIC],
  ["tabulação e quebra de linha nas pontas", `\t${NUMERIC}\n`, NUMERIC],
  ["gêmeo ASCII de ſ (S)", "S2345678901294", "S2.345.678/9012-94"],
  ["gêmeo ASCII de ı (I)", "I2345678901248", "I2.345.678/9012-48"],
  ["gêmeo ASCII de ß (SS)", "SS345678901294", "SS.345.678/9012-94"],
  ["gêmeo ASCII de ﬁ (FI)", "FI345678901240", "FI.345.678/9012-40"],
  ["Máscara em posições não padrão", "1.12.22.333.000.1-81", NUMERIC],
];

const INVALID: ReadonlyArray<readonly [string, string]> = [
  ["string vazia", ""],
  ["só espaços", "     "],
  ["só Máscara", "../-"],
  ["menos de 14 caracteres", "1122233300018"],
  ["mais de 14 caracteres", "112223330001811"],
  ["alfanumérico com 13 caracteres", "12ABC34501DE3"],
  ["alfanumérico com 15 caracteres", "12ABC34501DE350"],
  ["1º DV errado (numérico)", "11.222.333/0001-91"],
  ["2º DV errado (numérico)", "11.222.333/0001-82"],
  ["1º DV errado (alfanumérico)", "12.ABC.345/01DE-45"],
  ["2º DV errado (alfanumérico)", "12.ABC.345/01DE-36"],
  ["corpo alterado (alfanumérico)", "12.ABD.345/01DE-35"],
  ["letra no 1º DV", "12.ABC.345/01DE-A5"],
  ["letra no 2º DV", "12.ABC.345/01DE-3A"],
  ["letras nos dois DVs", "12.ABC.345/01DE-AB"],
  ["caractere proibido: underscore", "12.ABC.345/01D_-35"],
  ["caractere proibido: espaço no meio", "12.ABC.345/01 DE-35"],
  ["caractere proibido: vírgula", "11,222,333/0001-81"],
  ["caractere proibido: símbolo", "12.ABC.345/01D$-35"],
  ["caractere proibido: letra acentuada", "12.ABC.345/01DÉ-35"],
  ["Sequência repetida numérica", "00000000000000"],
  ["Sequência repetida numérica com Máscara", "00.000.000/0000-00"],
  ["Sequência repetida de letras", "AAAAAAAAAAAAAA"],
  ["Sequência repetida de dígitos que não confere", "11111111111111"],
  // toUpperCase() transformaria estes em S, I, SS e FI e o documento ficaria
  // válido; só [0-9A-Za-z] ASCII passa (os gêmeos ASCII estão em VALID).
  ["ſ (s longo) no lugar de S", "ſ2345678901294"],
  ["ı (i sem ponto) no lugar de I", "ı2345678901248"],
  ["ß no lugar de SS", "ß345678901294"],
  ["ligadura ﬁ no lugar de FI", "ﬁ345678901240"],
  ["ſ com Máscara", "ſ2.345.678/9012-94"],
  ["K de Kelvin (U+212A)", "K2345678901255"],
  ["dígitos de largura total", "１１２２２３３３０００１８１"],
  ["dígitos árabe-índicos", "١١٢٢٢٣٣٣٠٠٠١٨١"],
  ["letras gregas", "ΑΒΓΔΕΖΗΘΙΚΛΜ35"],
  ["emoji", "11.222.333/0001-8😀"],
  ["string longa", "1".repeat(100_000)],
  ["string longa de unicode", "ß".repeat(50_000)],
];

describe("isValidCnpj", () => {
  it.each(VALID)("aceita %s", (_, input) => {
    expect(isValidCnpj(input)).toBe(true);
  });

  it.each(LETTER_CASES)(
    "aceita a letra $letter nas 12 primeiras posições (o DV decide)",
    ({ documento }) => {
      expect(isValidCnpj(documento)).toBe(true);
      expect(isValidCnpj(documento.toLowerCase())).toBe(true);
    },
  );

  it.each(INVALID)("rejeita %s", (_, input) => {
    expect(isValidCnpj(input)).toBe(false);
  });

  it("nunca lança exceção para qualquer string", () => {
    const inputs = [
      ...VALID.map(([, input]) => input),
      ...INVALID.map(([, input]) => input),
      "\u0000",
      "\uD800",
      "\uDFFF",
      "\u{1F600}".repeat(1_000),
    ];
    for (const input of inputs) {
      expect(() => isValidCnpj(input)).not.toThrow();
      expect(() => formatCnpj(input)).not.toThrow();
    }
  });
});

describe("formatCnpj", () => {
  it.each(VALID)("formata %s", (_, input, expected) => {
    expect(formatCnpj(input)).toBe(expected);
  });

  it("formata 12abc34501de35 como 12.ABC.345/01DE-35", () => {
    expect(formatCnpj("12abc34501de35")).toBe("12.ABC.345/01DE-35");
  });

  it.each(LETTER_CASES)(
    "formata a letra $letter em maiúscula com a Máscara",
    ({ letter, documento }) => {
      const formatted = formatCnpj(documento.toLowerCase());
      expect(formatted).toMatch(/^[0-9A-Z]{2}\.[0-9A-Z]{3}\.[0-9A-Z]{3}\/[0-9A-Z]{4}-[0-9]{2}$/);
      expect(formatted?.startsWith(letter)).toBe(true);
    },
  );

  it.each(INVALID)("devolve null para %s", (_, input) => {
    expect(formatCnpj(input)).toBeNull();
  });
});

describe("formatCnpj e isValidCnpj concordam", () => {
  const ALL_INPUTS: ReadonlyArray<string> = [
    ...VALID.map(([, input]) => input),
    ...LETTER_CASES.map(({ documento }) => documento),
    ...INVALID.map(([, input]) => input),
  ];

  it.each(ALL_INPUTS.map((input) => [input.slice(0, 40), input] as const))(
    "formatCnpj(x) !== null ⇔ isValidCnpj(x) para %j",
    (_, input) => {
      expect(formatCnpj(input) !== null).toBe(isValidCnpj(input));
    },
  );
});
