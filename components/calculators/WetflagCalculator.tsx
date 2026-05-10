"use client";

import { useMemo, useState } from "react";
import { calculateWetflag, wetflagMetadata } from "@/lib/calculators/wetflag";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { AgeWeightSelector, estimatePediatricWeightKg, type AgeWeightValue } from "@/components/calculators/AgeWeightSelector";
import { WarningBox } from "@/components/ui/WarningBox";

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
    >
      <div className="grid gap-5">
        <AgeWeightSelector value={selectorValue} onChange={setSelectorValue} />

        {!result ? (
          <WarningBox>Selezionare età e peso validi per visualizzare i risultati.</WarningBox>
        ) : (
          <div className="grid gap-4">
            <SummaryCard result={result} estimateWeightFromAge={selectorValue.estimateWeightFromAge} />
            {result.warnings.map((warning) => (
              <WarningBox key={warning}>{warning}</WarningBox>
            ))}
            <label className="flex w-fit items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
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
                calculation={selectorValue.estimateWeightFromAge ? `(${result.ageYears} + 4) x 2 = ${result.estimatedWeightKg} kg` : "Peso inserito manualmente."}
                showCalculation={showCalculations}
              />
              <ResultItem
                initial="E"
                tone="amber"
                label="Energia defibrillazione (iniziale)"
                value={`${result.defibrillationEnergyJ} J`}
                calculation={`4 J/kg x ${result.estimatedWeightKg} kg = ${result.defibrillationEnergyJ} J (max 12-200 J sulla base del tipo di defibrillatore)`}
                showCalculation={showCalculations}
              />
              <ResultItem
                initial="T"
                tone="red"
                label="Tubo ET cuffiato"
                value={`${result.endotrachealTubeMm.cuffed} mm ID`}
                calculation={`${result.ageYears} / 4 + 3,5 = ${result.endotrachealTubeMm.cuffed} mm ID`}
                showCalculation={showCalculations}
              />
              <ResultItem
                initial="T"
                tone="red"
                label="Tubo ET non cuffiato"
                value={`${result.endotrachealTubeMm.uncuffed} mm ID`}
                calculation={`${result.ageYears} / 4 + 4 = ${result.endotrachealTubeMm.uncuffed} mm ID`}
                showCalculation={showCalculations}
              />
              <ResultItem
                initial="F"
                tone="cyan"
                label="Fluid bolus"
                value={`10 ml/kg: ${result.fluidBolusOptionsMl.tenPerKg} ml; 20 ml/kg: ${result.fluidBolusOptionsMl.twentyPerKg} ml`}
                calculation={`10 ml/kg x ${result.estimatedWeightKg} kg = ${Math.round(10 * result.estimatedWeightKg)} ml, max 500 ml -> ${result.fluidBolusOptionsMl.tenPerKg} ml; 20 ml/kg x ${result.estimatedWeightKg} kg = ${Math.round(20 * result.estimatedWeightKg)} ml, max 500 ml -> ${result.fluidBolusOptionsMl.twentyPerKg} ml`}
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
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
              <h3 className="font-semibold text-slate-950 dark:text-white">Note di sicurezza</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {result.safetyNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}

function SummaryCard({ result, estimateWeightFromAge }: { result: NonNullable<ReturnType<typeof calculateWetflag>>; estimateWeightFromAge: boolean }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Riepilogo</h3>
      <p className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
        Età: {result.ageYears} anni | Peso: {result.estimatedWeightKg} kg
      </p>
      {estimateWeightFromAge ? (
        <p className="mt-3 border-t border-slate-200 pt-3 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
          Peso calcolato con formula: (età + 4) x 2.
        </p>
      ) : null}
    </div>
  );
}

type ResultTone = "blue" | "amber" | "red" | "cyan" | "violet" | "green";

const resultToneClasses: Record<ResultTone, string> = {
  blue: "bg-blue-600 text-white",
  amber: "bg-amber-600 text-white",
  red: "bg-red-600 text-white",
  cyan: "bg-cyan-600 text-white",
  violet: "bg-violet-600 text-white",
  green: "bg-emerald-600 text-white"
};

function ResultItem({
  label,
  value,
  calculation,
  showCalculation,
  initial,
  tone = "blue",
  note
}: {
  label: string;
  value: string;
  calculation?: string;
  showCalculation?: boolean;
  initial?: string;
  tone?: ResultTone;
  note?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start gap-3">
        {initial ? <span className={`grid size-8 shrink-0 place-items-center rounded-lg text-sm font-bold shadow-sm ${resultToneClasses[tone]}`}>{initial}</span> : null}
        <div className="min-w-0">
          <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
          <dd className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">{value}</dd>
          {note ? <dd className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{note}</dd> : null}
        </div>
      </div>
      {showCalculation && calculation ? (
        <dd className="mt-3 rounded-md bg-blue-50 px-3 py-2 text-sm leading-6 text-blue-950 dark:bg-blue-950/40 dark:text-blue-100">
          {calculation}
        </dd>
      ) : null}
    </div>
  );
}

function roundForDisplay(value: number) {
  return Math.round(value * 100) / 100;
}
