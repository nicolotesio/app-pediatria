import { describe, expect, it } from "vitest";
import {
  calculateAllResults,
  calculateZScore,
  getLmsWeek,
  getRowsForParameter,
  valueAtZScore
} from "../lib/calculators/ines";

describe("calcolatore centili neonatali INeS", () => {
  it("riproduce l'esempio ufficiale del peso a 27 settimane", () => {
    const result = calculateAllResults("male", false, 27, 0, { weight: 1000 });
    const weight = result.results[0];

    expect(weight.zScore).toBeCloseTo(0.18, 2);
    expect(weight.percentile).toBeCloseTo(56.99, 2);
    expect(weight.percentileLabel).toBe("57°");
  });

  it("restituisce il 50° percentile per i valori M", () => {
    const result = calculateAllResults("male", false, 39, 4, {
      weight: 3579,
      length: 51.1,
      headCircumference: 35
    });

    expect(result.gestationalAgeKey).toBe("39+4");
    expect(result.lmsWeek).toBe(40);
    result.results.forEach((metric) => {
      expect(metric.zScore).toBeCloseTo(0, 8);
      expect(metric.percentile).toBeCloseTo(50, 4);
    });
  });

  it("usa la serie distinta per i primogeniti", () => {
    const nonFirstborn = calculateAllResults("female", false, 40, 0, { weight: 3431 });
    const firstborn = calculateAllResults("female", true, 40, 0, { weight: 3431 });

    expect(nonFirstborn.results[0].zScore).toBeCloseTo(0, 8);
    expect(firstborn.results[0].zScore).toBeGreaterThan(0);
  });

  it("accetta il range da 23+0 a 42+3 e rifiuta età successive", () => {
    expect(() => calculateAllResults("female", true, 23, 0, { length: 29.7 })).not.toThrow();
    expect(() => calculateAllResults("female", true, 42, 0, { length: 50.5 })).not.toThrow();
    expect(() => calculateAllResults("female", true, 42, 3, { length: 50.5 })).not.toThrow();
    expect(() => calculateAllResults("female", true, 42, 4, { length: 50.5 })).toThrow("23+0 e 42+3");
  });

  it("arrotonda l'età gestazionale come il calcolatore ufficiale", () => {
    expect([0, 1, 2, 3].map((days) => getLmsWeek(35, days))).toEqual([35, 35, 35, 35]);
    expect([4, 5, 6].map((days) => getLmsWeek(35, days))).toEqual([36, 36, 36]);

    const at35Weeks4Days = calculateAllResults("male", false, 35, 4, { weight: 2600 });
    const at36Weeks = calculateAllResults("male", false, 36, 0, { weight: 2600 });
    expect(at35Weeks4Days.results[0].zScore).toBeCloseTo(at36Weeks.results[0].zScore, 12);
  });

  it("mantiene invertibili le trasformazioni LMS", () => {
    const row = getRowsForParameter("headCircumference", "male", false).find((item) => item.week === 34);
    expect(row).toBeDefined();

    const value = valueAtZScore(row!, 1.5);
    expect(calculateZScore(value, row!)).toBeCloseTo(1.5, 10);
  });

  it("mostra gli estremi senza arrotondarli a 0° o 100°", () => {
    const low = calculateAllResults("male", false, 39, 0, { weight: 1000 });
    const high = calculateAllResults("male", false, 39, 0, { weight: 6000 });

    expect(low.results[0].percentileLabel).toBe("< 1°");
    expect(high.results[0].percentileLabel).toBe("> 99°");
  });
});
