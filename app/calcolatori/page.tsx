import { Calculator } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";

const calculators = [
  { title: "WETFLAG", status: "Disponibile", href: "/emergenze", description: "Stime rapide per emergenza pediatrica." },
  { title: "Centili nascita INTERGROWTH-21st", status: "Dataset non ancora configurato", description: "Interfaccia pronta, dataset assente." },
  { title: "Curve WHO 0-2 anni", status: "Dataset non ancora configurato", description: "In attesa di dataset ufficiale validato." },
  { title: "Curve CDC 2-18 anni", status: "Dataset non ancora configurato", description: "In attesa di dataset ufficiale validato." },
  { title: "BMI pediatrico", status: "Non configurato", description: "Richiede curve/percentili validati." },
  { title: "Superficie corporea", status: "Non configurato", description: "Formula da selezionare e validare." },
  { title: "eGFR pediatrico", status: "Non configurato", description: "Formula e unita di creatinina da configurare." },
  { title: "Sodio corretto", status: "Non configurato", description: "Formula da configurare con fonte." }
];

export default function CalculatorsPage() {
  return (
    <div className="pb-16">
      <SectionHeader
        eyebrow="Calcolatori"
        title="Calcolatori clinici"
        description="Elenco degli strumenti disponibili e futuri. I calcolatori senza dati validati mostrano chiaramente che il dataset non e configurato."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calculator) => (
          <Card
            key={calculator.title}
            href={calculator.href}
            title={calculator.title}
            description={calculator.description}
            meta={
              <div className="flex items-center justify-between gap-3">
                <Calculator className="size-5 text-teal-700 dark:text-teal-300" />
                <Badge tone={calculator.status === "Disponibile" ? "teal" : "amber"}>{calculator.status}</Badge>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}
