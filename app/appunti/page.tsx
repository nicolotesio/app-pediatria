import { Dna, Flame, Pill, Syringe } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function NotesPage() {
  return (
    <div className="grid gap-6 pb-16">
      <SectionHeader
        title="APPUNTI"
        description="Schede cliniche rapide e strumenti di supporto alla consultazione."
      />
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          href="/appunti/nf1-criteri-diagnostici"
          title="Criteri diagnostici per NF1"
          description="Checklist interattiva dei criteri revisionati per neurofibromatosi tipo 1, con score e interpretazione diagnostica."
          inlineHeader
          meta={<Dna className="size-6 text-blue-700 dark:text-blue-300" />}
        />
        <Card
          href="/appunti/sclerosi-tuberosa-criteri-diagnostici"
          title="Criteri diagnostici per sclerosi tuberosa"
          description="Checklist interattiva dei criteri TSC, con caratteristiche principali, minori e interpretazione diagnostica."
          inlineHeader
          meta={<Dna className="size-6 text-blue-700 dark:text-blue-300" />}
        />
        <Card
          href="/appunti/criteri-mas"
          title="Criteri MAS"
          description="Criteri laboratoristici per sospetta sindrome da attivazione macrofagica in AIG sistemica."
          inlineHeader
          meta={<Flame className="size-6 text-blue-700 dark:text-blue-300" />}
        />
        <Card
          href="/appunti/terapia-antibiotica"
          title="Terapia antibiotica"
          description="Schede antibiotiche pediatriche divise per classe, con posologia, vie di somministrazione, diluizione e note."
          inlineHeader
          meta={<Pill className="size-6 text-blue-700 dark:text-blue-300" />}
        />
        <Card
          href="/appunti/premedicazione-trasfusione"
          title="Premedicazione trasfusione"
          description="Schema rapido di premedicazione circa un'ora prima della trasfusione, con avviso di verifica dosaggi."
          inlineHeader
          meta={<Syringe className="size-6 text-blue-700 dark:text-blue-300" />}
        />
      </section>
    </div>
  );
}
