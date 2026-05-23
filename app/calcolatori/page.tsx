import { Calculator, ChartSpline, PencilRuler } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";

const calculators = [
  { title: "Curve SIEDP 2006", href: "/calcolatori/crescita-siedp-2006", description: "Valutazione peso, altezza e BMI per la popolazione italiana dai 2 ai 20 anni.", icon: ChartSpline },
  { title: "Centili nascita INTERGROWTH-21st", href: "/calcolatori/intergrowth-21", description: "Valutazione auxologica neonatale con standard internazionali INTERGROWTH-21st.", icon: PencilRuler },
  { title: "Curve WHO 0-5 anni", href: "/calcolatori/crescita-who-0-5", description: "Valutazione auxologica pediatrica secondo gli standard WHO Child Growth Standards da 0 a 5 anni.", icon: ChartSpline },
  { title: "Curve CDC 2000", href: "/calcolatori/crescita-cdc-2000", description: "Valutazione di peso, statura e BMI secondo le curve CDC 2000 dai 2 ai 20 anni.", icon: ChartSpline },
  { title: "BMI pediatrico", description: "Richiede curve/percentili validati.", icon: Calculator, unavailable: true },
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
