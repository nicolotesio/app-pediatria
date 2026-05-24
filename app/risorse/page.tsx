import { ExternalLink, Headphones, Newspaper, Stethoscope, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { resources, type Resource } from "@/data/resources";

const categoryMeta: Record<string, { title: string; icon: React.ComponentType<{ className?: string }>; tone: "blue" | "amber" | "slate" | "red" }> = {
  Strumenti: { title: "Strumenti", icon: Stethoscope, tone: "blue" },
  "Siti e newsletter": { title: "Siti e newsletter", icon: Newspaper, tone: "amber" },
  Podcast: { title: "Podcast", icon: Headphones, tone: "red" },
  Neonatologia: { title: "Neonatologia", icon: TrendingUp, tone: "slate" }
};

const categoryOrder = ["Strumenti", "Siti e newsletter", "Podcast", "Neonatologia"];
const resourceOrder: Record<string, string[]> = {};

export default function ResourcesPage() {
  const groupedResources = categoryOrder
    .map((category) => ({
      category,
      resources: sortResources(category, resources.filter((resource) => resource.category === category))
    }))
    .filter((group) => group.resources.length > 0);

  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader title="RISORSE" />
      <div className="grid gap-4">
        {groupedResources.map((group) => (
          <ResourceGroup key={group.category} category={group.category} resources={group.resources} />
        ))}
      </div>
    </div>
  );
}

function sortResources(category: string, items: Resource[]) {
  const order = resourceOrder[category] ?? [];
  return [...items].sort((a, b) => {
    const aIndex = order.indexOf(a.id);
    const bIndex = order.indexOf(b.id);
    if (aIndex >= 0 || bIndex >= 0) {
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    }
    return 0;
  });
}

function ResourceGroup({ category, resources }: { category: string; resources: Resource[] }) {
  const meta = categoryMeta[category] ?? { title: category, icon: ExternalLink, tone: "slate" as const };
  const Icon = meta.icon;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Icon className="size-5 text-blue-700 dark:text-blue-300" />
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{meta.title}</h2>
        </div>
        <Badge tone={meta.tone}>{resources.length}</Badge>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {resources.map((resource) => (
          <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer" className="block py-3 first:pt-0 last:pb-0 hover:text-blue-800 dark:hover:text-blue-200">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold leading-5 text-slate-950 dark:text-white">{resource.title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{resource.description}</p>
                {resource.personalNote ? <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Nota: {resource.personalNote}</p> : null}
              </div>
              <ExternalLink className="mt-0.5 size-4 shrink-0 text-slate-400" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
