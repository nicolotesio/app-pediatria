import { Calculator, Syringe } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";

export default function EmergenciesPage() {
  return (
    <div className="pb-16">
      <SectionHeader title="EMERGENZE" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          href="/emergenze/wetflag"
          title="Calcolatore WETFLAG"
          description="Stime rapide per emergenza pediatrica."
          inlineHeader
          meta={<Calculator className="size-6 text-blue-700 dark:text-blue-300" />}
        />
        <Card
          href="/emergenze/farmaci"
          title="Calcolatore farmaci in emergenza"
          description="Dosi e preparazioni per farmaci usati in emergenza."
          inlineHeader
          meta={
            <div className="flex items-center gap-2">
              <Syringe className="size-6 text-blue-700 dark:text-blue-300" />
              <Badge tone="amber">In preparazione</Badge>
            </div>
          }
        />
      </div>
    </div>
  );
}
