"use client";

import { useMemo, useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { WarningBox } from "@/components/ui/WarningBox";

export function GrowthVelocityCalculator() {
  const [age1Months, setAge1Months] = useState("");
  const [height1Cm, setHeight1Cm] = useState("");
  const [age2Months, setAge2Months] = useState("");
  const [height2Cm, setHeight2Cm] = useState("");

  const result = useMemo(() => {
    const a1 = parseDecimal(age1Months);
    const h1 = parseDecimal(height1Cm);
    const a2 = parseDecimal(age2Months);
    const h2 = parseDecimal(height2Cm);
    if (![a1, h1, a2, h2].every(isFiniteNumber)) return null;
    const intervalMonths = a2 - a1;
    const heightDelta = h2 - h1;
    if (intervalMonths <= 0) return { error: "La seconda misurazione deve essere successiva alla prima." };
    if (heightDelta < 0) return { error: "La seconda altezza non può essere inferiore alla prima." };
    return {
      intervalMonths,
      heightDelta,
      velocity: heightDelta / (intervalMonths / 12),
      shortInterval: intervalMonths < 3
    };
  }, [age1Months, age2Months, height1Cm, height2Cm]);

  return (
    <CalculatorLayout
      source="Velocità = delta altezza / delta tempo, espressa in cm/anno."
      updatedAt="2026-07-09"
      units="cm/anno"
      unframed
      warningPlacement="bottom"
    >
      <div className="grid gap-5">
        <section className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
          <p className="font-semibold">Come compilare</p>
          <p className="mt-1">Misurazione 1: età in mesi e altezza precedente. Misurazione 2: età in mesi e altezza attuale. Un intervallo di almeno 3-6 mesi rende il calcolo più affidabile.</p>
        </section>

        <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-base font-bold text-rose-700 dark:text-rose-300">Misurazione 1 (precedente)</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="growth-age-1" label="Data / età" unit="mesi" placeholder="es. 36" value={age1Months} onChange={setAge1Months} />
            <NumberField id="growth-height-1" label="Altezza" unit="cm" placeholder="es. 93,0" value={height1Cm} onChange={setHeight1Cm} />
          </div>
        </section>

        <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-base font-bold text-rose-700 dark:text-rose-300">Misurazione 2 (attuale)</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="growth-age-2" label="Data / età" unit="mesi" placeholder="es. 48" value={age2Months} onChange={setAge2Months} />
            <NumberField id="growth-height-2" label="Altezza" unit="cm" placeholder="es. 99,5" value={height2Cm} onChange={setHeight2Cm} />
          </div>
        </section>

        {result && "error" in result ? <WarningBox>{result.error}</WarningBox> : null}
        {result && !("error" in result) ? (
          <section className="grid gap-4 rounded-lg border border-blue-200 bg-blue-50 p-5 text-blue-950 shadow-sm dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100 sm:grid-cols-3">
            <Result label="Velocità" value={`${format(result.velocity)} cm/anno`} />
            <Result label="Delta altezza" value={`${format(result.heightDelta)} cm`} />
            <Result label="Intervallo" value={`${format(result.intervalMonths)} mesi`} />
            {result.shortInterval ? <p className="sm:col-span-3 text-sm leading-6">Intervallo inferiore a 3 mesi: interpretare con cautela.</p> : null}
          </section>
        ) : null}
        {!result ? <WarningBox>Inserire entrambe le misurazioni per calcolare la velocità di crescita.</WarningBox> : null}
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

function isFiniteNumber(value: number) {
  return Number.isFinite(value);
}

function format(value: number) {
  return value.toFixed(1).replace(".", ",");
}
