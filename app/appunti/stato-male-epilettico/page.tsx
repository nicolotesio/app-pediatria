import { StatusEpilepticusTherapy } from "@/components/notes/StatusEpilepticusTherapy";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function StatusEpilepticusTherapyPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader title="Terapia dello stato di male epilettico" description="Tabella farmaci da schema emergenze pediatriche." />
      <StatusEpilepticusTherapy />
      <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="font-semibold text-slate-950 dark:text-white">Aggiornato</p>
        <p className="mt-1 text-slate-600 dark:text-slate-300">2026-07-13</p>
      </aside>
    </div>
  );
}
