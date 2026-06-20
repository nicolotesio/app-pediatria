import { inesLmsData, type InesLmsDatum } from "@/data/inesLms";

export type InesSex = "male" | "female";
export type InesParameter = "weight" | "length" | "headCircumference";
export type InesClassification =
  | "sotto il 3° percentile"
  | "basso range"
  | "nella norma"
  | "alto range"
  | "sopra il 97° percentile";

export type InesRow = InesLmsDatum & {
  values: Record<ZScoreColumn, number>;
};

export type ZScoreColumn = "-3DS" | "-2DS" | "-1DS" | "M" | "+1DS" | "+2DS" | "+3DS";

export type ZScorePoint = {
  z: number;
  value: number;
};

export type InesMetricResult = {
  parameter: InesParameter;
  label: string;
  value: number;
  unit: string;
  zScore: number;
  zScoreLabel: string;
  percentile: number;
  percentileLabel: string;
  interpretation: InesClassification;
  zScoreTable: ZScorePoint[];
};

export type InesAllResults = {
  sex: InesSex;
  firstborn: boolean;
  weeks: number;
  days: number;
  lmsWeek: number;
  gestationalAgeKey: string;
  calculatedAt: string;
  results: InesMetricResult[];
};

type MetricInput = {
  weight?: number | null;
  length?: number | null;
  headCircumference?: number | null;
};

const zScoreColumns: Array<[ZScoreColumn, number]> = [
  ["-3DS", -3],
  ["-2DS", -2],
  ["-1DS", -1],
  ["M", 0],
  ["+1DS", 1],
  ["+2DS", 2],
  ["+3DS", 3]
];

const labels: Record<InesParameter, string> = {
  weight: "Peso",
  length: "Lunghezza",
  headCircumference: "Circonferenza cranica"
};

const units: Record<InesParameter, string> = {
  weight: "g",
  length: "cm",
  headCircumference: "cm"
};

export const inesMetadata = {
  updatedAt: "2026-06-20"
};

export const inesRows: InesRow[] = inesLmsData.map((row) => ({
  ...row,
  values: Object.fromEntries(zScoreColumns.map(([column, z]) => [column, valueAtZScore(row, z)])) as Record<ZScoreColumn, number>
}));

const indexedRows = new Map(inesRows.map((row) => [rowKey(row.parameter, row.sex, row.firstborn, row.week), row]));

export function getGestationalAgeKey(weeks: number, days: number) {
  return `${weeks}+${days}`;
}

export function getLmsWeek(weeks: number, days: number) {
  return weeks + (days >= 4 ? 1 : 0);
}

export function calculateZScore(value: number, lms: Pick<InesLmsDatum, "l" | "m" | "s">) {
  if (lms.l === 0) return Math.log(value / lms.m) / lms.s;
  return (Math.pow(value / lms.m, lms.l) - 1) / (lms.l * lms.s);
}

export function valueAtZScore(lms: Pick<InesLmsDatum, "l" | "m" | "s">, zScore: number) {
  if (lms.l === 0) return lms.m * Math.exp(lms.s * zScore);
  const base = 1 + zScore * lms.l * lms.s;
  return base > 0 ? lms.m * Math.pow(base, 1 / lms.l) : Number.NaN;
}

export function normalCDF(z: number) {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

export function zScoreToPercentile(z: number) {
  return normalCDF(z) * 100;
}

export function classifyPercentile(percentile: number): InesClassification {
  if (percentile < 3) return "sotto il 3° percentile";
  if (percentile < 10) return "basso range";
  if (percentile <= 90) return "nella norma";
  if (percentile <= 97) return "alto range";
  return "sopra il 97° percentile";
}

export function calculateAllResults(
  sex: InesSex,
  firstborn: boolean,
  weeks: number,
  days: number,
  input: MetricInput
): InesAllResults {
  validateCalculationInputs(sex, firstborn, weeks, days, input);
  const lmsWeek = getLmsWeek(weeks, days);

  const metricEntries: Array<[InesParameter, number | null | undefined]> = [
    ["weight", input.weight],
    ["length", input.length],
    ["headCircumference", input.headCircumference]
  ];

  return {
    sex,
    firstborn,
    weeks,
    days,
    lmsWeek,
    gestationalAgeKey: getGestationalAgeKey(weeks, days),
    calculatedAt: new Date().toISOString(),
    results: metricEntries
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([parameter, value]) => calculateMetric(parameter, sex, firstborn, lmsWeek, value as number))
  };
}

