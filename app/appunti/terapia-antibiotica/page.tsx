import { AntibioticTherapy } from "@/components/notes/AntibioticTherapy";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function AntibioticTherapyPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader
        title="Terapia antibiotica"
        description="Schede rapide di terapia antibiotica pediatrica (> 28 giorni di età)."
      />
      <AntibioticTherapy />
      <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="font-semibold text-slate-950 dark:text-white">Aggiornato</p>
        <p className="mt-1 text-slate-600 dark:text-slate-300">2026-07-06</p>
      </aside>
    </div>
  );
}
