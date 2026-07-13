import { Ambulance, Baby, BookOpenText, Calculator, ExternalLink, Info } from "lucide-react";
import { HomeSearchBox } from "@/components/HomeSearchBox";
import { Card } from "@/components/ui/Card";

const sections = [
  { title: "Emergenze", href: "/emergenze", icon: Ambulance },
  { title: "Calcolatori", href: "/calcolatori", icon: Calculator },
  { title: "Appunti", href: "/appunti", icon: BookOpenText },
  { title: "Risorse", href: "/risorse", icon: ExternalLink },
  { title: "Genitori", href: "/genitori", icon: Baby },
  { title: "Informazioni", href: "/informazioni", icon: Info }
];

export default function HomePage() {
  return (
    <div className="grid gap-4 pb-4 sm:gap-5 sm:pb-8">
      <HomeSearchBox />
      <section className="grid gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.href}
              href={section.href}
              title={section.title}
              inlineHeader
              align="center"
              compact
              meta={<Icon className="size-6 text-blue-700 dark:text-blue-300" />}
            />
          );
        })}
      </section>
    </div>
  );
}