export function getRowsForParameter(parameter: InesParameter, sex: InesSex, firstborn: boolean) {
  return inesRows.filter((row) => row.parameter === parameter && row.sex === sex && row.firstborn === firstborn);
}

function calculateMetric(parameter: InesParameter, sex: InesSex, firstborn: boolean, week: number, value: number): InesMetricResult {
  const row = indexedRows.get(rowKey(parameter, sex, firstborn, week));
  if (!row) throw new Error(`Dati INeS non disponibili per ${week} settimane e ${labels[parameter].toLowerCase()}`);

  const zScore = calculateZScore(value, row);
  const percentile = zScoreToPercentile(zScore);

  return {
    parameter,
    label: labels[parameter],
    value,
    unit: units[parameter],
    zScore,
    zScoreLabel: formatSigned(zScore),
    percentile,
    percentileLabel: formatPercentileLabel(percentile),
    interpretation: classifyPercentile(percentile),
    zScoreTable: zScoreColumns.map(([, z]) => ({ z, value: valueAtZScore(row, z) }))
  };
}

function validateCalculationInputs(sex: InesSex, firstborn: boolean, weeks: number, days: number, input: MetricInput) {
  if (sex !== "male" && sex !== "female") throw new Error("Selezionare il sesso");
  if (typeof firstborn !== "boolean") throw new Error("Indicare se il neonato è primogenito");
  if (!Number.isInteger(weeks) || weeks < 23 || weeks > 42) {
    throw new Error("Selezionare le settimane di età gestazionale tra 23 e 42");
  }
  if (!Number.isInteger(days) || days < 0 || days > 6 || (weeks === 42 && days > 3)) {
    throw new Error("L'età gestazionale deve essere compresa tra 23+0 e 42+3");
  }

  const values = [input.weight, input.length, input.headCircumference].filter((value) => value !== null && value !== undefined);
  if (values.length === 0) throw new Error("Inserire almeno uno tra peso, lunghezza e circonferenza cranica");
  if (input.weight !== null && input.weight !== undefined && (!Number.isFinite(input.weight) || input.weight <= 0)) {
    throw new Error("Inserire un peso valido in grammi");
  }
  if (input.length !== null && input.length !== undefined && (!Number.isFinite(input.length) || input.length <= 0)) {
    throw new Error("Inserire una lunghezza valida in cm");
  }
  if (input.headCircumference !== null && input.headCircumference !== undefined && (!Number.isFinite(input.headCircumference) || input.headCircumference <= 0)) {
    throw new Error("Inserire una circonferenza cranica valida in cm");
  }
}

function rowKey(parameter: InesParameter, sex: InesSex, firstborn: boolean, week: number) {
  return `${parameter}:${sex}:${firstborn ? "firstborn" : "not-firstborn"}:${week}`;
}

function erf(value: number) {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return sign * y;
}

function formatSigned(value: number) {
  const rounded = formatNumber(value, 2);
  return value > 0 ? `+${rounded}` : rounded;
}

function formatPercentileLabel(percentile: number) {
  if (percentile < 1) return "< 1°";
  if (percentile > 99) return "> 99°";
  return `${formatNumber(percentile, 0)}°`;
}

function formatNumber(value: number, digits: number) {
  return value.toLocaleString("it-IT", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
