"use client";

import { useState } from "react";
import type React from "react";
import { Baby, Ruler, Scale } from "lucide-react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { WarningBox } from "@/components/ui/WarningBox";
import {
  calculateAllResults,
  getRowsForParameter,
  intergrowth21Metadata,
  type IntergrowthAllResults,
  type IntergrowthMetricResult,
  type IntergrowthParameter,
  type IntergrowthSex
} from "@/lib/calculators/intergrowth21";

const weeksOptions = Array.from({ length: 19 }, (_, index) => index + 24);
const daysOptions = Array.from({ length: 7 }, (_, index) => index);

const parameterMeta: Record<IntergrowthParameter, { label: string; unit: string; icon: React.ReactNode }> = {
  weight: { label: "Peso", unit: "g", icon: <Scale className="size-5" /> },
  length: { label: "Lunghezza", unit: "cm", icon: <Ruler className="size-5" /> },
  headCircumference: { label: "Circonferenza cranica", unit: "cm", icon: <Baby className="size-5" /> }
};

const intergrowthReferences = (
  <div className="grid gap-3">
    <ol className="list-decimal space-y-2 pl-5">
      <li>
        Villar J, Cheikh Ismail L, Victora CG, et al. International standards for newborn weight, length, and head circumference by gestational age and sex: the Newborn Cross-Sectional Study of the INTERGROWTH-21st Project. Lancet. 2014 Sep 6;384(9946):857-68. doi: 10.1016/S0140-6736(14)60932-6.
      </li>
      <li>
        Villar J, Giuliani F, Fenton TR, et al. INTERGROWTH-21st very preterm size at birth reference charts. Lancet. 2016 Feb 27;387(10021):844-5. doi: 10.1016/S0140-6736(16)00384-6. Erratum in: Lancet. 2016 Mar 5;387(10022):944. doi: 10.1016/S0140-6736(16)00571-7.
      </li>
    </ol>
    <p>
      Dati e calcolatore ufficiale INTERGROWTH-21st disponibili sul sito:{" "}
      <a
        href="https://intergrowth21.ndog.ox.ac.uk/"
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-blue-700 underline underline-offset-2 dark:text-blue-300"
      >
        https://intergrowth21.ndog.ox.ac.uk/
      </a>
    </p>
  </div>
);

