import { MaintenanceFluidsCalculator } from "@/components/calculators/MaintenanceFluidsCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function MaintenanceFluidsPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader
        title="Terapia infusionale di supporto"
        description="Stima del mantenimento idrico EV pediatrico secondo Holliday-Segar, con restrizioni orientative, alert di sicurezza e monitoraggio."
      />
      <MaintenanceFluidsCalculator />
    </div>
  );
}
