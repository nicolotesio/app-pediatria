"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

type Criterion = {
  id: string;
  label: string;
  detail?: string;
};

const majorCriteria: Criterion[] = [
  {
    id: "hypomelanotic-macules",
    label: "Macule ipomelanotiche",
    detail: "Tre o più macule, ciascuna di almeno 5 mm di diametro."
  },
  {
    id: "angiofibromas",
    label: "Angiofibromi o placca cefalica fibrosa",
    detail: "Tre o più angiofibromi, oppure una placca cefalica fibrosa."
  },
  {
    id: "ungual-fibromas",
    label: "Fibromi subungueali o ungueali",
    detail: "Due o più fibromi."
  },
  {
    id: "shagreen-patch",
    label: "Placca zigrinata"
  },
  {
    id: "retinal-hamartomas",
    label: "Amartomi retinici multipli"
  },
  {
    id: "cortical-tubers",
    label: "Multipli tuberi corticali, linee di migrazione radiale, o entrambi"
  },
  {
    id: "subependymal-nodules",
    label: "Noduli subependimali",
    detail: "Due o più noduli."
  },
  {
    id: "sega",
    label: "Astrocitoma subependimale a cellule giganti"
  },
  {
    id: "cardiac-rhabdomyoma",
    label: "Rabdomioma cardiaco"
  },
  {
    id: "lymphangioleiomyomatosis",
    label: "Linfangioleiomiomatosi"
  },
  {
    id: "angiomyolipomas",
    label: "Angiomiolipomi",
    detail: "Due o più angiomiolipomi."
  }
];

const minorCriteria: Criterion[] = [
  {
    id: "confetti-lesions",
    label: "Lesioni cutanee a confetto",
    detail: "Aree di ipopigmentazione puntinata, tipicamente sulle estremita."
  },
  {
    id: "dental-enamel-pits",
    label: "Corrosione dello smalto dentale",
    detail: "Tre o più lesioni."
  },
  {
    id: "oral-fibromas",
    label: "Fibromi del cavo orale",
    detail: "Due o più fibromi."
  },
  {
    id: "retinal-achromic-patch",
    label: "Placca acromica retinica"
  },
  {
    id: "multiple-renal-cysts",
    label: "Cisti renali multiple"
  },
  {
    id: "nonrenal-hamartomas",
    label: "Amartomi non renali"
  },
  {
    id: "sclerotic-bone-lesions",
    label: "Lesioni ossee sclerotiche"
  }
];

function getDiagnosticStatus(majorCount: number, minorCount: number, hasPathogenicVariant: boolean, isLamAngiomyolipomaOnly: boolean) {
  if (hasPathogenicVariant || ((majorCount >= 2 || (majorCount >= 1 && minorCount >= 2)) && !isLamAngiomyolipomaOnly)) {
    return {
      tone: "blue" as const,
      label: "Diagnosi definitiva",
      text: hasPathogenicVariant
        ? "Diagnosi definitiva di sclerosi tuberosa complessa: identificata una mutazione patogena TSC1 o TSC2 tramite test genetici molecolari."
        : "Diagnosi definitiva di sclerosi tuberosa complessa: sono soddisfatte le combinazioni cliniche richieste."
    };
  }

  if (majorCount >= 1 || minorCount >= 2) {
    return {
      tone: "amber" as const,
      label: "Diagnosi possibile",
      text: "Quadro compatibile con diagnosi possibile di sclerosi tuberosa complessa: integrare con valutazione specialistica, genetica e follow-up clinico-strumentale."
    };
  }

  return {
    tone: "slate" as const,
    label: "Criteri non sufficienti",
    text: "Criteri attualmente insufficienti per soddisfare la definizione diagnostica possibile o definitiva."
  };
}

