import { MaintenanceFluidsCalculator } from "@/components/calculators/MaintenanceFluidsCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function MaintenanceFluidsPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader
        title="Terapia infusionale di mantenimento"
        description="Calcolo del mantenimento idrico secondo la formula di Holliday–Segar."
      />
      <MaintenanceFluidsCalculator />
    </div>
  );
}
