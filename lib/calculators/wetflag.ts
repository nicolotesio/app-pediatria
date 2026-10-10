import { getClinicalSource } from "@/lib/sources/clinicalSources";
import { formatFixed } from "@/lib/format";

export type WetflagResult = {
  ageYears: number;
  estimatedWeightKg: number;
  defibrillationEnergyJ: number;
  endotrachealTubeMm: {
    /** Diametro interno consigliato, già formattato (singolo valore o intervallo). */
    cuffed: string;
    uncuffed: string;
    /** null sotto 1 anno: la formula età/2 + 12 non è valida nel lattante. */
    oralDepthCm: number | null;
    /** true quando i diametri derivano dalla tabella per età e non dalla formula. */
    fromAgeTable: boolean;
    note: string | null;
  };
  fluidBolusMl: number;
  fluidBolusOptionsMl: {
    tenPerKg: number;
    twentyPerKg: number;
  };
  lorazepam: {
    mg: number;
  };
  adrenaline: {
    micrograms: number;
    mlOfOneInTenThousand: number;
  };
  glucose: {
    grams: number;
    d10Ml: number;
  };
  warnings: string[];
  safetyNotes: string[];
};

const wetflagSource = getClinicalSource("wetflag");

export const wetflagMetadata = {
  source: wetflagSource.reference,
  updatedAt: wetflagSource.updatedAt,
  validity: "Età 1 mese-12 anni, stime iniziali in emergenza. Usare peso reale appena disponibile.",
  units: "anni, kg, J, mm ID, ml, microgrammi, grammi"
};

const MIN_AGE = 1 / 12;
const MAX_AGE = 12;
const MAX_DEFIBRILLATION_ENERGY_J = 200;
const MAX_FLUID_BOLUS_ML = 500;
const MAX_LORAZEPAM_MG = 4;
const MAX_ADRENALINE_MICROGRAMS = 1000;
const MAX_GLUCOSE_D10_ML = 50;

export function calculateWetflag(ageYears: number, weightKg = estimateWeightForAge(ageYears)): WetflagResult {
  if (!Number.isFinite(ageYears)) {
    throw new Error("Età non valida");
  }

  if (ageYears < 0) {
    throw new Error("L'età non può essere negativa");
  }

  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error("Peso non valido");
  }

  const warnings: string[] = [];
  const ageMonths = Math.round(ageYears * 12);
  if (ageMonths < Math.round(MIN_AGE * 12) || ageMonths > Math.round(MAX_AGE * 12)) {
    warnings.push("Età fuori range validato (1 mese-12 anni): risultati da verificare con particolare cautela.");
  }

  const estimatedWeightKg = round1(weightKg);
  const defibrillationEnergyJ = cap(round1(4 * estimatedWeightKg), MAX_DEFIBRILLATION_ENERGY_J);
  const tube = getTrachealTube(ageYears);
  const fluidBolusTenMl = cap(Math.round(10 * estimatedWeightKg), MAX_FLUID_BOLUS_ML);
  const fluidBolusTwentyMl = cap(Math.round(20 * estimatedWeightKg), MAX_FLUID_BOLUS_ML);
  const lorazepamMg = round2(cap(0.1 * estimatedWeightKg, MAX_LORAZEPAM_MG));
  const adrenalineMicrograms = cap(round1(10 * estimatedWeightKg), MAX_ADRENALINE_MICROGRAMS);
  const adrenalineMl = round2(adrenalineMicrograms / 100);
  const glucoseD10Ml = cap(round1(2 * estimatedWeightKg), MAX_GLUCOSE_D10_ML);
  const glucoseGrams = round2(glucoseD10Ml * 0.1);

  return {
    ageYears,
    estimatedWeightKg,
    defibrillationEnergyJ,
    endotrachealTubeMm: tube,
    fluidBolusMl: fluidBolusTwentyMl,
    fluidBolusOptionsMl: {
      tenPerKg: fluidBolusTenMl,
      twentyPerKg: fluidBolusTwentyMl
    },
    lorazepam: {
      mg: lorazepamMg
    },
    adrenaline: {
      micrograms: adrenalineMicrograms,
      mlOfOneInTenThousand: adrenalineMl
    },
    glucose: {
      grams: glucoseGrams,
      d10Ml: glucoseD10Ml
    },
    warnings,
    safetyNotes: [
      "Usare peso reale, nastro di Broselow o stima locale appena disponibili.",
      "Confermare concentrazioni dei farmaci prima della somministrazione.",
      "Defibrillazione, tubo e fluidi richiedono rivalutazione clinica continua."
    ]
  };
}

/**
 * Diametro interno del tubo tracheale (ERC 2021, Paediatric Life Support):
 * lattante 3,5-4,0 non cuffiato / 3,0-3,5 cuffiato; 1-2 anni 4,0-4,5 / 3,5-4,0;
 * oltre 2 anni età/4 + 4 (non cuffiato) ed età/4 + 3,5 (cuffiato), arrotondati al mezzo millimetro.
 */
export function getTrachealTube(ageYears: number): WetflagResult["endotrachealTubeMm"] {
  if (ageYears < 1) {
    return {
      uncuffed: "3,5-4,0",
      cuffed: "3,0-3,5",
      oralDepthCm: null,
      fromAgeTable: true,
      note: "Sotto 1 anno le formule per età non sono valide: diametri da tabella per il lattante, profondità da verificare clinicamente (auscultazione, capnografia, RX)."
    };
  }

  const oralDepthCm = round1(ageYears / 2 + 12);
  if (ageYears < 2) {
    return { uncuffed: "4,0-4,5", cuffed: "3,5-4,0", oralDepthCm, fromAgeTable: true, note: null };
  }

  return {
    uncuffed: formatFixed(roundHalf(ageYears / 4 + 4)),
    cuffed: formatFixed(roundHalf(ageYears / 4 + 3.5)),
    oralDepthCm,
    fromAgeTable: false,
    note: null
  };
}

export function estimateWeightForAge(ageYears: number) {
  if (ageYears < 1) return round1(0.5 * Math.round(ageYears * 12) + 4);
  if (ageYears < 6) return Math.round(2 * ageYears + 8);
  return Math.round(3 * ageYears + 7);
}

function roundHalf(value: number) {
  return Math.round(value * 2) / 2;
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function cap(value: number, max: number) {
  return Math.min(value, max);
}
