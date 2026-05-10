import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function EmergencyDrugsPage() {
  return (
    <div className="grid gap-6 pb-16">
      <SectionHeader title="FARMACI IN EMERGENZA" />
      <Card title="Calcolatore in preparazione" meta={<Badge tone="amber">Non configurato</Badge>}>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          Sezione predisposta per il futuro calcolatore di posologia dei farmaci usati in emergenza.
        </p>
      </Card>
    </div>
  );
}
