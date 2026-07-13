"use client";

import { useMemo, useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { WarningBox } from "@/components/ui/WarningBox";

type FormulaKey = "mosteller" | "dubois" | "haycock";

const formulas: Array<{
  key: FormulaKey;
  label: string;
  expression: string;
  use: string;
  calculate: (heightCm: number, weightKg: number) => number;
}> = [
  {
    key: "mosteller",
    label: "Mosteller",
    expression: "sqrt(H x P / 3600)",
    use: "Standard pediatrico",
    calculate: (heightCm, weightKg) => Math.sqrt((heightCm * weightKg) / 3600)
  },
  {
    key: "dubois",
    label: "Du Bois",
    expression: "0,007184 x H^0,725 x P^0,425",
    use: "Adulti, chemio",
    calculate: (heightCm, weightKg) => 0.007184 * Math.pow(heightCm, 0.725) * Math.pow(weightKg, 0.425)
  },
  {
    key: "haycock",
    label: "Haycock",
    expression: "0,024265 x H^0,3964 x P^0,5378",
    use: "Neonatologia",
    calculate: (heightCm, weightKg) => 0.024265 * Math.pow(heightCm, 0.3964) * Math.pow(weightKg, 0.5378)
  }
];

export function BodySurfaceAreaCalculator() {
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [formulaKey, setFormulaKey] = useState<FormulaKey>("mosteller");

  const parsedWeight = parseDecimal(weightKg);
  const parsedHeight = parseDecimal(heightCm);
  const selectedFormula = formulas.find((formula) => formula.key === formulaKey) ?? formulas[0];
  const result = useMemo(() => {
    if (!isValidPositive(parsedWeight) || !isValidPositive(parsedHeight)) return null;
    return selectedFormula.calculate(parsedHeight, parsedWeight);
  }, [parsedHeight, parsedWeight, selectedFormula]);

  return (
    <CalculatorLayout
      source={
        <ul className="list-disc space-y-1 pl-5">
          <li>Mosteller RD. Simplified calculation of body-surface area. N Engl J Med. 1987.</li>
          <li>Haycock GB et al. Geometric method for measuring body surface area. J Pediatr. 1978.</li>
          <li>Du Bois D, Du Bois EF. A formula to estimate approximate surface area. Arch Intern Med. 1916.</li>
        </ul>
      }
      updatedAt="2026-07-09"
      units="m²"
      unframed
      warningPlacement="bottom"
    >
      <div className="grid gap-5">
        <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="bsa-weight" label="Peso" unit="kg" placeholder="es. 20" value={weightKg} onChange={setWeightKg} />
            <NumberField id="bsa-height" label="Altezza" unit="cm" placeholder="es. 110" value={heightCm} onChange={setHeightCm} />
          </div>
          <label className="grid gap-2">
            <span className="text-base font-semibold text-slate-950 dark:text-white">Formula</span>
            <select value={formulaKey} onChange={(event) => setFormulaKey(event.target.value as FormulaKey)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-base text-slate-950 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
              {formulas.map((formula) => <option key={formula.key} value={formula.key}>{formula.label}</option>)}
            </select>
          </label>
        </section>

        {result ? (
          <section className="rounded-lg border border-blue-200 bg-blue-50 p-5 text-blue-950 shadow-sm dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
            <p className="text-sm font-medium">Superficie corporea</p>
            <p className="mt-1 text-3xl font-bold">{formatNumber(result, 3)} m²</p>
            <p className="mt-2 text-sm leading-6">{selectedFormula.label}: {selectedFormula.expression}</p>
          </section>
        ) : (
          <WarningBox>Inserire peso e altezza per calcolare la superficie corporea.</WarningBox>
        )}

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="grid grid-cols-[1fr_1.4fr_1fr] bg-blue-50 text-sm font-bold uppercase tracking-wide text-blue-950 dark:bg-blue-950/40 dark:text-blue-100">
            <div className="px-4 py-3">Formula</div>
            <div className="px-4 py-3">Calcolo</div>
            <div className="px-4 py-3">Uso</div>
          </div>
          {formulas.map((formula) => (
            <button
              key={formula.key}
              type="button"
              onClick={() => setFormulaKey(formula.key)}
              className={`grid w-full grid-cols-[1fr_1.4fr_1fr] text-left text-sm transition ${formula.key === formulaKey ? "bg-blue-50/70 dark:bg-blue-950/30" : ""}`}
            >
              <div className="border-t border-slate-200 px-4 py-3 font-semibold text-slate-950 dark:border-slate-800 dark:text-white">{formula.label}</div>
              <div className="border-t border-slate-200 px-4 py-3 text-slate-700 dark:border-slate-800 dark:text-slate-200">{formula.expression}</div>
              <div className="border-t border-slate-200 px-4 py-3 text-slate-700 dark:border-slate-800 dark:text-slate-200">{formula.use}</div>
            </button>
          ))}
        </div>
      </div>
    </CalculatorLayout>
  );
}

function NumberField({ id, label, unit, placeholder, value, onChange }: { id: string; label: string; unit: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return (
    <label htmlFor={id} className="grid gap-2">
      <span className="text-base font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
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

function isValidPositive(value: number) {
  return Number.isFinite(value) && value > 0;
}

function formatNumber(value: number, digits: number) {
  return value.toFixed(digits).replace(".", ",");
}
