import { describe, expect, it } from "vitest";
import rawWhoGrowthData from "../public/data/who-growth.json";
import { calculateAgeDaysFromDates, calculateWhoGrowth, getWhoRows, type WhoGrowthData } from "../lib/calculators/whoGrowth";

const whoGrowthData = rawWhoGrowthData as unknown as WhoGrowthData;

describe("calculateWhoGrowth", () => {
  it("calcola Z-score e percentile alla mediana WHO", () => {
    const medianBirthWeight = getWhoRows(whoGrowthData, "wfa", "male")[0].M;
    const result = calculateWhoGrowth(whoGrowthData, "male", 0, medianBirthWeight, 49.9, 34.5);
    const weight = result.results.find((item) => item.key === "weight");

    expect(weight?.zScore).toBeCloseTo(0, 3);
    expect(weight?.percentile).toBeCloseTo(50, 1);
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

  it("calcola eta in giorni dalle date", () => {
    expect(calculateAgeDaysFromDates("2024-01-01", "2024-01-31")).toBe(30);
  });
});
