import { WetflagCalculator } from "@/components/calculators/WetflagCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function WetflagPage() {
  return (
    <div className="grid gap-2 pb-16">
      <SectionHeader title="CALCOLATORE WETFLAG" />
      <WetflagCalculator />
    </div>
  );
}
