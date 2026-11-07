import { describe, expect, it } from "vitest";
import * as api from "../src/index.js";

describe("entry point", () => {
  it("não expõe helpers internos (normalização é interna)", () => {
    expect(api).not.toHaveProperty("normalize");
  });
});
