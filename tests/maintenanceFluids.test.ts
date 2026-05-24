import { describe, expect, it } from "vitest";
import {
  calculateHollidaySegar,
  calculateMaintenanceFluids,
  calculatePredictableLosses,
  calculatePreviousLosses,
  calculateSodiumCorrection,
  getRestrictionFactor,
  subtractOtherFluids,
  type FluidInputs
} from "../lib/calculators/maintenanceFluids";

const baseInputs: FluidInputs = {
  weightKg: 12,
  usualWeightKg: null,
  hydrationStatus: "euvolemic",
  siadhRisk: false,
  overloadRisk: false,
  sodium: null,
  potassium: null,
  sodiumTarget: 140,
  sodiumAgeGroup: "olderChild",
  fever: false,
  diarrheaStools: 0,
  measuredLossesMlDay: 0,
  otherFluidsMlDay: 0
};

describe("maintenance fluids", () => {
  it("calcola Holliday-Segar per 5 kg", () => {
    expect(calculateHollidaySegar(5)).toEqual({ mlDay: 500, mlHour: 20.8, capped: false });
  });

  it("calcola Holliday-Segar per 12 kg", () => {
    expect(calculateHollidaySegar(12)).toEqual({ mlDay: 1100, mlHour: 45.8, capped: false });
  });

  it("calcola Holliday-Segar per 25 kg", () => {
    expect(calculateHollidaySegar(25)).toEqual({ mlDay: 1600, mlHour: 66.7, capped: false });
  });

  it("applica restrizione per rischio SIADH", () => {
    expect(getRestrictionFactor({ siadhRisk: true, overloadRisk: false }).factor).toBe(0.7);
  });

  it("applica restrizione più severa per rischio overload", () => {
    expect(getRestrictionFactor({ siadhRisk: true, overloadRisk: true }).factor).toBe(0.5);
  });

  it("calcola perdite da peso perso se disponibile", () => {
    expect(calculatePreviousLosses({ weightKg: 10, usualWeightKg: 10.8, hydrationStatus: "mildDehydration" })).toMatchObject({
      ml: 800,
      source: "Da peso perso"
    });
  });

  it("calcola perdite da stima clinica se manca peso anamnestico", () => {
    expect(calculatePreviousLosses({ weightKg: 10, usualWeightKg: null, hydrationStatus: "moderateDehydration" })).toMatchObject({
      ml: 700,
      source: "Da stima clinica"
    });
  });

  it("calcola perdite prevedibili", () => {
    expect(calculatePredictableLosses({ weightKg: 10, fever: true, diarrheaStools: 3, measuredLossesMlDay: 100 }).ml).toBe(400);
  });

  it("non restituisce quota EV negativa se altri apporti superano il target", () => {
    expect(subtractOtherFluids(700, 900)).toMatchObject({
      residualMlDay: 0,
      residualMlHour: 0,
      noAdditionalIv: true
    });
  });

  it("segnala Na <125 come alert critico", () => {
    const result = calculateMaintenanceFluids({ ...baseInputs, sodium: 124 });
    expect(result.alerts.some((alert) => alert.level === "critical" && alert.message.includes("Iponatriemia severa"))).toBe(true);
  });

  it("segnala Na >160 come alert critico", () => {
    const result = calculateMaintenanceFluids({ ...baseInputs, sodium: 161 });
    expect(result.alerts.some((alert) => alert.level === "critical" && alert.message.includes("Ipernatriemia severa"))).toBe(true);
  });

  it("calcola deficit sodio per iponatriemia", () => {
    const result = calculateSodiumCorrection({ weightKg: 10, hydrationStatus: "euvolemic", sodiumAgeGroup: "olderChild", sodium: 130, sodiumTarget: 140 });
    expect(result.sodiumDeficitMEq).toBe(70);
  });

  it("calcola eccesso sodio per ipernatriemia", () => {
    const result = calculateSodiumCorrection({ weightKg: 10, hydrationStatus: "euvolemic", sodiumAgeGroup: "olderChild", sodium: 154, sodiumTarget: 140 });
    expect(result.sodiumExcessMEq).toBe(98);
  });

  it("usa VdNa ridotto in disidratazione nel bambino grande", () => {
    const result = calculateSodiumCorrection({ weightKg: 10, hydrationStatus: "moderateDehydration", sodiumAgeGroup: "olderChild", sodium: 154, sodiumTarget: 140 });
    expect(result.distributionFactor).toBe(0.6);
    expect(result.sodiumExcessMEq).toBe(84);
  });

  it("segnala disidratazione severa come scenario critico", () => {
    const result = calculateMaintenanceFluids({ ...baseInputs, hydrationStatus: "severeDehydration" });
    expect(result.alerts.some((alert) => alert.level === "critical" && alert.message.includes("Disidratazione severa"))).toBe(true);
  });
});
