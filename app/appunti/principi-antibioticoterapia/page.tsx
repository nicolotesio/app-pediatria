import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function AntibioticPrinciplesPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader title="Principi di antibioticoterapia" />
      <section className="grid gap-6">
        <figure className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <Image
            src="/antibiogramma.png"
            alt="Antibiogramma"
            width={1578}
            height={997}
            priority
            className="h-auto w-full"
          />
        </figure>
        <figure className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <Image
            src="/sede-penetrabilita-atb.png"
            alt="Sede d'infezione e penetrabilita dell'antibiotico"
            width={864}
            height={1821}
            className="h-auto w-full"
          />
        </figure>
      </section>
    </div>
  );
}
