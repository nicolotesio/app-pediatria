"use client";

import { useMemo, useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { WarningBox } from "@/components/ui/WarningBox";

type Sex = "male" | "female";

export function TargetHeightCalculator() {
  const [motherHeight, setMotherHeight] = useState("");
  const [fatherHeight, setFatherHeight] = useState("");
  const [sex, setSex] = useState<Sex>("male");

  const result = useMemo(() => {
    const mother = parseDecimal(motherHeight);
    const father = parseDecimal(fatherHeight);
    if (!isPositive(mother) || !isPositive(father)) return null;
    const target = sex === "male" ? (father + mother + 13) / 2 : (father + mother - 13) / 2;
    return {
      target
    };
  }, [fatherHeight, motherHeight, sex]);

  return (
    <CalculatorLayout
      source="Formula di Tanner per altezza bersaglio familiare."
      updatedAt="2026-07-09"
      units="cm"
      unframed
      warningPlacement="bottom"
    >
      <div className="grid gap-5">
        <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="target-mother" label="Altezza madre" unit="cm" placeholder="es. 162" value={motherHeight} onChange={setMotherHeight} />
            <NumberField id="target-father" label="Altezza padre" unit="cm" placeholder="es. 175" value={fatherHeight} onChange={setFatherHeight} />
            <label className="grid gap-2">
              <span className="text-base font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Sesso del bambino</span>
              <select value={sex} onChange={(event) => setSex(event.target.value as Sex)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-base text-slate-950 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                <option value="male">Maschio</option>
                <option value="female">Femmina</option>
              </select>
            </label>
          </div>
          <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
            Maschio: (H padre + H madre + 13) / 2. Femmina: (H padre + H madre - 13) / 2.
          </p>
        </section>

        {result ? (
          <section className="rounded-lg border border-blue-200 bg-blue-50 p-5 text-blue-950 shadow-sm dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
            <Result label="Altezza bersaglio" value={`${format(result.target)} cm +- 8,5 cm`} />
          </section>
        ) : (
          <WarningBox>Inserire altezza di madre e padre per calcolare l&apos;altezza bersaglio.</WarningBox>
        )}
      </div>
    </CalculatorLayout>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function NumberField({ id, label, unit, placeholder, value, onChange, optional = false }: { id: string; label: string; unit: string; placeholder: string; value: string; onChange: (value: string) => void; optional?: boolean }) {
  return (
    <label htmlFor={id} className="grid gap-2">
      <span className="text-base font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label} {optional ? <span className="font-normal normal-case">(opzionale)</span> : null}</span>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] overflow-hidden rounded-md border border-slate-200 bg-white focus-within:border-blue-500 dark:border-slate-800 dark:bg-slate-950">
        <input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} inputMode="decimal" className="min-w-0 bg-transparent px-3 py-2 text-base text-slate-950 outline-none placeholder:text-slate-400 dark:text-white" />
        <span className="border-l border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">{unit}</span>
      </div>
    </label>
  );
}

function parseDecimal(value: string) {
  if (value.trim() === "") return Number.NaN;
  return Number(value.replace(",", "."));
}

function isPositive(value: number) {
  return Number.isFinite(value) && value > 0;
}

function format(value: number) {
  return value.toFixed(1).replace(".", ",");
}
