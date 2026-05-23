"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { Gauge, Ruler, Scale } from "lucide-react";
import {
  calculateAgeDecimalFromDates,
  calculateCdcBmi,
  calculateCdcMetric,
  cdcGrowthMetadata,
  formatCdcAge,
  formatCompletedAgeFromDates,
  getCdcRows,
  normalizeAgeToMonths,
  type CdcBmiClassification,
  type CdcBmiResult,
  type CdcMetricResult,
  type CdcParameter,
  type CdcSex
} from "@/lib/calculators/cdcGrowth";
import type { CdcLmsRow } from "@/data/cdc2000";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { WarningBox } from "@/components/ui/WarningBox";

type AgeMode = "slider" | "dates";

type SubmittedResult = {
  sex: CdcSex;
  ageYears: number;
  weight: CdcMetricResult | null;
  height: CdcMetricResult | null;
  bmi: CdcBmiResult | null;
};

const classificationClasses: Record<CdcBmiClassification, string> = {
  Normopeso: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-100 dark:ring-emerald-900",
  Sovrappeso: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:ring-amber-900",
  Obesità: "bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-100 dark:ring-rose-900"
};

export function CdcGrowthCalculator() {
  const [sex, setSex] = useState<CdcSex | "">("male");
  const [ageMode, setAgeMode] = useState<AgeMode>("slider");
  const [ageYears, setAgeYears] = useState(8);
  const [birthDate, setBirthDate] = useState("");
  const [measurementDate, setMeasurementDate] = useState(new Date().toISOString().slice(0, 10));
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [submittedResult, setSubmittedResult] = useState<SubmittedResult | null>(null);
  const [submittedErrors, setSubmittedErrors] = useState<string[]>([]);

  const agePreview = useMemo(() => {
    let ageError: string | null = null;
    let effectiveAge = normalizeAgeToMonths(ageYears);
    let displayAge = formatCdcAge(effectiveAge);

    if (ageMode === "dates") {
      try {
        effectiveAge = calculateAgeDecimalFromDates(birthDate, measurementDate);
        displayAge = formatCompletedAgeFromDates(birthDate, measurementDate);
        if (effectiveAge < 2 || effectiveAge > 20) {
          ageError = "Età consentita solo tra 2 anni e 20 anni.";
        }
      } catch (error) {
        ageError = error instanceof Error ? error.message : "Date non valide";
      }
    }

    return { effectiveAge, displayAge, ageError };
  }, [ageMode, ageYears, birthDate, measurementDate]);

  const resetSubmittedOutput = () => {
    setSubmittedResult(null);
    setSubmittedErrors([]);
  };

  const handleCalculate = () => {
    const errors: string[] = [];
    const effectiveAge = agePreview.effectiveAge;
    const parsedWeight = parseDecimalInput(weightKg);
    const parsedHeight = parseDecimalInput(heightCm);
    const hasWeight = weightKg.trim() !== "";
    const hasHeight = heightCm.trim() !== "";

    if (!sex) errors.push("Selezionare il sesso");
    if (agePreview.ageError) errors.push(agePreview.ageError);
    if (hasWeight && (!Number.isFinite(parsedWeight) || parsedWeight <= 0)) errors.push("Inserire un peso valido maggiore di 0 kg");
    if (hasHeight && (!Number.isFinite(parsedHeight) || parsedHeight <= 0)) errors.push("Inserire una statura valida maggiore di 0 cm");
    if (!hasWeight && !hasHeight) errors.push("Inserire almeno peso o statura");

    if (errors.length > 0) {
      setSubmittedErrors(dedupe(errors));
      setSubmittedResult(null);
      return;
    }

    try {
      setSubmittedResult({
        sex: sex as CdcSex,
        ageYears: effectiveAge,
        weight: hasWeight ? calculateCdcMetric("weight", sex as CdcSex, effectiveAge, parsedWeight) : null,
        height: hasHeight ? calculateCdcMetric("height", sex as CdcSex, effectiveAge, parsedHeight) : null,
        bmi: hasWeight && hasHeight ? calculateCdcBmi(sex as CdcSex, effectiveAge, parsedWeight, parsedHeight) : null
      });
      setSubmittedErrors([]);
    } catch (error) {
      setSubmittedErrors([error instanceof Error ? error.message : "Impossibile calcolare i centili CDC"]);
      setSubmittedResult(null);
    }
  };

  const visibleErrors = dedupe([
    ...(birthDate && measurementDate && agePreview.ageError ? [agePreview.ageError] : []),
    ...submittedErrors
  ]);

  return (
    <CalculatorLayout
      source={cdcGrowthMetadata.source}
      updatedAt={cdcGrowthMetadata.updatedAt}
      sourceTitle="Riferimenti bibliografici"
      sourceNote="Dati LMS caricati localmente dai file CDC forniti."
      unframed
      warningPlacement="bottom"
      warning={null}
    >
      <div className="grid gap-5">
        <section className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldGroup label="Sesso">
              <div className="grid grid-cols-2 gap-2">
                <SegmentButton active={sex === "male"} onClick={() => {
                  setSex("male");
                  resetSubmittedOutput();
                }}>
                  Maschio
                </SegmentButton>
                <SegmentButton active={sex === "female"} onClick={() => {
                  setSex("female");
                  resetSubmittedOutput();
                }}>
                  Femmina
                </SegmentButton>
              </div>
            </FieldGroup>

            <FieldGroup label="Selettore età">
              <div className="grid grid-cols-2 gap-2">
                <SegmentButton active={ageMode === "slider"} onClick={() => {
                  setAgeMode("slider");
                  resetSubmittedOutput();
                }}>
                  Slider
                </SegmentButton>
                <SegmentButton active={ageMode === "dates"} onClick={() => {
                  setAgeMode("dates");
                  resetSubmittedOutput();
                }}>
                  Date
                </SegmentButton>
              </div>
            </FieldGroup>
          </div>

          {ageMode === "slider" ? (
            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="cdc-age" className="text-base font-semibold text-slate-950 dark:text-white">
                  Età
                </label>
                <output className="text-xl font-semibold text-slate-950 dark:text-white">{formatCdcAge(ageYears)}</output>
              </div>
              <input
                id="cdc-age"
                type="range"
                min={2}
                max={20}
                step={1 / 12}
                value={ageYears}
                onChange={(event) => {
                  setAgeYears(normalizeAgeToMonths(Number(event.target.value)));
                  resetSubmittedOutput();
                }}
                className="h-2 w-full accent-blue-600"
              />
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>2 anni</span>
                <span>20 anni</span>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <DateField id="cdc-birth-date" label="Data di nascita" value={birthDate} onChange={(value) => {
                setBirthDate(value);
                resetSubmittedOutput();
              }} />
              <DateField id="cdc-measurement-date" label="Data misurazione" value={measurementDate} onChange={(value) => {
                setMeasurementDate(value);
                resetSubmittedOutput();
              }} />
              {birthDate && measurementDate && !agePreview.ageError ? (
                <p className="text-sm font-medium text-slate-600 sm:col-span-2 dark:text-slate-300">
                  Età calcolata: <span className="font-semibold text-slate-950 dark:text-white">{agePreview.displayAge}</span>
                </p>
              ) : null}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="cdc-weight-kg" label="Peso" unit="kg" value={weightKg} onChange={(value) => {
              setWeightKg(value);
              resetSubmittedOutput();
            }} />
            <NumberField id="cdc-height-cm" label="Statura" unit="cm" value={heightCm} onChange={(value) => {
              setHeightCm(value);
              resetSubmittedOutput();
            }} />
          </div>

          <div>
            <button
              type="button"
              onClick={handleCalculate}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            >
              Calcola
            </button>
          </div>
        </section>

        {visibleErrors.length > 0 ? (
          <div className="grid gap-2">
            {visibleErrors.map((error) => (
              <WarningBox key={error}>{error}</WarningBox>
            ))}
          </div>
        ) : null}

        {submittedResult ? <Results result={submittedResult} /> : null}
      </div>
    </CalculatorLayout>
  );
}

function Results({ result }: { result: SubmittedResult }) {
  const [showCharts, setShowCharts] = useState(false);

  return (
    <section className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Risultati</h2>
        <span className="text-base font-semibold text-slate-700 dark:text-slate-200">{formatCdcAge(result.ageYears)}</span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {result.weight ? (
          <ResultCard icon={<Scale className="size-5" />} label="Peso" value={`${formatNumber(result.weight.value, 1)} kg`} percentile={result.weight.percentile} zScore={result.weight.zScore} />
        ) : (
          <MissingResultCard icon={<Scale className="size-5" />} label="Peso" value="Non inserito" />
        )}
        {result.height ? (
          <ResultCard icon={<Ruler className="size-5" />} label="Statura" value={`${formatNumber(result.height.value, 1)} cm`} percentile={result.height.percentile} zScore={result.height.zScore} />
        ) : (
          <MissingResultCard icon={<Ruler className="size-5" />} label="Statura" value="Non inserita" />
        )}
        {result.bmi ? (
          <ResultCard
            icon={<Gauge className="size-5" />}
            label="BMI"
            value={`${formatNumber(result.bmi.value, 1)} kg/m²`}
            percentile={result.bmi.percentile}
            zScore={result.bmi.zScore}
            extra={
              result.bmi.classification !== "Normopeso" ? (
                <div className="grid gap-2">
                  <span className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ring-1 ${classificationClasses[result.bmi.classification]}`}>
                    {result.bmi.classification}
                  </span>
                  <span className="rounded-md bg-blue-50 px-3 py-2 text-sm leading-6 text-blue-950 dark:bg-blue-950/40 dark:text-blue-100">
                    <span className="block">Sovrappeso se BMI &gt;= {formatNumber(result.bmi.overweightThreshold, 1)} kg/m²;</span>
                    <span className="block">Obesità se BMI &gt;= {formatNumber(result.bmi.obesityThreshold, 1)} kg/m²</span>
                  </span>
                </div>
              ) : null
            }
          />
        ) : (
          <MissingResultCard icon={<Gauge className="size-5" />} label="BMI" value="Non calcolabile" />
        )}
      </div>
      <button
        type="button"
        onClick={() => setShowCharts((value) => !value)}
        className="w-fit rounded-md border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900 dark:bg-slate-950 dark:text-blue-300 dark:hover:bg-blue-950/40"
      >
        {showCharts ? "Nascondi grafici" : "Visualizza grafici"}
      </button>
      {showCharts ? <GrowthCharts result={result} /> : null}
    </section>
  );
}

function GrowthCharts({ result }: { result: SubmittedResult }) {
  return (
    <section className="grid gap-4">
      <h3 className="text-lg font-bold text-slate-950 dark:text-white">Grafici</h3>
      <div className="grid gap-4">
        {result.weight ? (
          <GrowthChart
            title="Peso per età"
            yLabel="Peso"
            unit="kg"
            rows={getRows("weight", result.sex)}
            patient={{ age: result.ageYears, value: result.weight.value }}
          />
        ) : null}
        {result.height ? (
          <GrowthChart
            title="Statura per età"
            yLabel="Statura"
            unit="cm"
            rows={getRows("height", result.sex)}
            patient={{ age: result.ageYears, value: result.height.value }}
          />
        ) : null}
        {result.bmi ? (
          <GrowthChart
            title="BMI per età"
            yLabel="BMI"
            unit="kg/m²"
            rows={getRows("bmi", result.sex)}
            patient={{ age: result.ageYears, value: result.bmi.value }}
            showBmiThresholds
          />
        ) : null}
      </div>
    </section>
  );
}

function GrowthChart({
  title,
  yLabel,
  unit,
  rows,
  patient,
  showBmiThresholds = false
}: {
  title: string;
  yLabel: string;
  unit: string;
  rows: readonly CdcLmsRow[];
  patient: { age: number; value: number };
  showBmiThresholds?: boolean;
}) {
  const width = 760;
  const height = 428;
  const padding = { top: 24, right: 24, bottom: 50, left: 52 };
  const ageMin = 2;
  const ageMax = 20;
  const series = [
    { label: "+2 DS", values: rows.map((row) => point(row, 2)), color: "#dc2626", width: 1.5 },
    { label: "+1 DS", values: rows.map((row) => point(row, 1)), color: "#f59e0b", width: 1.3 },
    { label: "M", values: rows.map((row) => point(row, 0)), color: "#2563eb", width: 2.2 },
    { label: "-1 DS", values: rows.map((row) => point(row, -1)), color: "#f59e0b", width: 1.3 },
    { label: "-2 DS", values: rows.map((row) => point(row, -2)), color: "#dc2626", width: 1.5 }
  ];
  const bmiThresholds = showBmiThresholds
    ? [
        { label: "Sovrappeso (85°)", values: rows.filter((row) => row.p85 !== undefined).map((row) => ({ age: row.ageMonths / 12, value: row.p85 as number })), color: "#0891b2" },
        { label: "Obesità (95°)", values: rows.map((row) => ({ age: row.ageMonths / 12, value: row.p95 })), color: "#be123c" }
      ]
    : [];
  const allValues = [
    ...series.flatMap((item) => item.values.map((itemPoint) => itemPoint.value)),
    ...bmiThresholds.flatMap((item) => item.values.map((itemPoint) => itemPoint.value)),
    patient.value
  ];
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const yPadding = Math.max((rawMax - rawMin) * 0.08, 1);
  const yMin = rawMin - yPadding;
  const yMax = rawMax + yPadding;

  const x = (age: number) => padding.left + ((age - ageMin) / (ageMax - ageMin)) * (width - padding.left - padding.right);
  const y = (value: number) => padding.top + ((yMax - value) / (yMax - yMin)) * (height - padding.top - padding.bottom);
  const pathFor = (values: Array<{ age: number; value: number }>) => values.map((itemPoint, index) => `${index === 0 ? "M" : "L"} ${x(itemPoint.age).toFixed(1)} ${y(itemPoint.value).toFixed(1)}`).join(" ");
  const patientX = x(patient.age);
  const patientY = y(patient.value);
  const yTicks = makeTicks(yMin, yMax).filter((tick) => tick >= yMin && tick <= yMax);
  const chartClipId = `cdc-chart-${title.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}`;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-base font-bold text-slate-950 dark:text-white">{title}</h4>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-600 dark:text-slate-300">
          {series.map((item) => <Legend key={item.label} color={item.color} label={item.label} />)}
          {bmiThresholds.map((item) => <Legend key={item.label} color={item.color} label={item.label} dashed />)}
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title} className="h-auto w-full overflow-visible">
        <defs>
          <clipPath id={chartClipId}>
            <rect x={padding.left} y={padding.top} width={chartWidth} height={chartHeight} />
          </clipPath>
        </defs>
        <rect x={padding.left} y={padding.top} width={chartWidth} height={chartHeight} className="fill-slate-50 dark:fill-slate-900" rx="6" />
        {yTicks.map((tick) => (
          <g key={tick}>
            <line clipPath={`url(#${chartClipId})`} x1={padding.left} x2={width - padding.right} y1={y(tick)} y2={y(tick)} className="stroke-slate-200 dark:stroke-slate-800" />
            <text x={padding.left - 8} y={y(tick) + 4} textAnchor="end" className="fill-slate-500 text-[11px] dark:fill-slate-400">{formatChartNumber(tick)}</text>
          </g>
        ))}
        {[2, 5, 10, 15, 20].map((tick) => (
          <g key={tick}>
            <line clipPath={`url(#${chartClipId})`} x1={x(tick)} x2={x(tick)} y1={padding.top} y2={height - padding.bottom} className="stroke-slate-200 dark:stroke-slate-800" />
            <text x={x(tick)} y={height - 22} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">{tick}</text>
          </g>
        ))}
        <g clipPath={`url(#${chartClipId})`}>
          {series.map((item) => (
            <path key={item.label} d={pathFor(item.values)} fill="none" stroke={item.color} strokeWidth={item.width} strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {bmiThresholds.map((item) => (
            <path key={item.label} d={pathFor(item.values)} fill="none" stroke={item.color} strokeWidth="1.7" strokeDasharray="6 5" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          <line x1={patientX} x2={patientX} y1={padding.top} y2={height - padding.bottom} className="stroke-blue-500/30" strokeDasharray="4 4" />
          <circle cx={patientX} cy={patientY} r="6" className="fill-blue-600 stroke-white stroke-2 dark:stroke-slate-950" />
        </g>
        <text x={patientX + 9} y={patientY - 8} className="fill-blue-700 text-[12px] font-semibold dark:fill-blue-300">{formatChartNumber(patient.value)} {unit}</text>
        <text x={(padding.left + width - padding.right) / 2} y={height - 4} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">Età (anni)</text>
        <text x="12" y={(padding.top + height - padding.bottom) / 2} textAnchor="middle" transform={`rotate(-90 12 ${(padding.top + height - padding.bottom) / 2})`} className="fill-slate-500 text-[11px] dark:fill-slate-400">{yLabel} ({unit})</text>
      </svg>
    </article>
  );
}

function MissingResultCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <article className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
            {icon}
            <span>{label}</span>
          </div>
        </div>
        <p className="text-right text-lg font-bold leading-tight text-slate-500 dark:text-slate-400">{value}</p>
      </div>
    </article>
  );
}

function ResultCard({
  icon,
  label,
  value,
  percentile,
  zScore,
  extra
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  percentile: number;
  zScore: number;
  extra?: React.ReactNode;
}) {
  const isZScoreOutOfRange = zScore > 2 || zScore < -2;

  return (
    <article className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
            {icon}
            <span>{label}</span>
          </div>
        </div>
        <p className="text-right text-xl font-bold leading-tight text-slate-950 dark:text-white">{value}</p>
      </div>
      <dl className="grid grid-cols-2 gap-3">
        <Metric label="Centile" value={`${formatNumber(percentile, percentile < 1 || percentile > 99 ? 1 : 0)}°`} alert={isZScoreOutOfRange} />
        <Metric label="Z-score" value={formatSigned(zScore)} alert={isZScoreOutOfRange} />
      </dl>
      {extra}
    </article>
  );
}

function Metric({ label, value, alert = false }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className={`rounded-md px-3 py-2 ${alert ? "bg-rose-50 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:ring-rose-900" : "bg-slate-50 dark:bg-slate-900"}`}>
      <dt className={`text-xs font-medium uppercase tracking-wide ${alert ? "text-rose-700 dark:text-rose-200" : "text-slate-500 dark:text-slate-400"}`}>{label}</dt>
      <dd className={`mt-1 text-lg font-semibold ${alert ? "text-rose-900 dark:text-rose-100" : "text-slate-950 dark:text-white"}`}>{value}</dd>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <span className="text-base font-semibold text-slate-950 dark:text-white">{label}</span>
      {children}
    </div>
  );
}

function SegmentButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 ${
        active
          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-blue-900 dark:hover:bg-blue-950/40 dark:hover:text-blue-200"
      }`}
    >
      {children}
    </button>
  );
}

function NumberField({ id, label, unit, value, onChange }: { id: string; label: string; unit: string; value: string; onChange: (value: string) => void }) {
  return (
    <label htmlFor={id} className="grid gap-2">
      <span className="text-base font-semibold text-slate-950 dark:text-white">{label}</span>
      <span className="flex rounded-md border border-slate-200 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950">
        <input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 rounded-l-md bg-transparent px-3 py-2 text-base text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
        />
        <span className="rounded-r-md border-l border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">{unit}</span>
      </span>
    </label>
  );
}

function DateField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label htmlFor={id} className="grid gap-2">
      <span className="text-base font-semibold text-slate-950 dark:text-white">{label}</span>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-base text-slate-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
      />
    </label>
  );
}

function Legend({ color, label, dashed = false }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-0.5 w-5 rounded-full" style={{ backgroundColor: dashed ? "transparent" : color, borderTop: dashed ? `2px dashed ${color}` : undefined }} />
      {label}
    </span>
  );
}

function getRows(parameter: CdcParameter, sex: CdcSex) {
  return getCdcRows(parameter, sex);
}

function point(row: CdcLmsRow, z: number) {
  return {
    age: row.ageMonths / 12,
    value: valueFromLms(z, row.L, row.M, row.S)
  };
}

function valueFromLms(z: number, l: number, m: number, s: number) {
  if (Math.abs(l) < 1e-9) {
    return m * Math.exp(s * z);
  }

  return m * (1 + l * s * z) ** (1 / l);
}

function makeTicks(min: number, max: number) {
  const range = niceNumber(max - min);
  const step = niceNumber(range / 5);
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];

  for (let value = start; value <= end + step / 2; value += step) {
    ticks.push(Number(value.toFixed(6)));
  }

  return ticks;
}

function niceNumber(value: number) {
  const exponent = Math.floor(Math.log10(value));
  const fraction = value / 10 ** exponent;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * 10 ** exponent;
}

function parseDecimalInput(value: string) {
  return Number(value.replace(",", "."));
}

function formatNumber(value: number, digits: number) {
  return value.toLocaleString("it-IT", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function formatChartNumber(value: number) {
  return value.toLocaleString("it-IT", {
    maximumFractionDigits: value >= 100 ? 0 : 1
  });
}

function formatSigned(value: number) {
  const rounded = formatNumber(value, 2);
  return value > 0 ? `+${rounded}` : rounded;
}

function dedupe(values: string[]) {
  return Array.from(new Set(values));
}
