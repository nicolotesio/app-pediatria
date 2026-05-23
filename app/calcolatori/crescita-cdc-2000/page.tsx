import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";
import { CdcGrowthCalculator } from "@/components/calculators/CdcGrowthCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function CdcGrowthPage() {
  return (
    <div className="grid gap-2 pb-16">
      <SectionHeader
        title="Curve CDC 2000"
        description="Valutazione antropometrica secondo i riferimenti CDC 2000 per la popolazione pediatrica statunitense di età 2–20 anni."
      />
      <CdcGrowthCalculator />
      <Link
        href="/feedback"
        className="mt-3 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-950 shadow-sm transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100 dark:hover:bg-blue-950"
      >
        <MessageSquarePlus className="size-5 shrink-0" />
        <span className="text-sm font-semibold">Segnala errori, invia feedback o idee per nuovi contenuti</span>
      </Link>
    </div>
  );
}
