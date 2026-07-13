import { WhoGrowthCalculator } from "@/components/calculators/WhoGrowthCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function WhoGrowthPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader
        title="WHO Child Growth Standards"
        description="Valutazione antropometrica secondo gli standard internazionali WHO per bambini da 0 a 5 anni."
      />
      <WhoGrowthCalculator />
    </div>
  );
}
