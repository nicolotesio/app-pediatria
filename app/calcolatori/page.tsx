import { Calculator, ChartSpline, Droplets, PencilRuler, Ruler } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

const auxologyCalculators = [
  { title: "INTERGROWTH-21st", href: "/calcolatori/intergrowth-21", description: "Valutazione antropometrica neonatale secondo gli standard internazionali INTERGROWTH-21st.", icon: PencilRuler },
  { title: "INeS", href: "/calcolatori/ines", description: "Valutazione auxologica neonatale secondo le carte INeS, sviluppate sulla popolazione neonatale italiana.", icon: PencilRuler },
  { title: "WHO Child Growth Standards", href: "/calcolatori/crescita-who-0-5", description: "Valutazione antropometrica secondo gli standard internazionali WHO per bambini da 0 a 5 anni.", icon: ChartSpline },
  { title: "Curve SIEDP 2006", href: "/calcolatori/crescita-siedp-2006", description: "Valutazione antropometrica secondo i riferimenti SIEDP 2006 per la popolazione italiana di età 2-20 anni.", icon: ChartSpline },
  { title: "Curve CDC 2000", href: "/calcolatori/crescita-cdc-2000", description: "Valutazione antropometrica secondo i riferimenti CDC 2000 per la popolazione pediatrica statunitense di età 2-20 anni.", icon: ChartSpline },
  { title: "Altezza bersaglio", href: "/calcolatori/altezza-bersaglio", description: "Stima dell'altezza geneticamente attesa e del range familiare.", icon: Ruler },
  { title: "Velocità di crescita", href: "/calcolatori/velocita-crescita", description: "Calcolo della velocità staturale tra due misurazioni.", icon: ChartSpline }
];

const generalCalculators = [
  { title: "Terapia infusionale di supporto", href: "/calcolatori/terapia-infusionale-supporto", description: "Stima orientativa del mantenimento idrico EV pediatrico con alert di sicurezza e monitoraggio.", icon: Droplets },
  { title: "Superficie corporea", href: "/calcolatori/superficie-corporea", description: "BSA con formule Mosteller, Du Bois e Haycock.", icon: Calculator },
  { title: "eGFR pediatrico", href: "/calcolatori/egfr-pediatrico", description: "Stima del filtrato glomerulare con formula di Schwartz.", icon: Calculator }
];

type CalculatorItem = (typeof auxologyCalculators)[number];

export default function CalculatorsPage() {
  return (
    <div className="grid gap-8 pb-16">
      <SectionHeader title="CALCOLATORI" />
      <CalculatorSection title="Auxologia" calculators={auxologyCalculators} />
      <CalculatorSection title="Altri calcolatori" calculators={generalCalculators} />
    </div>
  );
}

function CalculatorSection({ title, calculators }: { title: string; calculators: CalculatorItem[] }) {
  return (
    <section className="grid gap-4">
      <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {calculators.map((calculator) => {
          const Icon = calculator.icon;
          return (
            <Card
              key={calculator.title}
              href={calculator.href}
              title={calculator.title}
              description={calculator.description}
              inlineHeader
              meta={<Icon className="size-6 text-blue-700 dark:text-blue-300" />}
            />
          );
        })}
      </div>
    </section>
  );
}
