import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function NotesPage() {
  return (
    <div className="grid gap-6 pb-16">
      <SectionHeader title="APPUNTI" />
      <EmptyState
        title="Ci stiamo lavorando"
        description="La sezione appunti sara disponibile prossimamente."
      />
    </div>
  );
}
