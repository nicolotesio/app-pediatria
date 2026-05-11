"use client";

import { useMemo, useState } from "react";
import { calculateWetflag, wetflagMetadata } from "@/lib/calculators/wetflag";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { AgeWeightSelector, estimatePediatricWeightKg, type AgeWeightValue } from "@/components/calculators/AgeWeightSelector";
import { WarningBox } from "@/components/ui/WarningBox";

type ResultTone = "blue" | "amber" | "red" | "cyan" | "violet" | "rose" | "green";

const resultToneClasses: Record<ResultTone, string> = {
  blue: "bg-blue-600 text-white",
  amber: "bg-amber-600 text-white",
  red: "bg-red-600 text-white",
  cyan: "bg-cyan-600 text-white",
  violet: "bg-violet-600 text-white",
  rose: "bg-amber-900 text-white",
  green: "bg-emerald-600 text-white"
};

export function WetflagCalculator() {
  const [selectorValue, setSelectorValue] = useState<AgeWeightValue>({
    ageYears: 4,
    weightKg: estimatePediatricWeightKg(4),
    estimateWeightFromAge: true
  });
  const [showCalculations, setShowCalculations] = useState(false);

  const result = useMemo(() => {
    try {
      return calculateWetflag(selectorValue.ageYears, selectorValue.weightKg);
    } catch {
      return null;
    }
  }, [selectorValue]);

  return (
    <CalculatorLayout
      source={wetflagMetadata.source}
      updatedAt={wetflagMetadata.updatedAt}
      validity={wetflagMetadata.validity}
      units={wetflagMetadata.units}
      unframed
      showSource={false}
      warning="Calcoli rapidi per emergenza pediatrica. Confermare sempre peso reale, dosaggi, concentrazioni disponibili, protocolli locali e valutazione clinica prima della somministrazione."
    >
      <div className="grid gap-5">
        <AgeWeightSelector value={selectorValue} onChange={setSelectorValue} />

        {!result ? (
          <WarningBox>Selezionare età e peso validi per visualizzare i risultati.</WarningBox>
        ) : (
          <div className="grid gap-4">
            {result.warnings.map((warning) => (
              <WarningBox key={warning}>{warning}</WarningBox>
            ))}
            <label className="flex w-fit cursor-pointer items-center gap-3 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800 shadow-sm transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-100 dark:hover:bg-blue-950">
              <input
                type="checkbox"
                checked={showCalculations}
                onChange={(event) => setShowCalculations(event.target.checked)}
                className="size-4 rounded border-slate-300 accent-blue-600"
              />
              Mostra calcoli
            </label>
            <dl className="grid gap-3 sm:grid-cols-2">
              <ResultItem
                initial="W"
                tone="blue"
                label="Peso"
                value={`${result.estimatedWeightKg} kg`}
                calculation={selectorValue.estimateWeightFromAge ? getWeightCalculation(result.ageYears, result.estimatedWeightKg) : "Peso inserito manualmente."}
                showCalculation={showCalculations}
              />
              <ResultItem
                initial="E"
                tone="amber"
                label="Energia defibrillatore (iniziale)"
                value={`${result.defibrillationEnergyJ} J`}
                calculation={`4 J/kg x ${result.estimatedWeightKg} kg = ${roundForDisplay(4 * result.estimatedWeightKg)} J, max 120-200 J sulla base del tipo di defibrillatore -> ${result.defibrillationEnergyJ} J`}
                showCalculation={showCalculations}
              />
              <ResultItem
                initial="T"
                tone="red"
                label="Tubo ET"
                rows={[
                  { label: "interno tubo cuffiato", value: `${result.endotrachealTubeMm.cuffed} mm`, symbol: "⌀" },
                  { label: "interno tubo non cuffiato", value: `${result.endotrachealTubeMm.uncuffed} mm`, symbol: "⌀" },
                  { label: "Profondità orale", value: `${result.endotrachealTubeMm.oralDepthCm} cm` }
                ]}
                calculation={`${result.ageYears} / 4 + 3,5 = ${result.endotrachealTubeMm.cuffed} mm ID cuffiato; ${result.ageYears} / 4 + 4 = ${result.endotrachealTubeMm.uncuffed} mm ID non cuffiato; ${result.ageYears} / 2 + 12 = ${result.endotrachealTubeMm.oralDepthCm} cm profondità orale`}
                showCalculation={showCalculations}
              />
              <ResultItem
                initial="F"
                tone="cyan"
                label="Fluidi"
                rows={[
                  { label: "Emergenza medica (20 ml/kg)", value: `${result.fluidBolusOptionsMl.twentyPerKg} ml` },
                  { label: "Trauma (10 ml/kg)", value: `${result.fluidBolusOptionsMl.tenPerKg} ml` }
                ]}
                calculation={`20 ml/kg x ${result.estimatedWeightKg} kg = ${Math.round(20 * result.estimatedWeightKg)} ml, max 500 ml -> ${result.fluidBolusOptionsMl.twentyPerKg} ml; 10 ml/kg x ${result.estimatedWeightKg} kg = ${Math.round(10 * result.estimatedWeightKg)} ml, max 500 ml -> ${result.fluidBolusOptionsMl.tenPerKg} ml`}
                showCalculation={showCalculations}
              />
              <ResultItem
                initial="L"
                tone="violet"
                label="Lorazepam"
                value={`${result.lorazepam.mg} mg`}
                calculation={`0,1 mg/kg x ${result.estimatedWeightKg} kg = ${roundForDisplay(0.1 * result.estimatedWeightKg)} mg, max 4 mg -> ${result.lorazepam.mg} mg`}
                showCalculation={showCalculations}
              />
              <ResultItem
                initial="A"
                tone="rose"
                label="Adrenalina"
                value={`${result.adrenaline.micrograms} µg; ${result.adrenaline.mlOfOneInTenThousand} ml di 1:10.000`}
                valueParts={[`${result.adrenaline.micrograms} µg`, `${result.adrenaline.mlOfOneInTenThousand} ml di 1:10.000`]}
                calculation={`10 µg/kg x ${result.estimatedWeightKg} kg = ${result.adrenaline.micrograms} µg; 0,1 ml/kg x ${result.estimatedWeightKg} kg = ${result.adrenaline.mlOfOneInTenThousand} ml; Da ripetere ogni 3-5 minuti.`}
                showCalculation={showCalculations}
              />
              <ResultItem
                initial="G"
                tone="green"
                label="Glucosio"
                value={`${result.glucose.grams} g; ${result.glucose.d10Ml} ml D10`}
                valueParts={[`${result.glucose.grams} g`, `${result.glucose.d10Ml} ml D10`]}
                calculation={`${result.glucose.d10Ml} ml D10 x 0,1 g/ml = ${result.glucose.grams} g; 2 ml/kg x ${result.estimatedWeightKg} kg = ${result.glucose.d10Ml} ml D10`}
                showCalculation={showCalculations}
              />
            </dl>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}

function ResultItem({
  label,
  value,
  valueParts,
  calculation,
  showCalculation,
  initial,
  tone = "blue",
  rows
}: {
  label: string;
  value?: string;
  valueParts?: string[];
  calculation?: string;
  showCalculation?: boolean;
  initial?: string;
  tone?: ResultTone;
  rows?: Array<{ label: string; value: string; symbol?: string }>;
}) {
  const hasCalculation = showCalculation && calculation;

  return (
    <div className="h-full rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      {rows ? (
        <div className={`grid min-h-16 grid-cols-[auto_minmax(0,1fr)] items-center gap-4 ${hasCalculation ? "" : "h-full"}`}>
          {initial ? <span className={`grid size-10 shrink-0 place-items-center rounded-lg text-sm font-bold shadow-sm ${resultToneClasses[tone]}`}>{initial}</span> : null}
          <dt className="text-sm leading-snug text-slate-500 dark:text-slate-400">{label}</dt>
          <dd className="col-span-2 grid min-w-0 gap-2">
            {rows.map((row) => (
              <div key={row.label} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <span className="text-sm leading-snug text-slate-600 dark:text-slate-300">
                  {row.symbol ? <span className="mr-1 text-lg font-semibold leading-none">{row.symbol}</span> : null}
                  {row.label}
                </span>
                <span className="whitespace-nowrap text-right text-lg font-semibold leading-snug text-slate-950 dark:text-white">{row.value}</span>
              </div>
            ))}
          </dd>
        </div>
      ) : (
        <div className={`grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 ${hasCalculation ? "" : "h-full"}`}>
          {initial ? <span className={`grid size-10 shrink-0 place-items-center rounded-lg text-sm font-bold shadow-sm ${resultToneClasses[tone]}`}>{initial}</span> : null}
          <dt className="text-sm leading-snug text-slate-500 dark:text-slate-400">{label}</dt>
          <dd className="min-w-0 text-right text-lg font-semibold leading-snug text-slate-950 dark:text-white">
            {valueParts
              ? renderValueParts(valueParts)
              : value}
          </dd>
        </div>
      )}
      {hasCalculation ? (
        <dd className="mt-3 rounded-md bg-blue-50 px-3 py-2 text-sm leading-6 text-blue-950 dark:bg-blue-950/40 dark:text-blue-100">
          {formatCalculation(calculation).map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </dd>
      ) : null}
    </div>
  );
}

function renderValueParts(valueParts: string[]) {
  return valueParts.map((part) => (
    <span key={part} className="block">
      {part}
    </span>
  ));
}

function getWeightCalculation(ageYears: number, estimatedWeightKg: number) {
  if (ageYears < 1) return `0,5 x ${Math.round(ageYears * 12)} mesi + 4 = ${estimatedWeightKg} kg`;
  if (ageYears < 6) return `2 x ${ageYears} + 8 = ${estimatedWeightKg} kg`;
  return `3 x ${ageYears} + 7 = ${estimatedWeightKg} kg`;
}

function formatCalculation(calculation: string) {
  return calculation
    .replaceAll("; ", ";\n")
    .replaceAll(" (", "\n(")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function roundForDisplay(value: number) {
  return Math.round(value * 100) / 100;
}
