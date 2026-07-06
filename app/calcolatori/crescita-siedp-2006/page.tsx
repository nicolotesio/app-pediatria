import { SiedpGrowthCalculator } from "@/components/calculators/SiedpGrowthCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function SiedpGrowthPage() {
  return (
    <div className="grid gap-2 pb-16">
      <SectionHeader
        title="Curve SIEDP 2006"
        description="Valutazione antropometrica secondo i riferimenti SIEDP 2006 per la popolazione italiana di età 2–20 anni."
      />
      <SiedpGrowthCalculator />
    </div>
  );
}
