"use client";

import { useMemo, useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { WarningBox } from "@/components/ui/WarningBox";
import { calculateTransferrinSaturation } from "@/lib/calculators/transferrinSaturation";

type TransferrinUnit = "mgdl" | "gl";

export function TransferrinSaturationCalculator() {
  const [serumIron, setSerumIron] = useState("");
  const [transferrin, setTransferrin] = useState("");
  const [transferrinUnit, setTransferrinUnit] = useState<TransferrinUnit>("mgdl");

  const result = useMemo(() => {
    const serumIronMcgDl = parseDecimal(serumIron);
    const transferrinValue = parseDecimal(transferrin);
    if (!Number.isFinite(serumIronMcgDl) || serumIronMcgDl < 0 || !Number.isFinite(transferrinValue) || transferrinValue <= 0) return null;
    return calculateTransferrinSaturation({ serumIronMcgDl, transferrin: transferrinValue, transferrinUnit });
  }, [serumIron, transferrin, transferrinUnit]);

  return (
    <CalculatorLayout
      updatedAt="2026-09-05"
      sourceUpdatedOnly
      unframed
      warningPlacement="bottom"
    >
      <div className="grid gap-5">
        <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Inserire sideremia e transferrina con le unità riportate qui sotto.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="transferrin-serum-iron" label="Sideremia" unit="µg/dL" placeholder="es. 100" value={serumIron} onChange={setSerumIron} />
            <NumberField
              id="transferrin-value"
              label="Transferrina"
              unit={<select aria-label="Unità transferrina" value={transferrinUnit} onChange={(event) => setTransferrinUnit(event.target.value as TransferrinUnit)} className="h-full w-full bg-transparent px-2 text-sm font-semibold text-slate-500 outline-none dark:text-slate-400"><option value="mgdl">mg/dL</option><option value="gl">g/L</option></select>}
              placeholder={transferrinUnit === "mgdl" ? "es. 250" : "es. 2,5"}
              value={transferrin}
              onChange={setTransferrin}
            />
          </div>
          <div className="rounded-md bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <p className="font-semibold text-slate-950 dark:text-white">Formula:</p>
            <p>Saturazione della transferrina [%] = sideremia [µg/dL] / (transferrina [mg/dL] × 1,42) × 100</p>
          </div>
        </section>

        {result !== null ? (
          <>
          <section className="rounded-lg border border-blue-200 bg-blue-50 p-5 text-blue-950 shadow-sm dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
            <p className="text-sm font-medium">Saturazione della transferrina</p>
            <p className="mt-1 text-3xl font-bold">{formatPercent(result)}%</p>            {result > 100 ? <p className="mt-3 text-sm font-bold">Valore superiore al 100%: verificare unità di misura e risultato di laboratorio.</p> : <p className="mt-3 text-sm leading-6">{getInterpretation(result)}</p>}
          </section>
          <LegendBox />
          </>
        ) : <WarningBox>Inserire sideremia e transferrina per calcolare la saturazione.</WarningBox>}
      </div>
    </CalculatorLayout>
  );
}

function NumberField({ id, label, unit, placeholder, value, onChange }: { id: string; label: string; unit: React.ReactNode; placeholder: string; value: string; onChange: (value: string) => void }) {
  return <label htmlFor={id} className="grid gap-2"><span className="text-base font-semibold text-slate-950 dark:text-white">{label}</span><div className="grid grid-cols-[minmax(0,1fr)_auto] overflow-hidden rounded-md border border-slate-200 bg-white focus-within:border-blue-500 dark:border-slate-800 dark:bg-slate-950"><input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} inputMode="decimal" className="min-w-0 bg-transparent px-3 py-2 text-base text-slate-950 outline-none placeholder:text-slate-400 dark:text-white" /><span className="flex min-w-[5.25rem] items-center justify-center border-l border-slate-200 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">{unit}</span></div></label>;
}

function getInterpretation(result: number) {
  if (result < 15) return "Possibile carenza di ferro."
  if (result <= 45) return "Valore generalmente nei limiti."
  return "Possibile sovraccarico di ferro da approfondire nel contesto clinico."
}

function LegendBox() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <p className="text-sm font-semibold text-slate-950 dark:text-white">Interpretazione</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
        <li><span className="font-semibold">&lt; 15%</span> → possibile carenza di ferro</li>
        <li><span className="font-semibold">15–45%</span> → valore generalmente nei limiti</li>
        <li><span className="font-semibold">&gt; 45%</span> → possibile sovraccarico di ferro, da approfondire con il medico</li>
      </ul>
    </section>
  );
}
function parseDecimal(value: string) { return value.trim() === "" ? Number.NaN : Number(value.replace(",", ".")); }
function formatPercent(value: number) { return value.toFixed(1).replace(".", ","); }











