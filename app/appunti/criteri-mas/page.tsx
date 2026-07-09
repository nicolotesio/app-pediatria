import { MasCriteria } from "@/components/notes/MasCriteria";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBox } from "@/components/ui/SourceBox";

export default function MasCriteriaPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader
        title="Criteri MAS"
        description="Criteri classificativi 2016 per sospetta sindrome da attivazione macrofagica in AIG sistemica."
      />
      <MasCriteria />
      <SourceBox
        title="Riferimenti bibliografici"
        source="Ravelli A, Minoia F, Davi S, et al. 2016 Classification Criteria for Macrophage Activation Syndrome Complicating Systemic Juvenile Idiopathic Arthritis. Ann Rheum Dis / Arthritis Rheumatol. 2016."
        updatedAt="2026-07-09"
      />
    </div>
  );
}
