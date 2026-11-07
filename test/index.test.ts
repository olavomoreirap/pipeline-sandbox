import { describe, expect, it } from "vitest";
import * as api from "../src/index.js";

describe("entry point", () => {
  it("expõe exatamente as quatro funções públicas (normalização é interna)", () => {
    expect(Object.keys(api).sort()).toEqual([
      "formatCnpj",
      "formatCpf",
      "isValidCnpj",
      "isValidCpf",
    ]);
  });
});
