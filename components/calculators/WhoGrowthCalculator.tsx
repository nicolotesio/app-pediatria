"use client";

import { useEffect, useMemo, useState } from "react";
import type React from "react";
import { Download } from "lucide-react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { WarningBox } from "@/components/ui/WarningBox";
import {
  calculateAgeDaysFromDates,
  calculateWhoGrowth,
  formatWhoAge,
  getWhoRows,
  whoGrowthMetadata,
  type WhoDataset,
  type WhoGrowthData,
  type WhoGrowthResult,
  type WhoMetricResult,
  type WhoSex
} from "@/lib/calculators/whoGrowth";

type AgeMode = "slider" | "dates";

const maxAgeDays = 1856;
const daysPerMonth = 30.4375;
const zLabels = ["-3 DS", "-2 DS", "-1 DS", "M", "+1 DS", "+2 DS", "+3 DS"];
const zColors = ["#be123c", "#dc2626", "#f59e0b", "#2563eb", "#f59e0b", "#dc2626", "#be123c"];

export function WhoGrowthCalculator() {
  const [sex, setSex] = useState<WhoSex | "">("male");
  const [ageMode, setAgeMode] = useState<AgeMode>("slider");
  const [ageTotalMonths, setAgeTotalMonths] = useState(12);
  const [birthDate, setBirthDate] = useState("");
  const [measurementDate, setMeasurementDate] = useState(new Date().toISOString().slice(0, 10));
  const [weightKg, setWeightKg] = useState("");
  const [statureCm, setStatureCm] = useState("");
  const [headCircumferenceCm, setHeadCircumferenceCm] = useState("");
  const [submittedResult, setSubmittedResult] = useState<WhoGrowthResult | null>(null);
  const [submittedErrors, setSubmittedErrors] = useState<string[]>([]);
  const [whoData, setWhoData] = useState<WhoGrowthData | null>(null);
  const [whoDataError, setWhoDataError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    // Caricamento dei dati WHO: il JSON resta fuori dal bundle JavaScript della pagina.
    fetch("/data/who-growth.json")
      .then((response) => {
        if (!response.ok) throw new Error("Dati WHO non disponibili");
        return response.json() as Promise<WhoGrowthData>;
      })
      .then((data) => {
        if (!active) return;
        setWhoData(data);
        setWhoDataError(null);
      })
      .catch(() => {
        if (!active) return;
        setWhoDataError("Impossibile caricare i dati WHO. Ricaricare la pagina.");
      });

    return () => {
      active = false;
    };
  }, []);

  const manualAgeDays = useMemo(() => ageInMonthsToDays(ageTotalMonths), [ageTotalMonths]);

  const agePreview = useMemo(() => {
    if (ageMode === "slider") {
      return {
        ageDays: manualAgeDays,
        label: formatWhoAgeFromTotalMonths(ageTotalMonths),
        error: null as string | null
      };
    }

    try {
      const calculatedDays = calculateAgeDaysFromDates(birthDate, measurementDate);
      const error = calculatedDays > maxAgeDays ? "Età consentita solo tra 0 e 5 anni" : null;
      return { ageDays: calculatedDays, label: formatWhoAge(calculatedDays), error };
    } catch (error) {
      return {
        ageDays: manualAgeDays,
        label: formatWhoAgeFromTotalMonths(ageTotalMonths),
        error: error instanceof Error ? error.message : "Date non valide"
      };
    }
  }, [ageMode, ageTotalMonths, birthDate, manualAgeDays, measurementDate]);

  const resetSubmittedOutput = () => {
    setSubmittedResult(null);
    setSubmittedErrors([]);
  };

  const handleCalculate = () => {
    const errors: string[] = [];
    const parsedWeight = parseDecimalInput(weightKg);
    const parsedStature = parseDecimalInput(statureCm);
    const parsedHead = parseDecimalInput(headCircumferenceCm);

    if (!whoData) errors.push(whoDataError ?? "Caricamento dati WHO in corso");
    if (!sex) errors.push("Selezionare il sesso");
    if (agePreview.error) errors.push(agePreview.error);
    if (weightKg.trim() === "" || !Number.isFinite(parsedWeight) || parsedWeight <= 0) errors.push("Inserire un peso valido in kg");
    if (statureCm.trim() === "" || !Number.isFinite(parsedStature) || parsedStature <= 0) errors.push("Inserire una lunghezza/altezza valida in cm");
    if (headCircumferenceCm.trim() === "" || !Number.isFinite(parsedHead) || parsedHead <= 0) errors.push("Inserire una circonferenza cranica valida in cm");

    if (errors.length > 0) {
      setSubmittedErrors(dedupe(errors));
      setSubmittedResult(null);
      return;
    }

    try {
      setSubmittedResult(calculateWhoGrowth(whoData as WhoGrowthData, sex as WhoSex, agePreview.ageDays, parsedWeight, parsedStature, parsedHead));
      setSubmittedErrors([]);
    } catch (error) {
      setSubmittedErrors([error instanceof Error ? error.message : "Impossibile calcolare i centili WHO"]);
      setSubmittedResult(null);
    }
  };

  return (
    <CalculatorLayout
      source={whoGrowthMetadata.source}
      updatedAt={whoGrowthMetadata.updatedAt}
      sourceTitle="Riferimenti bibliografici"
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
                <label htmlFor="who-age" className="text-base font-semibold text-slate-950 dark:text-white">Età</label>
                <output className="text-base font-semibold text-slate-700 dark:text-slate-200">{agePreview.label}</output>
              </div>
              <input
                id="who-age"
                type="range"
                min={0}
                max={60}
                step={1}
                value={ageTotalMonths}
                onChange={(event) => {
                  setAgeTotalMonths(Number(event.target.value));
                  resetSubmittedOutput();
                }}
                className="h-2 w-full accent-blue-600"
              />
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Nascita</span>
                <span>5 anni</span>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <DateField id="who-birth-date" label="Data di nascita" value={birthDate} onChange={(value) => {
                setBirthDate(value);
                resetSubmittedOutput();
              }} />
              <DateField id="who-measurement-date" label="Data misurazione" value={measurementDate} onChange={(value) => {
                setMeasurementDate(value);
                resetSubmittedOutput();
              }} />
              {!agePreview.error ? (
                <p className="text-sm font-medium text-slate-600 sm:col-span-2 dark:text-slate-300">
                  Età calcolata: <span className="font-semibold text-slate-950 dark:text-white">{agePreview.label}</span>
                </p>
              ) : null}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField id="who-weight" label="Peso" unit="kg" value={weightKg} onChange={(value) => {
              setWeightKg(value);
              resetSubmittedOutput();
            }} />
            <NumberField id="who-stature" label={agePreview.ageDays <= 730 ? "Lunghezza" : "Altezza"} unit="cm" value={statureCm} onChange={(value) => {
              setStatureCm(value);
              resetSubmittedOutput();
            }} />
            <NumberField id="who-head" label="Circonferenza cranica" unit="cm" value={headCircumferenceCm} onChange={(value) => {
              setHeadCircumferenceCm(value);
              resetSubmittedOutput();
            }} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCalculate}
              disabled={!whoData}
              className="w-fit rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 dark:focus:ring-offset-slate-950 dark:disabled:bg-slate-700"
            >
              {whoData ? "Calcola" : "Caricamento dati"}
            </button>
            {submittedResult ? (
              <button
                type="button"
                onClick={() => exportWhoResult(submittedResult)}
                className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900 dark:bg-slate-950 dark:text-blue-300 dark:hover:bg-blue-950/40"
              >
                <Download className="size-4" />
                Esporta
              </button>
            ) : null}
          </div>
        </section>

        {whoDataError ? <WarningBox>{whoDataError}</WarningBox> : null}

        {submittedErrors.length > 0 ? (
          <div className="grid gap-2">
            {submittedErrors.map((error) => (
              <WarningBox key={error}>{error}</WarningBox>
            ))}
          </div>
        ) : null}

        {submittedResult ? (
          <section className="grid gap-4">
            <ResultsTable result={submittedResult} />
            <GrowthCharts data={whoData} result={submittedResult} />
          </section>
        ) : null}
      </div>
    </CalculatorLayout>
  );
}

