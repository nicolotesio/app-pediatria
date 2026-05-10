import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { resources } from "@/data/resources";

export default function ResourcesPage() {
  return (
    <div className="pb-16">
      <SectionHeader title="RISORSE" />
      <div className="grid gap-4 lg:grid-cols-2">
        {resources.map((resource) => (
          <Card
            key={resource.id}
            title={resource.title}
            description={resource.description}
            meta={
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="blue">{resource.category}</Badge>
                <ExternalLink className="size-4 text-slate-400" />
              </div>
            }
          >
            <a href={resource.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-700 hover:text-blue-900 dark:text-blue-300">
              Apri risorsa
            </a>
            {resource.personalNote ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Nota personale: {resource.personalNote}</p> : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
