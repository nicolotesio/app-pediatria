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
      <section className="grid gap-8 py-6 lg:grid-cols-[1fr_24rem] lg:items-end">
        <SectionHeader
          eyebrow="di Dr Nicolò Tesio"
          title="Appunti di Pediatria"
          description="Webapp personale per appunti, risorse e strumenti clinici pediatrici. Progettata per essere chiara, aggiornable, prudente sulle fonti e pronta a crescere senza backend complesso."
        />
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-5 text-sm leading-6 text-teal-950 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-100">
          Ogni calcolo clinico deve includere unita, fonte, data di aggiornamento e avviso di verifica. I dataset non validati restano esplicitamente non configurati.
        </div>
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
              meta={<Icon className="size-6 text-teal-700 dark:text-teal-300" />}
            />
          );
        })}
      </section>
    </div>
  );
}