function ResultsTable({ result }: { result: WhoGrowthResult }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              {["Parametro", "Valore", "Z-score", "Percentile"].map((header) => (
                <th key={header} scope="col" className="px-4 py-3 text-left font-semibold text-slate-950 dark:text-white">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {result.results.map((item) => {
              const alert = Math.abs(item.zScore) > 2;
              return (
                <tr key={item.key} className={alert ? "bg-rose-50/70 dark:bg-rose-950/30" : undefined}>
                  <td className="px-4 py-3 font-semibold text-slate-950 dark:text-white">{item.label}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{item.key === "weightForLength" ? "" : formatMetricValue(item)}</td>
                  <td className={`px-4 py-3 font-semibold ${alert ? "text-rose-800 dark:text-rose-100" : "text-slate-700 dark:text-slate-200"}`}>{formatSigned(item.zScore)}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{formatPercentile(item.percentile)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function GrowthCharts({ data, result }: { data: WhoGrowthData | null; result: WhoGrowthResult }) {
  if (!data) return null;

  return (
    <section className="grid gap-4">
      {result.results.map((item) => (
        <GrowthChart key={item.key} data={data} result={result} metric={item} />
      ))}
    </section>
  );
}

function GrowthChart({ data, result, metric }: { data: WhoGrowthData; result: WhoGrowthResult; metric: WhoMetricResult }) {
  const width = 760;
  const height = 428;
  const padding = { top: 24, right: 24, bottom: 50, left: 52 };
  const isLengthAxis = metric.dataset === "wfl";
  const rows = getChartRows(data, metric.dataset, result.sex, result.mode);
  const xMin = rows[0].x;
  const xMax = rows[rows.length - 1].x;
  const patientX = isLengthAxis ? result.statureCm : result.ageDays;
  const series = zLabels.map((label, index) => ({
    label,
    color: zColors[index],
    width: index === 3 ? 2.2 : 1.4,
    values: rows.map((row) => ({ x: row.x, value: row.sd[index] }))
  }));
  const allValues = [...series.flatMap((item) => item.values.map((point) => point.value)), metric.value];
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const yPadding = Math.max((rawMax - rawMin) * 0.08, 0.5);
  const yMin = rawMin - yPadding;
  const yMax = rawMax + yPadding;
  const x = (value: number) => padding.left + ((value - xMin) / (xMax - xMin)) * (width - padding.left - padding.right);
  const y = (value: number) => padding.top + ((yMax - value) / (yMax - yMin)) * (height - padding.top - padding.bottom);
  const pathFor = (values: Array<{ x: number; value: number }>) => values.map((point, index) => `${index === 0 ? "M" : "L"} ${x(point.x).toFixed(1)} ${y(point.value).toFixed(1)}`).join(" ");
  const xTicks = makeXTicks(metric.dataset, result.mode);
  const yTicks = makeTicks(yMin, yMax);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-base font-bold text-slate-950 dark:text-white">{metric.label}</h4>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-600 dark:text-slate-300">
          {series.map((item) => <Legend key={item.label} color={item.color} label={item.label} />)}
        </div>
      </div>
      <svg data-who-export-chart viewBox={`0 0 ${width} ${height}`} role="img" aria-label={metric.label} className="h-auto w-full overflow-visible">
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
            <text x={x(tick)} y={height - 22} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">{formatXTick(tick, metric.dataset)}</text>
          </g>
        ))}
        {series.map((item) => (
          <path key={item.label} d={pathFor(item.values)} fill="none" stroke={item.color} strokeWidth={item.width} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        <line x1={x(patientX)} x2={x(patientX)} y1={padding.top} y2={height - padding.bottom} className="stroke-blue-500/30" strokeDasharray="4 4" />
        <circle cx={x(patientX)} cy={y(metric.value)} r="6" className="fill-blue-600 stroke-white stroke-2 dark:stroke-slate-950" />
        <text x={x(patientX) + 9} y={y(metric.value) - 8} className="fill-blue-700 text-[12px] font-semibold dark:fill-blue-300">{formatChartPointLabel(metric)}</text>
        <text x={(padding.left + width - padding.right) / 2} y={height - 4} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">{getXAxisTitle(metric.dataset, result.mode)}</text>
        <text x="12" y={(padding.top + height - padding.bottom) / 2} textAnchor="middle" transform={`rotate(-90 12 ${(padding.top + height - padding.bottom) / 2})`} className="fill-slate-500 text-[11px] dark:fill-slate-400">{metric.label} ({metric.unit})</text>
      </svg>
    </article>
  );
}

function getChartRows(data: WhoGrowthData, dataset: WhoDataset, sex: WhoSex, mode: WhoGrowthResult["mode"]) {
  const rows = [...getWhoRows(data, dataset, sex)];
  if (dataset === "wfl") return rows;
  const min = mode === "under2" ? 0 : 730;
  const max = mode === "under2" ? 730 : maxAgeDays;
  return rows.filter((row) => row.x >= min && row.x <= max);
}

function makeXTicks(dataset: WhoDataset, mode: WhoGrowthResult["mode"]) {
  if (dataset === "wfl") return Array.from({ length: 14 }, (_, index) => 45 + index * 5);
  if (mode === "under2") return [0, 183, 365, 548, 730];
  return [730, 1096, 1461, 1826];
}

function formatXTick(value: number, dataset: WhoDataset) {
  if (dataset === "wfl") return value.toLocaleString("it-IT", { maximumFractionDigits: 0 });
  return (value / daysPerMonth).toLocaleString("it-IT", { maximumFractionDigits: 0 });
}

function getXAxisTitle(dataset: WhoDataset, mode: WhoGrowthResult["mode"]) {
  if (dataset === "wfl") return "Lunghezza (cm)";
  return mode === "under2" ? "Età (mesi)" : "Età (anni)";
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
        <input id={id} type="text" inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 bg-transparent px-3 py-2 text-base text-slate-950 outline-none dark:text-white" />
        <span className="border-l border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">{unit}</span>
      </div>
    </label>
  );
}

function DateField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label htmlFor={id} className="grid gap-2">
      <span className="text-base font-semibold text-slate-950 dark:text-white">{label}</span>
      <input id={id} type="date" value={value} onChange={(event) => onChange(event.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-base text-slate-950 outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
    </label>
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

function formatMetricValue(item: WhoMetricResult) {
  const digits = item.key === "weight" || item.key === "weightForLength" || item.key === "bmi" ? 2 : 1;
  return `${formatNumber(item.value, digits)} ${item.unit}`;
}

function formatChartPointLabel(item: WhoMetricResult) {
  if (item.key === "weightForLength") return `${formatSigned(item.zScore)} DS`;
  return formatMetricValue(item);
}

function formatPercentile(value: number) {
  const digits = value < 1 || value > 99 ? 1 : 0;
  return `${formatNumber(value, digits)}°`;
}

function formatSigned(value: number) {
  const rounded = formatNumber(value, 2);
  return value > 0 ? `+${rounded}` : rounded;
}

function parseDecimalInput(value: string) {
  return Number(value.trim().replace(",", "."));
}

function formatNumber(value: number, digits: number) {
  return value.toLocaleString("it-IT", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function ageInMonthsToDays(months: number) {
  return Math.round(months * daysPerMonth);
}

function formatWhoAgeFromTotalMonths(totalMonths: number) {
  if (totalMonths === 0) return "Nascita";
  if (totalMonths < 12) return `${totalMonths} ${totalMonths === 1 ? "mese" : "mesi"}`;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return `${years} ${years === 1 ? "anno" : "anni"}${months > 0 ? ` ${months} ${months === 1 ? "mese" : "mesi"}` : ""}`;
}

function formatChartNumber(value: number) {
  return value.toLocaleString("it-IT", {
    maximumFractionDigits: value >= 100 ? 0 : 1
  });
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
    ticks.push(Math.round(tick * 10) / 10);
  }

  return ticks.length >= 2 ? ticks : [min, max].map((value) => Math.round(value * 10) / 10);
}

function dedupe(values: string[]) {
  return Array.from(new Set(values));
}

function exportWhoResult(result: WhoGrowthResult) {
  const chartSvgs = Array.from(document.querySelectorAll<SVGSVGElement>("[data-who-export-chart]")).map((svg) => svg.outerHTML);
  const html = buildWhoExportHtml(result, chartSvgs);
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `who-growth-${result.ageDays}-giorni.html`;
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

function buildWhoExportHtml(result: WhoGrowthResult, chartSvgs: string[]) {
  const rows = result.results.map((item) => `
    <tr>
      <td>${escapeHtml(item.label)}</td>
      <td>${escapeHtml(formatMetricValue(item))}</td>
      <td>${escapeHtml(formatPercentile(item.percentile))}</td>
      <td>${escapeHtml(formatSigned(item.zScore))}</td>
      <td>${escapeHtml(getWhoInterpretation(item.zScore))}</td>
    </tr>
  `).join("");
  const charts = chartSvgs.map((svg, index) => `
    <section class="chart">
      <h3>${escapeHtml(result.results[index]?.label ?? `Grafico ${index + 1}`)}</h3>
      ${svg}
    </section>
  `).join("");
  const statureLabel = result.mode === "under2" ? "Lunghezza" : "Altezza";

  return `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <title>Resoconto crescita WHO 0-5 anni</title>
  <style>
    body { font-family: Arial, sans-serif; color: #0f172a; margin: 32px; }
    h1 { font-size: 22px; margin: 0 0 8px; }
    h2 { font-size: 18px; margin: 28px 0 12px; }
    h3 { font-size: 15px; margin: 0 0 8px; }
    dl { display: grid; grid-template-columns: 180px 1fr; gap: 8px 16px; margin-top: 18px; }
    dt { font-weight: 700; }
    table { border-collapse: collapse; width: 100%; margin-top: 18px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #eff6ff; }
    .charts { display: grid; gap: 18px; margin-top: 18px; }
    .chart { break-inside: avoid; page-break-inside: avoid; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; }
    .chart svg { display: block; width: 100%; height: auto; overflow: visible; }
    .fill-slate-50 { fill: #f8fafc; }
    .stroke-slate-200 { stroke: #e2e8f0; }
    .stroke-blue-500\\/30 { stroke: rgba(59, 130, 246, 0.3); }
    .fill-blue-600 { fill: #2563eb; }
    .stroke-white { stroke: #fff; }
    .stroke-2 { stroke-width: 2; }
    .fill-blue-700 { fill: #1d4ed8; }
    .fill-slate-500 { fill: #64748b; }
    .text-\\[11px\\] { font-size: 11px; }
    .text-\\[12px\\] { font-size: 12px; }
    .font-semibold { font-weight: 600; }
    .note { margin-top: 24px; font-size: 13px; color: #475569; }
    @media print {
      body { margin: 18mm; }
      .chart { margin-bottom: 10mm; }
    }
  </style>
</head>
<body>
  <h1>Resoconto crescita WHO 0-5 anni</h1>
  <p>Valutazione auxologica secondo WHO Child Growth Standards.</p>
  <dl>
    <dt>Sesso</dt><dd>${result.sex === "male" ? "Maschio" : "Femmina"}</dd>
    <dt>Età</dt><dd>${escapeHtml(formatWhoAge(result.ageDays))}</dd>
    <dt>Peso</dt><dd>${escapeHtml(formatNumber(result.weightKg, 2))} kg</dd>
    <dt>${escapeHtml(statureLabel)}</dt><dd>${escapeHtml(formatNumber(result.statureCm, 1))} cm</dd>
    <dt>Circonferenza cranica</dt><dd>${escapeHtml(formatNumber(result.headCircumferenceCm, 1))} cm</dd>
    ${result.bmi ? `<dt>BMI</dt><dd>${escapeHtml(formatNumber(result.bmi, 1))} kg/m²</dd>` : ""}
    <dt>Data del calcolo</dt><dd>${escapeHtml(formatDateTime(new Date()))}</dd>
    <dt>Riferimento</dt><dd>WHO Child Growth Standards</dd>
  </dl>
  <h2>Valutazione auxologica</h2>
  <table>
    <thead>
      <tr><th>Parametro</th><th>Valore</th><th>Centile</th><th>Z-score</th><th>Valutazione</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <h2>Grafici</h2>
  <section class="charts">${charts}</section>
  <p class="note">Documento generato dal calcolatore WHO 0-5 anni. Interpretare sempre i risultati nel contesto clinico.</p>
</body>
</html>`;
}

function getWhoInterpretation(zScore: number) {
  if (zScore < -2) return "Inferiore a -2 Z-score";
  if (zScore > 2) return "Superiore a +2 Z-score";
  return "Entro ±2 Z-score";
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
