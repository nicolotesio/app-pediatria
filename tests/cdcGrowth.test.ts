import { describe, expect, it } from "vitest";
import {
  calculateAgeDecimalFromDates,
  calculateCdcBmi,
  calculateCdcMetric,
  formatCdcAge
} from "../lib/calculators/cdcGrowth";

describe("calculateCdcGrowth", () => {
  it("calcola Z-score e percentile alla mediana CDC", () => {
    const weight = calculateCdcMetric("weight", "male", 2, 12.6707633);
    const height = calculateCdcMetric("height", "male", 2, 86.45220101);

    expect(weight.zScore).toBeCloseTo(0, 3);
    expect(weight.percentile).toBeCloseTo(50, 1);
    expect(height.zScore).toBeCloseTo(0, 3);
    expect(height.percentile).toBeCloseTo(50, 1);
  });

  it("interpola le righe LMS tra due eta disponibili", () => {
    const result = calculateCdcMetric("weight", "male", 25 / 12, 12.81128336);

    expect(result.lms.M).toBeCloseTo(12.81128336, 4);
    expect(result.zScore).toBeCloseTo(0, 3);
  });

  it("classifica il BMI usando le soglie P85 e P95", () => {
    const overweight = calculateCdcBmi("male", 2, 18.2, 100);
    const obese = calculateCdcBmi("male", 2, 19.4, 100);
    const normal = calculateCdcBmi("male", 2, 18.1, 100);

    expect(overweight.classification).toBe("Sovrappeso");
    expect(obese.classification).toBe("Obesità");
    expect(normal.classification).toBe("Normopeso");
  });

  it("calcola eta e formato da mesi", () => {
    expect(calculateAgeDecimalFromDates("2022-01-01", "2024-01-01")).toBeCloseTo(2, 2);
    expect(formatCdcAge(2.5)).toBe("2 anni 6 mesi");
  });
});
