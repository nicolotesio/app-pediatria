import { EmergencyDrugsCalculator } from "@/components/calculators/EmergencyDrugsCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function EmergencyDrugsPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader title="FARMACI IN EMERGENZA" />
      <EmergencyDrugsCalculator />
    </div>
  );
}
