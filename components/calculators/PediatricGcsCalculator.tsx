"use client";

import { useMemo, useState } from "react";
import { CalculatorLayout } from "@/components/CalculatorLayout";

type AgeGroup = "infant" | "young" | "older";

const eyeOptions = [
  { score: 4, infant: "Spontanea", older: "Spontanea" },
  { score: 3, infant: "Al richiamo", older: "Al comando verbale" },
  { score: 2, infant: "Al dolore", older: "Al dolore" },
  { score: 1, infant: "Nessuna risposta", older: "Nessuna risposta" }
];

const motorOptions = [
  { score: 6, infant: "Movimento spontaneo normale", older: "Obbedisce ai comandi" },
  { score: 5, infant: "Localizza il dolore / si ritrae al tatto", older: "Localizza il dolore" },
  { score: 4, infant: "Si ritrae al dolore", older: "Flette / allontana dal dolore" },
  { score: 3, infant: "Flessione decorticata", older: "Flessione decorticata" },
  { score: 2, infant: "Estensione decerebrata", older: "Estensione decerebrata" },
  { score: 1, infant: "Nessuna risposta", older: "Nessuna risposta" }
];

const verbalOptions = [
  { score: 5, infant: "Vocalizza, sorride, lalla", young: "Parole/frasi appropriate", older: "Orientato, conversa" },
  { score: 4, infant: "Pianto consolabile", young: "Parole inappropriate", older: "Disorientato, conversa" },
  { score: 3, infant: "Pianto persistente", young: "Pianto / grida persistenti", older: "Parole inappropriate" },
  { score: 2, infant: "Irrequieto / suoni incomprensibili", young: "Grugniti", older: "Suoni incomprensibili" },
  { score: 1, infant: "Nessuna risposta", young: "Nessuna risposta", older: "Nessuna risposta" }
];

export function PediatricGcsCalculator() {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("older");
  const [eye, setEye] = useState(4);
  const [motor, setMotor] = useState(6);
  const [verbal, setVerbal] = useState(5);
  const total = eye + motor + verbal;
  const interpretation = useMemo(() => {
    if (total <= 8) return "Compromissione severa: valutazione urgente delle vie aeree e del contesto clinico.";
    if (total <= 12) return "Compromissione moderata: monitoraggio stretto e rivalutazione frequente.";
    return "Compromissione lieve o assente secondo il punteggio, da integrare con esame clinico.";
  }, [total]);

  return (
    <CalculatorLayout
      title="GCS pediatrico rapido"
      description="Calcolo rapido della Glasgow Coma Scale pediatrica: apertura occhi, risposta motoria e risposta verbale."
      source="Adattamento della Pediatric Glasgow Coma Scale."
      updatedAt="2026-07-09"
      validity="Punteggio totale 3-15"
      unframed
      warningPlacement="bottom"
      warning="Usare il punteggio come supporto alla valutazione clinica. Considerare sedazione, intubazione, crisi convulsive, ipoglicemia, trauma e altre cause correggibili."
    >
      <div className="grid gap-5">
        <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <label className="grid gap-2">
            <span className="text-base font-semibold text-slate-950 dark:text-white">Fascia d&apos;età per risposta verbale</span>
            <select value={ageGroup} onChange={(event) => setAgeGroup(event.target.value as AgeGroup)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-base text-slate-950 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
              <option value="infant">0-23 mesi</option>
              <option value="young">2-5 anni</option>
              <option value="older">&gt; 5 anni</option>
            </select>
          </label>
        </section>

        <ScoreGroup title="Apertura occhi" value={eye} onChange={setEye} options={eyeOptions.map((option) => ({ score: option.score, label: ageGroup === "infant" ? option.infant : option.older }))} />
        <ScoreGroup title="Risposta motoria" value={motor} onChange={setMotor} options={motorOptions.map((option) => ({ score: option.score, label: ageGroup === "infant" ? option.infant : option.older }))} />
        <ScoreGroup title="Risposta verbale" value={verbal} onChange={setVerbal} options={verbalOptions.map((option) => ({ score: option.score, label: option[ageGroup] }))} />

        <section className="rounded-lg border border-blue-200 bg-blue-50 p-5 text-blue-950 shadow-sm dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
          <p className="text-sm font-medium">Punteggio totale</p>
          <p className="mt-1 text-4xl font-bold">{total}/15</p>
          <p className="mt-2 text-sm leading-6">{interpretation}</p>
        </section>
      </div>
    </CalculatorLayout>
  );
}

function ScoreGroup({ title, value, onChange, options }: { title: string; value: number; onChange: (value: number) => void; options: Array<{ score: number; label: string }> }) {
  return (
    <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-slate-950 dark:text-white">{title}</h3>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-100">{value}</span>
      </div>
      <div className="grid gap-2">
        {options.map((option) => (
          <label key={option.score} className={`grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md border p-3 transition ${value === option.score ? "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950" : "border-slate-200 bg-white hover:border-blue-200 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900"}`}>
            <input type="radio" name={title} checked={value === option.score} onChange={() => onChange(option.score)} className="size-4 accent-blue-700" />
            <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{option.label}</span>
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{option.score}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
