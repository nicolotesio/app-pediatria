"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

type Criterion = {
  id: string;
  label: string;
  detail?: string;
  pigmentary?: boolean;
};

const criteria: Criterion[] = [
  {
    id: "cafe-au-lait",
    label: "Sei o più macchie caffè-latte",
    detail: "Diametro massimo superiore a 5 mm in età prepubere e diametro massimo superiore a 15 mm nei soggetti adulti.",
    pigmentary: true
  },
  {
    id: "freckling",
    label: "Lentigginosi in regione ascellare o inguinale",
    pigmentary: true
  },
  {
    id: "neurofibromas",
    label: "Due o più neurofibromi di qualsiasi tipo o un neurofibroma plessiforme"
  },
  {
    id: "optic-glioma",
    label: "Glioma delle vie ottiche"
  },
  {
    id: "lisch-choroidal",
    label: "Due o più noduli di Lisch iridei o anomalie coroideali",
    detail:
      "Noduli identificati all'esame con lampada a fessura, oppure due o più anomalie della coroide definite come chiazze luminose e chiare documentate con tomografia a coerenza ottica (OCT) o imaging in modalità infrarosso (NIR)."
  },
  {
    id: "osseous",
    label: "Lesione ossea distintiva",
    detail:
      "Displasia dello sfenoide, non considerata criterio indipendente se associata a neurofibroma plessiforme orbitario omolaterale; incurvamento anterolaterale della tibia; pseudoartrosi delle ossa lunghe."
  },
  {
    id: "variant",
    label: "Presenza di una variante patogenetica in eterozigosi nel gene NF1"
  }
];

function getProbabilityLabel(selectedCount: number, hasAffectedParent: boolean, pigmentaryOnly: boolean) {
  const diagnosticThreshold = hasAffectedParent ? 1 : 2;

  if (selectedCount >= diagnosticThreshold) {
    return {
      tone: "blue" as const,
      label: "Alta",
      text: hasAffectedParent
        ? "Diagnosi di NF1 soddisfatta in un figlio di un genitore che soddisfa i criteri diagnostici, in presenza di almeno un criterio in A."
        : "Diagnosi di NF1 soddisfatta: sono presenti due o più criteri diagnostici in assenza di genitore con diagnosi di NF1."
    };
  }

  if (selectedCount === diagnosticThreshold - 1) {
    return {
      tone: "amber" as const,
      label: "Intermedia",
      text: pigmentaryOnly
        ? "Presenza di soli criteri pigmentari: NF1 è probabile, ma va considerata diagnosi differenziale, in particolare sindrome di Legius."
        : "Criteri non ancora sufficienti: monitorare evoluzione clinica e integrare con valutazione specialistica."
    };
  }

  return {
    tone: "slate" as const,
    label: "Bassa",
    text: "Criteri attualmente insufficienti per soddisfare la definizione diagnostica."
  };
}

export function Nf1DiagnosticCriteria() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hasAffectedParent, setHasAffectedParent] = useState(false);

  useEffect(() => {
    setSelectedIds([]);
    setHasAffectedParent(false);
  }, []);

  const selectedCriteria = criteria.filter((criterion) => selectedIds.includes(criterion.id));
  const selectedCount = selectedCriteria.length;
  const pigmentaryOnly = selectedCount > 0 && selectedCriteria.every((criterion) => criterion.pigmentary);
  const threshold = hasAffectedParent ? 1 : 2;
  const isDiagnostic = selectedCount >= threshold;
  const probability = useMemo(() => getProbabilityLabel(selectedCount, hasAffectedParent, pigmentaryOnly), [selectedCount, hasAffectedParent, pigmentaryOnly]);

  function toggleCriterion(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function reset() {
    setSelectedIds([]);
    setHasAffectedParent(false);
  }

  return (
    <section id="nf1" className="grid gap-5">
      <div className="grid gap-3">
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

        <div className="grid gap-3">
          {criteria.map((criterion, index) => {
            const checked = selectedIds.includes(criterion.id);
            return (
              <label
                key={criterion.id}
                className={`grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-md border p-3 transition sm:p-4 ${
                  checked
                    ? "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
                    : "border-slate-200 bg-white hover:border-blue-200 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCriterion(criterion.id)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-700 dark:border-slate-700"
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-950 dark:text-white">
                    A{index + 1}. {criterion.label}
                  </span>
                  {criterion.detail ? <span className="mt-1 block text-sm leading-6 text-slate-600 dark:text-slate-300">{criterion.detail}</span> : null}
                </span>
              </label>
            );
          })}
        </div>

        <label className="flex items-start gap-3 rounded-md border border-blue-100 bg-blue-50 p-3 text-blue-950 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100 sm:p-4">
          <input
            type="checkbox"
            checked={hasAffectedParent}
            onChange={(event) => setHasAffectedParent(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-700 dark:border-slate-700"
          />
          <span>
            <span className="block text-sm font-semibold text-blue-950 dark:text-blue-100">B. Figlio di un genitore che soddisfa i criteri diagnostici in A</span>
          </span>
        </label>
      </div>

      <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Risultato</p>
            <p className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
              {selectedCount} {selectedCount === 1 ? "criterio" : "criteri"} A
              {hasAffectedParent ? <span className="ml-2 text-base font-semibold text-slate-500 dark:text-slate-400">+ criterio B</span> : null}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isDiagnostic ? <CheckCircle2 className="size-5 text-blue-700 dark:text-blue-300" /> : <AlertTriangle className="size-5 text-amber-700 dark:text-amber-300" />}
            <Badge tone={isDiagnostic ? "blue" : probability.tone} size="md">{isDiagnostic ? "Criteri soddisfatti" : "Criteri non soddisfatti"}</Badge>
            <Badge tone={probability.tone} size="md">Probabilita {probability.label}</Badge>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{probability.text}</p>

        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
          Due o più criteri A tra A1-A7 sono sufficienti per la diagnosi di NF1. Se un genitore ha NF1, la soglia diagnostica nel figlio è un solo criterio A.
        </p>

        {pigmentaryOnly ? (
          <div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <p>
              Se sono presenti solo macchie caffè-latte e lentigginosi, la diagnosi più probabile è NF1, ma eccezionalmente la persona potrebbe avere altre diagnosi, in particolare la sindrome di Legius. Almeno uno dei due segni cutanei pigmentati, macchie caffè-latte o lentigginosi atipica, deve essere bilaterale.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
