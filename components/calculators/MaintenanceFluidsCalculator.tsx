"use client";

import { useMemo, useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { WarningBox } from "@/components/ui/WarningBox";
import { calculateHollidaySegarMaintenance } from "@/lib/calculators/maintenanceFluids";

const MAX_USUAL_MAINTENANCE_ML_DAY = 2000;

export function MaintenanceFluidsCalculator() {
  const [weightKg, setWeightKg] = useState("");
  const weight = parseDecimal(weightKg);
  const result = useMemo(
    () => (Number.isFinite(weight) && weight > 0 ? calculateHollidaySegarMaintenance(weight) : null),
    [weight]
  );

  return (
    <CalculatorLayout
      source="Holliday MA, Segar WE. The maintenance need for water in parenteral fluid therapy. Pediatrics. 1957."
      updatedAt="2026-10-07"
      sourceTitle="Riferimenti bibliografici"
      unframed
      warningPlacement="bottom"
    >
      <div className="grid gap-5">
        <section className="grid gap-4">
          <label htmlFor="maintenance-weight" className="grid w-full gap-2">
            <span className="text-base font-semibold text-slate-950 dark:text-white">Peso</span>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] overflow-hidden rounded-md border border-slate-200 bg-white focus-within:border-blue-500 dark:border-slate-800 dark:bg-slate-950">
              <input
                id="maintenance-weight"
                value={weightKg}
                onChange={(event) => setWeightKg(event.target.value)}
                placeholder="es. 12"
                inputMode="decimal"
                className="min-w-0 bg-transparent px-3 py-2 text-base text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
              />
              <span className="flex min-w-20 items-center justify-center border-l border-slate-200 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">kg</span>
            </div>
          </label>


        </section>

        {result ? (
          <section className="rounded-lg border border-blue-200 bg-blue-50 p-5 text-blue-950 shadow-sm dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
            <p className="text-sm font-medium">Mantenimento idrico stimato</p>
            <p className="mt-1 text-3xl font-bold">{formatNumber(result.mlDay)} mL/24 h</p>
            <p className="mt-2 text-sm font-semibold">{formatNumber(result.mlHour)} mL/h</p>
          </section>
        ) : (
          <WarningBox tone={weightKg.trim() === "" ? "info" : "warning"}>Inserire un peso valido in kg per calcolare il mantenimento.</WarningBox>
        )}

        {result && result.mlDay > MAX_USUAL_MAINTENANCE_ML_DAY ? (
          <WarningBox>
            Il valore teorico supera {formatNumber(MAX_USUAL_MAINTENANCE_ML_DAY)} mL/24 h ({formatNumber(round1(MAX_USUAL_MAINTENANCE_ML_DAY / 24))} mL/h), tetto abitualmente usato per il mantenimento: la formula di Holliday–Segar sovrastima il fabbisogno nei pesi elevati. Valutare di non superarlo.
          </WarningBox>
        ) : null}
          <details className="rounded-md bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <summary className="cursor-pointer font-medium">Formula di Holliday–Segar</summary>
            <p>100 mL/kg/24 h per i primi 10 kg + 50 mL/kg/24 h per i successivi 10 kg + 20 mL/kg/24 h oltre i 20 kg.</p>
          </details>
      </div>
    </CalculatorLayout>
  );
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function parseDecimal(value: string) {
  return value.trim() === "" ? Number.NaN : Number(value.replace(",", "."));
}

function formatNumber(value: number) {
  return value.toLocaleString("it-IT", { maximumFractionDigits: 1 });
}
