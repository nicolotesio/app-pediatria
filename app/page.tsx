import { Baby, BookOpenText, Calculator, ExternalLink, Info, LifeBuoy } from "lucide-react";
import { HomeSearchBox } from "@/components/HomeSearchBox";
import { Card } from "@/components/ui/Card";

const sections = [
  {
    title: "Emergenze",
    description: "Strumenti clinici rapidi con fonti, unita, range e avvisi di sicurezza.",
    href: "/emergenze",
    icon: LifeBuoy
  },
  {
    title: "Calcolatori",
    description: "Calcolatori disponibili e placeholder per dataset non ancora configurati.",
    href: "/calcolatori",
    icon: Calculator
  },
  {
    title: "Appunti",
    description: "Note cliniche modificabili, organizzate per categoria, tag e fonti.",
    href: "/appunti",
    icon: BookOpenText
  },
  {
    title: "Risorse",
    description: "Link utili e note personali per consultazione rapida.",
    href: "/risorse",
    icon: ExternalLink
  },
  {
    title: "Genitori",
    description: "Schede semplici per comunicazione e counselling.",
    href: "/genitori",
    icon: Baby
  },
  {
    title: "Informazioni",
    description: "Dettagli sul progetto, feedback e note di utilizzo.",
    href: "/informazioni",
    icon: Info
  }
];

export default function HomePage() {
  return (
    <div className="grid gap-5 pb-16">
      <HomeSearchBox />
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.href}
              href={section.href}
              title={section.title}
              description={section.description}
              inlineHeader
              meta={<Icon className="size-6 text-blue-700 dark:text-blue-300" />}
            />
          );
        })}
      </section>
    </div>
  );
}
