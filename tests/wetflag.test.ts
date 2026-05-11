import { describe, expect, it } from "vitest";
import { calculateWetflag } from "../lib/calculators/wetflag";

describe("calculateWetflag", () => {
  it("calcola i valori WETFLAG per 4 anni", () => {
    const result = calculateWetflag(4);

    expect(result.estimatedWeightKg).toBe(16);
    expect(result.defibrillationEnergyJ).toBe(64);
    expect(result.endotrachealTubeMm.uncuffed).toBe(5);
    expect(result.endotrachealTubeMm.cuffed).toBe(4.5);
    expect(result.endotrachealTubeMm.oralDepthCm).toBe(14);
    expect(result.fluidBolusMl).toBe(320);
    expect(result.fluidBolusOptionsMl.tenPerKg).toBe(160);
    expect(result.fluidBolusOptionsMl.twentyPerKg).toBe(320);
    expect(result.lorazepam.mg).toBe(1.6);
    expect(result.adrenaline.micrograms).toBe(160);
    expect(result.adrenaline.mlOfOneInTenThousand).toBe(1.6);
    expect(result.glucose.d10Ml).toBe(32);
    expect(result.glucose.grams).toBe(3.2);
    expect(result.warnings).toHaveLength(0);
  });

  it("usa il peso selezionato quando disponibile", () => {
    const result = calculateWetflag(4, 20);

    expect(result.estimatedWeightKg).toBe(20);
    expect(result.defibrillationEnergyJ).toBe(80);
    expect(result.fluidBolusMl).toBe(400);
    expect(result.endotrachealTubeMm.uncuffed).toBe(5);
  });

  it("limita fluidi e lorazepam al massimo previsto", () => {
    const result = calculateWetflag(12, 70);

    expect(result.defibrillationEnergyJ).toBe(200);
    expect(result.fluidBolusOptionsMl.tenPerKg).toBe(500);
    expect(result.fluidBolusOptionsMl.twentyPerKg).toBe(500);
    expect(result.lorazepam.mg).toBe(4);
  });

  it("segnala eta fuori range", () => {
    const result = calculateWetflag(0);

    expect(result.warnings[0]).toContain("fuori range");
  });

  it("stima il peso con formula sotto 1 anno", () => {
    const result = calculateWetflag(11 / 12);

    expect(result.estimatedWeightKg).toBe(9.5);
    expect(result.warnings).toHaveLength(0);
  });

  it("include 1 mese nel range validato", () => {
    const result = calculateWetflag(1 / 12);

    expect(result.estimatedWeightKg).toBe(4.5);
    expect(result.warnings).toHaveLength(0);
  });

  it("include 1 mese anche con valore decimale del selettore", () => {
    const result = calculateWetflag(0.083);

    expect(result.estimatedWeightKg).toBe(4.5);
    expect(result.warnings).toHaveLength(0);
  });

  it("stima il peso con formula 1-5 anni fino a 5 anni e 11 mesi", () => {
    const result = calculateWetflag(71 / 12);

    expect(result.estimatedWeightKg).toBe(20);
    expect(result.warnings).toHaveLength(0);
  });

  it("stima il peso con formula 6-12 anni", () => {
    const result = calculateWetflag(6);

    expect(result.estimatedWeightKg).toBe(25);
    expect(result.warnings).toHaveLength(0);
  });

  it("rifiuta eta negativa", () => {
    expect(() => calculateWetflag(-1)).toThrow("Eta non puo essere negativa");
  });
});
