import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function ParentsPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader title="GENITORI" />
      <EmptyState
        title="Ci stiamo lavorando"
        description="La sezione genitori sara disponibile prossimamente."
      />
    </div>
  );
}
