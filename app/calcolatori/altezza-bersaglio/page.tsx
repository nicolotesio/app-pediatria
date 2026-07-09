import { TargetHeightCalculator } from "@/components/calculators/TargetHeightCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function TargetHeightPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader
        title="Altezza bersaglio"
        description="Stima dell'altezza geneticamente attesa in base all'altezza dei genitori."
      />
      <TargetHeightCalculator />
    </div>
  );
}
