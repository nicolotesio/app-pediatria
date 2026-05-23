import { cdcGrowthData, type CdcLmsRow } from "@/data/cdc2000";

export type CdcSex = "male" | "female";
export type CdcParameter = "weight" | "height" | "bmi";
export type CdcBmiClassification = "Normopeso" | "Sovrappeso" | "Obesità";

export type CdcMetricResult = {
  value: number;
  percentile: number;
  zScore: number;
  lms: {
    L: number;
    M: number;
    S: number;
  };
};

export type CdcBmiResult = CdcMetricResult & {
  classification: CdcBmiClassification;
  overweightThreshold: number;
  obesityThreshold: number;
};

export type CdcGrowthResult = {
  sex: CdcSex;
  ageYears: number;
  weight: CdcMetricResult | null;
  height: CdcMetricResult | null;
  bmi: CdcBmiResult | null;
};

export const cdcGrowthMetadata = {
  source: "Centers for Disease Control and Prevention. 2000 CDC Growth Charts for the United States: Methods and Development. Vital Health Stat 11. 2002;(246):1-190.",
  updatedAt: "2026-05-23"
};

const MIN_AGE_YEARS = 2;
const MAX_AGE_YEARS = 20;

const dataByParameter: Record<CdcParameter, Record<CdcSex, readonly CdcLmsRow[]>> = {
  weight: {
    male: cdcGrowthData.weight_male,
    female: cdcGrowthData.weight_female
  },
  height: {
    male: cdcGrowthData.height_male,
    female: cdcGrowthData.height_female
  },
  bmi: {
    male: cdcGrowthData.bmi_male,
    female: cdcGrowthData.bmi_female
  }
};

export function calculateCdcMetric(parameter: CdcParameter, sex: CdcSex, ageYears: number, value: number): CdcMetricResult {
  validateMetricInputs(parameter, sex, ageYears, value);
  return calculateMetric(parameter, sex, ageYears, value);
}

export function calculateCdcBmi(sex: CdcSex, ageYears: number, weightKg: number, heightCm: number): CdcBmiResult {
  validateInputs(sex, ageYears, weightKg, heightCm);
  const bmiValue = calculateBmi(weightKg, heightCm);
  const bmiBase = calculateMetric("bmi", sex, ageYears, bmiValue);
  const bmiReference = interpolateRow(dataByParameter.bmi[sex], ageYears);

  return {
    ...bmiBase,
    classification: classifyBmi(bmiValue, bmiReference.p85 as number, bmiReference.p95),
    overweightThreshold: bmiReference.p85 as number,
    obesityThreshold: bmiReference.p95
  };
}

export function calculateCdcGrowth(sex: CdcSex, ageYears: number, weightKg: number, heightCm: number): Required<CdcGrowthResult> {
  validateInputs(sex, ageYears, weightKg, heightCm);

  return {
    sex,
    ageYears,
    weight: calculateMetric("weight", sex, ageYears, weightKg),
    height: calculateMetric("height", sex, ageYears, heightCm),
    bmi: calculateCdcBmi(sex, ageYears, weightKg, heightCm)
  };
}

export function calculateAgeDecimalFromDates(birthDate: string, measurementDate: string) {
  const birth = parseDateOnly(birthDate);
  const measurement = parseDateOnly(measurementDate);

  if (!birth || !measurement) {
    throw new Error("Inserire data di nascita e data della misurazione valide");
  }

  if (measurement.getTime() < birth.getTime()) {
    throw new Error("La data della misurazione non può precedere la data di nascita");
  }

  return (measurement.getTime() - birth.getTime()) / (365.2425 * 24 * 60 * 60 * 1000);
}

export function formatCompletedAgeFromDates(birthDate: string, measurementDate: string) {
  const birth = parseDateOnly(birthDate);
  const measurement = parseDateOnly(measurementDate);

  if (!birth || !measurement) {
    throw new Error("Inserire data di nascita e data della misurazione valide");
  }

  if (measurement.getTime() < birth.getTime()) {
    throw new Error("La data della misurazione non può precedere la data di nascita");
  }

  return formatMonthsAsAge(calculateCompletedMonths(birth, measurement));
}

export function calculateBmi(weightKg: number, heightCm: number) {
  return weightKg / (heightCm / 100) ** 2;
}

export function formatCdcAge(ageYears: number) {
  return formatMonthsAsAge(Math.round(ageYears * 12));
}

