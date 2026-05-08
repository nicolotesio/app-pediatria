import { WetflagCalculator } from "@/components/calculators/WetflagCalculator";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { WarningBox } from "@/components/ui/WarningBox";
import { Badge } from "@/components/ui/Badge";

export default function EmergenciesPage() {
  return (
    <div className="grid gap-8 pb-16">
      <SectionHeader
        eyebrow="Emergenze"
        title="Strumenti di supporto clinico"
        description="Verificare sempre dosi, linee guida locali e condizioni del paziente."
      />
      <WarningBox>
        Strumenti di supporto clinico. Verificare sempre dosi, linee guida locali e condizioni del paziente.
      </WarningBox>
      <WetflagCalculator />
      <Card
        title="Dosi farmaci emergenza secondo algoritmi PALS"
        description="Placeholder intenzionale: dosaggi e algoritmi non configurati. Aggiungere solo tabelle validate, fonti, data di aggiornamento, range e controlli."
        meta={<Badge tone="amber">Non configurato</Badge>}
      />
    </div>
  );
}
