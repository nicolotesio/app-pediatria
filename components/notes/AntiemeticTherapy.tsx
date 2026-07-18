import { ChevronDown, ChevronRight } from "lucide-react";

const antiemeticClasses = [
  {
    className: "Antagonisti del recettore 5-HT3 (5-HT3RA)",
    drugs: ["Palonosetron", "Ondansetron"]
  },
  {
    className: "Corticosteroidi",
    drugs: ["Metilprednisolone", "Desametasone"]
  },
  {
    className: "Antagonisti del recettore NK1 (NKI)",
    drugs: ["Aprepitant"]
  },
  {
    className: "Antagonisti dopaminergici",
    drugs: ["Alizapride"]
  },
  {
    className: "Antipsicotici",
    drugs: ["Clorpromazina"]
  },
  {
    className: "Antistaminici",
    drugs: ["Clorfenamina"]
  }
];

export function AntiemeticTherapy() {
  return (
    <section className="grid gap-5">
      {antiemeticClasses.map((group) => (
        <section key={group.className} className="grid gap-3">
          <h2 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">{group.className}</h2>
          <div className="grid gap-2">
            {group.drugs.map((drug) => (
              <details
                key={drug}
                className="group overflow-hidden rounded-md border border-slate-200 bg-white transition group-open:border-blue-300 dark:border-slate-800 dark:bg-slate-950 dark:group-open:border-blue-800"
              >
                <summary className="antibiotic-summary flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 group-open:bg-blue-50 group-open:text-blue-950 dark:text-slate-200 dark:hover:bg-slate-900 dark:group-open:bg-blue-950 dark:group-open:text-blue-100 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0">{drug}</span>
                  <span className="shrink-0 text-slate-500 dark:text-slate-400">
                    <ChevronRight className="size-4 group-open:hidden" />
                    <ChevronDown className="hidden size-4 group-open:block" />
                  </span>
                </summary>
                <div className="bg-blue-50 p-4 text-sm leading-6 text-blue-950 dark:bg-blue-950/70 dark:text-blue-100">
                  Scheda terapeutica da completare.
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