export function IntergrowthBirthCalculator() {
  const [sex, setSex] = useState<IntergrowthSex | "">("male");
  const [weeks, setWeeks] = useState(39);
  const [days, setDays] = useState(0);
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [headCircumference, setHeadCircumference] = useState("");
  const [submittedResult, setSubmittedResult] = useState<IntergrowthAllResults | null>(null);
  const [submittedErrors, setSubmittedErrors] = useState<string[]>([]);
  const [showCharts, setShowCharts] = useState(false);

  const resetSubmittedOutput = () => {
    setSubmittedResult(null);
    setSubmittedErrors([]);
  };

  const handleCalculate = () => {
    const errors: string[] = [];
    const parsedWeight = parseOptionalDecimal(weight);
    const parsedLength = parseOptionalDecimal(length);
    const parsedHeadCircumference = parseOptionalDecimal(headCircumference);

    if (!sex) errors.push("Selezionare il sesso");
    if (!Number.isInteger(weeks) || weeks < 24 || weeks > 42) errors.push("Selezionare le settimane tra 24 e 42");
    if (!Number.isInteger(days) || days < 0 || days > 6) errors.push("Selezionare i giorni tra 0 e 6");
    if (weight.trim() !== "" && (parsedWeight === null || parsedWeight <= 0)) errors.push("Inserire un peso valido in grammi");
    if (length.trim() !== "" && (parsedLength === null || parsedLength <= 0)) errors.push("Inserire una lunghezza valida in cm");
    if (headCircumference.trim() !== "" && (parsedHeadCircumference === null || parsedHeadCircumference <= 0)) {
      errors.push("Inserire una circonferenza cranica valida in cm");
    }
    if (parsedWeight === null && parsedLength === null && parsedHeadCircumference === null) {
      errors.push("Inserire almeno uno tra peso, lunghezza e circonferenza cranica");
    }

    if (errors.length > 0) {
      setSubmittedErrors(dedupe(errors));
      setSubmittedResult(null);
      return;
    }

    try {
      const result = calculateAllResults(sex as IntergrowthSex, weeks, days, {
        weight: parsedWeight,
        length: parsedLength,
        headCircumference: parsedHeadCircumference
      });
      setSubmittedResult(result);
      setSubmittedErrors([]);
    } catch (error) {
      setSubmittedErrors([error instanceof Error ? error.message : "Impossibile calcolare i centili"]);
      setSubmittedResult(null);
    }
  };

  return (
    <CalculatorLayout
      source={intergrowthReferences}
      updatedAt={intergrowth21Metadata.updatedAt}
      sourceTitle="Riferimenti bibliografici"
      unframed
      warningPlacement="bottom"
      warning={null}
    >
      <div className="grid gap-5">
        <section className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-4">
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
          </div>

          <FieldGroup label="Età gestazionale">
            <div className="grid gap-4">
              <ButtonGrid
                label="Settimane"
                values={weeksOptions}
                selected={weeks}
                onSelect={(value) => {
                  setWeeks(value);
                  resetSubmittedOutput();
                }}
              />
              <ButtonGrid
                label="Giorni"
                values={daysOptions}
                selected={days}
                onSelect={(value) => {
                  setDays(value);
                  resetSubmittedOutput();
                }}
              />
            </div>
          </FieldGroup>

          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField id="intergrowth-weight" label="Peso" unit="g" value={weight} onChange={(value) => {
              setWeight(value);
              resetSubmittedOutput();
            }} />
            <NumberField id="intergrowth-length" label="Lunghezza" unit="cm" value={length} onChange={(value) => {
              setLength(value);
              resetSubmittedOutput();
            }} />
            <NumberField id="intergrowth-head" label="Circonferenza cranica" unit="cm" value={headCircumference} onChange={(value) => {
              setHeadCircumference(value);
              resetSubmittedOutput();
            }} />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCalculate}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            >
              Calcola
            </button>
          </div>
        </section>

        {submittedErrors.length > 0 ? (
          <div className="grid gap-2">
            {submittedErrors.map((error) => (
              <WarningBox key={error}>{error}</WarningBox>
            ))}
          </div>
        ) : null}

        {submittedResult ? (
          <section className="grid gap-4">
            <Results result={submittedResult} />
            <button
              type="button"
              onClick={() => setShowCharts((value) => !value)}
              className="w-fit rounded-md border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900 dark:bg-slate-950 dark:text-blue-300 dark:hover:bg-blue-950/40"
            >
              {showCharts ? "Nascondi grafici" : "Mostra grafici"}
            </button>
            {showCharts ? <GrowthCharts result={submittedResult} /> : null}
          </section>
        ) : null}
      </div>
    </CalculatorLayout>
  );
}

function Results({ result }: { result: IntergrowthAllResults }) {
  return (
    <section className="grid gap-3">
      <ResultSummary sex={result.sex} gestationalAge={result.gestationalAgeKey} />
      <div className="grid gap-3 lg:grid-cols-3">
        {result.results.map((item) => (
          <ResultCard key={item.parameter} result={item} />
        ))}
      </div>
    </section>
  );
}

function ResultSummary({ sex, gestationalAge }: { sex: IntergrowthSex; gestationalAge: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <dl className="flex flex-wrap gap-x-6 gap-y-2">
        <div className="flex gap-2">
          <dt className="font-semibold text-slate-950 dark:text-white">Sesso</dt>
          <dd className="text-slate-700 dark:text-slate-200">{sex === "male" ? "Maschio" : "Femmina"}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-semibold text-slate-950 dark:text-white">Età gestazionale</dt>
          <dd className="text-slate-700 dark:text-slate-200">{gestationalAge}</dd>
        </div>
      </dl>
    </div>
  );
}

