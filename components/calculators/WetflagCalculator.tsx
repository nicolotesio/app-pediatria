"use client";

import { useMemo, useState } from "react";
import { calculateWetflag, wetflagMetadata } from "@/lib/calculators/wetflag";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { WarningBox } from "@/components/ui/WarningBox";

export function WetflagCalculator() {
  const [age, setAge] = useState("4");

  const result = useMemo(() => {
    const parsed = Number(age.replace(",", "."));
    if (age.trim() === "" || Number.isNaN(parsed)) return null;
    try {
      return calculateWetflag(parsed);
    } catch {
      return null;
    }
  }, [age]);

  return (
    <CalculatorLayout
      title="Calcolatore WETFLAG"
      description="Stime rapide per emergenza pediatrica basate su eta. I valori sono un supporto iniziale e non sostituiscono peso reale, protocolli locali e giudizio clinico."
      source={wetflagMetadata.source}
      updatedAt={wetflagMetadata.updatedAt}
      validity={wetflagMetadata.validity}
      units={wetflagMetadata.units}
    >
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">Eta in anni</span>
          <input
            inputMode="decimal"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            className="max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-3 text-base outline-none ring-teal-600 focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        {!result ? (
          <WarningBox>Inserire un numero valido per visualizzare i risultati.</WarningBox>
        ) : (
          <div className="grid gap-4">
            {result.warnings.map((warning) => (
              <WarningBox key={warning}>{warning}</WarningBox>
            ))}
            <dl className="grid gap-3 sm:grid-cols-2">
              <ResultItem label="Peso stimato" value={`${result.estimatedWeightKg} kg`} />
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

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">{value}</dd>
    </div>
  );
}