export function normalizeAgeToMonths(ageYears: number) {
  return Math.round(ageYears * 12) / 12;
}

export function getCdcRows(parameter: CdcParameter, sex: CdcSex) {
  return dataByParameter[parameter][sex];
}

function calculateMetric(parameter: CdcParameter, sex: CdcSex, ageYears: number, value: number): CdcMetricResult {
  const row = interpolateRow(dataByParameter[parameter][sex], ageYears);
  const zScore = calculateLmsZScore(value, row.L, row.M, row.S);

  return {
    value,
    zScore,
    percentile: normalCdf(zScore) * 100,
    lms: {
      L: row.L,
      M: row.M,
      S: row.S
    }
  };
}

function interpolateRow(rows: readonly CdcLmsRow[], ageYears: number): CdcLmsRow {
  const ageMonths = ageYears * 12;
  const lower = [...rows].reverse().find((row) => row.ageMonths <= ageMonths);
  const upper = rows.find((row) => row.ageMonths >= ageMonths);

  if (!lower || !upper) {
    throw new Error("Età fuori range per il dataset CDC");
  }

  if (lower.ageMonths === upper.ageMonths) {
    return lower;
  }

  const ratio = (ageMonths - lower.ageMonths) / (upper.ageMonths - lower.ageMonths);
  return {
    ageMonths,
    L: interpolate(lower.L, upper.L, ratio),
    M: interpolate(lower.M, upper.M, ratio),
    S: interpolate(lower.S, upper.S, ratio),
    p3: interpolate(lower.p3, upper.p3, ratio),
    p5: interpolate(lower.p5, upper.p5, ratio),
    p10: interpolate(lower.p10, upper.p10, ratio),
    p25: interpolate(lower.p25, upper.p25, ratio),
    p50: interpolate(lower.p50, upper.p50, ratio),
    p75: interpolate(lower.p75, upper.p75, ratio),
    p85: interpolateOptional(lower.p85, upper.p85, ratio),
    p90: interpolate(lower.p90, upper.p90, ratio),
    p95: interpolate(lower.p95, upper.p95, ratio),
    p97: interpolate(lower.p97, upper.p97, ratio)
  };
}

function calculateLmsZScore(value: number, l: number, m: number, s: number) {
  if (Math.abs(l) < 1e-9) {
    return Math.log(value / m) / s;
  }

  return ((value / m) ** l - 1) / (l * s);
}

function classifyBmi(bmi: number, overweightThreshold: number, obesityThreshold: number): CdcBmiClassification {
  if (bmi >= obesityThreshold) return "Obesità";
  if (bmi >= overweightThreshold) return "Sovrappeso";
  return "Normopeso";
}

function validateInputs(sex: CdcSex, ageYears: number, weightKg: number, heightCm: number) {
  validateMetricInputs("weight", sex, ageYears, weightKg);
  validateMetricInputs("height", sex, ageYears, heightCm);
}

function validateMetricInputs(parameter: CdcParameter, sex: CdcSex, ageYears: number, value: number) {
  if (sex !== "male" && sex !== "female") throw new Error("Selezionare il sesso");
  if (!Number.isFinite(ageYears) || ageYears < MIN_AGE_YEARS || ageYears > MAX_AGE_YEARS) {
    throw new Error("Età consentita solo tra 2 anni e 20 anni");
  }
  if (!Number.isFinite(value) || value <= 0) {
    const label = parameter === "height" ? "statura" : parameter === "weight" ? "peso" : "BMI";
    throw new Error(`Inserire un valore valido per ${label}`);
  }
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

function calculateCompletedMonths(birth: Date, measurement: Date) {
  let months = (measurement.getUTCFullYear() - birth.getUTCFullYear()) * 12 + measurement.getUTCMonth() - birth.getUTCMonth();
  if (measurement.getUTCDate() < birth.getUTCDate()) months -= 1;
  return Math.max(months, 0);
}

function formatMonthsAsAge(totalMonths: number) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return `${years} ${years === 1 ? "anno" : "anni"}${months > 0 ? ` ${months} ${months === 1 ? "mese" : "mesi"}` : ""}`;
}

function interpolate(lower: number, upper: number, ratio: number) {
  return lower + (upper - lower) * ratio;
}

function interpolateOptional(lower: number | undefined, upper: number | undefined, ratio: number) {
  if (lower === undefined || upper === undefined) return undefined;
  return interpolate(lower, upper, ratio);
}

function normalCdf(z: number) {
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
