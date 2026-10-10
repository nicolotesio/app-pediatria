import { describe, expect, it } from "vitest";
import { calculateHollidaySegarMaintenance } from "../lib/calculators/maintenanceFluids";

describe("calculateHollidaySegarMaintenance", () => {
  it("usa 100 mL/kg fino a 10 kg", () => {
    expect(calculateHollidaySegarMaintenance(5)).toEqual({ mlDay: 500, mlHour: 20.8 });
    expect(calculateHollidaySegarMaintenance(10)).toEqual({ mlDay: 1000, mlHour: 41.7 });
  });

  it("aggiunge 50 mL/kg tra 10 e 20 kg", () => {
    expect(calculateHollidaySegarMaintenance(12)).toEqual({ mlDay: 1100, mlHour: 45.8 });
    expect(calculateHollidaySegarMaintenance(20)).toEqual({ mlDay: 1500, mlHour: 62.5 });
  });

  it("aggiunge 20 mL/kg oltre i 20 kg", () => {
    expect(calculateHollidaySegarMaintenance(25)).toEqual({ mlDay: 1600, mlHour: 66.7 });
    expect(calculateHollidaySegarMaintenance(60)).toEqual({ mlDay: 2300, mlHour: 95.8 });
  });

  it("rifiuta pesi non validi", () => {
    expect(() => calculateHollidaySegarMaintenance(0)).toThrow("peso valido");
    expect(() => calculateHollidaySegarMaintenance(-3)).toThrow("peso valido");
    expect(() => calculateHollidaySegarMaintenance(Number.NaN)).toThrow("peso valido");
  });
});
