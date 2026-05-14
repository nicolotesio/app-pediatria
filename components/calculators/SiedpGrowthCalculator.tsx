"use client";

import { useMemo, useState } from "react";
import { Gauge, Ruler, Scale } from "lucide-react";
import {
  calculateAgeDecimalFromDates,
  calculateSiedpBmi,
  calculateSiedpMetric,
  formatCompletedAgeFromDates,
  formatSiedpAge,
  normalizeAgeToMonths,
  siedpGrowthMetadata,
  type SiedpBmiResult,
  type BmiClassification,
  type SiedpMetricResult,
  type SiedpSex
} from "@/lib/calculators/siedpGrowth";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { WarningBox } from "@/components/ui/WarningBox";

type AgeMode = "slider" | "dates";

type SubmittedResult = {
  ageYears: number;
  weight: SiedpMetricResult | null;
  height: SiedpMetricResult | null;
  bmi: SiedpBmiResult | null;
};

const classificationClasses: Record<BmiClassification, string> = {
  Normopeso: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-100 dark:ring-emerald-900",
  Sovrappeso: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:ring-amber-900",
  Obesità: "bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-100 dark:ring-rose-900"
};

export function SiedpGrowthCalculator() {
  const [sex, setSex] = useState<SiedpSex | "">("male");
  const [ageMode, setAgeMode] = useState<AgeMode>("slider");
  const [ageYears, setAgeYears] = useState(8);
  const [birthDate, setBirthDate] = useState("");
  const [measurementDate, setMeasurementDate] = useState(new Date().toISOString().slice(0, 10));
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [submittedResult, setSubmittedResult] = useState<SubmittedResult | null>(null);
  const [submittedErrors, setSubmittedErrors] = useState<string[]>([]);

  const agePreview = useMemo(() => {
    let ageError: string | null = null;
    let effectiveAge = normalizeAgeToMonths(ageYears);
    let displayAge = formatSiedpAge(effectiveAge);

    if (ageMode === "dates") {
      try {
        effectiveAge = calculateAgeDecimalFromDates(birthDate, measurementDate);
        displayAge = formatCompletedAgeFromDates(birthDate, measurementDate);
        if (effectiveAge < 2 || effectiveAge > 20) {
          ageError = "Età consentita solo tra 2 anni e 20 anni.";
        }
      } catch (error) {
        ageError = error instanceof Error ? error.message : "Date non valide";
      }
    }

    return { effectiveAge, displayAge, ageError };
  }, [ageMode, ageYears, birthDate, measurementDate]);

  const handleCalculate = () => {
    const errors: string[] = [];
    const effectiveAge = agePreview.effectiveAge;
    const parsedWeight = parseDecimalInput(weightKg);
    const parsedHeight = parseDecimalInput(heightCm);
    const hasWeight = weightKg.trim() !== "";
    const hasHeight = heightCm.trim() !== "";

    if (!sex) errors.push("Selezionare il sesso");
    if (agePreview.ageError) errors.push(agePreview.ageError);
    if (hasWeight && (!Number.isFinite(parsedWeight) || parsedWeight <= 0)) {
      errors.push("Inserire un peso valido maggiore di 0 kg");
    }
    if (hasHeight && (!Number.isFinite(parsedHeight) || parsedHeight <= 0)) {
      errors.push("Inserire un'altezza valida maggiore di 0 cm");
    }

    if (errors.length > 0) {
      setSubmittedErrors(dedupe(errors));
      setSubmittedResult(null);
      return;
    }

    try {
      setSubmittedResult({
        ageYears: effectiveAge,
        weight: hasWeight ? calculateSiedpMetric("weight", sex as SiedpSex, effectiveAge, parsedWeight) : null,
        height: hasHeight ? calculateSiedpMetric("height", sex as SiedpSex, effectiveAge, parsedHeight) : null,
        bmi: hasWeight && hasHeight ? calculateSiedpBmi(sex as SiedpSex, effectiveAge, parsedWeight, parsedHeight) : null
      });
      setSubmittedErrors([]);
    } catch (error) {
      setSubmittedErrors([error instanceof Error ? error.message : "Impossibile calcolare i centili"]);
      setSubmittedResult(null);
    }
  };

  const resetSubmittedOutput = () => {
    setSubmittedResult(null);
    setSubmittedErrors([]);
  };

  const visibleErrors = dedupe([
    ...(birthDate && measurementDate && agePreview.ageError ? [agePreview.ageError] : []),
    ...submittedErrors
  ]);

  return (
    <CalculatorLayout
      source={siedpGrowthMetadata.source}
      updatedAt={siedpGrowthMetadata.updatedAt}
      sourceTitle="Riferimenti bibliografici"
      sourceNote="Dati LMS caricati localmente."
      unframed
      warningPlacement="bottom"
      warning={null}
    >
      <div className="grid gap-5">
        <section className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldGroup label="Sesso">
              <div className="grid grid-cols-2 gap-2">
                <SegmentButton active={sex === "male"} onClick={() => {
                  setSex("male");
                  resetSubmittedOutput();
                }}>
                  Maschio
                </SegmentButton>
                <SegmentButton active={sex === "female"} onClick={() => {
                  setSex("female");
                  resetSubmittedOutput();
                }}>
                  Femmina
                </SegmentButton>
              </div>
            </FieldGroup>

            <FieldGroup label="Selettore età">
              <div className="grid grid-cols-2 gap-2">
                <SegmentButton active={ageMode === "slider"} onClick={() => {
                  setAgeMode("slider");
                  resetSubmittedOutput();
                }}>
                  Slider
                </SegmentButton>
                <SegmentButton active={ageMode === "dates"} onClick={() => {
                  setAgeMode("dates");
                  resetSubmittedOutput();
                }}>
                  Date
                </SegmentButton>
              </div>
            </FieldGroup>
          </div>

          {ageMode === "slider" ? (
            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="siedp-age" className="text-base font-semibold text-slate-950 dark:text-white">
                  Età
                </label>
                <output className="text-xl font-semibold text-slate-950 dark:text-white">{formatSiedpAge(ageYears)}</output>
              </div>
              <input
                id="siedp-age"
                type="range"
                min={2}
                max={20}
                step={1 / 12}
                value={ageYears}
                onChange={(event) => {
                  setAgeYears(normalizeAgeToMonths(Number(event.target.value)));
                  resetSubmittedOutput();
                }}
                className="h-2 w-full accent-blue-600"
              />
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>2 anni</span>
                <span>20 anni</span>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <DateField id="birth-date" label="Data di nascita" value={birthDate} onChange={(value) => {
                setBirthDate(value);
                resetSubmittedOutput();
              }} />
              <DateField id="measurement-date" label="Data misurazione" value={measurementDate} onChange={(value) => {
                setMeasurementDate(value);
                resetSubmittedOutput();
              }} />
              {birthDate && measurementDate && !agePreview.ageError ? (
                <p className="text-sm font-medium text-slate-600 sm:col-span-2 dark:text-slate-300">
                  Età calcolata: <span className="font-semibold text-slate-950 dark:text-white">{agePreview.displayAge}</span>
                </p>
              ) : null}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="weight-kg" label="Peso" unit="kg" value={weightKg} onChange={(value) => {
              setWeightKg(value);
              resetSubmittedOutput();
            }} />
            <NumberField id="height-cm" label="Altezza" unit="cm" value={heightCm} onChange={(value) => {
              setHeightCm(value);
              resetSubmittedOutput();
            }} />
          </div>

          <div>
            <button
              type="button"
              onClick={handleCalculate}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            >
              Calcola
            </button>
          </div>
        </section>

        {visibleErrors.length > 0 ? (
          <div className="grid gap-2">
            {visibleErrors.map((error) => (
              <WarningBox key={error}>{error}</WarningBox>
            ))}
          </div>
        ) : null}

        {submittedResult ? <Results result={submittedResult} /> : null}
      </div>
    </CalculatorLayout>
  );
}

function Results({ result }: { result: SubmittedResult }) {
  return (
    <section className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Risultati</h2>
        <span className="text-base font-semibold text-slate-700 dark:text-slate-200">{formatSiedpAge(result.ageYears)}</span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {result.weight ? (
          <ResultCard icon={<Scale className="size-5" />} label="Peso" value={`${formatNumber(result.weight.value, 1)} kg`} percentile={result.weight.percentile} zScore={result.weight.zScore} />
        ) : (
          <MissingResultCard icon={<Scale className="size-5" />} label="Peso" value="Non inserito" />
        )}
        {result.height ? (
          <ResultCard icon={<Ruler className="size-5" />} label="Altezza" value={`${formatNumber(result.height.value, 1)} cm`} percentile={result.height.percentile} zScore={result.height.zScore} />
        ) : (
          <MissingResultCard icon={<Ruler className="size-5" />} label="Altezza" value="Non inserita" />
        )}
        {result.bmi ? (
          <ResultCard
            icon={<Gauge className="size-5" />}
            label="BMI"
            value={`${formatNumber(result.bmi.value, 1)} kg/m²`}
            percentile={result.bmi.percentile}
            zScore={result.bmi.zScore}
            extra={
              result.bmi.classification !== "Normopeso" ? (
                <div className="grid gap-2">
                  <span className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ring-1 ${classificationClasses[result.bmi.classification]}`}>
                    {result.bmi.classification}
                  </span>
                  <span className="rounded-md bg-blue-50 px-3 py-2 text-sm leading-6 text-blue-950 dark:bg-blue-950/40 dark:text-blue-100">
                    <span className="block">Sovrappeso se BMI &gt;= {formatNumber(result.bmi.ow, 1)} kg/m²;</span>
                    <span className="block">Obesità se BMI &gt;= {formatNumber(result.bmi.ob, 1)} kg/m²</span>
                  </span>
                </div>
              ) : null
            }
          />
        ) : (
          <MissingResultCard icon={<Gauge className="size-5" />} label="BMI" value="Non calcolabile" />
        )}
      </div>
    </section>
  );
}

function MissingResultCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <article className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
            {icon}
            <span>{label}</span>
          </div>
        </div>
        <p className="text-right text-lg font-bold leading-tight text-slate-500 dark:text-slate-400">{value}</p>
      </div>
    </article>
  );
}

function ResultCard({
  icon,
  label,
  value,
  percentile,
  zScore,
  extra
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  percentile: number;
  zScore: number;
  extra?: React.ReactNode;
}) {
  const isZScoreOutOfRange = zScore > 2 || zScore < -2;

  return (
    <article className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
            {icon}
            <span>{label}</span>
          </div>
        </div>
        <p className="text-right text-xl font-bold leading-tight text-slate-950 dark:text-white">{value}</p>
      </div>
      <dl className="grid grid-cols-2 gap-3">
        <Metric label="Centile" value={`${formatNumber(percentile, percentile < 1 || percentile > 99 ? 1 : 0)}°`} alert={isZScoreOutOfRange} />
        <Metric label="Z-score" value={formatSigned(zScore)} alert={isZScoreOutOfRange} />
      </dl>
      {extra}
    </article>
  );
}

function Metric({ label, value, alert = false }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className={`rounded-md px-3 py-2 ${alert ? "bg-rose-50 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:ring-rose-900" : "bg-slate-50 dark:bg-slate-900"}`}>
      <dt className={`text-xs font-medium uppercase tracking-wide ${alert ? "text-rose-700 dark:text-rose-200" : "text-slate-500 dark:text-slate-400"}`}>{label}</dt>
      <dd className={`mt-1 text-lg font-semibold ${alert ? "text-rose-900 dark:text-rose-100" : "text-slate-950 dark:text-white"}`}>{value}</dd>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <span className="text-base font-semibold text-slate-950 dark:text-white">{label}</span>
      {children}
    </div>
  );
}

function SegmentButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
        active
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-blue-800"
      }`}
    >
      {children}
    </button>
  );
}

function NumberField({ id, label, unit, value, onChange }: { id: string; label: string; unit: string; value: string; onChange: (value: string) => void }) {
  return (
    <label htmlFor={id} className="grid gap-2">
      <span className="text-base font-semibold text-slate-950 dark:text-white">{label}</span>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] overflow-hidden rounded-md border border-slate-200 bg-white focus-within:border-blue-500 dark:border-slate-800 dark:bg-slate-950">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 bg-transparent px-3 py-2 text-base text-slate-950 outline-none dark:text-white"
        />
        <span className="border-l border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">{unit}</span>
      </div>
    </label>
  );
}

function DateField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label htmlFor={id} className="grid gap-2">
      <span className="text-base font-semibold text-slate-950 dark:text-white">{label}</span>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onInput={(event) => onChange(event.currentTarget.value)}
        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-base text-slate-950 outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
      />
    </label>
  );
}

function formatSigned(value: number) {
  const rounded = formatNumber(value, 2);
  return value > 0 ? `+${rounded}` : rounded;
}

function formatNumber(value: number, digits: number) {
  return value.toLocaleString("it-IT", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function parseDecimalInput(value: string) {
  return Number(value.trim().replace(",", "."));
}

function dedupe(values: string[]) {
  return Array.from(new Set(values));
}
