import { Calculator, ChartSpline, Droplets, PencilRuler } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";

const calculators = [
  { title: "INTERGROWTH-21st", href: "/calcolatori/intergrowth-21", description: "Valutazione antropometrica neonatale secondo gli standard internazionali INTERGROWTH-21st.", icon: PencilRuler },
  { title: "WHO Child Growth Standards", href: "/calcolatori/crescita-who-0-5", description: "Valutazione antropometrica secondo gli standard internazionali WHO per bambini da 0 a 5 anni.", icon: ChartSpline },
  { title: "Curve SIEDP 2006", href: "/calcolatori/crescita-siedp-2006", description: "Valutazione antropometrica secondo i riferimenti SIEDP 2006 per la popolazione italiana di età 2–20 anni.", icon: ChartSpline },
  { title: "Curve CDC 2000", href: "/calcolatori/crescita-cdc-2000", description: "Valutazione antropometrica secondo i riferimenti CDC 2000 per la popolazione pediatrica statunitense di età 2–20 anni.", icon: ChartSpline },
  { title: "Terapia infusionale di supporto", href: "/calcolatori/terapia-infusionale-supporto", description: "Stima orientativa del mantenimento idrico EV pediatrico con alert di sicurezza e monitoraggio.", icon: Droplets },
  { title: "Superficie corporea", description: "Formula da selezionare e validare.", icon: Calculator, unavailable: true },
  { title: "eGFR pediatrico", description: "Formula e unita di creatinina da configurare.", icon: Calculator, unavailable: true },
  { title: "Sodio corretto", description: "Formula da configurare con fonte.", icon: Calculator, unavailable: true }
];

export default function CalculatorsPage() {
  return (
    <div className="pb-16">
      <SectionHeader title="CALCOLATORI" />
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
          >
            {calculator.unavailable ? <Badge tone="amber">Non disponibile</Badge> : null}
          </Card>
          );
        })}
      </div>
    </div>
  );
}
