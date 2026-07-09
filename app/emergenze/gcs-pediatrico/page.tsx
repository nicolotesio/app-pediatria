import { PediatricGcsCalculator } from "@/components/calculators/PediatricGcsCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function PediatricGcsPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader
        title="GCS pediatrico rapido"
        description="Calcolo rapido della Glasgow Coma Scale pediatrica."
      />
      <PediatricGcsCalculator />
    </div>
  );
}
