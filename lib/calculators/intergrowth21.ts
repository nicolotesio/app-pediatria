import {
  headCircumferenceFemaleCsv,
  headCircumferenceMaleCsv,
  lengthFemaleCsv,
  lengthMaleCsv,
  weightFemaleCsv,
  weightMaleCsv
} from "@/data/intergrowth21Csv";

export type IntergrowthSex = "male" | "female";
export type IntergrowthParameter = "weight" | "length" | "headCircumference";
export type IntergrowthClassification =
  | "sotto il 3° percentile"
  | "basso range"
  | "nella norma"
  | "alto range"
  | "sopra il 97° percentile";

export type IntergrowthCsvRow = {
  sex: IntergrowthSex;
  parameter: IntergrowthParameter;
  weeks: number;
  days: number;
  gestationalAgeKey: string;
  values: Record<ZScoreColumn, number>;
};

export type ZScoreColumn = "-3DS" | "-2DS" | "-1DS" | "M" | "+1DS" | "+2DS" | "+3DS";

export type ZScorePoint = {
  z: number;
  value: number;
};

export type IntergrowthMetricResult = {
  parameter: IntergrowthParameter;
  label: string;
  value: number;
  unit: string;
  zScore: number | null;
  zScoreLabel: string;
  percentile: number | null;
  percentileLabel: string;
  interpretation: IntergrowthClassification | "fuori range tabellare";
  zScoreTable: ZScorePoint[];
};

export type IntergrowthAllResults = {
  sex: IntergrowthSex;
  weeks: number;
  days: number;
  gestationalAgeKey: string;
  calculatedAt: string;
  results: IntergrowthMetricResult[];
};

type MetricInput = {
  weight?: number | null;
  length?: number | null;
  headCircumference?: number | null;
};

const zScoreColumnMap: Record<ZScoreColumn, number> = {
  "-3DS": -3,
  "-2DS": -2,
  "-1DS": -1,
  M: 0,
  "+1DS": 1,
  "+2DS": 2,
  "+3DS": 3
};

const normalizedColumnMap: Record<string, ZScoreColumn> = {
  "3sdneg": "-3DS",
  "-3ds": "-3DS",
  "2sdneg": "-2DS",
  "-2ds": "-2DS",
  "1sdneg": "-1DS",
  "-1ds": "-1DS",
  "m": "M",
  "1sd": "+1DS",
  "+1ds": "+1DS",
  "2sd": "+2DS",
  "+2ds": "+2DS",
  "3sd": "+3DS",
  "+3ds": "+3DS"
};

const csvSources: Record<IntergrowthParameter, Record<IntergrowthSex, string>> = {
  weight: {
    male: weightMaleCsv,
    female: weightFemaleCsv
  },
  length: {
    male: lengthMaleCsv,
    female: lengthFemaleCsv
  },
  headCircumference: {
    male: headCircumferenceMaleCsv,
    female: headCircumferenceFemaleCsv
  }
};

const labels: Record<IntergrowthParameter, string> = {
  weight: "Peso",
  length: "Lunghezza",
  headCircumference: "Circonferenza cranica"
};

const units: Record<IntergrowthParameter, string> = {
  weight: "g",
  length: "cm",
  headCircumference: "cm"
};

export const intergrowth21Metadata = {
  updatedAt: "2026-05-21"
};

export const intergrowthRows = parseCsvRows();

const indexedRows = indexRows(intergrowthRows);

export function getGestationalAgeKey(weeks: number, days: number) {
  return `${weeks}+${days}`;
}

export function parseCsvRows() {
  const rows: IntergrowthCsvRow[] = [];

  (Object.keys(csvSources) as IntergrowthParameter[]).forEach((parameter) => {
    (Object.keys(csvSources[parameter]) as IntergrowthSex[]).forEach((sex) => {
      rows.push(...parseOneCsv(csvSources[parameter][sex], sex, parameter));
    });
  });

  return rows;
}

export function buildZScoreTable(row: IntergrowthCsvRow) {
  return (Object.keys(zScoreColumnMap) as ZScoreColumn[])
    .map((column) => ({
      z: zScoreColumnMap[column],
      value: row.values[column]
    }))
    .sort((a, b) => a.z - b.z);
}

export function interpolateZScore(value: number, zScoreTable: ZScorePoint[]) {
  const sortedTable = [...zScoreTable].sort((a, b) => a.value - b.value);
  const lowest = sortedTable[0];
  const highest = sortedTable[sortedTable.length - 1];

  if (value < lowest.value) return { status: "below" as const, zScore: null };
  if (value > highest.value) return { status: "above" as const, zScore: null };

  for (let index = 0; index < sortedTable.length - 1; index += 1) {
    const left = sortedTable[index];
    const right = sortedTable[index + 1];

    if (value === left.value) return { status: "ok" as const, zScore: left.z };
    if (value >= left.value && value <= right.value) {
      if (right.value === left.value) return { status: "ok" as const, zScore: left.z };
      const zScore = left.z + ((value - left.value) / (right.value - left.value)) * (right.z - left.z);
      return { status: "ok" as const, zScore };
    }
  }

  return { status: "ok" as const, zScore: highest.z };
}

