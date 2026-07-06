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
    </div>
  );
}
