"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

type LabKey = "platelets" | "ast" | "triglycerides" | "fibrinogen";

const labCriteria: Array<{
  key: LabKey;
  label: string;
  threshold: string;
  detail: string;
}> = [
  {
    key: "platelets",
    label: "Piastrine",
    threshold: "<= 181 x 10^9/L",
    detail: "Conta piastrinica bassa rispetto alla risposta infiammatoria attesa."
  },
  {
    key: "ast",
    label: "AST",
    threshold: "> 48 U/L",
    detail: "Citonecrosi/sofferenza epatica nel contesto infiammatorio."
  },
  {
    key: "triglycerides",
    label: "Trigliceridi",
    threshold: "> 156 mg/dL",
    detail: "Ipertrigliceridemia; se disponibili in mmol/L, 156 mg/dL corrisponde circa a 1,76 mmol/L."
  },
  {
    key: "fibrinogen",
    label: "Fibrinogeno",
    threshold: "<= 360 mg/dL",
    detail: "Fibrinogeno basso o inappropriatamente normale rispetto all'infiammazione."
  }
];

export function MasCriteria() {
  const [ferritin, setFerritin] = useState(false);
  const [selectedLabs, setSelectedLabs] = useState<LabKey[]>([]);
  const labCount = selectedLabs.length;
  const criteriaMet = ferritin && labCount >= 2;

  const probability = useMemo(() => {
    if (criteriaMet) {
      return {
        tone: "blue" as const,
        label: "Criteri soddisfatti",
        text: "In un paziente febbrile con AIG sistemica nota o sospetta, il profilo laboratoristico soddisfa i criteri classificativi 2016 per MAS."
      };
    }
    if (ferritin || labCount > 0) {
      return {
        tone: "amber" as const,
        label: "Sospetto incompleto",
        text: "Il quadro non raggiunge la soglia dei criteri, ma MAS può evolvere rapidamente: rivalutare trend clinico-laboratoristici e diagnosi differenziali."
      };
    }
    return {
      tone: "slate" as const,
      label: "Non valutabile",
      text: "Selezionare ferritina e criteri laboratoristici disponibili."
    };
  }, [criteriaMet, ferritin, labCount]);

  function toggleLab(key: LabKey) {
    setSelectedLabs((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  }

  function reset() {
    setFerritin(false);
    setSelectedLabs([]);
  }

  return (
    <section className="grid gap-5">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={reset}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RotateCcw className="size-4" />
          Reset
        </button>
      </div>

      <label className={`grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-md border p-4 transition ${ferritin ? "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950" : "border-slate-200 bg-white hover:border-blue-200 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900"}`}>
        <input
          type="checkbox"
          checked={ferritin}
          onChange={(event) => setFerritin(event.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-slate-300 accent-blue-700 dark:border-slate-700"
        />
        <span>
          <span className="block text-sm font-semibold text-slate-950 dark:text-white">Ferritina &gt; 684 ng/mL</span>
          <span className="mt-1 block text-sm leading-6 text-slate-600 dark:text-slate-300">Criterio obbligatorio nei criteri classificativi 2016 per MAS in AIG sistemica.</span>
        </span>
      </label>

      <div className="grid gap-3">
        <h3 className="text-base font-bold text-slate-950 dark:text-white">Criteri laboratoristici aggiuntivi (ne servono almeno 2)</h3>
        {labCriteria.map((criterion) => {
          const checked = selectedLabs.includes(criterion.key);
          return (
            <label
              key={criterion.key}
              className={`grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] gap-3 rounded-md border p-4 transition ${checked ? "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950" : "border-slate-200 bg-white hover:border-blue-200 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900"}`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleLab(criterion.key)}
                className="mt-0.5 size-4 shrink-0 rounded border-slate-300 accent-blue-700 dark:border-slate-700"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-950 dark:text-white">{criterion.label}</span>
                <span className="mt-1 block text-sm leading-6 text-slate-600 dark:text-slate-300">{criterion.detail}</span>
              </span>
              <span className="text-right text-sm font-bold text-blue-700 dark:text-blue-300">{criterion.threshold}</span>
            </label>
          );
        })}
      </div>

      <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Risultato</p>
            <p className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
              {ferritin ? "Ferritina positiva" : "Ferritina non selezionata"} + {labCount}/4 criteri
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {criteriaMet ? <CheckCircle2 className="size-5 text-blue-700 dark:text-blue-300" /> : <AlertTriangle className="size-5 text-amber-700 dark:text-amber-300" />}
            <Badge tone={probability.tone} size="md">{probability.label}</Badge>
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{probability.text}</p>
      </div>

      <div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <p>
          MAS è un&apos;urgenza potenzialmente evolutiva. I criteri classificativi non sostituiscono giudizio clinico, trend laboratoristici, diagnosi differenziali infettive/ematologiche e confronto specialistico.
        </p>
      </div>
    </section>
  );
}
