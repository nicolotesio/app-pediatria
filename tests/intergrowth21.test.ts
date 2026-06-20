import { describe, expect, it } from "vitest";
import {
  calculateAllResults,
  getRowsForParameter,
  normalCDF,
  zScoreToPercentile
} from "../lib/calculators/intergrowth21";

describe("calculateAllResults INTERGROWTH-21", () => {
  it("calcola peso, lunghezza e circonferenza cranica maschili a 39+0", () => {
    const result = calculateAllResults("male", 39, 0, {
      weight: 3300,
      length: 50,
      headCircumference: 34
    });

    const weight = result.results.find((item) => item.parameter === "weight");
    const length = result.results.find((item) => item.parameter === "length");
    const headCircumference = result.results.find((item) => item.parameter === "headCircumference");

    expect(weight?.zScore).toBeCloseTo(0.1429, 4);
    expect(weight?.percentile).toBeCloseTo(55.68, 2);
    expect(weight?.percentileLabel).toBe("56°");
    expect(length?.zScore).toBeCloseTo(0.4226, 4);
    expect(length?.percentile).toBeCloseTo(66.37, 2);
    expect(headCircumference?.zScore).toBeCloseTo(0.0840, 4);
    expect(headCircumference?.percentile).toBeCloseTo(53.35, 2);
  });

  it("usa i valori corretti della lunghezza maschile da 33 settimane in avanti", () => {
    const row = getRowsForParameter("length", "male").find((item) => item.weeks === 39 && item.days === 0);

    expect(row?.values["-3DS"]).toBeCloseTo(43.56, 2);
    expect(row?.values.M).toBeCloseTo(49.29, 2);
    expect(row?.values["+3DS"]).toBeCloseTo(55.09, 2);
  });

  it("mantiene i riferimenti della normale standard", () => {
    expect(zScoreToPercentile(-3)).toBeCloseTo(0.13, 2);
    expect(zScoreToPercentile(-2)).toBeCloseTo(2.28, 2);
    expect(normalCDF(0) * 100).toBeCloseTo(50, 2);
    expect(zScoreToPercentile(2)).toBeCloseTo(97.72, 2);
    expect(zScoreToPercentile(3)).toBeCloseTo(99.87, 2);
  });
});
