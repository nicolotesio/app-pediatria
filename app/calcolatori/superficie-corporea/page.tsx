import { BodySurfaceAreaCalculator } from "@/components/calculators/BodySurfaceAreaCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function BodySurfaceAreaPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader
        title="Superficie corporea"
        description="Calcolo della BSA con formule pediatriche e tradizionali."
      />
      <BodySurfaceAreaCalculator />
    </div>
  );
}
