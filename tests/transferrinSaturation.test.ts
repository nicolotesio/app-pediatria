import { describe, expect, it } from "vitest";
import { calculateTransferrinSaturation, convertTransferrinToMgDl } from "../lib/calculators/transferrinSaturation";

describe("transferrin saturation", () => {
  it("calcola la saturazione da sideremia e transferrina in mg/dL", () => {
    expect(calculateTransferrinSaturation({ serumIronMcgDl: 100, transferrin: 250, transferrinUnit: "mgdl" })).toBeCloseTo(28.17, 2);
  });

  it("converte la transferrina da g/L", () => {
    expect(convertTransferrinToMgDl(2.5, "gl")).toBe(250);
    expect(calculateTransferrinSaturation({ serumIronMcgDl: 100, transferrin: 2.5, transferrinUnit: "gl" })).toBeCloseTo(28.17, 2);
  });

  it("rifiuta transferrina non positiva", () => {
    expect(() => calculateTransferrinSaturation({ serumIronMcgDl: 100, transferrin: 0, transferrinUnit: "mgdl" })).toThrow("transferrina valida");
  });
});
