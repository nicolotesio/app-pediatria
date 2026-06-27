import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nf1DiagnosticCriteria } from "@/components/notes/Nf1DiagnosticCriteria";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBox } from "@/components/ui/SourceBox";

export default function Nf1DiagnosticCriteriaPage() {
  return (
    <div className="grid gap-5 pb-16">
      <Link
        href="/appunti"
        className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
      >
        <ArrowLeft className="size-4" />
        Appunti
      </Link>
      <SectionHeader
        title="Criteri diagnostici per NF1"
        description="Criteri diagnostici revisionati per neurofibromatosi tipo 1, adattati da Legius et al. 2021."
      />
      <Nf1DiagnosticCriteria />
      <SourceBox
        title="Riferimenti bibliografici"
        source="Legius E, Messiaen L, Wolkenstein P, et al. Revised diagnostic criteria for neurofibromatosis type 1 and Legius syndrome: an international consensus recommendation. Genetics in Medicine. 2021."
        updatedAt="2026-06-27"
      />
    </div>
  );
}
