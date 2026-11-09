import { describe, expect, it } from "vitest";
import { calculateEmergencyDrugs } from "../lib/calculators/emergencyDrugs";

function findSection(id: string) {
  const result = calculateEmergencyDrugs(4, 10);
  const section = result.sections.find((item) => item.id === id);
  if (!section) throw new Error(`Section ${id} not found`);
  return section;
}

describe("calculateEmergencyDrugs", () => {
  it("calcola convulsioni e ipoglicemia per 10 kg", () => {
    const seizures = findSection("seizures");
    const hypoglycaemia = findSection("hypoglycaemia");

    expect(seizures.rows[0].value).toBe("1 mg");
    expect(hypoglycaemia.rows[0].value).toBe("20 ml");
  });

  it("calcola iperkaliemia non arresto per 10 kg", () => {
    const section = findSection("hyperkalaemia-non-arrest");

    expect(section.rows[0].value).toBe("1 UI");
    expect(section.rows[1].value).toBe("50 ml in 30 min");
    expect(section.rows[2].value).toBe("5 ml");
    expect(section.calculations[3]).toContain("50 µg");
  });

  it("mappa anafilassi per fascia 6 mesi-6 anni", () => {
    const section = findSection("anaphylaxis");

    expect(section.rows[0].value).toBe("0,15 ml (150 µg)");
  });

  it("calcola aritmie per 10 kg", () => {
    const section = findSection("arrhythmias");

    expect(section.rows[0].value).toBe("200 µg");
    expect(section.rows[1].value).toBe("1 - 2 mg");
  });

  it("calcola arresto cardiaco per 10 kg", () => {
    const section = findSection("cardiac-arrest");

    expect(section.rows[0].value).toBe("1 ml (100 µg)");
    expect(section.rows[1].value).toBe("50 mg");
    expect(section.rows[2].value).toBe("100 ml");
    expect(section.rows[3].value).toBe("40 J");
    expect(section.rows[4].value).toBe("80 J");
    expect(section.rows[7].value).toBe("10 mmol");
  });

  it("limita adenosina e calcio gluconato a 45 kg", () => {
    const result = calculateEmergencyDrugs(10, 45);
    const arrhythmias = result.sections.find((section) => section.id === "arrhythmias");
    const hyperkalaemia = result.sections.find((section) => section.id === "hyperkalaemia-non-arrest");

    expect(arrhythmias?.rows[1].value).toBe("4,5 - 6 mg");
    expect(hyperkalaemia?.rows[2].value).toBe("22,5 ml");
  });

  it("applica i massimali principali", () => {
    const result = calculateEmergencyDrugs(12, 70);
    const seizures = result.sections.find((section) => section.id === "seizures");
    const arrhythmias = result.sections.find((section) => section.id === "arrhythmias");
    const arrest = result.sections.find((section) => section.id === "cardiac-arrest");

    expect(seizures?.rows[0].value).toBe("4 mg");
    expect(arrhythmias?.rows[0].value).toBe("600 µg");
    const hyperkalaemia = result.sections.find((section) => section.id === "hyperkalaemia-non-arrest");
    const hypoglycaemia = result.sections.find((section) => section.id === "hypoglycaemia");

    expect(arrest?.rows[0].value).toBe("7 ml (700 µg)");
    expect(arrest?.rows[1].value).toBe("300 mg");
    expect(arrest?.rows[2].value).toBe("500 ml");
    expect(arrhythmias?.rows[1].value).toBe("6 mg");
    expect(hyperkalaemia?.rows[2].value).toBe("30 ml");
    expect(hypoglycaemia?.rows[0].value).toBe("50 ml");
    expect(arrest?.rows[3].value).toBe("200 J");
    expect(arrest?.rows[4].value).toBe("360 J");
  });

  it("limita insulina, glucosio e potassio secondo ERC 2025", () => {
    const result = calculateEmergencyDrugs(12, 120);
    const arrest = result.sections.find((section) => section.id === "cardiac-arrest");
    const hyperkalaemia = result.sections.find((section) => section.id === "hyperkalaemia-non-arrest");

    expect(arrest?.rows[5].value).toBe("10 UI");
    expect(arrest?.rows[6].value).toBe("250 ml");
    expect(arrest?.rows[7].value).toBe("30 mmol");
    expect(hyperkalaemia?.rows[0].value).toBe("10 UI");
    expect(hyperkalaemia?.rows[1].value).toBe("250 ml in 30 min");
  });

  it("mappa l'adrenalina IM dell'anafilassi su tutte le fasce di età", () => {
    const doseAt = (ageYears: number) =>
      calculateEmergencyDrugs(ageYears, 10).sections.find((section) => section.id === "anaphylaxis")?.rows[0].value;

    expect(doseAt(0.25)).toBe("0,1-0,15 ml (100-150 µg)");
    expect(doseAt(0.5)).toBe("0,15 ml (150 µg)");
    expect(doseAt(6)).toBe("0,3 ml (300 µg)");
    expect(doseAt(12)).toBe("0,3 ml (300 µg)");
    expect(doseAt(14)).toBe("0,5 ml (500 µg)");
  });
});
