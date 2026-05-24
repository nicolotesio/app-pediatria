"use client";

import { useState } from "react";
import type React from "react";
import { AlertTriangle, Calculator, Droplets, Gauge, HelpCircle, ShieldAlert, Waves, X } from "lucide-react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { WarningBox } from "@/components/ui/WarningBox";
import {
  calculateMaintenanceFluids,
  formatResults,
  hydrationStatusLabels,
  sodiumAgeGroupLabels,
  type AlertLevel,
  type FluidCalculationResult,
  type FluidInputs,
  type HydrationStatus,
  type SodiumAgeGroup,
  type SafetyAlert
} from "@/lib/calculators/maintenanceFluids";

const complexScenarios = [
  "shock/ipoperfusione",
  "disidratazione severa",
  "DKA/chetoacidosi diabetica",
  "ustioni estese",
  "diabete insipido",
  "insufficienza renale severa/anuria",
  "iponatriemia severa sintomatica",
  "ipernatriemia severa",
  "neonato prematuro",
  "terapia intensiva con instabilità emodinamica"
];

export function MaintenanceFluidsCalculator() {
  const [weightKg, setWeightKg] = useState("");
  const [usualWeightKg, setUsualWeightKg] = useState("");
  const [hydrationStatus, setHydrationStatus] = useState<HydrationStatus>("euvolemic");
  const [siadhRisk, setSiadhRisk] = useState(false);
  const [overloadRisk, setOverloadRisk] = useState(false);
  const [sodium, setSodium] = useState("");
  const [potassium, setPotassium] = useState("");
  const [sodiumTarget, setSodiumTarget] = useState("140");
  const [sodiumAgeGroup, setSodiumAgeGroup] = useState<SodiumAgeGroup>("olderChild");
  const [includeElectrolytes, setIncludeElectrolytes] = useState(false);
  const [includePreviousLosses, setIncludePreviousLosses] = useState(false);
  const [includeOtherFluids, setIncludeOtherFluids] = useState(false);
  const [includePredictableLosses, setIncludePredictableLosses] = useState(false);
  const [fever, setFever] = useState(false);
  const [diarrhea, setDiarrhea] = useState(false);
  const [diarrheaStools, setDiarrheaStools] = useState("");
  const [measuredLossesMlDay, setMeasuredLossesMlDay] = useState("");
  const [otherFluidsMlDay, setOtherFluidsMlDay] = useState("");
  const [result, setResult] = useState<FluidCalculationResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const resetOutput = () => {
    setResult(null);
    setErrors([]);
  };

  const handleCalculate = () => {
    const parsedWeight = parseDecimalInput(weightKg);
    const parsedUsualWeight = parseOptionalDecimal(usualWeightKg);
    const parsedSodium = parseOptionalDecimal(sodium);
    const parsedPotassium = parseOptionalDecimal(potassium);
    const parsedSodiumTarget = parseOptionalDecimal(sodiumTarget);
    const parsedDiarrhea = parseOptionalDecimal(diarrheaStools);
    const parsedMeasuredLosses = parseOptionalDecimal(measuredLossesMlDay);
    const parsedOtherFluids = parseOptionalDecimal(otherFluidsMlDay);
    const nextErrors: string[] = [];

    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) nextErrors.push("Inserire un peso attuale valido in kg.");
    if (includePreviousLosses && (parsedUsualWeight.error || (parsedUsualWeight.value !== null && parsedUsualWeight.value <= 0))) nextErrors.push("Inserire un peso anamnestico valido oppure lasciare il campo vuoto.");
    if (includePreviousLosses && parsedUsualWeight.value !== null && Number.isFinite(parsedWeight) && parsedUsualWeight.value < parsedWeight) nextErrors.push("Il peso anamnestico non può essere inferiore al peso attuale per il calcolo delle perdite.");
    if (includeElectrolytes && parsedSodium.error) nextErrors.push("Inserire una natremia valida oppure lasciare il campo vuoto.");
    if (includeElectrolytes && parsedPotassium.error) nextErrors.push("Inserire una kaliemia valida oppure lasciare il campo vuoto.");
    if (includeElectrolytes && (parsedSodiumTarget.error || (parsedSodiumTarget.value !== null && (parsedSodiumTarget.value < 120 || parsedSodiumTarget.value > 160)))) nextErrors.push("Inserire un target di sodio plausibile oppure lasciare 140 mEq/L.");
    if (includePredictableLosses && diarrhea && (parsedDiarrhea.error || (parsedDiarrhea.value !== null && parsedDiarrhea.value < 0))) nextErrors.push("Inserire un numero di scariche valido oppure lasciare il campo vuoto.");
    if (includePreviousLosses && (parsedMeasuredLosses.error || (parsedMeasuredLosses.value !== null && parsedMeasuredLosses.value < 0))) nextErrors.push("Inserire perdite misurate valide oppure lasciare il campo vuoto.");
    if (includeOtherFluids && (parsedOtherFluids.error || (parsedOtherFluids.value !== null && parsedOtherFluids.value < 0))) nextErrors.push("Inserire altri apporti validi oppure lasciare il campo vuoto.");

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      setResult(null);
      return;
    }

    const inputs: FluidInputs = {
      weightKg: parsedWeight,
      usualWeightKg: includePreviousLosses ? parsedUsualWeight.value : null,
      hydrationStatus: includePreviousLosses ? hydrationStatus : "euvolemic",
      siadhRisk,
      overloadRisk,
      sodium: includeElectrolytes ? parsedSodium.value : null,
      potassium: includeElectrolytes ? parsedPotassium.value : null,
      sodiumTarget: includeElectrolytes ? parsedSodiumTarget.value : 140,
      sodiumAgeGroup,
      fever: includePredictableLosses ? fever : false,
      diarrheaStools: includePredictableLosses && diarrhea ? (parsedDiarrhea.value ?? 0) : 0,
      measuredLossesMlDay: includePreviousLosses ? (parsedMeasuredLosses.value ?? 0) : 0,
      otherFluidsMlDay: includeOtherFluids ? (parsedOtherFluids.value ?? 0) : 0
    };

    try {
      setResult(calculateMaintenanceFluids(inputs));
      setErrors([]);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Impossibile calcolare la terapia infusionale di supporto."]);
      setResult(null);
    }
  };

  const criticalAlerts = result?.alerts.filter((alert) => alert.level === "critical") ?? [];
  const nonCriticalAlerts = result?.alerts.filter((alert) => alert.level !== "critical") ?? [];

  return (
    <CalculatorLayout
      source={
        <ol className="list-decimal space-y-2 pl-5">
          <li>ESPNIC Clinical Practice Guidelines: Intravenous maintenance fluid therapy in acute and critically ill children. Intensive Care Medicine. 2022.</li>
          <li>Brossier et al. Intravenous maintenance fluid therapy in acutely and critically ill children: state of the evidence. Lancet Child &amp; Adolescent Health. 2024.</li>
          <li>AAP Clinical Practice Guideline: Maintenance Intravenous Fluids in Children. Pediatrics. 2018.</li>
          <li>Holliday MA, Segar WE. The maintenance need for water in parenteral fluid therapy. Pediatrics. 1957.</li>
        </ol>
      }
      updatedAt="2026-05-24"
      sourceTitle="Riferimenti bibliografici"
      unframed
      warningPlacement="bottom"
      warning="Strumento di supporto clinico. Non sostituisce valutazione medica, protocolli locali e monitoraggio laboratoristico."
    >
      <div className="grid gap-5">
        <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <InputSection title="Peso e mantenimento">
            <div className="grid gap-4 md:grid-cols-2">
              <NumberField id="fluid-weight" label="Peso attuale" unit="kg" value={weightKg} onChange={(value) => {
                setWeightKg(value);
                resetOutput();
              }} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FlagField checked={siadhRisk} label="Rischio SIADH" help="Flag positivo se sono presenti condizioni che aumentano ADH e rischio di ritenzione d'acqua, per esempio nausea/vomito, dolore/stress, infezione respiratoria, patologia SNC o post-operatorio." onChange={(checked) => {
                setSiadhRisk(checked);
                resetOutput();
              }} />
              <FlagField checked={overloadRisk} label="Rischio overload/edemi" help="Flag positivo se sono presenti condizioni con ridotta tolleranza ai fluidi, per esempio cardiopatia/scompenso, insufficienza renale/oliguria, epatopatia, sindrome nefrosica, capillary leak o malnutrizione severa." onChange={(checked) => {
                setOverloadRisk(checked);
                resetOutput();
              }} />
            </div>
          </InputSection>

          <OptionalSection title="Elettroliti" checked={includeElectrolytes} onChange={(checked) => {
            setIncludeElectrolytes(checked);
            resetOutput();
          }}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <NumberField id="fluid-sodium" label="Natremia" unit="mEq/L" value={sodium} onChange={(value) => {
                setSodium(value);
                resetOutput();
              }} optional />
              <NumberField id="fluid-potassium" label="Kaliemia" unit="mEq/L" value={potassium} onChange={(value) => {
                setPotassium(value);
                resetOutput();
              }} optional />
              <SelectField id="fluid-sodium-age" label="Fascia età per VdNa" value={sodiumAgeGroup} onChange={(value) => {
                setSodiumAgeGroup(value as SodiumAgeGroup);
                resetOutput();
              }} options={sodiumAgeGroupLabels} help="Usata per il volume di distribuzione del sodio: <2 anni = bambino piccolo; ≥2 anni = bambino grande." />
              <NumberField id="fluid-sodium-target" label="Target sodio" unit="mEq/L" value={sodiumTarget} onChange={(value) => {
                setSodiumTarget(value);
                resetOutput();
              }} optional help="Target orientativo per il calcolo: non definisce da solo la velocità sicura di correzione." />
            </div>
          </OptionalSection>

          <OptionalSection title="Perdite pregresse" checked={includePreviousLosses} onChange={(checked) => {
            setIncludePreviousLosses(checked);
            resetOutput();
          }}>
            <div className="grid gap-4 md:grid-cols-2">
              <NumberField id="fluid-usual-weight" label="Peso anamnestico" unit="kg" value={usualWeightKg} onChange={(value) => {
                setUsualWeightKg(value);
                resetOutput();
              }} optional help="Se noto, permette di stimare le perdite già avvenute come differenza tra peso anamnestico e peso attuale." />
              <NumberField id="fluid-measured-losses" label="Perdite misurate" unit="mL/24h" value={measuredLossesMlDay} onChange={(value) => {
                setMeasuredLossesMlDay(value);
                resetOutput();
              }} optional help="Aspirazione da SNG o altre perdite misurate da reintegrare nelle 24 ore." />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField id="fluid-hydration" label="Stato idratazione" value={hydrationStatus} onChange={(value) => {
                setHydrationStatus(value as HydrationStatus);
                resetOutput();
              }} options={hydrationStatusLabels} help={<HydrationHelpTable />} />
            </div>
          </OptionalSection>

          <OptionalSection title="Perdite prevedibili" checked={includePredictableLosses} onChange={(checked) => {
            setIncludePredictableLosses(checked);
            resetOutput();
          }}>
            <div className="grid gap-4 md:grid-cols-2">
              <FlagField checked={fever} label="Iperpiressia persistente/grave" help="Stima orientativa: 1,5% del peso corporeo attuale nelle 24 ore." onChange={(checked) => {
                setFever(checked);
                resetOutput();
              }} />
              <FlagField checked={diarrhea} label="Diarrea" help="Se selezionata, consente di stimare 50 mL per scarica nelle 24 ore." onChange={(checked) => {
                setDiarrhea(checked);
                if (!checked) setDiarrheaStools("");
                resetOutput();
              }} />
            </div>
            {diarrhea ? (
              <div className="grid gap-4 md:grid-cols-2">
                <NumberField id="fluid-diarrhea" label="Numero scariche" unit="scariche/24h" value={diarrheaStools} onChange={(value) => {
                  setDiarrheaStools(value);
                  resetOutput();
                }} optional help="Stima orientativa: 50 mL per scarica, se non è disponibile un volume misurato." />
              </div>
            ) : null}
          </OptionalSection>

          <OptionalSection title="Altri apporti" checked={includeOtherFluids} onChange={(checked) => {
            setIncludeOtherFluids(checked);
            resetOutput();
          }}>
            <div className="grid gap-4 md:grid-cols-2">
              <NumberField id="fluid-other-fluids" label="Altri apporti previsti" unit="mL/24h" value={otherFluidsMlDay} onChange={(value) => {
                setOtherFluidsMlDay(value);
                resetOutput();
              }} optional help="Somma dei volumi già previsti nelle 24 ore: farmaci EV, flush, nutrizione enterale/parenterale, emoderivati o altri apporti." />
            </div>
          </OptionalSection>

          <button type="button" onClick={handleCalculate} className="w-fit rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950">
            Calcola
          </button>
        </section>

        {errors.length > 0 ? <div className="grid gap-2">{errors.map((error) => <WarningBox key={error}>{error}</WarningBox>)}</div> : null}
        {criticalAlerts.length > 0 ? <AlertsList alerts={criticalAlerts} /> : null}
        {result ? (
          <section className="grid gap-4">
            <Results result={result} />
            {nonCriticalAlerts.length > 0 ? <AlertsList alerts={nonCriticalAlerts} /> : null}
            <Interpretation result={result} />
            <MonitoringList items={result.monitoring} />
          </section>
        ) : null}
        <ComplexScenariosInfo />
      </div>
    </CalculatorLayout>
  );
}

function InputSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 pb-2">
      <h3 className="text-base font-bold text-slate-950 dark:text-white">{title}</h3>
      {children}
    </section>
  );
}

function OptionalSection({ title, checked, onChange, children }: { title: string; checked: boolean; onChange: (checked: boolean) => void; children: React.ReactNode }) {
  return (
    <section className="grid gap-2">
      {!checked ? (
        <button
          type="button"
          aria-pressed={false}
          onClick={() => onChange(true)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-left text-base font-bold text-slate-950 transition hover:border-blue-200 hover:bg-blue-50/60 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-blue-900 dark:hover:bg-blue-950/30"
        >
          <span>{title}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">Aggiungi</span>
        </button>
      ) : (
        <div className="grid gap-3 rounded-md border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/30 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-950 dark:text-white">{title}</h3>
            <button
              type="button"
              onClick={() => onChange(false)}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Rimuovi
            </button>
          </div>
          {children}
        </div>
      )}
    </section>
  );
}

function Results({ result }: { result: FluidCalculationResult }) {
  const formatted = formatResults(result);
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <ResultCard icon={<Droplets className="size-5" />} label="Mantenimento standard secondo formula di Holliday-Segar" value={formatted.standard} />
      <ResultCard icon={<Gauge className="size-5" />} label="Mantenimento con correzioni" value={formatted.correctedMaintenance} detail={formatted.restriction} />
      <ResultCard icon={<Waves className="size-5" />} label="Calcolo perdite" value={formatted.previousLosses} />
      <ResultCard icon={<Waves className="size-5" />} label="Perdite prevedibili" value={formatted.predictableLosses} detail={result.predictableLossesDetails.join(" · ")} />
      <ResultCard icon={<Calculator className="size-5" />} label="Correzione eccesso o deficit di sodio" value={formatSodiumValue(result)} detail={result.sodiumCorrection.note} alert={result.sodiumCorrection.status === "deficit" || result.sodiumCorrection.status === "excess"} />
      <ResultCard icon={<Droplets className="size-5" />} label="Conclusione: infusione da impostare" value={formatted.infusion} detail={`Altri apporti sottratti: ${formatted.otherFluids}`} alert={result.noAdditionalIv} />
    </div>
  );
}

