import { Baby, BookOpenText, Calculator, ExternalLink, LifeBuoy } from "lucide-react";
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
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Questa webapp è un progetto personale di Dr Nicolò Tesio, pensato per avere rapidamente a disposizione informazioni e tool clinici utili nella pratica pediatrica.
        </p>
      </section>
    </div>
  );
}
