import { Brain, Stethoscope, Syringe } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function EmergenciesPage() {
  return (
    <div className="pb-16">
      <SectionHeader title="EMERGENZE" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          href="/emergenze/wetflag"
          title="WETFLAG"
          description="Stime rapide per emergenza pediatrica."
          inlineHeader
          meta={<Stethoscope className="size-6 text-blue-700 dark:text-blue-300" />}
        />
        <Card
          href="/emergenze/gcs-pediatrico"
          title="GCS pediatrico rapido"
          description="Calcolo rapido della Glasgow Coma Scale pediatrica."
          inlineHeader
          meta={<Brain className="size-6 text-blue-700 dark:text-blue-300" />}
        />
        <Card
          href="/emergenze/farmaci"
          title="Farmaci in emergenza"
          description="Dosi e preparazioni per farmaci usati in emergenza."
          inlineHeader
          meta={<Syringe className="size-6 text-blue-700 dark:text-blue-300" />}
        />
      </div>
    </div>
  );
}
