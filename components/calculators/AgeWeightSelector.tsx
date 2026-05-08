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
  return Math.round((ageYears + 4) * 2);
}

export function AgeWeightSelector({ value, onChange, ageMin = 1, ageMax = 12, weightMin = 10, weightMax = 70 }: AgeWeightSelectorProps) {
  const updateAge = (nextAge: number) => {
    const ageYears = clamp(nextAge, ageMin, ageMax);
    onChange({
      ...value,
      ageYears,
      weightKg: value.estimateWeightFromAge ? estimatePediatricWeightKg(ageYears) : value.weightKg
    });
  };

  const updateWeight = (nextWeight: number) => {
    onChange({
      ...value,
      weightKg: clamp(nextWeight, weightMin, weightMax),
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
              Eta
            </label>
            <output className="text-xl font-semibold text-slate-950 dark:text-white">{formatYears(value.ageYears)}</output>
          </div>
          <input
            id="age-years"
            type="range"
            min={ageMin}
            max={ageMax}
            step={1}
            value={value.ageYears}
            onChange={(event) => updateAge(Number(event.target.value))}
            className="h-2 w-full accent-teal-600"
          />
          <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>{formatYears(ageMin)}</span>
            <span>{formatYears(ageMax)}</span>
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
                  className="size-4 rounded border-slate-300 accent-teal-600"
                />
                Stima da eta
              </label>
            </div>
            <output className="text-xl font-semibold text-slate-950 dark:text-white">{value.weightKg} kg</output>
          </div>
          <input
            id="weight-kg"
            type="range"
            min={weightMin}
            max={weightMax}
            step={1}
            value={value.weightKg}
            disabled={value.estimateWeightFromAge}
            onChange={(event) => updateWeight(Number(event.target.value))}
            className="h-2 w-full accent-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
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

function formatYears(value: number) {
  return value === 1 ? "1 anno" : `${value} anni`;
}
