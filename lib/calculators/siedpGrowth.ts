import {
  bmiFemale,
  bmiMale,
  heightFemale,
  heightMale,
  type SiedpLmsRow,
  weightFemale,
  weightMale
} from "@/data/siedp2006";

export type SiedpSex = "male" | "female";
export type SiedpParameter = "weight" | "height" | "bmi";
export type BmiClassification = "Normopeso" | "Sovrappeso" | "Obesità";

export type SiedpMetricResult = {
  value: number;
  percentile: number;
  zScore: number;
  lms: {
    L: number;
    M: number;
    S: number;
  };
};

export type SiedpGrowthResult = {
  sex: SiedpSex;
  ageYears: number;
  weight: SiedpMetricResult;
  height: SiedpMetricResult;
  bmi: SiedpMetricResult & {
    classification: BmiClassification;
    ow: number;
    ob: number;
  };
};

export type SiedpBmiResult = SiedpMetricResult & {
  classification: BmiClassification;
  ow: number;
  ob: number;
};

export const siedpGrowthMetadata = {
  source: "Cacciari E, Milani S, Balsamo A, et al. Italian cross-sectional growth charts for height, weight and BMI (2 to 20 yr). J Endocrinol Invest. 2006;29(7):581-593. doi:10.1007/BF03344156",
  updatedAt: "2026-05-14",
  validity: "Età 2-20 anni. Popolazione italiana; usare come supporto alla valutazione auxologica, non come diagnosi isolata.",
  units: "anni, kg, cm, kg/m2, SDS, centili"
};

const MIN_AGE_YEARS = 2;
const MAX_AGE_YEARS = 20;

const dataByParameter: Record<SiedpParameter, Record<SiedpSex, SiedpLmsRow[]>> = {
  weight: {
    male: weightMale,
    female: weightFemale
  },
  height: {
    male: heightMale,
    female: heightFemale
  },
  bmi: {
    male: bmiMale,
    female: bmiFemale
  }
};

export function calculateSiedpGrowth(sex: SiedpSex, ageYears: number, weightKg: number, heightCm: number): SiedpGrowthResult {
  validateInputs(sex, ageYears, weightKg, heightCm);

  const bmiValue = calculateBmi(weightKg, heightCm);
  const weight = calculateMetric("weight", sex, ageYears, weightKg);
  const height = calculateMetric("height", sex, ageYears, heightCm);
  const bmiBase = calculateMetric("bmi", sex, ageYears, bmiValue);
  const bmiReference = interpolateRow(dataByParameter.bmi[sex], ageYears);

  if (!Number.isFinite(bmiReference.ow) || !Number.isFinite(bmiReference.ob)) {
    throw new Error("Soglie BMI OW/OB non disponibili per età e sesso selezionati");
  }

  return {
    sex,
    ageYears,
    weight,
    height,
    bmi: {
      ...bmiBase,
      classification: classifyBmi(bmiValue, bmiReference.ow as number, bmiReference.ob as number),
      ow: bmiReference.ow as number,
      ob: bmiReference.ob as number
    }
  };
}

export function calculateSiedpMetric(parameter: SiedpParameter, sex: SiedpSex, ageYears: number, value: number): SiedpMetricResult {
  validateMetricInputs(parameter, sex, ageYears, value);
  return calculateMetric(parameter, sex, ageYears, value);
}

export function calculateSiedpBmi(sex: SiedpSex, ageYears: number, weightKg: number, heightCm: number): SiedpBmiResult {
  validateInputs(sex, ageYears, weightKg, heightCm);
  const bmiValue = calculateBmi(weightKg, heightCm);
  const bmiBase = calculateMetric("bmi", sex, ageYears, bmiValue);
  const bmiReference = interpolateRow(dataByParameter.bmi[sex], ageYears);

  if (!Number.isFinite(bmiReference.ow) || !Number.isFinite(bmiReference.ob)) {
    throw new Error("Soglie BMI OW/OB non disponibili per età e sesso selezionati");
  }

  return {
    ...bmiBase,
    classification: classifyBmi(bmiValue, bmiReference.ow as number, bmiReference.ob as number),
    ow: bmiReference.ow as number,
    ob: bmiReference.ob as number
  };
}

export function calculateAgeDecimalFromDates(birthDate: string, measurementDate: string) {
  const birth = parseDateOnly(birthDate);
  const measurement = parseDateOnly(measurementDate);

  if (!birth || !measurement) {
    throw new Error("Inserire data di nascita e data della misurazione valide");
  }

  if (measurement.getTime() < birth.getTime()) {
    throw new Error("La data della misurazione non puo precedere la data di nascita");
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
    throw new Error("La data della misurazione non puo precedere la data di nascita");
  }

  return formatMonthsAsAge(calculateCompletedMonths(birth, measurement));
}