function ResultCard({ result }: { result: IntergrowthMetricResult }) {
  const alert = result.zScore === null || result.zScore < -2 || result.zScore > 2;
  const meta = parameterMeta[result.parameter];
  const showRangeAlert = result.zScore === null;

  return (
    <article className={`grid gap-4 rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-950 ${alert ? "border-rose-300 ring-1 ring-rose-200 dark:border-rose-800 dark:ring-rose-950" : "border-slate-200 dark:border-slate-800"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
          {meta.icon}
          <span>{result.label}</span>
        </div>
        <p className="text-right text-xl font-bold leading-tight text-slate-950 dark:text-white">
          {formatNumber(result.value, result.parameter === "weight" ? 0 : 1)} {result.unit}
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-3">
        <Metric label="Centile" value={result.percentileLabel} alert={alert} />
        <Metric label="Z-score" value={result.zScoreLabel} alert={alert} />
      </dl>
      {showRangeAlert ? (
        <div className="w-fit rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-800 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-100 dark:ring-rose-900">
          Fuori range tabellare
        </div>
      ) : null}
    </article>
  );
}

function GrowthCharts({ result }: { result: IntergrowthAllResults }) {
  return (
    <section className="grid gap-4">
      <div className="grid gap-4">
        {result.results.map((item) => (
          <GrowthChart key={item.parameter} metric={item} sex={result.sex} weeks={result.weeks} days={result.days} />
        ))}
      </div>
    </section>
  );
}

function GrowthChart({ metric, sex, weeks, days }: { metric: IntergrowthMetricResult; sex: IntergrowthSex; weeks: number; days: number }) {
  const width = 760;
  const height = 428;
  const padding = { top: 24, right: 24, bottom: 50, left: 52 };
  const patientAge = weeks + days / 7;
  const isEarlyGestation = patientAge < 33;
  const xMin = isEarlyGestation ? 24 : 33;
  const xMax = isEarlyGestation ? 32 + 6 / 7 : 42 + 6 / 7;
  const xTicks = isEarlyGestation
    ? Array.from({ length: 9 }, (_, index) => index + 24)
    : Array.from({ length: 10 }, (_, index) => index + 33);
  const rows = getRowsForParameter(metric.parameter, sex).filter((row) => {
    const age = row.weeks + row.days / 7;
    return age >= xMin && age <= xMax;
  });
  const series = [
    { label: "+3 DS", z: 3, color: "#be123c", width: 1.4 },
    { label: "+2 DS", z: 2, color: "#dc2626", width: 1.4 },
    { label: "+1 DS", z: 1, color: "#f59e0b", width: 1.3 },
    { label: "M", z: 0, color: "#2563eb", width: 2.2 },
    { label: "-1 DS", z: -1, color: "#f59e0b", width: 1.3 },
    { label: "-2 DS", z: -2, color: "#dc2626", width: 1.4 },
    { label: "-3 DS", z: -3, color: "#be123c", width: 1.4 }
  ].map((item) => ({
    ...item,
    values: rows.map((row) => ({
      age: row.weeks + row.days / 7,
      value: metric.zScoreTable.find((point) => point.z === item.z)
        ? row.values[zToColumn(item.z)]
        : 0
    }))
  }));
  const allValues = [...series.flatMap((item) => item.values.map((point) => point.value)), metric.value];
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const yPadding = Math.max((rawMax - rawMin) * 0.08, metric.parameter === "weight" ? 100 : 0.5);
  const yMin = rawMin - yPadding;
  const yMax = rawMax + yPadding;
  const x = (age: number) => padding.left + ((age - xMin) / (xMax - xMin)) * (width - padding.left - padding.right);
  const y = (value: number) => padding.top + ((yMax - value) / (yMax - yMin)) * (height - padding.top - padding.bottom);
  const pathFor = (values: Array<{ age: number; value: number }>) => values.map((point, index) => `${index === 0 ? "M" : "L"} ${x(point.age).toFixed(1)} ${y(point.value).toFixed(1)}`).join(" ");
  const patientX = x(patientAge);
  const patientY = y(metric.value);
  const yTicks = makeMetricTicks(metric.parameter, yMin, yMax);
  const plotMidX = padding.left + (width - padding.left - padding.right) / 2;
  const labelOffset = patientX > plotMidX ? -9 : 9;
  const labelAnchor = patientX > plotMidX ? "end" : "start";

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-base font-bold text-slate-950 dark:text-white">{getIntergrowthChartTitle(metric.parameter)}</h4>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-600 dark:text-slate-300">
          {series.map((item) => <Legend key={item.label} color={item.color} label={item.label} />)}
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={getIntergrowthChartTitle(metric.parameter)} className="h-auto w-full overflow-visible">
        <rect x={padding.left} y={padding.top} width={width - padding.left - padding.right} height={height - padding.top - padding.bottom} className="fill-slate-50 dark:fill-slate-900" rx="6" />
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={padding.left} x2={width - padding.right} y1={y(tick)} y2={y(tick)} className="stroke-slate-200 dark:stroke-slate-800" />
            <text x={padding.left - 8} y={y(tick) + 4} textAnchor="end" className="fill-slate-500 text-[11px] dark:fill-slate-400">{formatChartNumber(tick)}</text>
          </g>
        ))}
        {xTicks.map((tick) => (
          <g key={tick}>
            <line x1={x(tick)} x2={x(tick)} y1={padding.top} y2={height - padding.bottom} className="stroke-slate-200 dark:stroke-slate-800" />
            <text x={x(tick)} y={height - 22} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">{tick}</text>
          </g>
        ))}
        {series.map((item) => (
          <path key={item.label} d={pathFor(item.values)} fill="none" stroke={item.color} strokeWidth={item.width} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        <line x1={patientX} x2={patientX} y1={padding.top} y2={height - padding.bottom} className="stroke-blue-500/30" strokeDasharray="4 4" />
        <circle cx={patientX} cy={patientY} r="6" className="fill-blue-600 stroke-white stroke-2 dark:stroke-slate-950" />
        <text x={patientX + labelOffset} y={patientY - 8} textAnchor={labelAnchor} className="fill-blue-700 text-[12px] font-semibold dark:fill-blue-300">{formatChartNumber(metric.value)} {metric.unit}</text>
        <text x={(padding.left + width - padding.right) / 2} y={height - 4} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">Età gestazionale (settimane)</text>
        <text x="12" y={(padding.top + height - padding.bottom) / 2} textAnchor="middle" transform={`rotate(-90 12 ${(padding.top + height - padding.bottom) / 2})`} className="fill-slate-500 text-[11px] dark:fill-slate-400">{metric.label} ({metric.unit})</text>
      </svg>
    </article>
  );
}

function getIntergrowthChartTitle(parameter: IntergrowthParameter) {
  if (parameter === "weight") return "Peso per età gestazionale";
  if (parameter === "length") return "Lunghezza per età gestazionale";
  return "Circonferenza cranica per età gestazionale";
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <span className="text-base font-semibold text-slate-950 dark:text-white">{label}</span>
      {children}
    </div>
  );
}

function ButtonGrid({ label, values, selected, onSelect }: { label: string; values: number[]; selected: number; onSelect: (value: number) => void }) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</span>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={`grid size-9 place-items-center border text-sm font-semibold transition sm:size-10 ${
              selected === value
                ? "border-orange-400 bg-orange-400 text-white"
                : "border-slate-200 bg-slate-50 text-slate-900 hover:border-orange-300 hover:bg-orange-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            }`}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

function SegmentButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
        active
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-blue-800"
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
      <div className="grid grid-cols-[minmax(0,1fr)_auto] overflow-hidden rounded-md border border-slate-200 bg-white focus-within:border-blue-500 dark:border-slate-800 dark:bg-slate-950">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 bg-transparent px-3 py-2 text-base text-slate-950 outline-none dark:text-white"
        />
        <span className="border-l border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">{unit}</span>
      </div>
    </label>
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

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="22" height="6" aria-hidden="true" className="shrink-0 overflow-visible">
        <line x1="1" x2="21" y1="3" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
      {label}
    </span>
  );
}

function parseOptionalDecimal(value: string) {
  if (value.trim() === "") return null;
  const parsed = Number(value.trim().replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function zToColumn(z: number) {
  if (z === -3) return "-3DS" as const;
  if (z === -2) return "-2DS" as const;
  if (z === -1) return "-1DS" as const;
  if (z === 1) return "+1DS" as const;
  if (z === 2) return "+2DS" as const;
  if (z === 3) return "+3DS" as const;
  return "M" as const;
}

function makeTicks(min: number, max: number) {
  const range = max - min;
  const rawStep = range / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  const step = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude;
  const first = Math.ceil(min / step) * step;
  const ticks: number[] = [];

  for (let tick = first; tick <= max + step * 0.1; tick += step) {
    ticks.push(roundChartTick(tick));
  }

  return ticks.length >= 2 ? ticks : [min, max].map(roundChartTick);
}

function makeMetricTicks(parameter: IntergrowthParameter, min: number, max: number) {
  if (parameter === "weight") return makeFixedStepTicks(min, max, 1000);
  if (parameter === "length" || parameter === "headCircumference") return makeFixedStepTicks(min, max, 5);
  return makeTicks(min, max);
}

function makeFixedStepTicks(min: number, max: number, step: number) {
  const first = Math.ceil(min / step) * step;
  const ticks: number[] = [];

  for (let tick = first; tick <= max + step * 0.1; tick += step) {
    ticks.push(roundChartTick(tick));
  }

  return ticks.length >= 2 ? ticks : [Math.floor(min / step) * step, Math.ceil(max / step) * step].map(roundChartTick);
}

function roundChartTick(value: number) {
  return Math.round(value * 10) / 10;
}

function formatChartNumber(value: number) {
  return value.toLocaleString("it-IT", {
    maximumFractionDigits: value >= 100 ? 0 : 1
  });
}

function formatNumber(value: number, digits: number) {
  return value.toLocaleString("it-IT", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function dedupe(values: string[]) {
  return Array.from(new Set(values));
}

function exportResult(result: IntergrowthAllResults) {
  const html = buildExportHtml(result);
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `intergrowth-21-${result.gestationalAgeKey.replace("+", "p")}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => printWindow.print(), 250);
}

function buildExportHtml(result: IntergrowthAllResults) {
  const rows = result.results.map((item) => `
    <tr>
      <td>${escapeHtml(item.label)}</td>
      <td>${escapeHtml(formatNumber(item.value, item.parameter === "weight" ? 0 : 1))} ${escapeHtml(item.unit)}</td>
      <td>${escapeHtml(item.percentileLabel)}</td>
      <td>${escapeHtml(item.zScoreLabel)}</td>
      <td>${escapeHtml(item.interpretation)}</td>
    </tr>
  `).join("");
  const charts = result.results.map((item) => buildExportChartSvg(item, result)).join("");

  return `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <title>Riepilogo INTERGROWTH-21</title>
  <style>
    body { font-family: Arial, sans-serif; color: #0f172a; margin: 32px; }
    h1 { font-size: 22px; margin-bottom: 8px; }
    h2 { font-size: 18px; margin: 28px 0 12px; }
    dl { display: grid; grid-template-columns: 180px 1fr; gap: 8px 16px; }
    dt { font-weight: 700; }
    table { border-collapse: collapse; width: 100%; margin-top: 24px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
    th { background: #eff6ff; }
    .charts { display: grid; gap: 18px; margin-top: 18px; }
    .chart { break-inside: avoid; page-break-inside: avoid; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; }
    .chart h3 { font-size: 15px; margin: 0 0 8px; }
    .chart svg { display: block; width: 100%; height: auto; }
    .note { margin-top: 24px; font-size: 13px; color: #475569; }
    @media print {
      body { margin: 18mm; }
      .chart { margin-bottom: 10mm; }
    }
  </style>
</head>
<body>
  <h1>Riepilogo centili alla nascita</h1>
  <dl>
    <dt>Sesso</dt><dd>${result.sex === "male" ? "Maschio" : "Femmina"}</dd>
    <dt>Età gestazionale</dt><dd>${escapeHtml(result.gestationalAgeKey)}</dd>
    <dt>Data del calcolo</dt><dd>${escapeHtml(formatDateTime(result.calculatedAt))}</dd>
    <dt>Riferimento</dt><dd>INTERGROWTH-21</dd>
  </dl>
  <table>
    <thead>
      <tr><th>Parametro</th><th>Valore</th><th>Centile</th><th>Z-score</th><th>Interpretazione</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <h2>Grafici</h2>
  <section class="charts">${charts}</section>
  <p class="note">Documento generato dal calcolatore INTERGROWTH-21. Verificare sempre il dato nel contesto clinico.</p>
</body>
</html>`;
}

function buildExportChartSvg(metric: IntergrowthMetricResult, result: IntergrowthAllResults) {
  const width = 760;
  const height = 428;
  const padding = { top: 24, right: 24, bottom: 50, left: 52 };
  const patientAge = result.weeks + result.days / 7;
  const isEarlyGestation = patientAge < 33;
  const xMin = isEarlyGestation ? 24 : 33;
  const xMax = isEarlyGestation ? 32 + 6 / 7 : 42 + 6 / 7;
  const xTicks = isEarlyGestation
    ? Array.from({ length: 9 }, (_, index) => index + 24)
    : Array.from({ length: 10 }, (_, index) => index + 33);
  const rows = getRowsForParameter(metric.parameter, result.sex).filter((row) => {
    const age = row.weeks + row.days / 7;
    return age >= xMin && age <= xMax;
  });
  const series = [
    { label: "+3 DS", z: 3, color: "#be123c", width: 1.4 },
    { label: "+2 DS", z: 2, color: "#dc2626", width: 1.4 },
    { label: "+1 DS", z: 1, color: "#f59e0b", width: 1.3 },
    { label: "M", z: 0, color: "#2563eb", width: 2.2 },
    { label: "-1 DS", z: -1, color: "#f59e0b", width: 1.3 },
    { label: "-2 DS", z: -2, color: "#dc2626", width: 1.4 },
    { label: "-3 DS", z: -3, color: "#be123c", width: 1.4 }
  ].map((item) => ({
    ...item,
    values: rows.map((row) => ({
      age: row.weeks + row.days / 7,
      value: row.values[zToColumn(item.z)]
    }))
  }));
  const allValues = [...series.flatMap((item) => item.values.map((point) => point.value)), metric.value];
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const yPadding = Math.max((rawMax - rawMin) * 0.08, metric.parameter === "weight" ? 100 : 0.5);
  const yMin = rawMin - yPadding;
  const yMax = rawMax + yPadding;
  const x = (age: number) => padding.left + ((age - xMin) / (xMax - xMin)) * (width - padding.left - padding.right);
  const y = (value: number) => padding.top + ((yMax - value) / (yMax - yMin)) * (height - padding.top - padding.bottom);
  const pathFor = (values: Array<{ age: number; value: number }>) => values.map((point, index) => `${index === 0 ? "M" : "L"} ${x(point.age).toFixed(1)} ${y(point.value).toFixed(1)}`).join(" ");
  const yTicks = makeMetricTicks(metric.parameter, yMin, yMax);
  const patientX = x(patientAge);
  const patientY = y(metric.value);

  return `
    <article class="chart">
      <h3>${escapeHtml(metric.label)} per età gestazionale</h3>
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(metric.label)} per età gestazionale">
        <rect x="${padding.left}" y="${padding.top}" width="${width - padding.left - padding.right}" height="${height - padding.top - padding.bottom}" fill="#f8fafc" rx="6" />
        ${yTicks.map((tick) => `
          <g>
            <line x1="${padding.left}" x2="${width - padding.right}" y1="${y(tick)}" y2="${y(tick)}" stroke="#e2e8f0" />
            <text x="${padding.left - 8}" y="${y(tick) + 4}" text-anchor="end" fill="#64748b" font-size="11">${formatChartNumber(tick)}</text>
          </g>
        `).join("")}
        ${xTicks.map((tick) => `
          <g>
            <line x1="${x(tick)}" x2="${x(tick)}" y1="${padding.top}" y2="${height - padding.bottom}" stroke="#e2e8f0" />
            <text x="${x(tick)}" y="${height - 22}" text-anchor="middle" fill="#64748b" font-size="11">${tick}</text>
          </g>
        `).join("")}
        ${series.map((item) => `<path d="${pathFor(item.values)}" fill="none" stroke="${item.color}" stroke-width="${item.width}" stroke-linecap="round" stroke-linejoin="round" />`).join("")}
        <line x1="${patientX}" x2="${patientX}" y1="${padding.top}" y2="${height - padding.bottom}" stroke="#60a5fa" stroke-dasharray="4 4" />
        <circle cx="${patientX}" cy="${patientY}" r="6" fill="#2563eb" stroke="#ffffff" stroke-width="2" />
        <text x="${patientX + 9}" y="${patientY - 8}" fill="#1d4ed8" font-size="12" font-weight="700">${formatChartNumber(metric.value)} ${escapeHtml(metric.unit)}</text>
        <text x="${(padding.left + width - padding.right) / 2}" y="${height - 4}" text-anchor="middle" fill="#64748b" font-size="11">Età gestazionale (settimane)</text>
        <text x="12" y="${(padding.top + height - padding.bottom) / 2}" text-anchor="middle" transform="rotate(-90 12 ${(padding.top + height - padding.bottom) / 2})" fill="#64748b" font-size="11">${escapeHtml(metric.label)} (${escapeHtml(metric.unit)})</text>
      </svg>
    </article>
  `;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("it-IT", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