function formatSodiumValue(result: FluidCalculationResult) {
  const correction = result.sodiumCorrection;
  if (correction.status === "deficit") return `Deficit ${correction.sodiumDeficitMEq} mEq NaCl`;
  if (correction.status === "excess") return `Eccesso ${correction.sodiumExcessMEq} mEq NaCl`;
  if (correction.status === "normal") return "Nessuna correzione stimata";
  return "Non calcolata";
}

function ResultCard({ icon, label, value, detail, alert = false }: { icon: React.ReactNode; label: string; value: string; detail?: string; alert?: boolean }) {
  return (
    <article className={`grid content-start gap-3 rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-950 ${alert ? "border-amber-300 ring-1 ring-amber-200 dark:border-amber-800 dark:ring-amber-950" : "border-slate-200 dark:border-slate-800"}`}>
      <div className="flex items-start gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-xl font-bold text-slate-950 dark:text-white">{value}</p>
      {detail ? <p className="text-sm leading-5 text-slate-600 dark:text-slate-300">{detail}</p> : null}
    </article>
  );
}

function Interpretation({ result }: { result: FluidCalculationResult }) {
  return (
    <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start gap-2">
        <ShieldAlert className="mt-0.5 size-5 text-blue-700 dark:text-blue-300" />
        <div className="grid gap-3">
          <h3 className="text-base font-bold text-slate-950 dark:text-white">Conclusione clinica</h3>
          {result.hasCriticalAlert ? <p className="text-sm leading-6 text-rose-800 dark:text-rose-100">Scenario complesso: non proporre una prescrizione automatica definitiva. Usare protocollo specifico, rivalutazione clinica e supporto specialistico.</p> : null}
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{result.recommendation.conclusion}</p>
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{result.recommendation.sodium}</p>
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{result.recommendation.solution}</p>
        </div>
      </div>
    </section>
  );
}

