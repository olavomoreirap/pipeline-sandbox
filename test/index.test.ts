import { describe, expect, it } from "vitest";
import * as api from "../src/index.js";

describe("entry point", () => {
  it("carrega sem expor helpers internos (normalização é interna)", () => {
    expect(Object.keys(api)).toEqual([]);
  });
});
