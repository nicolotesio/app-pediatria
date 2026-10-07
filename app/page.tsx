import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HomeSearchBox } from "@/components/HomeSearchBox";
import { QuickAccess } from "@/components/QuickAccess";
import { sections } from "@/lib/content/navigation";
export default function HomePage() {
  return <div className="mx-auto grid max-w-4xl gap-8">
    <section className="grid gap-5"><h1 className="sr-only">Appunti di Pediatria</h1><HomeSearchBox /></section>
    <QuickAccess />
    <section aria-labelledby="explore-title"><h2 id="explore-title" className="mb-3 text-base font-semibold">Indice</h2>
      <div className="grid gap-x-8 sm:grid-cols-2">{sections.slice(1).map(section => { const Icon = section.icon; return <Link key={section.href} href={section.href} className="group flex items-center gap-3 border-b border-slate-200 py-4 dark:border-slate-800"><span className="grid size-10 shrink-0 place-items-center text-blue-700 dark:text-blue-300"><Icon className="size-5" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300">{section.title}</span><span className="mt-0.5 block text-xs leading-5 text-slate-500 dark:text-slate-400">{section.description}</span></span><ChevronRight className="size-4 shrink-0 text-slate-400" /></Link>; })}</div>
    </section>
  </div>;
}
