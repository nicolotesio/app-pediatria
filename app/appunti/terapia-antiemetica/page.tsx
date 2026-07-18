import Image from "next/image";
import { AntiemeticTherapy } from "@/components/notes/AntiemeticTherapy";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function AntiemeticTherapyPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader title="Terapia antiemetica" />
      <figure className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <Image
          src="/principi-terapia-antiemetica.png"
          alt="Principi di terapia antiemetica in oncologia pediatrica"
          width={932}
          height={1690}
          priority
          className="h-auto w-full"
        />
      </figure>
      <AntiemeticTherapy />
      <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="font-semibold text-slate-950 dark:text-white">Aggiornato</p>
        <p className="mt-1 text-slate-600 dark:text-slate-300">2026-07-18</p>
      </aside>
    </div>
  );
}
