export type WhoSex = "male" | "female";
export type WhoDataset = "wfa" | "lhfa" | "hcfa" | "wfl" | "bfa";
export type WhoMetricKey = "weight" | "lengthHeight" | "headCircumference" | "weightForLength" | "bmi";
export type WhoRawRow = { x: number; L: number; M: number; S: number; sd: [number, number, number, number, number, number, number] };
export type WhoGrowthData = Record<string, readonly WhoRawRow[]>;

export type WhoMetricResult = {
  key: WhoMetricKey;
  label: string;
  value: number;
  unit: string;
  dataset: WhoDataset;
  datasetLabel: string;
  zScore: number;
  percentile: number;
  reference: WhoReferenceRow;
};

export type WhoReferenceRow = {
  x: number;
  L: number;
  M: number;
  S: number;
  sd: [number, number, number, number, number, number, number];
};

export type WhoGrowthResult = {
  sex: WhoSex;
  ageDays: number;
  ageYears: number;
  ageMonths: number;
  mode: "under2" | "over2";
  weightKg: number;
  statureCm: number;
  headCircumferenceCm: number;
  bmi: number | null;
  results: WhoMetricResult[];
};

export const whoGrowthMetadata = {
  updatedAt: "2026-05-23",
  source: "WHO Child Growth Standards (2006), dati disponibili sul sito www.who.int/tools/child-growth-standards"
};

const MAX_AGE_DAYS = 1856;
const TWO_YEARS_DAYS = 730;

const datasetLabels: Record<WhoDataset, string> = {
  wfa: "Weight-for-age",
  lhfa: "Length/height-for-age",
  hcfa: "Head circumference-for-age",
  wfl: "Peso per lunghezza",
  bfa: "BMI"
};

export function calculateWhoGrowth(data: WhoGrowthData, sex: WhoSex, ageDays: number, weightKg: number, statureCm: number, headCircumferenceCm: number): WhoGrowthResult {
  validateInputs(sex, ageDays, weightKg, statureCm, headCircumferenceCm);

  const mode = ageDays <= TWO_YEARS_DAYS ? "under2" : "over2";
  const bmi = mode === "over2" ? calculateBmi(weightKg, statureCm) : null;
  const results: WhoMetricResult[] = [
    calculateWhoMetric(data, "weight", "Peso", weightKg, "kg", "wfa", sex, ageDays),
    calculateWhoMetric(data, "lengthHeight", mode === "under2" ? "Lunghezza" : "Statura", statureCm, "cm", "lhfa", sex, ageDays),
    calculateWhoMetric(data, "headCircumference", "Circonferenza cranica", headCircumferenceCm, "cm", "hcfa", sex, ageDays)
  ];

  // La scelta tra wfl e bfa segue le istruzioni WHO: weight-for-length fino a 730 giorni,
  // BMI-for-age oltre 730 giorni.
  if (mode === "under2") {
    results.push(calculateWhoMetric(data, "weightForLength", "Peso per lunghezza", weightKg, "kg", "wfl", sex, statureCm));
  } else {
    results.push(calculateWhoMetric(data, "bmi", "BMI", bmi as number, "kg/m²", "bfa", sex, ageDays));
  }

  return {
    sex,
    ageDays,
    ageYears: ageDays / 365.25,
    ageMonths: ageDays / 30.4375,
    mode,
    weightKg,
    statureCm,
    headCircumferenceCm,
    bmi,
    results
  };
}

export function calculateAgeDaysFromDates(birthDate: string, measurementDate: string) {
  const birth = parseDateOnly(birthDate);
  const measurement = parseDateOnly(measurementDate);

  if (!birth || !measurement) {
    throw new Error("Inserire data di nascita e data della misurazione valide");
  }

  if (measurement.getTime() < birth.getTime()) {
    throw new Error("La data della misurazione non può precedere la data di nascita");
  }

  return Math.floor((measurement.getTime() - birth.getTime()) / (24 * 60 * 60 * 1000));
}

