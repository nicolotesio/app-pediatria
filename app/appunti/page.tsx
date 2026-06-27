import { Dna } from "lucide-react";
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
      </section>
    </div>
  );
}