export function TscDiagnosticCriteria() {
  const [selectedMajorIds, setSelectedMajorIds] = useState<string[]>([]);
  const [selectedMinorIds, setSelectedMinorIds] = useState<string[]>([]);
  const [hasPathogenicVariant, setHasPathogenicVariant] = useState(false);

  useEffect(() => {
    setSelectedMajorIds([]);
    setSelectedMinorIds([]);
    setHasPathogenicVariant(false);
  }, []);

  const majorCount = selectedMajorIds.length;
  const minorCount = selectedMinorIds.length;
  const isLamAngiomyolipomaOnly =
    selectedMajorIds.length === 2 &&
    selectedMajorIds.includes("lymphangioleiomyomatosis") &&
    selectedMajorIds.includes("angiomyolipomas") &&
    minorCount === 0 &&
    !hasPathogenicVariant;
  const isDefinitive = hasPathogenicVariant || ((majorCount >= 2 || (majorCount >= 1 && minorCount >= 2)) && !isLamAngiomyolipomaOnly);
  const status = useMemo(
    () => getDiagnosticStatus(majorCount, minorCount, hasPathogenicVariant, isLamAngiomyolipomaOnly),
    [majorCount, minorCount, hasPathogenicVariant, isLamAngiomyolipomaOnly]
  );

  function toggleCriterion(id: string, type: "major" | "minor") {
    const setter = type === "major" ? setSelectedMajorIds : setSelectedMinorIds;
    setter((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function reset() {
    setSelectedMajorIds([]);
    setSelectedMinorIds([]);
    setHasPathogenicVariant(false);
  }

  function renderCriterion(criterion: Criterion, index: number, type: "major" | "minor") {
    const checked = type === "major" ? selectedMajorIds.includes(criterion.id) : selectedMinorIds.includes(criterion.id);
    const prefix = type === "major" ? "M" : "m";

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
          onChange={() => toggleCriterion(criterion.id, type)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-700 dark:border-slate-700"
        />
        <span>
          <span className="block text-sm font-semibold text-slate-950 dark:text-white">
            {prefix}
            {index + 1}. {criterion.label}
          </span>
          {criterion.detail ? <span className="mt-1 block text-sm leading-6 text-slate-600 dark:text-slate-300">{criterion.detail}</span> : null}
        </span>
      </label>
    );
  }

  return (
    <section id="sclerosi-tuberosa" className="grid gap-5">
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
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Criteri maggiori</h2>
            <Badge tone="blue" size="sm">{majorCount} selezionate</Badge>
          </div>
          {majorCriteria.map((criterion, index) => renderCriterion(criterion, index, "major"))}
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Criteri minori</h2>
            <Badge tone="slate" size="sm">{minorCount} selezionate</Badge>
          </div>
          {minorCriteria.map((criterion, index) => renderCriterion(criterion, index, "minor"))}
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Genetica</h2>
            <Badge tone={hasPathogenicVariant ? "blue" : "slate"} size="sm">{hasPathogenicVariant ? "positiva" : "non selezionata"}</Badge>
          </div>
          <label className="flex items-start gap-3 rounded-md border border-blue-100 bg-blue-50 p-3 text-blue-950 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100 sm:p-4">
            <input
              type="checkbox"
              checked={hasPathogenicVariant}
              onChange={(event) => setHasPathogenicVariant(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-700 dark:border-slate-700"
            />
            <span>
              <span className="block text-sm font-semibold text-blue-950 dark:text-blue-100">Mutazione patogena TSC1 o TSC2 identificata con test genetici molecolari</span>
            </span>
          </label>
        </div>
      </div>

      <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Risultato</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">
              <span>{majorCount} {majorCount === 1 ? "maggiore" : "maggiori"}</span>
              <span>{minorCount} {minorCount === 1 ? "minore" : "minori"}</span>
              <span>Genetica {hasPathogenicVariant ? "positiva" : "negativa"}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isDefinitive ? <CheckCircle2 className="size-5 text-blue-700 dark:text-blue-300" /> : <AlertTriangle className="size-5 text-amber-700 dark:text-amber-300" />}
            <Badge tone={status.tone} size="md">{status.label}</Badge>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{status.text}</p>

        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
          Diagnosi definitiva: mutazione patogena TSC1/TSC2, oppure due caratteristiche principali, oppure una principale con due minori. Diagnosi possibile: una caratteristica principale oppure due o più caratteristiche minori.
        </p>

        {isLamAngiomyolipomaOnly ? (
          <div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <p>
              La combinazione di linfangioleiomiomatosi e angiomiolipomi, senza altre caratteristiche, non soddisfa i criteri per una diagnosi definitiva.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
