import { Baby, BookOpenText, Calculator, ExternalLink, LifeBuoy } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

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
    <div className="pb-16">
      <section className="py-6">
        <SectionHeader
          eyebrow="Dr Nicolò Tesio"
          title="Appunti di Pediatria"
          description="Webapp personale per appunti, risorse e strumenti clinici pediatrici. Progettata per essere chiara, aggiornable, prudente sulle fonti e pronta a crescere senza backend complesso."
        />
      </section>
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
      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Info</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Questa webapp è un progetto personale di Dr Nicolò Tesio, pensato per avere rapidamente a disposizione informazioni e tool clinici utili nella pratica pediatrica.
        </p>
      </section>
    </div>
  );
}
