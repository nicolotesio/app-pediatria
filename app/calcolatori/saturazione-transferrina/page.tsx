import { TransferrinSaturationCalculator } from "@/components/calculators/TransferrinSaturationCalculator";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function TransferrinSaturationPage() {
  return <div className="grid gap-5 pb-16"><SectionHeader title="Saturazione della transferrina" description="Calcolo della percentuale di saturazione da sideremia e transferrina." /><TransferrinSaturationCalculator /></div>;
}
