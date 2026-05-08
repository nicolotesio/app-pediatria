import { describe, expect, it } from "vitest";
import { calculateWetflag } from "../lib/calculators/wetflag";

describe("calculateWetflag", () => {
  it("calcola i valori WETFLAG per 4 anni", () => {
    const result = calculateWetflag(4);

    expect(result.estimatedWeightKg).toBe(16);
    expect(result.defibrillationEnergyJ).toBe(64);
    expect(result.endotrachealTubeMm.uncuffed).toBe(5);
    expect(result.endotrachealTubeMm.cuffed).toBe(4.5);
    expect(result.fluidBolusMl).toBe(320);
    expect(result.adrenaline.micrograms).toBe(160);
    expect(result.adrenaline.mlOfOneInTenThousand).toBe(1.6);
    expect(result.glucose.d10Ml).toBe(80);
    expect(result.glucose.grams).toBe(8);
    expect(result.warnings).toHaveLength(0);
  });

  it("usa il peso selezionato quando disponibile", () => {
    const result = calculateWetflag(4, 20);

    expect(result.estimatedWeightKg).toBe(20);
    expect(result.defibrillationEnergyJ).toBe(80);
    expect(result.fluidBolusMl).toBe(400);
    expect(result.endotrachealTubeMm.uncuffed).toBe(5);
  });

  it("segnala eta fuori range", () => {
    const result = calculateWetflag(12);

    expect(result.warnings[0]).toContain("fuori range");
  });

  it("rifiuta eta negativa", () => {
    expect(() => calculateWetflag(-1)).toThrow("Eta non puo essere negativa");
  });
});
