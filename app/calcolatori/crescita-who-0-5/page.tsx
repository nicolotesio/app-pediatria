import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";
import { WhoGrowthCalculator } from "@/components/calculators/WhoGrowthCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function WhoGrowthPage() {
  return (
    <div className="grid gap-2 pb-16">
      <SectionHeader
        title="WHO Child Growth Standards"
        description="Valutazione antropometrica secondo gli standard internazionali WHO per bambini da 0 a 5 anni."
      />
      <WhoGrowthCalculator />
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
