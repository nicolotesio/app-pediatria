import { describe, expect, it } from "vitest";
import { calculateAgeDecimalFromDates, calculateSiedpGrowth, formatCompletedAgeFromDates, formatSiedpAge } from "../lib/calculators/siedpGrowth";

describe("calculateSiedpGrowth", () => {
  it("calcola centile e SDS al 50esimo percentile per peso maschile a 2 anni", () => {
    const result = calculateSiedpGrowth("male", 2, 12.8, 88.8);

    expect(result.weight.zScore).toBeCloseTo(0, 3);
    expect(result.weight.percentile).toBeCloseTo(50, 1);
    expect(result.height.zScore).toBeCloseTo(0, 3);
    expect(result.height.percentile).toBeCloseTo(50, 1);
  });

  it("interpola i valori LMS quando eta non coincide con una riga", () => {
    const result = calculateSiedpGrowth("male", 2.25, 13.4, 90.95);

    expect(result.weight.lms.M).toBeCloseTo(13.4, 3);
    expect(result.height.lms.M).toBeCloseTo(90.95, 3);
    expect(result.weight.zScore).toBeCloseTo(0, 3);
    expect(result.height.zScore).toBeCloseTo(0, 3);
  });

  it("classifica il BMI usando le soglie OW e OB", () => {
    expect(calculateSiedpGrowth("male", 2, 18, 100).bmi.classification).toBe("Sovrappeso");
    expect(calculateSiedpGrowth("male", 2, 21.4, 100).bmi.classification).toBe("Obesità");
    expect(calculateSiedpGrowth("male", 2, 17.9, 100).bmi.classification).toBe("Normopeso");
  });

  it("calcola eta decimale da data di nascita e misurazione", () => {
    const age = calculateAgeDecimalFromDates("2020-01-01", "2028-01-01");

    expect(age).toBeCloseTo(8, 2);
  });

  it("calcola l'eta decimale come frazione di anno per i calcoli", () => {
    expect(calculateAgeDecimalFromDates("2024-05-15", "2026-05-14")).toBeCloseTo(1.996, 3);
    expect(calculateAgeDecimalFromDates("2024-05-15", "2026-05-15")).toBeCloseTo(2, 2);
    expect(calculateAgeDecimalFromDates("2020-12-15", "2026-05-14")).toBeCloseTo(5.410, 3);
  });

  it("formatta l'eta da date in anni e mesi compiuti", () => {
    expect(formatCompletedAgeFromDates("2020-12-15", "2026-05-14")).toBe("5 anni 4 mesi");
    expect(formatCompletedAgeFromDates("2024-05-15", "2026-05-14")).toBe("1 anno 11 mesi");
    expect(formatCompletedAgeFromDates("2024-05-15", "2026-05-15")).toBe("2 anni");
  });

  it("formatta l'eta del selettore in anni e mesi", () => {
    expect(formatSiedpAge(64 / 12)).toBe("5 anni 4 mesi");
    expect(formatSiedpAge(2)).toBe("2 anni");
  });

  it("rifiuta eta fuori range", () => {
    expect(() => calculateSiedpGrowth("female", 1.99, 12, 90)).toThrow("Età consentita solo tra 2 anni e 20 anni.");
    expect(() => calculateSiedpGrowth("female", 20.1, 70, 170)).toThrow("Età consentita solo tra 2 anni e 20 anni.");
  });
});
