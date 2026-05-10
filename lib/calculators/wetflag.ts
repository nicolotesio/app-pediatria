import { clinicalSources } from "@/lib/sources/clinicalSources";

export type WetflagResult = {
  ageYears: number;
  estimatedWeightKg: number;
  defibrillationEnergyJ: number;
  endotrachealTubeMm: {
    cuffed: number;
    uncuffed: number;
    oralDepthCm: number;
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

export const wetflagMetadata = {
  source: clinicalSources[0].reference,
  updatedAt: clinicalSources[0].updatedAt,
  validity: "Eta 1-12 anni, stime iniziali in emergenza. Usare peso reale appena disponibile.",
  units: "anni, kg, J, mm ID, ml, microgrammi, grammi"
};

const MIN_AGE = 1;
const MAX_AGE = 12;
const MAX_DEFIBRILLATION_ENERGY_J = 200;
const MAX_FLUID_BOLUS_ML = 500;
const MAX_LORAZEPAM_MG = 4;

export function calculateWetflag(ageYears: number, weightKg = estimateWeightForAge(ageYears)): WetflagResult {
  if (!Number.isFinite(ageYears)) {
    throw new Error("Eta non valida");
  }

  if (ageYears < 0) {
    throw new Error("Eta non puo essere negativa");
  }

  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error("Peso non valido");
  }

  const warnings: string[] = [];
  if (ageYears < MIN_AGE || ageYears > MAX_AGE) {
    warnings.push(`Eta fuori range validato (${MIN_AGE}-${MAX_AGE} anni): risultati da verificare con particolare cautela.`);
  }

  const estimatedWeightKg = round1(weightKg);
  const defibrillationEnergyJ = cap(round1(4 * estimatedWeightKg), MAX_DEFIBRILLATION_ENERGY_J);
  const uncuffedTube = round1(ageYears / 4 + 4);
  const cuffedTube = round1(ageYears / 4 + 3.5);
  const oralTubeDepthCm = round1(ageYears / 2 + 12);
  const fluidBolusTenMl = cap(Math.round(10 * estimatedWeightKg), MAX_FLUID_BOLUS_ML);
  const fluidBolusTwentyMl = cap(Math.round(20 * estimatedWeightKg), MAX_FLUID_BOLUS_ML);
  const lorazepamMg = round2(cap(0.1 * estimatedWeightKg, MAX_LORAZEPAM_MG));
  const adrenalineMicrograms = round1(10 * estimatedWeightKg);
  const adrenalineMl = round2(0.1 * estimatedWeightKg);
  const glucoseD10Ml = round1(2 * estimatedWeightKg);
  const glucoseGrams = round2(glucoseD10Ml * 0.1);

  return {
    ageYears,
    estimatedWeightKg,
    defibrillationEnergyJ,
    endotrachealTubeMm: {
      cuffed: cuffedTube,
      uncuffed: uncuffedTube,
      oralDepthCm: oralTubeDepthCm
    },
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

export function estimateWeightForAge(ageYears: number) {
  if (ageYears < 1) return round1(0.5 * ageYears * 12 + 4);
  if (ageYears <= 5) return round1(2 * ageYears + 8);
  return round1(3 * ageYears + 7);
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