export function normalCDF(z: number) {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

export function zScoreToPercentile(z: number) {
  return normalCDF(z) * 100;
}

export function classifyPercentile(percentile: number): IntergrowthClassification {
  if (percentile < 3) return "sotto il 3° percentile";
  if (percentile < 10) return "basso range";
  if (percentile <= 90) return "nella norma";
  if (percentile <= 97) return "alto range";
  return "sopra il 97° percentile";
}

export function calculateAllResults(sex: IntergrowthSex, weeks: number, days: number, input: MetricInput): IntergrowthAllResults {
  validateCalculationInputs(sex, weeks, days, input);

  const gestationalAgeKey = getGestationalAgeKey(weeks, days);
  const metricEntries: Array<[IntergrowthParameter, number | null | undefined]> = [
    ["weight", input.weight],
    ["length", input.length],
    ["headCircumference", input.headCircumference]
  ];

  return {
    sex,
    weeks,
    days,
    gestationalAgeKey,
    calculatedAt: new Date().toISOString(),
    results: metricEntries
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([parameter, value]) => calculateMetric(parameter, sex, gestationalAgeKey, value as number))
  };
}

export function getRowsForParameter(parameter: IntergrowthParameter, sex: IntergrowthSex) {
  return intergrowthRows.filter((row) => row.parameter === parameter && row.sex === sex);
}

function calculateMetric(parameter: IntergrowthParameter, sex: IntergrowthSex, gestationalAgeKey: string, value: number): IntergrowthMetricResult {
  const row = indexedRows[sex]?.[gestationalAgeKey]?.[parameter];
  if (!row) {
    throw new Error(`Dati INTERGROWTH-21 non disponibili per ${gestationalAgeKey} e ${labels[parameter].toLowerCase()}`);
  }

  const zScoreTable = buildZScoreTable(row);
  const interpolation = interpolateZScore(value, zScoreTable);

  if (interpolation.status === "below") {
    return {
      parameter,
      label: labels[parameter],
      value,
      unit: units[parameter],
      zScore: null,
      zScoreLabel: "< -3 DS",
      percentile: null,
      percentileLabel: "< 1°",
      interpretation: "fuori range tabellare",
      zScoreTable
    };
  }

  if (interpolation.status === "above") {
    return {
      parameter,
      label: labels[parameter],
      value,
      unit: units[parameter],
      zScore: null,
      zScoreLabel: "> +3 DS",
      percentile: null,
      percentileLabel: "> 99°",
      interpretation: "fuori range tabellare",
      zScoreTable
    };
  }

  const zScore = interpolation.zScore as number;
  const percentile = zScoreToPercentile(zScore);

  return {
    parameter,
    label: labels[parameter],
    value,
    unit: units[parameter],
    zScore,
    zScoreLabel: formatSigned(zScore),
    percentile,
    percentileLabel: `${formatNumber(percentile, 0)}°`,
    interpretation: classifyPercentile(percentile),
    zScoreTable
  };
}

function parseOneCsv(csv: string, sex: IntergrowthSex, parameter: IntergrowthParameter) {
  const lines = csv.trim().split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines[0]).map((header) => header.trim());
  const rows: IntergrowthCsvRow[] = [];

  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line);
    const raw: Record<string, string> = {};
    headers.forEach((header, index) => {
      raw[header] = cells[index]?.trim() ?? "";
    });

    const weeks = Number(raw.Weeks);
    const days = Number(raw.Days);
    if (!Number.isFinite(weeks) || !Number.isFinite(days)) continue;

    const values = {} as Record<ZScoreColumn, number>;
    headers.forEach((header) => {
      const normalized = normalizeColumnName(header);
      const zColumn = normalizedColumnMap[normalized];
      if (!zColumn) return;
      const parsed = Number(raw[header].replace(",", "."));
      values[zColumn] = parameter === "weight" ? parsed * 1000 : parsed;
    });

    rows.push({
      sex,
      parameter,
      weeks,
      days,
      gestationalAgeKey: getGestationalAgeKey(weeks, days),
      values
    });
  }

  return rows;
}

function splitCsvLine(line: string) {
  return line.split(",");
}

function normalizeColumnName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function indexRows(rows: IntergrowthCsvRow[]) {
  const index = {} as Record<IntergrowthSex, Record<string, Partial<Record<IntergrowthParameter, IntergrowthCsvRow>>>>;

  rows.forEach((row) => {
    index[row.sex] ??= {};
    index[row.sex][row.gestationalAgeKey] ??= {};
    index[row.sex][row.gestationalAgeKey][row.parameter] = row;
  });

  return index;
}

function validateCalculationInputs(sex: IntergrowthSex, weeks: number, days: number, input: MetricInput) {
  if (sex !== "male" && sex !== "female") {
    throw new Error("Selezionare il sesso");
  }

  if (!Number.isInteger(weeks) || weeks < 24 || weeks > 42) {
    throw new Error("Selezionare le settimane di eta gestazionale tra 24 e 42");
  }

  if (!Number.isInteger(days) || days < 0 || days > 6) {
    throw new Error("Selezionare i giorni di eta gestazionale tra 0 e 6");
  }

  const values = [input.weight, input.length, input.headCircumference].filter((value) => value !== null && value !== undefined);
  if (values.length === 0) {
    throw new Error("Inserire almeno uno tra peso, lunghezza e circonferenza cranica");
  }

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

function formatSigned(value: number) {
  const rounded = formatNumber(value, 2);
  return value > 0 ? `+${rounded}` : rounded;
}

function formatNumber(value: number, digits: number) {
  return value.toLocaleString("it-IT", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}