function MonitoringList({ items }: { items: string[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h3 className="text-base font-bold text-slate-950 dark:text-white">Monitoraggio consigliato</h3>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700 sm:grid-cols-2 dark:text-slate-200">
        {items.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </section>
  );
}

function AlertsList({ alerts }: { alerts: SafetyAlert[] }) {
  return (
    <div className="grid gap-2">
      {alerts.map((alert) => (
        <div key={`${alert.level}-${alert.message}`} className={`rounded-lg border p-4 text-sm font-medium shadow-sm ${alertClasses[alert.level]}`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <p>{alert.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ComplexScenariosInfo() {
  return (
    <section className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950 shadow-sm dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <div>
          <h3 className="font-bold">Scenari in cui non usare il calcolo standard come guida unica</h3>
          <p className="mt-1">Se presenti {complexScenarios.join(", ")}, lo scenario è complesso: utilizzare protocollo specifico e valutazione specialistica.</p>
        </div>
      </div>
    </section>
  );
}

const alertClasses: Record<AlertLevel, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
  warning: "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
  critical: "border-rose-300 bg-rose-50 text-rose-950 ring-1 ring-rose-200 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100 dark:ring-rose-950"
};

function SelectField({ id, label, value, onChange, options, help }: { id: string; label: string; value: string; onChange: (value: string) => void; options: Record<string, string>; help?: React.ReactNode }) {
  return (
    <label htmlFor={id} className="grid gap-2">
      <span className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">{label}{help ? <HelpNote text={help} /> : null}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-base text-slate-950 outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
        {Object.entries(options).map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function NumberField({ id, label, unit, value, onChange, optional = false, help }: { id: string; label: string; unit: string; value: string; onChange: (value: string) => void; optional?: boolean; help?: React.ReactNode }) {
  return (
    <label htmlFor={id} className="grid gap-2">
      <span className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">{label}{optional ? <span className="text-sm font-normal text-slate-500 dark:text-slate-400">(opzionale)</span> : null}{help ? <HelpNote text={help} /> : null}</span>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] overflow-hidden rounded-md border border-slate-200 bg-white focus-within:border-blue-500 dark:border-slate-800 dark:bg-slate-950">
        <input id={id} type="text" inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 bg-transparent px-3 py-2 text-base text-slate-950 outline-none dark:text-white" />
        <span className="border-l border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">{unit}</span>
      </div>
    </label>
  );
}

function FlagField({ label, checked, help, onChange }: { label: string; checked: boolean; help: React.ReactNode; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 text-base font-semibold text-slate-950 dark:text-white">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950" />
      <span>{label}</span>
      <HelpNote text={help} />
    </label>
  );
}

function HelpNote({ text }: { text: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties | null>(null);
  return (
    <span className="relative inline-flex">
      <button type="button" aria-label="Mostra spiegazione" onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const shouldOpen = !open;
        if (shouldOpen && window.matchMedia("(min-width: 640px)").matches) {
          const rect = event.currentTarget.getBoundingClientRect();
          const margin = 24;
          const width = Math.min(544, window.innerWidth - margin * 2);
          const left = Math.min(Math.max(rect.left, margin), window.innerWidth - width - margin);
          const top = Math.min(rect.bottom + 8, window.innerHeight - 160);
          setPanelStyle({ left, top, width });
        } else setPanelStyle(null);
        setOpen(shouldOpen);
      }} className="inline-flex size-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900">
        <HelpCircle className="size-4" />
      </button>
      {open ? (
        <span style={panelStyle ?? undefined} className={`fixed z-40 max-h-[calc(100vh-8rem)] overflow-auto rounded-md border border-slate-200 bg-white p-4 pr-12 text-sm font-normal leading-5 text-slate-700 shadow-xl dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 ${panelStyle ? "" : "inset-x-3 top-24 sm:inset-x-6 lg:inset-x-10"}`}>
          <button type="button" aria-label="Chiudi spiegazione" onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
          }} className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"><X className="size-4" /></button>
          <span className="block">{text}</span>
        </span>
      ) : null}
    </span>
  );
}

function HydrationHelpTable() {
  return (
    <div className="overflow-hidden rounded border border-slate-300 text-left text-sm dark:border-slate-700">
      <div className="border-b border-slate-300 px-3 py-2 italic dark:border-slate-700">Stima della disidratazione sulla base della clinica</div>
      <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_5.5rem] border-b border-slate-300 dark:border-slate-700 sm:grid-cols-[7rem_minmax(0,1fr)_7rem]">
        <div className="border-r border-slate-300 px-3 py-2 font-bold dark:border-slate-700">Lieve</div>
        <div className="border-r border-slate-300 px-3 py-2 dark:border-slate-700">Appena sospettabile all&apos;EO</div>
        <div className="px-3 py-2 font-bold">3% del peso</div>
      </div>
      <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_5.5rem] border-b border-slate-300 dark:border-slate-700 sm:grid-cols-[7rem_minmax(0,1fr)_7rem]">
        <div className="border-r border-slate-300 px-3 py-2 font-bold dark:border-slate-700">Moderata</div>
        <div className="border-r border-slate-300 px-3 py-2 dark:border-slate-700">Mucose e labbra secche, pianto senza lacrime, occhi alonati</div>
        <div className="px-3 py-2 font-bold">7% del peso</div>
      </div>
      <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_5.5rem] sm:grid-cols-[7rem_minmax(0,1fr)_7rem]">
        <div className="border-r border-slate-300 px-3 py-2 font-bold dark:border-slate-700">Severa</div>
        <div className="border-r border-slate-300 px-3 py-2 dark:border-slate-700">Cute sollevabile in pliche, refill capillare prolungato, tachicardia, tendenza all&apos;ipotensione</div>
        <div className="px-3 py-2 font-bold">&gt; 10% del peso</div>
      </div>
    </div>
  );
}

function parseDecimalInput(value: string) {
  if (value.trim() === "") return Number.NaN;
  return Number(value.replace(",", "."));
}

function parseOptionalDecimal(value: string) {
  if (value.trim() === "") return { value: null, error: false };
  const parsed = parseDecimalInput(value);
  return Number.isFinite(parsed) ? { value: parsed, error: false } : { value: null, error: true };
}
