import { SearchPageClient } from "@/components/SearchPageClient";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function SearchPage() {
  return (
    <div className="pb-16">
      <SectionHeader
        eyebrow="Ricerca"
        title="Ricerca globale"
        description="Ricerca semplice su appunti, risorse e schede genitori."
      />
      <SearchPageClient />
    </div>
  );
}
