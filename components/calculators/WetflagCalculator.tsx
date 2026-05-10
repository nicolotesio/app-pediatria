"use client";

import { useMemo, useState } from "react";
import { calculateWetflag, wetflagMetadata } from "@/lib/calculators/wetflag";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { AgeWeightSelector, estimatePediatricWeightKg, type AgeWeightValue } from "@/components/calculators/AgeWeightSelector";
import { WarningBox } from "@/components/ui/WarningBox";

type ResultTone = "blue" | "amber" | "red" | "cyan" | "violet" | "green";

const resultToneClasses: Record<ResultTone, string> = {
  blue: "bg-blue-600 text-white",
  amber: "bg-amber-600 text-white",
  red: "bg-red-600 text-white",
  cyan: "bg-cyan-600 text-white",
  violet: "bg-violet-600 text-white",
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
      warning="Stime rapide per emergenza pediatrica. Verificare sempre peso reale, concentrazioni disponibili, protocolli locali e risposta clinica prima di somministrare farmaci, fluidi o energia."
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
                label="Energia defibrillazione (iniziale)"
                value={`${result.defibrillationEnergyJ} J`}
                calculation={`4 J/kg x ${result.estimatedWeightKg} kg = ${result.defibrillationEnergyJ} J (max 120-200 J sulla base del tipo di defibrillatore)`}
                showCalculation={showCalculations}
              />
              <ResultItem
                initial="T"
                tone="red"
                label="Tubo ET"
                value={`Cuffiato: ${result.endotrachealTubeMm.cuffed} mm ID; non cuffiato: ${result.endotrachealTubeMm.uncuffed} mm ID; profondità orale: ${result.endotrachealTubeMm.oralDepthCm} cm`}
                rows={[
                  { label: "Cuffiato", value: `${result.endotrachealTubeMm.cuffed} mm ID` },
                  { label: "Non cuffiato", value: `${result.endotrachealTubeMm.uncuffed} mm ID` },
                  { label: "Profondità orale", value: `${result.endotrachealTubeMm.oralDepthCm} cm` }
                ]}
                calculation={`${result.ageYears} / 4 + 3,5 = ${result.endotrachealTubeMm.cuffed} mm ID cuffiato; ${result.ageYears} / 4 + 4 = ${result.endotrachealTubeMm.uncuffed} mm ID non cuffiato; ${result.ageYears} / 2 + 12 = ${result.endotrachealTubeMm.oralDepthCm} cm profondità orale`}
                showCalculation={showCalculations}
              />
              <ResultItem
                initial="F"
                tone="cyan"
                label="Fluid bolus"
                value={`Emergenza medica: ${result.fluidBolusOptionsMl.twentyPerKg} ml; trauma: ${result.fluidBolusOptionsMl.tenPerKg} ml`}
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
                tone="red"
                label="Adrenalina"
                value={`${result.adrenaline.micrograms} µg; ${result.adrenaline.mlOfOneInTenThousand} ml di 1:10.000`}
                note="Da ripetere ogni 3-5 minuti."
                calculation={`10 µg/kg x ${result.estimatedWeightKg} kg = ${result.adrenaline.micrograms} µg; 0,1 ml/kg x ${result.estimatedWeightKg} kg = ${result.adrenaline.mlOfOneInTenThousand} ml`}
                showCalculation={showCalculations}
              />
              <ResultItem
                initial="G"
                tone="green"
                label="Glucosio"
                value={`${result.glucose.grams} g; ${result.glucose.d10Ml} ml D10`}
                calculation={`2 ml/kg x ${result.estimatedWeightKg} kg = ${result.glucose.d10Ml} ml D10; ${result.glucose.d10Ml} ml x 0,1 g/ml = ${result.glucose.grams} g`}
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
  calculation,
  showCalculation,
  initial,
  tone = "blue",
  note,
  rows
}: {
  label: string;
  value: string;
  calculation?: string;
  showCalculation?: boolean;
  initial?: string;
  tone?: ResultTone;
  note?: string;
  rows?: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-3">
        {initial ? <span className={`grid size-8 shrink-0 place-items-center rounded-lg text-sm font-bold shadow-sm ${resultToneClasses[tone]}`}>{initial}</span> : null}
        <div className="min-w-0 flex-1">
          {rows ? (
            <>
              <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
              <dd className="mt-2 grid gap-2">
                {rows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-600 dark:text-slate-300">{row.label}</span>
                    <span className="text-right text-lg font-semibold text-slate-950 dark:text-white">{row.value}</span>
                  </div>
                ))}
              </dd>
            </>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
              <dd className="text-right text-lg font-semibold text-slate-950 dark:text-white">{value}</dd>
            </div>
          )}
          {note ? <dd className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{note}</dd> : null}
        </div>
      </div>
      {showCalculation && calculation ? (
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

function getWeightCalculation(ageYears: number, estimatedWeightKg: number) {
  if (ageYears <= 5) return `2 x ${ageYears} + 8 = ${estimatedWeightKg} kg`;
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
