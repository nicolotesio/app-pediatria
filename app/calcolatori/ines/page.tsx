import { InesBirthCalculator } from "@/components/calculators/InesBirthCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function InesBirthPage() {
  return (
    <div className="grid gap-2 pb-16">
      <SectionHeader
        title="INeS"
        description="Valutazione auxologica neonatale secondo le carte INeS, sviluppate sulla popolazione neonatale italiana."
      />
      <InesBirthCalculator />
    </div>
  );
}
