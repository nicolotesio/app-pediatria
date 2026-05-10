import { SearchPageClient } from "@/components/SearchPageClient";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function SearchPage() {
  return (
    <div className="pb-16">
      <SectionHeader title="CERCA" />
      <SearchPageClient />
    </div>
  );
}
