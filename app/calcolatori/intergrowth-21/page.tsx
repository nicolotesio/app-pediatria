import { IntergrowthBirthCalculator } from "@/components/calculators/IntergrowthBirthCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function IntergrowthBirthPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader
        title="INTERGROWTH-21st"
        description="Valutazione antropometrica neonatale secondo gli standard internazionali INTERGROWTH-21st."
      />
      <IntergrowthBirthCalculator />
    </div>
  );
}
