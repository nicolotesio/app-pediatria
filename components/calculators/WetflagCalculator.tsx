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
      title="Calcolatore WETFLAG"
      description="Stime rapide per emergenza pediatrica basate su eta. I valori sono un supporto iniziale e non sostituiscono peso reale, protocolli locali e giudizio clinico."
      source={wetflagMetadata.source}
      updatedAt={wetflagMetadata.updatedAt}
      validity={wetflagMetadata.validity}
      units={wetflagMetadata.units}
    >
      <div className="grid gap-5">
        <AgeWeightSelector value={selectorValue} onChange={setSelectorValue} />

        {!result ? (
          <WarningBox>Selezionare eta e peso validi per visualizzare i risultati.</WarningBox>
        ) : (
          <div className="grid gap-4">
            <ClinicalNotice
              title="Neonati e basso peso"
              text="Eta inferiore a 1 anno o peso inferiore a 10 kg: considerare linee guida neonatali ALS o fare riferimento a RCUK."
            />
            <ClinicalNotice
              title="Bambini grandi e adolescenti"
              text="Nei bambini con peso corporeo elevato, considerare il dosaggio sul peso ideale per i farmaci idrofili. Per eta superiore a 12 anni possono essere utilizzati algoritmi per adulti, secondo giudizio clinico."
            />
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
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Riepilogo</h3>
              <p className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
                Eta: {result.ageYears} anni | Peso: {result.estimatedWeightKg} kg
              </p>
            </div>
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

function ClinicalNotice({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sky-950 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100">
      <div className="flex items-start gap-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-sky-200 text-sm font-bold text-sky-950 dark:bg-sky-900 dark:text-sky-100">i</span>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-6">{text}</p>
        </div>
      </div>
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
