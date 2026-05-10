import { WetflagCalculator } from "@/components/calculators/WetflagCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function WetflagPage() {
  return (
    <div className="grid gap-6 pb-16">
      <SectionHeader title="WETFLAG" />
      <WetflagCalculator />
    </div>
  );
}
