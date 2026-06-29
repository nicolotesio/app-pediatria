import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TscDiagnosticCriteria } from "@/components/notes/TscDiagnosticCriteria";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBox } from "@/components/ui/SourceBox";

export default function TscDiagnosticCriteriaPage() {
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
        title="Criteri diagnostici per sclerosi tuberosa"
        description="Criteri diagnostici dell'International Tuberous Sclerosis Complex, adattati da Northrup et al. 2021."
      />
      <TscDiagnosticCriteria />
      <SourceBox
        title="Riferimenti bibliografici"
        source="Northrup H, Aronow ME, Bebin EM, et al. Updated international tuberous sclerosis complex diagnostic criteria and surveillance and management recommendations. Pediatr Neurol. 2021;123:50-66."
        updatedAt="2026-06-29"
      />
    </div>
  );
}
