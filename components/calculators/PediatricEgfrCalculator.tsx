"use client";

import { useMemo, useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { WarningBox } from "@/components/ui/WarningBox";

type CreatinineUnit = "mgdl" | "umoll";
type SchwartzMode = "bedside" | "preterm" | "termInfant" | "child" | "adolescentMale";

const modes: Record<SchwartzMode, { label: string; k: number; note: string }> = {
  bedside: { label: "Schwartz bedside 2009", k: 0.413, note: "Creatinina standardizzata IDMS." },
  preterm: { label: "Classica: prematuro <1 anno", k: 0.33, note: "Coefficiente storico." },
  termInfant: { label: "Classica: nato a termine <1 anno", k: 0.45, note: "Coefficiente storico." },
  child: { label: "Classica: bambino/ragazza", k: 0.55, note: "Coefficiente storico." },
  adolescentMale: { label: "Classica: maschio adolescente", k: 0.7, note: "Coefficiente storico." }
};

export function PediatricEgfrCalculator() {
  const [heightCm, setHeightCm] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [unit, setUnit] = useState<CreatinineUnit>("mgdl");
  const [mode, setMode] = useState<SchwartzMode>("bedside");

  const result = useMemo(() => {
    const height = parseDecimal(heightCm);
    const creat = parseDecimal(creatinine);
    if (!isPositive(height) || !isPositive(creat)) return null;
    const creatMgDl = unit === "mgdl" ? creat : creat / 88.4;
    return modes[mode].k * height / creatMgDl;
  }, [creatinine, heightCm, mode, unit]);

  return (
    <CalculatorLayout
      source={
        <ul className="list-disc space-y-1 pl-5">
          <li>Schwartz GJ et al. New equations to estimate GFR in children with CKD. J Am Soc Nephrol. 2009.</li>
          <li>Formula bedside: eGFR = 0,413 x altezza(cm) / creatinina(mg/dL).</li>
        </ul>
      }
      sourceNote="La pagina indicata dall'utente rimanda all'uso della formula di Schwartz in ambito pediatrico; il calcolo qui usa creatinina in mg/dL o conversione da µmol/L."
      updatedAt="2026-07-09"
      units="mL/min/1,73 m²"
      unframed
      warningPlacement="bottom"
      warning="La stima dipende dal metodo di misura della creatinina, dalla massa muscolare e dal contesto clinico. Verificare con protocolli locali o nefrologo pediatra quando il dato orienta decisioni rilevanti."
    >
      <div className="grid gap-5">
        <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="egfr-height" label="Altezza" unit="cm" placeholder="es. 110" value={heightCm} onChange={setHeightCm} />
            <NumberField id="egfr-creatinine" label="Creatinina" unit={unit === "mgdl" ? "mg/dL" : "µmol/L"} placeholder={unit === "mgdl" ? "es. 0,6" : "es. 53"} value={creatinine} onChange={setCreatinine} />
            <label className="grid gap-2">
              <span className="text-base font-semibold text-slate-950 dark:text-white">Unità creatinina</span>
              <select value={unit} onChange={(event) => setUnit(event.target.value as CreatinineUnit)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-base text-slate-950 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                <option value="mgdl">mg/dL</option>
                <option value="umoll">µmol/L</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-base font-semibold text-slate-950 dark:text-white">Formula</span>
              <select value={mode} onChange={(event) => setMode(event.target.value as SchwartzMode)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-base text-slate-950 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                {Object.entries(modes).map(([key, option]) => <option key={key} value={key}>{option.label}</option>)}
              </select>
            </label>
          </div>
          <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
            k = {modes[mode].k}. {modes[mode].note}
          </p>
        </section>

        {result ? (
          <section className="rounded-lg border border-blue-200 bg-blue-50 p-5 text-blue-950 shadow-sm dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
            <p className="text-sm font-medium">eGFR stimato</p>
            <p className="mt-1 text-3xl font-bold">{format(result)} mL/min/1,73 m²</p>
            <p className="mt-2 text-sm leading-6">Formula: k x altezza / creatinina. Creatinina convertita in mg/dL se inserita in µmol/L.</p>
          </section>
        ) : (
          <WarningBox>Inserire altezza e creatinina per calcolare eGFR.</WarningBox>
        )}
      </div>
    </CalculatorLayout>
  );
}

function NumberField({ id, label, unit, placeholder, value, onChange }: { id: string; label: string; unit: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return (
    <label htmlFor={id} className="grid gap-2">
      <span className="text-base font-semibold text-slate-950 dark:text-white">{label}</span>
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
