import { describe, expect, it } from "vitest";
import rawWhoGrowthData from "../public/data/who-growth.json";
import { calculateAgeDaysFromDates, calculateCorrectedAgeDays, calculateWhoGrowth, getWhoRows, type WhoGrowthData } from "../lib/calculators/whoGrowth";

const whoGrowthData = rawWhoGrowthData as unknown as WhoGrowthData;

describe("calculateWhoGrowth", () => {
  it("calcola Z-score e percentile alla mediana WHO", () => {
    const medianBirthWeight = getWhoRows(whoGrowthData, "wfa", "male")[0].M;
    const result = calculateWhoGrowth(whoGrowthData, "male", 0, medianBirthWeight, 49.9, 34.5);
    const weight = result.results.find((item) => item.key === "weight");

    expect(weight?.zScore).toBeCloseTo(0, 3);
    expect(weight?.percentile).toBeCloseTo(50, 1);
  });

  it("calcola il solo centile del peso quando sono inseriti solo peso ed età", () => {
    const result = calculateWhoGrowth(whoGrowthData, "male", 365, 10, null, null);

    expect(result.results).toHaveLength(1);
    expect(result.results[0]?.key).toBe("weight");
  });

  it("sotto o uguale a 730 giorni usa weight-for-length e non BMI", () => {
    const result = calculateWhoGrowth(whoGrowthData, "female", 730, 10.2, 80, 46);

    expect(result.mode).toBe("under2");
    expect(result.bmi).toBeNull();
    expect(result.results.some((item) => item.dataset === "wfl")).toBe(true);
    expect(result.results.some((item) => item.dataset === "bfa")).toBe(false);
  });

  it("oltre 730 giorni usa BMI-for-age e non weight-for-length", () => {
    const result = calculateWhoGrowth(whoGrowthData, "male", 731, 12.5, 86, 48);

    expect(result.mode).toBe("over2");
    expect(result.bmi).toBeCloseTo(16.9, 1);
    expect(result.results.some((item) => item.dataset === "bfa")).toBe(true);
    expect(result.results.some((item) => item.dataset === "wfl")).toBe(false);
  });

  it("oltre +3 DS applica la correzione WHO agli indicatori basati sul peso", () => {
    const row = getWhoRows(whoGrowthData, "wfa", "male").find((item) => item.x === 365);
    if (!row) throw new Error("Riga WHO a 365 giorni non trovata");
    const [, , , , , sd2, sd3] = row.sd;
    const weightKg = 16;
    const result = calculateWhoGrowth(whoGrowthData, "male", 365, weightKg, null, null);

    expect(result.results[0]?.zScore).toBeCloseTo(3 + (weightKg - sd3) / (sd3 - sd2), 1);
  });

  it("sotto -3 DS applica la correzione WHO agli indicatori basati sul peso", () => {
    const row = getWhoRows(whoGrowthData, "wfa", "male").find((item) => item.x === 365);
    if (!row) throw new Error("Riga WHO a 365 giorni non trovata");
    const [sd3neg, sd2neg] = row.sd;
    const weightKg = 5.5;
    const result = calculateWhoGrowth(whoGrowthData, "male", 365, weightKg, null, null);

    expect(result.results[0]?.zScore).toBeCloseTo(-3 + (weightKg - sd3neg) / (sd2neg - sd3neg), 1);
  });

  it("non modifica gli z-score entro ±3 DS né quelli della lunghezza", () => {
    const result = calculateWhoGrowth(whoGrowthData, "male", 365, 9.6, 90, null);

    expect(result.results[0]?.zScore).toBeCloseTo(-0.04, 2);
    expect(result.results[1]?.zScore).toBeGreaterThan(5);
  });

  it("calcola età in giorni dalle date", () => {
    expect(calculateAgeDaysFromDates("2024-01-01", "2024-01-31")).toBe(30);
  });

  it("calcola età corretta per prematurità", () => {
    expect(calculateCorrectedAgeDays(90, 32, 0)).toBe(34);
  });

  it("non accetta età corretta negativa", () => {
    expect(() => calculateCorrectedAgeDays(10, 32, 0)).toThrow("non può essere negativa");
  });
});
