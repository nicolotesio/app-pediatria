import { SectionHeader } from "@/components/ui/SectionHeader";
import { ParentSheets } from "@/components/ParentSheets";
import { parentSheets } from "@/data/parentSheets";

export default function ParentsPage() {
  return (
    <div className="mx-auto grid max-w-3xl gap-7">
      <SectionHeader title="Per i genitori" />
      {parentSheets.length > 0 ? <ParentSheets sheets={parentSheets} /> : <div className="border-t border-slate-200 pt-6 dark:border-slate-800"><p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Non ci sono ancora schede disponibili.</p><p className="mt-8 text-xs text-slate-500 dark:text-slate-400">A cura del Dr Nicolò Tesio</p></div>}
    </div>
  );
}
