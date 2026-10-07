import { ChevronRight, ChartSpline, Calculator } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { calculators } from "@/lib/content/calculatorCatalog";

export default function CalculatorsPage() {
  return <div className="mx-auto grid max-w-4xl gap-7">
    <SectionHeader title="Calcolatori" />
    {["Auxologia", "Calcolatori"].map(category => <section key={category}>
      <h2 className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">{category === "Calcolatori" ? "Altri calcolatori" : category}</h2>
      <div className="grid gap-x-8 sm:grid-cols-2">{calculators.filter(item => item.category === category).map(item => {
        const Icon = category === "Auxologia" ? ChartSpline : Calculator;
        return <Link key={item.href} href={item.href} className="group flex items-center gap-3 border-b border-slate-200 py-4 transition hover:text-blue-700 dark:border-slate-800 dark:hover:text-blue-300">
          <Icon className="size-5 shrink-0 text-blue-700 dark:text-blue-300" />
          <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{item.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{item.description}</span></span>
          <ChevronRight className="size-4 shrink-0 text-slate-400" />
        </Link>;
      })}</div>
    </section>)}
  </div>;
}
