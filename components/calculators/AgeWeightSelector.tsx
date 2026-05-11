"use client";

export type AgeWeightValue = {
  ageYears: number;
  weightKg: number;
  estimateWeightFromAge: boolean;
};

type AgeWeightSelectorProps = {
  value: AgeWeightValue;
  onChange: (value: AgeWeightValue) => void;
  ageMin?: number;
  ageMax?: number;
  weightMin?: number;
  weightMax?: number;
};

export function estimatePediatricWeightKg(ageYears: number) {
  if (ageYears < 1) return round1(0.5 * ageToMonths(ageYears) + 4);
  if (ageYears < 6) return Math.round(2 * ageYears + 8);
  return Math.round(3 * ageYears + 7);
}

export function AgeWeightSelector({ value, onChange, ageMin = 1 / 12, ageMax = 12, weightMin = 3, weightMax = 70 }: AgeWeightSelectorProps) {
  const updateAge = (nextAge: number) => {
    const ageYears = normalizeAgeForSelector(clamp(nextAge, ageMin, ageMax));
    onChange({
      ...value,
      ageYears,
      weightKg: value.estimateWeightFromAge ? estimatePediatricWeightKg(ageYears) : value.weightKg
    });
  };

  const updateWeight = (nextWeight: number) => {
    onChange({
      ...value,
      weightKg: normalizeWeightForSelector(clamp(nextWeight, weightMin, weightMax)),
      estimateWeightFromAge: false
    });
  };

  const updateEstimate = (estimateWeightFromAge: boolean) => {
    onChange({
      ...value,
      estimateWeightFromAge,
      weightKg: estimateWeightFromAge ? estimatePediatricWeightKg(value.ageYears) : value.weightKg
    });
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="grid gap-6">
        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="age-years" className="text-base font-semibold text-slate-950 dark:text-white">
              Età
            </label>
            <output className="text-xl font-semibold text-slate-950 dark:text-white">{formatAge(value.ageYears)}</output>
          </div>
          <input
            id="age-years"
            type="range"
            min={ageMin}
            max={ageMax}
            step={1 / 12}
            value={value.ageYears}
            onChange={(event) => updateAge(Number(event.target.value))}
            className="h-2 w-full accent-blue-600"
          />
          <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>{formatAge(ageMin)}</span>
            <span>{formatAge(ageMax)}</span>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label htmlFor="weight-kg" className="text-base font-semibold text-slate-950 dark:text-white">
                Peso
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={value.estimateWeightFromAge}
                  onChange={(event) => updateEstimate(event.target.checked)}
                  className="size-4 rounded border-slate-300 accent-blue-600"
                />
                Stima da età
              </label>
            </div>
            <output className="text-xl font-semibold text-slate-950 dark:text-white">{value.weightKg} kg</output>
          </div>
          <input
            id="weight-kg"
            type="range"
            min={weightMin}
            max={weightMax}
            step={0.5}
            value={value.weightKg}
            disabled={value.estimateWeightFromAge}
            onChange={(event) => updateWeight(Number(event.target.value))}
            className="h-2 w-full accent-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>{weightMin} kg</span>
            <span>{weightMax} kg</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function ageToMonths(ageYears: number) {
  return Math.round(ageYears * 12);
}

function ageToYears(ageMonths: number) {
  return ageMonths / 12;
}

function normalizeAgeForSelector(ageYears: number) {
  const ageMonths = ageToMonths(ageYears);
  if (ageMonths < 24) return ageToYears(ageMonths);
  return ageToYears(Math.round(ageMonths / 6) * 6);
}

function normalizeWeightForSelector(weightKg: number) {
  if (weightKg <= 10) return Math.round(weightKg * 2) / 2;
  return Math.round(weightKg);
}

function formatAge(value: number) {
  const totalMonths = ageToMonths(value);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];

  if (years > 0) {
    parts.push(years === 1 ? "1 anno" : `${years} anni`);
  }

  if (months > 0) {
    parts.push(months === 1 ? "1 mese" : `${months} mesi`);
  }

  return parts.join(" e ") || "0 mesi";
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}
