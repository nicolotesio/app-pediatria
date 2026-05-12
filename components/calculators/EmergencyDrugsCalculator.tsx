"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { calculateEmergencyDrugs, type DrugSection } from "@/lib/calculators/emergencyDrugs";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { AgeWeightSelector, estimatePediatricWeightKg, type AgeWeightValue } from "@/components/calculators/AgeWeightSelector";
import { WarningBox } from "@/components/ui/WarningBox";

const sectionToneClasses: Record<DrugSection["tone"], string> = {
  blue: "text-blue-700 dark:text-blue-300",
  amber: "text-amber-700 dark:text-amber-300",
  cyan: "text-cyan-700 dark:text-cyan-300",
  yellow: "text-yellow-600 dark:text-yellow-300",
  indigo: "text-indigo-700 dark:text-indigo-300",
  green: "text-emerald-700 dark:text-emerald-300"
};

export function EmergencyDrugsCalculator() {
  const [selectorValue, setSelectorValue] = useState<AgeWeightValue>({
    ageYears: 4,
    weightKg: estimatePediatricWeightKg(4),
    estimateWeightFromAge: true
  });
  const [showCalculations, setShowCalculations] = useState(false);

  const result = useMemo(() => {
    try {
      return calculateEmergencyDrugs(selectorValue.ageYears, selectorValue.weightKg);
    } catch {
      return null;
    }
  }, [selectorValue]);

  return (
    <CalculatorLayout
      unframed
      showSource={false}
      warning="Calcoli rapidi per emergenza pediatrica. Confermare sempre peso reale, dosaggi, concentrazioni disponibili, protocolli locali e valutazione clinica prima della somministrazione."
    >
      <div className="grid gap-5">
        <AgeWeightSelector value={selectorValue} onChange={setSelectorValue} ageMin={0.5} />

        {!result ? (
          <WarningBox>Selezionare età e peso validi per visualizzare i risultati.</WarningBox>
        ) : (
          <div className="grid gap-4">
            <label className="flex w-fit cursor-pointer items-center gap-3 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800 shadow-sm transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-100 dark:hover:bg-blue-950">
              <input
                type="checkbox"
                checked={showCalculations}
                onChange={(event) => setShowCalculations(event.target.checked)}
                className="size-4 rounded border-slate-300 accent-blue-600"
              />
              Mostra calcoli
            </label>

            <div className="grid gap-5">
              {result.sections.map((section) => (
                <DrugSectionCard key={section.id} section={section} showCalculations={showCalculations} />
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}

function DrugSectionCard({ section, showCalculations }: { section: DrugSection; showCalculations: boolean }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="grid gap-3">
      <button type="button" onClick={() => setIsOpen((value) => !value)} className="flex items-center justify-between gap-3 text-left">
        <h2 className={`text-xl font-bold leading-tight sm:text-2xl ${sectionToneClasses[section.tone]}`}>{section.title}</h2>
        <ChevronDown className={`size-6 shrink-0 transition ${isOpen ? "" : "-rotate-90"} ${sectionToneClasses[section.tone]}`} />
      </button>
      {isOpen ? <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {section.rows.map((row) => (
            <div key={row.label} className="grid gap-2 py-3 first:pt-0 last:pb-0">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <h3 className="min-w-0 text-base font-semibold leading-6 text-slate-950 sm:text-lg dark:text-white">{row.label}</h3>
                <p className="whitespace-nowrap text-right text-lg font-bold leading-6 text-slate-950 sm:text-xl dark:text-white">{row.value}</p>
              </div>
              {row.note ? <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{row.note}</p> : null}
            </div>
          ))}
        </div>

        {section.notes?.length ? (
          <div className="mt-3 grid gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
            {section.notes.map((note) => (
              <p key={note} className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                {note}
              </p>
            ))}
          </div>
        ) : null}

        {showCalculations ? (
          <div className="mt-3 rounded-md bg-blue-50 px-3 py-2 text-sm leading-6 text-blue-950 dark:bg-blue-950/40 dark:text-blue-100">
            {section.calculations.map((calculation) => (
              <span key={calculation} className="block">
                {calculation}
              </span>
            ))}
          </div>
        ) : null}
      </div> : null}
    </section>
  );
}
