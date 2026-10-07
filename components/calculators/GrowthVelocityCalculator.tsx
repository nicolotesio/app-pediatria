"use client";

import { useMemo, useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { WarningBox } from "@/components/ui/WarningBox";

const daysPerMonth = 30.4375;
const daysPerYear = 365.25;

export function GrowthVelocityCalculator() {
  const [date1, setDate1] = useState("");
  const [height1Cm, setHeight1Cm] = useState("");
  const [date2, setDate2] = useState("");
  const [height2Cm, setHeight2Cm] = useState("");

  const result = useMemo(() => {
    const firstDate = parseDate(date1);
    const secondDate = parseDate(date2);
    const firstHeight = parseDecimal(height1Cm);
    const secondHeight = parseDecimal(height2Cm);
    if (!firstDate || !secondDate || !Number.isFinite(firstHeight) || !Number.isFinite(secondHeight)) return null;

    const intervalDays = (secondDate.getTime() - firstDate.getTime()) / (24 * 60 * 60 * 1000);
    const heightDelta = secondHeight - firstHeight;
    if (intervalDays <= 0) return { error: "La misurazione successiva deve avere una data posteriore alla precedente." };
    if (heightDelta < 0) return { error: "L'altezza successiva non può essere inferiore alla precedente." };

    return {
      intervalMonths: intervalDays / daysPerMonth,
      heightDelta,
      velocity: heightDelta / (intervalDays / daysPerYear),
      shortInterval: intervalDays < daysPerMonth * 3
    };
  }, [date1, date2, height1Cm, height2Cm]);

  return (
    <CalculatorLayout updatedAt="2026-10-07" unframed warningPlacement="bottom">
      <div className="grid gap-5">
        <section className="grid gap-4">
          <h3 className="text-base font-bold text-rose-700 dark:text-rose-300">Misurazione precedente</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <DateField id="growth-date-1" label="Data" value={date1} onChange={setDate1} />
            <NumberField id="growth-height-1" label="Altezza" unit="cm" placeholder="es. 93,0" value={height1Cm} onChange={setHeight1Cm} />
          </div>
        </section>

        <section className="grid gap-4">
          <h3 className="text-base font-bold text-rose-700 dark:text-rose-300">Misurazione successiva</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <DateField id="growth-date-2" label="Data" value={date2} onChange={setDate2} />
            <NumberField id="growth-height-2" label="Altezza" unit="cm" placeholder="es. 99,5" value={height2Cm} onChange={setHeight2Cm} />
          </div>
        </section>

        {result && "error" in result ? <WarningBox>{result.error}</WarningBox> : null}
        {result && !("error" in result) ? (
          <>
            <section className="grid gap-4 rounded-lg border border-blue-200 bg-blue-50 p-5 text-blue-950 shadow-sm dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100 sm:grid-cols-3">
              <Result label="Velocità" value={format(result.velocity) + " cm/anno"} />
              <Result label="Delta altezza" value={format(result.heightDelta) + " cm"} />
              <Result label="Intervallo" value={format(result.intervalMonths) + " mesi"} />
            </section>
            {result.shortInterval ? <WarningBox>Intervallo inferiore a 3 mesi: il calcolo potrebbe non essere così affidabile.</WarningBox> : null}
          </>
        ) : null}
      </div>
    </CalculatorLayout>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return <div><p className="text-sm font-medium">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>;
}

function DateField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return <label htmlFor={id} className="grid gap-2"><span className="text-base font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span><input id={id} type="date" value={value} onChange={(event) => onChange(event.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-base text-slate-950 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white" /></label>;
}

function NumberField({ id, label, unit, placeholder, value, onChange }: { id: string; label: string; unit: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return <label htmlFor={id} className="grid gap-2"><span className="text-base font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span><div className="grid grid-cols-[minmax(0,1fr)_auto] overflow-hidden rounded-md border border-slate-200 bg-white focus-within:border-blue-500 dark:border-slate-800 dark:bg-slate-950"><input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} inputMode="decimal" className="min-w-0 bg-transparent px-3 py-2 text-base text-slate-950 outline-none placeholder:text-slate-400 dark:text-white" /><span className="border-l border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">{unit}</span></div></label>;
}

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value + "T00:00:00Z");
  return Number.isNaN(date.getTime()) ? null : date;
}
function parseDecimal(value: string) { return value.trim() === "" ? Number.NaN : Number(value.replace(",", ".")); }
function format(value: number) { return value.toFixed(1).replace(".", ","); }
