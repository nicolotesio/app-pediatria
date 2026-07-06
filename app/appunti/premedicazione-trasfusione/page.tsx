import { SectionHeader } from "@/components/ui/SectionHeader";
import { WarningBox } from "@/components/ui/WarningBox";

const medications = [
  {
    name: "Idrocortisone",
    brand: "FLEBOCORTID",
    rows: [
      ["Via di somministrazione", "EV"],
      ["Posologia", "5 mg/kg"],
      ["Dose massima", "250 mg (o 100 mg?)"]
    ]
  },
  {
    name: "Clorfenamina",
    brand: "TRIMETON, fiale 1 ml 10 mg",
    rows: [
      ["Via di somministrazione", "EV"],
      ["Posologia", "0.2 mg/kg"],
      ["Dose massima", "20 mg"],
      ["Somministrazione", "EV in > 1 min"]
    ]
  }
];

export default function TransfusionPremedicationPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader
        title="Premedicazione trasfusione"
        description="Schema rapido da considerare circa un'ora prima della trasfusione."
      />

      <section className="grid gap-4">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Circa un&apos;ora prima della trasfusione.</p>

        <div className="grid gap-3">
          {medications.map((medication) => (
            <article key={medication.name} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">{medication.name}</h2>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{medication.brand}</p>
              </div>

              <div className="border-y border-slate-200 dark:border-slate-800">
                {medication.rows.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-3 border-t border-slate-200 py-2 first:border-t-0 dark:border-slate-800 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{value}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <WarningBox title="Attenzione">Dosaggi e somministrazioni da verificare.</WarningBox>

      <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="font-semibold text-slate-950 dark:text-white">Aggiornato</p>
        <p className="mt-1 text-slate-600 dark:text-slate-300">2026-07-06</p>
      </aside>
    </div>
  );
}
