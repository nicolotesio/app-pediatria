import { Nf1DiagnosticCriteria } from "@/components/notes/Nf1DiagnosticCriteria";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBox } from "@/components/ui/SourceBox";

export default function Nf1DiagnosticCriteriaPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader
        title="Criteri diagnostici per NF1"
        description="Criteri diagnostici revisionati per neurofibromatosi tipo 1, adattati da Legius et al. 2021."
      />
      <Nf1DiagnosticCriteria />
      <SourceBox
        title="Riferimenti bibliografici"
        source="Legius E, Messiaen L, Wolkenstein P, et al. Revised diagnostic criteria for neurofibromatosis type 1 and Legius syndrome: an international consensus recommendation. Genetics in Medicine. 2021."
        updatedAt="2026-06-27"
      />
    </div>
  );
}