export function calculateBmi(weightKg: number, heightCm: number) {
  return weightKg / (heightCm / 100) ** 2;
}

export function formatSiedpAge(ageYears: number) {
  const totalMonths = Math.round(ageYears * 12);
  return formatMonthsAsAge(totalMonths);
}

function formatMonthsAsAge(totalMonths: number) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return `${years} ${years === 1 ? "anno" : "anni"}${months > 0 ? ` ${months} ${months === 1 ? "mese" : "mesi"}` : ""}`;
}

export function normalizeAgeToMonths(ageYears: number) {
  return Math.round(ageYears * 12) / 12;
}

function calculateMetric(parameter: SiedpParameter, sex: SiedpSex, ageYears: number, value: number): SiedpMetricResult {
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

function interpolateRow(rows: SiedpLmsRow[], ageYears: number): SiedpLmsRow {
  const lower = [...rows].reverse().find((row) => row.age <= ageYears);
  const upper = rows.find((row) => row.age >= ageYears);

  if (!lower || !upper) {
    throw new Error("Età fuori range per il dataset SIEDP 2006");
  }

  if (lower.age === upper.age) {
    return lower;
  }

  const ratio = (ageYears - lower.age) / (upper.age - lower.age);
  return {
    age: ageYears,
    L: interpolate(lower.L, upper.L, ratio),
    M: interpolate(lower.M, upper.M, ratio),
    S: interpolate(lower.S, upper.S, ratio),
    p3: interpolateOptional(lower.p3, upper.p3, ratio),
    p50: interpolateOptional(lower.p50, upper.p50, ratio),
    p97: interpolateOptional(lower.p97, upper.p97, ratio),
    sdMinus3: interpolateOptional(lower.sdMinus3, upper.sdMinus3, ratio),
    sdMinus2: interpolateOptional(lower.sdMinus2, upper.sdMinus2, ratio),
    ow: interpolateOptional(lower.ow, upper.ow, ratio),
    ob: interpolateOptional(lower.ob, upper.ob, ratio)
  };
}

function calculateLmsZScore(value: number, l: number, m: number, s: number) {
  if (Math.abs(l) < 1e-9) {
    return Math.log(value / m) / s;
  }

  return ((value / m) ** l - 1) / (l * s);
}

function classifyBmi(bmi: number, ow: number, ob: number): BmiClassification {
  if (bmi >= ob) return "Obesità";
  if (bmi >= ow) return "Sovrappeso";
  return "Normopeso";
}

function validateInputs(sex: SiedpSex, ageYears: number, weightKg: number, heightCm: number) {
  if (sex !== "male" && sex !== "female") {
    throw new Error("Selezionare il sesso");
  }

  if (!Number.isFinite(ageYears) || ageYears < MIN_AGE_YEARS || ageYears > MAX_AGE_YEARS) {
    throw new Error("Età consentita solo tra 2 anni e 20 anni.");
  }

  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error("Inserire un peso valido maggiore di 0 kg");
  }

  if (!Number.isFinite(heightCm) || heightCm <= 0) {
    throw new Error("Inserire una statura valida maggiore di 0 cm");
  }
}

function validateMetricInputs(parameter: SiedpParameter, sex: SiedpSex, ageYears: number, value: number) {
  if (sex !== "male" && sex !== "female") {
    throw new Error("Selezionare il sesso");
  }

  if (!Number.isFinite(ageYears) || ageYears < MIN_AGE_YEARS || ageYears > MAX_AGE_YEARS) {
    throw new Error("Età consentita solo tra 2 anni e 20 anni.");
  }

  if (!Number.isFinite(value) || value <= 0) {
    if (parameter === "weight") throw new Error("Inserire un peso valido maggiore di 0 kg");
    if (parameter === "height") throw new Error("Inserire una statura valida maggiore di 0 cm");
    throw new Error("Inserire un BMI valido");
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
  let months = (measurement.getUTCFullYear() - birth.getUTCFullYear()) * 12;
  months += measurement.getUTCMonth() - birth.getUTCMonth();

  if (measurement.getUTCDate() < birth.getUTCDate()) {
    months -= 1;
  }

  return Math.max(months, 0);
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

function interpolate(start: number, end: number, ratio: number) {
  return start + (end - start) * ratio;
}

function interpolateOptional(start: number | undefined, end: number | undefined, ratio: number) {
  if (start === undefined || end === undefined) return undefined;
  return interpolate(start, end, ratio);
}
