import { PediatricEgfrCalculator } from "@/components/calculators/PediatricEgfrCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function PediatricEgfrPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader
        title="eGFR pediatrico"
        description="Stima del filtrato glomerulare con formula di Schwartz."
      />
      <PediatricEgfrCalculator />
    </div>
  );
}
