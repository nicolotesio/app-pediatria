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
            <dl className="grid gap-3 sm:grid-cols-2">
              <ResultItem label="Peso" value={`${result.estimatedWeightKg} kg`} />
              <ResultItem label="Energia defibrillazione" value={`${result.defibrillationEnergyJ} J`} />
              <ResultItem label="Tubo ET cuffiato" value={`${result.endotrachealTubeMm.cuffed} mm ID`} />
              <ResultItem label="Tubo ET non cuffiato" value={`${result.endotrachealTubeMm.uncuffed} mm ID`} />
              <ResultItem label="Fluid bolus" value={`${result.fluidBolusMl} ml`} />
              <ResultItem label="Adrenalina" value={`${result.adrenaline.micrograms} microg; ${result.adrenaline.mlOfOneInTenThousand} ml di 1:10.000`} />
              <ResultItem label="Glucosio" value={`${result.glucose.grams} g; ${result.glucose.d10Ml} ml D10`} />
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

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">{value}</dd>
    </div>
  );
}
