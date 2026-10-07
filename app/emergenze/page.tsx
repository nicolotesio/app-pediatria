import { Brain, Stethoscope, Syringe } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function EmergenciesPage() {
  return (
    <div className="grid gap-5">
      <SectionHeader title="Emergenze" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          href="/emergenze/wetflag"
          title="WETFLAG"
          inlineHeader
          compact
          meta={<Stethoscope className="size-6 text-blue-700 dark:text-blue-300" />}
        />
        <Card
          href="/emergenze/gcs-pediatrico"
          title="GCS pediatrico"
          inlineHeader
          compact
          meta={<Brain className="size-6 text-blue-700 dark:text-blue-300" />}
        />
        <Card
          href="/emergenze/farmaci"
          title="Farmaci in emergenza"
          inlineHeader
          compact
          meta={<Syringe className="size-6 text-blue-700 dark:text-blue-300" />}
        />
      </div>
    </div>
  );
}
