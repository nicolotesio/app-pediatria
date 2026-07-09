import { GrowthVelocityCalculator } from "@/components/calculators/GrowthVelocityCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function GrowthVelocityPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader
        title="Velocità di crescita"
        description="Calcolo della velocità staturale tra due misurazioni."
      />
      <GrowthVelocityCalculator />
    </div>
  );
}