export function calculateCorrectedAgeDays(chronologicalAgeDays: number, gestationalWeeks: number, gestationalDays: number) {
  if (!Number.isInteger(chronologicalAgeDays) || chronologicalAgeDays < 0) {
    throw new Error("Età cronologica non valida");
  }

  if (!Number.isInteger(gestationalWeeks) || gestationalWeeks < 22 || gestationalWeeks > 36) {
    throw new Error("Inserire settimane gestazionali tra 22 e 36");
  }

  if (!Number.isInteger(gestationalDays) || gestationalDays < 0 || gestationalDays > 6) {
    throw new Error("Inserire giorni gestazionali tra 0 e 6");
  }

  const gestationalAgeDays = gestationalWeeks * 7 + gestationalDays;
  const correctedAgeDays = chronologicalAgeDays - (40 * 7 - gestationalAgeDays);

  if (correctedAgeDays < 0) {
    throw new Error("L'età corretta non può essere negativa");
  }

  return correctedAgeDays;
}

export function formatWhoAge(ageDays: number) {
  const months = ageDays / 30.4375;
  const years = ageDays / 365.25;
  return `${ageDays} giorni · ${formatNumber(months, 1)} mesi · ${formatNumber(years, 2)} anni`;
}

export function getWhoRows(data: WhoGrowthData, dataset: WhoDataset, sex: WhoSex) {
  const rows = data[`${dataset}_${sex}`];
  if (!rows) throw new Error("Dataset WHO non disponibile");
  return rows;
}

function calculateWhoMetric(
  data: WhoGrowthData,
  key: WhoMetricKey,
  label: string,
  value: number,
  unit: string,
  dataset: WhoDataset,
  sex: WhoSex,
  xValue: number
): WhoMetricResult {
  const rows = getWhoRows(data, dataset, sex);
  const reference = interpolateReference(rows, xValue);
  const zScore = calculateLmsZScore(value, reference.L, reference.M, reference.S);

  return {
    key,
    label,
    value,
    unit,
    dataset,
    datasetLabel: datasetLabels[dataset],
    zScore,
    percentile: normalCDF(zScore) * 100,
    reference
  };
}

// Interpola i parametri LMS e le curve SD quando età o lunghezza cadono tra due righe.
function interpolateReference(rows: readonly WhoRawRow[], xValue: number): WhoReferenceRow {
  const lower = [...rows].reverse().find((row) => row.x <= xValue);
  const upper = rows.find((row) => row.x >= xValue);

  if (!lower || !upper) {
    throw new Error("Valore fuori range per il dataset WHO selezionato");
  }

  if (lower.x === upper.x) {
    return {
      x: lower.x,
      L: lower.L,
      M: lower.M,
      S: lower.S,
      sd: [...lower.sd] as WhoReferenceRow["sd"]
    };
  }

  const ratio = (xValue - lower.x) / (upper.x - lower.x);
  return {
    x: xValue,
    L: interpolate(lower.L, upper.L, ratio),
    M: interpolate(lower.M, upper.M, ratio),
    S: interpolate(lower.S, upper.S, ratio),
    sd: lower.sd.map((value, index) => interpolate(value, upper.sd[index], ratio)) as WhoReferenceRow["sd"]
  };
}

// Formula LMS WHO per il calcolo dello Z-score.
function calculateLmsZScore(value: number, l: number, m: number, s: number) {
  if (Math.abs(l) < 1e-9) {
    return Math.log(value / m) / s;
  }

  return ((value / m) ** l - 1) / (l * s);
}

function calculateBmi(weightKg: number, heightCm: number) {
  return weightKg / (heightCm / 100) ** 2;
}

function validateInputs(sex: WhoSex, ageDays: number, weightKg: number, statureCm: number, headCircumferenceCm: number) {
  if (sex !== "male" && sex !== "female") throw new Error("Selezionare il sesso");
  if (!Number.isInteger(ageDays) || ageDays < 0 || ageDays > MAX_AGE_DAYS) throw new Error("Età consentita solo tra 0 e 5 anni");
  if (!Number.isFinite(weightKg) || weightKg <= 0) throw new Error("Inserire un peso valido in kg");
  if (!Number.isFinite(statureCm) || statureCm <= 0) throw new Error("Inserire una lunghezza/statura valida in cm");
  if (!Number.isFinite(headCircumferenceCm) || headCircumferenceCm <= 0) throw new Error("Inserire una circonferenza cranica valida in cm");
}

function parseDateOnly(value: string) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(date.getTime())) return null;
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date;
}

function normalCDF(z: number) {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

function erf(value: number) {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

function interpolate(start: number, end: number, ratio: number) {
  return start + (end - start) * ratio;
}

function formatNumber(value: number, digits: number) {
  return value.toLocaleString("it-IT", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}
